import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { findUserByEmail } from "../services/UserServices";
import * as bcyrpt from "bcrypt";
import * as utils from "../utils";

const lodArr = require("lodash/array");

const jwt = require("jsonwebtoken");

// set environment variables from .env
dotenv.config();

const resolvers = {
  Mutation: {
    createUser: async (parent, args, context, info) => {
      try {
        const findCypher = "MATCH (n: User {email: $email}) RETURN n";
        const findParams = {
          email: args.email,
        };

        // Try to find existing user with this email
        const existingUser = await (await context.driver.session()).run(
          findCypher,
          findParams
        );

        if (existingUser.records.length > 0) {
          // This email already exists. Return with error.
          return {
            user: [],
            error: {
              message: "Email is already in use",
            },
            code: "ER_NODE_EXISTS",
            operation: "OP_CREATE_USER",
            status: "NOT_COMPLETE",
          };
        }

        const saltRounds = 10;
        const hashedPassword = await bcyrpt.hash(args.password, saltRounds);

        const createCypher =
          "CREATE (n:User {_id: $_id, name: $name, email: $email, password: $password}) RETURN n";
        const createParams = {
          _id: uuidv4(),
          name: args.name,
          email: args.email,
          password: hashedPassword,
        };

        await (await context.driver.session()).run(createCypher, createParams);
        return {
          user: [createParams],
          error: null,
          code: "OK",
          operation: "OP_CREATE_USER",
          status: "OK",
        };
      } catch (err) {
        return {
          user: [],
          error: {
            message: "An error occurred",
          },
          code: "ER_SERVER",
          operation: "OP_CREATE_USER",
          status: "NOT_COMPLETE",
        };
      }
    },

    createSpace: async (parent, args, context, info) => {
      try {
        const createCypher =
          "CREATE (n:Space {_id: $_id, name: $name}) RETURN n";
        const createParams = {
          _id: uuidv4(),
          name: args.name,
        };

        await (await context.driver.session()).run(createCypher, createParams);
        return {
          error: null,
          code: "OK",
          operation: "OP_CREATE_SPACE",
          status: "OK",
        };
      } catch (err) {
        console.error(err);
        return {
          error: {
            message: "An error occurred",
          },
          code: "ER_SERVER",
          operation: "OP_CREATE_SPACE",
          status: "NOT_COMPLETE",
        };
      }
    },

    changeUserSpaces: async (parent, args, context, info) => {
      if (!context.user) {
        return {
          user: null,
          error: {
            message: "User is not authenticated",
          },
          code: "NOT_COMPLETE",
          operation: "OP_CHANGE_USER_SPACES",
          status: "NOT_COMPLETE",
        };
      }

      // Update user's spaces selection
      try {
        // const session = await context.driver.session();
        const user = context.user;

        const session = await context.driver.session();
        const alreadyReadingCypher = `MATCH (u:User {_id: $_id})-[r:READING_SPACE]->(s:Space) RETURN s`;
        const alreadyReadingCypherParams = {
          _id: user._id,
        };

        const alreadyReading = await session.run(
          alreadyReadingCypher,
          alreadyReadingCypherParams
        );
        const alreadyReadingSpaces = utils.formatUserSpacesData(
          alreadyReading.records
        );
        const alreadyReadingSpaceIds = alreadyReadingSpaces.map(
          (space) => space._id
        );

        // Find the newly added and deleted nodes
        const deleted = lodArr.difference(
          alreadyReadingSpaceIds,
          args.spaceIds
        );
        const added = lodArr.difference(args.spaceIds, alreadyReadingSpaceIds);

        // Create an array of promises for all deleted and added spaces
        const promises = [
          ...deleted.map(async (spaceId) => {
            const session = await context.driver.session();

            const deleteCypher = `MATCH (u: User {_id: $_id})-[r:READING_SPACE]->(s: Space {_id: $spaceId}) DELETE r`;
            const deleteParams = {
              _id: user._id,
              spaceId: spaceId,
            };

            return session.run(deleteCypher, deleteParams);
          }),
          ...added.map(async (spaceId) => {
            const session = await context.driver.session();

            const addCypher = `MATCH (u: User),(s: Space) WHERE u._id=$_id and s._id=$spaceId CREATE (u)-[r: READING_SPACE]->(s) RETURN type(r)`;
            const addParams = {
              _id: user._id,
              spaceId: spaceId,
            };

            return session.run(addCypher, addParams);
          }),
        ];

        console.log("Promise length", promises.length);
        await Promise.all(promises);

        return {
          error: null,
          code: "OK",
          operation: "OP_CHANGE_USER_SPACES",
          status: "OK",
        };
      } catch (err) {
        console.error(err);
        return {
          error: {
            message: "An error occurred",
          },
          code: "ER_SERVER",
          operation: "OP_CHANGE_USER_SPACES",
          status: "NOT_COMPLETE",
        };
      }
    },

    publishPost: async (parent, args, context, info) => {
      if (!context.user) {
        return {
          user: null,
          error: {
            message: "User is not authenticated",
          },
          code: "NOT_COMPLETE",
          operation: "OP_PUBLISH_POST",
          status: "NOT_COMPLETE",
        };
      }

      // Create a new post
      try {
        const user = context.user;

        const session = await context.driver.session();

        // Create the post
        const createPostCypher =
          "CREATE (p:Post {_id: $_id, title: $title, text: $text}) RETURN p";
        const createPostParams = {
          _id: uuidv4(),
          title: args.title,
          text: args.text,
        };

        await session.run(createPostCypher, createPostParams);

        // Relate to the user
        const createRelationCypher =
          "MATCH (u: User), (p: Post) WHERE u._id=$_userId AND p._id=$_postId CREATE (u)-[r:WROTE]->(p) RETURN type(r)";
        const createRelationParams = {
          _userId: user._id,
          _postId: createPostParams._id,
        };

        await session.run(createRelationCypher, createRelationParams);

        const promises = args.spaceIds.map(async (spaceId) => {
          // Create new session for each associated space id
          const createRelationSession = await context.driver.session();

          const createCypher =
            "MATCH (s: Space), (q: Post) WHERE s._id=$_spaceId AND q._id=$_postId CREATE (s)-[r:BELONGS_IN]->(q) RETURN type(r)";
          const createParams = {
            _postId: createPostParams._id,
            _spaceId: spaceId,
          };

          return createRelationSession.run(createCypher, createParams);
        });
        const publishResults = await Promise.all(promises);
        console.log("results", publishResults);
        return {
          error: null,
          code: "OK",
          operation: "OP_PUBLISH_POST",
          status: "OK",
        };
      } catch (err) {
        console.error(err);
        return {
          error: {
            message: "An error occurred",
          },
          code: "ER_SERVER",
          operation: "OP_PUBLISH_POST",
          status: "NOT_COMPLETE",
        };
      }
    },
  },
  Query: {
    signInUser: async (parent, args, context, info) => {
      try {
        if (context.user) {
          // User is already authenticated using the token. Return the data
          console.log("returning already loggedin user", context.user);
          return {
            user: [
              {
                ...context.user,
              },
            ],
            error: null,
            code: "OK",
            operation: "OP_SIGN_IN_USER",
            status: "OK",
          };
        }

        const user = await findUserByEmail(context, args);
        if (user.length > 0) {
          // User was found
          // Create and sign a token. Send in response.
          const userData = user[0]._fields[0].properties;
          const tokenPayload = {
            _id: userData._id,
            name: userData.name,
            email: userData.email,
          };

          const token = await jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });

          return {
            user: [tokenPayload],
            error: null,
            code: "OK",
            operation: "OP_SIGN_IN_USER",
            status: "OK",
            token: token,
          };
        } else {
          return {
            user: [],
            error: {
              message: "No user with that email was found",
            },
            code: "ER_NODE_NOT_FOUND",
            operation: "OP_SIGN_IN_USER",
            status: "NOT_COMPLETE",
          };
        }
      } catch (err) {
        console.error(err);
        return {
          user: [],
          error: {
            message: "An error occurred",
          },
          code: "ER_SERVER",
          operation: "OP_CREATE_USER",
          status: "NOT_COMPLETE",
        };
      }
    },

    getUserSpaces: async (parent, args, context, info) => {
      try {
        // Run a query to find
        // const findCypher =
        //   "MATCH p = (u)-[r:READING_SPACE]->(s) WHERE u._id=$_id RETURN nodes(p)";
        const findCypher =
          "MATCH (u:User {_id: $_id})-[r:READING_SPACE]->(s:Space) RETURN s";
        const findParams = {
          _id: context.user._id,
        };

        const result = await (await context.driver.session()).run(
          findCypher,
          findParams
        );
        const spaces = utils.formatUserSpacesData(result.records);
        // console.log("result", result.records[0]._fields);
        return {
          user: [
            {
              ...context.user,
              spaces: spaces,
            },
          ],
          error: null,
          code: "OK",
          operation: "OP_GET_USER_SPACES",
          status: "OK",
        };
      } catch (err) {
        console.log(err);
        return {
          error: {
            message: "An error occurred",
          },
          code: "ER_SERVER",
          operation: "OP_GET_USER_SPACES",
          status: "NOT_COMPLETE",
        };
      }
      // Get use from context
    },
  },
};

export default resolvers;

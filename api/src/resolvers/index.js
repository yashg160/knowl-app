import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { findUserByEmail } from "../services/UserServices";
import * as bcyrpt from "bcrypt";

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
    signInUser: async (parent, args, context, info) => {
      try {
        if (context.user) {
          // User is already authenticated using the token. Return the data
          console.log("returning already loggedin user");
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
  },
};

export default resolvers;

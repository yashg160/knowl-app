import { v4 as uuidv4 } from "uuid";

const resolvers = {
  Mutation: {
    createUser: async (parent, args, context, info) => {
      try {
        const findCypher = "MATCH (n: User {name: 'Yash Gupta'}) RETURN n";
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
            user: null,
            error: {
              message: "Email is already in use",
            },
            code: "ER_NODE_EXISTS",
            operation: "OP_CREATE_USER",
            status: "NOT_COMPLETE",
          };
        }

        const createCypher =
          "CREATE (n:User {_id: $_id, name: $name, email: $email, password: $password}) RETURN n";
        const createParams = {
          _id: uuidv4(),
          name: args.name,
          email: args.email,
          password: args.password,
        };

        await (await context.driver.session()).run(createCypher, createParams);
        return {
          user: createParams,
          error: null,
          code: "OK",
          operation: "OP_CREATE_USER",
          status: "OK",
        };
      } catch (err) {
        return {
          user: null,
          error: {
            message: "An error occurred",
          },
          code: "ER_SERVER",
          operation: "OP_CREATE_USER",
          status: "NOT_COMPLETE",
        };
      }
    },
  },
};

export default resolvers;

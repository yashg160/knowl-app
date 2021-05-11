import { v4 as uuidv4 } from "uuid";

const resolvers = {
  Mutation: {
    createUser: async (parent, args, context, info) => {
      const cypher =
        "CREATE (n:User {_id: $_id, name: $name, email: $email, password: $password}) RETURN n";
      const params = {
        _id: uuidv4(),
        name: args.name,
        email: args.email,
        password: args.password,
      };

      await (await context.driver.session()).run(cypher, params);
      return params;
    },
  },
};

export default resolvers;

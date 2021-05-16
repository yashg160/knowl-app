const jwt = require("jsonwebtoken");
import dotenv from "dotenv";

dotenv.config();

export const findUserByEmail = async (context, args) => {
  const findCypher = "MATCH (n: User {email: $email}) RETURN n";
  const findParams = {
    email: args.email,
  };

  // Try to find existing user with this email
  const users = await (await context.driver.session()).run(
    findCypher,
    findParams
  );

  return users.records;
};

export const findUserWithAuthToken = async (driver, authHeader) => {
  // Context is coming from the apollo server
  // Token is from the request headers

  if (!authHeader) {
    return {
      user: null,
    };
  }

  try {
    const token = authHeader.split(" ")[1];

    const decodedUser = await jwt.verify(token, process.env.JWT_SECRET);

    const findCypher = "MATCH (n: User {_id: $_id, email: $email}) RETURN n";
    const findParams = {
      email: decodedUser.email,
      _id: decodedUser._id,
    };

    const users = await (await driver.session()).run(findCypher, findParams);

    if (users.records.length === 0) {
      return {
        user: null,
      };
    } else {
      return {
        user: users.records[0]._fields[0].properties,
        jwt: token,
        auth: {
          isAuthenticated: true,
          jwt: token,
          roles: ["USER"],
        },
      };
    }
  } catch (err) {
    return {
      user: null,
    };
  }
};

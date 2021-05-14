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

export const findUserWithAuthToken = async (driver, token) => {
  // Context is coming from the apollo server
  // Token is from the request headers

  if (!token || !driver) {
    return {};
  }

  try {
    const decodedUser = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded", decodedUser);
    const findCypher = "MATCH (n: User {_id: $_id, email: $email}) RETURN n";
    const findParams = {
      email: decodedUser.email,
      _id: decodedUser._id,
    };

    const users = await (await driver.session()).run(findCypher, findParams);

    if (users.records.length === 0) {
      return {};
    } else {
      console.log("User found", users.records[0]._fields[0].properties);
      return {};
    }
  } catch (err) {
    return { error: err.message };
  }
};

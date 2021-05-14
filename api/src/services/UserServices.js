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

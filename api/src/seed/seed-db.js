import dotenv from "dotenv";
import neo4j from "neo4j-driver";

dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "neo4j",
    process.env.NEO4J_PASSWORD || "neo4j"
  )
);

const runMutations = async () => {
  // TODO Call queries using faker data here.
};

runMutations()
  .then(() => {
    console.log("Database seeded!");
  })
  .catch((e) => console.error(e));

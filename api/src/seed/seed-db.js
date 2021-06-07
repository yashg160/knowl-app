import faker from "faker";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import neo4j, { session } from "neo4j-driver";

dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "neo4j",
    process.env.NEO4J_PASSWORD || "neo4j"
  )
);

const spaces = [
  "Technology",
  "Business",
  "Food",
  "Travel",
  "Science",
  "Sports",
  "DIY",
  "Politics",
  "International News",
  "Relationships",
  "Entertainment",
  "Music",
  "Home Decor",
  "Designing",
  "Fashion",
  "Literature",
];

let spaceIds = [];
let globalUserIds = [];
let globalQuestionIds = [];

const runMutations = async () => {
  createSpaces()
    .then(() => createUsersAndQuestions())
    .then(() => createAnswers());
};

async function createSpaces() {
  // Create spaces
  for (let i = 0; i < spaces.length; i++) {
    const space = spaces[i];

    try {
      const session = await driver.session();
      const id = uuidv4();
      spaceIds.push(id);
      await session.run("CREATE (n:Space {_id: $id, name: $space}) RETURN n", {
        id: id,
        space: space,
      });
    } catch (err) {
      console.error(err);
    }
  }

  console.log("\nCreated Spaces!");
  console.log("\nTotal Spaces Created ----> ", spaceIds.length);
}

async function createUsersAndQuestions() {
  // Create users and associate them with spaces
  for (let i = 0; i <= 5; i++) {
    const userId = uuidv4();
    const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const email = faker.internet.email();

    globalUserIds.push(userId);

    const session = await driver.session();
    await session.run(
      "CREATE (n:User {_id: $_id, name: $name, email: $email, password: $password}) RETURN n",
      {
        _id: userId,
        name: name,
        email: email,
        password:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmNTAzMDA4ZC02M2E5LTQ2OTgtOTdjNS0wNjA1NzA0NDAwOTUiLCJuYW1lIjoiWWFzaCBHdXB0YSIsImVtYWlsIjoieWFzaGcxNjBAZ21haWwuY29tIiwiaWF0IjoxNjIyODg2NjU2LCJleHAiOjE2MjM0OTE0NTZ9.k_MfvU - t0JCqAhmvyUWUbpClfePzg5Sb3I3UU5bhamI",
      }
    );

    console.log("\nCreated New User! ----->", name, email);
    await session.close();

    let selectedSpaces = [];
    for (let j = 0; j < spaces.length; j++) {
      const spaceId = spaceIds[Math.floor(Math.random() * spaces.length)];
      if (selectedSpaces.findIndex((el) => el === spaceId) < 0) {
        selectedSpaces.push(spaceId);
      }
    }

    console.log("Selected Spaces ----->", selectedSpaces.length);
    console.log("Associating with User...");

    for (let j = 0; j < selectedSpaces.length; j++) {
      const session = await driver.session();
      await session.run(
        "MATCH (u: User),(s: Space) WHERE u._id=$_id and s._id=$spaceId CREATE (u)-[r: READING_SPACE]->(s) RETURN type(r)",
        {
          _id: userId,
          spaceId: selectedSpaces[j],
        }
      );
      await session.close();
    }
    console.log("Spaces Added to User!");

    let questionIds = [];

    // Create questions
    for (let j = 0; j < 5; j++) {
      const questionId = uuidv4();
      const questionTitle = faker.random.words(20);
      const questionText = faker.random.words(150);
      const createdOn = new Date().toISOString();

      questionIds.push(questionId);
      globalQuestionIds.push(questionId);

      const session = await driver.session();

      await session.run(
        "CREATE (p:Post {_id: $_id, title: $title, text: $text, label: $label, createdOn: $createdOn}) RETURN p",
        {
          _id: questionId,
          text: questionText,
          title: questionTitle,
          label: "question",
          createdOn: createdOn,
        }
      );

      await session.close();
    }

    // Create relationship between questions and this current user
    for (let j = 0; j < questionIds.length; j++) {
      const session = await driver.session();

      await session.run(
        "MATCH (u: User), (p: Post) WHERE u._id=$_userId AND p._id=$_postId CREATE (u)-[r:WROTE]->(p) RETURN type(r)",
        {
          _userId: userId,
          _postId: questionIds[j],
        }
      );

      await session.close();
    }

    try {
      // Relate posts to the spaces being read by the user
      for (let j = 0; j < questionIds.length; j++) {
        let associatedSpaceIds = [];

        // Select random space ids out of the ones selected by this user
        for (let k = 0; k < 3; k++) {
          const spaceId =
            selectedSpaces[Math.floor(Math.random() * selectedSpaces.length)];
          if (associatedSpaceIds.findIndex((el) => el === spaceId) < 0) {
            associatedSpaceIds.push(spaceId);
          }
        }

        // Associate the question post with random spaces
        for (let k = 0; k < associatedSpaceIds.length; k++) {
          const session = await driver.session();

          await session.run(
            "MATCH (s: Space), (q: Post) WHERE s._id=$_spaceId AND q._id=$_postId CREATE (s)-[r:BELONGS_IN]->(q) RETURN type(r)",
            {
              _postId: questionIds[j],
              _spaceId: associatedSpaceIds[k],
            }
          );

          await session.close();
        }
      }
      console.log("Question - Space Association Complete!");
    } catch (err) {
      console.error(err);
    }
  }
}

async function createAnswers() {
  console.log("\nCreating and Relating Answers...");
  try {
    // Create random answers for questions

    for (let i = 0; i < globalQuestionIds.length; i++) {
      // Create answers for each question
      for (let j = 0; j < 5; j++) {
        const answerId = uuidv4();
        const answerText = faker.random.words(200);
        const createdOn = new Date().toISOString();

        const session = await driver.session();

        await session.run(
          "CREATE (a:Answer {_id: $_id, text: $text, votes: 0, label: $label, createdOn: $createdOn}) RETURN a",
          {
            _id: answerId,
            label: "answer",
            text: answerText,
            createdOn: createdOn,
          }
        );

        const newSession1 = await driver.session();
        await newSession1.run(
          "MATCH (a: Answer), (p: Post) WHERE a._id=$_answerId AND p._id=$_postId CREATE (a)<-[r:ANSWERS]-(p) RETURN type(r)",
          {
            _postId: globalQuestionIds[i],
            _answerId: answerId,
          }
        );

        const newSession2 = await driver.session();

        await newSession2.run(
          "MATCH (a: Answer), (u: User) WHERE a._id=$_answerId AND u._id=$_userId CREATE (a)<-[r:WROTE]-(u) RETURN type(r)",
          {
            _answerId: answerId,
            _userId:
              globalUserIds[Math.floor(Math.random(globalUserIds.length - 1))],
          }
        );

        await session.close();
      }
    }

    console.log("Answers Created and Related!");
  } catch (err) {
    console.error(err);
  }
}

runMutations()
  .then(() => {
    console.log("Database seeded!");
  })
  .catch((e) => console.error(e));

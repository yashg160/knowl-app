import { gql } from "@apollo/client";

export const SIGN_IN_USER = gql`
  query SignInUser($email: String!, $password: String!) {
    signInUser(email: $email, password: $password) {
      user {
        _id
        name
      }
      error {
        message
      }
      operation
      code
      status
      token
    }
  }
`;

export const GET_SPACES = gql`
  query GetSpaces {
    spaces {
      _id
      name
    }
  }
`;

export const GET_USER_SPACES = gql`
  query GetUserSpaces {
    getUserSpaces {
      user {
        name
        email
        spaces {
          _id
          name
        }
      }
      error {
        message
      }
      code
      status
      operation
    }
  }
`;

export const GET_QUESTION = gql`
  query GetQuestion($_id: ID!) {
    posts(where: { _id: $_id }) {
      title
      text
      votes
      postedBy {
        _id
        name
      }
    }
  }
`;

export const GET_QUESTION_ANSWERS = gql`
  query GetQuestionAnswers($questionId: String!) {
    getQuestionAnswers(questionId: $questionId) {
      _id
      text
      votes
      updatedOn
      createdOn
      postedBy {
        name
      }
    }
  }
`;

export const GET_USER_RECOMMENDATIONS = gql`
  query GetUserRecommendations {
    getUserRecommendations {
      questions {
        _id
        title
        votes
        createdOn
        updatedOn
        answerCount
        spaces
        author {
          _id
          name
        }
      }
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    getUserProfile(userId: $userId) {
      _id
      name
      email
      posts {
        _id
        title
        text
        votes
      }
      answers {
        _id
        text
      }
      numPosts
      numAnswers
    }
  }
`;

import { gql } from "@apollo/client";

export const CHANGE_USER_SPACES = gql`
  mutation ChangeUserSpaces($spaceIds: [String!]) {
    changeUserSpaces(spaceIds: $spaceIds) {
      user {
        name
      }
      error {
        message
      }
      operation
      status
      code
    }
  }
`;

export const PUBLISH_POST = gql`
  mutation PublishPost($title: String!, $text: String, $spaceIds: [String!]) {
    publishPost(title: $title, text: $text, spaceIds: $spaceIds) {
      error {
        message
      }
      operation
      status
      code
    }
  }
`;

export const CREATE_ANSWER = gql`
  mutation CreateAnswer($questionId: String!, $text: String!) {
    createAnswer(questionId: $questionId, text: $text) {
      error {
        message
      }
      operation
      status
      code
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($email: String!, $name: String!) {
    updateProfile(email: $email, name: $name) {
      error {
        message
      }
      operation
      status
      code
    }
  }
`;

export const UPDATE_QUESTION = gql`
  mutation UpdateQuestion($title: String!, $text: String!, $questionId: ID!) {
    updateQuestion(title: $title, text: $text, questionId: $questionId) {
      error {
        message
      }
      operation
      status
      code
    }
  }
`;

export const UPDATE_ANSWER = gql`
  mutation UpdateAnswer($text: String!, $answerId: ID!) {
    updateAnswer(text: $text, answerId: $answerId) {
      error {
        message
      }
      operation
      status
      code
    }
  }
`;

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
      answers {
        text
      }
    }
  }
`;

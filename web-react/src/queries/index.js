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

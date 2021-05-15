import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser {
    getUser {
      user {
        name
      }
      error {
        message
      }
      operation
      code
      status
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

import { gql } from "@apollo/client";

export const GET_USER = gql`
  query getUser {
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

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

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

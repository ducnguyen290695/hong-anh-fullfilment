import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($loginRequest: LoginRequest!) {
    auth {
      login(loginRequest: $loginRequest) {
        accessToken
      }
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    auth {
      changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
    }
  }
`;

export const REQUEST_FORGET_PASSWORD_MUTATION = gql`
  mutation RequestForgetPassword($email: String!, $prefixURL: String!) {
    auth {
      requestForgetPassword(email: $email, prefixURL: $prefixURL)
    }
  }
`;
export const CONFIRM_FORGET_PASSWORD_MUTATION = gql`
  mutation ConfirmForgetPassword($secretToken: String!, $newPassword: String!) {
    auth {
      confirmForgetPassword(secretToken: $secretToken, newPassword: $newPassword)
    }
  }
`;

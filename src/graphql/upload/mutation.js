import { gql } from '@apollo/client';

export const UPLOAD_MUTATION = gql`
  mutation UploadImage($file: Upload!) {
    image {
      upload(file: $file) {
        origin
      }
    }
  }
`;

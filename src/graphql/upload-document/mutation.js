import { gql } from '@apollo/client';

export const UPLOAD_DOCUMENT_MUTATION = gql`
  mutation UploadDocument($files: [Upload!]) {
    file {
      upload(files: $files) {
        url
      }
    }
  }
`;

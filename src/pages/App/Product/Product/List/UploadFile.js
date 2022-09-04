import { gql, useMutation } from '@apollo/client';
import React from 'react';

const MUTATION = gql`
  mutation UploadImage($file: Upload!) {
    uploadImage(file: $file) {
      path
    }
  }
`;

const UploadFile = () => {
  const [mutate] = useMutation(MUTATION);

  function onChange({
    target: {
      validity,
      files: [file],
    },
  }) {
    if (validity.valid) mutate({ variables: { file } });
  }

  return <input type="file" required onChange={onChange} />;
};
export default UploadFile;

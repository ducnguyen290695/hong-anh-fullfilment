import { useMutation } from '@apollo/client';
import { UPLOAD_DOCUMENT_MUTATION } from 'graphql/upload-document/mutation';

export const useUploadDocument = () => {
  const [upload, { loading }] = useMutation(UPLOAD_DOCUMENT_MUTATION);

  const handleUpload = async ({ files }) => {
    const res = await upload({ variables: { files } });
    return res?.data?.file?.upload;
  };

  return {
    handleUpload,
    loading,
  };
};

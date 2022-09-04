import { useMutation } from '@apollo/client';
import { UPLOAD_MUTATION } from 'graphql/upload/mutation';

export const useUpload = () => {
  const [upload, { loading }] = useMutation(UPLOAD_MUTATION);

  const handleUpload = async ({ file }) => {
    const res = await upload({ variables: { file } });
    return res?.data?.image?.upload?.origin;
  };

  return {
    handleUpload,
    loading,
  };
};

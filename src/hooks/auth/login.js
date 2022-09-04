import { useMutation, useQuery } from '@apollo/client';
import { LOGIN_MUTATION } from 'graphql/auth/mutation';
import { GET_ME_QUERY } from 'graphql/auth/query';
import { useAuthToken } from 'hooks/auth/auth';

export const useLogin = () => {
  const [mutateLogin, { loading }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async (loginRequest) => {
    const fetchResult = await mutateLogin({ variables: { loginRequest } });
    const { accessToken } = fetchResult?.data?.auth?.login;
    return { accessToken };
  };

  return {
    handleLogin,
    loading,
  };
};

export function useGetMe() {
  const { token } = useAuthToken();
  // skip if no access token available
  const { loading, data, refetch } = useQuery(GET_ME_QUERY, {
    skip: !token,
  });
  return {
    loading,
    me: data?.user?.me,
    refetch,
  };
}

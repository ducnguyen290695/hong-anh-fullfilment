import { useApolloClient, useMutation } from '@apollo/client';
import { TOKEN } from 'config/constants';
import {
  CHANGE_PASSWORD_MUTATION,
  CONFIRM_FORGET_PASSWORD_MUTATION,
  REQUEST_FORGET_PASSWORD_MUTATION,
} from 'graphql/auth/mutation';

import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';

export const useAuthToken = () => {
  const [cookies, setCookie, removeCookie] = useCookies([TOKEN]);
  const setAuthToken = (authToken) => setCookie(TOKEN, authToken);
  const removeAuthToken = () => removeCookie(TOKEN);
  const token = cookies[TOKEN];
  return { token, setAuthToken, removeAuthToken };
};

export const useLogout = () => {
  const apolloClient = useApolloClient();
  const { logoutWithoutApollo } = useLogoutWithoutApollo();

  const logout = async () => {
    await apolloClient.clearStore();
    await logoutWithoutApollo();
  };

  return {
    logout,
    logoutWithoutApollo,
  };
};

export const useLogoutWithoutApollo = () => {
  const { removeAuthToken } = useAuthToken();
  const history = useHistory();
  const logoutWithoutApollo = async () => {
    await removeAuthToken();
    history?.push({
      pathname: '/login',
    });
  };

  return {
    logoutWithoutApollo,
  };
};

export const useChangePassword = () => {
  const [mutate, { loading }] = useMutation(CHANGE_PASSWORD_MUTATION);
  const handleChangePassword = async (params) => {
    await mutate({
      variables: params,
    });
  };

  return {
    loading,
    handleChangePassword,
  };
};
export const useRequestForgetPassword = () => {
  const [mutate, { loading }] = useMutation(REQUEST_FORGET_PASSWORD_MUTATION);
  const handleRequestForgetPassword = async (params) => {
    await mutate({
      variables: params,
    });
  };

  return {
    loading,
    handleRequestForgetPassword,
  };
};

export function useConfirmForgetPassword() {
  const [mutate, { loading }] = useMutation(CONFIRM_FORGET_PASSWORD_MUTATION);

  const handleConfirmForgetPassword = async (params) => {
    await mutate({
      variables: params,
    });
  };
  return {
    loading,
    handleConfirmForgetPassword,
  };
}

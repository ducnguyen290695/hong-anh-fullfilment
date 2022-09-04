import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client/public/index';
import { BASE_GRAPHQL_URL } from 'config/apiUrls';
import { useAuthToken, useLogoutWithoutApollo } from 'hooks/auth/auth';

const STATUS_UNAUTHENTICATED = 401;

const DEFAULT_OPTIONS = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

const httpLink = createUploadLink({
  uri: BASE_GRAPHQL_URL,
});

const cache = new InMemoryCache({});

const authMiddleware = (authToken) =>
  new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    if (authToken) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });
    }

    return forward(operation);
  });

export const useAppApolloClient = () => {
  const { token: authToken } = useAuthToken();
  const { logoutWithoutApollo } = useLogoutWithoutApollo();

  const apolloClient = new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (networkError) {
          if (networkError.statusCode === STATUS_UNAUTHENTICATED) {
            logoutWithoutApollo().then(() => {
              console.log('401, do log out');
            });
            // fallback to graphql error if existed
            if (graphQLErrors && graphQLErrors.length > 0) {
              networkError.message = graphQLErrors[0]?.message;
            }
          }
          console.log(`[Network error]: ${networkError.statusCode}`);
        }

        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        }
      }),
      authMiddleware(authToken).concat(httpLink),
    ]),
    cache,
    defaultOptions: DEFAULT_OPTIONS,
  });
  return { apolloClient };
};

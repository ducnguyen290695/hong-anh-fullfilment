import { MockedProvider } from '@apollo/client/testing';
import { renderHook } from '@testing-library/react-hooks';

function useGetHookWrapper(mocks = [], hookQuery, params = undefined) {
  const wrapper = ({ children }) => (
    <MockedProvider mocks={mocks} addTypename={false}>
      {children}
    </MockedProvider>
  );

  const { result, waitForNextUpdate } = renderHook(
    () => (params ? hookQuery(params) : hookQuery()),
    { wrapper }
  );
  // Test the initial state of the request

  // eslint-disable-next-line no-undef
  expect(result.current.loading).toBeTruthy();
  // eslint-disable-next-line no-undef
  expect(result.current.data).toBeUndefined();
  return { result, waitForNextUpdate };
}

export default useGetHookWrapper;

import { useAuthToken } from 'hooks/auth/auth';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { token } = useAuthToken();
  return (
    <Route
      {...rest}
      render={(props) =>
        token ? (
          <Component key={props.match.params.id || 'empty'} {...props} />
        ) : (
          <Redirect to={'/login'} />
        )
      }
    />
  );
};

export default PrivateRoute;

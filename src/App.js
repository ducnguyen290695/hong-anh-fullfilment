import { ApolloProvider } from '@apollo/client';
import PrivateRoute from 'components/PrivateRoute';
import { useAppApolloClient } from 'hooks/apollo/apollo';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.less';
import routes from './config/routes';

function App() {
  const { apolloClient } = useAppApolloClient();

  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <Switch>
          {routes?.map((item, index) => {
            if (item?.checkAuth) {
              return <PrivateRoute key={index} {...item} />;
            } else {
              return <Route key={index} {...item} />;
            }
          })}
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;

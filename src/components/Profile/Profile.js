import React from 'react';
import { withRouter } from 'react-router';
import { AUTH_TOKEN } from '../../constants';
import { withApollo } from 'react-apollo';

function Profile({ history, onLogin, client }) {
  return (
    <div className="flex flex-column h-100 justify-center items-center ph3 center w-50-ns">
      <button
        className="w-100 bw0 pa2 mb3 white bg-green"
        onClick={() => {
          localStorage.removeItem(AUTH_TOKEN);
          client.resetStore();
          onLogin(false);
          history.push({ pathname: '/login' });
        }}
      >
        Logout
      </button>
    </div>
  )
}

export default withApollo(withRouter(Profile));

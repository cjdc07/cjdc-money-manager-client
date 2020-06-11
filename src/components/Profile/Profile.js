import React from 'react';
import { AUTH_TOKEN } from '../../constants';
import { GoogleLogout } from 'react-google-login';
import { withRouter } from 'react-router';
import { withApollo } from 'react-apollo';

function Profile({ history, onLogin, client }) {
  const logout = (response) => {
    localStorage.removeItem(AUTH_TOKEN);
    client.resetStore();
    onLogin(false);
    history.push({ pathname: '/login' });
  }

  return (
    <div className="flex flex-column h-100 justify-center items-center ph3 center w-50-ns">
      <GoogleLogout
        clientId={process.env.REACT_APP_GMAIL_CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={logout}
        onFailure={logout}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className="w-100 bw0 pa2 mb3 white bg-green"
          >
            Logout
          </button>
        )}
      >
      </GoogleLogout>
    </div>
  )
}

export default withApollo(withRouter(Profile));

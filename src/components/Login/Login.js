import React, {useState, useRef } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { GoogleLogin } from 'react-google-login';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { withRouter } from 'react-router';

import { AUTH_TOKEN } from '../../constants';
import { LOGIN_MUTATION } from '../../resolvers/Mutation';
import { FormInputText } from '../shared/FormInputs';

function Login({ history, onLogin })  {
  const [, forceUpdate] = useState();
  const validator = useRef(new SimpleReactValidator({autoForceUpdate: {forceUpdate: forceUpdate}}));
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ formLoading, setFormLoading ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('');

  const [ loginMutation ] = useMutation(
    LOGIN_MUTATION,
    {
      onCompleted: ({ login }) => {
        const { token } = login;
        localStorage.setItem(AUTH_TOKEN, token);
        onLogin(true);
        setFormLoading(false);
        history.push({ pathname: '/accounts' });
      },
      onError: (error) => {
        setFormLoading(false);
        setErrorMessage(error.message);
      }
    }
  );

  const login = (response) => {
    const { tokenId } = response;

    // TODO: login with username and pass

    // TODO: tokenId should be in authorization header
    loginMutation({
      variables: { oAuthToken: tokenId },
    });
  }

  return (
    <div className="flex flex-column h-100 justify-center items-center ph3 center w-50-ns">
      <p className="red">{errorMessage}</p>
      <div className="flex flex-column w-100">
        <div className="pb3 mb3 bb b--light-gray">
          <GoogleLogin
            className="w-100"
            clientId={process.env.REACT_APP_GMAIL_CLIENT_ID}
            buttonText="Login"
            onSuccess={login}
            onFailure={login}
            isSignedIn={true}
            cookiePolicy={'single_host_origin'}
          />
        </div>
        <FormInputText
          id="username"
          className="mb3"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          validator={validator.current}
        />
        <FormInputText
          id="password"
          className="mb3"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          validator={validator.current}
          type={'password'}
        />
        <button
          disabled={formLoading}
          className={`w-100 bw0 pa2 mb3 white ${formLoading ? 'bg-light-gray' : 'bg-green'}`}
          onClick={() => {
            if (validator.current.allValid()) {
              setFormLoading(true);
              loginMutation()
            } else {
              validator.current.showMessages();
              forceUpdate(1);
            }
          }}
        >
          Login
        </button>
        <Link className="w-100 bw0 link bg-white gray tc" to="/">Forgot your password?</Link>
        <Link className="w-100 bw0 mt3 link bg-white gray tc" to="/signup">Don't have an account? Sign up now!</Link>
      </div>
    </div>
  )
};

export default withRouter(Login);;

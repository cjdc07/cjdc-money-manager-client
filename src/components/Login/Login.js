import React, {useState, useRef } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { withRouter } from 'react-router';

import { AUTH_TOKEN } from '../../constants';
import { LOGIN_MUTATION } from '../../resolvers/Mutation';
import { FormInputText } from '../shared/FormInputs';

function Login({ history, onLogin })  {
  const [, forceUpdate] = useState();
  const validator = useRef(new SimpleReactValidator({autoForceUpdate: {forceUpdate: forceUpdate}}));
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ loginMutation ] = useMutation(
    LOGIN_MUTATION,
    {
      variables: { email, password },
      onCompleted: ({ login }) => {
        const { token } = login;
        localStorage.setItem(AUTH_TOKEN, token);
        onLogin(true);
        history.push({ pathname: '/accounts' });
      },
      onError: (error) => {
        // TODO: Add error handling
        console.log(error);
      }
    }
  );

  return (
    <div className="flex flex-column h-100 justify-center items-center ph3 center w-50-ns">
      <div className="flex flex-column w-100">
        <FormInputText
          id="email"
          className="mb3"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
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
          className="w-100 bw0 pa2 mb3 white bg-green"
          onClick={() => {
            if (validator.current.allValid()) {
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

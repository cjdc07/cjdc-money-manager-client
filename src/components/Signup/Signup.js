import React, { useRef, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { Link, withRouter } from 'react-router-dom';
import { useMutation } from 'react-apollo';

import { AUTH_TOKEN } from '../../constants';
import { SIGNUP_MUTATION } from '../../resolvers/Mutation';
import { FormInputText } from '../shared/FormInputs';

function Signup({ history, onLogin })  {
  const [, forceUpdate] = useState();
  const validator = useRef(new SimpleReactValidator({autoForceUpdate: {forceUpdate: forceUpdate}}));
  const [ name, setName ] = useState('');
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ formLoading, setFormLoading ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('');

  const [ signupMutation ] = useMutation(
    SIGNUP_MUTATION,
    {
      onCompleted: ({signup}) => {
        const { token } = signup;
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

  return (
    <div className="flex flex-column h-100 justify-center items-center ph3 center w-50-ns">
      <p className="red">{errorMessage}</p>
      <div className="flex flex-column w-100">
        <FormInputText
          id="name"
          className="mb3"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          validator={validator.current}
          type='text'
        />
        <FormInputText
          id="username"
          className="mb3"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          validator={validator.current}
          type='text'
        />
        <FormInputText
          id="password"
          className="mb3"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          validator={validator.current}
          type='password'
        />
        <button
          disabled={formLoading}
          className={`w-100 bw0 pa2 mb3 white ${formLoading ? 'bg-light-gray' : 'bg-green'}`}
          onClick={() => {
            if (validator.current.allValid()) {
              setFormLoading(true);
              signupMutation({variables: { name, username, password }})
            } else {
              validator.current.showMessages();
              forceUpdate(1);
            }
          }}
        >
          Signup
        </button>
        <Link className="w-100 bw0 mt3 link bg-white gray tc" to="/login">I already have an account</Link>
      </div>
    </div>
  );
}

export default withRouter(Signup);

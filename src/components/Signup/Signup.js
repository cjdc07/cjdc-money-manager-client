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
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const [ signupMutation ] = useMutation(
    SIGNUP_MUTATION,
    {
      onCompleted: ({signup}) => {
        const { token } = signup;
        localStorage.setItem(AUTH_TOKEN, token);
        onLogin(true);
        history.push({ pathname: '/accounts' });
      },
      variables: { name, email, password },
    }
  );

  return (
    <div className="flex flex-column h-100 justify-center items-center ph3 center w-50-ns">
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
          id="email"
          className="mb3"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          validator={validator.current}
          type='email'
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
          className="w-100 bw0 pa2 mb3 white bg-green"
          onClick={() => {
            if (validator.current.allValid()) {
              signupMutation()
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

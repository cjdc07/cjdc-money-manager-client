import '../styles/shared.css'

import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Account from './Account/Account';
// import Header from './Header';
import Login from './Login/Login';
// import Search from './Search';
import NavigationBar from './NavigationBar/NavigationBar';
import Signup from './Signup/Signup';
import Profile from './Profile/Profile';
import { AUTH_TOKEN } from '../constants';

/* TODO: Apply grid */
function App() {
  const auth = localStorage.getItem(AUTH_TOKEN);
  const [ logged, setLogged ] = useState(auth ? true : false);

  return (
    <div className="fixed h-100 w-100 center sans-serif">
      <Switch>
        <Route exact path='/' render={() => logged ? <Redirect to='/accounts'/> : <Redirect to='/login'/>} />
        <Route exact path='/login' render={() => logged ? <Redirect to='/accounts'/> : <Login onLogin={(logged) => setLogged(logged)}/>} />
        <Route exact path='/accounts' render={() => logged ? <Account /> : <Redirect to='/login'/>} /> 
        <Route exact path='/profile' render={() => logged ? <Profile onLogin={(logged) => setLogged(logged)}/> : <Redirect to='/login'/>} /> 
        <Route exact path='/signup' render={() => <Signup onLogin={(logged) => setLogged(logged)}/>} />
      </Switch>
      {logged && <NavigationBar />}
    </div>
  )
}

export default App;

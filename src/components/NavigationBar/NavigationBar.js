import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, withRouter } from 'react-router-dom';
import { faReceipt, faUser } from '@fortawesome/free-solid-svg-icons'

function NavigationBar({ location }) {
  const { pathname } = location;

  return (
    <div className="flex justify-around fixed bottom-0 w-100 pa3 bg-black">
      <Link className={`f4 link ${ pathname === '/accounts' ? 'blue' : 'white' }`} to="/accounts">
        <FontAwesomeIcon icon={faReceipt}/>
      </Link>
      <Link className={`f4 link ${ pathname === '/profile' ? 'blue' : 'white' }`} to="/profile">
        <FontAwesomeIcon icon={faUser}/>
      </Link>
    </div>
  )
}

export default withRouter(NavigationBar);

import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { AUTH_TOKEN } from '../../constants';


class Header extends Component {
  state = {
    showNavDropdown: false,
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({ showNavDropdown: false });
    }
  }

  render () {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const { showNavDropdown } = this.state;

    return (
      <header className="fixed w-100 top-0">
        <div className="bg-dark-gray">
          <nav className="dt w-100"> 
            <div className="dtc w2 v-mid pa3">
              <Link to="/" className="white-90 no-underline">CJ Money Manager</Link>
              <div className={`w-100 absolute left-0 mt3 dn ${showNavDropdown && "db"} bg-white shadow-1`}>
                <nav className="tc">
                  <p><Link to="/" className="db no-underline black-80">Feed</Link></p>
                  <p><Link to="/top" className="db no-underline black-80">Top</Link></p>
                  <p><Link to="/search" className="db no-underline black-80">Search</Link></p>
                  {authToken && (
                    <p><Link to="/create" className="db no-underline black-80">Create</Link></p>
                  )}
                  {authToken ? (
                    <p
                      className="link db black-80"
                      onClick={() => {
                        localStorage.removeItem(AUTH_TOKEN)
                        this.props.history.push('/')
                      }}
                    >
                      Logout
                    </p>
                  ) : (
                    <p><Link to="/login" className="db no-underline black-80">Login</Link></p>
                  )}
                </nav>
              </div>
            </div>
            <div className="dtc v-mid tr pa3 fr">
              {showNavDropdown 
                ? (
                  <FontAwesomeIcon
                    icon={faCaretUp}
                    size="2x"
                    className="dn-ns dib white-90"
                    onClick={e => this.setState({ showNavDropdown: false })}
                  />
                )
                : (
                  <FontAwesomeIcon
                    icon={faCaretDown}
                    size="2x"
                    className="dn-ns dib white-90"
                    onClick={e => this.setState({ showNavDropdown: true })}
                  />
                )
              }
              <Link to="/" className="f6 fw4 no-underline white-90 dn dib-ns pv2 ph3">Feed</Link>
              <Link to="/top" className="f6 fw4 no-underline white-90 dn dib-ns pv2 ph3">Top</Link>
              <Link to="/search" className="f6 fw4 no-underline white-90 dn dib-ns pv2 ph3">Search</Link>
              {authToken && (
                <Link to="/create" className="f6 fw4 no-underline white-90 dn dib-ns pv2 ph3">Create</Link>
              )}
              {authToken ? (
                <div
                  className="f6 fw4 no-underline white-90 dn dib-ns pv2 ph3"
                  onClick={() => {
                    localStorage.removeItem(AUTH_TOKEN)
                    this.props.history.push('/')
                  }}
                >
                  Logout
                </div>
              ) : (
                <Link to="/login" className="f6 fw4 no-underline white-90 dn dib-ns pv2 ph3">
                  Login
                </Link>
              )}
            </div>
          </nav> 
        </div>
      </header>
    )
  }
}

export default withRouter(Header);

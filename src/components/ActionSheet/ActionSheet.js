import './ActionSheet.css';
import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

function ActionSheet({ children, close, title, show }) {
  return (
    <div className={show ? 'fixed w-100 h-100 top-0 bg-black-40 z-999' : ''}>
      <div className={
        show
        ? 'action-sheet action-sheet--show'
        : 'action-sheet action-sheet--hide'
      }>
        <Fragment>
          <div className="pa3 bb b--black-30">
            <span className="f4 b fl">{title}</span>
            <span className="f4 fr" onClick={() => close()}><FontAwesomeIcon icon={faTimes} /></span>
          </div>
          {children}
        </Fragment>
      </div>
    </div>
  )
}

export default ActionSheet;

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

function Modal({ children, close, title }) {
  return (
    <div className="fixed w-100 h-100 top-0 bg-black-40 z-999">
      <div className="absolute bottom-0 flex flex-column w-100 br3 br--top bg-white shadow-2 max-h-80">
        <div className="pa3 bb b--black-30">
          <span className="f4 b fl">{title}</span>
          <span className="f4 fr" onClick={() => close()}><FontAwesomeIcon icon={faTimes} /></span>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal;

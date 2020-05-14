import './AccountActions.css'

import React, { Fragment, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import ExpenseForm from '../ExpenseForm/ExpenseForm';
import IncomeForm from '../IncomeForm/IncomeForm';
import Modal from '../Modal/Modal';
import TransferForm from '../TransferForm/TransferForm';

function AccountActions({account}) {
  const [ showModal, setShowModal ] = useState(false);
  const [ showMenu, setShowMenu ] = useState(false);
  const [ modalTitle, setModalTitle ] = useState('');
  const [ formComponent, setFormComponent ] = useState(false);

  const closeModal = () => setShowModal(false);

  return (
    <Fragment>
      <div className="fixed bottom-2 w-100 pv4 ph3">
        <button
          className={`absolute right-1 top--2 bw0 white circle-btn z-1 ${!account ? 'bg-light-gray' : 'bg-black'}`}
          onClick={() => setShowMenu(!showMenu)}
          disabled={!account}
        >
          <FontAwesomeIcon icon={faPlus}/>
        </button>
        {showMenu && (
          <div className="absolute right-1 top--8 shadow-2 bg-light-gray pb1 br2">
            <ul className="list ph3">
              <li
                className="mv3"
                onClick={() => {
                  setShowModal(true);
                  setModalTitle(`Income`);
                  setFormComponent(<IncomeForm account={account} close={closeModal}/>);
                  setShowMenu(false);
                }}
              >
                Add Income
              </li>
              <li
                className="mv3"
                onClick={() => {
                  setShowModal(true);
                  setModalTitle(`Expense`);
                  setFormComponent(<ExpenseForm account={account} close={closeModal}/>);
                  setShowMenu(false);
                }}
              >
                Add Expense
              </li>
              <li
                className="mv3"
                onClick={() => {
                  setShowModal(true);
                  setModalTitle(`${account.name} Transfer`);
                  setFormComponent(<TransferForm />);
                  setShowMenu(false);
                }}
              >
                Transfer
              </li>
            </ul>
          </div>
        )}
      </div>
      {showModal && <Modal close={closeModal} title={modalTitle}>{formComponent}</Modal>}
    </Fragment>   
  )
}

export default AccountActions;

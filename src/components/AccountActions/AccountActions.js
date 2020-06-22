import './AccountActions.css'

import React, { Fragment, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import TransactionForm from '../TransactionForm/TransactionForm';
import ActionSheet from '../ActionSheet/ActionSheet';
import { TRANSACTION_TYPE } from '../../constants';

function AccountActions({account}) {
  const [ showActionSheet, setShowActionSheet ] = useState(false);
  const [ showMenu, setShowMenu ] = useState(false);
  const [ actionSheetTitle, setActionSheetTitle ] = useState('');
  const [ formComponent, setFormComponent ] = useState(false);

  const closeActionSheet = () => setShowActionSheet(false);

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
                  setShowActionSheet(true);
                  setActionSheetTitle(`Income`);
                  setFormComponent(<TransactionForm account={account} close={closeActionSheet} type={TRANSACTION_TYPE.INCOME}/>);
                  setShowMenu(false);
                }}
              >
                Add Income
              </li>
              <li
                className="mv3"
                onClick={() => {
                  setShowActionSheet(true);
                  setActionSheetTitle(`Expense`);
                  setFormComponent(<TransactionForm account={account} close={closeActionSheet} type={TRANSACTION_TYPE.EXPENSE}/>);
                  setShowMenu(false);
                }}
              >
                Add Expense
              </li>
              <li
                className="mv3"
                onClick={() => {
                  setShowActionSheet(true);
                  setActionSheetTitle(`${account.name} Transfer`);
                  setFormComponent(<TransactionForm account={account} close={closeActionSheet} type={TRANSACTION_TYPE.TRANSFER}/>);
                  setShowMenu(false);
                }}
              >
                Transfer
              </li>
            </ul>
          </div>
        )}
      </div>
      <ActionSheet close={closeActionSheet} title={actionSheetTitle} show={showActionSheet}>{formComponent}</ActionSheet>
    </Fragment>   
  )
}

export default AccountActions;

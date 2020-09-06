import './AccountList.css'

import React, { Fragment, useState } from 'react';
import ReactSwipe from 'react-swipe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'

import AccountForm from '../AccountForm/AccountForm';
import ActionSheet from '../ActionSheet/ActionSheet';
import { ACCOUNT_TOTAL_ID } from '../../constants';
import { currencyFormatter } from '../../utils';

function AccountList({selected, onSelect, data}) {
  const [ showActionSheet, setShowActionSheet ] = useState(null);

  const getAccountsToRender = data => {
    const accounts = data.accounts.accounts.slice();
    // TODO: Sort by amount / createdAt / updatedAt
    return accounts;
  }

  const accountsToRender = getAccountsToRender(data);

  const displayAccount = (account) => (
    <div
      key={account.id}
      className={`flex flex-column pa2 h3 br2 w-100 w-30-ns w-25-m w-20-l bg-${account.color}`}
    >
      <div className="flex flex-row justify-between items-center">
        <p className="f6 mv1 break-word white">{account.name}</p>
        {account.id !== ACCOUNT_TOTAL_ID &&
          <FontAwesomeIcon
            icon={faEdit}
            className="white"
            onClick={() => setShowActionSheet(true)}
          />
        }
      </div>
      <p className="f6 mv1 break-word white b">{currencyFormatter.format(account.balance)}</p>
    </div>
  )

  const closeActionSheet = () => {
    setShowActionSheet(false);
  }

  let reactSwipeEl;

  let slideIndex = accountsToRender.indexOf(
    accountsToRender.find((account) => selected ? account.id === selected.id : null)
  );

  if (typeof selected === 'undefined') {
    slideIndex = accountsToRender.length;
  }

  return (
    <Fragment>
      {/* flex items-center items-stretch-ns - class names for div below for desktop sizes */}
      <div className="ph1 pv2">
        <ReactSwipe
          swipeOptions={{
            startSlide: slideIndex,
            continuous: false,
            transitionEnd: (index) => {
              if (index < accountsToRender.length) {
                onSelect(accountsToRender[index]);
              } else {
                // TODO: Improve this. Now, we show add new account if selected prop is set to undefined
                onSelect(undefined);
              }

            },
          }}
          ref={el => (reactSwipeEl = el)}
        >
          { accountsToRender.map((account) => displayAccount(account)) }
          <div
            className="flex items-center justify-center pa2 h3 gray br2 w-40 w-30-ns w-25-m w-20-l ba b--dashed bw1 b--light-blue"
            onClick={() => setShowActionSheet(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </div>
        </ReactSwipe>
        <div className="flex mt1">
          {accountsToRender.map((account, index) => {
            return (
              <div
                key={account.id}
                className={`flex justify-center items-center h1 w-100 mr1 br2 bg-${account.color}`}
                onClick={() => reactSwipeEl.slide(index)}
              >
                {selected
                  && (account.id === selected.id && <FontAwesomeIcon icon={faCircle} className="light-gray f6"/>)
                }
              </div>
            )
          })}
          {accountsToRender.length > 0
            && (
              <div
                className="h1 w-100 mr1 br2 bw1 b--dashed b--light-blue"
                onClick={() => reactSwipeEl.slide(reactSwipeEl.getNumSlides() - 1)}
              />
            )
          } 
        </div>
      </div>

      <ActionSheet close={closeActionSheet} title={selected ? selected.name : 'Account'} show={showActionSheet}>
        <AccountForm
          account={selected}
          close={closeActionSheet}
          onCompleted={(account) => {
            onSelect(account);
          }}
        />
      </ActionSheet>

    </Fragment>
  )
}

export default AccountList;

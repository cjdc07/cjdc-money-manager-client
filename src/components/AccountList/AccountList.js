import './AccountList.css'

import React, { Fragment, useState } from 'react';
import ReactSwipe from 'react-swipe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'

import AccountForm from '../AccountForm/AccountForm';
import Modal from '../Modal/Modal';
import { currencyFormatter } from '../../utils';

function AccountList({onSelect, data}) {
  const getAccountsToRender = data => {
    const rankedAccounts = data.accountList.accounts.slice();
    // TODO: Sort by amount / createdAt / updatedAt
    // rankedClassrooms.sort((l1, l2) => l2.votes.length - l1.votes.length);
    return rankedAccounts;
  }

  const accountsToRender = getAccountsToRender(data);

  const [ selected, setSelected ] = useState(accountsToRender[0]);
  const [ showModal, setShowModal ] = useState(null);
  const [ slideIndex, setSlideIndex ] = useState(null);

  const displayAccount = account => (
    <div
      key={account.id}
      className={`flex flex-column pa2 h3 br2 w-100 w-30-ns w-25-m w-20-l bg-${account.color}`}
    >
      <div className="flex flex-row justify-between items-center">
        <p className="f6 mv1 break-word white">{account.name}</p>
        {account.id !== 'total'
          && <FontAwesomeIcon
              icon={faEdit}
              className="white"
              onClick={() => {
                setSelected(account);
                setShowModal(true);
              }}
            />
        }
      </div>
      <p className="f6 mv1 break-word white b">{currencyFormatter.format(account.balance)}</p>
    </div>
  )

  const closeModal = () => {
    setShowModal(false);
  }

  // const accountTotal = {
  //   id: 'total',
  //   name: 'All Accounts',
  //   balance: data.accountList.total,
  //   color: 'black'
  // };

  let reactSwipeEl;

  return (
    <Fragment>
      {/* flex items-center items-stretch-ns - class names for div below for desktop sizes */}
      <div className="ph1 pv2">
        <ReactSwipe
          swipeOptions={{
            startSlide: slideIndex,
            continuous: false,
            transitionEnd: (index) => {
              setSlideIndex(index);
              setSelected(accountsToRender[index]);
              onSelect(accountsToRender[index]);
            },
          }}
          ref={el => (reactSwipeEl = el)}
        >
          {/* { displayAccount(accountTotal) } */}
          { accountsToRender.map((account) => displayAccount(account)) }
          <div
            className={`flex items-center justify-center pa2 h3 gray br2 w-40 w-30-ns w-25-m w-20-l ba b--dashed bw1 b--light-gray hover-border-blue`}
            onClick={() => setShowModal(true)}
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
                  && (account.id === selected.id
                  && <FontAwesomeIcon
                      icon={faCircle}
                      className="light-gray f6"
                      onClick={() => {
                        setSelected(account);
                        setShowModal(true);
                      }}
                    />
                  )
                }
              </div>
            )
          })}
          {accountsToRender.length > 0
            && (
              <div
                className={`h1 w-100 mr1 br2 bw1 b--dashed b--light-gray hover-border-blue ${slideIndex === accountsToRender.length && 'border-blue'}`}
                onClick={() => reactSwipeEl.slide(reactSwipeEl.getNumSlides() - 1)}
              />
            )
          } 
        </div>
      </div>

      {showModal && 
        <Modal close={closeModal} title={selected ? selected.name : 'Account'}>
          <AccountForm
            account={selected}
            close={closeModal}
            onCompleted={(account) => {
              setSelected(account);
              onSelect(account);
            }}/>
        </Modal>
      }
    </Fragment>
  )
}

export default AccountList;

import './Account.css';

import * as moment from 'moment';
import React, { Fragment, useState } from 'react';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useQuery } from 'react-apollo';
import { withRouter } from 'react-router';

import AccountList from '../AccountList/AccountList';
import TransactionList from '../TransactionList/TransactionList';
import { ACCOUNT_LIST } from '../../resolvers/Query';
import { ACCOUNT_TOTAL_ID, ACCOUNTS_PER_PAGE, ORDER_BY_ASC, TRANSACTION_TYPE } from '../../constants';

function Account() {
  const [ account, setAccount ] = useState(null);
  const [ transactionType, setTransactionType ] = useState(TRANSACTION_TYPE.INCOME);

  const { loading, error, data, updateQuery, client } = useQuery(
    ACCOUNT_LIST,
    {
      variables: { filter: '', first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC },
      onCompleted: (data) => setAccount(data.accounts.accounts[0]),
    }
  );

  if (loading) {
    return (
      <SkeletonTheme color="#D3D3D3" highlightColor="#C0C0C0">
        <div className="h3 pa2">
          <Skeleton width="100%" height="100%"/>
        </div>
        <div className="h1 ph2">
          <Skeleton width="100%" height="100%"/>
        </div>
      </SkeletonTheme>
    );
  };

  if (error) return `Error! ${error.message}`;

  if (data.accounts.accounts.length > 0 && data.accounts.accounts[0].id !== ACCOUNT_TOTAL_ID) {
    // Creates an account for summarizing all accounts
    updateQuery((data) => {
      const today = moment().format();
      data.accounts.accounts.unshift({
        __typename: 'Account',
        id: ACCOUNT_TOTAL_ID,
        name: 'All Accounts',
        balance: data.accounts.total,
        color: 'black',
        updatedAt: today,
        createdAt: today,
      });
      client.writeQuery({
        data,
        query: ACCOUNT_LIST,
        variables: { filter: '', first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC }
      });
    });
  }

  return (
    <Fragment>
      <AccountList data={data} selected={account} onSelect={account => setAccount(account)}/>
      {account && account.id !== ACCOUNT_TOTAL_ID
        && (
          <div className="h-100">
            <div className="pl2 pb2 f4">
              <span
                className={transactionType === TRANSACTION_TYPE.INCOME ? 'b' : 'gray'}
                onClick={() => setTransactionType(TRANSACTION_TYPE.INCOME)}
              >
                Income
              </span>
              <span className="gray"> | </span>
              <span
                className={transactionType === TRANSACTION_TYPE.EXPENSE ? 'b' : 'gray'}
                onClick={() => setTransactionType(TRANSACTION_TYPE.EXPENSE)}
              >
                Expenses
              </span>
              <span className="gray"> | </span>
              <span
                className={transactionType === TRANSACTION_TYPE.TRANSFER ? 'b' : 'gray'}
                onClick={() => setTransactionType(TRANSACTION_TYPE.TRANSFER)}
              >
                Transfers
              </span>
            </div>
            <TransactionList account={account} type={transactionType}/>
          </div>
        )
      }
    </Fragment>
  )
}

export default withRouter(Account);

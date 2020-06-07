import './Account.css';

import React, { Fragment, useState } from 'react';
import { useQuery } from 'react-apollo';
import { withRouter } from 'react-router';

import AccountActions from '../AccountActions/AccountActions';
import AccountList from '../AccountList/AccountList';
import TransactionList from '../TransactionList/TransactionList';
import { ACCOUNT_LIST } from '../../resolvers/Query';
import { ACCOUNTS_PER_PAGE, ORDER_BY_ASC, TRANSACTION_TYPE } from '../../constants';

function Account() {
  const [ account, setAccount ] = useState(null);
  const [ transactionType, setTransactionType ] = useState(TRANSACTION_TYPE.INCOME);

  const { loading, error, data } = useQuery(
    ACCOUNT_LIST,
    {
      variables: { filter: '', first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC },
      onCompleted: (data) => setAccount(data.accountList.accounts[0]),
    }
  );

  if (loading) return 'Loading...';

  if (error) return `Error! ${error.message}`;

  return (
    <Fragment>
      <AccountList data={data} onSelect={account => setAccount(account)}/>
      {data.accountList.accounts.length > 0
        ? (
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
            {account && <TransactionList account={account} type={transactionType}/>}
          </div>
        )
        : (
          <div className="tc pv5">
            <span className="v-mid f4">Create your first account</span>
          </div>
        )
      }
      <AccountActions account={account}/>
    </Fragment>
  )
}

export default withRouter(Account);

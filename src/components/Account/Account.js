import './Account.css';

import React, { Fragment, useState } from 'react';
import { useQuery } from 'react-apollo';
import { withRouter } from 'react-router';

import AccountActions from '../AccountActions/AccountActions';
import AccountList from '../AccountList/AccountList';
import ExpenseList from '../ExpenseList/ExpenseList';
import IncomeList from '../IncomeList/IncomeList';
import { ACCOUNT_LIST } from '../../resolvers/Query';
import { ACCOUNTS_PER_PAGE, ORDER_BY_ASC, TRANSACTION_TYPE } from '../../constants';

function Account() {
  const [ account, setAccount ] = useState(null);
  const [ transactionComponent, setTransactionComponent ] = useState(TRANSACTION_TYPE.INCOME);

  const { loading, error, data } = useQuery(
    ACCOUNT_LIST,
    {
      variables: { first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC },
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
            <div className="pl2 f4">
              <span
                className={transactionComponent === TRANSACTION_TYPE.INCOME ? 'b' : 'gray'}
                onClick={() => setTransactionComponent(TRANSACTION_TYPE.INCOME)}
              >
                Income
              </span>
              <span className="gray"> | </span>
              <span
                className={transactionComponent === TRANSACTION_TYPE.EXPENSE ? 'b' : 'gray'}
                onClick={() => setTransactionComponent(TRANSACTION_TYPE.EXPENSE)}
              >
                Expense
              </span>
            </div>
            {transactionComponent === TRANSACTION_TYPE.INCOME && <IncomeList account={account}/>}
            {transactionComponent === TRANSACTION_TYPE.EXPENSE && <ExpenseList account={account}/>}
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

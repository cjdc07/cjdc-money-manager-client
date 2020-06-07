import './TransactionList.css';

import * as moment from 'moment';
import React, { Fragment, useState } from 'react';

import Modal from '../Modal/Modal';
import TransactionForm from '../TransactionForm/TransactionForm';
import { TRANSACTION_LIST, ACCOUNT_LIST } from '../../resolvers/Query';
import { TRANSACTION_TYPE, ACCOUNTS_PER_PAGE, ORDER_BY_ASC } from '../../constants';
import { currencyFormatter } from '../../utils';
import { useQuery } from 'react-apollo';
import { withApollo } from 'react-apollo';


function TransactionList({ account, client, type }) {
  const [ showModal, setShowModal ] = useState(false);
  const [ modalTitle, setModalTitle ] = useState(false);
  const [ selected, setSelected ] = useState(false);

  const { loading, error, data } = useQuery(
    TRANSACTION_LIST,
    {
      variables: { type, account: account.id, filter: '', skip: 0, first: 0, orderBy: null }, // TODO: Use filter, skip, and orderBy
    }
  );

  const closeModal = () => setShowModal(false);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const { transactions, /*count, total*/ } = data.transactionList;

  let {accountList: { accounts }} = client.cache.readQuery({
    query: ACCOUNT_LIST,
    variables: { filter: '', first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC }, // TODO: Use filter, skip, and orderBy
  });

  return (
    <Fragment>
      <div className="h-100 overflow-y-auto ph2">
        {transactions.map(({ count, createdAt, total, transactions}) => {
          const list = transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between w-100 pv2 ph3 mb3 br2 shadow-1"
              onClick={() => {
                setShowModal(true);
                setModalTitle(transaction.description);
                setSelected(transaction);
              }}
            >
              <div className="flex flex-column">
                <span className="mb1 f6 b">{transaction.description}</span>
                <span className="f6 gray">
                  {transaction.type === TRANSACTION_TYPE.TRANSFER
                    ? (`${transaction.from === account.id
                        ? `${accounts.find((otherAccount) => otherAccount.id === transaction.to)?.name || 'Deleted Account'}`
                        : `${accounts.find((otherAccount) => otherAccount.id === transaction.from)?.name || 'Deleted Account'}`}
                      | ${transaction.category.value}`)
                    : (`${transaction.type === TRANSACTION_TYPE.INCOME ?  transaction.from : transaction.to} | ${transaction.category.value}`)
                  }
                </span>
              </div>
              <div className="flex flex-column justify-center">
                {transaction.type === TRANSACTION_TYPE.INCOME && <span className="mb2 f5 b green">+{currencyFormatter.format(transaction.amount)}</span>}
                {transaction.type === TRANSACTION_TYPE.EXPENSE && <span className="mb2 f5 b red">-{currencyFormatter.format(transaction.amount)}</span>}
                {transaction.type === TRANSACTION_TYPE.TRANSFER &&
                  <span className={`mb2 f5 b ${transaction.from === account.id ? 'red' : 'green'}`}>
                    {`${transaction.from === account.id ? '-' : '+'}${currencyFormatter.format(transaction.amount)}`}
                  </span>
                }
              </div>
            </div>
          ));

          return (
            <Fragment>
              <p className="b mt2">{moment(createdAt).format('MMMM D, YYYY')}</p>
              {list}
            </Fragment>
          )
        })}
        <div className="bottom-spacing">{/* Extra space  */}</div>
      </div>
      {showModal &&
        <Modal
          close={closeModal}
          title={modalTitle}
        >
          <TransactionForm account={account} transaction={selected} close={closeModal} type={selected.type}/>
        </Modal>
      }
    </Fragment>
  );
}

export default withApollo(TransactionList);

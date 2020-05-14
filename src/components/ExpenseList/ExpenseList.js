import './ExpenseList.css';

import React, { Fragment, useState } from 'react';

import { EXPENSE_LIST } from '../../resolvers/Query';
import { currencyFormatter } from '../../utils';
import { useQuery } from 'react-apollo';
import Modal from '../Modal/Modal';
import ExpenseForm from '../ExpenseForm/ExpenseForm';

function ExpenseList({ account }) {
  const [ showModal, setShowModal ] = useState(false);
  const [ modalTitle, setModalTitle ] = useState(false);
  const [ selected, setSelected ] = useState(false);

  const { loading, error, data } = useQuery(
    EXPENSE_LIST,
    {
      variables: { accountId: account && account.id },
    }
  );

  const closeModal = () => setShowModal(false);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const { expenses, /*count, total*/ } = data.expenseList;

  return (
    <Fragment>
      <div className="h-100 mt2 overflow-y-auto pa2">
        {expenses.map(expense => (
          <div
            key={expense.id}
            className="flex justify-between w-100 pv2 ph3 mb3 br2 shadow-1"
            onClick={() => {
              setShowModal(true);
              setModalTitle(expense.description);
              setSelected(expense);
            }}
          >
            <div className="flex flex-column">
              <span className="mb1 f6 b">{expense.description}</span>
              <span className="f6 gray">{`${expense.recipient} | ${expense.category.value}`}</span>
            </div>
            <div className="flex flex-column justify-center">
              <span className="mb2 f5 b red">-{currencyFormatter.format(expense.amount)}</span>
            </div>
          </div>
        ))}
        <div className="bottom-spacing">{/* Extra space  */}</div>
      </div>
      {showModal && <Modal close={closeModal} title={modalTitle}><ExpenseForm account={account} expense={selected} close={closeModal}/></Modal>}
    </Fragment>
  );
}

export default ExpenseList;

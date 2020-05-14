import './IncomeList.css';

import React, { Fragment, useState } from 'react';

import { INCOME_LIST } from '../../resolvers/Query';
import { currencyFormatter } from '../../utils';
import { useQuery } from 'react-apollo';
import Modal from '../Modal/Modal';
import IncomeForm from '../IncomeForm/IncomeForm';

function IncomeList({ account }) {
  const [ showModal, setShowModal ] = useState(false);
  const [ modalTitle, setModalTitle ] = useState(false);
  const [ selected, setSelected ] = useState(false);

  const { loading, error, data } = useQuery(
    INCOME_LIST,
    {
      variables: { accountId: account && account.id },
    }
  );

  const closeModal = () => setShowModal(false);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const { incomes, /*count, total*/ } = data.incomeList;

  return (
    <Fragment>
      <div className="h-100 mt2 overflow-y-auto pa2">
        {incomes.map(income => (
          <div
            key={income.id}
            className="flex justify-between w-100 pv2 ph3 mb3 br2 shadow-1"
            onClick={() => {
              setShowModal(true);
              setModalTitle(income.description);
              setSelected(income);
            }}
          >
            <div className="flex flex-column">
              <span className="mb1 f6 b">{income.description}</span>
              <span className="f6 gray">{`${income.payer} | ${income.category.value}`}</span>
            </div>
            <div className="flex flex-column justify-center">
              <span className="mb2 f5 b green">+{currencyFormatter.format(income.amount)}</span>
            </div>
          </div>
        ))}
        <div className="bottom-spacing">{/* Extra space  */}</div>
      </div>
      {showModal && <Modal close={closeModal} title={modalTitle}><IncomeForm account={account} income={selected} close={closeModal}/></Modal>}
    </Fragment>
  );
}

export default IncomeList;

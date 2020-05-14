import React, { useRef, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQuery } from '@apollo/react-hooks';

import FormContainer from '../shared/FormContainer';
import { CREATE_INCOME, DELETE_INCOME, UPDATE_INCOME } from '../../resolvers/Mutation';
import { ACCOUNTS_PER_PAGE, ORDER_BY_ASC, AUTH_TOKEN, TRANSACTION_TYPE } from '../../constants';
import { FormInputCurrency, FormInputSelect, FormInputText, FormInputTextArea } from '../shared/FormInputs';
import { ACCOUNT_LIST, INCOME_LIST, CATEGORY_LIST } from '../../resolvers/Query';

function IncomeForm({account, close, income}) {
  const [, forceUpdate] = useState();
  const validator = useRef(new SimpleReactValidator({autoForceUpdate: {forceUpdate: forceUpdate}}));
  const [ amount, setAmount ] = useState(income ? income.amount : '');
  const [ category, setCategory ] = useState(income ? income.category.value : '');
  const [ description, setDescription ] = useState(income ? income.description : '');
  const [ payer, setPayer ] = useState(income ? income.payer : '');
  const [ notes, setNotes ] = useState(income ? income.notes : '');
  const [ formLoading, setFormLoading ] = useState(false);
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const [ createIncome ] = useMutation(
    CREATE_INCOME,
    {
      update: (cache, { data: { createIncome } }) => {
        const incomeData = cache.readQuery({
          query: INCOME_LIST,
          variables: { accountId: account.id },
        });

        incomeData.incomeList.incomes.unshift(createIncome);

        cache.writeQuery({
          query: INCOME_LIST,
          data: incomeData,
          variables: { accountId: account.id },
        });
      },
      refetchQueries: [
        {
          query: ACCOUNT_LIST,
          variables: { first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC },
        },
        {
          query: CATEGORY_LIST, // TODO: Update cache instead of doing this
          variables: { transactionType: TRANSACTION_TYPE.INCOME },
        },
      ],
      onCompleted: () => {
        setFormLoading(false);
        close();
      },
    }
  );

  const [ updateIncome ] = useMutation(
    UPDATE_INCOME,
    {
      refetchQueries: [
        {
          query: ACCOUNT_LIST,
          variables: { first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC },
        },
        {
          query: CATEGORY_LIST, // TODO: Update cache instead of doing this
          variables: { transactionType: TRANSACTION_TYPE.INCOME },
        },
      ],
      onCompleted: () => {
        setFormLoading(false);
        close();
      },
    }
  );

  const [ deleteIncome ] = useMutation(
    DELETE_INCOME,
    {
      update: (cache, { data: { deleteIncome } }) => {
        const data = cache.readQuery({
          query: INCOME_LIST,
          variables: { accountId: account.id },
        });

        const index = data.incomeList.incomes.indexOf(
          data.incomeList.incomes.find(income => income.id === deleteIncome.id)
        );
        
        data.incomeList.incomes.splice(index, 1);

        cache.writeQuery({
          query: INCOME_LIST,
          data: data,
          variables: { accountId: account.id },
        });
      },
      refetchQueries: [{
        query: ACCOUNT_LIST,
        variables: { first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC },
      }],
      onCompleted: () => {
        setFormLoading(false);
        close();
      },
    }
  );

  const { loading, error, data } = useQuery(
    CATEGORY_LIST,
    { variables: {transactionType: TRANSACTION_TYPE.INCOME} },
  );

  if (loading) return 'Loading...';

  if (error) return `Error! ${error.message}`;

  const onSubmit = (event) => {
    event.preventDefault();

    if (authToken && validator.current.allValid()) {
      setFormLoading(true);
      if (income) {
        updateIncome({ variables: { id: income.id, payer, category, amount: parseFloat(amount), description, account: account.id, notes }});
      } else {
        createIncome({ variables: { payer, category, amount: parseFloat(amount), description, account: account.id, notes }});
      }
    } else {
      validator.current.showMessages();
      forceUpdate(1);
    }
  };

  return (
    <FormContainer onSubmit={onSubmit}>
      <FormInputText
        id="description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
        label="Description"
        validator={validator.current}
      />
      <FormInputText
        id="payer"
        value={payer}
        onChange={e => setPayer(e.target.value)}
        placeholder="Payer"
        label="Payer"
        validator={validator.current}
      />
      <FormInputSelect
        id="category"
        value={category}
        onChange={category => setCategory(category)}
        label="Category"
        data={data.categoryList.categories}
        validator={validator.current}
      />
      {/* TODO: Don't allow negative values */}
      <FormInputCurrency
        id="amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="Amount"
        label="Amount"
        validator={validator.current}
      />
      <FormInputTextArea
        id="notes"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Notes"
        label="Notes"
      />
      {income // TODO: add confirmation dialog
        && (
          <div className="mb4 w-100">
            <button
              disabled={formLoading}
              type="button"
              className={`pa2 bw0 br3 white w-100 ${formLoading ? 'bg-light-gray' : 'bg-red'}`}
              onClick={() => {
                setFormLoading(true);
                deleteIncome({ variables: {id: income.id}});
              }}
            >
              <FontAwesomeIcon icon={faTrash} /> Delete
            </button>
          </div>
        )
      }
      <div className="flex justify-between">
        <button
          disabled={formLoading}
          type="button"
          className={`pa2 bw0 br3 bg-light-gray w-50 mr1 ${formLoading ? 'white' : 'gray'}`}
          onClick={close}
        >
          Cancel
        </button>
        <button
          disabled={formLoading}
          type="submit"
          className={`pa2 bw0 br3 white w-50 mr1 ${formLoading ? 'bg-light-gray' : 'bg-green'}`}
        >
          {income ? 'Update' : 'Create'}
        </button>
      </div>
    </FormContainer>
  );
} 

export default IncomeForm;

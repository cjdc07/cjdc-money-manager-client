import React, { useRef, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQuery } from '@apollo/react-hooks';

import FormContainer from '../shared/FormContainer';
import { CREATE_EXPENSE, DELETE_EXPENSE, UPDATE_EXPENSE } from '../../resolvers/Mutation';
import { ACCOUNTS_PER_PAGE, AUTH_TOKEN, ORDER_BY_ASC, TRANSACTION_TYPE } from '../../constants';
import { FormInputCurrency, FormInputSelect, FormInputText, FormInputTextArea } from '../shared/FormInputs';
import { ACCOUNT_LIST, EXPENSE_LIST, CATEGORY_LIST } from '../../resolvers/Query';

function ExpenseForm({account, close, expense}) {
  const [, forceUpdate] = useState();
  const validator = useRef(new SimpleReactValidator({autoForceUpdate: {forceUpdate: forceUpdate}}));
  const [ amount, setAmount ] = useState(expense ? expense.amount : '');
  const [ category, setCategory ] = useState(expense ? expense.category.value : '');
  const [ description, setDescription ] = useState(expense ? expense.description : '');
  const [ recipient, setRecipient ] = useState(expense ? expense.recipient : '');
  const [ notes, setNotes ] = useState(expense ? expense.notes : '');
  const [ formLoading, setFormLoading ] = useState(false);
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const [ createExpense ] = useMutation(
    CREATE_EXPENSE,
    {
      update: (cache, { data: { createExpense } }) => {
        const expenseData = cache.readQuery({
          query: EXPENSE_LIST,
          variables: { accountId: account.id },
        });

        expenseData.expenseList.expenses.unshift(createExpense);

        cache.writeQuery({
          query: EXPENSE_LIST,
          data: expenseData,
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
          variables: { transactionType: TRANSACTION_TYPE.EXPENSE },
        },
      ],
      onCompleted: () => {
        setFormLoading(true);
        close()
      },
    }
  );

  const [ updateExpense ] = useMutation(
    UPDATE_EXPENSE,
    {
      refetchQueries: [
        {
          query: ACCOUNT_LIST,
          variables: { first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC },
        },
        {
          query: CATEGORY_LIST, // TODO: Update cache instead of doing this
          variables: { transactionType: TRANSACTION_TYPE.EXPENSE },
        },
      ],
      onCompleted: () => {
        setFormLoading(true);
        close()
      },
    }
  );

  const [ deleteExpense ] = useMutation(
    DELETE_EXPENSE,
    {
      update: (cache, { data: { deleteExpense } }) => {
        const data = cache.readQuery({
          query: EXPENSE_LIST,
          variables: { accountId: account.id },
        });

        const index = data.expenseList.expenses.indexOf(
          data.expenseList.expenses.find(expense => expense.id === deleteExpense.id)
        );
        
        data.expenseList.expenses.splice(index, 1);

        cache.writeQuery({
          query: EXPENSE_LIST,
          data: data,
          variables: { accountId: account.id },
        });
      },
      refetchQueries: [{
        query: ACCOUNT_LIST,
        variables: { first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC },
      }],
      onCompleted: () => {
        setFormLoading(true);
        close()
      },
    }
  );

  const { loading, error, data } = useQuery(
    CATEGORY_LIST,
    { variables: {transactionType: TRANSACTION_TYPE.EXPENSE} },
  );

  if (loading) return 'Loading...';

  if (error) return `Error! ${error.message}`;

  const onSubmit = (event) => {
    event.preventDefault();

    if (authToken && validator.current.allValid()) {
      setFormLoading(true);
      if (expense) {
        updateExpense({ variables: { id: expense.id, recipient, category, amount: parseFloat(amount), description, account: account.id, notes }});
      } else {
        createExpense({ variables: { recipient, category, amount: parseFloat(amount), description, account: account.id, notes }});
      }
    } else {
      validator.current.showMessages();
      forceUpdate(1);
    }
  }

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
        id="recipient"
        value={recipient}
        onChange={e => setRecipient(e.target.value)}
        placeholder="Recipient"
        label="Recipient"
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
      {expense // TODO: add confirmation dialog
        && (
          <div className="mb4 w-100">
            <button
              disabled={formLoading}
              type="button"
              className={`pa2 bw0 br3 white w-100 ${formLoading ? 'bg-light-gray' : 'bg-red'}`}
              onClick={() => {
                setFormLoading(true);
                deleteExpense({ variables: {id: expense.id}});
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
          {expense ? 'Update' : 'Create'}
        </button>
      </div>
    </FormContainer>
  )
}

export default ExpenseForm;

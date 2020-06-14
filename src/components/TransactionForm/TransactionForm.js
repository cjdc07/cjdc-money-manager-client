import React, { useRef, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQuery } from '@apollo/react-hooks';

import FormContainer from '../shared/FormContainer';
import { CREATE_TRANSACTION, DELETE_TRANSACTION, UPDATE_TRANSACTION } from '../../resolvers/Mutation';
import { ACCOUNTS_PER_PAGE, ORDER_BY_ASC, AUTH_TOKEN, TRANSACTION_TYPE } from '../../constants';
import { FormInputCurrency, FormInputSelect, FormInputSelectCategory, FormInputText, FormInputTextArea } from '../shared/FormInputs';
import { ACCOUNT_LIST, TRANSACTION_LIST, CATEGORY_LIST } from '../../resolvers/Query';
import { withApollo } from 'react-apollo';

function TransactionForm({account, close, transaction, type, client}) {
  let fromInitialValue = '';
  let toInitialValue = '';

  if (type === TRANSACTION_TYPE.TRANSFER) {
    fromInitialValue = account.id;
  }

  if (type === TRANSACTION_TYPE.EXPENSE) {
    fromInitialValue = 'Me';
  }

  if (type === TRANSACTION_TYPE.INCOME) {
    toInitialValue = 'Me';
  }

  const [, forceUpdate] = useState();
  const validator = useRef(new SimpleReactValidator({autoForceUpdate: {forceUpdate: forceUpdate}}));
  const [ amount, setAmount ] = useState(transaction ? transaction.amount : '');
  const [ category, setCategory ] = useState(transaction ? transaction.category.value : '');
  const [ description, setDescription ] = useState(transaction ? transaction.description : '');
  const [ from, setFrom ] = useState(transaction ? transaction.from : fromInitialValue);
  const [ to, setTo ] = useState(transaction ? transaction.to : toInitialValue);
  const [ notes, setNotes ] = useState(transaction ? transaction.notes : '');
  const [ formLoading, setFormLoading ] = useState(false);
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const [ createTransaction ] = useMutation(
    CREATE_TRANSACTION,
    // TODO: Implement cache using update instead
    {
      refetchQueries: ({ data: { createTransaction } }) => {
        const queries = [
          {
            query: ACCOUNT_LIST,
            variables: { filter: '', first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC }
          },
          {
            query: CATEGORY_LIST,
          },
          {
            query: TRANSACTION_LIST,
            variables: { type, account: account.id, filter: '', skip: 0, first: 0, orderBy: null },
          },
        ];

        if (type === TRANSACTION_TYPE.TRANSFER) {
          queries.push({
            query: TRANSACTION_LIST,
            variables: { type, account: createTransaction.to, filter: '', skip: 0, first: 0, orderBy: null },
          });
        }

        return queries;
      },
      onCompleted: () => {
        setFormLoading(false);
        close();
      },
    }
  );

  const [ updateTransaction ] = useMutation(
    UPDATE_TRANSACTION,
    {
      refetchQueries: [
        {
          query: ACCOUNT_LIST,
          variables: { filter: '', first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC }
        },
        {
          query: CATEGORY_LIST, // TODO: Update cache instead of doing this
        },
      ],
      onCompleted: () => {
        setFormLoading(false);
        close();
      },
    }
  );

  const [ deleteTransaction ] = useMutation(
    DELETE_TRANSACTION,
    {
      // TODO: Implement cache using update instead
      refetchQueries: ({ data: { deleteTransaction } }) => {
        const queries = [
          {
            query: ACCOUNT_LIST,
            variables: { filter: '', first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC }
          },
          {
            query: TRANSACTION_LIST,
            variables: { type, account: account.id, filter: '', skip: 0, first: 0, orderBy: null },
          },
        ];

        if (type === TRANSACTION_TYPE.TRANSFER) {
          queries.push({
            query: TRANSACTION_LIST,
            variables: { type, account: deleteTransaction.to, filter: '', skip: 0, first: 0, orderBy: null },
          });
        }

        return queries;
      },
      onCompleted: () => {
        setFormLoading(false);
        close();
      },
    }
  );

  const { loading, error, data } = useQuery(CATEGORY_LIST);
  let {accountList: { accounts }} = client.cache.readQuery({
    query: ACCOUNT_LIST,
    variables: { filter: '', first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC }, // TODO: Use filter, skip, and orderBy
  });
  accounts = accounts.filter((otherAccount) => account.id !== otherAccount.id); // TODO: Do this filter in backend

  if (loading) return 'Loading...';

  if (error) return `Error! ${error.message}`;

  const onSubmit = (event) => {
    event.preventDefault();

    if (authToken && validator.current.allValid()) {
      setFormLoading(true);
      if (transaction) {
        updateTransaction({
          variables: {
            from,
            to,
            category,
            description,
            notes,
            type,
            id: transaction.id,
            account: account.id,
            amount: parseFloat(amount),
          }
        });
      } else {
        createTransaction({
          variables: {
            category,
            description,
            notes,
            type,
            from,
            to,
            account: account.id,
            amount: parseFloat(amount),
          }
        });
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
      {type === TRANSACTION_TYPE.TRANSFER 
        ? (
          <FormInputSelect
            id={to === account.id ? 'from' : 'to'}
            value={to === account.id ? from : to}
            onChange={e => {setTo(e.target.value)}}
            label={to === account.id ? 'From' : 'To'}
            data={accounts}
            validator={validator.current}
            disabled={to === account.id}
          />
        )
        : (
          <FormInputText
            id={type === TRANSACTION_TYPE.INCOME ? 'from' : 'to'}
            value={type === TRANSACTION_TYPE.INCOME ? from : to}
            onChange={e => type === TRANSACTION_TYPE.INCOME ? setFrom(e.target.value) : setTo(e.target.value)}
            placeholder={type === TRANSACTION_TYPE.INCOME ? 'From' : 'To'}
            label={type === TRANSACTION_TYPE.INCOME ? 'From' : 'To'}
            validator={validator.current}
          />
        )
      }
      <FormInputSelectCategory
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
        disabled={to === account.id}
      />
      <FormInputTextArea
        id="notes"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Notes"
        label="Notes"
      />
      {transaction // TODO: add confirmation dialog
        && (
          <div className="mb4 w-100">
            <button
              disabled={formLoading}
              type="button"
              className={`pa2 bw0 br3 white w-100 ${formLoading ? 'bg-light-gray' : 'bg-red'}`}
              onClick={() => {
                setFormLoading(true);
                deleteTransaction({ variables: {id: transaction.id}});
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
          {transaction ? 'Update' : 'Create'}
        </button>
      </div>
    </FormContainer>
  );
} 

export default withApollo(TransactionForm);

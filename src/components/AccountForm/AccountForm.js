import './AccountForm.css';

import React, { useState, useRef, useEffect } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useMutation } from '@apollo/react-hooks';

import FormContainer from '../shared/FormContainer';
import { ACCOUNT_LIST, TRANSACTION_LIST } from '../../resolvers/Query';
import { ACCOUNT_TOTAL_ID, ACCOUNTS_PER_PAGE, AUTH_TOKEN, BG_COLORS, TRANSACTION_TYPE, ORDER_BY_ASC } from '../../constants';
import { CREATE_ACCOUNT, DELETE_ACCOUNT, UPDATE_ACCOUNT } from '../../resolvers/Mutation';
import { FormInputCurrency, FormInputText } from '../shared/FormInputs';

function AccountForm({ account, close, onCompleted }) {
  const [, forceUpdate] = useState();
  const validator = useRef(new SimpleReactValidator({autoForceUpdate: {forceUpdate: forceUpdate}}));
  const [ name, setName ] = useState('');
  const [ balance, setBalance ] = useState('');
  const [ color, setColor ] = useState('');
  const [ formLoading, setFormLoading ] = useState(false);
  const authToken = localStorage.getItem(AUTH_TOKEN);

  useEffect(() => {
    setName(account ? account.name : '');
    setBalance(account ? parseFloat(account.balance).toFixed(2) : '');
    setColor(account ? account.color : '');
  }, [account])

  const [ createAccount ] = useMutation(
    CREATE_ACCOUNT,
    {
      update: (cache, { data: { createAccount } }) => {
        const data = cache.readQuery({
          query: ACCOUNT_LIST,
          variables: { filter: '', first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC }
        });

        data.accountList.accounts.push(createAccount);
        data.accountList.total += createAccount.balance
        data.accountList.count += 1;
        
        if (data.accountList.accounts.length > 0 && data.accountList.accounts[0].id === ACCOUNT_TOTAL_ID) {
          data.accountList.accounts[0].balance = data.accountList.total;
        }

        cache.writeQuery({
          query: ACCOUNT_LIST,
          data,
          variables: { filter: '', first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC }
        });
      },
      onCompleted: ({createAccount}) => {
        setFormLoading(false);
        onCompleted(createAccount);
        close();
      },
    },
  );

  const [ updateAccount ] = useMutation(
    UPDATE_ACCOUNT,
    {
      update: (cache, { data: { updateAccount } }) => {
        const data = cache.readQuery({
          query: ACCOUNT_LIST,
          variables: { filter: '', first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC }
        });

        data.accountList.total = data.accountList.accounts.slice(1).reduce((total, account) => total += account.balance, 0);

        if (data.accountList.accounts.length > 0 && data.accountList.accounts[0].id === ACCOUNT_TOTAL_ID) {
          data.accountList.accounts[0].balance = data.accountList.total;
        }

        cache.writeQuery({
          query: ACCOUNT_LIST,
          data,
          variables: { filter: '', first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC }
        });

        onCompleted(updateAccount);
      },
      refetchQueries: ({ data: { updateAccount } }) => {
        return [{
          query: TRANSACTION_LIST,
          variables: { account: updateAccount.id, filter: '', skip: 0, first: 0, type: TRANSACTION_TYPE.INCOME, orderBy: null },
        }];
      },
      onCompleted: () => {
        setFormLoading(false);
        close();
      },
    }
  );

  const [ deleteAccount ] = useMutation(
    DELETE_ACCOUNT,
    {
      update: (cache, { data: { deleteAccount } }) => {
        const data = cache.readQuery({
          query: ACCOUNT_LIST,
          variables: { filter: '', first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC }
        });

        const index = data.accountList.accounts.indexOf(
          data.accountList.accounts.find(account => account.id === deleteAccount.id)
        );

        data.accountList.accounts.splice(index, 1);
        data.accountList.total -= deleteAccount.balance
        data.accountList.count -= 1;

        if (data.accountList.accounts.length === 1 && data.accountList.accounts[0].id === ACCOUNT_TOTAL_ID) {
          data.accountList.accounts = [];
        }

        if (data.accountList.accounts.length > 0 && data.accountList.accounts[0].id === ACCOUNT_TOTAL_ID) {
          data.accountList.accounts[0].balance = data.accountList.total;
        }

        cache.writeQuery({
          query: ACCOUNT_LIST,
          data,
          variables: { filter: '', first: ACCOUNTS_PER_PAGE, skip: 0, orderBy: ORDER_BY_ASC }
        });

        // Will assign previous account as selected account
        onCompleted(data.accountList.accounts[index-1]);
      },
      refetchQueries: ({ data: { deleteAccount } }) => {
        return [{
          query: TRANSACTION_LIST,
          variables: { account: account.id, filter: '', skip: 0, first: 0, type: TRANSACTION_TYPE.INCOME, orderBy: null },
        }];
      },
      onCompleted: () => {
        setFormLoading(false);
        close();
      },
    },
  )

  const onSubmit = (event) => {
    event.preventDefault();
    if (authToken && validator.current.allValid()) {
      setFormLoading(true);
      if (account) {
        // TODO: Add confirmation dialog telling it will add to income / expense
        updateAccount({ variables: { id: account.id, name, balance: parseFloat(balance), color }});
      } else {
        createAccount({ variables: { name, balance: parseFloat(balance), color }}) ;
      }
    } else {
      validator.current.showMessages();
      forceUpdate(1);
    }
  };

  return (
    <FormContainer onSubmit={onSubmit}>
      <FormInputText
        id="name"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Account Name"
        label="Name"
        validator={validator.current}
      />

      <FormInputCurrency
        id="balance"
        value={balance}
        onChange={e => setBalance(e.target.value)}
        placeholder="Balance"
        label="Balance"
        validator={validator.current}
      />

      <label htmlFor="color" className="mb2 f5 b">Color</label>
      <div className="mb3">
        <div id="color" className="flex flex-wrap">
          {BG_COLORS.map((bgColor) => (
            <div
              key={bgColor}
              onClick={() => setColor(bgColor)}
              className={`tc color-picker br2 mr1 mt1 bg-${bgColor}`}
            >
              {color === bgColor && <FontAwesomeIcon className="white mt1" icon={faCheck} />}
            </div>
          ))}
        </div>
        <span className="red f6">{validator.current.message('color', color, 'required')}</span>
      </div>
      {account
        && (
          <div className="mb4 w-100">
            <button
              disabled={formLoading}
              type="button"
              className={`pa2 bw0 br3 white w-100 ${formLoading ? 'bg-light-gray' : 'bg-red'}`}
              onClick={() => {
                setFormLoading(true);
                deleteAccount({ variables: {id: account.id}});
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
          {account ? 'Update' : 'Create'}
        </button>
      </div>
    </FormContainer>
  )
}

export default AccountForm;

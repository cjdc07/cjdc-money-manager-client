import { gql } from 'apollo-boost';

export const SIGNUP_MUTATION = gql`
  mutation SignupMutation($username: String!, $password: String!, $name: String!) {
    signup(username: $username, password: $password, name: $name) {
      token
    }
  }
`

export const GMAIL_LOGIN_MUTATION = gql`
  mutation LoginMutation($oAuthToken: String!) {
    gmailLogin(oAuthToken: $oAuthToken) {
      token
    }
  }
`

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`

export const CREATE_ACCOUNT = gql`
  mutation AccountMutation($name: String!, $balance: Float!, $color: String!) {
    createAccount(name: $name, balance: $balance, color: $color) {
      id
      name
      balance
      color
      updatedAt
      createdAt
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation AccountMutation($id: ID!, $name: String!, $balance: Float!, $color: String!) {
    updateAccount(id: $id, name: $name, balance: $balance, color: $color) {
      id
      name
      balance
      color
      updatedAt
      createdAt
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation AccountMutation($id: ID!) {
    deleteAccount(id: $id) {
      id
      balance
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation TransactionMutation(
    $account: ID!,
    $amount: Float!,
    $category: String!,
    $description: String!,
    $from: String!,
    $notes: String,
    $to: String!,
    $type: TransactionType!,
  ) {
    createTransaction(
      account: $account,
      amount: $amount,
      category: $category,
      description: $description,
      from: $from,
      notes: $notes,
      to: $to,
      type: $type,
    ) {
      id
      account {
        id
        name
      }
      amount
      category {
        id
        value
      }
      description
      from
      notes
      to
      type
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation TransactionMutation(
    $id: ID!,
    $account: ID!
    $amount: Float!,
    $category: String!,
    $description: String!,
    $from: String!,
    $notes: String,
    $to: String!,
    $type: TransactionType!
  ) {
    updateTransaction(
      id: $id,
      account: $account,
      amount: $amount,
      category: $category,
      description: $description,
      from: $from,
      notes: $notes,
      to: $to,
      type: $type,
    ) {
      id
      account {
        id
        name
      }
      amount
      category {
        id
        value
      }
      description
      from
      notes
      to
      type
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation TransactionMutation($id: ID!) {
    deleteTransaction(id: $id) {
      id
      amount
      to
      from
    }
  }
`;

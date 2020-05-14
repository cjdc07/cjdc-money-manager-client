import { gql } from 'apollo-boost';

export const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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
      createdBy {
        id
        name
      }
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
      createdBy {
        id
        name
      }
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation AccountMutation($id: ID!) {
    deleteAccount(id: $id) {
      id
    }
  }
`;

export const CREATE_INCOME = gql`
  mutation IncomeMutation($description: String!, $payer: String!, $category: String!, $amount: Float!, $notes: String, $account: ID!) {
    createIncome(description: $description, payer: $payer, category: $category, amount: $amount, notes: $notes, account: $account) {
      id
      payer
      category {
        id
        value
      }
      amount
      description
      notes
      account {
        id
        name
      }
      createdBy {
        id
        name
      }
    }
  }
`;

export const UPDATE_INCOME = gql`
  mutation IncomeMutation($id: ID!, $description: String!, $payer: String!, $category: String!, $amount: Float!, $notes: String, $account: ID!) {
    updateIncome(id: $id, description: $description, payer: $payer, category: $category, amount: $amount, notes: $notes, account: $account) {
      id
      payer
      category {
        id
        value
      }
      amount
      description
      notes
      account {
        id
        name
      }
      createdBy {
        id
        name
      }
    }
  }
`;

export const DELETE_INCOME = gql`
  mutation IncomeMutation($id: ID!) {
    deleteIncome(id: $id) {
      id
      amount
    }
  }
`;

export const CREATE_EXPENSE = gql`
  mutation ExpenseMutation($description: String!, $recipient: String!, $category: String!, $amount: Float!, $notes: String, $account: ID!) {
    createExpense(description: $description, recipient: $recipient, category: $category, amount: $amount, notes: $notes, account: $account) {
      id
      recipient
      category {
        id
        value
      }
      amount
      description
      notes
      account {
        id
        name
      }
      createdBy {
        id
        name
      }
    }
  }
`;

export const UPDATE_EXPENSE = gql`
  mutation ExpenseMutation($id: ID!, $description: String!, $recipient: String!, $category: String!, $amount: Float!, $notes: String, $account: ID!) {
    updateExpense(id: $id, description: $description, recipient: $recipient, category: $category, amount: $amount, notes: $notes, account: $account) {
      id
      recipient
      category {
        id
        value
      }
      amount
      description
      notes
      account {
        id
        name
      }
      createdBy {
        id
        name
      }
    }
  }
`;

export const DELETE_EXPENSE = gql`
  mutation ExpenseMutation($id: ID!) {
    deleteExpense(id: $id) {
      id
      amount
    }
  }
`;

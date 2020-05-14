import gql from 'graphql-tag';

export const ACCOUNT_LIST = gql`
  query AccountListQuery($first: Int, $skip: Int, $orderBy: AccountOrderByInput){
    accountList(first: $first, skip: $skip, orderBy: $orderBy) {
      accounts {
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
      count
      total
    }
  }
`;

export const INCOME_LIST = gql`
  query incomeList($accountId: String){
    incomeList(accountId: $accountId) {
      incomes {
        id
        payer
        category {
          id
          value
        }
        amount
        notes
        description
      },
      count,
      total
    }
  }
`;

export const EXPENSE_LIST = gql`
  query expenseList($accountId: String){
    expenseList(accountId: $accountId) {
      expenses {
        id
        recipient
        category {
          id
          value
        }
        amount
        notes
        description
      },
      count,
      total
    }
  }
`;

export const CATEGORY_LIST = gql`
  query categoryList($transactionType: TransactionType!){
    categoryList(transactionType: $transactionType) {
      categories {
        id
        value
        transactionType
      },
      count
    }
  }
`;

import gql from 'graphql-tag';

export const ACCOUNT_LIST = gql`
  query AccountListQuery($filter: String, $skip: Int, $first: Int, $orderBy: AccountOrderByInput){
    accountList(filter: $filter, first: $first, skip: $skip, orderBy: $orderBy) {
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

export const TRANSACTION_LIST = gql`
  query transactionList($filter: String, $account: ID!, $type: TransactionType, $skip: Int, $first: Int, $orderBy: TransactionOrderByInput){
    transactionList(filter: $filter, account: $account, type: $type, skip: $skip, first: $first, orderBy: $orderBy) {
      transactions {
        id
        amount
        notes
        category {
          id
          value
        }
        description
        from
        to
        type
        createdAt
        updatedAt
      },
      count,
      total
    }
  }
`;

export const CATEGORY_LIST = gql`
  query categoryList {
    categoryList {
      categories {
        id
        value
      },
      count
    }
  }
`;

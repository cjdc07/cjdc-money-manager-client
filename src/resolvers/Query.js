import gql from 'graphql-tag';

export const ACCOUNT_LIST = gql`
  query AccountListQuery($skip: Int!, $first: Int!){
    accounts(first: $first, skip: $skip) {
      accounts {
        id
        name
        balance
        color
        updatedAt
        createdAt
      }
      count
      total
    }
  }
`;

export const TRANSACTION_LIST = gql`
  query transactionList($account: ID!, $type: TransactionType!, $skip: Int!, $first: Int!){
    transactions( account: $account, type: $type, skip: $skip, first: $first) {
      transactions {
        count
        createdAt
        total
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
        }
      }
    }
  }
`;

export const CATEGORY_LIST = gql`
  query categoryList {
    categories {
      categories {
        id
        value
      },
      count
    }
  }
`;

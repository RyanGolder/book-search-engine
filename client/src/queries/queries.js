import { gql } from 'apollo-server';

export const GET_ME = gql`
    query {
        me {
            _id
            username
            email
            bookCount
            savedBooks {
                _id
                authors
                description
                title
                bookId
                image
                link
                createdAt
            }
        }
    }`;
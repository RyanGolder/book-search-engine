import { gql } from 'apollo-server';

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password){
            id
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

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password){
            id
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

export const SAVE_BOOK = gql`
    mutation saveBook($input: SaveBookInput!) {
        saveBook(input: $input){
            id
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

export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!) {
        removeBook(bookId: $bookId){
            id
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
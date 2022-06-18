import {gql} from '@apollo/client'

export const LOAD_TEST = gql`
    {
        categories {
            name
            products {
                id
            }
        }
    }
`;
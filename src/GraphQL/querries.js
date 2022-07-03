const ProductDetailsQuery = `
    query getProduct($product : String!){
        product(id : $product) {
            id
            name
            brand
            gallery
            inStock
            description
            prices {
                currency{
                  symbol
                  label
                }
                amount
            }
            attributes {
                id
                name
                type
                items {
                    displayValue
                    value
                    id
                }
            }
        }
    }
`;

const ProductsQuery = `
    query getProducts($cat: String!){
        category(input:{title: $cat}){
            products{
                id
                name
                gallery
                inStock
                prices{
                    currency{
                        symbol
                        label
                    }
                    amount
                }
            }
        }
    }
`;


const ProductsPriceQuery = `
    query getProduct($product : String!){
        product(id : $product) {
          id
          prices {
            currency{
              symbol
              label
            }
            amount
          }
        }
    }
`;

const categoriesQuery = `
    query {
        categories {
            name
            products {
                id
            }
        }
    }
`;

const currenciesQuery = `
    {
        currencies {
            symbol
            label
        }
    }
`;

export { ProductDetailsQuery, ProductsQuery, ProductsPriceQuery, categoriesQuery, currenciesQuery }
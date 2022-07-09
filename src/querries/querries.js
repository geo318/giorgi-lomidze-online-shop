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

const ProductAttrQuery = `
    query getProduct($product : String!){
        product(id : $product) {
            id
            inStock
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
                brand
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

export { ProductDetailsQuery, ProductAttrQuery, ProductsQuery, ProductsPriceQuery, categoriesQuery, currenciesQuery }
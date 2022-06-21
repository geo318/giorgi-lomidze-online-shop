import React, {Component} from "react";
import fetchQuery from './fetchQuery';

const ProductDetailsQuery = `
    query getProduct($product : String!){
        product(id : $product) {
            id
            name
            brand
            gallery
            inStock
            description
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

export default class Cart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data : [],
        }
    }

    componentDidMount() {
        let array = [];
        this.props.cart.forEach((e) => {
            array.push(fetchQuery(ProductDetailsQuery, {product : e['id']}))
        })

        Promise.all(array).then(data => this.setState({data : data}))
    }


    render() {
        //const cart = this.props.cart;
        return (
            <>
                <h3>cart</h3>
                {console.log(this.state.data)}
                <div className="cart_products">
                    {
                        // cart.map(e => (
                        //         <div>{e['id']}</div>
                        //     )
                        // )
                    }
                </div>
                <div className="total"></div>
            </>
        )
    }
}
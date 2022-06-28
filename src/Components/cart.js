import React, {Component} from "react";
import fetchQuery from './fetchQuery';
import Carousel from "./carousel";

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

export default class Cart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data : [],
            price : [],
            sumTotal : 0,
            loading: true,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.cart.length === this.props.cart.length) return
        this.setState({data : []});
    }

    componentDidMount() {
        console.log(this.state.loading)
        let array = [];
        this.props.cart.forEach((e) => {
            array.push(fetchQuery(ProductDetailsQuery, {product : e['id']}))
        })

        Promise.all(array).then(data => {
            this.setState({data : data});
            this.setState({loading: false})
        })

    }   

    render() {
        console.log(this.state.loading)
        console.log(this.props.calculateSum())
        const cart = this.state.data;
        const tax = 21; // % //
        return (
            <>
                <h3>cart{JSON.stringify(this.props.prices)}</h3>
                <div className="cart_products">
                    {    
                        this.state.loading
                        ? 
                            <div className='loading_wrap'>
                                <div className='loading'/>
                            </div>
                        : 
                            cart.map((el,i) => {
                            let e = el['data']['product']; 
                            return (
                                <div key={e['id']}>
                                    <div>{e['brand']}</div>
                                    <div>{e['name']}</div>
                                    <div>
                                        {   

                                        }
                                        <span>{e['prices'][this.props.switchCurrency(this.props.activeCurrency)]['currency']['symbol']}</span>
                                        <span>{e['prices'][this.props.switchCurrency(this.props.activeCurrency)]['amount']}</span>
                                    </div>
                                    <div dangerouslySetInnerHTML={{__html: e['description']}}></div>
                                    <div>{this.props.cart?.[i]?.['num']}</div>
                                    <div>
                                        <div onClick = {()=> {this.props.adjustCartItemNumber(e['id'],+1); }}>+</div>
                                        <Carousel array = {e['gallery']} alt={`${e['brand']} ${e['name']}`}/>
                                        <div onClick = {()=> {this.props.adjustCartItemNumber(e['id'],-1);}}>-</div>
                                    </div>
                                    <div>
                                        {
                                            e['attributes'].map((items,i) => (                                                       
                                                <div key = {i}>
                                                    <span>{items['name']}</span>
                                                    <ul>
                                                        {
                                                            items['items'].map(i => (
                                                                <li key = {i['id']} id= {i['id']}>{i['value']}</li>
                                                            ))
                                                        }
                                                    </ul>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )})
                    }
                </div>
                <div className="total">
                    <div><span>{`Tax ${tax}%:`}</span><span>{(this.props.calculateSum() * tax / 100).toFixed(2)}</span></div>
                    <div><span>quantity</span><span>{ this.props.cartItemNum }</span></div>
                    <div><span>{`Tax ${tax}%:`}</span><span>{this.props.calculateSum().toFixed(2)}</span></div>
                </div>
            </>
        )
    }
}
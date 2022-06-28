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

    componentDidMount() {
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
        const cart = this.state.data;
        const tax = 21; // % //
        return (
            <>
                <h3 className="cart_header">cart</h3>
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
                                this.props.cart?.[i]?.['num'] > 0 &&
                                <div key={e['id']} className='flx'>
                                    <div className="lft flx-c grow">
                                        <div className="name">{e['brand']}</div>
                                        <div className="sub">{e['name']}</div>
                                        <div className="price">
                                            <span>{e['prices'][this.props.switchCurrency(this.props.activeCurrency)]['currency']['symbol']}</span>
                                            <span>{e['prices'][this.props.switchCurrency(this.props.activeCurrency)]['amount']}</span>
                                        </div>
                                        {/* <div dangerouslySetInnerHTML={{__html: e['description']}}></div> */}
                                        <div className="attr">
                                            {
                                                e['attributes'].map((items,i) => (                                                       
                                                    <div key = {i}>
                                                        <span className="attr-name">{items['name']}:</span>
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
                                    <div className="rgt flx">
                                        <div className="cart-ctr flx flx-c">
                                            <div className="plus flx flx-hc" onClick = {()=> {this.props.adjustCartItemNumber(e['id'],+1); }}/>
                                            <div className="cart-num grow flx">{this.props.cart?.[i]?.['num']}</div>
                                            <div className="minus flx flx-hc" onClick = {()=> {this.props.adjustCartItemNumber(e['id'],-1);}}/>
                                        </div>
                                        <div className="carousel">
                                            <Carousel array = {e['gallery']} alt={`${e['brand']} ${e['name']}`}/>
                                        </div>
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
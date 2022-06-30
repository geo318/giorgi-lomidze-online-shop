import React, {Component} from "react";
import fetchQuery from './fetchQuery';
import Carousel from "./carousel";
import {BrowserRouter as Router, Link} from 'react-router-dom';

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
            loading : true,
            render : false
        }
        this.fetchCartItems = this.fetchCartItems.bind(this);
    }

    componentDidMount() {
        this.fetchCartItems()
    }

    fetchCartItems() {
        let array = [];
        this.props.appProps.state.cart.forEach((e) => {
            array.push(fetchQuery(ProductDetailsQuery, {product : e['id']}))
        })

        Promise.all(array).then(data => {
            this.setState({data : data});
            this.setState({loading: false})
            this.setState({cartNum : this.state.data.length })
        })
        this.setState({render : false})
    }

    componentDidUpdate(prevProps,prevState,snapshot) {
        if(this.state.render !== prevState.render)
            return this.fetchCartItems()
    }

    render() {
        const cart = this.state.data;
        const cartParams = this.props.appProps.state.cartItemParams;
        const cartItemNum = this.props.appProps.state.cartItemNum;
        const tax = 21; // % //
        return (
            <>
                {this.props.check == null && <h3 className="cart_header">cart</h3>}
                {this.props.check && <div className="cart-drop-header"><span>My Bag,</span><span>{` ${cartItemNum} item${cartItemNum > 1 ? 's' : ""}`}</span></div>}
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
                                <div key={e['id']} className='flx'>
                                    {console.log(i,this.props.appProps.state.cart[i]?.num)}
                                    <div className="lft flx-c grow">
                                        <div className="name">{e['brand']}</div>
                                        <div className="sub">{e['name']}</div>
                                        <div className="price">
                                            <span>{e['prices'][this.props.appProps.switchCurrency(this.props.appProps.state.activeCurrency)]['currency']['symbol']}</span>
                                            <span>{e['prices'][this.props.appProps.switchCurrency(this.props.appProps.state.activeCurrency)]['amount']}</span>
                                        </div>
                                        {/* <div dangerouslySetInnerHTML={{__html: e['description']}}/> */}
                                        <div className="attr">
                                            {
                                                e['attributes'].map((items,i) => (                                                       
                                                    <div key = {i}>
                                                        <span className="attr-name">{items['name']}:</span>
                                                        <ul className="flx">
                                                            {
                                                                items['items'].map(i => (
                                                                    <li className={  i['value'] === cartParams?.[cartParams.findIndex((el)=> el.id === e.id)]?.attr[cartParams?.[cartParams.findIndex((el)=> el.id === e.id)]?.attr.findIndex((el)=>el.name === items['name'])]?.param ? 'active-param' : null  } 
                                                                        onClick = {() => this.props.appProps.setItemParameters(e['id'], items['name'], i['value'])} key = {i['id']} data-value={i['id']}>
                                                                        {
                                                                            items.id === 'Color'
                                                                            ? <div className="color-batch" style={ {backgroundColor : i['value']} }/>
                                                                            : <div className="attr-txt">{i['value']}</div>
                                                                        }
                                                                    </li>
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
                                            <div className="plus flx flx-hc" onClick = {()=> {this.props.appProps.adjustCartItemNumber(e['id'],+1); }}/>
                                            <div className="cart-num grow flx">{this.props.appProps.state.cart?.[i]?.['num']}</div>
                                            <div className="minus flx flx-hc" onClick = {()=> {this.props.appProps.adjustCartItemNumber(e['id'],-1); this.props.appProps.state.cart?.[i]?.['num'] > 0 && this.setState({render : true})}}/>
                                        </div>
                                        <div className="carousel">
                                            <Carousel check = {this.props.check} array = {e['gallery']} alt={`${e['brand']} ${e['name']}`}/>
                                        </div>
                                    </div>
                                </div>
                            )})
                    }
                </div>
                <div className="total">
                    { this.props.check == null && <div><span>{`Tax ${tax}%:`}</span><span>{this.props.appProps.state.symbol}{(this.props.appProps.calculateSum() * tax / 100).toFixed(2)}</span></div> }
                    { this.props.check == null && <div><span>quantity:</span><span>{ this.props.appProps.state.cartItemNum }</span></div> }
                    <div><span>total</span><span>{this.props.appProps.state.symbol}{this.props.appProps.calculateSum().toFixed(2)}</span></div>
                    { this.props.check == null && <button className="order">order</button> }
                    {
                        this.props.check && 
                        
                            <Link to = "/cart">
                                <button className="order" onClick = {()=>this.props.close()}>cart</button>
                            </Link>
                    }
                </div>
            </>
        )
    }
}
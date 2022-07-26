import React, {Component} from "react";
import fetchQuery from '../querries/fetchQuery';
import Carousel from "./page-components/carousel";
import { Link } from 'react-router-dom';
import { ProductDetailsQuery } from "../querries/querries";
import Attributes from "./page-components/attributes";
import Price from "./page-components/price";
import Loading from "./page-components/loading";

export default class Cart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data : [],
            loading : true,
            render : false,
        }
        this.fetchCartItems = this.fetchCartItems.bind(this);
        this.removeCartItems = this.removeCartItems.bind(this);
    }

    componentDidMount() {
        this.fetchCartItems();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.data.length !== this.state.data.length) {
            localStorage.setItem('cart-data', JSON.stringify(this.state.data))
            this.fetchCartItems();
            return
        }
        if(prevProps.num !== this.props.num)
            return this.fetchCartItems();

        if(this.state.render !== prevState.render)
            return this.fetchCartItems();
    }

    removeCartItems(index) {
        this.setState({ data : [...this.state.data.slice(0,index),...this.state.data.slice(index+1)] })
    }

    fetchCartItems(index) {
        if(index) this.removeCartItems(index)
        let array = [];
        this.props.appProps.state.cart.forEach((e) => {
            array.push(fetchQuery(ProductDetailsQuery, { product : e['id'] }));
        })

        Promise.all(array).then(data => {
            this.setState({data : data});
            this.setState({loading: false});
        })

        this.setState({ render : false });
    }

    render() {
        const cart = localStorage.getItem('cart-data')? JSON.parse(localStorage.getItem('cart-data')) : this.state.data;
        const cartParams = this.props.appProps.state.cart;
        const cartItemNum = this.props.appProps.state.cartItemNum;
        const tax = 21; // % //
        return (
            <>  
                { this.props.check == null && <h3 className="cart_header">cart</h3> }
                { this.props.check && <div className="cart-drop-header"><span>My Bag,</span><span>{` ${cartItemNum} item${cartItemNum > 1 ? 's' : ""}`}</span></div> }
                <div className="cart_products">
                    {
                        this.state.loading
                        ? 
                            <Loading/>
                        : 
                            cart.map((el,i) => {
                            let e = el['data']['product']; 
                            return (                                
                                <div key={i} className='flx'>
                                    <div className="lft flx-c grow">
                                        <div className="name">{e['brand']}</div>
                                        <div className="sub">{e['name']}</div>
                                        <div className="price">
                                            <Price price = {e} appProps = {this.props.appProps}/>
                                        </div>
                                        <div className="attr">
                                            <Attributes elem = {e} index = {i} params = {cartParams} addToCart = {this.props.appProps.addToCart} check = {this.props.check}/>
                                        </div>
                                    </div>
                                    <div className="rgt flx">
                                        <div className="cart-ctr flx flx-c">
                                            <div className="plus flx flx-hc" onClick = {()=> { this.props.appProps.addToCart({ id : e['id'], index: i, increment : true}); }}/>
                                            <div className="cart-num grow flx">{this.props.appProps.state.cart?.[i]?.['num']}</div>
                                            <div className="minus flx flx-hc" onClick = {()=> {this.props.appProps.addToCart({ id : e['id'], index: i, decrement : true}); this.props.appProps.state.cart?.[i]?.['num'] === 0 && this.setState({render : true}) && this.fetchCartItems(i)}}/>
                                        </div>
                                        <div className="carousel" onClick = {()=> {this.props.appProps.setCartProps(cartParams, i, e.id); this.props.appProps.setIndex(i); this.props.appProps.linkedFromCart(true)}}>
                                            
                                            <Carousel isCart = {this.props.appProps.state.linkedFromCart} setHistory = {this.props.appProps.setHistory} id = {e.id} click={this.props.appProps.setProductId} close = {this.props.close} check = {this.props.check} array = {e['gallery']} alt={`${e['brand']} ${e['name']}`}/>
                                           
                                        </div>
                                    </div>
                                </div>
                            )})
                    }
                </div>
                <div className="total">
                    { this.props.check == null && <div><span>{`Tax ${tax}%:`}</span><span>{ this.props.appProps.state.symbol }{ (this.props.appProps.calculateSum() * tax / 100).toFixed(2)}</span></div> }
                    { this.props.check == null && <div><span>quantity:</span><span>{ this.props.appProps.state.cartItemNum }</span></div> }
                    <div><span>total</span><span>{this.props.appProps.state.symbol }{ this.props.appProps.calculateSum().toFixed(2) }</span></div>
                    { this.props.check == null && <button className="order">order</button> }
                    {
                        this.props.check && 
                        <div className="cart-dropdown-footer flx">
                            <Link className = "footer-but" to = "/cart" >
                                <button className="order view-bag" onClick = { ()=> {this.props.close(); this.props.appProps.setHistory(`/cart`) }}>view bag</button>
                            </Link>
                            <button className="footer-but order checkout" onClick = { ()=>this.props.close() }>check out</button>
                        </div>
                    }
                </div>
            </>
        )
    }
}
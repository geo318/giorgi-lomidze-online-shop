import React, {Component} from "react";
import fetchQuery from '../querries/fetchQuery';
import Carousel from "./page-components/carousel";
import { BrowserRouter as Router, Link } from 'react-router-dom';
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
    }

    componentDidMount() {
        this.fetchCartItems();
    }

    componentDidUpdate(prevProps,prevState,snapshot) {
        if(this.state.data.length > 0 && prevState.data.length !== this.state.data.length)
            return localStorage.setItem('cart-data',JSON.stringify(this.state.data))

        if(this.state.render !== prevState.render)
            return this.fetchCartItems();
    }

    fetchCartItems() {
        let array = [];
        this.props.appProps.state.cart.forEach((e) => {
            array.push(fetchQuery(ProductDetailsQuery, { product : e['id'] }));
        })

        Promise.all(array).then(data => {
            this.setState({data : data});
            this.setState({loading: false});
            this.setState({cartNum : this.state.data.length });
        })
        this.setState({ render : false });
    }

    render() {
       
        const cart = this.state.data.length > 0 ? this.state.data : localStorage.getItem('cart-data')? JSON.parse(localStorage.getItem('cart-data')) : [];
        const cartParams = this.props.appProps.state.cartItemParams;
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
                                <div key={e['id']} className='flx'>
                                    <div className="lft flx-c grow">
                                        <div className="name">{e['brand']}</div>
                                        <div className="sub">{e['name']}</div>
                                        <div className="price">
                                            <Price price = {e} appProps = {this.props.appProps}/>
                                        </div>
                                        <div className="attr">
                                            <Attributes elem = {e} params = {cartParams} setItemParameters = {this.props.appProps.setItemParameters}/>
                                        </div>
                                    </div>
                                    <div className="rgt flx">
                                        <div className="cart-ctr flx flx-c">
                                            <div className="plus flx flx-hc" onClick = {()=> {this.props.appProps.adjustCartItemNumber(e['id'],+1); }}/>
                                            <div className="cart-num grow flx">{this.props.appProps.state.cart?.[i]?.['num']}</div>
                                            <div className="minus flx flx-hc" onClick = {()=> {this.props.appProps.adjustCartItemNumber(e['id'],-1); this.props.appProps.state.cart?.[i]?.['num'] > 0 && this.setState({render : true})}}/>
                                        </div>
                                        <div className="carousel">
                                            <Link to = {`/products/${e.id}`} className='link' onClick={()=> {this.props.appProps.setProductId(e.id); this.props.appProps.close()}}>
                                                <Carousel check = {this.props.check} array = {e['gallery']} alt={`${e['brand']} ${e['name']}`}/>
                                            </Link>
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
                            <Link className = "footer-but" to = "/cart">
                                <button className="order view-bag" onClick = { ()=>this.props.close() }>view bag</button>
                            </Link>
                            <button className="footer-but order checkout" onClick = { ()=>this.props.close() }>check out</button>
                        </div>
                    }
                </div>
            </>
        )
    }
}
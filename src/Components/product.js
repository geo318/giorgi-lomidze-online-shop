import React from "react";
import fetchQuery from "../querries/fetchQuery";
import { ProductDetailsQuery } from "../querries/querries";
import Attributes from "./page-components/attributes";
import Price from "./page-components/price";
import Loading from "./page-components/loading";
import Parser from 'html-react-parser';

export default class Product extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            product : [],
            currentImg : 0
        }
        this.fetchProduct = this.fetchProduct.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.id !== this.props.id) {
            this.fetchProduct(this.props.id)
        }
    }
    
    componentDidMount() {
        let productID =
        this.props.appProps.state.productID
        ? this.props.appProps.state.productID 
        : JSON.parse(localStorage.getItem('app-state'))['productID'];
        this.fetchProduct(productID)
        
        this.setState({currentImg : 0});
    }

    fetchProduct(productID) {
        fetchQuery(ProductDetailsQuery, {product : productID}).then(data => this.setState({product : data}));
    }

    addToCart() {
        let cartParams = this.props.appProps.state.cartItemParams;
        let index = cartParams.findIndex(e => e.id === this.props.appProps.state.productID);

        if(index < 0 || cartParams[index]['attr'].length !== this.state.product['data']['product']['attributes'].length ) return

        this.props.appProps.addToCart(this.props.appProps.state.productID);
    }
    
    render() {
        const params = this.props.appProps.state.cartItemParams;
        const elem = this.state.product?.['data']?.['product'];
        return (
            <>
                {  
                    elem
                    ?   <div className='flx pr-wrap'>
                            <div className="rgt flx">
                                <div className="image-set flx">
                                    <div className="thumbnails flx flx-c">
                                        {
                                            elem?.['gallery'].map((img,i) => {
                                                return <div className = "thumb flx" onClick={()=> this.setState({currentImg : i})} key = {i}><img src={img ? img : "loading"} alt = ""/></div>
                                            })
                                        }
                                    </div>
                                    <img  className="active-image" src={elem['gallery'][this.state.currentImg]} alt={`${elem['brand']} ${elem['name']}`}/>
                                </div>
                            </div>
                            <div className="lft flx-c pr-desc">
                                <div className="name">{elem['brand']}</div>
                                <div className="sub">{elem['name']}</div>
                                <div className="attr">
                                    <Attributes elem = {elem} params = {params} setItemParameters = {this.props.appProps.setItemParameters}/>
                                </div>
                                <div className="attr-name">price:</div>
                                <div className="price">
                                    <Price price = {elem} appProps = {this.props.appProps}/>
                                </div>
                                <div className="pr-buy">
                                    <button className="footer-but order checkout" onClick = { ()=> elem.inStock && this.addToCart() }>add to cart</button>
                                </div>
                                <div className="pr-footer-desc">
                                    { Parser(elem['description']) }
                                </div>
                            </div>
                        </div>
                    :   <Loading/>
                        
                }
            </>
            
        )
    }
}
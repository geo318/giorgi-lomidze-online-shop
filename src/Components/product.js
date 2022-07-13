import React from "react";
import fetchQuery from "../querries/fetchQuery";
import { ProductDetailsQuery } from "../querries/querries";
import Price from "./page-components/price";
import Loading from "./page-components/loading";
import Parser from 'html-react-parser';

export default class Product extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            product : [],
            currentImg : 0,
            attributes: []
        }
        this.fetchProduct = this.fetchProduct.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.id !== this.props.id) {
            this.fetchProduct(this.props.id)
        }
        if(prevProps.cartItemIndex !== this.props.cartItemIndex) {
            if(this.props.appProps.state.attributesPassed.id !== this.props.appProps.state.productID) return
            this.setState({ attributes : this.props.appProps.state.attributesPassed.attr })
        }
    }

    componentDidMount() {
        if(this.props.appProps.state.attributesPassed.attr) {
            this.setState({ attributes : this.props.appProps.state.attributesPassed.attr })
        }
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

        if(this.state.attributes.length !== this.state.product['data']['product']['attributes'].length ) return

        this.props.appProps.addToCart({ id: this.props.appProps.state.productID, operation: +1, price: this.state.product['data']['product']['prices'], attrArray: this.state.attributes });
    }

    setAttributes(name, param) {
        let index = this.state.attributes.findIndex(e => e.name === name)
        if(index < 0) {
            this.setState({ attributes : [...this.state.attributes, {name : name, param : param} ] })
            return
        }
        this.setState({ attributes : [...this.state.attributes.slice(0,index), {name : name, param : param},...this.state.attributes.slice(index + 1) ] })
    }
    
    render() {
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
                                    {
                                        elem['attributes'].map((items,index) => (                                                       
                                            <div key = {index}>
                                                <span className="attr-name">{items['name']}:</span>
                                                <ul className="flx">
                                                    {
                                                        items['items'].map((i,indx) => {
                                                            return (
                                                                <li key={indx} 
                                                                    className = { 
                                                                        this.state.attributes[this.state.attributes?.findIndex(e => e.name === items.name)]?.param === i['value'] 
                                                                        ? 'active-param' 
                                                                        : null
                                                                    }
                                                                    onClick = { () => elem.inStock && this.setAttributes(items['name'], i['value']) }
                                                                    data-value = { i['id'] }
                                                                >
                                                                    {
                                                                        items.id === 'Color'
                                                                        ? <div className="color-batch" style={ {backgroundColor : i['value']} }/>
                                                                        : <div className="attr-txt">{ i['value'] }</div>
                                                                    }
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        ))
                                    }
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
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
            attributes: [],
        }
        this.fetchProduct = this.fetchProduct.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
    
        if(prevProps.id !== this.props.id) {
            this.fetchProduct(this.props.id)
        }

        if(prevProps.history.length !== this.props.history.length) {
            localStorage.setItem('product-attributes', JSON.stringify(this.state.attributes));
            if(this.props.history.pop() !== '/dropdown-cart'){
                this.setState({attributes : []})
            }
        }
    }

    componentDidMount() {
        let localState = JSON.parse(localStorage.getItem('product-attributes'));
        if(localState && this.props.linkedFromCart) this.setState({attributes: localState});

        let productID =
        this.props.appProps.state.productID
        ? this.props.appProps.state.productID 
        : JSON.parse(localStorage.getItem('app-state'))?.['productID'];

        this.fetchProduct(productID)
        this.setState({currentImg : 0});
    }

    fetchProduct(productID) {
        fetchQuery(ProductDetailsQuery, {product : productID}).then(data => this.setState({product : data}));
    }

    addToCart() {
        let attributes = this.state.attributes.length > 0 ? this.state.attributes : this.props.appProps.state.attributesPassed.attr
        if(attributes?.length !== this.state.product['data']['product']['attributes'].length) return

        this.props.appProps.addToCart({ id: this.props.appProps.state.productID, price: this.state.product['data']['product']['prices'], attrArray: attributes });
    }

    setAttributes(name, param) {
        const attrPassed = this.props.appProps.state.attributesPassed.attr;
        let attributes = attrPassed?.length > 0 && attrPassed.length !== this.state.attributes.length ? attrPassed : this.state.attributes;

        let index = attributes.findIndex(e => e.name === name)
        if(index < 0) {
            this.setState({ attributes : [...this.state.attributes, {name : name, param : param}] })
            return
        }
        this.setState({ attributes : [...attributes.slice(0, index), {name : name, param : param},...attributes.slice(index + 1) ] })
    }

    render() {
        const attributes = this.state.attributes.length > 0 ? this.state.attributes : this.props.appProps.state.attributesPassed.attr
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
                                    {
                                        !elem.inStock && <div className="outOfStock flx">out of stock</div>
                                    }
                                </div>
                            </div>
                            <div className="lft flx-c pr-desc">
                                <div className="name">{elem['brand']}</div>
                                <div className="sub">{elem['name']}</div>
                                {
                                    !elem.inStock && <div className="attr">Out of stock</div>
                                }
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
                                                                        attributes?.[attributes?.findIndex(e => e.name === items.name)]?.param === i['value']
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
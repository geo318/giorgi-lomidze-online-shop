import React from "react";
import fetchQuery from "./fetchQuery";

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

export default class Product extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            product : [],
            currentImg : 0
        }
    }
    componentDidMount() {
        let productID;
        this.props.appProps.state.productID ? productID = this.props.appProps.state.productID : productID = JSON.parse(localStorage.getItem('app-state'))['productID'];

        fetchQuery(ProductDetailsQuery, {product : productID}).then(data => this.setState({product : data}))
        this.setState({currentImg : 0})
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
                                            elem['gallery'].map((img,i) => {
                                                return <div className = "thumb flx" onClick={()=> this.setState({currentImg : i})} key = {i}><img src={img} alt = ""/></div>
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
                                        elem['attributes'].map((items,i) => (                                                       
                                            <div key = {i}>
                                                <span className="attr-name">{items['name']}:</span>
                                                <ul className="flx">
                                                    {
                                                        items['items'].map(i => (
                                                            <li className={ i['value'] === params?.[params.findIndex((el)=> el.id === elem.id)]?.attr[params?.[params.findIndex((el)=> el.id === elem.id)]?.attr.findIndex((el)=>el.name === items['name'])]?.param ? 'active-param' : null } 
                                                                onClick = {() => this.props.appProps.setItemParameters(elem['id'], items['name'], i['value'])} key = {i['id']} data-value={i['id']}>
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
                                <div className="attr-name">price:</div>
                                <div className="price">
                                    <span>{elem['prices'][this.props.appProps.switchCurrency(this.props.appProps.state.activeCurrency)]['currency']['symbol']}</span>
                                    <span>{elem['prices'][this.props.appProps.switchCurrency(this.props.appProps.state.activeCurrency)]['amount']}</span>
                                </div>
                                <div className="pr-buy">
                                    <button className="footer-but order checkout" onClick = { ()=> this.addToCart() }>add to cart</button>
                                </div>
                                <div className="pr-footer-desc" dangerouslySetInnerHTML={{__html: elem['description']}}/>
                            </div>
                        </div>
                    :   <div className='loading_wrap'>
                            <div className='loading'/>
                        </div>
                        
                }
            </>
            
            
        )
    }
}
import React from 'react';
import fetchQuery from './fetchQuery';
import CartSVG from '../icons/cartSVG';
import Header from './header';

const ProductsQuery = `
    query getProducts($cat: String!){
        category(input:{title: $cat}){
            products{
                id
                name
                gallery
                inStock
                prices{
                    currency{
                        symbol
                        label
                    }
                    amount
                }
            }
        }
    }
`;

class Category extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeCategory : this.props.activeCategory,
            categories: [],
            data : [],
            hoverId : null
        }
        this.productsFetch = this.productsFetch.bind(this);
        this.switchCurrency = this.switchCurrency.bind(this);
        this.cardHover = this.cardHover.bind(this);
        this.addToCart = this.addToCart.bind(this);
    }

    productsFetch(category) {
        fetchQuery(ProductsQuery, {cat : category})
        .then(data => {
            //loading spinner simulation?????????????????????????????????????????????????
            setTimeout(() =>
                this.setState( {data : data['data']} ), 500
            )
        })
    }

    componentDidMount() {
        this.productsFetch(this.state.activeCategory)
    }

    static getDerivedStateFromProps(props, state) {
        if(props.activeCategory !== state.activeCategory){
            return { activeCategory: props.activeCategory }
        }
        return null;
    }

    
    componentDidUpdate(prevProps, prevState) {
        this._isMounted = true;
        if(prevState.activeCategory !== this.state.activeCategory && this._isMounted === true)
        this.productsFetch(this.props.activeCategory)
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    switchCurrency(cur) {
        switch(cur) {
            case "GBP": 
                return '1'
            case "AUD": 
                return '2'
            case "JPY": 
                return '3'
            case "RUB": 
                return '4'
            default:
                return '0'
        }
    }

    cardHover(id) {
        return (
            <div className='hover_cart' onClick={() => this.addToCart(id)}>
               { <CartSVG fill="#fff"/> }
            </div>
        )
    }

    addToCart(id) {
        this.props.addToCart(id)
    }

    render() {
        return (
            <> 
                <div className='main'>
                    <div className='wrapper'>
                        <h2 className='g_h2'>{this.state.activeCategory}</h2>

                        <div className='gallery'>
                            {
                                this.state.data['category']?.['products']
                                ? this.state.data['category']['products'].map((e,i) => (
                                     
                                        <div 
                                            key = {e['id']} 
                                            className = { `${e.inStock === false ? "noStock" : ""} ${i % 3 === 0 ? "product_wrap no_padding" : "product_wrap"}`}
                                            onMouseEnter = { ()=> this.setState({hoverId : e['id']}) }
                                            onMouseLeave = { ()=> this.setState({hoverId :null}) }
                                        >
                                            <div className = "img_wrap">
                                                <img src={e['gallery'][0]} alt={e['name']}/>
                                                { e.inStock === false ? <div className="outOfStock flx">out of stock</div> : null }
                                                { e['id'] === this.state.hoverId && e.inStock === true ? this.cardHover(e['id']) : null }
                                            </div>
                                            <div className="desc">
                                                <p>{e['name']}</p>
                                                <div>
                                                    <span>{e['prices'][this.switchCurrency(this.props.activeCurrency)]['currency']['symbol']}</span>
                                                    <span>{e['prices'][this.switchCurrency(this.props.activeCurrency)]['amount']}</span>
                                                </div>
                                            </div>
                                        </div>
                                    
                                ))
                                : <div>...loading</div>
                            }
                        </div>

                        <div className='left'>
                            {
                                this.state.categories
                                ? this.state.categories.map((e,i)=> (
                                    <a key = {i} href = "/"><span>{ e['name'] }</span></a>
                                )) 
                                : <div>loading...</div>
                            }
                        </div>

                    </div>
                </div>
            </>
        )
    }
}


export default Category;
import React from 'react';
import fetchQuery from './fetchQuery';
import CartSVG from '../icons/cartSVG';

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
            categories: [],
            data : [],
        }
        this.productsFetch = this.productsFetch.bind(this);
        this.cardHover = this.cardHover.bind(this);
    }

    async productsFetch(category) {
        await fetchQuery(ProductsQuery, {cat : category})
        .then(data => this.setState( {data : data['data']} ))
    }

    componentDidMount() {
        this.productsFetch(this.props.activeCategory)
    }
   
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.activeCategory !== this.props.activeCategory) {
            this.productsFetch(this.props.activeCategory)
            return
        }

        if(prevProps.activeCurrency !== this.props.activeCurrency) {
            fetchQuery(ProductsQuery, {cat : 'all'})
            .then(data => data.data.category.products.forEach(e => {
                this.props.prices.forEach(el => {
                    if(e['id'] === el['id'])
                    this.props.itemPrice(e['id'], e['prices'][this.props.switchCurrency(this.props.activeCurrency)]['amount'])
                })
            }))
        }
    }

    cardHover(id, amount) {
        this.props.addToCart(id, +1);
        this.props.itemPrice(id, amount);
    }

    render() {
        return (
            <> 
                <h2 className='g_h2'>{this.props.activeCategory}</h2>
                <div className='gallery'>
                    {
                        this.state.data['category']?.['products']
                        ? this.state.data['category']['products'].map((e,i) => (
                                
                                <div 
                                    key = {e['id']} 
                                    className = { `${e.inStock === false ? "noStock" : ""} ${i % 3 === 0 ? "product_wrap no_padding" : "product_wrap"}`}
                                    onMouseEnter = { ()=> this.setState({hoverId : e['id']})}
                                    onMouseLeave = { ()=> this.setState({hoverId :null}) }
                                >
                                    <div className = "img_wrap">
                                        <img src={e['gallery'][0]} alt={e['name']}/>
                                        { 
                                            e.inStock 
                                            ?   <div className='hover_cart' onClick={() => this.cardHover(e['id'],e['prices'][this.props.switchCurrency(this.props.activeCurrency)]['amount'])}>
                                                    { <CartSVG fill="#fff"/> }
                                                </div>
                                            : <div className="outOfStock flx">out of stock</div>
                                        }
                                    </div>
                                    <div className="desc">
                                        <p>{e['name']}</p>
                                        <div>
                                            <span>{e['prices'][this.props.switchCurrency(this.props.activeCurrency)]['currency']['symbol']}</span>
                                            <span>{e['prices'][this.props.switchCurrency(this.props.activeCurrency)]['amount']}</span>
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
            </>
        )
    }
}


export default Category;
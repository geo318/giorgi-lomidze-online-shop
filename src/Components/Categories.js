import React from 'react';
import fetchQuery from './fetchQuery';
import CartSVG from '../icons/cartSVG';
import {BrowserRouter as Router, Link} from 'react-router-dom'

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
            page : 6,
            loading : false,
            dataLength : 0
        }
        this.productsFetch = this.productsFetch.bind(this);
        this.cardHover = this.cardHover.bind(this);
        this.onScroll = this.onScroll.bind(this)
        this.setScrollState = this.setScrollState.bind(this);
    }

    componentDidMount() {
        let localState = JSON.parse(localStorage.getItem('cat-state'));
        if(localState) this.setState(localState)

        this.productsFetch(this.props.activeCategory)
        this.onScroll()
    }

    componentDidUpdate(prevProps, prevState) {
        localStorage.setItem('cat-state', JSON.stringify(this.state))

        if(prevProps.activeCategory !== this.props.activeCategory) {
            this.setState({data : []})
            this.productsFetch(this.props.activeCategory)
            return
        }
            
        if(prevState.page < this.state.page)
            return this.productsFetch(this.props.activeCategory)
    }

    async productsFetch(category) {
        await fetchQuery(ProductsQuery, {cat : category})
        .then(data => {
            this.setState({loading : true})
            const resultData = data['data']['category']['products'];
            
            // to mimic loading data from server
            setTimeout(() => {
                this.setState({dataLength : resultData.length})
                this.setState( {data : resultData.slice(0, this.state.page)})
                
            this.setState({loading : false})
            }, 350);    
        })
    }
    
    onScroll() {
        const scrolled = () => {
            if( this.state.dataLength < this.state.page) return
            if(
                window.innerHeight + document.documentElement.scrollTop 
                === document.documentElement.offsetHeight
            ) {
            this.setScrollState()
            }
        }
        window.addEventListener("scroll", scrolled);
    }

    setScrollState() {
        this.setState({page : this.state.page + 6})
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
                        this.state.data &&
                        this.state.data.map((e,i) => (
                                
                                <div 
                                    key = {e['id']} 
                                    className = { `${e.inStock === false ? "noStock" : ""} ${i % 3 === 0 ? "product_wrap no_padding" : "product_wrap"}`}
                                    onMouseEnter = { ()=> this.setState({hoverId : e['id']})}
                                    onMouseLeave = { ()=> this.setState({hoverId :null}) }
                                >
                                    
                                        <div className = "img_wrap">
                                            <Link to = {`/products/${e.id}`} className='link' onClick={()=> this.props.setProductId(e.id)}>
                                                <img src={e['gallery'][0]} alt={e['name']}/>
                                            </Link>
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
                    }
                </div>
                {   
                    this.state.loading && 
                    <div className='loading_wrap'>
                        <div className='loading'/>
                    </div>
                }

            </>
        )
    }
}


export default Category;
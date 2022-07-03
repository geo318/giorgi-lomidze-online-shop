import React from 'react';
import fetchQuery from '../querries/fetchQuery';
import CartSVG from '../icons/cartSVG';
import {BrowserRouter as Router, Link} from 'react-router-dom'
import { ProductsQuery } from '../querries/querries';
import Price from './page-components/price';
import Loading from './page-components/loading';

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
        this.onScroll = this.onScroll.bind(this);
        this.setScrollState = this.setScrollState.bind(this);
    }

    componentDidMount() {
        this.productsFetch(this.props.appProps.state.category)
        this.onScroll()
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.category !== this.props.category) {
            this.setState({data : []});
            this.productsFetch(this.props.category);
            return
        }
            
        if(prevState.page < this.state.page)
            return this.productsFetch(this.props.appProps.state.category)
    }

    async productsFetch(category) {
        await fetchQuery(ProductsQuery, {cat : category})
        .then(data => {
            this.setState({loading : true});
            const resultData = data['data']['category']['products'];
            
            // to mimic loading data from server
            setTimeout(() => {
                this.setState({ dataLength : resultData.length });
                this.setState({ data : resultData.slice(0, this.state.page) });
                
            this.setState({ loading : false });
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
            this.setScrollState();
            }
        }
        window.addEventListener("scroll", scrolled);
    }

    setScrollState() {
        this.setState({page : this.state.page + 6});
    }

    cardHover(id, amount) {
        this.props.appProps.addToCart(id, +1);
        this.props.appProps.itemPrice(id, amount);
    }

    render() {
        return (
            <> 
                <h2 className='g_h2'>{ this.props.appProps.state.category }</h2>
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
                                            <Link to = {`/products/${e.id}`} className='link' onClick={()=> this.props.appProps.state.setProductId(e.id)}>
                                                <img src={e['gallery'][0]} alt={e['name']}/>
                                            </Link>
                                            { 
                                                e.inStock 
                                                ?   <div className='hover_cart' onClick={() => this.cardHover(e['id'],e['prices'][this.props.appProps.switchCurrency(this.props.appProps.state.activeCurrency)]['amount'])}>
                                                        { <CartSVG fill="#fff"/> }
                                                    </div>
                                                : <div className="outOfStock flx">out of stock</div>
                                            }
                                        </div>
                                        <div className="desc">
                                            <p>{e['name']}</p>
                                            <div className='cat-price'>
                                                <Price price = {e} appProps = {this.props.appProps}/>
                                            </div>
                                        </div>
                                </div>
                            
                        ))
                    }
                </div>
                {   
                    this.state.loading && 
                    <Loading/>
                }

            </>
        )
    }
}


export default Category;
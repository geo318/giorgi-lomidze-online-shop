import React from 'react';
import fetchQuery from '../querries/fetchQuery';
import CartSVG from '../icons/cartSVG';
import { Link } from 'react-router-dom'
import { ProductsQuery } from '../querries/querries';
import Price from './page-components/price';
import Loading from './page-components/loading';
import { ProductAttrQuery } from '../querries/querries';

class Category extends React.Component {
    constructor(props) {
        super(props)
        this.gallery = React.createRef();
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
        this.scrollCheck()
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.dataLength < this.state.dataLength) {   
            this.scrollCheck()
        }
        if(prevProps.category !== this.props.category) {
            this.setState({ data : [] });
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
            
            this.setState({ dataLength : resultData.length });
            this.setState({ data : resultData.slice(0, this.state.page) });
                
            this.setState({ loading : false });
        })
    }

    scrollCheck() {
        if(this.state.dataLength < this.state.page) return
        while(this.gallery.current.offsetHeight + this.gallery.current.offsetTop < window.innerHeight - 50) {
            return this.setScrollState();
        }
    }
    
    onScroll() {
        const scrolled = () => {
            if(this.state.dataLength < this.state.page) return
            if(
                window.innerHeight + document.documentElement.scrollTop + 10
                >= document.documentElement.offsetHeight
            ) {
            this.setScrollState();
            }
        }
        window.addEventListener("scroll", scrolled);
    }

    setScrollState() {
        this.setState({ page : this.state.page + 6 });
    }

    async cardHover(id, amount) {

        await fetchQuery(ProductAttrQuery, {product : id}).then(data => {
            let attributesArray = data.data?.product?.attributes;
            let attrDefArray= [];
            attributesArray.forEach(e => {
                attrDefArray.push({ name : e['name'], param : e.items[0]['value'] });
            })
            this.props.appProps.addToCart({id: id, price: amount, attrArray: attrDefArray});
        });
    }

    render() {

        return (
            <> 
                <h2 className='g_h2'>{ this.props.appProps.state.category }</h2>
                <div className='gallery' ref = {this.gallery}>
                    {
                        this.state.data &&
                        this.state.data.map((e,i) => (
                                
                                <div 
                                    key = {e['id']} 
                                    className = { `${!e.inStock ? "noStock" : ""} ${i % 3 === 0 ? "product_wrap no_padding" : "product_wrap"}`}
                                    onMouseEnter = { ()=> this.setState({hoverId : e['id']}) }
                                    onMouseLeave = { ()=> this.setState({hoverId : null}) }
                                >
                                    
                                    <div className = "img_wrap">
                                        <Link to = {`/products/${e.id}`} className='link' onClick={()=> {this.props.appProps.setProductId(e.id); this.props.appProps.setHistory(`/products/${e.id}`); this.props.appProps.linkedFromCart(false)}}>
                                            <img src={e['gallery'][0]} alt={e['name']}/>
                                            {
                                                !e.inStock && <div className="outOfStock flx">out of stock</div>
                                            }
                                        </Link>
                                        {
                                            e.inStock &&
                                            <div className='hover_cart' onClick={() => this.cardHover(e['id'], e['prices'])}>
                                                { <CartSVG fill="#fff"/> }
                                            </div>
                                        }
                                    </div>
                                    <div className="desc">
                                        <p>{`${e['brand']} ${e['name']}`}</p>
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
import React from 'react';
import fetchQuery from './fetchQuery';

const ProductsQuery = `
    query getProducts($cat: String!){
        category(input:{title: $cat}){
            products{
                id
                name
                brand
                gallery
                inStock
                attributes{
                    type
                    name
                    items{
                        value
                    }
                }
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
            _isMounted : false
        }
        this.productsFetch = this.productsFetch.bind(this);
        this.switchCurrency = this.switchCurrency.bind(this);
    }

      productsFetch(category) {
        fetchQuery(ProductsQuery, {cat : category})
        .then(data => {
            this.setState( {data : data['data']} )
        })
    }

    componentDidMount() {
        this.productsFetch(this.state.activeCategory)
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.activeCategory !== this.state.activeCategory)
    //     this.setState({ activeCategory: nextProps.activeCategory })
    // }

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

    render() {
        return (
            <> 
                <div className='main'>
                    <div className='wrapper'>
                        <div className='gallery'>
                            {
                                this.state.data['category']?.['products']
                                ? this.state.data['category']['products'].map((e,i) => (
                                     
                                        <div key = {e['id']} className={ i % 3 === 0 ? "product_wrap no_padding" : "product_wrap"}>
                                            <div className = "img_wrap">
                                                <img src={e['gallery'][0]} alt={e['name']}/>
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
                                : "...loading"
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
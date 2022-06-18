import React from 'react'
import fetchQuery from './fetchQuery';
import logo from '../icons/logo.svg'
import cart from '../icons/cart.svg'
import arrow from '../icons/arrow.svg'

const categoriesQuery = `
    query {
        categories {
            name
            products {
                id
            }
        }
    }
`;

const currenciesQuery = `
    {
        currencies {
            symbol
            label
        }
    }
`


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            currencies: [],
            symbol: "$"
        }
        this.categoryHandle = this.categoryHandle.bind(this);
        this.currencyHandle = this.currencyHandle.bind(this);
        this.symbolHandle = this.symbolHandle.bind(this);
    }

    symbolHandle(val) {
        this.setState({symbol : val})
    }

    categoryHandle(cat) {
        this.props.categoryFilter(cat)
    }

    currencyHandle(cur) {
        this.props.currencyFilter(cur)
    }

    componentDidMount() {
        fetchQuery(categoriesQuery).then(data => {
            this.setState( {categories : data['data']['categories']} )
        })

        fetchQuery(currenciesQuery).then(data => {
            this.setState( {currencies : data['data']['currencies']} )
        })
    }


    render() {
        return (
            <> 
                <div className='header'>
                    <div className='wrapper'>
                        <div className='left'>
                            <div className='flx'>
                                {
                                    this.state.categories
                                    ? this.state.categories.map((e,i)=> (
                                        <div className='cat' key = {i} id = {e['name']} onClick={ ()=> this.categoryHandle(e['name']) }>
                                            <span>{ e['name'] }</span>
                                        </div>
                                    )) 
                                    : <div>loading...</div>
                                }
                            </div>
                        </div>
                        <div className='middle'>
                            <div className='logo'>
                                <img src={logo} alt='logo'/>
                            </div>
                        </div>
                        <div className='right'>
                            <div className='cart'>
                                <img src={cart} alt='cart'/>
                            </div>
                            <div className='currency_switch'>
                                <div className='drop_curr flx'>
                                    <span className='curr_symbol'>{this.state.symbol}</span>
                                    <img src={arrow} alt='arrow'/>
                                </div>
                                <div className = "dropdown curr_dropdown">
                                    {
                                        this.state.currencies
                                        ? this.state.currencies.map((e,i)=> (
                                            <div 
                                                key = {i} 
                                                id = {e['label']} 
                                                className = {e['symbol'] === this.state.symbol ? 'cur_line active' : 'cur_line'} 
                                                onClick={ ()=> {this.currencyHandle(e['label']); this.symbolHandle(e['symbol'])} }
                                            >
                                                <span className='symbol'>{ e['symbol'] }</span>
                                                <span className='label'>{ e['label'] }</span>
                                            </div>
                                        )) 
                                        : <div>loading...</div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}


export default Header;
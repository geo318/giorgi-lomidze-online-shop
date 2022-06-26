import React from 'react'
import fetchQuery from './fetchQuery';
import logo from '../icons/logo.svg'
import CartSVG from '../icons/cartSVG'
import arrow from '../icons/arrow.svg'
import {BrowserRouter as Router, Link} from 'react-router-dom'

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
            symbol: "$",
            newContent : this.props.newContent,
            cartItemNum : this.props.cartItemNum,
            currencyDrop: {display: "none",visibility: "hidden"},
        }
        this.symbolHandle = this.symbolHandle.bind(this);
        this.dropper = this.dropper.bind(this);
        this.dropperHide = this.dropperHide.bind(this);
        this.animate = this.animate.bind(this);
    }
    
    symbolHandle(val) {
        this.setState({symbol : val})
    }
    componentDidMount() {
        fetchQuery(categoriesQuery).then(data => {
            this.setState( {categories : data['data']['categories']} )
        })

        fetchQuery(currenciesQuery).then(data => {
            this.setState( {currencies : data['data']['currencies']} )
        })
    }


    dropper(elem) {
        this.setState({currencyDrop: {display: "block",visibility: "hidden"}})
        let timeout = setTimeout(()=>{
            this.setState({currencyDrop: {display: "block",visibility: "visible"}})
        },100);
        if(this.state.currencyDrop.visibility === "visible")
        clearTimeout(timeout);
    }

    dropperHide(elem) {
        this.setState({currencyDrop: {display: "block",visibility: "hidden"}})
        let timeout = setTimeout(()=>{
            this.setState({currencyDrop: {display: "none",visibility: "hidden"}})
        }, 100);
        if(this.state.currencyDrop.display === "none")
        clearTimeout(timeout);
    }

    animate() {
        this.props.detectNewContent("new")
        setTimeout(()=> {
            this.props.detectNewContent("old")
        }, 450)
    }

    static getDerivedStateFromProps(props, state) {
        if(props.newContent !== state.newContent){
            return { newContent: props.newContent }
        }
        if(props.cartItemNum !== state.cartItemNum){
            return { cartItemNum: props.cartItemNum }
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.symbol !== this.state.symbol){
            this.animate()
        }
    }

    dropBag() {

    }

    render() {
        const currencyDropdown = this.state.currencies
            ? this.state.currencies.map((e, i) => (
                <li
                    key={ i }
                    id={ e['label'] }
                    className={ e['symbol'] === this.state.symbol ? 'cur_line active' : 'cur_line' }
                    onClick={ () => { this.props.currencyFilter(e['label']); this.symbolHandle(e['symbol']); } }
                >
                    <span className='symbol'>{ e['symbol'] }</span>
                    <span className='label'>{ e['label'] }</span>
                </li>
            ))
            : <div>loading...</div>;

        const categoryMenu = this.state.categories
            ? this.state.categories.map((e, i) => (
                <Link to = "/" className={ this.props.activeCategory === e['name'] ? 'cat act' : 'cat' } key={ i } id={ e['name']} onClick={() => { this.props.categoryFilter(e['name']);} }>
                    <span>{ e['name'] }</span>
                </Link>
            ))
            : <div>loading...</div>;
        return (
            <> 
                <div className='header'>
                    <div className='wrapper'>
                        <div className='left'>
                            <div className='flx'>
                                {
                                    categoryMenu
                                }
                            </div>
                        </div>
                        <div className='middle'>
                            <div className='logo flx'>
                                <img src={logo} alt='logo'/>
                            </div>
                        </div>
                        <div className='right'>
                            <Link to = '/cart' className='cart flx'
                                onClick = { ()=> this.dropBag }
                            >
                                { this.state.cartItemNum === 0 ? null : <span className = 'num'>{ this.state.cartItemNum }</span> }
                                { 
                                    <CartSVG fill="#43464E"/> 
                                }
                            </Link>
                            <div className="currency_switch main_drop" 
                                onMouseEnter={ ()=>this.dropper(this.state.currencyDrop) }
                                onMouseLeave={ ()=>this.dropperHide(this.state.currencyDrop) }
                            >
                                <div className='drop_curr'>
                                    <span className = {`curr_symbol ${this.state.newContent}`}>{ this.state.symbol }</span>
                                    <img className = { this.state.currencyDrop.display === "block" ? "rotateUP" : "rotateDOWN" } src = { arrow } alt='arrow'/>
                                </div>
                                <div className = {`dropdown curr_dropdown ${this.state.currencyDrop.display}  ${this.state.currencyDrop.visibility}`} style = {{}}>
                                    <ul>
                                        {
                                            currencyDropdown
                                        }
                                    </ul>
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
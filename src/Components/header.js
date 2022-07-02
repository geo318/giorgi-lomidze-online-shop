import React from 'react'
import fetchQuery from './fetchQuery';
import logo from '../icons/logo.svg'
import CartSVG from '../icons/cartSVG'
import arrow from '../icons/arrow.svg'
import {BrowserRouter as Router, Link} from 'react-router-dom'
import Cart from './cart';

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
`;

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            currencies: [],
            symbol: "$",
            currencyDrop: {display: "none",visibility: "hidden"},
            cartDrop: false,
        }
        this.dropper = this.dropper.bind(this);
        this.dropperHide = this.dropperHide.bind(this);
        this.animate = this.animate.bind(this);
        this.dropBag = this.dropBag.bind(this);
        this.closeCartDropdown = this.closeCartDropdown.bind(this);
        this.close = this.close.bind(this);
    }
    
    componentDidMount() {
        
        let localState = JSON.parse(localStorage.getItem('header-state'));
        if(localState) this.setState(localState)
        this.setState({cartDrop : false,currencyDrop : {display: "none",visibility: "hidden"}})
        document.querySelector('body').addEventListener('click', ()=> {this.dropperHide();})

        fetchQuery(categoriesQuery).then(data => {
            this.setState( {categories : data['data']['categories']} )
        })

        fetchQuery(currenciesQuery).then(data => {
            this.setState( {currencies : data['data']['currencies']} )
        })
    }

    componentDidUpdate(prevProps, prevState) {
        
        localStorage.setItem('header-state', JSON.stringify(this.state))
        
        if(prevProps.symbol !== this.props.symbol){
            this.animate()
        }
    }

    dropper(e) {
        this.closeCartDropdown()
        if(this.state.currencyDrop.display === "block") {
            return this.dropperHide(e)
        }
        e.stopPropagation();
        this.setState({currencyDrop: {display: "block", visibility: "hidden"}})
        let timeout = setTimeout(()=>{
            this.setState({currencyDrop: {display: "block", visibility: "visible"}})
        },100);
        if(this.state.currencyDrop.visibility === "visible")
        clearTimeout(timeout);
    }


    dropperHide(e) {
        if(this.state.currencyDrop.display === "none") return

        this.setState({currencyDrop: {display: "block", visibility: "hidden"}})
        let timeout = setTimeout(()=>{
            this.setState({currencyDrop: {display: "none", visibility: "hidden"}})
        }, 100);

        if(this.state.currencyDrop.display === "none")
        clearTimeout(timeout);
    }

    animate() {
        this.props.detectNewContent("new")
        setTimeout(()=> {
            this.props.detectNewContent("old")
        }, 300)
    }



    dropBag(e) {
        this.dropperHide()

        if (this.state.cartDrop) {
          this.closeCartDropdown();
          return
        }
        this.setState({ cartDrop: true });
        e.stopPropagation();
        document.addEventListener("click", this.closeCartDropdown);
    }

    closeCartDropdown() {
        if(!this.state.cartDrop) return
        this.setState({ cartDrop: false });
        document.removeEventListener("click", this.closeCartDropdown);
    }

    close() {
        this.setState({ cartDrop: false });
    }

    render() {
        const currencyDropdown = this.state.currencies
            ? this.state.currencies.map((e, i) => (
                <li
                    key={ i }
                    id={ e['label'] }
                    className={ e['symbol'] === this.props.symbol ? 'cur_line active' : 'cur_line' }
                    onClick={ () => { this.props.currencyFilter(e['label']); this.props.symbolHandle(e['symbol']); } }
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
                        <div className='right flx'>
                            <div className='flx flx-rr'>
                                <div className='cart flx' onClick = {(e)=> this.dropBag(e) }>
                                    { this.props.cartItemNum > 0 && <span className = 'num'>{ this.props.cartItemNum }</span> }
                                    { 
                                        <CartSVG fill="#43464E"/> 
                                    }
                                    <div onClick={e => e.stopPropagation()} className='cart-dropdown' style = {this.state.cartDrop ? {display : 'block'}:{display : 'none'}}>
                                        { 
                                            this.state.cartDrop && <Cart close = {this.close} check = {this.state.symbol} appProps = {this.props.appProps}/> 
                                        }
                                    </div>
                                </div>

                                <div className="currency_switch main_drop" onClick={ (e)=>this.dropper(e) }>
                                    <div className='drop_curr'>
                                        <span className = {`curr_symbol ${this.props.newContent}`}>{ this.props.symbol }</span>
                                        <img className = { this.state.currencyDrop.display === "block" ? "rotateUP" : "rotateDOWN" } src = { arrow } alt='arrow'/>
                                    </div>
                                    <div className = {`dropdown curr_dropdown ${this.state.currencyDrop.display} ${this.props.newContent}  ${this.state.currencyDrop.visibility}`}>
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
                </div>
                
                { this.state.cartDrop && <div className='overlay'/>}
            </>
        )
    }
}


export default Header;
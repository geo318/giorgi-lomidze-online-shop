import React from 'react';
import './css/App.css';
import Header from './components/header';
import Category from './components/categories';
import Cart from './components/cart';
import Product from './components/product';
import Error from './components/page-components/error';
import fetchQuery from './querries/fetchQuery';
import { ProductsPriceQuery } from './querries/querries';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      category : '',
      activeCurrency : 'USD',
      newContent: 'old',
      cart: [], // contains product id and number
      cartItemNum: 0,
      sumTotal : 0,
      productID : null, // passing product page to fetch product
      symbol: '$', // displays an active currency symbol on navbar
    }
    this.symbolHandle = this.symbolHandle.bind(this);
    //this.setItemParameters = this.setItemParameters.bind(this);
  }

  componentDidMount() {
    this.sumCartItems(this.state.cart);
    this.calculateSum();
    // using local storage to prevent data loss if page refreashed
    let localState = JSON.parse(localStorage.getItem('app-state'));
    if(localState) this.setState(localState);
    
    this.setState({category : ""})
  }

  componentDidUpdate(prevProps, prevState) {
    localStorage.setItem('app-state', JSON.stringify(this.state));

    if(prevState.activeCurrency !== this.state.activeCurrency) {
      let array = [];
      this.state.cart.forEach((e)=> 
        array.push(fetchQuery(ProductsPriceQuery, {product : e.id}))
      );
      /* 
        to prevent data loss upon fetching a querry, 
        data is stored in a helper array until the fetching process is complete
      */
      Promise.all(array).then(data => {
        this.setState({prices:[]});
        let priceArr = [];
        data.forEach((el)=> {
          let e = el.data.product;
          priceArr.push({id : e.id, price: e['prices'][this.switchCurrency(this.state.activeCurrency)]['amount']});
        })
        this.setState({prices : priceArr});
        this.calculateSum();
      })
    }
  }

  // sumps up current prices for all items in the cart
  calculateSum = () => {
    return this.state.cart.reduce((total,current,i) => 
      total += current.price * this.state.cart[i]['num'], 0
    );
  }

  symbolHandle(val) {
    this.setState({symbol : val});
  }

  sumCartItems = (arr) => { 
    let num = arr.reduce(
      (total, curr) => { 
        total += curr['num'] 
        return total
      }, 0);
    this.setState( { cartItemNum : num } );
  }

  addToCart = params => {
    const {id, operation, price, attrArray, index, attrIndex, value} = params;

    let cartArray = this.state.cart;
    let indx = cartArray.findIndex((e) => id === e.id);

    if(operation != null) {
      this.setState({cartItemNum: this.state.cartItemNum + operation});
    }

    if(params.increment) {
      let cartItemCopy = cartArray[index]
      cartItemCopy.num += operation
      if(cartItemCopy.num < 1) {
        this.setState({ cart : [...cartArray.slice(0, index),...cartArray.slice(index + 1)] })
        console.log(cartArray)
        return
      }
      this.setState({ cart : [...cartArray.slice(0, index), cartItemCopy,...cartArray.slice(index + 1)] })
      return
    }

    if(price == null) {
      let cartItemCopy = cartArray[index]
      cartItemCopy.attr[attrIndex].param = value
      this.setState({ cart : [...cartArray.slice(0, index), cartItemCopy,...cartArray.slice(index + 1)] })
      return
    }

    if(indx < 0) {
      this.setState({ cart : [{ id: id, variant: 0, price: price, num: operation, attr : attrArray },...cartArray] })
      return
    }

    let similarItemsArray = cartArray.filter(e => e.id === id );

    if(similarItemsArray.some(e => e.attr.every((el, i) => el.name === attrArray[i]?.name && el.param === attrArray[i]?.param))) {
      let indx = similarItemsArray.findIndex(e => e.attr.every((el, i) => el.name === attrArray[i].name && el.param === attrArray[i].param))
      this.setState({ cart : [...cartArray.slice(0, indx), { id: id, variant: similarItemsArray[indx].variant, price: price, num: similarItemsArray[indx].num + operation, attr : attrArray },...cartArray.slice(indx + 1)] })
      return
    }

    this.setState({ cart : [{ id: id, variant: similarItemsArray.length + 1, price: price, num: 1, attr : attrArray }, ...cartArray] })
    return

  }

  categoryFilter = setCategory => {
    this.setState({ category : setCategory });
  }

  currencyFilter = setCurrency => {
    this.setState({ activeCurrency : setCurrency });
  }

  detectNewContent = (className) => {
    this.setState({ newContent: className });
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

  setProductId = (id) => {
    this.setState({productID : id})
  }

  render() {
    return (
      <>
        <Router>
        <Header appProps = {this} symbol = {this.state.symbol} activeCategory = {this.state.category}/>      
          <div className='main'>
            <div className='wrapper'>
              <Routes>
                <Route path={'/:category'} exact element={<Category category = {this.state.category} appProps = {this}/>}/>
                {/* <Route path="/" label="all" element={<Category appProps = {this}/>}/> */}
                <Route path="/cart" element={<Cart appProps = {this}/>} />
                <Route path="/products/:productId" element={<Product appProps = {this} id = {this.state.productID}/>}/>
                {/* <Route path="/*" element={<Error/>} /> */}
              </Routes>
            </div>
          </div>
        </Router>
      </>
    );
  }
}

export default App;
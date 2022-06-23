import React from 'react';
import './css/App.css';
import Header from './Components/header';
import Category from './Components/categories';
import Cart from './Components/cart';
import Error from './Components/error';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

class App extends React.Component {

  state = {
    category : 'all',
    currency : 'USD',
    newContent: 'old',
    cart: [
      {id: 'huarache-x-stussy-le', num: 6},
      {id: 'jacket-canada-goosee', num: 4},
      {id: 'apple-imac-2021', num: 2},
      {id: 'apple-iphone-12-pro', num: 2},
    ],
    cartItemNum: 0,
  }

  sumCartItems = () => { 
    let num = this.state.cart.reduce(
      (total, curr) => { 
        total += curr['num'] 
        return total
      }, 0) 
    this.setState( { cartItemNum : num } )
  }

  componentDidMount() { 
    this.sumCartItems()
  }

  adjustCartItemNumber = (productId, operation)=> {
    let cartArray = this.state.cart;
    let indx = cartArray.findIndex((e) => productId === e['id']);
    let productNum = cartArray[indx]['num'] + operation;

    this.setState({cart: [...cartArray.slice(0, indx),...cartArray.slice(indx + 1), {id : productId, num : productNum} ]});
    this.setState( { cartItemNum : this.state.cartItemNum + operation } )
  }

  addToCart = productId => {
    let cartArray = this.state.cart;
    if(this.state.cart.some((e) => productId === e['id'])) {
      this.adjustCartItemNumber(productId, +1);
      return
    }
    
    this.setState({cart: [ ...cartArray, {id : productId, num : 1} ]});
    this.sumCartItems();
  }

  categoryFilter = setCategory => {
    this.setState({ category : setCategory });
  }

  currencyFilter = setCurrency => {
    this.setState({ currency : setCurrency });
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
  
  render() {
    return (
      <>
        <Router>
        <Header cartItemNum = {this.state.cartItemNum} categoryFilter = {this.categoryFilter} currencyFilter = {this.currencyFilter} activeCategory = {this.state.category} detectNewContent = {this.detectNewContent} newContent = {this.state.newContent}/>      
          <div class='main'>
            <div class='wrapper'>
              <Routes>
                <Route path="/" element={<Category sumCartItems = {this.sumCartItems} addToCart = {this.adjustCartItemNumber} app = {this.state} switchCurrency = {this.switchCurrency} activeCategory = {this.state.category} activeCurrency = {this.state.currency} changeDetect = {this.changeDetect} newContent = {this.state.newContent}/>}/>
                <Route path="/cart" element={<Cart cart = {this.state.cart} sumCartItems = {this.sumCartItems} adjustCartItemNumber = {this.adjustCartItemNumber} switchCurrency = {this.switchCurrency} activeCurrency = {this.state.currency}/>} />
                <Route path="/*" element={<Error/>} />
              </Routes>
            </div>
          </div>
        </Router>
      </>
    );
  }
}

export default App;
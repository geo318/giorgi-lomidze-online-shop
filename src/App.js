import React from 'react';
import './css/App.css';
import Header from './Components/header';
import Category from './Components/categories';
import Cart from './Components/cart';
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
    cartItemNum: null
    
  }

  addToCart = productId => {
    let productNum;
    let cartArray = this.state.cart;
    if(this.state.cart.every((e) => productId !== e['id'])) {
      productNum = 1;
      this.setState({cart: [ ...cartArray, {id : productId, num : productNum} ]})
    } else {
      let indx = cartArray.findIndex((e) => productId === e['id']);
      productNum = cartArray[indx]['num'] + 1;
      this.setState({cart: [...cartArray.slice(0, indx),...cartArray.slice(indx + 1), {id : productId, num : productNum} ]})
    }
    
    this.setState( {
      cartItemNum : this.state.cart.reduce(
        (total, curr) => { 
          total += curr['num'] 
          return total
        }, 1) 
      } )
  }

  categoryFilter = setCategory => {
    this.setState({ category : setCategory })
  }

  currencyFilter = setCurrency => {
    this.setState({ currency : setCurrency })
  }

  changeDetect = (className) => {
    this.setState({ newContent: className })
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
        <Header cartItemNum = {this.state.cartItemNum} categoryFilter = {this.categoryFilter} currencyFilter = {this.currencyFilter} activeCategory = {this.state.category} changeDetect = {this.changeDetect} newContent = {this.state.newContent}/>
          <Routes>
            <Route path='/home' element={<Category addToCart = {this.addToCart} app = {this.state} switchCurrency = {this.switchCurrency} activeCategory = {this.state.category} activeCurrency = {this.state.currency} changeDetect = {this.changeDetect} newContent = {this.state.newContent}/>}/>
            <Route path='/cart' element={<Cart cart = {this.state.cart} switchCurrency = {this.switchCurrency} activeCurrency = {this.state.currency}/>} />
          </Routes>
        </Router>
      </>
    );
  }
}

export default App;
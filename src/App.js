import React from 'react';
import './css/App.css';
import Header from './Components/header';
import Category from './Components/Categories';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

class App extends React.Component {

  state = {
    category : 'all',
    currency : 'USD',
    newContent: 'old',
    cart: [],
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

  render() {
    return (
      <>
        <Header cartItemNum = {this.state.cartItemNum} categoryFilter = {this.categoryFilter} currencyFilter = {this.currencyFilter} activeCategory = {this.state.category} changeDetect = {this.changeDetect} newContent = {this.state.newContent}/>
        {console.log(this.state.cartItemNum)}
        <Router>
          <Routes>
            <Route path='/Home' element={<Category addToCart = {this.addToCart} app = {this.state} activeCategory = {this.state.category} activeCurrency = {this.state.currency} changeDetect = {this.changeDetect} newContent = {this.state.newContent}/>}/>
          </Routes>
        </Router>
      </>
    );
  }
}

export default App;
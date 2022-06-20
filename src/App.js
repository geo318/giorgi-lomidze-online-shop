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
    cart: []
  }

  addToCart = productId => {
    if(!this.state.cart.includes(productId))
    this.setState({cart: [...this.state.cart, productId]})
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
        <Header categoryFilter = {this.categoryFilter} currencyFilter = {this.currencyFilter} activeCategory = {this.state.category} changeDetect = {this.changeDetect} newContent = {this.state.newContent}/>
        <Router>
          {console.log(this.state.cart)}
          <Routes>
            <Route path='/Home' element={<Category addToCart = {this.addToCart} app = {this.state} activeCategory = {this.state.category} activeCurrency = {this.state.currency} changeDetect = {this.changeDetect} newContent = {this.state.newContent}/>}/>
          </Routes>
        </Router>
      </>
    );
  }
}

export default App;
import React from 'react';
import './App.css';
import Header from './Components/header';
import Category from './Components/Categories';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

class App extends React.Component {

  state = {
    category : 'all',
    currency : 'USD'
  }

  categoryFilter = setCategory => {
    this.setState({ category : setCategory })
  }

  currencyFilter = setCurrency => {
    this.setState({ currency : setCurrency })
  }




  render() {
    return (
      <>
        <Header categoryFilter = {this.categoryFilter} currencyFilter = {this.currencyFilter}/>
        <div>{this.state.category}</div>
        <div>{this.state.currency}</div>
        <Router>
          <Routes>
            <Route path='/Home' element={<Category activeCategory = {this.state.category} activeCurrency = {this.state.currency}/>}/>
          </Routes>
        </Router>
      </>
    );
  }
}

export default App;
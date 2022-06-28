import React from 'react';
import './css/App.css';
import Header from './Components/header';
import Category from './Components/categories';
import Cart from './Components/cart';
import Product from './Components/product';
import Error from './Components/error';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import fetchQuery from './Components/fetchQuery';

const ProductsPriceQuery = `
    query getProduct($product : String!){
        product(id : $product) {
          id
          prices {
            currency{
              symbol
              label
            }
            amount
          }
        }
    }
`;

class App extends React.Component {

  state = {
    category : 'all',
    currency : 'USD',
    newContent: 'old',
    cart: [],
    cartItemNum: 0,
    prices: [],
    sumTotal : 0,
    productID : null
  }

  
  calculateSum = () => {
    let sum = this.state.prices.reduce((total,current,i) => total += current.price * this.state.cart[i]['num'], 0)
    return sum
  }


  componentDidUpdate(prevProps, prevState) {
    if(prevState.currency !== this.state.currency) {
      let array = [];
      this.state.cart.forEach((e)=> 
        array.push(fetchQuery(ProductsPriceQuery, {product : e.id}))
      )
        
      Promise.all(array).then(data => {
        this.setState({prices:[]})
        let priceArr = [];
        data.forEach((el)=> {
          let e = el.data.product
          priceArr.push({id : e.id, price: e['prices'][this.switchCurrency(this.state.currency)]['amount']})
        })
        this.setState({prices : priceArr})
        this.calculateSum()
    })
  }}

  itemPrice = (id, amount) => {
    let pricesArray = this.state.prices;
    if(pricesArray.every(e => id !== e.id)) {
      this.setState({ prices: [...pricesArray, {id: id, price : amount}] })
      return
    }
    if(pricesArray.some(e => id === e.id && e.price === amount)) return

      let indx = pricesArray.findIndex((e) => id === e['id'])
      this.setState({ prices: [...pricesArray.slice(0, indx), {id: id, price : amount}, ...pricesArray.slice(indx + 1)] })
  }

  sumCartItems = (arr) => { 
    let num = arr.reduce(
      (total, curr) => { 
        total += curr['num'] 
        return total
      }, 0) 
    this.setState( { cartItemNum : num } )
  }

  componentDidMount() {
    this.sumCartItems(this.state.cart)
    this.calculateSum()
  }

  adjustCartItemNumber = (productId, operation)=> {
    let cartArray = this.state.cart;
    let indx = cartArray.findIndex((e) => productId === e['id']);
    let productNum = cartArray[indx]['num'] + operation;

    if(productNum === 0) {
      this.setState({ cartItemNum : this.state.cartItemNum + operation });
      this.setState({ cart: [...cartArray.slice(0, indx),...cartArray.slice(indx + 1) ] });
      this.setState({ prices: [...this.state.prices.slice(0, indx),...this.state.prices.slice(indx + 1)] });
      return
    }
    this.setState({ cart: [...cartArray.slice(0, indx),{id : productId, num : productNum},...cartArray.slice(indx + 1) ] });
    this.setState({ cartItemNum : this.state.cartItemNum + operation })
  }

  addToCart = productId => {
    let cartArray = this.state.cart;
    if(this.state.cart.some((e) => productId === e['id'])) {
      this.adjustCartItemNumber(productId, +1);
      return
    }
    
    this.setState({cart: [ ...cartArray, {id : productId, num : 1} ]});
    this.setState( { cartItemNum : this.state.cartItemNum + 1 } )
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
  setProductId = (id) => {
    this.setState({productID : id})
  }
  render() {
    return (
      <>
        <Router>
        <Header calculateSum = {this.calculateSum} cartItemNum = {this.state.cartItemNum} categoryFilter = {this.categoryFilter} currencyFilter = {this.currencyFilter} activeCategory = {this.state.category} detectNewContent = {this.detectNewContent} newContent = {this.state.newContent}/>      
          <div className='main'>
            <div className='wrapper'>
              <Routes>
                <Route path="/" element={<Category setProductId = {this.setProductId} calculateSum = {this.calculateSum} prices = {this.state.prices} itemPrice = {this.itemPrice} sumCartItems = {this.sumCartItems} addToCart = {this.addToCart} app = {this.state} switchCurrency = {this.switchCurrency} activeCategory = {this.state.category} activeCurrency = {this.state.currency} changeDetect = {this.changeDetect} newContent = {this.state.newContent}/>}/>
                <Route path="/cart" element={<Cart calculateSum = {this.calculateSum} sumTotal = {this.state.sumTotal} prices = {this.state.prices} cart = {this.state.cart} cartItemNum = {this.state.cartItemNum} sumCartItems = {this.sumCartItems} adjustCartItemNumber = {this.adjustCartItemNumber} switchCurrency = {this.switchCurrency} activeCurrency = {this.state.currency}/>} />
                <Route path="/products/:productId" element={<Product id = {this.state.productID}/>}/>
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
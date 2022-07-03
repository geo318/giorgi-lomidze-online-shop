import React from "react";

export default class Price extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.switcher = this.switcher.bind(this)
    }
    switcher(val) {return this.props.appProps.switchCurrency(val)}
    render() {
        const e = this.props.price
        const curr = this.props.appProps.state.activeCurrency;
        
        return (
            <>
                <span>{e['prices'][this.switcher(curr)]['currency']['symbol']}</span>
                <span>{e['prices'][this.switcher(curr)]['amount']}</span>
            </>
        )
    }
}
import React from "react";

export default class Product extends React.Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {
    //     }
    // }
    render() {
        return (
            <h2>product Id: {this.props.id}</h2>
        )
    }
}
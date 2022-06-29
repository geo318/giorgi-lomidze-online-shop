import React from "react";

export default class Error extends React.Component {
    render() {
        const props = this.props.appState;
        console.log(props.state.symbol)
        return (
            <h2>Page Not Found</h2>
        )
    }
}
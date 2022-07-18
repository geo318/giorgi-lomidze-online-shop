import React from "react";

export default class Front extends React.Component {
    componentDidMount() {
        this.props.reset()
    }

    render() {
        return (
            <div className="homePage"/>
        )
    }
}
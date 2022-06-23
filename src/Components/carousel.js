import React from "react";

export default class Carousel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current : 0,
        }
    }

    render() {
        const array = this.props.array;
        const current = this.state.current;
        return (
            <div>
                <div onClick = {() => this.setState(
                    { current : current > 0 ? current - 1 : array.length - 1 }
                )}>
                    prev
                </div>
                    <img src = {array[current]} alt={this.props.alt}/>
                <div onClick = {() => this.setState(
                    { current : current < array.length - 1 ? current + 1 : 0 }
                )}>
                    next
                </div>
            </div>
        )
    }
}
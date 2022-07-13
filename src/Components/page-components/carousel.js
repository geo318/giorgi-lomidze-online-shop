import React from "react";
import arrow from '../../icons/carousel-arrow.svg';
import { Link } from 'react-router-dom';

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
                {
                    this.props.check == null &&
                    <div className="c-arr arrow-left" onClick = { () => this.setState({ current : current > 0 ? current - 1 : array.length - 1 }) }>
                        <img src={arrow} alt='arrow-left'/>
                    </div>
                }
                <div className="img-wrap flx">
                    <Link to = {`/products/${this.props.id}`} className='link' onClick={ ()=> { this.props.click(this.props.id); this.props.check && this.props.close()} }>
                        <img src = {array[current]} alt={this.props.alt}/>
                    </Link>
                </div>
                {   
                    this.props.check == null &&
                    <div className="c-arr arrow-right" onClick = { () => this.setState({ current : current < array.length - 1 ? current + 1 : 0 }) }>
                        <img src={arrow} alt='arrow-right'/>
                    </div>
                }
            </div>
        )
    }
}
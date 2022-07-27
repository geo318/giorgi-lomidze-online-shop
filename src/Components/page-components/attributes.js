import React from "react";

export default class Attributes extends React.Component {
    render() {
        const params = this.props.params;
        const elem = this.props.elem;
        return (
            <>
                {
                    elem['attributes'].map((items,index) => (
                        <div key = {index}>
                            <span className="attr-name">{items['name']}:</span>
                            <ul className="flx">
                                {
                                    items['items'].map((i,indx) => {
                                        return (
                                            <li key={indx} 
                                                className = {
                                                    this.setActiveParam({cart: params, cartIndex: this.props.index, attrIndex: index, value: i['value']})
                                                }
                                                onClick = { () =>
                                                    {
                                                        this.props.check == null &&
                                                        this.props.addToCart({ id: elem['id'], attrArray: items['items'], name: items['name'], value: i['value'], attrIndex: index, index: this.props.index, changeParam: true }) 
                                                    }
                                                }
                                                    data-value={i['id'] }
                                            >
                                                {
                                                    items.id === 'Color'
                                                    ? <div className="color-batch" style={ {backgroundColor : i['value']} }/>
                                                    : <div className="attr-txt">{i['value']}</div>
                                                }
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    ))
                }
            </>
        )
    }

    setActiveParam(params) {
        const {cart, cartIndex, attrIndex, value} = params;
        return cart[cartIndex]?.attr[attrIndex]?.param === value 
        ? 'active-param' 
        : null                                        
    }
}
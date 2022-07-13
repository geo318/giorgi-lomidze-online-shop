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
                                            <li key={indx} className={ this.setActiveParam({cart: params, cartIndex : this.props.index, attrIndex : index, value : i['value']}) }
                                                onClick = { () => 
                                                    this.props.check == null &&
                                                    this.props.addToCart({ id : elem['id'], attrArray: items['items'], name: items['name'], value : i['value'], attrIndex: index, index : this.props.index }) 
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
        const cart = params.cart;
        const cartIndex = params.cartIndex;
        const attrIndex = params.attrIndex;
        const value = params.value
        return value === cart?.[cartIndex]?.attr[attrIndex]?.param ? 'active-param' : null;
    }
}
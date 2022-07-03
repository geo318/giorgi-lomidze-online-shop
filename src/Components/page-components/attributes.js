import React from "react";

export default class Attributes extends React.Component {
    render() {
        const params = this.props.params;
        const elem = this.props.elem;
        return (
            <>
                {
                    elem['attributes'].map((items,i) => (                                                       
                        <div key = {i}>
                            <span className="attr-name">{items['name']}:</span>
                            <ul className="flx">
                                {
                                    items['items'].map(i => (
                                        <li className={ this.setActiveParam(i, params, elem, items) } 
                                            onClick = { () => this.props.setItemParameters(elem['id'], items['name'], i['value'])} key = {i['id']} data-value={i['id'] }>
                                            {
                                                items.id === 'Color'
                                                ? <div className="color-batch" style={ {backgroundColor : i['value']} }/>
                                                : <div className="attr-txt">{i['value']}</div>
                                            }
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    ))
                }
            </>
        )
    }

    setActiveParam(i, params, elem, items) {
        let paramIndex = params.findIndex((el) => el.id === elem.id)
        return i['value'] === params?.[paramIndex]?.attr[params?.[paramIndex]?.attr.findIndex((el) => el.name === items['name'])]?.param ? 'active-param' : null;
    }
}
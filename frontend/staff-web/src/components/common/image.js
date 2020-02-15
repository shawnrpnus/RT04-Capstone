import React, { Component } from 'react';



export class Image extends Component {

    render() {
        return (
            <div>
                <div className="d-flex" >
                {this.props.data.map((res,i) => {
                    return (
                        <img src={res} alt="" key={i} className="img-fluid img-30 mr-2 blur-up lazyloaded" />
                    )
                })}
                </div>
            </div>
        )
    }
}

export default Image

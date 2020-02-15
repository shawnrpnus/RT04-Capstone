import React, { Component,Fragment } from 'react'
import { ShoppingBag, Download, AlertCircle } from 'react-feather';


export class Notification extends Component {
    render() {
        return (
            <Fragment>
                
                        <ul className="notification-dropdown onhover-show-div p-0">
                            <li>Notification <span className="badge badge-pill badge-primary pull-right">3</span></li>
                            <li>
                                <div className="media">
                                    <div className="media-body">
                                        <h6 className="mt-0"><span><ShoppingBag /></span>Your order ready for Ship..!</h6>
                                        <p className="mb-0">Lorem ipsum dolor sit amet, consectetuer.</p>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="media">
                                    <div className="media-body">
                                        <h6 className="mt-0 txt-success"><span><Download /></span>Download Complete</h6>
                                        <p className="mb-0">Lorem ipsum dolor sit amet, consectetuer.</p>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="media">
                                    <div className="media-body">
                                        <h6 className="mt-0 txt-danger"><span><AlertCircle /></span>250 MB trash files</h6>
                                        <p className="mb-0">Lorem ipsum dolor sit amet, consectetuer.</p>
                                    </div>
                                </div>
                            </li>
                            <li className="txt-dark"><a href="#">All</a> notification</li>
                        </ul>
            </Fragment>
        )
    }
}

export default Notification

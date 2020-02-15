import React, { Component } from 'react';
import {Home} from 'react-feather';
import {Link} from 'react-router-dom'


export class Breadcrumb extends Component {
    render() {
        return (
                <div className="container-fluid">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="page-header-left">
                                    <h3>{this.props.title}
                                    <small>Multikart Admin panel</small>
                                    </h3>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <ol className="breadcrumb pull-right">
                                    <li className="breadcrumb-item">
                                    <Link to="mutikart-admin/dashboard">
                                            <Home />
                                    </Link>
                                    </li>
                                    <li className="breadcrumb-item">{this.props.parent}</li>
                                    <li className="breadcrumb-item active">{this.props.title}</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

export default Breadcrumb

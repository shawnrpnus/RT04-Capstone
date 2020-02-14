import React, { Component ,Fragment} from 'react'
import Breadcrumb from '../common/breadcrumb';
import Tabset from './tabset';

export class Create_coupons extends Component {
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Create Coupon" parent="Coupon" />
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5>Discount Coupon Details</h5>
                        </div>
                        <div className="card-body">
                            <Tabset />
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Create_coupons

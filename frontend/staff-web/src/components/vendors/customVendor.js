import React, { Component,Fragment } from 'react'

export class CustomVendor extends Component {
    render() {
        return (
            <Fragment>
                <div class="d-flex vendor-list">
                    <img src="../assets/images/dashboard/user1.jpg" alt="" class="img-fluid img-40 rounded-circle blur-up lazyloaded" />
                        <span>Lane Skylar</span>
                </div>
            </Fragment>
        )
    }
}

export default CustomVendor

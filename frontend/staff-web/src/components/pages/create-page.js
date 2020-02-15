import React, { Component ,Fragment} from 'react';
import Breadcrumb from '../common/breadcrumb';
import Tabset_page from './tabset-page';

export class Create_page extends Component {
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Create Page" parent="Pages" />
                <div className="container-fluid">
                <div className="card">
                    <div className="card-header">
                        <h5>Add Page</h5>
                    </div>
                    <div className="card-body">
                     <Tabset_page/>
                    </div>
                </div>
            </div>
            </Fragment>
        )
    }
}

export default Create_page

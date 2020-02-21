import React, {Component, PureComponent} from 'react';
import {retrieveAllStores} from "../../../redux/actions";
import {connect} from "react-redux";
import withPage from "../../Layout/page/withPage";
import {Card, CardBody, Col} from "reactstrap";
import TagEditForm from "./TagEditForm";
import {retrieveAllTags} from "../../../redux/actions/tagAction";
import MaterialTable from "material-table";
import EditTable from '../../../shared/components/Table/EditableTable';

class TagTable extends PureComponent {
  constructor() {
    super();
    this.heads = [
      {
        key: 'tagId',
        name: 'Id',
        width: 80,
      },
      {
        key: 'name',
        name: 'Name',
        editable: true,
      },
    ];
    this.state = { rows: ""};

  }
    componentDidMount() {
        this.props.retrieveAllTags();
    }

    render() {
    console.log(this.props)
        return (
            <Col md={12} lg={12}>
                <Card>
                    <CardBody>
                        <div className="card__title">
                            <h5 className="bold-text">All Tags</h5>
                        </div>

                        {this.props.allTags ? (
                            <EditTable heads={this.heads} rows={this.props.allTags} />
                        ) :
                          ("not")}
                    </CardBody>
                </Card>
            </Col>
        );
    }
}
const mapStateToProps = state => ({
    allTags: state.tag.allTags,
    errors: state.errors
});

const mapDispatchToProps = {
    retrieveAllTags
};

// eslint-disable-next-line no-undef
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TagTable);

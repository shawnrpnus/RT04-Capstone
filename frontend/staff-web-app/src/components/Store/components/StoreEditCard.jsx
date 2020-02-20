import React, { Component } from "react";
import { Card, CardBody, Col } from "reactstrap";
import StoreEditForm from "./StoreFormContainer";
import * as PropTypes from "prop-types";
import { clearErrors, createNewStore } from "../../../redux/actions";

class StoreEditCard extends Component {
  static propTypes = {
    crudAction: PropTypes.string.isRequired,
    storeIdToRetrieve: PropTypes.number
  };

  render() {
    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <div className="card__title">
              <h5 className="bold-text">Store Information</h5>
            </div>
            <StoreEditForm />
          </CardBody>
        </Card>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  currentStore: state.storeEntity.currentStore,
  errors: state.errors
});

const mapDispatchToProps = {
  createNewStore, //api/storeEntity/createNewStore
  clearErrors
};

export default StoreEditCard;

import React, { Component } from "react";
import "moment";
import { connect } from "react-redux";
import {
  clearErrors,
  createNewStore,
  retrieveStoreById
} from "../../../redux/actions";
import CreateUpdateStoreRequest from "../../../models/store/CreateUpdateStoreRequest";
import Address from "../../../models/address";
import * as PropTypes from "prop-types";
import StoreForm from "./StoreForm";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Loading from "../../../shared/components/Loading";

class StoreFormContainer extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(["create", "view", "update"]),
    currentStore: PropTypes.object,
    errors: PropTypes.object,
    clearErrors: PropTypes.func.isRequired,
    createNewStore: PropTypes.func,
    retrieveStoreById: PropTypes.func
  };

  componentWillMount() {
    const { mode } = this.props;
    if (mode === "view" || mode === "update") {
      const storeId = this.props.match.params.storeId;
      this.props.retrieveStoreById(storeId);
    }
  }

  handleSubmit = (e, formState) => {
    e.preventDefault();
    const {
      storeName,
      numChangingRooms,
      numReservedChangingRooms,
      openingTime,
      closingTime,
      numManagers,
      numAssistants,
      line1,
      line2,
      buildingName,
      postalCode
    } = formState;
    const address = new Address(line1, line2, postalCode, buildingName);
    const req = new CreateUpdateStoreRequest(
      storeName,
      numChangingRooms,
      numReservedChangingRooms,
      openingTime,
      closingTime,
      numManagers,
      numAssistants,
      address
    );
    switch (this.props.mode) {
      case "create":
        this.props.createNewStore(req, this.props.history);
        break;
      case "update":
        console.log("do update");
        break;
      default:
        console.log("no mode passed");
    }
  };

  render() {
    const { errors, clearErrors, mode, currentStore } = this.props;

    const header =
      mode === "view"
        ? "Store Information"
        : mode === "update"
        ? "Update Store Information"
        : mode === "create"
        ? "Create New Store"
        : "";
    return (
      <Container>
        <Row>
          <Col md={12}>
            <h3 className="page-title">Store Management</h3>
            <h3 className="page-subhead subhead">Manage your stores below.</h3>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={12}>
            <Card>
              <CardBody>
                <div className="card__title">
                  <h5 className="bold-text">{header}</h5>
                </div>
                {mode === "create" ? (
                  <StoreForm
                    handleSubmit={this.handleSubmit}
                    clearErrors={clearErrors}
                    errors={errors}
                  />
                ) : currentStore !== null ? (
                  <StoreForm
                    handleSubmit={this.handleSubmit}
                    clearErrors={clearErrors}
                    errors={errors}
                    disabled={mode === "view"}
                    currentStore={currentStore}
                  />
                ) : (
                  <Loading loading={true} />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

//mapping global state to this component
const mapStateToProps = state => ({
  currentStore: state.storeEntity.currentStore,
  errors: state.errors
});

const mapDispatchToProps = {
  createNewStore, //api/storeEntity/createNewStore
  clearErrors,
  retrieveStoreById
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreFormContainer);

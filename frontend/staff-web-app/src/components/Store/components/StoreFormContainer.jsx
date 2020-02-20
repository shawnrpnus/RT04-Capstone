import React, { Component } from "react";
import "moment";
import { connect } from "react-redux";
import {
  clearErrors,
  createNewStore,
  retrieveStoreById,
  updateStore
} from "../../../redux/actions";
import CreateUpdateStoreRequest from "../../../models/store/CreateUpdateStoreRequest";
import Address from "../../../models/address";
import * as PropTypes from "prop-types";
import StoreForm from "./StoreForm";
import Loading from "../../../shared/components/Loading";
import withPage from "../../Layout/page/withPage";

class StoreFormContainer extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(["create", "view", "update"]),
    currentStore: PropTypes.object,
    errors: PropTypes.object,
    clearErrors: PropTypes.func.isRequired,
    createNewStore: PropTypes.func,
    updateStore: PropTypes.func,
    retrieveStoreById: PropTypes.func
  };

  componentDidMount() {
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
        req.storeId = this.props.currentStore.storeId;
        this.props.updateStore(req, this.props.history);
        break;
      default:
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
      <React.Fragment>
        <div className="card__title">
          <h5 className="bold-text">{header}</h5>
        </div>
        {/*I the mode is create, load a blank form, otherwise, pass in the current
                store entity object that was retrieved. If mode is just to view, disable all
                fields, otherwise allow fields to be edited*/}
        {mode === "create" ? (
          <StoreForm
            handleSubmit={this.handleSubmit}
            clearErrors={clearErrors}
            errors={errors}
            history={this.props.history}
          />
        ) : currentStore !== null ? (
          <StoreForm
            handleSubmit={this.handleSubmit}
            clearErrors={clearErrors}
            errors={errors}
            disabled={mode === "view"}
            currentStore={currentStore}
            history={this.props.history}
          />
        ) : (
          <Loading loading={true} />
        )}
      </React.Fragment>
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
  retrieveStoreById,
  updateStore
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withPage(StoreFormContainer, "Store Management"));

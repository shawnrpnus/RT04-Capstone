import React, { Component } from "react";
import "moment";
import { connect } from "react-redux";
import { clearErrors, updateErrors } from "../../../redux/actions";
import {
  createNewStore,
  retrieveStoreById,
  updateStore,
  clearCurrentStore,
  deleteStore
} from "../../../redux/actions/storeActions";
import CreateUpdateStoreRequest from "../../../models/store/CreateUpdateStoreRequest";
import Address from "../../../models/address";
import * as PropTypes from "prop-types";
import StoreForm from "./StoreForm";
import withPage from "../../Layout/page/withPage";
import { css } from "@emotion/core";
import { ClipLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 0 auto;
`;

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
    this.checkMode();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.mode !== prevProps.mode) {
      this.checkMode();
      this.props.clearErrors();
    }
  }

  checkMode() {
    const { mode, history } = this.props;
    if (mode === "view" || mode === "update") {
      const storeId = this.props.match.params.storeId;
      this.props.retrieveStoreById(storeId, history);
    }
  }

  updateErrors = errorMap => {
    this.props.updateErrors(errorMap);
  };

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

  handleDelete = storeId => {
    this.props.deleteStore(storeId, this.props.history);
  };

  render() {
    const {
      errors,
      clearErrors,
      mode,
      currentStore,
      location,
      updateErrors
    } = this.props;

    const header =
      mode === "view"
        ? "Store Information"
        : mode === "update"
        ? "Update Store Information"
        : mode === "create"
        ? "Create New Store"
        : "";

    const routeStoreId = parseInt(this.props.match.params.storeId);
    return (
      <React.Fragment>
        <div className="card__title">
          <h5 className="bold-text">{header}</h5>
        </div>
        {/*I the mode is create, load a blank form, otherwise, pass in the current
                store entity object that was retrieved. If mode is just to view, disable all
                fields, otherwise allow fields to be edited*/}

        {/* NOTE: React's reconciliation algorithm assumes that without any information to the contrary,
        if a custom component appears in the same place on subsequent renders, it's the same component
        as before, so reuses the previous instance rather than creating a new one.
        https://stackoverflow.com/questions/29074690/react-why-components-constructor-is-called-only-once*/}
        {mode === "create" ? (
          <StoreForm
            handleSubmit={this.handleSubmit}
            clearErrors={clearErrors}
            errors={errors}
            updateErrors={updateErrors}
            history={this.props.history}
            key={location.pathname}
          />
        ) : currentStore !== null && routeStoreId === currentStore.storeId ? (
          <StoreForm
            handleSubmit={this.handleSubmit}
            deleteStore={this.handleDelete}
            clearErrors={clearErrors}
            errors={errors}
            updateErrors={updateErrors}
            disabled={mode === "view"}
            currentStore={currentStore}
            history={this.props.history}
            key={`${location.pathname}-${currentStore.storeId}`}
          />
        ) : (
          <ClipLoader
            css={override}
            size={100}
            color={"#36D7B7"}
            loading={true}
          />
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
  updateStore,
  clearCurrentStore,
  updateErrors,
  deleteStore
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withPage(StoreFormContainer, "Store Management"));

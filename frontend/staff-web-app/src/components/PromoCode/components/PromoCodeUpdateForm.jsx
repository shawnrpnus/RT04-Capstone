import React, { Component } from "react";
import withPage from "../../Layout/page/withPage";
import { connect } from "react-redux";
import { clearErrors, updateErrors } from "../../../redux/actions";
import { Grid } from "@material-ui/core";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import { Button, ButtonToolbar } from "reactstrap";
import * as PropTypes from "prop-types";
import ContentSaveIcon from "mdi-react/ContentSaveIcon";
import CloseCircleIcon from "mdi-react/CloseCircleIcon";
import {
  createPromoCode,
  deletePromoCode,
  retrievePromoCodeById,
  updatePromoCode
} from "../../../redux/actions/promoCodeActions";
import PromoCodeUpdateRequest from "../../../models/promoCode/PromoCodeUpdateRequest";
import DeleteIcon from "mdi-react/DeleteIcon";
import { Link } from "react-router-dom";
import TableEyeIcon from "mdi-react/TableEyeIcon";
import withMaterialConfirmDialog from "../../Layout/page/withMaterialConfirmDialog";
import promoCodeToUpdate from "../../../models/promoCode/promoCodeToUpdate";
import InputAdornment from "@material-ui/core/InputAdornment";

const _ = require("lodash");

class PromoCodeUpdateForm extends Component {
  static propTypes = {
    errors: PropTypes.object,
    clearErrors: PropTypes.func
  };

  componentDidMount() {
    const promoCodeId = this.props.match.params.promoCodeId;
    this.props.retrievePromoCodeById(promoCodeId, this.props.history);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { currentPromoCode } = this.props;

    if (
      !prevProps.currentPromoCode ||
      (prevProps.currentPromoCode &&
        prevProps.currentPromoCode.promoCodeId &&
        prevProps.currentPromoCode.promoCodeId !==
          this.props.currentPromoCode.promoCodeId)
    ) {
      this.setState({
        promoCodeName: currentPromoCode.promoCodeName,
        flatDiscount:"",
        percentageDiscount: "",
        minimumPurchase: currentPromoCode.minimumPurchase,
        numRemaining: currentPromoCode.numRemaining,
        originalFlatDiscount: currentPromoCode.flatDiscount,
        originalPercentageDiscount: currentPromoCode.percentageDiscount
      });
    }
  }

  handleDelete = promoCodeId => {
    this.props
      .confirmDialog({ description: "Promo Code will be deleted permanently" })
      .then(() => this.props.deletePromoCode(promoCodeId, this.props.history));
  };

  constructor(props) {
    super(props);
    const { currentPromoCode } = this.props;
    this.handleFlatDiscount = this.handleFlatDiscount.bind(this);
    this.handlePercentageDiscount = this.handlePercentageDiscount.bind(this);
    this.state = {
      promoCodeName: currentPromoCode ? currentPromoCode.promoCodeName : "",
      flatDiscount: "",
      percentageDiscount: "",
      minimumPurchase: currentPromoCode ? currentPromoCode.minimumPurchase : "",
      numRemaining: currentPromoCode ? currentPromoCode.numRemaining : "",
      originalFlatDiscount: currentPromoCode
        ? currentPromoCode.flatDiscount
        : "",
      originalPercentageDiscount: currentPromoCode
        ? currentPromoCode.percentageDiscount
        : ""
    };
  }
  onChange = e => {
    const name = e.target.name;
    console.log(e);
    console.log(name);
    this.setState({ [name]: e.target.value }); //computed property name syntax
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  onChangeDecimal = e => {
    const name = e.target.name;
    const stateValue = this.state[name];
    let value = e.target.value;
    const lastChar = e.target.value.substr(value.length - 1, 1);
    if (lastChar === "." && !stateValue.includes(".")) {
      // skip the else
    } else {
      const x = e.target.value.split(".");
      if (x[1] && x[1].length >= 2) {
        value = parseFloat(e.target.value)
            .toFixed(2)
            .toString();
      } else {
        value = parseFloat(e.target.value).toString();
      }
      if (value === "NaN") value = "";
    }
    const newState = { ...this.state };
    newState[name] = value;
    this.setState(newState); //computed property name syntax
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  handleFlatDiscount() {
    this.setState({ mode: true });
    this.setState({ percentageDiscount: "" });
  }
  handlePercentageDiscount() {
    this.setState({ mode: false });
    this.setState({ flatDiscount: "" });
  }

  onCancel = () => {
    this.props.history.goBack();
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.props.currentPromoCode.promoCodeId);
    console.log(this.state.flatDiscount);
    console.log(this.state.percentageDiscount);

    if (this.state.flatDiscount === null && this.state.percentageDiscount === null) {
      const newPromoCode = new promoCodeToUpdate(
        this.props.currentPromoCode.promoCodeId,
        this.state.promoCodeName,
        this.state.originalFlatDiscount,
        this.state.originalPercentageDiscount,
        this.state.minimumPurchase,
        this.state.numRemaining
      );
      const req = new PromoCodeUpdateRequest(newPromoCode);

      this.props.updatePromoCode(req, this.props.history);
    } else {
      const newPromoCode = new promoCodeToUpdate(
        this.props.currentPromoCode.promoCodeId,
        this.state.promoCodeName,
        this.state.flatDiscount,
        this.state.percentageDiscount,
        this.state.minimumPurchase,
        this.state.numRemaining
      );
      const req = new PromoCodeUpdateRequest(newPromoCode);

      this.props.updatePromoCode(req, this.props.history);
    }
  };

  render() {
    const { errors } = this.props;
    const hasErrors = Object.keys(this.props.errors).length !== 0;
    const discountFlat = _.get(this.props.currentPromoCode, "flatDiscount", "");
    const discountPercentage = _.get(
      this.props.currentPromoCode,
      "percentageDiscount",
      ""
    );
    const originalDiscountType = discountFlat !== null && discountPercentage === null;

    return (
      <React.Fragment>
        <form className="material-form">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <MaterialTextField
                fieldLabel="Promo Code Name"
                onChange={this.onChange}
                fieldName="promoCodeName"
                state={this.state}
                errors={errors}
                autoFocus={true}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <MaterialTextField
                fieldLabel="Quantity"
                onChange={this.onChangeQuantity}
                fieldName="numRemaining"
                state={this.state}
                errors={errors}
                autoFocus={true}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <MaterialTextField
                fieldLabel="Minimum Purchase"
                onChange={this.onChangeDecimal}
                fieldName="minimumPurchase"
                state={this.state}
                errors={errors}
                autoFocus={true}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}

              />
            </Grid>

            <Grid item xs={12} md={6}>
              {originalDiscountType ? (
                <MaterialTextField
                  fieldLabel="Original Flat Discount"
                  onChange={this.onChange}
                  fieldName="originalFlatDiscount"
                  state={this.state}
                  errors={errors}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  autoFocus={true}
                  disabled={true}
                />
              ) : (
                <MaterialTextField
                  fieldLabel="Original Percentage Discount"
                  onChange={this.onChange}
                  fieldName="originalPercentageDiscount"
                  state={this.state}
                  errors={errors}
                  autoFocus={true}
                  disabled={true}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                outline
                color="info"
                active={this.state.mode}
                size="sm"
                onClick={this.handleFlatDiscount}
              >
                Flat Discount
              </Button>
              <Button
                outline
                color="info"
                size="sm"
                active={!this.state.mode}
                onClick={this.handlePercentageDiscount}
              >
                Percentage Discount
              </Button>
            </Grid>

            <Grid item xs={12} md={6}></Grid>

            {this.state.mode ? (
              <Grid item xs={12} md={6}>
                <MaterialTextField
                  fieldLabel="Flat Discount"
                  onChange={this.onChangeDecimal}
                  fieldName="flatDiscount"
                  state={this.state}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  errors={errors}
                  autoFocus={true}
                />
                <small>Format: 0.00</small>
              </Grid>
            ) : (
              <Grid item xs={12} md={6}>
                <MaterialTextField
                  fieldLabel="Percentage Discount"
                  onChange={this.onChangeDecimal}
                  fieldName="percentageDiscount"
                  state={this.state}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  errors={errors}
                  autoFocus={true}
                />
                <small>Format: 0.00</small>
              </Grid>
            )}
          </Grid>

          <ButtonToolbar className="form__button-toolbar">
            <Button
              color="primary"
              className="icon"
              onClick={e => this.handleSubmit(e)}
              disabled={hasErrors}
            >
              <p>
                <ContentSaveIcon />
                Submit
              </p>
            </Button>
            <Button
              className="icon"
              color="danger"
              onClick={() =>
                this.handleDelete(this.props.currentPromoCode.promoCodeId)
              }
            >
              <p>
                <DeleteIcon />
                Delete
              </p>
            </Button>
            <Link to={`/promoCode/viewAll`}>
              <Button className="icon">
                <p>
                  <TableEyeIcon />
                  View All
                </p>
              </Button>
            </Link>
            <Button type="button" className="icon" onClick={this.onCancel}>
              <p>
                <CloseCircleIcon />
                Cancel
              </p>
            </Button>
          </ButtonToolbar>
        </form>
      </React.Fragment>
    );
  }
}

//mapping global state to this component
const mapStateToProps = state => ({
  errors: state.errors,
  currentPromoCode: state.promoCode.currentPromoCode
});

const mapDispatchToProps = {
  createPromoCode,
  retrievePromoCodeById,
  updatePromoCode,
  deletePromoCode,
  clearErrors,
  updateErrors
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withMaterialConfirmDialog(withPage(PromoCodeUpdateForm, "Promo Code Update"))
);

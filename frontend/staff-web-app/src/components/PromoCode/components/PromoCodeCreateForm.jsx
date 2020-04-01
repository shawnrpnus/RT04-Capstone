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
import PromoCode from "../../../models/promoCode/promoCode";
import PromoCodeCreateRequest from "../../../models/promoCode/PromoCodeCreateRequest";
import { createPromoCode } from "../../../redux/actions/promoCodeActions";

class PromoCodeCreateForm extends Component {
  static propTypes = {
    errors: PropTypes.object,
    clearErrors: PropTypes.func
  };

  componentDidMount() {
    this.handleFlatDiscount();
  }

  constructor(props) {
    super(props);
    this.handleFlatDiscount = this.handleFlatDiscount.bind(this);
    this.handlePercentageDiscount = this.handlePercentageDiscount.bind(this);
    this.state = {
      promoCodeName: "",
      flatDiscount: "",
      percentageDiscount: "",
      minimumPurchase: "",
      numRemaining: ""
    };
  }

  onChange = e => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value }); //computed property name syntax
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  onChangeQuantity = e => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value.replace(/\D/, "") }); //computed property name syntax
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

    const promoCode = new PromoCode(
      this.state.promoCodeName,
      this.state.flatDiscount,
      this.state.percentageDiscount,
      this.state.minimumPurchase,
      this.state.numRemaining
    );
    const req = new PromoCodeCreateRequest(promoCode);
    console.log(req);

    this.props.createPromoCode(req, this.props.history);
  };

  render() {
    const { errors } = this.props;
    const hasErrors = Object.keys(this.props.errors).length !== 0;

    return (
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
            />
          </Grid>

          <Grid item xs={12} md={6}></Grid>

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
          <Button type="button" className="icon" onClick={this.onCancel}>
            <p>
              <CloseCircleIcon />
              Cancel
            </p>
          </Button>
        </ButtonToolbar>
      </form>
    );
  }
}

//mapping global state to this component
const mapStateToProps = state => ({
  errors: state.errors
});

const mapDispatchToProps = {
  createPromoCode, //api/staffEntity/createNewStaff
  clearErrors,
  updateErrors
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withPage(PromoCodeCreateForm, "Promo Code Management"));

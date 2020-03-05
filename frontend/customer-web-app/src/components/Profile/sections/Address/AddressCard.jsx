import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  cardLink,
  cardSubtitle,
  cardTitle
} from "assets/jss/material-kit-pro-react";
import Card from "components/UI/Card/Card";
import CardBody from "components/UI/Card/CardBody";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { retrieveAllContactUsCategoryEnum } from "redux/actions/contactUsAction";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import customCheckboxRadioSwitch from "assets/jss/material-kit-pro-react/customCheckboxRadioSwitchStyle";
import Checkbox from "@material-ui/core/Checkbox";
import { Check, Delete, Edit, Update } from "@material-ui/icons";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Layout/components/Grid/GridItem";
import { clearErrors } from "redux/actions";
import AddUpdateAddressRequest from "models/customer/AddUpdateAddressRequest";
import {
  removeShippingAddressDetails,
  updateShippingAddress
} from "redux/actions/customerActions";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import RemoveShippingAddressRequest from "models/customer/RemoveShippingAddressRequest";

const style = {
  cardTitle,
  cardLink,
  cardSubtitle
};

const useStyles = makeStyles(style);

export default function AddressCard({
  addNewAddress: [addNewAddress, setAddNewAddress],
  currAddress: [currAddress, setCurrAddress]
}) {
  //Redux
  const dispatch = useDispatch();
  const history = useHistory();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // useEffect(() => dispatch(retrieveAllContactUsCategoryEnum()), []);
  const unsortedShippingAddresses = useSelector(
    state => state.customer.loggedInCustomer.shippingAddresses
  );
  const shippingAddresses = unsortedShippingAddresses.sort((a, b) => {
    const result = b.default - a.default + b.billing - a.billing;
    if (b.default) return 1;
    if (a.default) return -1;
    if (result == 0 && b.default && !a.default) {
      return 1;
    } else {
      return result;
    }
  });

  const currCustomer = useSelector(state => state.customer.loggedInCustomer);

  const errors = useSelector(state => state.errors);

  //State
  // const [currAddress, setCurrAddress] = useState("");

  const onChange = (e, i) => {
    e.persist();
    // console.log(e);
    // console.log(i.item);
    // console.log(e);
    // console.log(i);

    if (e.target.value === "shipping") {
      i.item.default = e.target.checked;
      e.target.checked = false;
    }
    if (e.target.value === "billing") {
      i.item.billing = e.target.checked;
      e.target.checked = false;
    }

    const req = new AddUpdateAddressRequest(currCustomer.customerId, i.item);
    dispatch(updateShippingAddress(req, history));
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
    // const req = new AddUpdateAddressRequest(currCustomer.customerId, inputState.currentAddress);
    // console.log(req);
  };

  const onEditAddress = item => {
    setCurrAddress(item);
    setAddNewAddress(!addNewAddress);
    // console.log(currAddress);
  };

  const onDeleteAddress = item => {
    // console.log(item);
    // const req = new RemoveShippingAddressRequest(currCustomer.customerId, item.addressId);
    dispatch(
      removeShippingAddressDetails(
        currCustomer.customerId,
        item.addressId,
        enqueueSnackbar,
        history
      )
    );
    // setAddNewAddress(!addNewAddress);
  };

  const classes = useStyles();
  return (
    <Card style={{ marginTop: "5px", boxShadow: "none" }}>
      {shippingAddresses.map(function(item, i) {
        // console.log(item.default); //array[0]
        //console.log(i); //index
        return (
          <CardBody
            style={{
              border: ".5px solid #e8e7e7",
              boxShadow: "0 2px 4px 0 rgba(155,155,155,.2)"
            }}
            key={item.addressId}
          >
            <GridContainer>
              <GridItem xs={12} sm={10} md={10}>
                <h4 className={classes.cardTitle}>
                  {(() => {
                    if (item.default && item.billing) {
                      return "Shipping & Billing Address";
                    } else if (item.default && !item.billing) {
                      return "Shipping Address";
                    } else if (!item.default && item.billing) {
                      return "Billing Address";
                    } else {
                      return "Other Address";
                    }
                  })()}
                </h4>
                <h6 className={classes.cardSubtitle}>
                  {item.buildingName !== null ? item.buildingName : ""}
                </h6>
                {item.line1} {item.line2}
                <br />
                Singapore, S{item.postalCode}
                <br />
              </GridItem>

              <GridItem style={{ paddingLeft: "0" }} xs={12} sm={2} md={2}>
                <Button onClick={() => onEditAddress(item)} color="primary">
                  <Edit />
                </Button>
                <Button onClick={() => onDeleteAddress(item)} color="primary">
                  <Delete />
                </Button>
              </GridItem>

              <GridItem xs={12} sm={12} md={12}>
                {item.default ? (
                  <small>This is your default shipping address</small>
                ) : (
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={e => onChange(e, { item })}
                        value="shipping"
                        classes={{
                          switchBase: classes.switchBase,
                          checked: classes.switchChecked,
                          thumb: classes.switchIcon,
                          track: classes.switchBar
                        }}
                      />
                    }
                    classes={{
                      label: classes.label
                    }}
                    label="Set as default shipping address"
                  />
                )}
                <br />
                {item.billing ? (
                  <small>This is your default billing address</small>
                ) : (
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={e => onChange(e, { item })}
                        value="billing"
                        classes={{
                          switchBase: classes.switchBase,
                          checked: classes.switchChecked,
                          thumb: classes.switchIcon,
                          track: classes.switchBar
                        }}
                      />
                    }
                    classes={{
                      label: classes.label
                    }}
                    label="Set as default billing address"
                  />
                )}
              </GridItem>
            </GridContainer>
          </CardBody>
        );
      })}
    </Card>
  );
}

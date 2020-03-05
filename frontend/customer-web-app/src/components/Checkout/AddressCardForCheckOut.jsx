import {
  cardLink,
  cardSubtitle,
  cardTitle
} from "../../assets/jss/material-kit-pro-react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import AddUpdateAddressRequest from "../../models/customer/AddUpdateAddressRequest";
import {
  removeShippingAddressDetails,
  updateShippingAddress
} from "../../redux/actions/customerActions";
import { clearErrors } from "../../redux/actions";
import Card from "../UI/Card/Card";
import CardBody from "../UI/Card/CardBody";
import GridContainer from "../Layout/components/Grid/GridContainer";
import GridItem from "../Layout/components/Grid/GridItem";

import { Check, Delete, Edit } from "@material-ui/icons";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Checkbox from "@material-ui/core/Checkbox";
import { Button } from "components/UI/CustomButtons/Button";

const style = {
  cardTitle,
  cardLink,
  cardSubtitle
};

const useStyles = makeStyles(style);

export default function AddressCardForCheckOut({
  addNewAddress: [addNewAddress, setAddNewAddress],
  setCurrShippingAddress,
  setCurrBillingAddress
}) {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //Redux
  const dispatch = useDispatch();
  const history = useHistory();
  const currCustomer = useSelector(state => state.customer.loggedInCustomer);
  const errors = useSelector(state => state.errors);
  // useEffect(() => dispatch(retrieveAllContactUsCategoryEnum()), []);
  const unsortedShippingAddresses = useSelector(
    state => state.customer.loggedInCustomer.shippingAddresses
  );
  const [showOneAddress, setShowOneAddress] = useState(true);

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

  const [shownShippingAddress, setShownShippingAddress] = useState(
    shippingAddresses.find(item => item.default)
  );
  const [shownBillingAddress, setShownBillingAddress] = useState(
    shippingAddresses.find(item => item.billing)
  );
  const [mode, setMode] = useState(null);

  useEffect(() => {
    setCurrShippingAddress(shownShippingAddress);
    setCurrBillingAddress(shownBillingAddress);
  }, [shownShippingAddress, shownBillingAddress]);

  const changeShippingOrBilling = address => {
    if (mode === "changeShipping") {
      setShownShippingAddress(address);
    } else if (mode === "changeBilling") {
      setShownBillingAddress(address);
    }
    setMode(null);
  };

  return (
    <Card style={{ marginTop: "0", boxShadow: "none" }}>
      {mode === null ? (
        <React.Fragment>
          {[shownShippingAddress, shownBillingAddress].map(function(
            item,
            index
          ) {
            return item ? (
              <React.Fragment>
                <h5>
                  {index === 0
                    ? "Shipping address for this transaction"
                    : index === 1
                    ? "Billing address for this transaction"
                    : ""}
                </h5>
                <CardBody
                  style={{
                    border: ".5px solid #e8e7e7",
                    boxShadow: "0 2px 4px 0 rgba(155,155,155,.2)",
                    marginBottom: "30px"
                  }}
                  key={item.addressId}
                >
                  <GridContainer>
                    <GridItem md={9}>
                      <h6 className={classes.cardSubtitle}>
                        {item.buildingName !== null ? item.buildingName : ""}
                      </h6>
                      {item.line1} {item.line2}
                      <br />
                      Singapore, S{item.postalCode}
                      <br />
                    </GridItem>

                    <GridItem style={{ paddingLeft: "0" }} md={3}>
                      <Button
                        onClick={
                          index === 0
                            ? () => setMode("changeShipping")
                            : index === 1
                            ? () => setMode("changeBilling")
                            : () => console.log("shit went wrong")
                        }
                        color="primary"
                      >
                        CHANGE
                      </Button>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={12}>
                      {item.default ? (
                        <small>This is your default shipping address</small>
                      ) : (
                        ""
                      )}
                      <br />
                      {item.billing ? (
                        <small>This is your default billing address</small>
                      ) : (
                        ""
                      )}
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </React.Fragment>
            ) : (
              <Button>
                Add a {index === 0 ? "shipping" : index === 1 ? "billing" : ""}{" "}
                address
              </Button>
            );
          })}{" "}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {shippingAddresses.map(function(item, i) {
            return (
              <CardBody
                style={{
                  border: ".5px solid #e8e7e7",
                  boxShadow: "0 2px 4px 0 rgba(155,155,155,.2)",
                  marginBottom: "30px"
                }}
                key={item.addressId}
              >
                <GridContainer>
                  <GridItem xs={12} sm={10} md={10}>
                    <h6 className={classes.cardSubtitle}>
                      {item.buildingName !== null ? item.buildingName : ""}
                    </h6>
                    {item.line1} {item.line2}
                    <br />
                    Singapore, S{item.postalCode}
                    <br />
                  </GridItem>

                  <GridItem xs={12}>
                    <Button onClick={() => changeShippingOrBilling(item)}>
                      Select
                    </Button>
                  </GridItem>
                </GridContainer>
              </CardBody>
            );
          })}
          <Button onClick={() => setMode(null)} color="primary">
            CANCEL
          </Button>
        </React.Fragment>
      )}
    </Card>
  );
}

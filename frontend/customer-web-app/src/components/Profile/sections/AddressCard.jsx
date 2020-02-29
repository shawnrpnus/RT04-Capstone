import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  cardLink,
  cardSubtitle,
  cardTitle
} from "../../../assets/jss/material-kit-pro-react";
import Card from "../../UI/Card/Card";
import CardBody from "../../UI/Card/CardBody";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { retrieveAllContactUsCategoryEnum } from "../../../redux/actions/contactUsAction";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import customCheckboxRadioSwitch from "../../../assets/jss/material-kit-pro-react/customCheckboxRadioSwitchStyle";
import Checkbox from "@material-ui/core/Checkbox";
import {Check, Update} from "@material-ui/icons";
import GridContainer from "../../Layout/components/Grid/GridContainer";
import Grid from "@material-ui/core/Grid";
import GridItem from "../../Layout/components/Grid/GridItem";
import {clearErrors} from "../../../redux/actions";
import UpdateAddressRequest from "../../../models/customer/UpdateAddressRequest";
import {updateShippingAddress} from "../../../redux/actions/customerActions";

const style = {
  cardTitle,
  cardLink,
  cardSubtitle
};

const useStyles = makeStyles(style);

export default function CardExampleTitleTextLinks(props) {
  //Redux
  const dispatch = useDispatch();
  // useEffect(() => dispatch(retrieveAllContactUsCategoryEnum()), []);
  const unsortedShippingAddresses = useSelector(
    state => state.customer.loggedInCustomer.shippingAddresses
  );
  const shippingAddresses = unsortedShippingAddresses.sort((a,b) => {
    const result = b.default - a.default + b.billing - a.billing;
    if (b.default) return 1;
    if (a.default) return -1;
    if (result == 0 && b.default && !a.default){
      return 1
    } else {
      return result;
    }
  });

  const currCustomer = useSelector(
    state => state.customer.loggedInCustomer
  );

  const errors = useSelector(state => state.errors);


  //State
  const [inputState, setInputState] = useState({
    currentAddress: ""
  });

  const onChange = (e, i) => {
    e.persist();
    console.log(e);
    console.log(i.item);
    // console.log(e);
    console.log(i);

    if(e.target.value === "shipping") {
      i.item.default = e.target.checked;
      e.target.checked = false;
    }
    if(e.target.value === "billing") {
      i.item.billing = e.target.checked;
      e.target.checked = false;
    }

    const req = new UpdateAddressRequest(currCustomer.customerId, i.item);
    dispatch(updateShippingAddress(req, props.history));
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
    // const req = new UpdateAddressRequest(currCustomer.customerId, inputState.currentAddress);
    // console.log(req);
  };

  const classes = useStyles();
  return (
    <Card style={{ width: "20rem", margin: 100 }}>
      {shippingAddresses.map(function(item, i) {
        // console.log(item.default); //array[0]
        //console.log(i); //index
        return (
          <CardBody key={item.addressId}>
            <GridContainer>
              <GridItem xs={12} sm={8} md={8}>
                <h4 className={classes.cardTitle}>
                  {(() => {
                    if(item.default && item.billing) {
                      return "Shipping & Billing Address"
                    } else if (item.default && !item.billing) {
                      return "Shipping Address"
                    } else if (!item.default && item.billing) {
                      return "Billing Address"
                    } else {
                      return "Other Address"
                    }
                  })()}
                  {/*{item.default && item.billing ? "Shipping & Billing Address": ""}*/}
                  {/*{item.default ? "Shipping Address" : ""}*/}
                  {/*{item.billing ? "Billing Address": ""}*/}
                  {/*{!item.default && !item.billing ? 'Other Address' : ''}*/}
                </h4>
                <h6 className={classes.cardSubtitle}>
                  {item.buildingName !== null ? item.buildingName : ""}
                </h6>
                {item.line1} {item.line2}
                <br />
                Singapore, S{item.postalCode}
                <br />
              </GridItem>

              <GridItem xs={12} sm={4} md={4}>
                <br/>
                Edit
              </GridItem>

              <GridItem xs={12} sm={12} md={12}>
                {item.default ? (
                  <small>This is your default shipping address</small>
                ) : (
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={(e) => onChange(e, {item})}
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
                        onChange={(e) => onChange(e, {item})}
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

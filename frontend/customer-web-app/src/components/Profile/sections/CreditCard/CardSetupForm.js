import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";

import Button from "components/UI/CustomButtons/Button.js";
import CardSection from "components/ShoppingCart/CardSection";
import { saveCard } from "redux/actions/customerActions";
import axios from "axios";

const _ = require("lodash");
export default function CardSetupForm() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const clientSecretForCard = useSelector(
    state => state.customer.clientSecretForCard
  );
  const customer = useSelector(state => state.customer.loggedInCustomer);

  /*  
  Flow of events:
  1. Display card element from stripe
  2. Get initiateSaveCardRequest using customerId and get response (paymentMethodId)
  3. If success, axios post to saveCard and store the card in creditCard entity in Spring
     - Return customer and dispatch to redux store to update information
  */

  const handleSubmit = async event => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    axios
      .get(`/initiateSaveCardRequest/${customer.customerId}`)
      .then(async resp => {
        console.log(resp);
        const client_secret = resp.data;

        const result = await stripe.confirmCardSetup(client_secret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${customer.firstName} ${customer.lastName}`
            }
          }
        });

        console.log(result);

        if (result.error) {
          console.log(result.error);
          // Display result.error.message in your UI.
        } else {
          console.log(result.setupIntent.payment_method);
          dispatch(
            saveCard({ customerId: customer.customerId, defaultCard: false })
          );
          // The setup has succeeded. Display a success message and send
          // result.setupIntent.payment_method to your server to save the
          // card to a Customer
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const cc = _.get(customer, "creditCards");
  return (
    <div style={{ padding: "5%" }}>
      <CardSection key={cc && cc.length} />
      <Button
        color="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={!stripe}
        // className={classes.firstButton}
      >
        Save Card
      </Button>
    </div>
  );
}

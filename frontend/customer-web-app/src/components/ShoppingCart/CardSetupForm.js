import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";

import Button from "components/UI/CustomButtons/Button.js";
import CardSection from "./CardSection";

export default function CardSetupForm() {
  const stripe = useStripe();
  const elements = useElements();
  const clientSecretForCard = useSelector(
    state => state.customer.clientSecretForCard
  );
  const customer = useSelector(state => state.customer.loggedInCustomer);

  const handleSubmit = async event => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmCardSetup(clientSecretForCard, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: customer.firstName + customer.lastName
        }
      }
    });

    if (result.error) {
      // Display result.error.message in your UI.
    } else {
      // The setup has succeeded. Display a success message and send
      // result.setupIntent.payment_method to your server to save the
      // card to a Customer
    }
  };

  return (
    <div style={{ padding: "5%" }}>
      <CardSection />
      <Button
        color="success"
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

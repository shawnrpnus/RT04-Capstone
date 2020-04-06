import React from "react";
import {
  useStripe,
  useElements,
  CardElement,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import Button from "components/UI/CustomButtons/Button.js";
import { useDispatch, useSelector } from "react-redux";
import CardSection from "./CardSection";
import axios from "axios";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const clientSecret = useSelector((state) => state.customer.clientSecret);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: "Jenny Roger",
        },
      },
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === "succeeded") {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
        // console.log(result);
      }
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
        Confirm order
      </Button>
    </div>
  );
}

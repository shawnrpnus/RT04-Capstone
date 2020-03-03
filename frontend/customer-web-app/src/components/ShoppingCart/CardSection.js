import React, { useEffect } from "react";
import {
  useElements,
  CardElement,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement
} from "@stripe/react-stripe-js";
import "./CardSectionStyles.css";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "18px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  }
};

function CardSection() {
  return (
    <label>
      Card details{" "}
      <CardElement hidePostalCode={true} options={CARD_ELEMENT_OPTIONS} />
    </label>
    //
  );
}

export default CardSection;

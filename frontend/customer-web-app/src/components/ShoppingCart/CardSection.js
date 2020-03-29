import React, { useEffect } from "react";
import {
  useElements,
  CardElement,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement
} from "@stripe/react-stripe-js";
import "./CardSectionStyles.css";

function CardSection(props) {
  const disabled = props.disabled ? props.disabled : false;
  const CARD_ELEMENT_OPTIONS = {
    hidePostalCode: true,
    disabled,
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
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

  return (
    <label>
      Card details <CardElement options={CARD_ELEMENT_OPTIONS} />
    </label>
    //
  );
}

export default CardSection;

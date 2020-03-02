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
  // const elements = useElements();

  // const onChange = () => {
  //   const cardElement = elements.getElement(CardElement);
  //   const ccnumber = document.querySelector('input[name="cardnumber"]');
  //   console.log(ccnumber);
  // };

  // console.log(document.getElementsByTagName("input"));
  // // var myPostalCodeField = document.querySelector(
  //   'input[name="my-postal-code"]'
  // );
  // myPostalCodeField.addEventListener("change", function(event) {
  //   cardElement.update({ value: { postalCode: event.target.value } });
  // });

  // // Dynamically change the styles of an element
  // window.addEventListener("resize", function(event) {
  //   if (window.innerWidth <= 320) {
  //     cardElement.update({ style: { base: { fontSize: "13px" } } });
  //   } else {
  //     cardElement.update({ style: { base: { fontSize: "16px" } } });
  //   }
  // });

  return (
    <label>
      Card details{" "}
      <CardElement
        hidePostalCode="true"
        options={CARD_ELEMENT_OPTIONS}
        autoComplete={true}
      />
    </label>
    //
  );
}

export default CardSection;

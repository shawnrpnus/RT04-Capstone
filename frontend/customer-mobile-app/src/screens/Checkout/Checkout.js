import React, { useState } from "react";
import { Block, Text } from "galio-framework";
import { Dimensions, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CollectionOptions from "src/screens/Checkout/CollectionOptions";
import PaymentOptions from "src/screens/Checkout/PaymentOptions";
import CheckoutItemList from "src/screens/Checkout/CheckoutItemList";
import Spinner from "react-native-loading-spinner-overlay";
import PromoCode from "src/screens/Checkout/PromoCode";
import Totals from "src/screens/Checkout/Totals";
import { Button } from "react-native-paper";
import Theme from "src/constants/Theme";
import { set } from "react-native-reanimated";
import EditCardModal from "src/screens/Checkout/EditCardModal";
import EditAddressModal from "src/screens/Checkout/EditAddressModal";
import { makePaymentMobile } from "src/redux/actions/customerActions";

const { width, height } = Dimensions.get("window");

/* REQUIRED DATA
1. customerId - get from customer
2. paymentMethodId - get from creditCard
3. totalAmount - calculate from promo code * shopping cart's final total amount
4. storeId - get from in-store shopping cart
5. deliveryAddress - default / selected
6. billingAddress - default / selected
7. storeToCollectId - if collect in-store -> equals to storeId, if deliver set to null
8. promoCodeId - from form
9. cardIssuer - get from creditCard
10. cardLast4 - get from creditCard
11. collectionModeEnum - depends on collectionOption
 */

function Checkout(props) {
  const {navigation} = props;
  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const [collectionOption, setCollectionOption] = useState("in-store");
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [creditCard, setCreditCard] = useState(null);
  const [promoCode, setPromoCode] = useState(null);
  const [checkoutFinalTotal, setCheckoutFinalTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creditCardModalVisible, setCreditCardModalVisible] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState(null);
  const [outOfStock, setOutOfStock] = useState(false); //use for items stock check

  const confirmCheckout = () => {
    const req = {
      customerId: customer.customerId,
      paymentMethodId: creditCard.paymentMethodId,
      totalAmount: Number(checkoutFinalTotal),
      storeId: customer.inStoreShoppingCart.store.storeId,
      deliveryAddress,
      billingAddress,
      storeToCollectId:
        collectionOption === "in-store"
          ? customer.inStoreShoppingCart.store.storeId
          : null,
      promoCodeId: promoCode ? promoCode.promoCodeId : null,
      cardIssuer: creditCard.issuer,
      cardLast4: creditCard.last4,
      collectionModeEnum:
        collectionOption === "in-store" ? "IN_STORE" : "DELIVERY"
    };
    dispatch(makePaymentMobile(req, customer.customerId, setLoading, navigation));
  };

  const requiredAddressesPresent =
    collectionOption === "delivery"
      ? !!billingAddress && !!deliveryAddress
      : collectionOption === "in-store"
      ? !!billingAddress
      : false;

  return (
    <Block flex={1} center style={{ width: width, paddingTop: 5 }}>
      {customer && (
        <ScrollView style={{ width: width, height: height }} keyboardShouldPersistTaps="handled">
          <CollectionOptions
            collectionOption={collectionOption}
            setCollectionOption={setCollectionOption}
            deliveryAddress={deliveryAddress}
            setDeliveryAddress={setDeliveryAddress}
            customer={customer}
            setAddressModalMode={setAddressModalMode}
          />
          <PaymentOptions
            customer={customer}
            creditCard={creditCard}
            setCreditCard={setCreditCard}
            billingAddress={billingAddress}
            setBillingAddress={setBillingAddress}
            setCreditCardModalVisible={setCreditCardModalVisible}
            setAddressModalMode={setAddressModalMode}
          />
          <CheckoutItemList
            customer={customer}
            useWarehouseStock={collectionOption === "delivery"}
            setLoading={setLoading}
            setOutOfStock={setOutOfStock}
          />
          <PromoCode
            customer={customer}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            setLoading={setLoading}
          />
          <Totals
            shoppingCartFinalTotal={
              customer.inStoreShoppingCart.finalTotalAmount
            }
            promoCode={promoCode}
            setCheckoutFinalTotal={setCheckoutFinalTotal}
            confirmCheckout={confirmCheckout}
            outOfStock={outOfStock}
            requiredDetailsPresent={requiredAddressesPresent && !!creditCard}
          />
        </ScrollView>
      )}
      <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={{ color: "white" }}
        overlayColor="rgba(0,0,0,0.75)"
      />
      <EditCardModal
        creditCardModalVisible={creditCardModalVisible}
        setCreditCardModalVisible={setCreditCardModalVisible}
        customer={customer}
        setCreditCard={setCreditCard}
      />

      <EditAddressModal
        addressModalMode={addressModalMode}
        setAddressModalMode={setAddressModalMode}
        customer={customer}
        setDeliveryAddress={setDeliveryAddress}
        setBillingAddress={setBillingAddress}
      />
    </Block>
  );
}

export default Checkout;

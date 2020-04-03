import React, { useState } from "react";
import { Block, Text } from "galio-framework";
import { Dimensions, ScrollView } from "react-native";
import { useSelector } from "react-redux";
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

const { width, height } = Dimensions.get("window");

/* REQUIRED DATA
1. customerId - get from customer
2. paymentMethodId - get from customer.creditCard
3. totalAmount - calculate from promo code * shopping cart's final total amount
4. storeId - get from in-store shopping cart
5. deliveryAddress - default / selected
6. billingAddress - default / selected
7. storeToCollectId - if collect in-store -> equals to storeId, if deliver set to null
8. promoCodeId - from form
 */

function Checkout(props) {
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
  const [checkoutDisabled, setCheckoutDisabled] = useState(false);

  const confirmCheckout = () => {
    const req = {
      customerId: customer.customerId,
      paymentMethodId: creditCard.paymentMethodId,
      totalAmount: checkoutFinalTotal,
      storeId: customer.inStoreShoppingCart.store.storeId,
      deliveryAddress,
      billingAddress,
      storeToCollectId:
        collectionOption === "in-store"
          ? customer.inStoreShoppingCart.store.storeId
          : null,
      promoCodeId: promoCode ? promoCode.promoCodeId : null
    };
    console.log(req);
  };

  return (
    <Block flex={1} center style={{ width: width, paddingTop: 5 }}>
      {customer && (
        <ScrollView style={{ width: width, height: height }}>
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
            setCheckoutDisabled={setCheckoutDisabled}
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
            checkoutDisabled={checkoutDisabled}
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

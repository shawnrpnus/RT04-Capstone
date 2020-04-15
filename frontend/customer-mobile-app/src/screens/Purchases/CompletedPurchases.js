import React, {useEffect, useState} from "react";
import {Text} from "galio-framework";
import {Dimensions} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {retrieveCustomerCompletedPurchases} from "src/redux/actions/transactionActions";
import TransactionList from "src/screens/Purchases/Shared/TransactionList";

const { width, height } = Dimensions.get("window");

function CompletedPurchases(props) {
    const { navigation } = props;
    const dispatch = useDispatch();
    const customer = useSelector(state => state.customer.loggedInCustomer);
    const completedPurchases = useSelector(
        state => state.transaction.completedPurchases
    );
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (customer) {
            dispatch(
                retrieveCustomerCompletedPurchases(customer.customerId, setLoading)
            );
        }
    }, [customer.customerId]);

    const onRefresh = () => {
        if (customer) {
            dispatch(
                retrieveCustomerCompletedPurchases(customer.customerId, setRefreshing)
            );
        }
    };

    const renderEmpty = () => {
        return (
            <Text h5 style={{ padding: 20, textAlign: "center" }}>
                {customer && customer.inStoreShoppingCart.shoppingCartItems.length > 0
                    ? `You do not have any past store transactions at ${customer.inStoreShoppingCart.store.storeName.toUpperCase()}.`
                    : "Scan a QR code to get your store purchase history"}
            </Text>
        );
    };


    return (
        <TransactionList
            transactions={completedPurchases}
            setLoading={setLoading}
            loading={loading}
            routeToNavigate={"Purchase Details"}
            renderEmpty={renderEmpty}
            onRefresh={onRefresh}
            refreshing={refreshing}
            navigation={navigation}
        />
    );
}

export default CompletedPurchases;

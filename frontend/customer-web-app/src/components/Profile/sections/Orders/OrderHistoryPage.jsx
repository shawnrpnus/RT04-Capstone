import React, { useEffect, useState } from "react";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import { Button } from "components/UI/CustomButtons/Button";
import { useDispatch, useSelector } from "react-redux";
import { retrieveCustomerTransactions } from "redux/actions/transactionActions";
import OrderHistoryCard from "components/Profile/sections/Orders/OrderHistoryCard";
import { makeStyles } from "@material-ui/core/styles";
import typographyStyle from "assets/jss/material-kit-pro-react/views/componentsSections/typographyStyle";
import FilterBar from "components/Shop/FilterBar";
import Drawer from "@material-ui/core/Drawer";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import OrderFilterBar from "components/Profile/sections/Orders/OrderFilterBar";
import Divider from "@material-ui/core/Divider";

const _ = require("lodash");

const useTypoStyles = makeStyles(typographyStyle);

const styles = theme => ({
  filterDrawer: {
    width: "300px"
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 999,
    color: "#fff"
  }
});

const useStyles = makeStyles(styles);

function OrderHistoryPage(props) {
  const typoClasses = useTypoStyles();
  const classes = useStyles();

  const dispatch = useDispatch();
  const customer = useSelector(
    state => state.customer.loggedInCustomer,
    _.isEqual
  );
  const transactions = useSelector(
    state => state.transaction.displayedTransactions
  );

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(retrieveCustomerTransactions(customer.customerId));
  }, [customer]);

  return (
    <GridContainer>
      <GridItem
        md={12}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end"
        }}
      >
        <h4 className={typoClasses.title} style={{ float: "left", margin: 0 }}>
          My Order History
        </h4>
        <Button
          color="primary"
          style={{ float: "right" }}
          onClick={() => setFilterDrawerOpen(true)}
        >
          Filter/Sort
        </Button>
      </GridItem>
      <GridItem md={12}>
        {transactions &&
          transactions.length > 0 &&
          transactions.map(transaction => (
            <React.Fragment>
              <OrderHistoryCard
                key={transaction.transactionId}
                transaction={transaction}
              />
            </React.Fragment>
          ))}
        {transactions && transactions.length === 0 && (
          <h3 style={{ textAlign: "center" }}>
            You do not have any past orders.
          </h3>
        )}
      </GridItem>
      <Drawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        className={classes.filterDrawer}
        classes={{ paper: classes.filterDrawer }}
      >
        <OrderFilterBar
          customerId={customer.customerId}
          setFilterDrawerOpen={setFilterDrawerOpen}
          setIsLoading={setIsLoading}
        />
      </Drawer>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </GridContainer>
  );
}

export default OrderHistoryPage;

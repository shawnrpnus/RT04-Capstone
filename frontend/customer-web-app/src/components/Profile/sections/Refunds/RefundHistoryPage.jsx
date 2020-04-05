import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GridContainer from "../../../Layout/components/Grid/GridContainer";
import GridItem from "../../../Layout/components/Grid/GridItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Button } from "../../../UI/CustomButtons/Button";
import typographyStyle from "../../../../assets/jss/material-kit-pro-react/views/componentsSections/typographyStyle";
import { retrieveRefundsByCustomerId } from "../../../../redux/actions/refundAction";
import RefundHistoryCard from "./RefundHistoryCard";

const _ = require("lodash");
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
const useTypoStyles = makeStyles(typographyStyle);

function RefundHistoryPage(props) {
  const typoClasses = useTypoStyles();
  const classes = useStyles();
  const dispatch = useDispatch();

  const customer = useSelector(
    state => state.customer.loggedInCustomer,
    _.isEqual
  );
  const refunds = useSelector(state => state.refund.refunds);

  useEffect(() => {
    dispatch(retrieveRefundsByCustomerId(customer.customerId));
  }, [customer.customerId]);

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
          My Refund History
        </h4>
      </GridItem>
      <GridItem md={12}>
        {refunds &&
          refunds.length > 0 &&
          refunds.map(refund => (
            <React.Fragment key={refund.refundId}>
              <RefundHistoryCard key={refund.refundId} currRefund={refund} />
            </React.Fragment>
          ))}
      </GridItem>
    </GridContainer>
  );
}

export default RefundHistoryPage;

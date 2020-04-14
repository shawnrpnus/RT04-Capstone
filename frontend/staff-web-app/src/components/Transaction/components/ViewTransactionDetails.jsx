import React, {useEffect, useState} from "react";
import withPage from "../../Layout/page/withPage";
import Button from "@material-ui/core/Button";
import QRScannerTransaction from "./QRScannerTransaction";
import {
  confirmReceivedTransaction, retrieveTransactionByQRCode,
} from "../../../redux/actions/transactionActions";
import {useDispatch, useSelector} from "react-redux";
import TransactionStoreQR from "./TransactionStoreQR";
import Grid from "@material-ui/core/Grid";
import UpdateTransactionRequest from "../../../models/transaction/UpdateTransactionRequest";
import {useConfirm} from "material-ui-confirm";

const ViewTransactionDetails = props => {
  const [openQR, setOpenQR] = useState(false);
  const dispatch = useDispatch();
  const confirmDialog = useConfirm();
  const [transactionId, setTransactionId] = useState(null);
  const [textToDisplay, setTextToDisplay] = useState("Scan Transaction QR");
  const handleOpenQR = () => {
    setOpenQR(true);
    console.log(openQR);
  };
  const currTransaction = useSelector(state => state.transaction.transaction);
  const currStaff = useSelector(state => state.staffEntity.loggedInStaff);

  console.log(transactionId);
  useEffect(() => {
    if (transactionId) {
      dispatch(retrieveTransactionByQRCode(transactionId, currStaff.store.storeId));
    }
  }, [transactionId]);

  const handleConfirm = () => {
    const request = new UpdateTransactionRequest(transactionId);
    confirmDialog({
      description:
        "Transaction will be marked as collected"
    })
      .then(() => {
        dispatch(confirmReceivedTransaction(request));
      })
      .catch(() => null);
  };


  return (
    <div>
      <Grid container>
        <Grid item xs={6}>
          <Button
            color="primary"
            onClick={handleOpenQR}

          > {textToDisplay}
          </Button>
        </Grid>
        <Grid item xs={12}>
          {currTransaction ?
            <TransactionStoreQR transaction={currTransaction}
            />
            :
            ""}
        </Grid>
        <Grid item xs={9}>
        </Grid>
        <Grid container item xs={3} justify="flex-end">
          {currTransaction ?
            <Button
              color="primary"
              onClick={handleConfirm}

            > Confirm
            </Button>
            :
            ""}
        </Grid>
      </Grid>
        {openQR ? (
            <QRScannerTransaction
              onClose={() => setOpenQR(false)}
              open={openQR}
              setOpenQR={setOpenQR}
              setTextToDisplay={setTextToDisplay}
              transactionId={transactionId}
              setTransactionId={setTransactionId}
            />
          )
          :
          ""}

    </div>
  )
};

export default withPage(ViewTransactionDetails);

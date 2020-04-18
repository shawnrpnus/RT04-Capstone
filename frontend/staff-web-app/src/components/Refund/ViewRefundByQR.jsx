import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useConfirm} from "material-ui-confirm";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import withPage from "../Layout/page/withPage";
import QRScannerTransaction from "../Transaction/components/QRScannerTransaction";
import QRScannerRefund from "./QRScannerRefund";
import {retrieveTransactionByQRCode} from "../../redux/actions/transactionActions";
import {useHistory} from "react-router-dom";

const ViewRefundByQR = props => {
  const [openQR, setOpenQR] = useState(false);
  const dispatch = useDispatch();
  const confirmDialog = useConfirm();
  const history = useHistory();
  const [textToDisplay, setTextToDisplay] = useState("Scan Refund QR");
  const [refundId, setRefundId] = useState(null);
  const [isConfirm, setIsConfirm] = useState(false);
  const handleOpenQR = () => {
    setOpenQR(true);
  };

  useEffect(() => {
    if (refundId) {
      history.push(`/refund/updateRefundRecord/${refundId}`)
    }
  }, [refundId]);

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
      </Grid>

      {openQR ? (
          <QRScannerRefund
            onClose={() => setOpenQR(false)}
            open={openQR}
            setOpenQR={setOpenQR}
            refundId={refundId}
            setRefundId={setRefundId}
            setTextToDisplay={setTextToDisplay}
          />
        )
        :
        ""}

    </div>
  )
};

export default withPage(ViewRefundByQR);

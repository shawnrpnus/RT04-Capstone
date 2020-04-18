import React, {useState} from "react";
import QrReader from "react-qr-reader";
import Dialog from "@material-ui/core/Dialog";
import {useConfirm} from "material-ui-confirm";
import {toast} from "react-toastify";

const _ = require("lodash");

const QRScannerRefund = ({
                           onClose,
                           open,
                           setOpenQR,
                           setRefundId,
                           textToDisplay,
                           setTextToDisplay,
                           id,
                         }) => {


  const handleError = (err) => {
    if (!pause) console.error(err);
  };
  const confirmDialog = useConfirm();
  const [pause, setPause] = useState(false);

  const handleScan = (data) => {
    if (data) {
      if (!pause) {
        if (data) {
          confirmDialog({
            description: "Retrieve refund",
          })
            .then(() => {
              console.log(data);
              setRefundId(data);
              setOpenQR(false);
            })
            .catch(() => setPause(false));
        } else {
          toast.error("Invalid refund", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1500,
            onClose: () => setPause(false),
          });
        }
      }
    }
  };
  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth={"xs"}>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{width: "100%"}}
      />
    </Dialog>
  );
};

export default QRScannerRefund;

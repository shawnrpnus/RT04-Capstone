import React, { useState } from "react";
import QrReader from "react-qr-reader";
import Dialog from "@material-ui/core/Dialog";
import { useConfirm } from "material-ui-confirm";
import { toast } from "react-toastify";

const _ = require("lodash");

const QRScannerTransaction = ({
   onClose,
    open,
    setOpenQR,
   setTransactionId,
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
            description: "Retrieve transaction",
          })
            .then(() => {
              console.log(data);
              setTransactionId(data);
              setOpenQR(false);
              setTextToDisplay("Scan Another QR");
            })
            .catch(() => setPause(false));
        } else {
          toast.error("Wrong transaction", {
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
        style={{ width: "100%" }}
      />
    </Dialog>
  );
};

export default QRScannerTransaction;

import React, { useEffect, useState } from "react";
import QrReader from "react-qr-reader";
import Dialog from "@material-ui/core/Dialog";
import { useConfirm } from "material-ui-confirm";

const _ = require("lodash");

const QRScanner = ({ onClose, open, confirmDelivery, onCloseOuterDialog }) => {
  const [result, setResult] = useState("");
  const [pause, setPause] = useState(false);
  const confirmDialog = useConfirm();

  const handleScan = data => {
    if (data) {
      if (!pause) {
        console.log(data);
        setPause(true);
        setResult(data);
        confirmDialog({
          description: "Delivery will be confirmed"
        })
          .then(() => {
            confirmDelivery();
            onClose();
            onCloseOuterDialog();
          })
          .catch(() => setPause(false));
      }
    }
  };

  const handleError = err => {
    if (!pause) console.error(err);
  };

  return (
    <div>
      <Dialog onClose={onClose} open={open} fullWidth maxWidth={"xs"}>
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%" }}
        />
        <p>{result}</p>
      </Dialog>
    </div>
  );
};

export default QRScanner;

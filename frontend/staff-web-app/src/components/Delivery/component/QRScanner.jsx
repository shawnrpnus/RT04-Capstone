import React, { useState } from "react";
import QrReader from "react-qr-reader";
import Dialog from "@material-ui/core/Dialog";
import { useConfirm } from "material-ui-confirm";
import { toast } from "react-toastify";

const _ = require("lodash");

const QRScanner = ({
  onClose,
  open,
  confirmDelivery,
  onCloseOuterDialog,
  id,
}) => {
  const [result, setResult] = useState("");
  const [pause, setPause] = useState(false);
  const confirmDialog = useConfirm();

  const handleScan = (data) => {
    if (data) {
      if (!pause) {
        setPause(true);
        setResult(data);
        if (data === id.toString()) {
          confirmDialog({
            description: "Delivery will be confirmed",
          })
            .then(() => {
              confirmDelivery();
              onClose();
              onCloseOuterDialog();
            })
            .catch(() => setPause(false));
        } else {
          toast.error("Wrong recipient", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1500,
            onClose: () => setPause(false),
          });
        }
      }
    }
  };

  const handleError = (err) => {
    if (!pause) console.error(err);
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth={"xs"}>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />
      <p>{result}</p>
    </Dialog>
  );
};

export default QRScanner;

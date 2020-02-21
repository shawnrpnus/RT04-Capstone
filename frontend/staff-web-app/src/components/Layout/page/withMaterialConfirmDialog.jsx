import React from "react";
import { useConfirm } from "material-ui-confirm";

function withMaterialConfirmDialog(Component) {
  return function MaterialDialogProvider(props) {
    const confirm = useConfirm();
    return <Component {...props} confirmDialog={confirm} />;
  };
}

export default withMaterialConfirmDialog;

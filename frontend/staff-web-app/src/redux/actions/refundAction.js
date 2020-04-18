import axios from "axios";
import { toast } from "react-toastify";
import * as types from "./types";
import { dispatchErrorMapError } from "./index";
import { CREATE_IN_STORE_REFUND_RECORD } from "./types";
import { UPDATE_REFUND_RECORD } from "./types";

axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;
const REFUND_BASE_URL = "/api/refund/";
const jsog = require("jsog");

export const createInStoreRefundRequest = (
  refundRequest,
  history,
  setInputState
) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(REFUND_BASE_URL + "createRefundRecord", refundRequest)
      .then(response => {
        const { data } = jsog.decode(response);
        console.log(data);
        dispatch(createInStoreRefundSuccess(data));
        history.push(`/refund/viewRefundRecord/${data.refundId}`);
        toast.success("Refund Request Created!", {
          position: toast.POSITION.TOP_CENTER
        });
        // setInputState({
        //   contactUsCategory: "",
        //   customerEmail: "",
        //   content: "",
        //   firstName: "",
        //   lastName: ""
        // });
      })
      .catch(err => {
        // toast.error(err.response.data.errorMessage.toString(), {
        //   position: toast.POSITION.TOP_CENTER
        // });
        dispatchErrorMapError(err, dispatch);
        console.log(err.response.data);
      });
  };
};

export const createInStoreRefundSuccess = data => ({
  type: CREATE_IN_STORE_REFUND_RECORD,
  currRefund: data
});

export const updateInStoreRefundRequest = (
  updateRefundLineItemHandlerRequest,
  history
) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(
        REFUND_BASE_URL + "updateRefundRecord",
        updateRefundLineItemHandlerRequest
      )
      .then(response => {
        const { data } = jsog.decode(response);
        console.log(data);
        dispatch(updateRefundRecordSuccess(data));
        history.push(`/refund/viewRefundRecord/${data.refundId}`);
        toast.success("Refund Request Updated!", {
          position: toast.POSITION.TOP_CENTER
        });
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
        toast.error(err.response.data.errorMessage.toString(), {
          position: toast.POSITION.TOP_CENTER
        });
        console.log(err.response.data);
      });
  };
};

export const updateRefundRecordSuccess = data => ({
  type: UPDATE_REFUND_RECORD,
  currRefund: data
});

export const retrieveAllRefundModeEnum = () => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .get(REFUND_BASE_URL + "retrieveAllRefundModeEnum")
      .then(response => {
        // const data = jsog.decode(response);
        // console.log(response.data);
        dispatch(retrieveAllRefundModeEnumSuccess(response.data));
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER
        });
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const retrieveAllRefundModeEnumSuccess = data => ({
  type: types.RETRIEVE_ALL_REFUND_MODE_ENUM_SUCCESS,
  allRefundModeEnum: data
});

export const retrieveAllRefundStatusEnum = () => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .get(REFUND_BASE_URL + "retrieveAllRefundStatusEnum")
      .then(response => {
        // const data = jsog.decode(response);
        // console.log(response.data);
        dispatch(retrieveAllRefundStatusEnumSuccess(response.data));
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER
        });
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const retrieveAllRefundStatusEnumSuccess = data => ({
  type: types.RETRIEVE_ALL_REFUND_STATUS_ENUM_SUCCESS,
  allRefundStatusEnum: data
});

export const retrieveAllRefundProgressEnum = () => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .get(REFUND_BASE_URL + "retrieveAllRefundProgressEnum")
      .then(response => {
        // const data = jsog.decode(response);
        // console.log(response.data);
        dispatch(retrieveAllRefundProgressEnumSuccess(response.data));
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER
        });
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const retrieveAllRefundProgressEnumSuccess = data => ({
  type: types.RETRIEVE_ALL_REFUND_PROGRESS_ENUM_SUCCESS,
  allRefundProgressEnum: data
});

export const retrieveRefundById = (refundId, setIsLoading) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .get(REFUND_BASE_URL + `retrieveRefundById/${refundId}`)
      .then(response => {
        const data = jsog.decode(response.data);
        console.log(data);
        dispatch(retrieveRefundByIdSuccess(data));
        setIsLoading(false);
      })
      .catch(err => {
        toast.error(err.response.data.errorMessage, {
          position: toast.POSITION.TOP_CENTER
        });
        dispatchErrorMapError(err, dispatch);
      });
  };
};

const retrieveRefundByIdSuccess = data => ({
  type: types.RETRIEVE_REFUND_BY_ID,
  currRefund: data
});

export const retrieveAllRefunds = () => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .get(REFUND_BASE_URL + "retrieveAllRefunds")
      .then(response => {
        const data = jsog.decode(response.data);
        // console.log(data);
        dispatch(retrieveAllRefundsSuccess(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};
const retrieveAllRefundsSuccess = data => ({
  type: types.RETRIEVE_ALL_REFUNDS,
  allRefunds: data
});

export const retrieveAllRefundsByParameter = (
  storeId,
  warehouseId,
) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .get(REFUND_BASE_URL + `retrieveAllRefundsByParameter`, {
        params: { storeId, warehouseId }
      })
      .then(response => {
        const data = jsog.decode(response.data);
        // console.log(data);
        dispatch(retrieveAllRefundsSuccess(data));
      })
      .catch(err => {
        dispatchErrorMapError(err, dispatch);
      });
  };
};

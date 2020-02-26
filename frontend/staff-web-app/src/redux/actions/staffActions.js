import axios from "axios";
import * as types from "./types";
import { toast } from "react-toastify";
import { GET_ERRORS } from "./types";
import {retrieveAllStores} from "./storeActions";

const STAFF_BASE_URL = "/api/staff";
const jsog = require("jsog");

export const retrieveStaffById = (staffId, history) => {
  return dispatch => {
    axios
      .get(STAFF_BASE_URL + "/retrieveStaffById/" + staffId)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(retrieveStaffSuccess(data));
      })
      .catch(err => {
        toast.error("Store Not Found!", {
          position: toast.POSITION.TOP_CENTER
        });
        history.push(`/store/viewAll`);
        dispatch(retrieveStaffError(err.response.data));
      });
  };
};

const retrieveStaffSuccess = data => ({
  type: types.RETRIEVE_STAFF,
  staffEntity: data
});

const retrieveStaffError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const retrieveAllStaff = () => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .get(STAFF_BASE_URL + `/retrieveAllStaff`)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(retrieveAllStaffSuccess(data));
      })
      .catch(err => {
        dispatch(retrieveAllStaffError(err.response.data));
      });
  };
};

const retrieveAllStaffSuccess = data => ({
  type: types.RETRIEVE_ALL_STAFF,
  staffEntity: data
});

const retrieveAllStaffError = data => ({
  type: GET_ERRORS,
  errorMap: data
});

export const createNewStaff = (staffCreateRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(STAFF_BASE_URL + "/createNewStaff", staffCreateRequest)
      .then(response => {
        const { data } = jsog.decode(response);
        const staffId = data.staffId;
        dispatch(createStaffSuccess(data));
        toast.success("Staff Created!", {
          position: toast.POSITION.TOP_CENTER
        });
        //history.push(`/store/view/${storeId}`); // TODO: update redirect path
      })
      .catch(err => {
        dispatch(createStaffError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const createStaffSuccess = data => ({
  type: types.CREATE_STAFF,
  staffEntity: data
});

const createStaffError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const createNewStaffAccount = (StaffAccountCreateRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(
        STAFF_BASE_URL + "/createNewStaffAccount",
        StaffAccountCreateRequest
      )
      .then(response => {
        const { data } = jsog.decode(response);
        const staffId = data.staffId;
        dispatch(createStaffAccountSuccess(data));
        toast.success("Staff Account Created!", {
          position: toast.POSITION.TOP_CENTER
        });
        //history.push(`/store/view/${storeId}`); // TODO: update redirect path
      })
      .catch(err => {
        dispatch(createStaffAccountError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const createStaffAccountSuccess = data => ({
  type: types.CREATE_STAFF_ACCOUNT,
  staffEntity: data
});

const createStaffAccountError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const changePassword = (StaffChangePasswordRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(STAFF_BASE_URL + "/changeStaffPassword", StaffChangePasswordRequest)
      .then(response => {
        const { data } = jsog.decode(response);
        const staffId = data.staffId;
        dispatch(changeStaffPasswordSuccess(data));
        toast.success("Staff password changed!", {
          position: toast.POSITION.TOP_CENTER
        });
        //history.push(`/store/view/${storeId}`); // TODO: update redirect path
      })
      .catch(err => {
        dispatch(changeStaffPasswordError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const changeStaffPasswordSuccess = data => ({
  type: types.CHANGE_STAFF_PASSWORD,
  staffEntity: data
});

const changeStaffPasswordError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const resetPassword = (ResetStaffPasswordRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(STAFF_BASE_URL + "/resetStaffPassword", ResetStaffPasswordRequest)
      .then(response => {
        const { data } = jsog.decode(response);
        const staffId = data.staffId;
        dispatch(resetStaffPasswordSuccess(data));
        toast.success("Staff password reset!", {
          position: toast.POSITION.TOP_CENTER
        });
        //history.push(`/store/view/${storeId}`); // TODO: update redirect path
      })
      .catch(err => {
        dispatch(resetStaffPasswordError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const resetStaffPasswordSuccess = data => ({
  type: types.RESET_STAFF_PASSWORD,
  staffEntity: data
});

const resetStaffPasswordError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const retrieveAllRoles = () => {
    return dispatch => {
        //redux thunk passes dispatch
        axios
            .get(STAFF_BASE_URL + `/retrieveAllRoles`)
            .then(response => {
                const { data } = jsog.decode(response);
                dispatch(retrieveAllRolesSuccess(data));
            })
            .catch(err => {
                dispatch(retrieveAllRolesError(err.response.data));
            });
    };
};

const retrieveAllRolesSuccess = data => ({
    type: types.RETRIEVE_ALL_ROLES,
    roles: data
});

const retrieveAllRolesError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});

export const retrieveAllDepartments= () => {
    return dispatch => {
        //redux thunk passes dispatch
        axios
            .get(STAFF_BASE_URL + `/retrieveAllDepartments`)
            .then(response => {
                const { data } = jsog.decode(response);
                dispatch(retrieveAllDepartmentsSuccess(data));
            })
            .catch(err => {
                dispatch(retrieveAllDepartmentsError(err.response.data));
            });
    };
};

const retrieveAllDepartmentsSuccess = data => ({
    type: types.RETRIEVE_ALL_ROLES,
    departments: data
});

const retrieveAllDepartmentsError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});

export const deleteStaff = (staffId, history) => {
    return dispatch => {
        axios
            .delete(STAFF_BASE_URL + "/deleteStaff/" + staffId)
            .then(response => {
                const { data } = jsog.decode(response);
                toast.success("Staff Deleted!", {
                    position: toast.POSITION.TOP_CENTER
                });
                dispatch(deleteStaffSuccess(data));
                retrieveAllStaff()(dispatch);
                history.push(`/staff/viewAll`);
            })
            .catch(err => {
                dispatch(deleteStaffError(err.response.data));
            });
    };
};

const deleteStaffSuccess = data => ({
    type: types.DELETE_STAFF,
    deletedStaff: data
});

const deleteStaffError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});

import axios from "axios";
import * as types from "./types";
import { toast } from "react-toastify";
import { GET_ERRORS } from "./types";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const STAFF_BASE_URL = "/api/staff";
const jsog = require("jsog");

export const retrieveStaffById = (staffId, history) => {
  return (dispatch) => {
    axios
      .get(STAFF_BASE_URL + "/retrieveStaffById/" + staffId)
      .then((response) => {
        const { data } = jsog.decode(response);
        dispatch(retrieveStaffSuccess(data));
      })
      .catch((err) => {
        toast.error("Staff Not Found!", {
          position: toast.POSITION.TOP_CENTER,
        });
        history.push(`/staff/viewAll`);
        dispatch(retrieveStaffError(err.response.data));
      });
  };
};

const retrieveStaffSuccess = (data) => ({
  type: types.RETRIEVE_STAFF,
  retrievedStaff: data,
});

const retrieveStaffError = (data) => ({
  type: types.GET_ERRORS,
  errorMap: data,
});

export const retrieveAllStaff = () => {
  return (dispatch) => {
    //redux thunk passes dispatch
    axios
      .get(STAFF_BASE_URL + `/retrieveAllStaff`)
      .then((response) => {
        const { data } = jsog.decode(response);
        dispatch(retrieveAllStaffSuccess(data));
      })
      .catch((err) => {
        dispatch(retrieveAllStaffError(err.response.data));
      });
  };
};

export const retrieveAllDeliveryStaff = () => {
  return (dispatch) => {
    //redux thunk passes dispatch
    axios
      .get(STAFF_BASE_URL + `/retrieveAllDeliveryStaff`)
      .then((response) => {
        const { data } = jsog.decode(response);
        dispatch(retrieveAllStaffSuccess(data));
      })
      .catch((err) => {
        if (err.response) dispatch(retrieveAllStaffError(err.response.data));
      });
  };
};

const retrieveAllStaffSuccess = (data) => ({
  type: types.RETRIEVE_ALL_STAFF,
  staffEntity: data,
});

const retrieveAllStaffError = (data) => ({
  type: GET_ERRORS,
  errorMap: data,
});

export const createNewStaff = (staffCreateRequest, history) => {
  return (dispatch) => {
    //redux thunk passes dispatch
    axios
      .post(STAFF_BASE_URL + "/createNewStaff", staffCreateRequest)
      .then((response) => {
        const { data } = jsog.decode(response);
        const staffId = data.staffId;
        dispatch(createStaffSuccess(data));
        toast.success("Staff Created!", {
          position: toast.POSITION.TOP_CENTER,
        });
        history.push(`/staff/viewAll`);
      })
      .catch((err) => {
        dispatch(createStaffError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const createStaffSuccess = (data) => ({
  type: types.CREATE_STAFF,
  staffEntity: data,
});

const createStaffError = (data) => ({
  type: types.GET_ERRORS,
  errorMap: data,
});

export const updateStaff = (staffDetailsUpdateRequest, history) => {
  return (dispatch) => {
    //redux thunk passes dispatch
    axios
      .post(STAFF_BASE_URL + "/updateStaffDetails", staffDetailsUpdateRequest)
      .then((response) => {
        const { data } = jsog.decode(response);
        const staffId = data.staffId;
        dispatch(updateStaffSuccess(data));
        toast.success("Staff Updated!", {
          position: toast.POSITION.TOP_CENTER,
        });

        history.push(`/staff/view/${staffId}`);
        // window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response) dispatch(updateStaffError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const updateStaffSuccess = (data) => ({
  type: types.UPDATE_STAFF,
  staffEntity: data,
});

const updateStaffError = (data) => ({
  type: types.GET_ERRORS,
  errorMap: data,
});

export const createNewStaffAccount = (staffAccountCreateRequest, history) => {
  return (dispatch) => {
    //redux thunk passes dispatch
    axios
      .post(
        STAFF_BASE_URL + "/createNewStaffAccount",
        staffAccountCreateRequest
      )
      .then((response) => {
        const { data } = jsog.decode(response);
        dispatch(createStaffAccountSuccess(data));
        toast.success("Staff Account Created!", {
          position: toast.POSITION.TOP_CENTER,
        });
        //window.location.reload(true);
        history.push(`/`); // TODO: update redirect path
      })
      .catch((err) => {
        dispatch(createStaffAccountError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const createStaffAccountSuccess = (data) => ({
  type: types.CREATE_STAFF_ACCOUNT,
  staffEntity: data,
});

const createStaffAccountError = (data) => ({
  type: types.GET_ERRORS,
  errorMap: data,
});

export const changePassword = (staffChangePasswordRequest, history) => {
  return (dispatch) => {
    //redux thunk passes dispatch
    axios
      .post(STAFF_BASE_URL + "/changeStaffPassword", staffChangePasswordRequest)
      .then((response) => {
        const { data } = jsog.decode(response);
        dispatch(changeStaffPasswordSuccess(data));
        toast.success("Staff password changed!", {
          position: toast.POSITION.TOP_CENTER,
        });
        history.push(`/`); // TODO: update redirect path
      })
      .catch((err) => {
        dispatch(changeStaffPasswordError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const changeStaffPasswordSuccess = (data) => ({
  type: types.CHANGE_STAFF_PASSWORD,
  staffEntity: data,
});

const changeStaffPasswordError = (data) => ({
  type: types.GET_ERRORS,
  errorMap: data,
});

export const resetPassword = (resetStaffPasswordRequest, history) => {
  return (dispatch) => {
    //redux thunk passes dispatch
    axios
      .post(STAFF_BASE_URL + "/resetStaffPassword", resetStaffPasswordRequest)
      .then((response) => {
        const { data } = jsog.decode(response);
        dispatch(resetStaffPasswordSuccess(data));
        toast.success(
          "Staff password reset! Please inform staff of new password!",
          {
            position: toast.POSITION.TOP_CENTER,
          }
        );
        history.push(`/`);
      })
      .catch((err) => {
        dispatch(resetStaffPasswordError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const resetStaffPasswordSuccess = (data) => ({
  type: types.RESET_STAFF_PASSWORD,
  staffEntity: data,
});

const resetStaffPasswordError = (data) => ({
  type: types.GET_ERRORS,
  errorMap: data,
});

export const retrieveAllRoles = () => {
  return (dispatch) => {
    //redux thunk passes dispatch
    axios
      .get(STAFF_BASE_URL + `/retrieveAllRoles`)
      .then((response) => {
        const { data } = jsog.decode(response);
        dispatch(retrieveAllRolesSuccess(data));
      })
      .catch((err) => {
          console.log(err);
        dispatch(retrieveAllRolesError(err.response.data));
      });
  };
};

const retrieveAllRolesSuccess = (data) => ({
  type: types.RETRIEVE_ALL_ROLES,
  roleEntity: data,
});

const retrieveAllRolesError = (data) => ({
  type: types.GET_ERRORS,
  errorMap: data,
});

export const retrieveAllDepartments = () => {
  return (dispatch) => {
    //redux thunk passes dispatch
    axios
      .get(STAFF_BASE_URL + `/retrieveAllDepartments`)
      .then((response) => {
        const { data } = jsog.decode(response);
        dispatch(retrieveAllDepartmentsSuccess(data));
      })
      .catch((err) => {
        console.log(err);
        if (err.response)
          dispatch(retrieveAllDepartmentsError(err.response.data));
      });
  };
};

const retrieveAllDepartmentsSuccess = (data) => ({
  type: types.RETRIEVE_ALL_DEPARTMENTS,
  allDepartments: data,
});

const retrieveAllDepartmentsError = (data) => ({
  type: types.GET_ERRORS,
  errorMap: data,
});

export const deleteStaff = (staffId, history) => {
  return (dispatch) => {
    axios
      .delete(STAFF_BASE_URL + "/deleteStaff/" + staffId)
      .then((response) => {
        const { data } = jsog.decode(response);
        toast.success("Staff Deleted!", {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(deleteStaffSuccess(data));
        retrieveAllStaff()(dispatch);
        history.push(`/staff/viewAll`);
      })
      .catch((err) => {
        console.log(err);
        // dispatch(deleteStaffError(err.response.data));
      });
  };
};

const deleteStaffSuccess = (data) => ({
  type: types.DELETE_STAFF,
  deletedStaff: data,
});

const deleteStaffError = (data) => ({
  type: types.GET_ERRORS,
  errorMap: data,
});

export const staffLogin = (staffLoginRequest, history, store) => {
  return (dispatch) => {
    //redux thunk passes dispatch
    axios
      .post(STAFF_BASE_URL + "/loginStaff", staffLoginRequest)
      .then((response) => {
        const { data } = jsog.decode(response);
        const staffId = data.staffId;
        dispatch(loginStaffSuccess(data, store));
        toast.success("You are logged in!", {
          position: toast.POSITION.TOP_CENTER,
        });
        history.push(`/`); // TODO: update redirect path
      })
      .catch((err) => {
        if (err.response) dispatch(loginStaffError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const loginStaffSuccess = (data, store) => ({
  type: types.STAFF_LOGIN,
  staff: data,
  store,
});

const loginStaffError = (data) => ({
  type: types.GET_ERRORS,
  errorMap: data,
});

export const staffLogout = () => ({
  type: types.STAFF_LOGOUT,
});

export const retrieveStaffWithNoAccount = () => {
  return (dispatch) => {
    //redux thunk passes dispatch
    axios
      .get(STAFF_BASE_URL + `/retrieveStaffWithNoAccount`)
      .then((response) => {
        const { data } = jsog.decode(response);
        dispatch(retrieveSuccess(data));
      })
      .catch((err) => {
        dispatch(retrieveError(err.response.data));
      });
  };
};

const retrieveSuccess = (data) => ({
  type: types.RETRIEVE_STAFF_WITH_NO_ACCOUNT,
  staffEntity: data,
});

const retrieveError = (data) => ({
  type: GET_ERRORS,
  errorMap: data,
});

export const clearCurrentStaff = () => ({
  type: types.CLEAR_CURRENT_STAFF,
});

export const reassignStaffStore = (reassignStaffStoreRequest, history) => {
  return (dispatch) => {
    //redux thunk passes dispatch
    axios
      .post(STAFF_BASE_URL + "/reassignStaffStore", reassignStaffStoreRequest)
      .then((response) => {
        const data = jsog.decode(response);
        dispatch(reassignSuccess(data));
        toast.success("Successfully reassigned!", {
          position: toast.POSITION.TOP_CENTER,
        });
        retrieveAllStoreStaff()(dispatch);
      })
      .catch((err) => {
          if (err.response) {
              toast.error(err.response.data.errorMessage, {
                  position: toast.POSITION.TOP_CENTER
              });
          }
          retrieveAllStoreStaff()(dispatch);
      });
  };
};

const reassignSuccess = (data) => ({
  type: types.REASSIGN_STAFF_STORE,
  store: data,
});

const reassignError = (data) => ({
  type: types.GET_ERRORS,
  errorMap: data,
});

export const retrieveAllStoreStaff = () => {
  return (dispatch) => {
    //redux thunk passes dispatch
    axios
      .get(STAFF_BASE_URL + `/retrieveAllStoreStaff`)
      .then((response) => {
        const { data } = jsog.decode(response);
        dispatch(retrieveStoreStaffSuccess(data));
      })
      .catch((err) => {
        dispatch(retrieveStoreStaffError(err.response.data));
      });
  };
};

const retrieveStoreStaffSuccess = (data) => ({
  type: types.RETRIEVE_ALL_STORE_STAFF,
  staffEntity: data,
});

const retrieveStoreStaffError = (data) => ({
  type: types.GET_ERRORS,
  errorMap: data,
});

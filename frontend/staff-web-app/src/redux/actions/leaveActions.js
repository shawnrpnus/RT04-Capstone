import axios from "axios";
import * as types from "./types";
import { toast } from "react-toastify";
import {retrieveAllPromoCodes} from "./promoCodeActions";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const LEAVE_BASE_URL = "/api/leave";
const jsog = require("jsog");

export const applyForLeave = (leaveCreateRequest, history) => {
  return dispatch => {
    //redux thunk passes dispatch
    axios
      .post(LEAVE_BASE_URL + "/applyForLeave", leaveCreateRequest)
      .then(response => {
        const data = jsog.decode(response);
        console.log(data);
        dispatch(applyForLeaveSuccess(response.data));
        toast.success("Leave Applied!", {
          position: toast.POSITION.TOP_CENTER
        });
        retrieveAllLeaves(leaveCreateRequest.leave.applicant.staffId)(dispatch);
        history.push(`/leave/apply`);
      })
      .catch(err => {
        toast.error("Date overlaps with previous applied leave!", {
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(applyForLeaveError(err.response.data));
        //console.log(err.response.data);
      });
  };
};

const applyForLeaveSuccess = data => ({
  type: types.CREATE_PROMOCODE,
  leave: data
});

const applyForLeaveError = data => ({
  type: types.GET_ERRORS,
  errorMap: data
});

export const retrieveAllLeaves = staffId => {
  return dispatch => {
    axios
      .get(LEAVE_BASE_URL + "/retrieveAllLeaves/" + staffId)
      .then(response => {
        const { data } = jsog.decode(response);
        dispatch(retrieveAllLeavesSuccess(data));
      })
      .catch(err => {
        dispatch(retrieveAllLeavesError(err.response.data));
      });
  };
};

const retrieveAllLeavesSuccess = data => ({
  type: types.RETRIEVE_ALL_LEAVES,
  allLeaves: data
});

const retrieveAllLeavesError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});

export const deleteLeave = (leaveId, staffId,  history) => {
    return dispatch => {
        axios
            .delete(LEAVE_BASE_URL + "/deleteLeave/" + leaveId)
            .then(response => {
                const { data } = jsog.decode(response);
                toast.success("Leave Deleted!", {
                    position: toast.POSITION.TOP_CENTER
                });
                dispatch(deleteLeaveSuccess(data));
                retrieveAllLeaves(staffId)(dispatch);
                history.push(`/leave/apply`);
            })
            .catch(err => {
                toast.error("Leave is already endorsed or approved!", {
                    position: toast.POSITION.TOP_CENTER
                });
                dispatch(deleteLeaveError(err.response.data));
            });
    };
};

const deleteLeaveSuccess = data => ({
    type: types.DELETE_LEAVE,
    deletedLeave: data
});

const deleteLeaveError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});

export const retrieveAllLeavesManager = (staffId) => {
    return dispatch => {
        axios
            .get(LEAVE_BASE_URL + "/retrieveAllLeavesManager/" + staffId)
            .then(response => {
                const { data } = jsog.decode(response);
                dispatch(retrieveAllLeavesManagerSuccess(data));
            })
            .catch(err => {
                dispatch(retrieveAllLeavesManagerError(err.response.data));
            });
    };
};

const retrieveAllLeavesManagerSuccess = data => ({
    type: types.RETRIEVE_ALL_LEAVES_MANAGER,
    allLeavesManager: data
});

const retrieveAllLeavesManagerError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});

export const retrieveAllPendingLeaves = (staffId) => {
    return dispatch => {
        axios
            .get(LEAVE_BASE_URL + "/retrieveAllPendingLeaves/" + staffId)
            .then(response => {
                const { data } = jsog.decode(response);
                dispatch(retrieveAllPendingLeavesSuccess(data));
            })
            .catch(err => {
                dispatch(retrieveAllPendingLeavesError(err.response.data));
            });
    };
};

const retrieveAllPendingLeavesSuccess = data => ({
    type: types.RETRIEVE_ALL_PENDING_LEAVES,
    allPending: data
});

const retrieveAllPendingLeavesError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});

export const retrieveAllLeavesHR = () => {
    return dispatch => {
        axios
            .get(LEAVE_BASE_URL + "/retrieveAllLeavesHR")
            .then(response => {
                const { data } = jsog.decode(response);
                dispatch(retrieveAllLeavesHRSuccess(data));
            })
            .catch(err => {
                dispatch(retrieveAllLeavesHRError(err.response.data));
            });
    };
};

const retrieveAllLeavesHRSuccess = data => ({
    type: types.RETRIEVE_ALL_LEAVES_HR,
    allLeavesHR: data
});

const retrieveAllLeavesHRError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});

export const retrieveAllEndorsedLeaves = () => {
    return dispatch => {
        axios
            .get(LEAVE_BASE_URL + "/retrieveAllEndorsedLeaves")
            .then(response => {
                const { data } = jsog.decode(response);
                dispatch(retrieveAllEndorsedSuccess(data));
            })
            .catch(err => {
                dispatch(retrieveAllEndorsedError(err.response.data));
            });
    };
};

const retrieveAllEndorsedSuccess = data => ({
    type: types.RETRIEVE_ALL_ENDORSED_LEAVES,
    allEndorsed: data
});

const retrieveAllEndorsedError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});

export const endorseRejectLeave = (endorseRejectLeaveRequest, history) => {
    return dispatch => {
        axios
            .post(LEAVE_BASE_URL + "/endorseRejectLeave", endorseRejectLeaveRequest)
            .then(response => {
                const { data } = jsog.decode(response);
                dispatch(endorseRejectLeavesSuccess(data));
                toast.success("Success!", {
                    position: toast.POSITION.TOP_CENTER
                });
                retrieveAllPendingLeaves(endorseRejectLeaveRequest.managerId)(dispatch);
                retrieveAllLeavesManager(endorseRejectLeaveRequest.managerId)(dispatch);
                history.push(`/leave/manager`);
            })
            .catch(err => {
                dispatch(endorseRejectLeavesError(err.response.data));
                //console.log(err.response.data);
            });
    };
};

const endorseRejectLeavesSuccess = data => ({
    type: types.ENDORSE_REJECT_LEAVE,
    leave: data
});

const endorseRejectLeavesError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});

export const approveRejectLeave = (approveRejectLeaveRequest, history) => {
    return dispatch => {
        axios
            .post(LEAVE_BASE_URL + "/approveRejectLeave", approveRejectLeaveRequest)
            .then(response => {
                const { data } = jsog.decode(response);
                dispatch(approveRejectLeavesSuccess(data));
                toast.success("Success!", {
                    position: toast.POSITION.TOP_CENTER
                });
                retrieveAllEndorsedLeaves()(dispatch);
                retrieveAllLeavesHR()(dispatch);
                history.push(`/leave/hr`);
            })
            .catch(err => {
                dispatch(approveRejectLeavesError(err.response.data));
                //console.log(err.response.data);
            });
    };
};

const approveRejectLeavesSuccess = data => ({
    type: types.APPROVE_REJECT_LEAVE,
    leave: data
});

const approveRejectLeavesError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});

export const updateLeave = (updateLeaveRequest, history) => {
    return dispatch => {
        //redux thunk passes dispatch
        axios
            .post(LEAVE_BASE_URL + "/updateLeave", updateLeaveRequest)
            .then(response => {
                const { data } = jsog.decode(response);
                dispatch(updateLeaveSuccess(data));
                toast.success("Leave Updated!", {
                    position: toast.POSITION.TOP_CENTER
                });
                retrieveAllLeaves(updateLeaveRequest.applicant.staffId)(dispatch);
                history.push(`/leave/apply`);
            })
            .catch(err => {
                toast.error("Leave has already been endorsed or approved", {
                    position: toast.POSITION.TOP_CENTER
                });
                dispatch(updateLeavesError(err.response.data));
                // console.log(err.response.data);
            });
    };
};

const updateLeaveSuccess = data => ({
    type: types.UPDATE_LEAVE,
    leave: data
});

const updateLeavesError = data => ({
    type: types.GET_ERRORS,
    errorMap: data
});
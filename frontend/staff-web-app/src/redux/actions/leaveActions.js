import axios from "axios";
import * as types from "./types";
import { toast } from "react-toastify";
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

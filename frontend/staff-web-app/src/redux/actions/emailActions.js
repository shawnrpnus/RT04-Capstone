import axios from "axios";
import { openCircularProgress, closeCircularProgress } from "./utilActions";
axios.defaults.baseURL = process.env.REACT_APP_SPRING_API_URL;

const EMAIL_BASE_URL = "/api/email";

export const massSendEmail = (request, onClose) => {
  return dispatch => {
    dispatch(openCircularProgress());
    axios
      .post(EMAIL_BASE_URL + "/massSendEmail", request)
      .then(({ data }) => {
        toast.success(data.successMessage, {
          position: toast.POSITION.TOP_CENTER
        });
        onClose && onClose();
      })
      .catch(err => {
        console.log(err);
      });
    dispatch(closeCircularProgress());
  };
};

import * as types from "../actions/types";

const initialState = {
  currentStaff: null,
  allStaff: null,
<<<<<<< HEAD
  allRoles:null,
  allDepartments:null,
  loggedInStaff:null
=======
  allRoles: null,
  allDepartments: null
>>>>>>> 4bb07f438c9f88551a8666d6f6c44a82004b2b0f
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_STAFF:
      return {
        ...state,
        currentStaff: action.staffEntity
      };
    case types.RETRIEVE_STAFF:
      return {
        ...state,
        currentStaff: action.staffEntity
      };

    case types.RETRIEVE_ALL_ROLES:
      return {
        ...state,
        allRoles: action.roleEntity
      };

    case types.RETRIEVE_ALL_DEPARTMENTS:
      return {
        ...state,
        allDepartments: action.allDepartments
      };

    case types.CREATE_STAFF_ACCOUNT:
      return {
        ...state,
        currentStaff: action.staffEntity
      };
    case types.RETRIEVE_ALL_STAFF:
      return {
        ...state,
        allStaff: action.staffEntity
      };
    case types.CHANGE_STAFF_PASSWORD:
      return {
        ...state,
        currentStaff: action.staffEntity
      };
    case types.RESET_STAFF_PASSWORD:
      return {
        ...state,
        currentStaff: action.staffEntity
      };

    case types.DELETE_STAFF:
      return {
        ...state,
        currentStaff: action.deletedStaff
      };

    case types.STAFF_LOGIN:
      return {
        ...state,
        loggedInStaff: action.staff
      };

    default:
      return state;
  }
}

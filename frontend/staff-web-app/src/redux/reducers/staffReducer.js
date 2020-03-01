import * as types from "../actions/types";

const initialState = {
  currentStaff: null,
  allStaff: null,

  allRoles: null,
  allDepartments: null,
  loggedInStaff: null,
  currentRole: null,
  currentDepartment: null,
  currentAddress: null
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

    case types.STAFF_LOGOUT:
      return initialState;

    case types.UPDATE_STAFF:
      return {
        ...state,
        loggedInStaff: action.staff
      };

    default:
      return state;
  }
}

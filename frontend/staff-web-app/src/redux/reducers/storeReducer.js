import * as types from "../actions/types";

const initialState = {
  currentStore: null,
  allStores: null,
  crudAction: null,
  //for staff to select store in login page
  selectedStore: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_STORE:
      return {
        ...state,
        currentStore: action.storeEntity
      };
    case types.RETRIEVE_STORE:
      return {
        ...state,
        currentStore: action.storeEntity
      };
    // case types.RETRIEVE_STORE_LOGIN:
    //   return {
    //     ...state,
    //     selectedStore: action.selectedStore
    //   };
    case types.UPDATE_STORE:
      return {
        ...state,
        currentStore: action.storeEntity
      };
    case types.RETRIEVE_ALL_STORES:
      return {
        ...state,
        allStores: action.storeEntities
      };
    case types.DELETE_STORE:
      return {
        ...state,
        currentStore: action.deletedStore
      };
    case types.CLEAR_CURRENT_STORE:
      return {
        ...state,
        currentStore: null
      };
    default:
      return state;
  }
}

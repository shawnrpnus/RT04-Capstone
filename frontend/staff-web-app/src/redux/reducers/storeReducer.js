import * as types from "../actions/types";

const initialState = {
  createdUpdatedStore: null,
  allStores: null,
  crudAction: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_STORE:
      return {
        ...state,
        createdUpdatedStore: action.store
      };
    default:
      return state;
  }
}

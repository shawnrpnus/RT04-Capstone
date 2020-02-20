import * as types from "../actions/types";

const initialState = {
    createdUpdatedTag: null,
    allTags: null,
    crudAction: null,
}


export default function(state = initialState, action){
    switch (action.type){
        case types.CREATE_TAG:
            return {
                ...state,
                createdUpdatedTag: action.store
            };
        default:
            return state;
    }
}

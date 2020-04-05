import * as types from "../actions/types";
const initialState = {
    currentLeave: null,
    allLeaves: null,
    allLeavesManager: null,
    allLeavesHR: null,
    allPending:null,
    allEndorsed:null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case types.APPLY_FOR_LEAVE:
            return {
                ...state,
                currentLeave: action.leave
            };
        case types.RETRIEVE_ALL_LEAVES:
            return {
                ...state,
                allLeaves: action.allLeaves
            };
        case types.DELETE_LEAVE:
            return {
                ...state,
                currentLeave: action.deletedLeave
            };

        case types.RETRIEVE_ALL_LEAVES_MANAGER:
            return {
                ...state,
                allLeavesManager: action.allLeavesManager
            };
        case types.RETRIEVE_ALL_LEAVES_HR:
            return {
                ...state,
                allLeavesHR: action.allLeavesHR
            };

        case types.ENDORSE_REJECT_LEAVE:
            return {
                ...state,
                currentLeave: action.leave
            };

        case types.RETRIEVE_ALL_PENDING_LEAVES:
            return {
                ...state,
                allPending: action.allPending
            };

        case types.RETRIEVE_ALL_ENDORSED_LEAVES:
            return {
                ...state,
                allEndorsed: action.allEndorsed
            };

        default:
            return state;
    }
}
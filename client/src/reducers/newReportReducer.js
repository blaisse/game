import { FETCH_NEWREPORT, SET_NEWREPORT } from './../actions/types';

export default function(state = false, action){
    switch(action.type){
        case FETCH_NEWREPORT:
            return action.payload.data;
        case SET_NEWREPORT:
            return action.payload.data;
        default:
            return state;
    }
}
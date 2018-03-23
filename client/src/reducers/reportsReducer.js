import { FETCH_REPORTS } from './../actions/types';

export default function(state=[], action){
    switch(action.type){
        case FETCH_REPORTS:
            return action.payload.data;
        default:
            return state;
    }
}
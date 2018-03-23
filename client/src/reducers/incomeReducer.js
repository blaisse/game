import { FETCH_INCOME } from './../actions/types';

export default function(state={}, action){
    switch(action.type){
        case FETCH_INCOME:
            return action.payload.data;
        default:
            return state;
    }
}
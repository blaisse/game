import { FETCH_RESOURCES, SIGNOUT } from './../actions/types';

export default function(state={}, action){
    switch(action.type){
        case FETCH_RESOURCES: 
        // console.log('fetching resources');
            return action.payload.data;
        case SIGNOUT:
        // console.log('LMFAO?');
            return {};
        default:
            return state;
    }
}
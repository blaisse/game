import { 
    FETCH_BUILDABLE, FETCH_UPGRADABLE,
    FETCH_HIREABLE, FETCH_BUILT,
    FETCH_QUEUE_BUILDINGS,
    DELETE_FIRST_ELEMENT_QUEUE
 } from './../actions/types';

export default function(state={}, action){
    switch(action.type){
        case FETCH_BUILDABLE:
            return { ...state,  buildable: action.payload.data};
        case FETCH_UPGRADABLE:
            return { ...state, upgradable: action.payload.data };
        case FETCH_BUILT:
            return { ...state, built: action.payload.data };
        case FETCH_HIREABLE:
            return { ...state, hireable: action.payload.data };
        case FETCH_QUEUE_BUILDINGS:
            return { ...state, queue: action.payload.data };
        case DELETE_FIRST_ELEMENT_QUEUE:
            return { ...state, queue: action.payload.slice(1) };
        default: 
            return state;    
    }
}
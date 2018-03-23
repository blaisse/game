import { FETCH_RESEARCHABLE, FETCH_RESEARCH } from './../actions/types';

export default function(state={}, action){
    switch(action.type){
        case FETCH_RESEARCHABLE: 
            return { ...state, researchable: action.payload.data };
        case FETCH_RESEARCH:
            return { ...state, research: action.payload.data };
        default: 
            return state;
    }
}
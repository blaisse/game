import { HIRE_MARSHAL, GET_MARSHALS } from './../actions/types';

export default function(state={}, action){
    switch(action.type){
        case HIRE_MARSHAL:
            return { 
                marshals: action.payload.data.marshals,
                maxMarshals: action.payload.data.maxMarshals,
                skills: action.payload.data.skills
            };
        case GET_MARSHALS:
            return { 
                marshals: action.payload.data.marshals,
                maxMarshals: action.payload.data.maxMarshals,
                skills: action.payload.data.skills 
            };
        default:
            return state;
    }
}
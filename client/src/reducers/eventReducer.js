import { SET_EVENT } from './../actions/types';

export default function(state={}, action){
    switch(action.type){
        case SET_EVENT:
            const t = action.payload.type;
            // console.log('send help', action.payload);
            // return { [t]: action.payload.message, ...state };
            return { ...state, [t]: { message: action.payload.message.message, completed: action.payload.message.completed } };
        default:
            return state;
    }
}
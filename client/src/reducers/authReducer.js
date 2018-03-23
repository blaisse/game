import { SIGNIN, SIGNOUT } from '../actions/types';
// import reducers from './../reducers';
// const initial = reducers({}, {});
export default function(state={}, action){
    // console.log('action:', action);
    switch(action.type){
        case SIGNIN:
            return { ...state, authed: true }
        case SIGNOUT:
            // state = initial;
            // if(action.type === SIGNOUT){
            //     console.log('omg :D');
            //     state = undefined;
            //     return reducers(state);
            // }
            // return reducers(state);
            return { ...state, authed: false }
            // return reducers(state, action);
        default:
            return state;
    }
}
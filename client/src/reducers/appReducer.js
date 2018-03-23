import { SIGNOUT } from './../actions/types';

import rootReducer from './index';

export default function(state=null, action){
    if(action.type === SIGNOUT){
        console.log('it be here');
        state=undefined;
        return rootReducer(state);
    }
    return state;
}
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import buildingsReducer from './buildingsReducer';
import unitsReducer from './unitsReducer';
import resoucesReducer from './resourcesReducer';
import eventReducer from './eventReducer';
import incomeReducer from './incomeReducer';
import researchReducer from './researchReducer';
import reportsReducer from './reportsReducer';
import newReportReducer from './newReportReducer';
import marshalReducer from './marshalReducer';
import mapReducer from './mapReducer';

import { SIGNOUT } from './../actions/types';
// import rootReducer from './appReducer';
import { reducer as reduxForm } from 'redux-form';//methods reducer from redux-form named reduxForm
//export default
 const appReducer = combineReducers({
    // root: rootReducer,
    auth: authReducer,
    buildings: buildingsReducer,
    resources: resoucesReducer,
    events: eventReducer,
    units: unitsReducer,
    marshals: marshalReducer,
    income: incomeReducer,
    research: researchReducer,
    map: mapReducer,
    reports: reportsReducer,
    newReport: newReportReducer,
    form: reduxForm
});

const rootReducer = (state, action) => {
    if(action.type === SIGNOUT){
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;
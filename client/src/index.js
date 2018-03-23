import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import promise from 'redux-promise';

import App from './components/App';
import reducers from './reducers';
import { SIGNIN } from './actions/types';

const store = createStore(reducers, {}, applyMiddleware(promise, reduxThunk));

const token = localStorage.getItem('token');
if(token){
    store.dispatch({ type: SIGNIN });
}

ReactDOM.render(
    <Provider store={store}><App /></Provider>,
    document.querySelector('#root')
);

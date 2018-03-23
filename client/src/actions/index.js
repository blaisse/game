import axios from 'axios';
import { FETCH, SIGNIN, SIGNOUT } from './types';

export function fetch(){
    const request = axios.post('/api/purchase', { username: 'russia' });
    return {
        type: FETCH,
        payload: request
    };
}

export const signin = (username, password, callback) => async dispatch => {
    const res = await axios.post('/api/signin', { username, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('username', res.data.username);
    dispatch({ type: SIGNIN, payload: res });
    callback();
}

export const signup = (username, password, callback) => async dispatch => {
    const res = await axios.post('/api/signup', { username, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('username', res.data.username);
    dispatch({ type: SIGNIN, payload: res });
    callback();
}

export const signout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    return {
        type: SIGNOUT
    };
}

// export async function fetch(){
//     const res = await axios.post('/api/purchase', { username: 'russia' });
//     console.log('WTF?', res);
//     return {
//         type: FETCH,
//         payload: res
//     };
// }
// export const fetch = () => async dispatch => {
//     const res = await axios.post('/api/purchase', { username: 'russia' });
//     dispatch({ type: FETCH, payload: res.data });
// }

//return function, if one expression can omit return and {}
// export const fetch = () => async dispatch => {
//     const res = await axios.get('/api/route');
//     //res.data beacause it's pretty much the only object we need
//     dispatch({ type: FETCH, payload: res.data });
// }

//inside the fetch function
//return function(dispatch){}
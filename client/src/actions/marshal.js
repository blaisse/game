import axios from 'axios';
import { HIRE_MARSHAL, GET_MARSHALS } from './types';

export async function hire_marshal(name){
    const res = await axios.post('/api/hireMarshal', { name }, {
        headers: { auth: localStorage.getItem('token') }
    });
    return {
        type: HIRE_MARSHAL,
        payload: res
    };
}

export async function get_marshals(){
    const res = await axios.get('/api/getMarshals', {
        headers: { auth: localStorage.getItem('token') }
    });
    return {
        type: GET_MARSHALS,
        payload: res
    };
}
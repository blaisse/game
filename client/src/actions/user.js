import axios from 'axios';
import { FETCH_BUILDABLE,
         FETCH_UPGRADABLE,
         FETCH_BUILT,
         FETCH_RESOURCES, 
         SET_EVENT, 
         FETCH_UNITS, 
         FETCH_HIREABLE,
         FETCH_INCOME,
         FETCH_RESEARCHABLE,
         FETCH_RESEARCH,
         FETCH_MAP,
         FETCH_REPORTS,
         FETCH_QUEUE_BUILDINGS, DELETE_FIRST_ELEMENT_QUEUE,
         FETCH_NEWREPORT, SET_NEWREPORT
        
} from './types';

export async function set_newreport(){
    const res = await axios.post('/api/newreport', {}, {
        headers: { auth: localStorage.getItem('token') }
    });
    return {
        type: SET_NEWREPORT,
        payload: res
    };
}

export async function fetch_newreport(){
    const res = await axios.get('/api/newreport', {
        headers: { auth: localStorage.getItem('token') }
    });
    return {
        type: FETCH_NEWREPORT,
        payload: res
    };
}

export async function set_read_reports(id){
    const res = await axios.post('/api/unreadreport', {id}, {
        headers: { auth: localStorage.getItem('token') }
    });
    return {
        type: FETCH_REPORTS,
        payload: res
    };
}

export async function fetch_reports(){
    const res = await axios.get('/api/reports', {
        headers: { auth: localStorage.getItem('token') }
    });
    return {
        type: FETCH_REPORTS,
        payload: res
    };
}

export async function fetch_map(){
    const res = await axios.get('/api/map', {
        headers: { auth: localStorage.getItem('token') }
    });
    return {
        type: FETCH_MAP,
        payload: res
    };
}

export async function fetch_research(){
    const res = await axios.get('/api/notresearched', {
        headers: { auth: localStorage.getItem('token') }
    });
    return {
        type: FETCH_RESEARCH,
        payload: res
    };
}

export async function fetch_researchable(){
    const res = await axios.get('/api/researchable', {
        headers: { auth: localStorage.getItem('token') }
    });
    return {
        type: FETCH_RESEARCHABLE,
        payload: res
    };
}

export async function fetch_income(){
    const res = await axios.get('/api/income', {
        headers: { auth: localStorage.getItem('token') }
    });
    return {
        type: FETCH_INCOME,
        payload: res
    };
}

export function setEvent(type, message){
    // console.log('setEvent message', message);
    return {
        type: SET_EVENT,
        payload: {type, message}
    };
}

export function delete_queue(queue){
    return {
        type: DELETE_FIRST_ELEMENT_QUEUE,
        payload: queue
    };
}

export async function fetch_queue_buildings(){
    const res = await axios.get('/api/queueBuildings', {
        headers: { auth: localStorage.getItem('token') }
    });
    return {
        type: FETCH_QUEUE_BUILDINGS,
        payload: res
    };
}

export async function fetch_hireable(){
    const res = await axios.get('/api/hireable', {
        headers: { auth: localStorage.getItem('token') }
    });
    return {
        type: FETCH_HIREABLE,
        payload: res
    };
}

export async function fetch_units(){
    const res = await axios.get(`/api/units`, {
        headers: { auth: localStorage.getItem('token') }
    });
    return {
        type: FETCH_UNITS,
        payload: res
    };
}

export async function fetch_buildings(kind){
    const res = await axios.get(`/api/buildings/${kind}`, {
        headers: { auth: localStorage.getItem('token') }
    });
    if(kind === 'buildable'){
        return {
            type: FETCH_BUILDABLE,
            payload: res
        };
    } else if(kind === 'upgradable'){
        return {
            type: FETCH_UPGRADABLE,
            payload: res
        };
    } else if(kind === 'built'){
        return {
            type: FETCH_BUILT,
            payload: res
        };
    }
}

export async function fetch_resources(){
    const res = await axios.get(`/api/resources`, {
        headers: { auth: localStorage.getItem('token') }
    });
    return {
        type: FETCH_RESOURCES,
        payload: res
    };
}
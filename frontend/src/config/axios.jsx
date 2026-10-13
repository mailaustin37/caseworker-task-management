import axios from 'axios';

const baseURL = import.meta.env.VITE_SERVER_ENDPOINT || '/api/';

export default axios.create({
    baseURL,
    timeout: 15000,
    responseType: 'json',
    headers: {'Content-Type': 'application/json'}
});

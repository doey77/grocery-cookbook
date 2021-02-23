import axios from 'axios';
import apiSettings from '../services/apiSettings';


export async function loginEmailPassword(email, password) {
    let returnMsg = {};

    const data = new URLSearchParams({
        'username': email,
        'password': password, // TODO: encrypt here, and decrypt at API endpoint
    });

    const config = {
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    await axios.post(apiSettings.url+"auth/login/access-token", data, config)
    .then(result => {
        // TODO handle login
        const token_type = result.data.token_type;
        const expires = result.data.expires; // Stored as UTC
    
        document.cookie = "access_token="+result.data.access_token+"; samesite=strict";
        document.cookie = "access_token_type="+token_type+";";
        document.cookie = "access_token_expires="+expires+";";
        returnMsg = {msg: 'Logged in successfully', variant: 'success'};
    })
    .catch(error => {
        const rsp = error.response;
        if (rsp.status === 400) {
            returnMsg = {msg: rsp.data.detail, variant: 'error'};
        } else if (rsp.status === 422) {
            returnMsg = {msg: 'Invalid input', variant: 'error'};
        } else {
            returnMsg = {msg: 'Error, HTTP status code ' + rsp.status, variant: 'error'};
        }
    });

    return returnMsg;
}
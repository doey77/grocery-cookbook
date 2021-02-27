import axios from 'axios';
import apiSettings from '../services/apiSettings';
import { deleteCookie, getCookie } from './cookies';

/**
 * Login with the provider email and password
 * @param {string} email User's email
 * @param {string} password User's password
 */
export async function loginEmailPassword(email, password) {
    let returnMsg = {msg: '', variant: ''};

    const data = new URLSearchParams({
        'username': email,
        'password': password,
    });

    const config = {
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    await axios.post(apiSettings.url+"auth/login/access-token", data, config)
    .then(result => {
        const expiresPy = result.data.expires; // in the format YYYY-MM-DDTHH:MM (24-hour) UTC
        const expires = new Date(expiresPy);
    
        document.cookie = "access_token="+result.data.access_token+"; samesite=strict; expires="+expires;
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

/**
 * Get user's info based on the logged in user's JWT token, obtained from cookies
 */
export async function loginToken() {
    let returnData = {};
    
    if (getCookie("access_token") === "") {
        console.log('No access token in cookies');
        returnData = {
            success: false,
            error: 'No access token in cookies',
        };
    } else {
        await axios.post(apiSettings.url+"auth/login/test-token", null, apiSettings.configAuth)
        .then(result => {
          returnData = {
            success: true,
            isAuthorized: true,
            email: result.data.email,
            id: result.data.id,
            isSuperuser: result.data.is_superuser,
          };
        })
        .catch(error => {
          returnData = {
              success: false,
              error: error,
          };
        });
    }

    return returnData;
}

/**
 * Logs the user out
 */
export function logout() {
    let loginPath = "/login";
    deleteCookie('access_token', loginPath);
    deleteCookie('access_token_expires', loginPath);
    deleteCookie('access_token_type', loginPath);
    loginPath = "/"; // Path is sometimes /login and sometimes /
    deleteCookie('access_token', loginPath);
    deleteCookie('access_token_expires', loginPath);
    deleteCookie('access_token_type', loginPath);
}
import { getCookie } from './cookies';

// Settings for using FastAPI backend

const host = "http://127.0.0.1:8000";

const apiSettings = {
    url: host + "/api/v1/",
    config: {
        headers: {
            "Accept": "*"
        }
    },
    configAuth: {
        headers: {
            "Accept": "*",
            "Content-Type": "application/json",
            "Authorization": 
            "Bearer " + getCookie("access_token"),
        }
    }
};

export default apiSettings;
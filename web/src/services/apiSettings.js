import { getCookie } from './cookies';

// Settings for using FastAPI backend

const host = "http://192.168.0.100:8000";

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
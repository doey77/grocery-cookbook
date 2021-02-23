import GetCookie from './getCookie';

// Settings for using FastAPI backend

const host = "http://127.0.0.1:8000";

const apiSettings = {
    url: host + "/api/v1/",
    config: {
        headers: {
            "Accept": "*"
        }
    },
    config_auth: {
        headers: {
            "Accept": "*",
            "Authorization": 
            GetCookie("access_token_type") + " " + GetCookie("access_token"),
        }
    }
};

export default apiSettings;
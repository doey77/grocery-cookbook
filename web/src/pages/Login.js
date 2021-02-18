import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

import axios from 'axios';

import apiSettings from '../common-functions/APISettings';

import { withSnackbar } from 'notistack';


class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',

            alertOpen: false,
            errMsg: '',
        };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }

    handleEmailChange(event) {
        this.setState({
            email: event.target.value
        });
    }

    handlePasswordChange(event) {
        this.setState({
            password: event.target.value
        });
    }

    submitLogin(event) {
        event.preventDefault();
        const data = new URLSearchParams({
            'username': this.state.email,
            'password': this.state.password, // TODO: encrypt here, and decrypt at API endpoint
        });
        const config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        axios.post(apiSettings.url+"auth/login/access-token", data, config)
        .then(result => {
            // TODO handle login
            const access_token_split = result.data.access_token.split(".");
            const token_type = result.data.token_type;
            const expires = result.data.expires; // Stored as UTC

            document.cookie = "access_token="+result.data.access_token+"; samesite=strict";
            document.cookie = "access_token_type="+token_type+";";
            document.cookie = "access_token_expires="+expires+";";

            this.props.enqueueSnackbar('Logged in successfully', {variant: 'success'});
        })
        .catch(error => {
            const rsp = error.response;
            if (rsp.status === 400) {
                this.props.enqueueSnackbar(rsp.data.detail, {variant: 'error'});
            } else if (rsp.status === 422) {
                this.props.enqueueSnackbar('Invalid input', {variant: 'error'});
            } else {
                this.props.enqueueSnackbar('Error, HTTP status code ' + rsp.status, {variant: 'error'});
            }
        });
    }

    render() {
        return (
        <div>
            <h1>Login</h1>
            <form>
                <TextField variant="outlined" type="text" label="Email" 
                value={this.state.email} onChange={this.handleEmailChange}
                /> <br /> <br />
                <TextField variant="outlined" type="password" label="Password"
                value={this.state.password} onChange={this.handlePasswordChange}
                /> <br /> <br />
                <Button type="submit" onClick={this.submitLogin} variant="contained" color="primary">Login</Button>
            </form>
        </div>
        );
    }
}

LoginPage.propTypes = {
    enqueueSnackbar: PropTypes.func,
};

export default withSnackbar(LoginPage);
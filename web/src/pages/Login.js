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
            this.props.enqueueSnackbar('Logged in successfully', {variant: 'success'});
            console.log(result);
        })
        .catch(error => {
            const rsp = error.response;
            if (rsp.status === 400) {
                this.props.enqueueSnackbar(rsp.data.detail, {variant: 'error'});
            } else {
                this.props.enqueueSnackbar('Error, HTTP status code ' + rsp.status);
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
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withSnackbar } from 'notistack';

import { userContext } from '../contexts/userContext';
import { loginEmailPassword, loginToken, logout } from '../services/login';


class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',

            alertOpen: false,
            errMsg: '',
            
            isAuthenticated: false,

            btnDisabled: false,
            loginBtnText: 'Login',
        };

        this.submitLogin = this.submitLogin.bind(this); this.logout = this.logout.bind(this);
    }

    async submitLogin(event) {
        event.preventDefault();
        this.setState({btnDisabled: true, loginBtnText: 'Logging In...'});
        let callMsg = await loginEmailPassword(this.state.email, this.state.password);
        this.props.enqueueSnackbar(callMsg.msg, {variant: callMsg.variant});
        if (callMsg.variant === 'success') {
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            this.setState({btnDisabled: false, loginBtnText: 'Login'});
        }
    }

    async componentDidMount() {
        let callMsgToken = await loginToken();
        if (callMsgToken.success === true) {
            this.setState({isAuthenticated: true});
        }
    }

    logout() {
        logout();
        this.setState({isAuthenticated:false});
    }

    render() {
        if (this.state.isAuthenticated) {
            return (
            <Grid container justify="center">
                <Grid item>
                <h1>Logout</h1>
                <Button onClick={this.logout} variant="contained" color="primary">Logout</Button>
                </Grid>
            </Grid>
            );
        } else {
            return (
            <Grid container justify="center">
                <Grid item>
                <h1>Login</h1>
                <form>
                    <TextField variant="outlined" type="text" label="Email" 
                    value={this.state.email} onChange={(event) => {this.setState({email: event.target.value});}}
                    /> <br /> <br />
                    <TextField variant="outlined" type="password" label="Password"
                    value={this.state.password} onChange={(event) => {this.setState({password: event.target.value});}}
                    /> <br /> <br />
                    <Button disabled={this.state.btnDisabled} type="submit" onClick={this.submitLogin} variant="contained" color="primary">{this.state.loginBtnText}</Button>
                </form>
                </Grid>
            </Grid>
            );
        }

    }
}

LoginPage.propTypes = {
    enqueueSnackbar: PropTypes.func,
};

export default withSnackbar(LoginPage);
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';

import { userContext } from '../contexts/userContext';
import { loginEmailPassword, loginToken } from '../services/login';


class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',

            alertOpen: false,
            errMsg: '',
            
            isAuthenticated: false,
        };

        this.submitLogin = this.submitLogin.bind(this);
    }

    async submitLogin(event) {
        event.preventDefault();
        let callMsg = await loginEmailPassword(this.state.email, this.state.password);
        this.props.enqueueSnackbar(callMsg.msg, {variant: callMsg.variant});
        if (callMsg.variant === 'success') {
            let callMsgToken = await loginToken();
            if (callMsgToken.success === true) {
                this.setState({isAuthenticated: true});
            }
        }

        console.log(this.state);
    }

    render() {
        if (this.state.isAuthenticated) {
            return (
            <div>
                <h1>Logout</h1>
            </div>
            );
        } else {
            return (
            <div>
                <h1>Login</h1>
                <form>
                    <TextField variant="outlined" type="text" label="Email" 
                    value={this.state.email} onChange={(event) => {this.setState({email: event.target.value});}}
                    /> <br /> <br />
                    <TextField variant="outlined" type="password" label="Password"
                    value={this.state.password} onChange={(event) => {this.setState({password: event.target.value});}}
                    /> <br /> <br />
                    <Button type="submit" onClick={this.submitLogin} variant="contained" color="primary">Login</Button>
                </form>
            </div>
            );
        }

    }
}

LoginPage.propTypes = {
    enqueueSnackbar: PropTypes.func,
};

export default withSnackbar(LoginPage);
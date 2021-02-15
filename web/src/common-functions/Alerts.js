import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

class Alert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Public states
            // eslint-disable-next-line react/prop-types
            alertMessage: this.props.alertMessage,
            // eslint-disable-next-line react/prop-types
            variant: this.props.variant,

            // Private states
            alertOpen: true,
        };

        this.handleAlertClose = this.handleAlertClose.bind(this);
    }

    handleAlertClose() {
        this.setState({alertOpen: false});
    }

    render() {
        return (
        <Snackbar
            anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
            }}
            open={this.state.alertOpen}
            autoHideDuration={6000}
            onClose={this.handleAlertClose}
        >
        <MuiAlert elevation={6} variant="filled" severity={this.state.variant} onClose={this.handleAlertClose}>
            {this.state.alertMessage}
        </MuiAlert>
        </Snackbar>
        );
    }
}

export default function Alerts() {
    return (<Alert alertMessage="msg" variant="error"/>);
}
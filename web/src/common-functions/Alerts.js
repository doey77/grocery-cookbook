import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

class Alert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alertMessage: this.props.alertMessage,
            variant: this.props.variant,
            alertOpen: this.props.alertOpen,
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

Alert.propTypes = {
    alertMessage: PropTypes.string,
    variant: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
    alertOpen: PropTypes.bool,
};

Alerts.propTypes = {
    alertMessage: Alert.propTypes.alertMessage,
    variant: Alert.propTypes.variant,
    alertOpen: Alert.propTypes.alertOpen,
};

export default function Alerts(props) {
    return (<Alert
        alertMessage={props.alertMessage} variant={props.variant}
        alertOpen={props.alertOpen}
    />);
}
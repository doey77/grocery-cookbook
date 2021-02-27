import React from 'react';
import Nav from './Nav';

// Services
import { loginToken, logout } from './services/login';

// Contexts
import { userContext } from './contexts/userContext';



class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthorized: false,
      email: null, // string
      id: null, // int
      isSuperuser: false,
    };

    this.logout = this.logout.bind(this);
  }

  logout() {
    logout();
    this.setState({
      isAuthorized: false,
      email: null,
    });
  }

  componentDidMount() {
    loginToken();
  }

  render() {

    const value = {
      isAuthorized: this.state.isAuthorized,
      email: this.state.email,
      id: this.state.id,
      isSuperuser: this.state.isSuperuser,
      loginToken: this.loginToken,
      logout: this.logout,
    };

    return (
      <userContext.Provider value={value}>
        <Nav />
      </userContext.Provider>
    );
  }
}

export default App;
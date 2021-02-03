import React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button'

class DadJokeAPIGet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
    this.makeCall = this.makeCall.bind(this);
  }

  componentDidMount() {
    this.makeCall();
  }

  makeCall() {
    let config = {
      headers: {
        "Accept": "application/json"
      }
    }
    axios.get('https://icanhazdadjoke.com/',config)
      .then(result => {
        this.setState({
          isLoaded: true,
          items: result.data.joke
        });
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
        <p>{items}</p>
        <Button variant="contained" color="primary" onClick={this.makeCall}>Get New Joke</Button>
        </div>
      );
    }
  }
}

function App() {
  return (
    <DadJokeAPIGet></DadJokeAPIGet>
  );
}

export default App;

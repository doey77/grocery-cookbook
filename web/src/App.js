import React from 'react';
import axios from 'axios';

class DadJokeAPIGet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    let config = {
      headers: {
        "Accept": "application/json"
      }
    }
    axios.get('https://icanhazdadjoke.com/',config)
      .then(result => {
        console.log(result);
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
        <p>{items}</p>
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

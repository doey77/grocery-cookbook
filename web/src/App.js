import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron'



function App() {
  return (
    <div className="App">
      <Container>
      <Jumbotron>
        <h1>This is my React App!</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </Jumbotron>
      <Button>My button</Button>
      </Container>
    </div>
  );
}

export default App;

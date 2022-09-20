import Observations from './components/observations';
import './styles/app.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router basename={'/poform'}>
    <div className="container">
      <h1 className="container-breadcrumb" onClick={() => window.location.href = 'https://ecostem.calstatela.edu/'}>Home</h1>
      <Observations></Observations>
    </div>
    </Router>
  );
}

export default App;

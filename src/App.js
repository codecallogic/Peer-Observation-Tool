import Observations from './components/observations';
import './styles/app.css';

function App() {
  return (
    <>
    <div className="container">
      <h1 className="container-breadcrumb" onClick={() => window.location.href = 'https://ecostem.calstatela.edu/'}>Home</h1>
      <Observations></Observations>
    </div>
    </>
  );
}

export default App;

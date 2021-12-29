import logo from './logo.svg';
import Discount from './components/Discount/Discount.js';
import './assets/bootstrap/bootstrap4.css';
import './App.css';

function App() {
  return (
    <div className={['App', 'container-fluid', 'p-0'].join(' ')}>
      <Discount/>
    </div>
  );
}

export default App;

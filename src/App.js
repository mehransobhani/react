import logo from './logo.svg';
import Discount from './components/Discount/Discount.js';
import ArtCourse from './components/Art/ArtCourse/ArtCourse';
import './assets/bootstrap/bootstrap4.css';
import './App.css';
import { BrowserRouter , Route, Routes } from 'react-router-dom';

function App() {

  return (
      <BrowserRouter>
      <div className={['App', 'container-fluid', 'p-0'].join(' ')}>
          <Routes>
            <Route path='/discount' element={<Discount/>} />
            <Route path='/art/course' element={<ArtCourse />} />
          </Routes>
      </div>
      </BrowserRouter>
  );
}

export default App;

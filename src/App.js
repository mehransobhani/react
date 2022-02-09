import logo from './logo.svg';
import Discount from './components/Discount/Discount.js';
import ArtCourse from './components/Art/ArtCourse/ArtCourse';
import './assets/bootstrap/bootstrap4.css';
import './App.css';
import CircularProgress from '@mui/material/CircularProgress';
import { BrowserRouter , Route, Routes } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
    <div className={['App', 'container-fluid', 'p-0'].join(' ')}>
      <div className={[''].join(' ')} style={{position: 'absolute', top: '0.25rem', left: '0.25rem', zIndex: '5000'}}>
        <CircularProgress color="inherit" />
      </div>
      
        <Routes>
          <Route path='/discount' element={<Discount/>} />
          <Route path='/art/course' element={<ArtCourse />} />
        </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;

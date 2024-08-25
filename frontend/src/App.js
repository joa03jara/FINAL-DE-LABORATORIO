import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './components/login';
import Registrarse from './components/registrarse';
import Libros from './components/libros';

import './App.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}></Route>
          <Route path='/reg' element={<Registrarse/>}></Route>
          <Route path='/lib' element={ <Libros/>}></Route>
        </Routes>
      </Router>
 
    </>
  );
}

export default App;

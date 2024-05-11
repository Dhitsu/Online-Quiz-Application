import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Admin from "./components/Admin";
import Error from "./components/Error";
import Feedback from './components/Feedback';

function App() {

  return (
    <Router>
      <Routes>
        <Route index path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />}/>
        <Route path="/feedback" element={<Feedback/>}/>
        <Route path="*" element={<Error/>}/>
      </Routes>
    </Router>
  );
}

export default App;

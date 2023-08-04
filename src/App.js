import './App.css';
import Select from './Components/Select/Select';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Description from './Components/Decsription/Description';
import Issue from './Components/Issues/Issue';
import Comps from './Components/Comps/Comps';
import Versions from './Components/Versions/Versions';
import Sprints from './Components/Sprints/Sprints';
import Test from './Components/Test/Test';
import Report from './Components/Report/Report'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Select />} />
        <Route path='/description' element={<Description/>}/>
        <Route path='/issue' element={<Issue/>}/>
        <Route path='/comps' element={<Comps/>}/>
        <Route path='/versions' element={<Versions/>}/>
        <Route path='/sprints' element={<Sprints/>}/>
        <Route path='/test' element={<Test/>}/>
        <Route path='/report' element={<Report/>}/>
      </Routes>
    </Router>
  );
}

export default App;

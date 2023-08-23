import TextEditor from "./TextEditor";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import {v4 as uuidV4} from 'uuid'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="https://google-docs-clone-9bit.onrender.com" element={<Navigate replace to={`/documents/${uuidV4()}`} />} />
        <Route path="https://google-docs-clone-9bit.onrender.com/documents/:id" exact element={<TextEditor/>}/>
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SignUp from './components/SignUp/SignUp';
import Login from './components/Login/Login';
import Timeline from './components/timeline/timeline';

import UserContext from './contexts/usercontext.js';
import usePersistedState from './hooks/usePersistedState.js';

export default function App() {
  const [token, setToken] = usePersistedState('token', null);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ token, setToken }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/timeline" element={<Timeline text = 'timeline'/>} />
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

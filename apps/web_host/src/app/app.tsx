import { loadRemote } from '@module-federation/runtime';
import { lazy } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import NxWelcome from './nx-welcome';

// @ts-expect-error different type but it works as expected
const RemoteApp1 = lazy(async () => await loadRemote('web_remote1/App'));
// @ts-expect-error different type but it works as expected
const RemoteApp2 = lazy(async () => await loadRemote('web_remote2/App'));
// @ts-expect-error different type but it works as expected
const RemoteApp3 = lazy(async () => await loadRemote('web_remote3/App'));
// @ts-expect-error different type but it works as expected
const RemoteApp4 = lazy(async () => await loadRemote('web_remote4/App'));

export function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<NxWelcome title='Home Page' />} />
        <Route path="/remote1/*" element={<RemoteApp1 />} />
        <Route path="/remote2/*" element={<RemoteApp2 />} />
        <Route path="/remote3/*" element={<RemoteApp3 />} />
        <Route path="/remote4/*" element={<RemoteApp4 />} />
      </Routes>
    </Router>
  );
}

export default App;

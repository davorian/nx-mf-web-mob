import * as React from 'react'
import { Text, View } from 'react-native'

// @ts-ignore
const RemoteApp1 = React.lazy(() => import('mob_remote1'));
//const RemoteApp2 = React.lazy(() => import('mob_remote2/App'));
// const RemoteApp3 = React.lazy(() => import('mob_remote3/App'));
// const RemoteApp4 = React.lazy(() => import('mob_remote4/App'));


/*const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<div>Web Host Home</div>} />
      <Route path="/remote1/!*" element={<Suspense fallback={null}><RemoteApp1 /></Suspense>} /><Route path="/remote2/!*" element={<Suspense fallback={null}><RemoteApp2 /></Suspense>} />
      <Route path="/remote3/!*" element={<Suspense fallback={null}><RemoteApp3 /></Suspense>} />
      <Route path="/remote4/!*" element={<Suspense fallback={null}><RemoteApp4 /></Suspense>} />
    </Routes>
  </Router>
);*/

const App = () => {
  console.log( 'App Component loaded');
  console.log({ RemoteApp1 });
  return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>!-**Mob Host Home**-!</Text>
    <RemoteApp1 />
  </View>);
}



export default App;

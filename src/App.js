import './App.css';
import Chat from './Chat';
import Login from './Login';
import Sidebar from './Sidebar';
import { useStateValue } from './StateProvider';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const [{ user }] = useStateValue();
  console.log(user);
  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
          <div className="app__body">
            <Router>
              <Switch>
                <Route exact path="/">
                  <Sidebar />
                </Route>
                <Route exact path="/rooms/:roomId">
                  <Sidebar />
                  <Chat />
                </Route>
              </Switch>
            </Router>
          </div>
        )}
    </div>
  );
}

export default App;

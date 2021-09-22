import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
// Pages
import Alone from './pages/Alone.js';
import Group from './pages/Group.js';
import Host from './pages/Host.js';
import Join from './pages/Join.js';
import Landing from './pages/Landing.js';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';

function App() {
  return (
    <Router>
      <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/alone" component={Alone} />
          <Route exact path="/group" component={Group} />
          <Route exact path="/group/host/" component={Host} />
          <Route exact path="/group/join/" component={Join} />
      </Switch>
    </Router>
  );
}

export default App;

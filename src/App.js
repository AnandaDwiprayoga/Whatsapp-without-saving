import Login from "./pages/Login/Login";
import { BrowserRouter as Router, Switch,Route } from 'react-router-dom';
import Home from "./pages/Home/Home";

function App() {
  return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path='/login'>
              <Login/>
            </Route>
            <Route exact path='/'>
              <Home/>
            </Route>
          </Switch>
        </div>
      </Router>  
  );
}

export default App;

import './App.css';
import Login from "./login/Login";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/login">
                    <Login/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;

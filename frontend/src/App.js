import './App.css';
import Login from "./login/Login";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {useEffect, useRef, useState} from "react";

function App() {

    const [isAuthenticated, setAuthenticated] = useState(false);
    const socket = useRef(null);

    useEffect(() => {
        socket.current = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
        socket.current.onopen = () => console.log("WebSocket opened!");
        socket.current.onclose = () => console.log("WebSocket closed!");

        return () => {
            socket.current.close();
        };
    }, []);

    useEffect(() => {
        if (!socket.current) return;

        socket.current.onmessage = event => {
            const message = JSON.parse(event.data);
            console.log(message);
        };
    });

    return (
        <Router>
            <Switch>
                <Route path="/login">
                    <Login isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated}/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;

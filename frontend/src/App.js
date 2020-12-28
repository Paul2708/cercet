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
    const [uid, setUID] = useState(null);
    const [role, setRole] = useState('STUDENT');
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
            console.log(event.data);
        };
    });

    return (
        <Router>
            <Switch>
                <Route path="/login">
                    <Login isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated} socket={socket}
                           uid={uid} setUID={setUID} role={role} setRole={setRole}/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;

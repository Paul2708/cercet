import './App.css';
import Login from "./login/Login";
import {
    BrowserRouter as Router,
    Switch,
    Route, Redirect
} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import Student from "./student/Student";
import Teacher from "./teacher/Teacher";

function App() {

    const [isAuthenticated, setAuthenticated] = useState(false);
    const [uid, setUID] = useState(null);
    const [name, setName] = useState('');
    const [role, setRole] = useState(null);
    const [logs, setLogs] = useState([]);
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
            if (event.data === 'Login done :D') {
                setAuthenticated(true);
            } else {
                const message = JSON.parse(event.data);

                // When receiving log output
                if (message.output && message.type) {
                    const newLogs = [...logs];
                    newLogs.push({
                        type: message.type,
                        output: message.output
                    });
                    setLogs(newLogs);
                    console.log(newLogs);
                }
            }
        };
    });

    async function executeCode(code) {
        await fetch(process.env.REACT_APP_BACKEND_URL + 'execution', {
            method: 'POST',
            body: JSON.stringify({
                code: code
            }),
            headers: {
                'X-UID': uid
            }
        });
    }

    let mainPage;
    switch (role) {
        case "STUDENT":
            mainPage = (<Student socket={socket.current} name={name} logs={logs} uid={uid} executeCode={executeCode}/>);
            break;
        case "TEACHER":
            mainPage = (<Teacher/>)
            break;
        default:
            mainPage = (<Redirect to="/login"/>)
    }

    return (
        <Router>
            <Switch>
                <Route path="/login">
                    <Login isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated} socket={socket}
                           setUID={setUID} setRole={setRole} setName={setName}/>
                </Route>
                <Route path="/">
                    {mainPage}
                </Route>
            </Switch>
        </Router>
    );
}

export default App;

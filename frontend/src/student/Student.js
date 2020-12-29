import {useRef} from "react";
import Editor from "@monaco-editor/react";
import {Button} from "react-bootstrap";
import './Student.css';
import Logs from "../components/Logs";

export default function Student(props) {
    const {logs, socket, uid, executeCode} = props;
    const editorRef = useRef();
    const timer = useRef();
    const lastCode = useRef();

    function handleEditorDidMount(_, editor) {
        editorRef.current = editor;
        timer.current = setTimeout(() => {
            const code = editorRef.current.getValue();

            if (code === lastCode.current) return;

            const message = {
                message: 'patch',
                data: {
                    patch: code
                }
            };
            socket.send(JSON.stringify(message));

            lastCode.current = code;
        }, 100);
    }

    async function resetToTemplate() {
        const response = await (await fetch(process.env.REACT_APP_BACKEND_URL + '/template', {
            headers: {
                'X-UID': uid
            }
        })).json();
        editorRef.current.setValue(response.code);
    }

    async function runCode() {
        const code = editorRef.current.getValue();
        await executeCode(code);
    }

    return (
        <>
            <div className="align-items-center">
                <Button onClick={runCode} variant="primary" className="control-button">
                    Run
                </Button>
                <Button onClick={resetToTemplate} variant="danger" className="control-button">
                    Reset to template
                </Button>
            </div>
            <Editor
                height="90vh"
                theme='dark'
                language='java'
                editorDidMount={handleEditorDidMount}
                loading={"Loading..."}/>
            <Logs logs={logs}/>
        </>
    );
}
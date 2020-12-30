import './Logs.css';

export default function Logs(props) {
    return <div className="logs-container">
        {props.logs.map((log, index) => (
            <span key={index} className={log.type.toLowerCase() + " log-message"}>{log.output}</span>
        ))}
    </div>
}
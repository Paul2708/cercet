export default function Logs(props) {
    return <div>
        {props.logs.map((log, index) => (
            <p key={index} className={log.type.toLowerCase()}>{log.output}</p>
        ))}
    </div>
}
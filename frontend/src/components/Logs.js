export default function Logs(props) {
    const {logs} = props.logs.map(log => {
        return (<p className={log.type.toLowerCase()}>{log.output}</p>)
    });

    return <div>
        {logs}
    </div>
}
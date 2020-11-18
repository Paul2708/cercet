# Endpoints
## REST endpoints
General settings for every request:
- body and response encoded in JSON
- `X-UID` header that contains the UID (expect [`/login`](#login))
- the default port is `42069`

### Login
- **Endpoint**: `login/`
- no `X-UID` header required
- **body**:
```json
{
  "name": "<name>"
}
```
- **response**
```json
{
  "uuid": "a0d5c36c-bb1f-4e3b-9ba3-b9dddd9e07f5"
}
```
The uuid has to be used as `X-UID` header in following requests.

### Code execution
- **Endpoint**: `execution/`
- **body**:
```json
{
  "code": "<code>"
}
```
`code` is Java source code. You may have to escape `"`.
- **response**: ignored

The code execution will output any messages to the web socket that logged in (cf. Web Socket / Login) before.

## Web Socket endpoints
The url for web socket communication is `ws://localhost:42069/ws`.
Every message to the server will be encoded in *messages*.
A message has the following format:
```json
{
  "message": "<message type>",
  "data": {
    "my-key": "<my-val>"
  }
}
```
`message` represents the message type and will be given for every message.

`data` is a json object that contains message agnostic values.

### Login
- **message type**: `login`
- **data**:
```json
{
  "data": {
    "uid": "<uid>"
  }
}
```
- **response**: ignored

After the login, the socket will receive code execution output.

### Code execution output
The socket will receive messages in the following format:
```json
{
  "output": "<output message>",
  "type": "<type>"
}
```

`output` represents an output line printed by the compiler and execution (default output stream).

`type` refers to the message type.
* `INTERNAL_ERROR`: internal error message, e.g. `NPE`
* `INFO`: additional information like `Compiling..`, `Compiled!` that are part of the process output.
* `ERROR`: error caused by compiling or execution, e.g. `missing ;` or `divide by zero`
* `NORMAL`: normal `System.out` output
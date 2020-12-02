# Endpoints
## REST endpoints
General settings for every request:
- body and response encoded in JSON
- `X-UID` header that contains the UID (expect [`/login`](#login))
- the default port is `42069`

### Login
- **Method**: `POST`
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
  "uuid": "a0d5c36c-bb1f-4e3b-9ba3-b9dddd9e07f5",
  "role": "{STUDENT | TEACHER}"
}
```
The uuid has to be used as `X-UID` header in following requests.

`role` can be `STUDENT` or `TEACHER`.

### Code execution
- **Method**: `POST`
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

### Users
- **Method**: `GET`
- **Endpoint**: `user/`
- **body**: ignored
- **response**
```json
[
  {
    "uuid": "a0d5c36c-bb1f-4e3b-9ba3-b9dddd9e07f5",
    "name": "Max Mustermann",
    "role": "{STUDENT | TEACHER}"
  },
  {
    "uuid": "a0d5c36c-bb1f-4e3b-9ba3-b9d4f59e07f5",
    "name": "Joe",
    "role": "{STUDENT | TEACHER}"
  }
]
```
Array of users including uuid, role and name.

- the `UID` has to refer to a teacher, otherwise `401 Unauthorized`

### Templates
#### Set template
- **Method**: `POST`
- **Endpoint**: `template/`
- **body**:
```json
{
  "template": "<code>"
}
```
`template` is Java source code. You may have to escape `"`.
- **response**: ignored
- the `UID` has to refer to a teacher, otherwise `401 Unauthorized`

#### Get template
- **Method**: `GET`
- **Endpoint**: `template/`
- **body**: ignored
- **response**:
```json
{
  "code": "<code>"
}
```
`code` is Java source code. You may have to escape `"`.

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

### Patches
#### Send patch
- **message type**: `patch`
- **data**:
```json
{
  "data": {
    "patch": "<patch>"
  }
}
```
- **response**: ignored

`patch` will be applied to the teachers' editor.

#### Apply patch
Every teacher will receive the following object on every student editor update.
```json
{
  "patch": "<patch>",
  "uid": "<uid>"
}
```
`patch` is the applicable patch and `uid` refers to the student.

### Cursor information
#### Send cursor
The teacher has to send for every cursor update the following message:
- **message type**: `cursor`
- **data**:
```json
{
  "data": {
    "cursor": "<cursor information>",
    "student-uid": "<uid>"
  }
}
```
- **response**: ignored

`cursor information` represent the cursor position.
The teacher clicks into the view of `student-uid`.

#### Receive cursor
The student will receive the following data:
```json
{
  "cursor": "<cursor information>",
  "student-uid": "<uid>",
  "teacher-uid": "<uid>"
}
```

`cursor information` represent the cursor position.
`teacher-uid` is the teacher that clicks into the editor.

### Initial code request
#### Request
Should be triggered, if th eteacher clicks "View".

- **message type**: `initial-request`
- **data**:
```json
{
  "data": {
    "student-uid": "<uid>"
  }
}
```
`student-uid` refers to the uid of the clicked student.

Then, the student receives the message:

- **message type**: `initial-request`
- **data**: doesn't exist

If the student receives this message, he has to [send the current editor](#Send-patch) as patch.
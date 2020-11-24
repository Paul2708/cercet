import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subject, BehaviorSubject} from 'rxjs';
import {environment} from '../../environments/environment';
import {Student} from '../interfaces/student';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private readonly changeListener$: Subject<PatchData>;
  private usernameKey = 'username';
  private socket: WebSocket;
  private uuid: string;
  private readonly outputListener$: Subject<OutputData>;
  private readonly onSocketInit$: Subject<any>;
  private readonly studentListener$: BehaviorSubject<Student[]>;
  private readonly studentCodeListener$: Subject<StudentCodeUpdate>;
  private isStudent = true;
  private currentTemplate: string;
  private studentCode = new Map<string, string>();

  constructor(private httpClient: HttpClient, private router: Router) {
    this.socket = this.initializeWebSocket();
    this.onSocketInit$ = new Subject();
    this.changeListener$ = new Subject<PatchData>();
    this.outputListener$ = new Subject<OutputData>();
    this.studentListener$ = new BehaviorSubject<Student[]>([]);
    this.studentCodeListener$ = new Subject<StudentCodeUpdate>();
    this.studentCodeListener$.subscribe(value => console.log(value));
  }

  private initializeWebSocket(): WebSocket {
    const socket = new WebSocket(environment.socketUrl);
    socket.onmessage = (event) => {
      if (event.data === 'Login done :D') {
        return;
      }
      const message: WebSocketMessage = JSON.parse(event.data);
      this.onSocketInit$.next({
        socket,
        message
      });
      if (message.message === 'patch') {
        if (!environment.production) {
          console.log('Receiving patch!');
        }
        this.changeListener$.next(message.data.patch);
      } else if (message.type && message.output) {
        this.outputListener$.next(message as OutputData);
      } else if (Array.isArray(message)) {
        this.studentListener$.next(message);
      } else if (message.patch && message.uid && this.isStudent === false) {
        this.studentCodeListener$.next({
          patch: message.patch,
          uid: message.uid
        });
      } else {
        console.log(message);
      }
    };

    socket.onclose = () => {
      console.log('Socket closed');
    };
    return socket;
  }

  async login(username: string): Promise<void> {
    localStorage.setItem(this.usernameKey, username);
    const {uuid, role} = await this.httpClient.post(environment.serverUrl + 'login', {
      name: username
    }).toPromise() as any;

    this.isStudent = role === 'STUDENT';

    this.uuid = uuid;
    this.socket.send(JSON.stringify({
      message: 'login',
      data: {
        uid: this.uuid
      }
    }));
    if (!environment.production) {
      console.log('Logged in with uuid ' + uuid);
    }
  }

  onSocketInit(): Observable<any> {
    return this.onSocketInit$;
  }

  isLoggedIn(): boolean {
    const username = localStorage.getItem(this.usernameKey);
    return !!username && !!this.uuid;
  }

  getUsername(): string {
    return localStorage.getItem(this.usernameKey);
  }

  logout(): void {
    localStorage.removeItem(this.usernameKey);
  }

  isTeacher(): boolean {
    return !this.isStudent;
  }

  sendPatch(patch: string): void {
    const data = {
      patch
    };
    if (!this.socket) {
      return;
    }
    this.socket.send(JSON.stringify({
      message: 'patch',
      data
    }));
  }

  sendPatchForStudent(uuid: string, patch: string): void {
    const data = {
      uuid: this.uuid,
      for: uuid,
      patch
    };
    if (!this.socket) {
      return;
    }
    this.socket.send(JSON.stringify(data));
  }

  changeListener(): Observable<PatchData> {
    return this.changeListener$;
  }

  outputListener(): Observable<OutputData> {
    return this.outputListener$;
  }

  studentListener(): Observable<Student[]> {
    return this.studentListener$;
  }

  studentCodeListener(): Observable<StudentCodeUpdate> {
    return this.studentCodeListener$;
  }

  disconnect(): void {
    this.socket.close();
  }

  async execute(code: string): Promise<void> {
    await this.httpClient.post(environment.serverUrl + 'execution', {
      code
    }, {
      headers: {
        'X-UID': this.uuid
      },
      responseType: 'text'
    }).toPromise();
  }

  getCurrentTemplate(): string {
    return this.currentTemplate;
  }

  async getTemplate(): Promise<string> {
    const {code} = await this.httpClient.get(environment.serverUrl + 'template', {
      headers: {
        'X-UID': this.uuid
      },
      responseType: 'json'
    }).toPromise() as any;
    this.currentTemplate = code;
    return code;
  }

  async checkWSConnection(): Promise<void> {
    return new Promise((resolve) => {
      if (this.socket.CLOSED) {
        this.socket = this.initializeWebSocket();
        this.socket.onopen = () => {
          resolve();
        };
      }
    });
  }

  async setTemplate(code: string): Promise<boolean> {
    return await this.httpClient.post(environment.serverUrl + 'template', {
        template: code
      },
      {
        headers: {
          'X-UID': this.uuid
        },
        responseType: 'text'
      }).toPromise() === 'alles geklappt';
  }

  getStudentCode(uid: string): string {
    const code = this.studentCode.get(uid);
    if (code) {
      return code;
    }
    this.studentCode.set(uid, this.currentTemplate);
    return this.currentTemplate;
  }

  setStudentCode(code: string, uid: string): void {
    this.studentCode.set(uid, code);
  }
}

export interface OutputData {
  output: string;
  type: string;
}

export interface WebSocketMessage {
  uid?: string;
  patch?: string;
  message: string;
  data: any;
  type?: string;
  output?: string;
}

export interface PatchData {
  name: string;
  patch: string;
}

export interface StudentCodeUpdate {
  patch: string;
  uid: string;
}

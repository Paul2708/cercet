import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private readonly changeListener$: Subject<PatchData>;
  private usernameKey = 'username';
  private socket: WebSocket;
  private uuid: string;
  private readonly outputListener$: Subject<OutputData>;

  constructor(private httpClient: HttpClient, private router: Router) {
    this.socket = this.initializeWebSocket();
    this.changeListener$ = new Subject<PatchData>();
    this.outputListener$ = new Subject<OutputData>();
  }

  private initializeWebSocket(): WebSocket {
    const socket = new WebSocket(environment.socketUrl);
    socket.onmessage = (event) => {
      if (event.data === 'Login done :D') {
        this.router.navigateByUrl('student');
        return;
      }
      const message: WebSocketMessage = JSON.parse(event.data);
      if (message.message === 'patch') {
        if (!environment.production) {
          console.log('Receiving patch!');
        }
        this.changeListener$.next(message.data);
      } else if (message.type && message.output) {
        this.outputListener$.next(message as OutputData);
      } else {
        console.log(message);
      }
    };
    return socket;
  }

  async login(username: string): Promise<void> {
    localStorage.setItem(this.usernameKey, username);
    const {uuid} = await this.httpClient.post(environment.serverUrl + 'login', {
      name: username
    }).toPromise() as any;

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
    return !!localStorage.getItem('teacher');
  }

  sendPatch(patch: string): void {
    const data = {
      name: this.getUsername(),
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

  async getTemplate(): Promise<string> {
    const {code} = await this.httpClient.get(environment.serverUrl + 'template', {
      headers: {
        'X-UID': this.uuid
      }
    }).toPromise() as any;
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
}

export interface OutputData {
  output: string;
  type: string;
}

export interface WebSocketMessage {
  message: string;
  data: any;
  type?: string;
  output?: string;
}

export interface PatchData {
  name: string;
  patch: string;
}

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private readonly changeListener$: Subject<PatchData>;
  private usernameKey = 'username';
  private readonly socket: WebSocket;
  private uuid: string;

  constructor(private httpClient: HttpClient) {
    this.socket = BackendService.initializeWebSocket();
    this.changeListener$ = new Subject();

    this.socket.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      if (message.message === 'patch') {
        if (!environment.production) {
          console.log('Receiving patch!');
        }
        this.changeListener$.next(message.data);
      }
    };
  }

  private static initializeWebSocket(): WebSocket {
    return new WebSocket(environment.socketUrl);
  }

  async login(username: string): Promise<void> {
    localStorage.setItem(this.usernameKey, username);
    const {uuid} = await this.httpClient.post(environment.serverUrl + 'login', {
      name: username
    }).toPromise() as any;

    this.uuid = uuid;
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
    console.log(JSON.stringify(data));
    if (!this.socket) {
      return;
    }
    this.socket.send(JSON.stringify(data));
  }

  changeListener(): Observable<PatchData> {
    return this.changeListener$;
  }

  disconnect(): void {
    this.socket.close();
  }
}

export interface WebSocketMessage {
  message: string;
  data: any;
}

export interface PatchData {
  name: string;
  patch: string;
}

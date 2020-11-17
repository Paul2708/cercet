import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor() {
    this.socket = BackendService.initializeWebSocket();
  }

  private usernameKey = 'username';
  private readonly socket: WebSocket;

  private static initializeWebSocket(): WebSocket {
    return new WebSocket(environment.socketUrl);
  }

  login(username: string): void {
    localStorage.setItem(this.usernameKey, username);
  }

  isLoggedIn(): boolean {
    const username = localStorage.getItem(this.usernameKey);
    return !!username;
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
    return new Observable<PatchData>(observer => {
      this.socket.onmessage = (event) => {
        const patchData: PatchData = JSON.parse(event.data);
        if (!environment.production) {
          console.log('Receiving patch!');
        }
        observer.next(patchData);
      };
    });
  }
}

export interface PatchData {
  name: string;
  patch: string;
}

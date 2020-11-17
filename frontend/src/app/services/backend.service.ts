import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private usernameKey = 'username';

  constructor() {
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
}

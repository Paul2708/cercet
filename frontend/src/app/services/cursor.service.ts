import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {BackendService} from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class CursorService {

  private selectionListener$ = new Subject<monaco.Selection>();
  private socket: WebSocket;

  constructor(private backendService: BackendService) {
    backendService.onSocketInit().subscribe(data => {
      const {message, socket} = data;
      this.socket = socket;
      if (message.cursor) {
        if (message === 'nothing lol') {
          this.selectionListener$.next(null);
        } else {
          this.selectionListener$.next(JSON.parse(message.cursor));
        }
        console.log(message.cursor);
      }
    });
  }

  selectionListener(): Observable<monaco.Selection> {
    return this.selectionListener$.asObservable();
  }

  sendCursor(selection: monaco.Selection, student: string): void {
    this.socket.send(JSON.stringify({
      message: 'cursor',
      data: {
        cursor: JSON.stringify(selection),
        'student-uid': student
      }
    }));
  }

}

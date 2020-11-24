import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject, Subject} from 'rxjs';
import {BackendService} from './backend.service';
import Range = monaco.Range;

interface CursorPosition {
  row: number;
  column: number;
}

@Injectable({
  providedIn: 'root'
})
export class CursorService {

  private cursorListener$ = new BehaviorSubject<CursorPosition>(null);
  private selectionListener$ = new BehaviorSubject<Range>(null);

  constructor(private backendService: BackendService) {
    backendService.onSocketInit().subscribe(data => {
      const {message} = data;
      if (message.message === 'cursor') {
        this.cursorListener$.next({
          column: message.column,
          row: message.row
        });
      } else if (message.message === 'selection') {
        this.selectionListener$.next(message.range);
      }
    });
  }

  cursorListener(): Observable<CursorPosition> {
    return this.cursorListener$.asObservable();
  }

  selectionListener(): Observable<Range> {
    return this.selectionListener$.asObservable();
  }

}

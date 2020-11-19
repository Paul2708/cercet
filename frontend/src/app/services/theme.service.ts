import {DOCUMENT} from '@angular/common';
import {Injectable, Inject, EventEmitter} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private onThemeChange = new BehaviorSubject(this.isDarkTheme());
  private monaco: any;

  constructor(@Inject(DOCUMENT) private document: Document) {
    window.addEventListener('monacoready', (e) => {
      // @ts-ignore
      this.monaco = e.detail;
    });
  }

  setDarkTheme(dark: boolean): void {
    if ((dark === false && this.isDarkTheme()) || (dark === true && !this.isDarkTheme())) {
      this.document.body.classList.toggle('dark-theme');
      this.onThemeChange.next(this.isDarkTheme());
      this.monaco.editor.setTheme(this.isDarkTheme() ? 'vs-dark' : 'vs-light');
    }
  }

  isDarkTheme(): boolean {
    return this.document.body.classList.contains('dark-theme');
  }

  onThemeChangeListener(): Observable<boolean> {
    return this.onThemeChange.asObservable();
  }
}


import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {createPatch, applyPatch} from 'diff';
import {Subscription} from 'rxjs';
import {BackendService} from '../../services/backend.service';
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit, OnDestroy {
  username: string;

  options = {
    theme: 'vs-light',
    language: 'java'
  };
  code = 'public class Main {}';
  output = 'Hello World';

  currentTemplate = 'public class Main {}';
  private editor: monaco.editor.IStandaloneCodeEditor;
  private oldCode = this.code;
  private interval = 200;
  private subscription: Subscription;

  constructor(private backendService: BackendService, private router: Router) {
  }

  ngOnInit(): void {
    this.username = this.backendService.getUsername();
    setInterval(() => this.checkDiff(), this.interval);
    this.subscription = this.backendService.changeListener().subscribe(value => {
      this.code = applyPatch(this.code, value.patch);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.backendService.disconnect();
  }

  async logout(): Promise<void> {
    this.backendService.logout();
    await this.router.navigateByUrl('login');
  }

  clearOutput(): void {
    this.output = '';
  }

  resetTemplate(): void {
    this.code = this.currentTemplate;
  }

  initEditor(editor: IStandaloneCodeEditor): void {
    this.editor = editor;
  }

  private checkDiff(): void {
    if (this.code === this.oldCode) {
      return;
    }
    const patch = createPatch('Main.java', this.oldCode, this.code);
    this.oldCode = this.code;
    this.backendService.sendPatch(patch);
  }
}

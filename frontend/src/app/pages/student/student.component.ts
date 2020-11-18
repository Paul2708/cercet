import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Router} from '@angular/router';
import {createPatch, applyPatch} from 'diff';
import {Subscription} from 'rxjs';
import {BackendService, OutputData} from '../../services/backend.service';
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
  @Input() code = '';
  output: OutputData[] = [];

  currentTemplate: string;
  private editor: monaco.editor.IStandaloneCodeEditor;
  private oldCode: string;
  private interval = 200;
  private changeSubscription: Subscription;
  private outputSubscription: Subscription;

  constructor(private backendService: BackendService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.username = this.backendService.getUsername();
    this.currentTemplate = await this.backendService.getTemplate();
    this.code = this.currentTemplate;
    this.oldCode = this.currentTemplate;

    setInterval(() => this.checkDiff(), this.interval);

    this.changeSubscription = this.backendService.changeListener().subscribe(value => {
      this.code = applyPatch(this.code, value.patch);
    });

    this.outputSubscription = this.backendService.outputListener().subscribe(value => {
      this.output.push(value);
      console.log('Receiving output!');
    });
  }

  ngOnDestroy(): void {
    this.changeSubscription.unsubscribe();
    this.outputSubscription.unsubscribe();
    this.backendService.disconnect();
  }

  async logout(): Promise<void> {
    this.backendService.logout();
    await this.router.navigateByUrl('login');
  }

  clearOutput(): void {
    this.output = [];
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

  async runCode(): Promise<void> {
    this.clearOutput();
    await this.backendService.execute(this.code);
  }
}

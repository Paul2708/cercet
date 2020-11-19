import {Component, OnInit, Input, OnDestroy, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {applyPatch, createPatch} from 'diff';
import {Subscription} from 'rxjs';
import {OutputData, BackendService} from '../../services/backend.service';
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

  options = {
    theme: 'vs-light',
    language: 'java'
  };
  @Input() sendPatches = true;
  @Input() code = '';
  @Input() enableRun = true;
  @Input() showCopyButton = false;
  @Output() copyCode = new EventEmitter();
  @Output() codeChange = new EventEmitter();
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
    this.currentTemplate = await this.backendService.getTemplate();
    this.code = this.currentTemplate;
    this.oldCode = this.currentTemplate;

    setInterval(() => this.checkDiff(), this.interval);

    this.changeSubscription = this.backendService.changeListener().subscribe(value => {
      if (!this.sendPatches) {
        return;
      }
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
    if (!this.sendPatches) {
      return;
    }

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

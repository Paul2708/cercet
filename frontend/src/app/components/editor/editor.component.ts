import {Component, OnInit, Input, OnDestroy, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {applyPatch, createPatch} from 'diff';
import {Subscription} from 'rxjs';
import {OutputData, BackendService} from '../../services/backend.service';
import {CursorService} from '../../services/cursor.service';
import {ThemeService} from '../../services/theme.service';
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

  constructor(private backendService: BackendService,
              private router: Router,
              private themeService: ThemeService,
              private cursorService: CursorService) {
  }

  options = {
    theme: this.themeService.isDarkTheme() ? 'vs-dark' : 'vs-light',
    language: 'java'
  };
  @Input() sendPatches = true;
  @Input() code = '';
  @Input() enableRun = true;
  @Input() showCopyButton = false;
  @Input() showTemplateButton = false;
  @Input() showSetTemplateButton = false;
  @Input() showResetButton = true;
  @Input() studentUID: string;
  @Input() editable = true;
  @Output() copyCode = new EventEmitter();
  @Output() codeChange = new EventEmitter();
  @Output() templateButtonClick = new EventEmitter();
  @Output() setTemplateButtonClick = new EventEmitter();

  output: OutputData[] = [];

  currentTemplate: string;
  private editor: monaco.editor.IStandaloneCodeEditor;
  private oldCode: string;
  private interval = 200;
  private changeSubscription: Subscription;
  private outputSubscription: Subscription;
  private selectionSubscription: Subscription;

  private lastSelection: monaco.Selection;
  private decorations = [];

  async ngOnInit(): Promise<void> {
    this.currentTemplate = await this.backendService.getTemplate();
    this.code = this.currentTemplate;
    this.oldCode = this.currentTemplate;

    if (this.sendPatches === true) {
      setInterval(() => this.checkDiff(), this.interval);

      this.changeSubscription = this.backendService.changeListener().subscribe(value => {
        this.code = applyPatch(this.code, value.patch);
      });
    }

    this.backendService.onSocketInit().subscribe(data => {
      const {socket, message} = data;
      if (message.message === 'initial-request') {
        this.backendService.sendPatch(this.code);
      }
    });

    this.outputSubscription = this.backendService.outputListener().subscribe(value => {
      this.output.push(value);
      console.log('Receiving output!');
    });

    if (!this.studentUID) {
      this.selectionSubscription = this.cursorService.selectionListener().subscribe(value => {
        if (value) {
          /*this.editor.deltaDecorations([], [{
            options: {
              className: 'cursor'
            },
            range: new monaco.Range(value.startLineNumber, value.startColumn, value.endLineNumber, value.endColumn)
          }]);*/
          this.decorations = this.editor.deltaDecorations(this.decorations, [
            {
              range: {
                startColumn: value.startColumn,
                startLineNumber: value.startLineNumber,
                endColumn: value.endColumn,
                endLineNumber: value.endLineNumber
              },
              options: {
                className: 'cursor'
              }
            }
          ]);
        } else {
          this.editor.deltaDecorations(this.decorations, []);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
    if (this.outputSubscription) {
      this.outputSubscription.unsubscribe();
    }

    if (this.enableRun === true) {
      this.backendService.disconnect();
    }
    if (this.selectionSubscription) {
      this.selectionSubscription.unsubscribe();
    }
  }

  clearOutput(): void {
    this.output = [];
  }

  async resetTemplate(): Promise<void> {
    this.currentTemplate = await this.backendService.getTemplate();
    this.code = this.currentTemplate;
  }

  initEditor(editor: IStandaloneCodeEditor): void {
    this.editor = editor;
  }

  private checkDiff(): void {
    const selection = this.editor.getSelection();
    // if (selection.startLineNumber === selection.endLineNumber && selection.startColumn === selection.endColumn) {
    // @ts-ignore
    // this.cursorService.sendCursor('"noting lol"', this.studentUID);
    /*} else*/
    if (this.studentUID && selection !== this.lastSelection) {
      this.cursorService.sendCursor(selection, this.studentUID);
      this.lastSelection = selection;
    }
    if (this.code === this.oldCode) {
      return;
    }
    const patch = this.code; // createPatch('Main.java', this.oldCode, this.code);
    this.oldCode = this.code;
    if (this.studentUID) {
      this.backendService.sendPatchForStudent(this.studentUID, patch);
    } else {
      this.backendService.sendPatch(patch);
    }
  }

  async runCode(): Promise<void> {
    this.clearOutput();
    await this.backendService.execute(this.code);
  }

  updateCode(code: string): void {
    this.code = code;
    this.editor.setValue(code);
  }
}

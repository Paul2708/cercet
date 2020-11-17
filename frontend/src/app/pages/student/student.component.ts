import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BackendService} from '../../services/backend.service';
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  username: string;

  options = {
    theme: 'vs-light',
    language: 'java'
  };
  code = 'public class Main {}';
  output = 'Hello World';

  currentTemplate = 'public class Main {}';
  private editor: monaco.editor.IStandaloneCodeEditor;

  constructor(private backendService: BackendService, private router: Router) {
  }

  ngOnInit(): void {
    this.username = this.backendService.getUsername();
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
}

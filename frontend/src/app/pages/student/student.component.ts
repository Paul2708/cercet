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
export class StudentComponent implements OnInit {
  username: string;

  constructor(private backendService: BackendService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
  }

  async logout(): Promise<void> {
    this.backendService.logout();
    await this.router.navigateByUrl('login');
  }

}

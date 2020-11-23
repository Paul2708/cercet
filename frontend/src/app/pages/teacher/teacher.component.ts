import {Component, OnInit, OnDestroy} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Router} from '@angular/router';
import {applyPatch} from 'diff';
import {Observable, Subscription} from 'rxjs';
import {SelectTemplateComponent} from '../../components/select-template/select-template.component';
import {StudentteachereditorComponent} from '../../components/studentteachereditor/studentteachereditor.component';
import {Student} from '../../interfaces/student';
import {BackendService} from '../../services/backend.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit, OnDestroy {

  students: Observable<Student[]>;
  code = '';
  private codeChangeSubscription: Subscription;

  constructor(private bottomSheet: MatBottomSheet, private backendService: BackendService, private router: Router) {
  }

  ngOnInit(): void {
    this.students = this.backendService.studentListener();
    this.codeChangeSubscription = this.backendService.studentCodeListener().subscribe(value => {
      let currentCode = this.backendService.getStudentCode(value.uid);
      currentCode = applyPatch(currentCode, value.patch);
      this.backendService.setStudentCode(value.uid, currentCode);
    });
  }

  ngOnDestroy(): void {
    this.codeChangeSubscription.unsubscribe();
  }

  openStudentEditor(student: Student): void {
    this.bottomSheet.open(StudentteachereditorComponent, {
      panelClass: 'custom-size',
      data: {
        uid: student.uuid,
        code: this.backendService.getStudentCode(student.uuid)
      }
    }).afterDismissed().subscribe(code => {
      if (code) {
        this.code = code;
      }
    });
  }

  async logout(): Promise<void> {
    this.backendService.logout();
    await this.router.navigateByUrl('login');
  }

  openTemplateEditor(): void {
    this.bottomSheet.open(SelectTemplateComponent, {
      panelClass: 'template-editor-size'
    });
  }
}

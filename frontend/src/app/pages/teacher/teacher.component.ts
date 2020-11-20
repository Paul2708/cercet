import {Component, OnInit} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Router} from '@angular/router';
import {SelectTemplateComponent} from '../../components/select-template/select-template.component';
import {StudentteachereditorComponent} from '../../components/studentteachereditor/studentteachereditor.component';
import {Student} from '../../interfaces/student';
import {BackendService} from '../../services/backend.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  students: Student[] = [
    {
      name: 'KEKW',
      code: 'public class Main {\n' +
        '  public static void main(String[] args) {\n' +
        '    System.out.println("Hello World!");\n' +
        '  }\n' +
        '}',
      uuid: 'asdf'
    }
  ];
  code = '';

  constructor(private bottomSheet: MatBottomSheet, private backendService: BackendService, private router: Router) {
  }

  ngOnInit(): void {
  }

  openStudentEditor(student: Student): void {
    this.bottomSheet.open(StudentteachereditorComponent, {
      panelClass: 'custom-size',
      data: student
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

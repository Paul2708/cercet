import {Component, OnInit} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {StudentteachereditorComponent} from '../../components/studentteachereditor/studentteachereditor.component';
import {Student} from '../../interfaces/student';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  students: Student[] = [
    {
      name: 'KEKW',
      code: 'public class Main {}'
    }
  ];

  constructor(private bottomSheet: MatBottomSheet) {
  }

  ngOnInit(): void {
  }

  openStudentEditor(student: Student): void {
    this.bottomSheet.open(StudentteachereditorComponent);
  }

}

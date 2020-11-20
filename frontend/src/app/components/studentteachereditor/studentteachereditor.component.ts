import {Component, OnInit, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {Student} from '../../interfaces/student';
import {TeacherComponent} from '../../pages/teacher/teacher.component';

@Component({
  selector: 'app-studentteachereditor',
  templateUrl: './studentteachereditor.component.html',
  styleUrls: ['./studentteachereditor.component.css']
})
export class StudentteachereditorComponent implements OnInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public student: Student, private ref: MatBottomSheetRef<TeacherComponent>) {
  }

  ngOnInit(): void {
  }

  copyCode(code: string): void {
    this.ref.dismiss(code);
  }
}

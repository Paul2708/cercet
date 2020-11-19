import {Component, OnInit, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {Student} from '../../interfaces/student';

@Component({
  selector: 'app-studentteachereditor',
  templateUrl: './studentteachereditor.component.html',
  styleUrls: ['./studentteachereditor.component.css']
})
export class StudentteachereditorComponent implements OnInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public student: Student) {
  }

  ngOnInit(): void {
  }

}

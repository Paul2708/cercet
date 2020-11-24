import {Component, Inject, OnDestroy, ViewChild, AfterViewInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {applyPatch} from 'diff';
import {Subscription} from 'rxjs';
import {TeacherComponent} from '../../pages/teacher/teacher.component';
import {BackendService} from '../../services/backend.service';
import {EditorComponent} from '../editor/editor.component';

@Component({
  selector: 'app-studentteachereditor',
  templateUrl: './studentteachereditor.component.html',
  styleUrls: ['./studentteachereditor.component.css']
})
export class StudentteachereditorComponent implements AfterViewInit, OnDestroy {
  private subscription: Subscription;
  @ViewChild(EditorComponent) private editor: EditorComponent;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data, private ref: MatBottomSheetRef<TeacherComponent>,
              private backendService: BackendService) {
  }

  ngAfterViewInit(): void {
    console.log(this.editor);
    this.subscription = this.backendService.studentCodeListener().subscribe(value => {
      if (this.data.uid === value.uid) {
        let code = this.backendService.getStudentCode(this.data.uid);
        code = applyPatch(code, value.patch);
        this.data.code = code;
        this.editor.updateCode(code);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  copyCode(code: string): void {
    this.ref.dismiss(code);
  }
}

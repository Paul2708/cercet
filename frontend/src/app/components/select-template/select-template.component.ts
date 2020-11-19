import {Component, OnInit, ViewChild} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {BackendService} from '../../services/backend.service';
import {EditorComponent} from '../editor/editor.component';

@Component({
  selector: 'app-select-template',
  templateUrl: './select-template.component.html',
  styleUrls: ['./select-template.component.css']
})
export class SelectTemplateComponent implements OnInit {
  code = 'public class Main {\n  ' +
    'public static void main(String[] args) {\n    ' +
    '\n  }\n}';

  @ViewChild(EditorComponent) editor: EditorComponent;

  constructor(private bottomSheetRef: MatBottomSheetRef<SelectTemplateComponent>, private backendService: BackendService) {
  }

  ngOnInit(): void {
  }

  async setTemplate(code: string): Promise<void> {
    this.bottomSheetRef.dismiss();
    const success = await this.backendService.setTemplate(code);
  }
}

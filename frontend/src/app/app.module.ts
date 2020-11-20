import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MonacoEditorModule, NgxMonacoEditorConfig} from 'ngx-monaco-editor';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {EditorComponent} from './components/editor/editor.component';
import {SelectTemplateComponent} from './components/select-template/select-template.component';
import {StudentteachereditorComponent} from './components/studentteachereditor/studentteachereditor.component';
import {LoginComponent} from './pages/login/login.component';
import {StudentComponent} from './pages/student/student.component';
import {TeacherComponent} from './pages/teacher/teacher.component';

const monacoConfig: NgxMonacoEditorConfig = {
  onMonacoLoad: (e) => {
    // @ts-ignore
    const event = new CustomEvent('monacoready', {detail: (window as any).monaco});
    window.dispatchEvent(event);
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StudentComponent,
    TeacherComponent,
    EditorComponent,
    StudentteachereditorComponent,
    SelectTemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    FlexLayoutModule,
    MatBottomSheetModule,
    MonacoEditorModule.forRoot(monacoConfig),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}

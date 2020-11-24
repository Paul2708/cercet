import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoggedinGuard} from './guards/loggedin.guard';
import {LoginGuard} from './guards/login.guard';
import {TeacherGuard} from './guards/teacher.guard';
import {HomeComponent} from './pages/home/home.component';
import {LoginComponent} from './pages/login/login.component';
import {StudentComponent} from './pages/student/student.component';
import {TeacherComponent} from './pages/teacher/teacher.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'student',
    component: StudentComponent,
    canActivate: [LoggedinGuard]
  },
  {
    path: 'teacher',
    component: TeacherComponent,
    canActivate: [LoggedinGuard, TeacherGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

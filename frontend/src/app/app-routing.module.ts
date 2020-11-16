import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoggedinGuard} from './guards/loggedin.guard';
import {LoginGuard} from './guards/login.guard';
import {LoginComponent} from './pages/login/login.component';
import {StudentComponent} from './pages/student/student.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'student',
    component: StudentComponent,
    canActivate: [LoggedinGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

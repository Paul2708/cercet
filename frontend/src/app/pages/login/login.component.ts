import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private backendService: BackendService, private router: Router) {
  }

  username = '';

  ngOnInit(): void {
  }

  async login(): Promise<void> {
    try {
      await this.backendService.checkWSConnection();
      await this.backendService.login(this.username);

      const route = this.backendService.isTeacher() ? 'teacher' : 'student';
      await this.router.navigateByUrl(route);
    } catch (e) {
    }
  }

}

import {BackendService} from '../../services/backend.service';

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
      await this.backendService.login(this.username);
    } catch (e) {
    }
    await this.router.navigateByUrl('student');
  }

}

import {BackendService} from '../../services/backend.service';

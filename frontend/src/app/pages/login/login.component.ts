import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BackendService} from '../../services/backend.service';

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
    this.backendService.login(this.username);
    await this.router.navigateByUrl('student');
  }

}

import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../services/backend.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private backendService: BackendService) {
  }

  username = '';

  ngOnInit(): void {
  }

  login(): void {
    this.backendService.login(this.username);
  }

}

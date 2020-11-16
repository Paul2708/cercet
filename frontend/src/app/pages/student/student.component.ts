import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BackendService} from '../../services/backend.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  username: string;

  constructor(private backendService: BackendService, private router: Router) {
  }

  ngOnInit(): void {
    this.username = this.backendService.getUsername();
  }

  async logout(): Promise<void> {
    this.backendService.logout();
    await this.router.navigateByUrl('login');
  }

}

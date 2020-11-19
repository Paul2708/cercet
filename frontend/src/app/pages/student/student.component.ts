import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BackendService} from '../../services/backend.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  username: string;

  constructor(private backendService: BackendService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
  }

  async logout(): Promise<void> {
    this.backendService.logout();
    await this.router.navigateByUrl('login');
  }

}

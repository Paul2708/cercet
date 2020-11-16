import { Component, OnInit } from '@angular/core';
import {BackendService} from '../../services/backend.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  username: string;

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.username = this.backendService.getUsername();
  }

}

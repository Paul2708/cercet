import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit {

  constructor() {
  }

  options = {
    theme: 'vs-light',
    language: 'java'
  };
  code = 'public class Main {}';

  ngOnInit(): void {
  }

}

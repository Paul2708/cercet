import {Component, OnInit} from '@angular/core';
import {ThemeService} from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  constructor(private themeService: ThemeService) {
  }

  changeTheme(): void {
    this.themeService.setDarkTheme(!this.themeService.isDarkTheme());
  }
}

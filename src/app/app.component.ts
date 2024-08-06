import { Component, HostListener } from '@angular/core';
import { ThemeService, ThemeType } from './theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  @HostListener('window:onbeforeunload', ['$event'])
  clearLocalStorage(event: any) {
    localStorage.clear();
  }
}

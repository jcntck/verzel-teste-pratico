import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public hiddenDropdown: boolean = true;
  public hiddenSidebar: boolean = false;

  toggleDropdown() {
    this.hiddenDropdown = !this.hiddenDropdown;
  }

  toggleSidebar() {
    this.hiddenSidebar = !this.hiddenSidebar;
  }
}

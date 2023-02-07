import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { screenSizes } from 'src/app/contants/screenSizes.enum';

@Component({
  selector: 'app-admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class AdminHeaderComponent {
  @Output() toggleSidebarEvent = new EventEmitter<boolean>();

  public innerWidth: any;
  public hiddenSidebar: boolean = true;

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.toggleSidebarBySizeScreen();
  }

  toggleSidebar() {
    this.hiddenSidebar = !this.hiddenSidebar;
    this.toggleSidebarEvent.emit(this.hiddenSidebar);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    this.toggleSidebarBySizeScreen();
  }

  toggleSidebarBySizeScreen() {
    if (this.innerWidth <= screenSizes.lg) this.hiddenSidebar = true;
    else this.hiddenSidebar = false;

    this.toggleSidebarEvent.emit(this.hiddenSidebar);
  }
}

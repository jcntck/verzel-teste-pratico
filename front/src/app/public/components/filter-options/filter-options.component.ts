import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { screenSizes } from 'src/app/contants/screenSizes.enum';

@Component({
  selector: 'app-filter-options',
  templateUrl: './filter-options.component.html',
  styleUrls: ['./filter-options.component.css'],
})
export class FilterOptionsComponent {
  public innerWidth: number = 0;
  public hiddenDropdown: boolean = true;
  public hiddenSidebar: boolean = false;
  public mobileFilterOptions: boolean = false;

  @Output() toggleSidebarEvent = new EventEmitter<boolean>();

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.setMobileConfig();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    this.setMobileConfig();
  }

  isMobileScreen() {
    return this.innerWidth <= screenSizes.lg;
  }

  setMobileConfig() {
    if (this.innerWidth <= screenSizes.lg) {
      this.hiddenSidebar = true;
      this.toggleSidebarEvent.emit(this.hiddenSidebar);
    }
  }

  toggleDropdown() {
    this.hiddenDropdown = !this.hiddenDropdown;
  }

  toggleSidebar() {
    this.hiddenSidebar = !this.hiddenSidebar;
    this.toggleSidebarEvent.emit(this.hiddenSidebar);
  }

  toggleMobileFilterOptions() {
    this.mobileFilterOptions = !this.mobileFilterOptions;
  }
}

import {
  Component,
  EventEmitter,
  HostListener,
  Output,
  Input,
} from '@angular/core';
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

  public selectedSort: string = 'Maior Preço';

  @Input() total: number | undefined = 0;
  @Output() toggleSidebarEvent = new EventEmitter<boolean>();
  @Output() sortDataEvent = new EventEmitter<{ sort: string; order: string }>();

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

  sortByHighestPrice() {
    this.selectedSort = SortTypes.HIGHEST_PRICE;
    this.sortDataEvent.emit({ sort: 'price', order: 'desc' });
    this.toggleDropdown();
  }

  sortByLowestPrice() {
    this.selectedSort = SortTypes.LOWEST_PRICE;
    this.sortDataEvent.emit({ sort: 'price', order: 'asc' });
    this.toggleDropdown();
  }
}

enum SortTypes {
  HIGHEST_PRICE = 'Maior Preço',
  LOWEST_PRICE = 'Menor Preço',
}

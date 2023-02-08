import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Input() totalPages: number | undefined;
  @Input() currentPage: number | undefined;
  @Input() limit: number | undefined;
  @Input() skip: number | undefined;

  @Output() updateDataEvent = new EventEmitter<number>();

  firstPage() {
    this.updateDataEvent.emit(0);
  }

  prevPage() {
    this.skip! -= this.limit!;
    this.updateDataEvent.emit(this.skip);
  }

  nextPage() {
    this.skip! += this.limit!;
    this.updateDataEvent.emit(this.skip);
  }

  lastPage() {
    this.skip! = this.totalPages! * this.limit! - this.limit!;
    this.updateDataEvent.emit(this.skip);
  }

  isFirstPage() {
    return this.currentPage == 1;
  }

  isLastPage() {
    return this.currentPage == this.totalPages;
  }
}

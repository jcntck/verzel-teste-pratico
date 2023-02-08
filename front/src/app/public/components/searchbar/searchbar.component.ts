import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css'],
})
export class SearchbarComponent {
  @Input() placeholder: string | undefined;
  @Input() search: string | undefined;
  @Output() searchResultsEvent = new EventEmitter<string>();

  searchResults(event: any) {
    this.search = event.target.value;
    console.log(this.search);
    this.searchResultsEvent.emit(this.search);
  }
}

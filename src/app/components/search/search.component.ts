import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'product-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  @Output() searchChange = new EventEmitter<string>();
  filter = '';

  onSearchChange() {
    this.searchChange.emit(this.filter.trim());
  }

}

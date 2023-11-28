import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'products-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {

  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  previousPage() {
    this.pageChange.emit(this.currentPage - 1);
  }

  nextPage() {
    this.pageChange.emit(this.currentPage + 1);
  }

}

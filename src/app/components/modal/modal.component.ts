import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  @Input() isDelete: boolean = false;
  @Input() show = false;
  @Input() title: string = '';
  @Input() content: string = '';
  @Output() close = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<string>();

  closeModal() {
    this.close.emit(false);
  }
  
  confirmModal() {

    if (this.isDelete) {
      this.confirm.emit('delete');
    } else {
      this.confirm.emit('confirm');
    }

  }
}

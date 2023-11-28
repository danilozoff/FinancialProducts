import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalComponent]
    });
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when closeModal is called', () => {
    const closeSpy = spyOn(component.close, 'emit');
    
    component.closeModal();
    
    expect(closeSpy).toHaveBeenCalledWith(false);
  });

  it('should emit confirm event with "delete" when confirmModal is called and isDelete is true', () => {
    const confirmSpy = spyOn(component.confirm, 'emit');
    component.isDelete = true;

    component.confirmModal();
    
    expect(confirmSpy).toHaveBeenCalledWith('delete');
  });

  it('should emit confirm event with "confirm" when confirmModal is called and isDelete is false', () => {
    const confirmSpy = spyOn(component.confirm, 'emit');
    component.isDelete = false;

    component.confirmModal();
    
    expect(confirmSpy).toHaveBeenCalledWith('confirm');
  });

});

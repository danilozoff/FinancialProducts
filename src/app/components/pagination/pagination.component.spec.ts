import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginationComponent]
    });
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit pageChange event with decreased page number when previousPage is called', () => {
    const pageChangeSpy = spyOn(component.pageChange, 'emit');
    component.currentPage = 3;

    component.previousPage();
    
    expect(pageChangeSpy).toHaveBeenCalledWith(2);
  });

  it('should emit pageChange event with increased page number when nextPage is called', () => {
    const pageChangeSpy = spyOn(component.pageChange, 'emit');
    component.currentPage = 3;
    component.totalPages = 5;

    component.nextPage();
    
    expect(pageChangeSpy).toHaveBeenCalledWith(4);
  });
  
});

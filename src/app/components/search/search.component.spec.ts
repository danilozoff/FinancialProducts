import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [
        CommonModule,
        FormsModule,
      ]
    });
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit searchChange event with trimmed filter when onSearchChange is called', () => {
    const searchChangeSpy = spyOn(component.searchChange, 'emit');
    component.filter = '   test   ';

    component.onSearchChange();
    
    expect(searchChangeSpy).toHaveBeenCalledWith('test');
  });
});

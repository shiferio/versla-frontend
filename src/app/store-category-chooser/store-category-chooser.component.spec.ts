import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCategoryChooserComponent } from './store-category-chooser.component';

describe('StoreCategoryChooserComponent', () => {
  let component: StoreCategoryChooserComponent;
  let fixture: ComponentFixture<StoreCategoryChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreCategoryChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreCategoryChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

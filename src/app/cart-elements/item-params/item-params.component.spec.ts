import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemParamsComponent } from './item-params.component';

describe('ItemParamsComponent', () => {
  let component: ItemParamsComponent;
  let fixture: ComponentFixture<ItemParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemParamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

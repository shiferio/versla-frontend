import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddGoodComponent } from './modal-add-good.component';

describe('ModalAddGoodComponent', () => {
  let component: ModalAddGoodComponent;
  let fixture: ComponentFixture<ModalAddGoodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddGoodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddGoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUnavailableGoodsComponent } from './modal-unavailable-goods.component';

describe('ModalUnavailableGoodsComponent', () => {
  let component: ModalUnavailableGoodsComponent;
  let fixture: ComponentFixture<ModalUnavailableGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalUnavailableGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUnavailableGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

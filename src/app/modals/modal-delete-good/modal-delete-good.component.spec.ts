import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteGoodComponent } from './modal-delete-good.component';

describe('ModalDeleteGoodComponent', () => {
  let component: ModalDeleteGoodComponent;
  let fixture: ComponentFixture<ModalDeleteGoodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeleteGoodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeleteGoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

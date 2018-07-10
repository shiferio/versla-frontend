import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSendErrorComponent } from './modal-send-error.component';

describe('ModalSendErrorComponent', () => {
  let component: ModalSendErrorComponent;
  let fixture: ComponentFixture<ModalSendErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSendErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSendErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

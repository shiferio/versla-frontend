import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddParameterComponent } from './modal-add-parameter.component';

describe('ModalAddParameterComponent', () => {
  let component: ModalAddParameterComponent;
  let fixture: ComponentFixture<ModalAddParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

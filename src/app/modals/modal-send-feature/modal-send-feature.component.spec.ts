import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSendFeatureComponent } from './modal-send-feature.component';

describe('ModalSendFeatureComponent', () => {
  let component: ModalSendFeatureComponent;
  let fixture: ComponentFixture<ModalSendFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSendFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSendFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

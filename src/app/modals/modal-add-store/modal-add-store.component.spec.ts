import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalAddStoreComponent} from './modal-add-store.component';

describe('ModalAddStoreComponent', () => {
  let component: ModalAddStoreComponent;
  let fixture: ComponentFixture<ModalAddStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAddStoreComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

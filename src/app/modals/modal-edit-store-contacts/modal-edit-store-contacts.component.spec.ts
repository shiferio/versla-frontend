import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditStoreContactsComponent } from './modal-edit-store-contacts.component';

describe('ModalEditStoreContactsComponent', () => {
  let component: ModalEditStoreContactsComponent;
  let fixture: ComponentFixture<ModalEditStoreContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditStoreContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditStoreContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

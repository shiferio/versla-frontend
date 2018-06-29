import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditStoreCredentialsComponent } from './modal-edit-store-credentials.component';

describe('ModalEditStoreCredentialsComponent', () => {
  let component: ModalEditStoreCredentialsComponent;
  let fixture: ComponentFixture<ModalEditStoreCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditStoreCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditStoreCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

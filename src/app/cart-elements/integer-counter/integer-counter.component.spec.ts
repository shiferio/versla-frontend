import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegerCounterComponent } from './integer-counter.component';

describe('IntegerCounterComponent', () => {
  let component: IntegerCounterComponent;
  let fixture: ComponentFixture<IntegerCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegerCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegerCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

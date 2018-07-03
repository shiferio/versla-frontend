import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityChooserComponent } from './city-chooser.component';

describe('CityChooserComponent', () => {
  let component: CityChooserComponent;
  let fixture: ComponentFixture<CityChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterEmployeeComponent } from './footer-employee.component';

describe('FooterEmployeeComponent', () => {
  let component: FooterEmployeeComponent;
  let fixture: ComponentFixture<FooterEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

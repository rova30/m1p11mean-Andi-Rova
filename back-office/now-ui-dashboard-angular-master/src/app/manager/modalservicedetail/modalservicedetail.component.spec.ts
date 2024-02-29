import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Modalservicedetail } from './modalservicedetail.component';

describe('Modalservicedetail', () => {
  let component: Modalservicedetail;
  let fixture: ComponentFixture<Modalservicedetail>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Modalservicedetail ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Modalservicedetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

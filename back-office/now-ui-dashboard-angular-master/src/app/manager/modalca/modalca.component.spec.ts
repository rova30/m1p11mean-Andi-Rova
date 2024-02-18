import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalcaComponent } from './modalca.component';

describe('ModalcaComponent', () => {
  let component: ModalcaComponent;
  let fixture: ComponentFixture<ModalcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalrdvComponent } from './modalrdv.component';

describe('ModalrdvComponent', () => {
  let component: ModalrdvComponent;
  let fixture: ComponentFixture<ModalrdvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalrdvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalrdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

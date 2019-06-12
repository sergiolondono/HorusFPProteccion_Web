import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColasTrabajoComponent } from './colas-trabajo.component';

describe('ColasTrabajoComponent', () => {
  let component: ColasTrabajoComponent;
  let fixture: ComponentFixture<ColasTrabajoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColasTrabajoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColasTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

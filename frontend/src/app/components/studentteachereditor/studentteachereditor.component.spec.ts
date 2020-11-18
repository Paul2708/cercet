import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentteachereditorComponent } from './studentteachereditor.component';

describe('StudentteachereditorComponent', () => {
  let component: StudentteachereditorComponent;
  let fixture: ComponentFixture<StudentteachereditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentteachereditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentteachereditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

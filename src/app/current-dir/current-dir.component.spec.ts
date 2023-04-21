import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentDirComponent } from './current-dir.component';

describe('CurrentDirComponent', () => {
  let component: CurrentDirComponent;
  let fixture: ComponentFixture<CurrentDirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentDirComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentDirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

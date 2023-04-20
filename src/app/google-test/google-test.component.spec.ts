import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleTestComponent } from './google-test.component';

describe('GoogleTestComponent', () => {
  let component: GoogleTestComponent;
  let fixture: ComponentFixture<GoogleTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

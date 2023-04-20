import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaybackQueueComponent } from './playback-queue.component';

describe('PlaybackQueueComponent', () => {
  let component: PlaybackQueueComponent;
  let fixture: ComponentFixture<PlaybackQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaybackQueueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaybackQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

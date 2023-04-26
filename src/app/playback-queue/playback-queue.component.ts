import { Component, OnInit } from '@angular/core';
import { TrackServerService } from '../track-server.service';
import { Track } from '../track-server.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-playback-queue',
  templateUrl: './playback-queue.component.html',
  styleUrls: ['./playback-queue.component.css']
})
export class PlaybackQueueComponent implements OnInit {
  constructor(public trackService: TrackServerService) { }

  playbackQueue: Track[] = [];

  // TODO: IMPLEMENT SELECTING A TRACK FROM THE QUEUE
  selectTrack(track: Track): void {
    this.trackService.currentTrack = track;
    this.trackService.trackAlert.emit();
  }

  removeTrack(id: string): void {
    const tbdIndex = this.trackService.playbackQueue.findIndex(
      (element) => element.id === id
    );
    this.trackService.playbackQueue.splice(tbdIndex, 1);
    this.trackService.queueAlert.emit();
  }

  dropIntoPlaybackQueue(event: any) {
    if (event.previousContainer !== event.container) {
      if (this.trackService.currentDirContents[event.previousIndex]
        .mimeType.slice(0, 5) === 'audio') {
        this.trackService.playbackQueue.splice(event.currentIndex,
          0, this.trackService.currentDirContents[event.previousIndex]);
        this.trackService.queueAlert.emit();
      }
    } else {
      const a = event.previousIndex;
      const b = event.currentIndex;
      const queue = this.trackService.playbackQueue;
      [queue[a], queue[b]] = [queue[b], queue[a]];
      this.trackService.queueAlert.emit();
    }
  }

  clearQueue(event: Event) {
    this.trackService.playbackQueue = [];
    this.trackService.queueAlert.emit();
  }

  ngOnInit(): void {
    this.trackService.queueAlert.subscribe((event) => {
      this.playbackQueue = this.trackService.playbackQueue;
    })
  }
}


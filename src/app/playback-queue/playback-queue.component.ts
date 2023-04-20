import { Component, OnInit } from '@angular/core';
import { TrackServerService } from '../track-server.service';

@Component({
  selector: 'app-playback-queue',
  templateUrl: './playback-queue.component.html',
  styleUrls: ['./playback-queue.component.css']
})
export class PlaybackQueueComponent implements OnInit {
  constructor(public trackService: TrackServerService) {};

  playbackQueue: string[] = [];

  ngOnInit(): void {
    // TODO: BORROWS FROM THE COLLECTION ON FIRST PLAY, REFACTOR LATER
    this.trackService.queueAlert.subscribe((event) => {
      if (this.playbackQueue.length === 0) {
        this.playbackQueue = this.trackService.playbackQueue;
        console.log(this.playbackQueue);
      }
    })
  }
}

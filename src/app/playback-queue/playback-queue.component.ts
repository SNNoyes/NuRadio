import { Component, OnInit } from '@angular/core';
import { TrackServerService } from '../track-server.service';
import { Track } from '../track-server.service';

@Component({
  selector: 'app-playback-queue',
  templateUrl: './playback-queue.component.html',
  styleUrls: ['./playback-queue.component.css']
})
export class PlaybackQueueComponent implements OnInit {
  constructor(public trackService: TrackServerService) { };

  playbackQueue: Track[] = [];

  // selectTrack(fileName: string): void {
  //   this.trackService.nowPlaying = fileName;
  //   this.trackService.trackAlert.emit();
  // }

  ngOnInit(): void {
    this.trackService.queueAlert.subscribe((event) => {
      this.playbackQueue = this.trackService.playbackQueue;
    })
  }
}


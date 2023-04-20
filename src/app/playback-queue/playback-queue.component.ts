import { Component, OnInit } from '@angular/core';
import { TrackServerService } from '../track-server.service';

@Component({
  selector: 'app-playback-queue',
  templateUrl: './playback-queue.component.html',
  styleUrls: ['./playback-queue.component.css']
})
export class PlaybackQueueComponent implements OnInit {
  constructor(private trackService: TrackServerService) {};

  ngOnInit(): void {
  
  }
}

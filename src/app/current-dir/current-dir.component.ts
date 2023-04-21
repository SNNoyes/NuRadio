import { Component, OnInit } from '@angular/core';
import { TrackServerService } from '../track-server.service';
import { Track } from '../track-server.service';

@Component({
  selector: 'app-current-dir',
  templateUrl: './current-dir.component.html',
  styleUrls: ['./current-dir.component.css']
})
export class CurrentDirComponent implements OnInit {
  constructor(private trackService: TrackServerService) {};

  currentDir: Track[] = [];

  addToQueue(track: Track): void {
    this.trackService.playbackQueue.push(track);
    console.log(this.trackService.playbackQueue);
    this.trackService.queueAlert.emit();
  };

  // CHILDREN ARE CONTENTS OF A FOLDER IN GOOGLE DRIVE
  // BY DEFAULT THEY HAVE NO FILENAME WHICH HAS TO BE REQUESTED SEPARATELY
  processChildren(children: []): void {
    children.forEach((child) => {
      this.trackService.getTrackObjects(child["id"]);
    })
    this.currentDir = this.trackService.currentDir;
  }

  ngOnInit(): void {
    this.trackService.getDirectory()
      .subscribe((response) => {
        console.log(response);
        this.processChildren(response.items);
      });
  };
}

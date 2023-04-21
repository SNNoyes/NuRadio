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

  selectTrack(fileName: string): void {
    // this.trackService.nowPlaying = fileName;
    // // SET QUEUE TO MATCH THE COLLECTION, TO BE REFACTORED LATER
    // if (this.trackService.playbackQueue.length === 0) {
    //   // this.trackService.playbackQueue = this.collection;
    // }
    // this.trackService.trackAlert.emit();
    // this.trackService.queueAlert.emit();
  }

  refreshCollection(): void {
    // this.trackService.getCollection()
    // .subscribe((response) => {
    //   console.log(response);
    //   this.collection = response;
    // })
  }

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

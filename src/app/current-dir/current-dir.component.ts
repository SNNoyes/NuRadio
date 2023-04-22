import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TrackServerService } from '../track-server.service';
import { Track } from '../track-server.service';

@Component({
  selector: 'app-current-dir',
  templateUrl: './current-dir.component.html',
  styleUrls: ['./current-dir.component.css']
})
export class CurrentDirComponent implements OnInit {
  constructor(public trackService: TrackServerService) { }
  @ViewChild("rootDir") rootDirForm!: ElementRef;

  // TODO: REFACTOR AS currentDir IS ALSO ALLOWED TO DISPLAY FOLDERS 
  // SO Track TYPE IS NOT ENTIRELY CORRECT
  currentDir: Track[] = [];

  addToQueue(track: Track): void {
    this.trackService.playbackQueue.push(track);
    console.log(this.trackService.playbackQueue);
    this.trackService.queueAlert.emit();
  }

  // CHILDREN ARE CONTENTS OF A FOLDER IN GOOGLE DRIVE
  // BY DEFAULT THEY HAVE NO FILENAME WHICH HAS TO BE REQUESTED SEPARATELY
  processChildren(children: []): void {
    children.forEach((child) => {
      this.trackService.getTrackObjects(child["id"]);
    })
    this.currentDir = this.trackService.currentDir;
  }

  handleSubmit(): void {
    this.trackService.findDirectoryId(this.rootDirForm.nativeElement.value)
      .subscribe((response) => {
        this.rootDirForm.nativeElement.disabled = true;
        console.log(response.files[0].id);
        const dirId = response.files[0].id;
        this.trackService.dirId = dirId;
        this.trackService.getDirectory()
          .subscribe((response) => {
            this.processChildren(response.items);
          })
      })
  }

  ngOnInit(): void {
    // MVP CODE FOR CUSTOM SERVER
    // this.trackService.getDirectory()
    //   .subscribe((response) => {
    //     console.log(response);
    //     this.processChildren(response.items);
    //   });
  }
}

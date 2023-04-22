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
  currentDirContents: Track[] = [];

  addToQueue(track: Track): void {
    if (track.mimeType.slice(0, 5) === "audio") {
      this.trackService.playbackQueue.push(track);
      this.trackService.queueAlert.emit();
    }
  }

  // IT IS ACTUALLY A DIRECTORY, NOT A TRACK BUT IT HAS THE id I NEED
  goToDir(file: Track | null, direction: string): void {
    if (file !== null && direction === "down") {
      this.trackService.previousDirIds.push(this.trackService.dirId);
      this.trackService.dirId = file.id;
      this.trackService.getDirectoryContents(file.id)
        .subscribe((response) => {
            this.processChildren(response.items);
        });
    } else if (direction === "up") {
      const prev = this.trackService.previousDirIds.pop() as string;
      this.trackService.dirId = prev;
      this.trackService.getDirectoryContents(prev)
        .subscribe((response) => {
          this.processChildren(response.items);
        })
    }
  }

  // CHILDREN ARE CONTENTS OF A FOLDER IN GOOGLE DRIVE
  // BY DEFAULT THEY HAVE NO FILENAME WHICH HAS TO BE REQUESTED SEPARATELY
  processChildren(children: []): void {
    if (children.length === 0) {
      this.trackService.currentDirContents = [];
      this.currentDirContents = this.trackService.currentDirContents;
    }
    const process = async (): Promise<void> => {
      return children.forEach((child) => {
        this.trackService.getTrackObjects(child["id"]);
      })
    }
    process();
    this.currentDirContents = this.trackService.currentDirContents;
  }

  handleSubmit(): void {
    this.trackService.findDirectoryId(this.rootDirForm.nativeElement.value)
      .subscribe((response) => {
        this.rootDirForm.nativeElement.disabled = true;
        console.log(response.files[0].id);
        const rootDirId = response.files[0].id;
        this.trackService.rootDirId = rootDirId;
        this.trackService.dirId = rootDirId;
        this.trackService.getDirectoryContents(rootDirId)
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

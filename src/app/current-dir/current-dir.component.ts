import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TrackServerService } from '../track-server.service';
import { Track } from '../track-server.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { GauthService } from '../gauth.service';

@Component({
  selector: 'app-current-dir',
  templateUrl: './current-dir.component.html',
  styleUrls: ['./current-dir.component.css'],
  animations: [

  ]
})
export class CurrentDirComponent implements OnInit {
  constructor(public trackService: TrackServerService,
    public gauth: GauthService) { }
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
  async goToDir(file: Track | null, direction: string): Promise<void> {
    this.currentDirContents = [];
    if (file !== null && direction === "down") {
      this.trackService.previousDirIds.push(this.trackService.dirId);
      this.trackService.currentDirContents = await this.gauth.getChildren(file.id) as Track[];
      this.trackService.dirId = file.id;
      this.trackService.dirAlert.emit();
    } else if (direction === "up") {
      const prev = this.trackService.previousDirIds.pop() as string;
      this.trackService.dirId = prev;
      this.trackService.currentDirContents = await this.gauth.getChildren(prev) as Track[];
      this.trackService.dirAlert.emit();
    }
  }

  checkForAudioFiles(): boolean {
    return this.currentDirContents.find(element => element.mimeType.slice(0, 5) === 'audio') ? true : false;
  }

  addDirectoryToQueue(event: Event) {
    const toAdd = this.currentDirContents.filter(element => element.mimeType.slice(0, 5) === 'audio');
    this.trackService.playbackQueue.push(...toAdd);
    this.trackService.queueAlert.emit();
  }

  async handleSubmit(): Promise<void> {
    const input = this.rootDirForm.nativeElement;
      try {
        const root = await this.gauth.searchFile(input.value)
        input.value = ` /${input.value}`;
        input.disabled = true;
        console.log(root);
        this.trackService.rootDirId = root.id;
        this.trackService.dirId = root.id;
        const children = await this.gauth.getChildren(root.id);
        console.log(children);
        this.trackService.currentDirContents = children as Track[];
        this.trackService.dirAlert.emit();
      } catch (error) {
        console.log(error);
        window.alert('Directory not found on Google Drive or you need to re-login');
        input.value = "";
        input.disabled = false;
      }
    }

  ngOnInit(): void {
    this.trackService.dirAlert.subscribe((event) => {
      this.currentDirContents = this.trackService.currentDirContents;
    })
  }
}

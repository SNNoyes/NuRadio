import { Injectable, EventEmitter } from '@angular/core';

export interface Track {
  title: string;
  id: string;
  mimeType: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrackServerService {
  currentDirContents: Track[] = [];
  playbackQueue: Track[] = [];
  currentTrack: Track = {} as Track;
  rootDirId = "";
  previousDirIds: string[] = [];
  dirId = "";
  
  // THIS TRACK SERVICE 
  // KEEPS TRACK OF CURRENT DIRECTORY CONTENTS, TRAVERSED PATH THROUGH THE LIBRARY, AND
  // PLAYBACK QUEUE,
  // LINKS THE CURRENT DIRECTORY AND THE QUEUE COMPONENTS FOR USER TO FORM THE QUEUE

  trackAlert = new EventEmitter();
  queueAlert = new EventEmitter();
  dirAlert = new EventEmitter();
}

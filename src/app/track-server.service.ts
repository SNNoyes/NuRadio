import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Directory {
  items: [];
}

export interface Track {
  title: string;
  id: string;
  mimeType: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrackServerService {
  constructor(private http: HttpClient) { }

  currentDir: Track[] = [];
  playbackQueue: Track[] = [];
  currentTrack: Track = {} as Track;
  accessToken: string = "";
  // HARDCODED MY FOLDER (Music), TODO: ASK USER FOR IT
  dirId: string = "1KLwXkfJOddZP6QtDbtwTubVF_OuC0n0W";
  
  findDirectoryId(name: string): Observable<Directory | any> {
    return this.http.get(`https://www.googleapis.com/drive/v3/files?q=name='${name}'+and+mimeType='application/vnd.google-apps.folder'`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json"
      }})
  };

  // MVP CODE FOR CUSTOM SERVER
  // testUrl: string = "http://localhost:3456";

  baseUrl: string = "https://www.googleapis.com/drive/v2/files";

  trackAlert = new EventEmitter();
  queueAlert = new EventEmitter();

  // TODO: INTRODUCE A TYPE
  getDirectory(): Observable<Directory | any> {
    return this.http.get(`${this.baseUrl}/${this.dirId}/children`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json"
      }
    });
  };

  getTrackObjects(fileId: string): void {
    this.http.get(`${this.baseUrl}/${fileId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json"
      }
    })
      .subscribe((response) => {
        let track = response as Track;
        // TO FILTER OUT OTHER NON-AUDIO FILES, BUT KEEP FOLDERS
        if (track.mimeType.slice(0, 5) === "audio" || track.mimeType === "application/vnd.google-apps.folder") {
          this.currentDir.push(track as Track)
        }
      });
  };

  // MVP CODE FOR CUSTOM SERVER
  // getCollection(): Observable<string[]> {
  //   return this.http.get<string[]>(this.testUrl + "/tracks", {
  //     headers: {
  //       "content-type": "application/json"
  //     }
  //   });
  // }
}

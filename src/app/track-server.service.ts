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

  // IT MAY BE REASONABLE TO MAKE A STRUCTURE FOR NAVIGATION, MB LATER
  currentDirContents: Track[] = [];
  playbackQueue: Track[] = [];
  currentTrack: Track = {} as Track;
  accessToken = "";
  rootDirId = "";
  previousDirIds: string[] = [];
  dirId = "";
  
  findDirectoryId(name: string): Observable<Directory | any> {
    return this.http.get(`https://www.googleapis.com/drive/v3/files?q=name='${name}'+and+mimeType='application/vnd.google-apps.folder'`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json"
      }})
  }

  // MVP CODE FOR CUSTOM SERVER
  // testUrl: string = "http://localhost:3456";

  baseUrl = "https://www.googleapis.com/drive/v2/files";

  trackAlert = new EventEmitter();
  queueAlert = new EventEmitter();

  // TODO: INTRODUCE A TYPE
  getDirectoryContents(id: string): Observable<Directory | any> {
    return this.http.get(`${this.baseUrl}/${id}/children`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json"
      }
    });
  }

  getTrackObjects(fileId: string): void {
    this.currentDirContents = [];
    this.http.get(`${this.baseUrl}/${fileId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json"
      }
    })
      .subscribe((response) => {
        const track = response as Track;
        // TO FILTER OUT OTHER NON-AUDIO FILES, BUT KEEP FOLDERS
        if (track.mimeType.slice(0, 5) === "audio" || track.mimeType === "application/vnd.google-apps.folder") {
          this.currentDirContents.push(track as Track)
        }
      });
  }

  // MVP CODE FOR CUSTOM SERVER
  // getCollection(): Observable<string[]> {
  //   return this.http.get<string[]>(this.testUrl + "/tracks", {
  //     headers: {
  //       "content-type": "application/json"
  //     }
  //   });
  // }
}

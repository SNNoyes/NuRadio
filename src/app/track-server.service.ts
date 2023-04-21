import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Track {
  title: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrackServerService {
  constructor(private http: HttpClient) { }

  nowPlaying: string = "";
  currentDir: Track[] = [];
  playbackQueue: Track[] = [];
  accessToken: string = "";
  // HARDCODED MY FOLDER (Music), TODO: ASK USER FOR IT
  rootFolderId: string = "1KLwXkfJOddZP6QtDbtwTubVF_OuC0n0W";

  // MVP CODE FOR CUSTOM SERVER
  // testUrl: string = "http://localhost:3456";

  baseUrl: string = "https://www.googleapis.com/drive/v2/files";

  trackAlert = new EventEmitter();
  queueAlert = new EventEmitter();

  // TODO: INTRODUCE A TYPE
  getDirectory(): Observable<any> {
    return this.http.get(`${this.baseUrl}/${this.rootFolderId}/children`, {
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
        this.currentDir.push(response as Track)
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

import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, elementAt } from 'rxjs';
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { coerceStringArray } from '@angular/cdk/coercion';

export interface Directory {
  items: [];
}

export interface Track {
  title: string;
  id: string;
  mimeType: string;
  name: string;
  webContentLink: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrackServerService {
  constructor(private http: HttpClient, private authService: SocialAuthService) { }

  currentDirContents: Track[] = [];
  playbackQueue: Track[] = [];
  currentTrack: Track = {} as Track;
  accessToken = "";
  rootDirId = "";
  previousDirIds: string[] = [];
  dirId = "";
  counter = 0;
  
  // THIS TRACK SERVICE 
  // FETCHES CONTENTS OF DIRECTORIES AND INDIVIDUAL FILE OBJECTS,
  // KEEPS TRACK OF CURRENT DIRECTORY CONTENTS, TRAVERSED PATH THROUGH THE LIBRARY, AND
  // PLAYBACK QUEUE,
  // LINKS THE CURRENT DIRECTORY AND THE QUEUE COMPONENTS FOR USER TO FORM THE QUEUE

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
  dirAlert = new EventEmitter();

  getDirectoryContents(id: string): Observable<Directory | any> {
    return this.http.get(`${this.baseUrl}/${id}/children?maxResults=1000`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json"
      }
    });
  }

  getTrackObject(fileId: string, itemsToProcess: number): void {
    this.http.get(`${this.baseUrl}/${fileId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json"
      }
    })
      .subscribe((response) => {
        this.counter++;
        const track = response as Track;
        // TO FILTER OUT OTHER NON-AUDIO FILES, BUT KEEP FOLDERS
        if (track.mimeType.slice(0, 5) === "audio") {
          this.currentDirContents.push(track as Track)
        } else if (track.mimeType === "application/vnd.google-apps.folder") {
          this.currentDirContents.splice(0, 0, track as Track);
        }
        // A SOLUTION TO THE SORTING PROBLEM - TRIGGER SORT ON LAST
        // SUBSCRIPTION VIA A TRACKING VARIABLE
        if (this.counter === itemsToProcess) {
          this.counter = 0; 
          this.sortCurrentDir();
        }
      });
    }

  sortCurrentDir(): void {
    const dirs = this.currentDirContents.filter(element => element.mimeType === "application/vnd.google-apps.folder");
    const tracks = this.currentDirContents.filter(element => element.mimeType.slice(0, 5) === "audio");
    function compare (a: Track, b: Track): number {
      if (a.title < b.title) {
        return -1
      } else if (a.title > b.title) {
        return 1;
      } else {
        return 0;
      }
    }
    dirs.sort(compare);
    tracks.sort(compare);
    this.currentDirContents = dirs.concat(tracks);
    this.dirAlert.emit();
  }

  // refreshToken1(): void {
  //   this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  // }

  // refreshToken2(): void {
  //   this.authService.refreshAccessToken(GoogleLoginProvider.PROVIDER_ID);
  //   // localStorage.setItem()
  // }

  // MVP CODE FOR CUSTOM SERVER
  // getCollection(): Observable<string[]> {
  //   return this.http.get<string[]>(this.testUrl + "/tracks", {
  //     headers: {
  //       "content-type": "application/json"
  //     }
  //   });
  // }
}

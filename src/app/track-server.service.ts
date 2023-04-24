import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";

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
  constructor(private http: HttpClient, private authService: SocialAuthService) { }

  currentDirContents: Track[] = [];
  playbackQueue: Track[] = [];
  currentTrack: Track = {} as Track;
  accessToken = "";
  rootDirId = "";
  previousDirIds: string[] = [];
  dirId = "";
  
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

  getDirectoryContents(id: string): Observable<Directory | any> {
    return this.http.get(`${this.baseUrl}/${id}/children?maxResults=1000`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json"
      }
    });
  }

  getTrackObject(fileId: string): void {
    this.http.get(`${this.baseUrl}/${fileId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json"
      }
    })
      .subscribe((response) => {
        const track = response as Track;
        // TO FILTER OUT OTHER NON-AUDIO FILES, BUT KEEP FOLDERS
        if (track.mimeType.slice(0, 5) === "audio") {
          this.currentDirContents.push(track as Track)
        } else if (track.mimeType === "application/vnd.google-apps.folder") {
          this.currentDirContents.splice(0, 0, track as Track);
        }
      });
  }

  refreshToken1(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  refreshToken2(): void {
    this.authService.refreshAccessToken(GoogleLoginProvider.PROVIDER_ID);
    // localStorage.setItem()
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

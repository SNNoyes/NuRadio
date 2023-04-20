import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackServerService {
  constructor(private http: HttpClient) { }

  nowPlaying: string = "";

  testUrl: string = "http://localhost:3456";

  trackAlert = new EventEmitter();

  getCollection(): Observable<string[]> {
    return this.http.get<string[]>(this.testUrl + "/tracks", {
      headers: {
        "content-type": "application/json"
      }
    });
  }

}

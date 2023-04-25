import { Injectable } from '@angular/core';
import { file } from 'googleapis/build/src/apis/file';
import { CLIENT_ID, API_KEY, SCOPES, DISCOVERY_DOC } from 'src/env';
import { Track } from './track-server.service';

declare const google: any;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GauthService {
  constructor(

  ) { 
    this.createScript1();
    this.createScript2();
  }

  tokenClient: any;
  gapiInited = false;
  gisInited = false;

  gapiLoaded() {
    gapi.load('client', this.initializeGapiClient);
  }

  async initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC]
    });
    this.gapiInited = true;
  }

  gisLoaded() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
    this.gisInited = true;
  }

  async handleAuthClick() {
    this.tokenClient.callback = async (resp: any) => {
      if (resp.error !== undefined) {
        throw (resp);
      }
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      this.tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      this.tokenClient.requestAccessToken({prompt: ''});
    }
  }

  handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
    }
  }

  async listFiles() {
    let response;
    try {
      response = await gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': 'files(id, name)',
      });
    } catch (err) {
      console.log(err);
      return;
    }
    const files = response.result.files;
    if (!files || files.length == 0) {
      console.log('No files found');
      return;
    }
    // Flatten to string to display
    const output = files.reduce(
        (str: any, file: any) => `${str}${file.name} (${file.id})\n`,
        'Files:\n');
    console.log(output);
  }

  async searchFile(name: string) {
    let response;
    try {
      response = await gapi.client.drive.files.list({
        'q': `name='${name}'`,
        'fields': 'files(id, name)',
        'spaces': 'drive'
      })
    } catch (err) {
      console.log(err);
      return;
    }
    const files = response.result.files;
    if (!files || files.length == 0) {
      console.log('No files found');
      return;
    } else {
      return response.result.files[0];
    }
  }

  async getChildren(id: string) {
    let response;
    try {
      response = await gapi.client.drive.files.list({
        'q': `'${id}' in parents`,
        'fields': 'files(id, name, mimeType)',
        'spaces': 'drive',
        'pageSize': '500'
      })
    } catch (err) {
      console.log(err);
      return;
    }
    const files = response.result.files;
    if (!files || files.length == 0) {
      console.log('No files found');
      return;
    } else {
      return this.filterAndSortCurrentDir(files);
    }
  }

  filterAndSortCurrentDir(children: Track[]): Track[] {
    const dirs = children.filter(element => element.mimeType === "application/vnd.google-apps.folder");
    const tracks = children.filter(element => element.mimeType.slice(0, 5) === "audio");
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
    return dirs.concat(tracks);
  }

  async getFile(id: string) {
    let response;
    try {
      response = await gapi.client.drive.files.get({
        'fileId': `${id}`,
        'alt': 'media'
      })
      return response;
    } catch (err) {
      console.log(err);
      return;
    }
  }

  // TO KEEP BLOB LOGIC ON THE PLAYER USED FETCH INSTEAD OF API LIBRARY REQUEST
  async getFileFetchAPI(id: string) {
    try {
      const token = this.getToken();
      return fetch(
        `https://content.googleapis.com/drive/v3/files/${id}?alt=media&key=${API_KEY}`
      , {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "audio/*"
        }
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }

  getToken() {
    const token = gapi.client.getToken();
    return token.access_token;
  }
  
  createScript1(): void {
    const script1 = window.document.createElement('script');
    script1.type = 'text/javascript';
    script1.src = 'https://apis.google.com/js/api.js';
    script1.async = true;
    script1.defer = true;
    script1.onload = ((event: Event) => {
      this.gapiLoaded();
    })
    window.document.head.appendChild(script1);
  }
  
  createScript2(): void {
    const script2 = window.document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = 'https://accounts.google.com/gsi/client';
    script2.async = true;
    script2.defer = true;
    script2.onload = ((event: Event) => {
      this.gisLoaded();
    })
    window.document.head.appendChild(script2);
  }

}

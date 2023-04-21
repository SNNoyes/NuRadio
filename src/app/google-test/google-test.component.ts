import { Component, OnInit } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, GoogleSigninButtonDirective } from '@abacritt/angularx-social-login';
import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { CLIENT_ID, API_KEY } from 'src/env';

// declare var gapi: any;

interface Children {
  items: []
}

interface Track {
  title: string;
  fileExtension: string;
  webContentLink: string;
}

@Component({
  selector: 'app-google-test',
  templateUrl: './google-test.component.html',
  styleUrls: ['./google-test.component.css'],
})
export class GoogleTestComponent implements OnInit {
  constructor(private authService: SocialAuthService, private http: HttpClient) { }

  user: SocialUser = new SocialUser;
  // THIS OBJECT CONTAINS auth_token NECESSARY TO MAKE API CALLS
  loggedIn: boolean = false;

  private accessToken = '';

  baseUrl: string = "https://www.googleapis.com/drive/v2/files";

  children: Children = {} as Children;



  renderList(): void {
    for (let child of this.children.items) {
      this.http.get(this.baseUrl + "/" + child["id"], {
        headers: {
          "Authorization": "Bearer " + this.accessToken,
          "Content-Type": "application/json"
        }
      })
        .subscribe((response) => {
          let track: Track = response as Track;
          console.log(track.title);
        });
    }
  }

  getAccessToken(): void {
    this.authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID)
      .then((accessToken) => {
        this.accessToken = accessToken;
        console.log(this.accessToken);
      });
  }

  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  getFiles(): void {
    // this.http.get("https://www.googleapis.com/drive/v3/files/1RLtqlDQx-_RSZDhqzKKoJn0Df-J9KDeh", { // TO GET ONE FILE SUPPLY FILE ID
    // this.http.get("https://www.googleapis.com/drive/v3/files", {
    // this.http.get("https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.folder'", {
    // this.http.get("https://www.googleapis.com/drive/v3/files?q=name='Music'+and+mimeType='application/vnd.google-apps.folder'", {
    // this.http.get("https://www.googleapis.com/drive/v3/files/1KLwXkfJOddZP6QtDbtwTubVF_OuC0n0W/children", {
    this.http.get("https://www.googleapis.com/drive/v2/files/1KLwXkfJOddZP6QtDbtwTubVF_OuC0n0W/children", {
      // this.http.get("https://www.googleapis.com/drive/v3/files", {
      // FOLDER ID "1KLwXkfJOddZP6QtDbtwTubVF_OuC0n0W"
      headers: {
        "Authorization": "Bearer " + this.accessToken,
        "Content-Type": "application/json"
      }
    })
      .subscribe((response) => {
        this.children = response as Children;
        console.log(this.children.items);
      });
  };

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user !== null);
      console.log(this.user);
      console.log(this.loggedIn);
    });

    // gapi.load('client:auth2', () => {
    //   gapi.client.init({
    //     apiKey: API_KEY,
    //     clientId: CLIENT_ID,
    //     discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    //     scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata'
    //   }).then(() => {
    //     console.log('API client loaded and signed in');
    //   });
    // });
  }
}

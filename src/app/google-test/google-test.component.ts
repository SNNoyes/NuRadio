import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  id: string;
  webContentLink: string;
  downloadUrl: string;
}

@Component({
  selector: 'app-google-test',
  templateUrl: './google-test.component.html',
  styleUrls: ['./google-test.component.css'],
})
export class GoogleTestComponent implements OnInit {
  constructor(private authService: SocialAuthService, private http: HttpClient) { }

  @ViewChild("audio") audioElement!: ElementRef;
  @ViewChild("source") sourceElement!: ElementRef;

  // THIS OBJECT CONTAINS auth_token NECESSARY TO GET ACCESS TOKEN
  user: SocialUser = new SocialUser;
  loggedIn: boolean = false;

  private accessToken = '';

  baseUrl: string = "https://www.googleapis.com/drive/v2/files";

  children: Children = {} as Children;

  tracks: Track[] = [];

  renderList(): void {
    for (let child of this.children.items) {
      this.http.get(this.baseUrl + "/" + child["id"], {
        headers: {
          "Authorization": "Bearer " + this.accessToken,
          "Content-Type": "application/json"
        }
      })
        .subscribe((response) => {
          console.log(response);
          let track: Track = response as Track;
          this.tracks.push(track);
        });
    }
  }

  // setTrack(): void {
  //   // this.audioElement.nativeElement.src = this.baseUrl + "/" +
  //   //   this.tracks[this.tracks.length - 1].id + "?alt=media" + "&key=" + API_KEY;
  //   //   console.log(this.audioElement.nativeElement.src);
  //   this.http.get(this.baseUrl + '/' + this.tracks[this.tracks.length - 1].id + "?alt=media", {
  //     headers: {
  //       "Authorization": "Bearer " + this.accessToken,
  //     }})
  //     .subscribe((response) => {
  //       console.log(response);
  //     })
  // }


  // https://security.stackexchange.com/questions/175695/how-to-pass-authorization-header-in-http-request-when-using-html5-player-audio
  
  async fetchTrack(): Promise<void> {
    const audioSource = this.sourceElement.nativeElement;

    const result = await fetch("https://www.googleapis.com/drive/v2/files/1TK_s6FdynzTYuoq5GMdoVRMZz_P-5Y_i?alt=media", {
      headers: {
        "Authorization": "Bearer " + this.accessToken,
      }
    });

    const blob = await result.blob();

    if (blob) {
      audioSource.src = URL.createObjectURL(blob);
      audioSource.parentElement.load();
      console.log(audioSource.src);
    } else {
      console.log("Fail");
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
    // this.http.get("https://www.googleapis.com/drive/v2/files/1TK_s6FdynzTYuoq5GMdoVRMZz_P-5Y_i", { // TO GET ONE FILE SUPPLY FILE ID
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

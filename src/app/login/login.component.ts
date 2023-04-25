import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, GoogleSigninButtonDirective } from '@abacritt/angularx-social-login';
import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { TrackServerService } from '../track-server.service';
// import { CLIENT_ID, API_KEY, SCOPES, DISCOVERY_DOC } from 'src/env';
import { GauthService } from '../gauth.service';

// // GOOGLE-BASED CODE
// declare const google: any;
// declare const gapi: any;
// // GOOGLE-BASED CODE

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router,
    private authService: SocialAuthService,
    private http: HttpClient,
    private trackService: TrackServerService,
    private renderer: Renderer2,
    public gauth: GauthService) { }

  user: SocialUser = new SocialUser;
  loggedIn = false;

  goToDashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }

  // TODO: NO REFRESHING THE TOKEN FOR NOW, APP EXPIRES AT SOME POINT
  getAccessToken(): void {
    this.authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID)
      .then((accessToken) => {
        localStorage.setItem("accessToken", accessToken);
      });
  }

  // // GOOGLE-BASED CODE
  // tokenClient: any;
  // gapiInited = false;
  // gisInited = false;

  // gapiLoaded() {
  //   gapi.load('client', this.initializeGapiClient);
  // }

  // async initializeGapiClient() {
  //   await gapi.client.init({
  //     apiKey: API_KEY,
  //     // discoveryDocs: [this.DISCOVERY_DOC],
  //     discoveryDocs: [DISCOVERY_DOC]
  //   });
  //   this.gapiInited = true;
  //   // I DO NOT IMPLEMENT THIS - THE BUTTONS ARE ALWAYS VISIBLE
  //   // maybeEnableButtons();
  // }

  // gisLoaded() {
  //   this.tokenClient = google.accounts.oauth2.initTokenClient({
  //     client_id: CLIENT_ID,
  //     scope: SCOPES,
  //     callback: '', // defined later
  //   });
  //   this.gisInited = true;
  //   // maybeEnableButtons();
  // }

  // handleAuthClick() {
  //   this.tokenClient.callback = async (resp: any) => {
  //     if (resp.error !== undefined) {
  //       throw (resp);
  //     }
  //     // document.getElementById('signout_button').style.visibility = 'visible';
  //     // document.getElementById('authorize_button').innerText = 'Refresh';
  //     // await this.listFiles();
  //   };

  //   if (gapi.client.getToken() === null) {
  //     // Prompt the user to select a Google Account and ask for consent to share their data
  //     // when establishing a new session.
  //     this.tokenClient.requestAccessToken({prompt: 'consent'});
  //   } else {
  //     // Skip display of account chooser and consent dialog for an existing session.
  //     this.tokenClient.requestAccessToken({prompt: ''});
  //   }
  // }

  // handleSignoutClick() {
  //   const token = gapi.client.getToken();
  //   if (token !== null) {
  //     google.accounts.oauth2.revoke(token.access_token);
  //     gapi.client.setToken('');
  //     // document.getElementById('content').innerText = '';
  //     // document.getElementById('authorize_button').innerText = 'Authorize';
  //     // document.getElementById('signout_button').style.visibility = 'hidden';
  //   }
  // }

  // async listFiles() {
  //   let response;
  //   try {
  //     response = await gapi.client.drive.files.list({
  //       'pageSize': 10,
  //       'fields': 'files(id, name)',
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     return;
  //   }
  //   const files = response.result.files;
  //   if (!files || files.length == 0) {
  //     // document.getElementById('content').innerText = 'No files found.';
  //     console.log('No files found');
  //     return;
  //   }
  //   // Flatten to string to display
  //   const output = files.reduce(
  //       (str: any, file: any) => `${str}${file.name} (${file.id})\n`,
  //       'Files:\n');
  //   console.log(output);
  // }
  // // GOOGLE-BASED CODE


  // LOGIN COMPONENT IS SUBSCRIBED TO THE LIBRARY LOGIN SERVICE
  // IF LOGGED IN, WE GO TO THE DASHBOARD
  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user !== null);
      if (this.loggedIn) {
        this.goToDashboard();
        this.getAccessToken(); // TO FIX: THIS TRIGGERS A SECOND POP-UP
      }
    });

    // GOOGLE-BASED CODE
    // TRY AND LOAD GOOGLE SCRIPTS INTO THE PAGE -> SUCCESS, THEY ARE THERE
    // const script1 = this.renderer.createElement('script');
    // this.renderer.setAttribute(script1, 'src', 'https://apis.google.com/js/api.js');
    // this.renderer.setAttribute(script1, 'async', '');
    // this.renderer.setAttribute(script1, 'defer', '');
    // this.renderer.listen(script1, 'load', (event) => {
    //   this.gapiLoaded();
    // });
    // this.renderer.appendChild(document.body, script1);
    
    // const script2 = this.renderer.createElement('script');
    // this.renderer.setAttribute(script2, 'src', 'https://accounts.google.com/gsi/client');
    // this.renderer.setAttribute(script2, 'async', '');
    // this.renderer.setAttribute(script2, 'defer', '');
    // this.renderer.listen(script2, 'load', (event) => {
    //   this.gisLoaded();
    // });
    // this.renderer.appendChild(document.body, script2);
    // GOOGLE-BASED CODE
  }
}

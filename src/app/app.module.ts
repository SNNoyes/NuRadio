import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerViewComponent } from './player-view/player-view.component';
import { CollectionViewComponent } from './collection-view/collection-view.component';

import { HttpClientModule } from '@angular/common/http';
import { PlaybackQueueComponent } from './playback-queue/playback-queue.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerViewComponent,
    CollectionViewComponent,
    PlaybackQueueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

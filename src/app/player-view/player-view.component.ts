import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
// jsmediatags IS A LIBRARY THAT READS MEDIA TAGS
import * as jsmediatags from 'jsmediatags';
import { TrackServerService } from '../track-server.service';
import { Track } from '../track-server.service';
import { API_KEY } from 'src/env';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.css']
})
export class PlayerViewComponent implements OnInit {
  constructor(private trackService: TrackServerService) { }

  // ViewChild and ElementRef ARE AN ANGULAR WAYS TO WRAP AND REFER TO DOM ELEMENTS
  // USING DOM SELECTORS DIRECTLY IS NOT FOR ANGULAR
  @ViewChild("audio") audioElement!: ElementRef;
  @ViewChild("volume") volumeControl!: ElementRef;
  @ViewChild("progressBar") progressBar!: ElementRef;
  @ViewChild("cover") coverArt!: ElementRef;
  @ViewChild("source") sourceElement!: ElementRef;

  duration: string = "0:00";
  currentTime: string = "0:00";
  nowPlayingUrl: string = "";
  queue = this.trackService.playbackQueue;
  currentTrack: Track = {} as Track;

  // MVP CODE FOR CUSTOM SERVER
  // testUrl: string = "http://localhost:3456";

  info = {
    artist: "Artist" as string,
    title: "Title" as string
  };

  // AUDIO ELEMENT CAN NOT FETCH TRACKS DIRECTLY BECAUSE IT DOES NOT SEND AUTH HEADERS
  async fetchTrack(fileId: string): Promise<void> {
    const audioSource = this.sourceElement.nativeElement;
    // const result = await fetch(`${this.trackService.baseUrl}/${fileId}?alt=media`, {
    const result = await fetch(`${this.trackService.baseUrl}/${fileId}?alt=media&key=${API_KEY}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      }
    });
    // START DOWNLOADING FILE TO A BLOB, CREATE A TECHNICAL URL FOR THE BLOB AND GIVE IT
    // TO THE AUDIO SOURCE ELEMENT
    const blob = await result.blob();
    if (blob) {
      audioSource.src = URL.createObjectURL(blob);
      // TODO: FIX LOAD ERROR OR HANDLE GOOGLE DRIVE THROTTLING (?)
      audioSource.parentElement.load();
    } else {
      console.log("Failed to load from the remote source");
    }
  }

  // REFERRING TO THE ELEMENTS IN THE HANDLERS TO MAKE SURE THEY ARE INITIALIZED AND NOT NULL
  playPause(event: Event): void | null {
    if (this.queue.length === 0) return null;
    const audioElement = this.audioElement.nativeElement;
    audioElement.addEventListener('canplay', (event: Event) => {
      this.audioElement.nativeElement.play()
    });
    // PLAY FIRST TRACK FROM THE QUEUE IF NOTHING IS PLAYING
    if (Object.keys(this.currentTrack).length === 0) {
      this.fetchTrack(this.queue[0].id);
      this.currentTrack = this.queue[0];
    } else if (audioElement.paused === true) {
      audioElement.play();
    } else {
      audioElement.pause();
    };
  };

  changeVolume(): void {
    const volumeControl = this.volumeControl.nativeElement;
    const audioElement = this.audioElement.nativeElement;
    audioElement.volume = Number(volumeControl.value);
  }

  getMetadata(): void {
    const audioElement = this.audioElement.nativeElement;
    const progressBar = this.progressBar.nativeElement;
    const coverArt = this.coverArt.nativeElement;

    const duration = audioElement.duration;
    this.duration = this.parseTime(duration) as string;
    progressBar.max = duration;

    // LIBRARY STOPPED WORKING AFTER TRANSITION TO GOOGLE DRIVE
    // jsmediatags.read(audioElement.source, {
    //   onSuccess: (result) => {
    //     console.log(result);
    //     this.info.artist = result.tags.artist!;
    //     this.info.title = result.tags.title!;
    //     // APPARENTLY SOME FILES CONTAIN IMAGE DATA AS WELL
    //     // PARSING BELOW AS ADVISED BY AUTHORS OF THE LIBRARY
    //     const { data, format } = result.tags.picture!;
    //     let base64String = "";
    //     for (let i = 0; i < data.length; i++) {
    //       base64String += String.fromCharCode(data[i]);
    //     }
    //     coverArt.src = `data:${format};base64,${window.btoa(base64String)}`;
    //   },
    //   onError: (error) => {
    //     console.error(error);
    //   }
    // });
  }

  updateTime(): void {
    const audioElement = this.audioElement.nativeElement;
    const progressBar = this.progressBar.nativeElement;
    const currentTime = audioElement.currentTime;
    this.currentTime = this.parseTime(currentTime) as string;
    progressBar.value = currentTime;
  }

  seek(event: MouseEvent): void {
    const audioElement = this.audioElement.nativeElement;
    const progressBar = this.progressBar.nativeElement;
    let newTime = event.offsetX / progressBar.offsetWidth * audioElement.duration;
    progressBar.value = newTime;
    audioElement.currentTime = newTime;
  }

  parseTime(totalSeconds: number): String {
    totalSeconds = Math.floor(totalSeconds);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
  }

  nextTrack(): void {
    let currentPos = this.trackService.playbackQueue.findIndex((element: Track) => {
      return element.id === this.currentTrack.id;
    });
    if (currentPos !== -1 && currentPos !== this.trackService.playbackQueue.length - 1) {
      this.currentTrack = this.trackService.playbackQueue[currentPos + 1];
      try {
        this.fetchTrack(this.currentTrack.id);
      } catch {
        this.nextTrack();
      }
    }
  }

  previousTrack(): void {
    let currentPos = this.trackService.playbackQueue.findIndex((element: Track) => {
      return element.id === this.currentTrack.id;
    });
    if (currentPos !== -1 && currentPos !== 0) {
      this.currentTrack = this.trackService.playbackQueue[currentPos - 1];
      try {
        this.fetchTrack(this.currentTrack.id);
      } catch {
        this.previousTrack();
      }
    }
  }

  ngOnInit(): void {

  }
}

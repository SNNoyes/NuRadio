import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
export class PlayerViewComponent implements AfterViewInit {
  constructor(private trackService: TrackServerService) { }

  // ViewChild and ElementRef ARE AN ANGULAR WAYS TO WRAP AND REFER TO DOM ELEMENTS
  // USING DOM SELECTORS DIRECTLY IS NOT FOR ANGULAR
  @ViewChild("audio") audioElement!: ElementRef;
  @ViewChild("volume") volumeControl!: ElementRef;
  @ViewChild("progressBar") progressBar!: ElementRef;
  @ViewChild("cover") coverArt!: ElementRef;
  @ViewChild("source") sourceElement!: ElementRef;

  duration = "0:00";
  currentTime = "0:00";
  queue = this.trackService.playbackQueue;
  currentTrack: Track = {} as Track;
  playing = false;
  lastVolume = "";

  // MVP CODE FOR CUSTOM SERVER
  // testUrl: string = "http://localhost:3456";

  info = {
    artist: "Artist" as string,
    title: "Title" as string
  };

  // AUDIO ELEMENT CAN NOT FETCH TRACKS DIRECTLY BECAUSE IT DOES NOT SEND AUTH HEADERS
  async fetchTrack(fileId: string): Promise<void> {
    // try {
      const audioSource = this.sourceElement.nativeElement;
      // this.audioElement.nativeElement.src = "";
      const result = await fetch(`${this.trackService.baseUrl}/${fileId}?alt=media&key=${API_KEY}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        }
      });
      console.log(result);
      if (result.status === 503) {
        throw new Error('Failed to fetch a track');
      }
      // START DOWNLOADING FILE TO A BLOB, CREATE A TECHNICAL URL FOR THE BLOB AND GIVE IT
      // TO THE AUDIO SOURCE ELEMENT
      const blob = await result.blob();

      if (blob) {
        jsmediatags.read(blob, {
          onSuccess: (result) => {
            console.log(result);
            const coverArt = this.coverArt.nativeElement;
            this.info.artist = result.tags.artist!;
            this.info.title = result.tags.title!;
            // APPARENTLY SOME FILES CONTAIN IMAGE DATA AS WELL
            // PARSING BELOW AS ADVISED BY AUTHORS OF THE LIBRARY
            const { data, format } = result.tags.picture!;
            let base64String = "";
            for (let i = 0; i < data.length; i++) {
              base64String += String.fromCharCode(data[i]);
            }
            coverArt.src = `data:${format};base64,${window.btoa(base64String)}`;
          },
          onError: (error) => {
            console.error(error);
          }
        });

        audioSource.src = URL.createObjectURL(blob);
        // TODO: FIX LOAD ERROR OR HANDLE GOOGLE DRIVE THROTTLING (?)
        audioSource.parentElement.load();
        const audioElement = this.audioElement.nativeElement;
        audioElement.addEventListener('canplay', (event: Event) => {
          this.audioElement.nativeElement.play()
        });
      }
  }

  // REFERRING TO THE ELEMENTS IN THE HANDLERS TO MAKE SURE THEY ARE INITIALIZED AND NOT NULL
  async playPause(event: Event): Promise<void | null> {
    if (this.queue.length === 0) return null;
    const audioElement = this.audioElement.nativeElement;
    // PLAY FIRST TRACK FROM THE QUEUE IF NOTHING IS PLAYING
    if (Object.keys(this.currentTrack).length === 0) {
      this.currentTrack = this.queue[0];
      this.trackService.currentTrack = this.currentTrack;
      try {
        await this.fetchTrack(this.queue[0].id);
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          this.nextTrack();
        }, 1000);
      }
    } else if (audioElement.paused === true) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }

  changeVolume(): void {
    const volumeControl = this.volumeControl.nativeElement;
    const audioElement = this.audioElement.nativeElement;
    audioElement.volume = Number(volumeControl.value);
  }

  getMetadata(): void {
    const audioElement = this.audioElement.nativeElement;
    const progressBar = this.progressBar.nativeElement;

    const duration = audioElement.duration;
    this.duration = this.parseTime(duration) as string;
    progressBar.max = duration;
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
    const newTime = event.offsetX / progressBar.offsetWidth * audioElement.duration;
    progressBar.value = newTime;
    audioElement.currentTime = newTime;
  }

  parseTime(totalSeconds: number): string {
    totalSeconds = Math.floor(totalSeconds);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
  }

  async nextTrack(): Promise<void> {
    try {
      const currentPos = this.queue.findIndex((element: Track) => {
        return element.id === this.currentTrack.id;
      });
      if (currentPos !== -1 && currentPos !== this.trackService.playbackQueue.length - 1) {
        this.currentTrack = this.queue[currentPos + 1];
        this.trackService.currentTrack = this.currentTrack;
        await this.fetchTrack(this.currentTrack.id);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        this.nextTrack();
      }, 1000);
    }
  }

  async previousTrack(): Promise<void> {
    const currentPos = this.queue.findIndex((element: Track) => {
      return element.id === this.currentTrack.id;
    });
    if (currentPos !== -1 && currentPos !== 0) {
      this.currentTrack = this.queue[currentPos - 1];
      this.trackService.currentTrack = this.currentTrack;
      try {
        await this.fetchTrack(this.currentTrack.id);
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          this.previousTrack();
        }, 1000);
      }
    }
  }

  mute(): void {
    const audioElement = this.audioElement.nativeElement;
    const volumeControl = this.volumeControl.nativeElement;
    if (volumeControl.value !== "0") {
      this.lastVolume = volumeControl.value;
      volumeControl.value = "0";
      audioElement.volume = 0;
    } else {
      audioElement.volume = Number(this.lastVolume);
      volumeControl.value = this.lastVolume;
    }
  }

  ngAfterViewInit(): void {
    const audioElement = this.audioElement.nativeElement;
    audioElement.addEventListener('playing', () => {
      this.playing = true;
    });
    audioElement.addEventListener('pause', () => {
      this.playing = false;
    })
  }

}

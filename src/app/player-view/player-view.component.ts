import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DefaultUrlSerializer } from '@angular/router';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.css']
})
export class PlayerViewComponent implements AfterViewInit {
  // ViewChild and ElementRef ARE AN ANGULAR WAYS TO WRAP AND REFER TO DOM ELEMENTS
  // USING DOM SELECTORS IS NOT FOR ANGULAR
  @ViewChild("audio") audioElement!: ElementRef;
  @ViewChild("volume") volumeControl!: ElementRef;
  @ViewChild("progressBar") progressBar!: ElementRef;

  playing = false;
  duration: String = "0:00";
  currentTime: String = "0:00";

  playPause(event: Event): void {
    // REFERRING TO THE ELEMENT IN THE HANDLER TO MAKE SURE IT IS INITIALIZED AND IS NOT NULL
    const audioElement = this.audioElement.nativeElement;
    if (this.playing === false) {
      audioElement.play();
      this.playing = true;
    } else if (this.playing === true) {
      audioElement.pause();
      this.playing = false;
    };
  };

  changeVolume(event: Event): void {
    const volumeControl = this.volumeControl.nativeElement;
    const audioElement = this.audioElement.nativeElement;
    audioElement.volume = Number(volumeControl.value);
  }

  getMetadata(): void {
    const audioElement = this.audioElement.nativeElement;
    const progressBar = this.progressBar.nativeElement;
    audioElement.addEventListener("loadedmetadata", (event: Event) => {
      const duration = audioElement.duration;
      this.duration = this.parseTime(duration);
      progressBar.max = duration;
    });
  }

  updateTime(): void {
    const audioElement = this.audioElement.nativeElement;
    const progressBar = this.progressBar.nativeElement;
    audioElement.addEventListener("timeupdate", (event: Event) => {
      const currentTime = audioElement.currentTime;
      this.currentTime = this.parseTime(currentTime);
      progressBar.value = currentTime;
    });
  }

  parseTime(totalSeconds: number): String {
    totalSeconds = Math.floor(totalSeconds);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
  }

  ngAfterViewInit(): void {
    this.getMetadata();
    this.updateTime();
  }
}



  // audio(): void {
  //   const audioContext = new AudioContext();
  //   // ! NON-NULL ASSERTION OPERATOR TELLS TS THAT THE VALUE WILL NEVER BE NULL
  //   const audioElement = document.querySelector("audio")!;
  //   const track = audioContext.createMediaElementSource(audioElement);
  //   track.connect(audioContext.destination);

  //   const playButton = document.querySelector("button")!;

  //   playButton.addEventListener("click", function () {
  //     if (audioContext.state === "suspended") {
  //       audioContext.resume();
  //     };

  //     if (playButton.dataset["playing"] === "false") {
  //       audioElement.play();
  //       playButton.dataset["playing"] = "true";
  //     } else if (playButton.dataset["playing"] === "true") {
  //       audioElement.pause();
  //       playButton.dataset["playing"] = "false";
  //     };
  //   });

  //   audioElement.addEventListener("ended", function () {
  //     playButton.dataset["playing"] = "false";
  //   });

  //   // CONFUSING EXAMPLE FROM MDN DOCS RE GAIN - IT ACTUALLY IS NOT VOLUME
  //   const gainNode = audioContext.createGain();
  //   track.connect(gainNode).connect(audioContext.destination);

  //   const gainControl = (<HTMLInputElement>document.querySelector("#gain")!);

  //   gainControl.addEventListener("input", function () {
  //     gainNode.gain.value = Number(gainControl.value);
  //   });

  //   const volumeControl = (<HTMLInputElement>document.querySelector("#volume")!);

  //   volumeControl.addEventListener("input", function () {
  //     audioElement.volume = Number(volumeControl.value);
  //   });
  // }



// CAN REFACTOR BASED ON HTML MEDIA ELEMENT PROPERTIES https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
// AUDIO NODES ALLOW PROCESSING, MAY NEED THEM LATER FOR FADE OUT AND MIXING
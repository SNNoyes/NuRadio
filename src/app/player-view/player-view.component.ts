import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.css']
})
export class PlayerViewComponent implements OnInit {


  audio(): void {
    const audioContext = new AudioContext();
    // ! NON-NULL ASSERTION OPERATOR TELLS TS THAT THE VALUE WILL NEVER BE NULL
    const audioElement = document.querySelector("audio")!;
    const track = audioContext.createMediaElementSource(audioElement);
    track.connect(audioContext.destination);

    const playButton = document.querySelector("button")!;

    playButton.addEventListener("click", function () {
      if (audioContext.state === "suspended") {
        audioContext.resume();
      };

      if (playButton.dataset["playing"] === "false") {
        audioElement.play();
        playButton.dataset["playing"] = "true";
      } else if (playButton.dataset["playing"] === "true") {
        audioElement.pause();
        playButton.dataset["playing"] = "false";
      };
    });

    audioElement.addEventListener("ended", function () {
      playButton.dataset["playing"] = "false";
    });

    // CONFUSING EXAMPLE FROM MDN DOCS RE GAIN - IT ACTUALLY IS NOT VOLUME
    const gainNode = audioContext.createGain();
    track.connect(gainNode).connect(audioContext.destination);

    const gainControl = (<HTMLInputElement>document.querySelector("#gain")!);

    gainControl.addEventListener("input", function () {
      gainNode.gain.value = Number(gainControl.value);
    });

    const volumeControl = (<HTMLInputElement>document.querySelector("#volume")!);

    volumeControl.addEventListener("input", function () {
      audioElement.volume = Number(volumeControl.value);
    });
  }

  ngOnInit(): void {
    this.audio();
  }
}

// CAN REFACTOR BASED ON HTML MEDIA ELEMENT PROPERTIES https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
// AUDIO NODES ALLOW PROCESSING, MAY NEED THEM LATER FOR FADE OUT AND MIXING
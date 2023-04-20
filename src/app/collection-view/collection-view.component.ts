import { Component, OnInit } from '@angular/core';
import { TrackServerService } from '../track-server.service';

@Component({
  selector: 'app-collection-view',
  templateUrl: './collection-view.component.html',
  styleUrls: ['./collection-view.component.css']
})
export class CollectionViewComponent implements OnInit {
  constructor(private trackService: TrackServerService) {};

  collection: string[] = [];

  selectTrack(fileName: string): void {
    this.trackService.nowPlaying = fileName;
    this.trackService.trackAlert.emit();
  }

  refreshCollection(): void {
    this.trackService.getCollection()
    .subscribe((response) => {
      console.log(response);
      this.collection = response;
    })
  }

  ngOnInit(): void {
    this.trackService.getCollection()
      .subscribe((response) => {
        console.log(response);
        this.collection = response;
      })
  }
  
}

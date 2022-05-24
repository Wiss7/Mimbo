import { Component, OnDestroy, OnInit } from '@angular/core';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';

@Component({
  selector: 'app-whistle',
  templateUrl: './whistle.page.html',
  styleUrls: ['./whistle.page.scss'],
})
export class WhistlePage implements OnInit, OnDestroy {
  isPlaying = false;
  constructor(private nativeAudio: NativeAudio) {
    this.nativeAudio.preloadSimple('whistle', 'assets/sounds/whistle.wav');
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    this.stopSound();
    this.nativeAudio.unload('whistle');
  }
  playSound() {
    this.isPlaying = true;
    this.nativeAudio.loop('whistle');
  }
  stopSound() {
    this.isPlaying = false;
    this.nativeAudio.stop('whistle');
  }
  toggleSound() {
    if (this.isPlaying) {
      this.stopSound();
    } else {
      this.playSound();
    }
  }
  ionViewWillLeave() {
    this.stopSound();
  }
}

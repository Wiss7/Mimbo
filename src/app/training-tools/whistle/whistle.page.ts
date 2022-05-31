import { Component, OnDestroy, OnInit } from '@angular/core';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';

@Component({
  selector: 'app-whistle',
  templateUrl: './whistle.page.html',
  styleUrls: ['./whistle.page.scss'],
})
export class WhistlePage implements OnInit, OnDestroy {
  isPlaying = false;
  frequency = '11200';
  constructor(private nativeAudio: NativeAudio) {
    this.nativeAudio.preloadSimple('11200', 'assets/sounds/Whistle/11200.wav');
    this.nativeAudio.preloadSimple('12200', `assets/sounds/Whistle/12200.wav`);
    this.nativeAudio.preloadSimple('16000', `assets/sounds/Whistle/16000.wav`);
    this.nativeAudio.preloadSimple('20000', `assets/sounds/Whistle/20000.wav`);
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    this.stopSound();
    this.nativeAudio.unload('11200');
    this.nativeAudio.unload('12200');
    this.nativeAudio.unload('16000');
    this.nativeAudio.unload('20000');
  }
  playSound() {
    this.isPlaying = true;
    this.nativeAudio.loop(this.frequency);
  }
  stopSound() {
    this.isPlaying = false;
    this.nativeAudio.stop(this.frequency);
  }
  toggleSound() {
    if (this.isPlaying) {
      this.stopSound();
    } else {
      this.playSound();
    }
  }

  segmentChanged(ev: any) {
    this.frequency = ev.detail.value;
    this.stopSound();
  }

  ionViewWillLeave() {
    this.stopSound();
  }
}

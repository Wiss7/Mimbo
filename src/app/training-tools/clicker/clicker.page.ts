import { Component, OnDestroy, OnInit } from '@angular/core';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
@Component({
  selector: 'app-clicker',
  templateUrl: './clicker.page.html',
  styleUrls: ['./clicker.page.scss'],
})
export class ClickerPage implements OnInit, OnDestroy {
  constructor(private nativeAudio: NativeAudio) {
    this.nativeAudio.preloadSimple('clicker', 'assets/sounds/Clicker.mp3');
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    this.nativeAudio.unload('clicker');
  }
  playAudio() {
    this.nativeAudio.play('clicker').then(
      () => {},
      (err) => {}
    );
  }
}

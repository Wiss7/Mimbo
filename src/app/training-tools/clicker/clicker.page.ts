import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
@Component({
  selector: 'app-clicker',
  templateUrl: './clicker.page.html',
  styleUrls: ['./clicker.page.scss'],
})
export class ClickerPage implements OnInit, OnDestroy {
  trustedLink: SafeResourceUrl;
  tutoriallink: string = 'https://www.youtube.com/shorts/TmS7ij7u0kg';
  constructor(
    private nativeAudio: NativeAudio,
    private domSanitizer: DomSanitizer
  ) {
    this.nativeAudio.preloadSimple('clicker', 'assets/sounds/Clicker.mp3');
  }

  ngOnInit() {
    this.trustedLink = this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.tutoriallink
    );
  }
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

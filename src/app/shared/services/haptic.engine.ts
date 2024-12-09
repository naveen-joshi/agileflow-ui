import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HapticEngine {
  private hasVibration = 'vibrate' in navigator;

  lightImpact() {
    if (this.hasVibration) navigator.vibrate(10);
  }

  mediumImpact() {
    if (this.hasVibration) navigator.vibrate(20);
  }

  successImpact() {
    if (this.hasVibration) navigator.vibrate([10, 30, 10]);
  }
}

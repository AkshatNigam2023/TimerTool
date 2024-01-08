import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})

export class TimerComponent implements OnInit, OnDestroy {
  timer: string = '05:00';
  timerSubscription: Subscription | undefined;
  isPaused: boolean = false;
  timerStarted: boolean = false; // Added flag to track whether the timer has started

  clockSound: HTMLAudioElement = new Audio('assets/clock-sound.mp3');
  ngOnInit(): void {
    // this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.clockSound.pause();
    this.clockSound.currentTime = 0;
  }

  startTimer(): void {
    if (!this.timerSubscription) {
      this.timerStarted = true; // Set the flag to true when the timer starts
      this.clockSound.play();
      const timerInterval = interval(1000);
      this.timerSubscription = timerInterval.subscribe(() => {
        if (!this.isPaused) {
          const timeArray = this.timer.split(':');
          let minutes = parseInt(timeArray[0]);
          let seconds = parseInt(timeArray[1]);

          if (minutes === 0 && seconds === 0) {
            if (this.timerSubscription) {
              this.timerSubscription.unsubscribe();
              this.timerSubscription = undefined; // Set to undefined after unsubscribing
              this.clockSound.pause(); // Pause the clock sound when the timer stops
              this.clockSound.currentTime = 0;
            }
          } else {
            if (seconds === 0) {
              minutes--;
              seconds = 59;
            } else {
              seconds--;
            }

            this.timer = `${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
          }
        }
      });
    }
  }

  pauseTimer(): void {
    this.isPaused = true;
    this.clockSound.pause(); 
  }

  resumeTimer(): void {
    this.isPaused = false;
    this.clockSound.play();
  }

  resetTimer(): void {
    this.timer = '05:00';
    this.timerStarted = false; // Reset the flag when timer is reset
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined; // Set to undefined after unsubscribing
    }
    this.clockSound.pause(); 
  }

  private formatTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }
}
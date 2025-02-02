import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/interface/user';

@Component({
  selector: 'app-demo2',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>Counter demo with signal</p>
    <pre> {{ counter() }} </pre>

    <button (click)="inc()">+</button>

    <!-- if is not 0 -->
    <button (click)="reset()" *ngIf="!isZero()">Reset</button>

    <!-- <div *ngIf="counter() !== 0">
      <p>{{ user.name }}</p>
    </div> -->

    <!-- if is not 0 -->
    <div *ngIf="!isZero()">
      <p>{{ user.name }}</p>
    </div>
  `,
  styles: [],
})
export class Demo2Component {
  counter = signal(0);
  user: User = {};
  http = inject(HttpClient);
  isZero = computed(() => {
    return this.counter() === 0;
  });

  constructor() {
    effect(() => {
      if (this.counter() !== 0) {
        this.http
          .get<User>(
            `https://jsonplaceholder.typicode.com/users/${this.counter()}`
          )
          .subscribe((user) => {
            this.user = user;
          });
      }
    });
  }

  inc() {
    this.counter.update((c) => c + 1);
  }

  reset() {
    this.counter.set(0);
  }
}

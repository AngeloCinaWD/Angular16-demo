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
      <!-- use of optional chaining operator -->
      <p>{{ user?.name }}</p>
    </div>
  `,
  styles: [],
})
export class Demo2Component {
  // initial signal
  counter = signal(0);

  // property user to define
  user: User | undefined;

  // inject http service
  http = inject(HttpClient);

  // computed property from counter signal
  // when counter change isZero value change
  isZero = computed(() => {
    return this.counter() === 0;
  });

  constructor() {
    // define in constructor an effect to trig when counter value change and his value is different from 0
    effect(() => {
      if (this.counter() !== 0) {
        // http request to achieve user data for user with id like counter value
        this.http
          .get<User>(
            `https://jsonplaceholder.typicode.com/users/${this.counter()}`
          )
          .subscribe((user) => {
            // at the response set user property like data achieved from http request
            this.user = user;
          });
      }
    });
  }

  // method to update counter value
  inc() {
    // signal method update, first argument is signal old value
    this.counter.update((c) => c + 1);
  }

  // method to reset counter
  reset() {
    // used signal method .set()
    // when counter value is 0 the property isZero is true and in template are hidden some elements
    this.counter.set(0);
  }
}

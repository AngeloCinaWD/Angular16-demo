import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './core/nav-bar/nav-bar.component';
// import { Demo1Component } from './features/demo1.component'; va messo negli imorts del componente

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavBarComponent],
  template: `Navigation bar here for {{ title }}
    <hr />
    <!-- <app-demo1 /> non lo importo così perchè lo farò visualizzare nel router outlet, quindi tramite router-->
    <!-- <button routerLink="demo1">demo1</button>
    <button routerLink="demo2">demo2</button>
    <button routerLink="demo3">demo3</button> li metto in un componente nav-bar che creo-->
    <app-nav-bar />
    <hr />
    <router-outlet></router-outlet> `,
  styles: [],
})
export class AppComponent {
  title = 'angular16-demo';
}

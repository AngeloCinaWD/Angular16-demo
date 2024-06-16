import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User } from '../interface/user';

@Component({
  selector: 'app-demo1',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>demo1 works!</p>
    <ul>
      <li *ngFor="let user of users$ | async">
        {{ user.name }}
      </li>
    </ul>
  `,
  styles: [],
})
export class Demo1Component {
  // constructor(private http: HttpClient) {
  //   http
  //     .get('https://jsonplaceholder.typicode.com/users')
  //     .subscribe((res) => console.log(res));
  // }

  // riscrivo il codice utilizzando la funzione inject(), inietto direttamente dove mi serve
  http = inject(HttpClient);

  // constructor() {
  //   this.http
  //     .get('https://jsonplaceholder.typicode.com/users')
  //     .subscribe((res) => console.log(res));
  // }

  // associo l'http.get() ad una proprietà che sarà quindi un observable, non ho bisogno di valorizzarla nel costruttore
  users$ = this.http.get<User[]>('https://jsonplaceholder.typicode.com/users');
  // users$$ = this.users$.subscribe((m) => console.log(m));
}

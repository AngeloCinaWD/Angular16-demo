import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from 'src/app/interface/todo';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-demo3',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Todo List</h1>

    <!-- visible if length of array todos is 0, then is empty -->
    <div *ngIf="noTodos()">Non ci sono todos in lista</div>
    <hr />
    <!-- addTodo method is triggered when enter key is pressed, the event is provided -->
    <input type="text" (keydown.enter)="addTodo($event)" />
    <hr />
    <!-- metodo per togglare il completed passando tutto il todo -->
    <!-- <li *ngFor="let todo of todos()">
      {{ todo.title }}
      <input
        type="checkbox"
        [checked]="todo.completed"
        (change)="toggleTodo(todo)"
      />
      <button (click)="deleteTodo(todo)">X</button>
    </li> -->
    <!-- metodo per togglare il completed passando l'indice -->
    <!-- <li *ngFor="let todo of todos(); let i = index">
      {{ todo.title }}
      <input
        type="checkbox"
        [checked]="todo.completed"
        (change)="toggleTodo(i)"
      />
      <button (click)="deleteTodo(todo)">X</button>
    </li> -->
    <!-- metodo per togglare il todo in un server tramite chiamata PATCH -->
    <li *ngFor="let todo of todos()">
      {{ todo.title }}
      <!-- if i check/uncheck the check box i call toggleTodo method, this set to true or false the todo property completed -->
      <input
        type="checkbox"
        [checked]="todo.completed"
        (change)="toggleTodo(todo)"
      />
      <button (click)="deleteTodo(todo)">X</button>
    </li>

    <!-- html pre element, used pipe async to show on screen data -->
    <pre>{{ todos() | json }}</pre>
  `,
  styles: [],
})
export class Demo3Component {
  http = inject(HttpClient);
  // todos = signal<Todo[]>([
  //   {
  //     id: 1,
  //     title: 'Todo 1',
  //     completed: true,
  //   },
  //   {
  //     id: 2,
  //     title: 'Todo 2',
  //     completed: false,
  //   },
  //   {
  //     id: 3,
  //     title: 'Todo 3',
  //     completed: true,
  //   },
  // ]);

  // prendiamo i dati dal server e modifichiamo tutti i metodi utilizzando i metodi necessari

  todos = signal<Todo[]>([]);

  ngOnInit() {
    // http request to achieve todos data and assign them to todos signal through signal method .set()
    this.http.get<Todo[]>('http://localhost:3000/todos').subscribe((c) => {
      this.todos.set(c);
    });
  }

  addTodo(event: Event) {
    // save in a const the value of input tag
    // i need to declare the element html what type is
    const target: HTMLInputElement = event.target as HTMLInputElement;

    // const newTodo: Todo = {
    //   id: Date.now(),
    //   title: target.value,
    //   completed: false,
    // };

    this.http
      // post request to save todo in BE
      .post<Todo>('http://localhost:3000/todos', {
        title: target.value,
        completed: false,
      })
      // on subscribe i take the new todo from BE response and this is added to todos signal array through spread syntax
      // in ths way is possible to show it on screen
      .subscribe((newTodo) =>
        this.todos.update((todos) => {
          return [...todos, newTodo];
        })
      );

    // this.todos.update((todos) => {
    //   return [...todos, newTodo];
    // });

    // setting input tag to empty string
    target.value = '';
  }

  // toggleTodo(todoToToggle: Todo) {
  //   this.todos.update((todos) => {
  //     return todos.map((todo) => {
  //       return todo.id === todoToToggle.id
  //         ? { ...todo, completed: !todo.completed }
  //         : todo;
  //     });
  //   });
  // }

  // toggleTodo(index: number) {
  //   this.todos.mutate((todos) => {
  //     todos[index].completed = !todos[index].completed;
  //   });
  // }

  // per modificare il todo dobbiamo passare il todo, ci serve l'id per cercarlo
  toggleTodo(todo: Todo) {
    this.http
      .patch<Todo>(`http://localhost:3000/todos/${todo.id}`, {
        ...todo,
        completed: !todo.completed,
      })
      .subscribe((toggledTodo) => {
        this.todos.update((todos) => {
          return todos.map((t) => {
            // l'id del todo nell'array vecchio è uguale a quello del todo cambiato? si? prendi il todo cambiato. no? prendi il todo vecchio
            return t.id === toggledTodo.id ? toggledTodo : t;
          });
        });
      });
  }

  noTodos = computed(() => {
    return this.todos().length === 0;
  });

  deleteTodo(todo: Todo) {
    this.http
      .delete(`http://localhost:3000/todos/${todo.id}`)
      .subscribe(() =>
        this.todos.update((todos) => todos.filter((t) => t.id !== todo.id))
      );
    // this.todos.update((todos) => {
    //   return todos.filter((t) => t.id !== todo.id);
    // });
  }
}

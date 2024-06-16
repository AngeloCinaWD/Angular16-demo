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

    <div *ngIf="noTodos()">Non ci sono todos in lista</div>
    <hr />
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
      <input
        type="checkbox"
        [checked]="todo.completed"
        (change)="toggleTodo(todo)"
      />
      <button (click)="deleteTodo(todo)">X</button>
    </li>

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
    this.http.get<Todo[]>('http://localhost:3000/todos').subscribe((c) => {
      this.todos.set(c);
    });
  }

  addTodo(event: Event) {
    const target: HTMLInputElement = event.target as HTMLInputElement;

    // const newTodo: Todo = {
    //   id: Date.now(),
    //   title: target.value,
    //   completed: false,
    // };

    this.http
      .post<Todo>('http://localhost:3000/todos', {
        title: target.value,
        completed: false,
      })
      .subscribe((newTodo) =>
        this.todos.update((todos) => {
          return [...todos, newTodo];
        })
      );

    // this.todos.update((todos) => {
    //   return [...todos, newTodo];
    // });

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

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskService, Task } from '../services/task.service';
import { AddTaskComponent } from './add-task/add-task.component';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = []; // Array to hold the tasks
  userId: string = ''; // Store the logged-in user's ID

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get the logged-in user's ID from AuthService
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.getTasks(); // Fetch the tasks associated with the user
    } else {
      console.error('User ID is not available.'); // Handle case when userId is not set
    }
  }

  getTasks(): void {
    // Fetch tasks for the logged-in user
    this.taskService.getTasks().pipe( // No need to pass userId here, it should be handled inside the service
      tap((data: Task[]) => {
        this.tasks = data; // Store the fetched tasks
      })
    ).subscribe({
      next: (data: Task[]) => {
        this.tasks = data; // Store the fetched tasks
      },
      error: (error: any) => {
        console.log('Error fetching tasks:', error); // Handle errors
      }
    });
  }

  openTaskDialog(task: Task | null = null): void {
    console.log('Opening task dialog with task:', task); // Debugging log

    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '400px',
      data: task || { userId: this.userId } // Pass the userId for a new task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Task data before sending:', result); // Log the task data for debugging

        // Handle task deletion
        if (result.delete) {
          this.deleteTask(result.id); // Separate method for deletion logic
        }
        // Handle task update
        else if (result.id) {
          this.updateTask(result.id, result);
        }
        // Handle task addition
        else {
          this.addTask({ ...result, userId: this.userId }); // Ensure userId is included
        }
      }
    });
  }

  private deleteTask(id: string): void {
    if (id) {
      console.log(`Deleting task with ID: ${id}`); // Log the ID for debugging
      this.taskService.deleteTask(id).pipe(
        tap(() => this.getTasks()) // Refresh the task list after deletion
      ).subscribe({
        next: () => {},
        error: (error: any) => {
          console.error('Error deleting task:', error);
        }
      });
    } else {
      console.error('Task ID is missing for deletion'); // Handle missing task ID
    }
  }

  private updateTask(id: string, task: Task): void {
    this.taskService.updateTask(id, task).pipe(
      tap(() => this.getTasks()) // Refresh the task list after update
    ).subscribe({
      next: () => {},
      error: (error: any) => {
        console.error('Error updating task:', error);
      }
    });
  }

  private addTask(task: Task): void {
    this.taskService.addTask(task).pipe(
      tap(() => this.getTasks()) // Refresh the task list after addition
    ).subscribe({
      next: () => {},
      error: (error: any) => {
        console.error('Error adding task:', error);
      }
    });
  }
}

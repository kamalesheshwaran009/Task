import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface Task {
  _id?: string;
  title: string;
  description?: string;
  dueDate?: Date;
  status: 'to-do' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  category?: string;
  userId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTasks(): Observable<Task[]> {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      console.error('User ID and token are required to fetch tasks.');
      return throwError(() => new Error('User ID and token are required to fetch tasks.'));
    }

    const params = new HttpParams().set('userId', userId);
    const headers = this.getAuthHeaders();

    return this.http.get<Task[]>(this.apiUrl, { params, headers }).pipe(
      catchError(this.handleError<Task[]>('getTasks'))
    );
  }

  addTask(task: Task): Observable<Task> {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      return throwError(() => new Error('No token or userId found.'));
    }

    task.userId = userId;
    const headers = this.getAuthHeaders();

    return this.http.post<Task>(this.apiUrl, task, { headers }).pipe(
      catchError(this.handleError<Task>('addTask'))
    );
  }

  updateTask(id: string, updatedTask: Partial<Task>): Observable<Task> {
    if (!id) {
      return throwError(() => new Error('Task ID is required for updating.'));
    }

    const headers = this.getAuthHeaders();

    return this.http.put<Task>(`${this.apiUrl}/${id}`, updatedTask, { headers }).pipe(
      catchError(this.handleError<Task>('updateTask'))
    );
  }

  deleteTask(id: string): Observable<void> {
    if (!id) {
      return throwError(() => new Error('Task ID is required for deletion.'));
    }

    const headers = this.getAuthHeaders();

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError<void>('deleteTask'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return throwError(() => error);
    };
  }
}

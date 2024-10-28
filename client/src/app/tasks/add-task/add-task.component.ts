import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../services/task.service';
import { futureDateValidator } from '../future-date.validator';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    console.log('Received task data:', data); // Debugging log

    this.taskForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      dueDate: [data?.dueDate || '', futureDateValidator()],
      description: [data?.description || ''],
      category: [data?.category || ''],
      status: [data?.status || 'to-do']
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskData = {
        ...this.taskForm.value,
        id: this.data?._id,   // Include existing ID if editing
        userId: localStorage.getItem('userId') // Ensure userId is retrieved from local storage
      };
      this.dialogRef.close(taskData);
    } else {
      console.error('Form is invalid:', this.taskForm.errors); // Log any validation errors
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    if (this.data?._id) {
      if (confirm('Are you sure you want to delete this task?')) {
        console.log(`Deleting task with ID: ${this.data._id}`); // Log the ID for debugging
        this.dialogRef.close({ delete: true, id: this.data._id });
      }
    } else {
      console.error('No task ID available for deletion');
    }
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material Modules
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker'; // Add this import for the date picker
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Components
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component'; // Navbar component
import { TasksComponent } from './tasks/tasks.component';  // Tasks component for viewing tasks
import { AddTaskComponent } from './tasks/add-task/add-task.component';  // Task creation dialog

// Services

import { AuthService } from './services/auth.service';
import { TaskService } from './services/task.service'; // Task service for managing tasks

// Routing
import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    RegisterComponent,
    LoginComponent,
    NavbarComponent,
    TasksComponent,
    AddTaskComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatCardModule,
    MatNativeDateModule,
    MatDialogModule,
    MatListModule,
    MatDatepickerModule,  // Ensure this line is present
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    AppRoutingModule // Import the routing module
  ],
  providers: [
    provideHttpClient(),
    AuthService,
    TaskService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }

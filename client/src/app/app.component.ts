import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css' ] // Fix here: changed from styleUrl to styleUrls
})
export class AppComponent {
  title = 'client';
}

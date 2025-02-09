import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlarmComponent } from './modules/alarm/alarm.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AlarmComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'boxingalarm';
}

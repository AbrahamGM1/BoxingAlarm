import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-alarm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alarm.component.html',
  styleUrl: './alarm.component.scss'
})
export class AlarmComponent {


  realseconds:number = 0;
  realminutes:number = 2;


  //Realtime es todos los minutos en segundos para hacer la conversion
  //del porcentaje de la gráfica que se va a ir reduciendo
  realtime: number = 120;
  progressvalue: number = 0;
  percentage: number = 100;

  private subscription!: Subscription;


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.start()
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  start(){
    this.subscription = interval(1000).subscribe(() => {
          /* Empiezas con segundos en 0 y unos minutos establecidos, al empezar
    tienes que comprobar que haya 1 minuto como mínimo y 0 segundos */
    if (this.realminutes>0 && this.realseconds == 0) {
      this.realminutes -= 1;
      //60 porque justo abajo se lo va a restar
      this.realseconds = 60;
    }

    //Resta un segundo
    this.realseconds -=1;

    })
  }

}

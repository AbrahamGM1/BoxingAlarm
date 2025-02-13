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


  realseconds:number = 30;
  realminutes:number = 1;


  //Realtime es todos los minutos en segundos para hacer la conversion
  //del porcentaje de la gráfica que se va a ir reduciendo
  realtime: number = (this.realminutes*60)+(this.realseconds);
  progressvalue: number = 0;
  percentage: number = 0;
  onepercent: number = 100/this.realtime;

  //Boolean para el boton de pausa
  isrunning: boolean = true;

  private subscription!: Subscription;

  colors: string[]=['rgb(182, 255, 146)','rgb(254, 233, 161)', 'rgb(255, 129, 129)']
  bcolors: string[] = ['green', 'rgb(142, 128, 5)', 'rgb(150, 15, 15)']
  bgcolors: string[]=['rgb(86, 189, 34)','rgb(255, 204, 36)', 'rgb(189, 20, 20)']
  status: string = this.colors[0]
  buttonstatus: string = this.bcolors[0]
  bgstatus: string = this.bgcolors[0]

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.start()
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.stop()
  }


  start(){
    this.isrunning = true;
    this.subscription = interval(50).subscribe(() => {

    /* Cada que ya no queden segundos y quede por lo menos 1 minut
    se restara un minuto y se sumaran esos 60 segundos */
    if (this.realminutes>0 && this.realseconds == 0) {
      this.realminutes -= 1;
      //60 porque justo abajo se lo va a restar el segundo
      //para que quede en 59
      this.realseconds = 60;
    }


    //Resta un segundo
    this.realseconds -=1;
    this.realtime -=1;

    //aumenta el porcentaje segun el progreso que le corresponda cada segundo
    this.percentage+=this.onepercent

    //Cuando se acabe el tiempo se detiene el round
    if (this.realtime<=0) {
      this.stop()
    }

    if (this.realtime<=10) {
      this.status = this.colors[1];
      this.buttonstatus = this.bcolors[1];
      this.bgstatus = this.bgcolors[1];
    }

    if (this.realtime<1){
      this.status = this.colors[2];
      this.buttonstatus = this.bcolors[2];
      this.bgstatus = this.bgcolors[2];
    }

    })
  }

  stop(){
    if (this.subscription) {
      this.subscription.unsubscribe();

      /**La condicion isrunning esta hecha para el boton de pausa
         de manera que mientras queden segundos del tiempo se pueda poner 
         pausa, pero una vez llegue el contador a 0 el boton de pausa no 
         ejecute ninguna accion.*/
      if(this.realtime>0){
      this.isrunning = false;
      }
    }
  }

}

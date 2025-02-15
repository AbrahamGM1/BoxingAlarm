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

  //Tiempo en minutos y segundos que tendra la alarma
  realminutes:number = 1;
  realseconds:number = 0;

  //Realtime es todos los minutos en segundos para hacer la conversion
  //del porcentaje de la gráfica que se va a ir reduciendo
  realtime: number = (this.realminutes*60)+(this.realseconds);
  percentage: number = 0;
  onepercent: number = 100/this.realtime;

  //Tiempo en minutos y segundos de descanso
  restminutes:number = 1;
  restseconds:number = 0;

  //Mismo caso que Realtime, percentage y onepercent, solo que 
  //estas variables se enfocan al periodo de descanso del round, por eso el rest.
  resttime: number = (this.restminutes*60)+(this.restseconds);
  restpercentage: number = 0;
  restonepercent: number = 100/this.resttime;

  //Boolean para el boton de pausa
  isrunning: boolean = true;

  //Subscripción para los intervalos
  private subscription!: Subscription;

  //la cantidad de rounds que estara en bucle
  //siempre habra 1 round menos de descanso porque cuando acaba el ultimo round
  //no habra necesidad de poner periodo de descanso porque se supone que ya acabaste de entrenar
  rounds:number = 2;
  restrounds:number = this.rounds - 1;
  currentround:number = 1;
  
  //valor que indica si el round se encuentra en fase normal o en fase de descanso
  isresting:boolean = false;

  /**
   * COLORES:
   * colors - el color de la gráfica y del texto
   * bcolors - el color de los botones y del fondo de los marcadores
   * bgcolors - el color del fondo de la aplicacion
   */
  colors: string[]=['rgb(182, 255, 146)','rgb(254, 233, 161)', 'rgb(255, 129, 129)']
  bcolors: string[] = ['green', 'rgb(142, 128, 5)', 'rgb(150, 15, 15)']
  bgcolors: string[]=['rgb(86, 189, 34)','rgb(255, 204, 36)', 'rgb(189, 20, 20)']

  /**
   * Todos los status comienzan con el tono verde,
   * los status son las referencias de los colores que tendran los objetos html
   * con estos colores
   */
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

      console.log(this.isresting)
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

    //Cuando se acabe el tiempo comienza el periodo de descanso
    if (this.realtime<=0 && this.isresting==false) {
      this.status = this.colors[2];
      this.buttonstatus = this.bcolors[2];
      this.bgstatus = this.bgcolors[2];

      //cambio de round
      this.realminutes = this.restminutes
      this.realseconds = this.restseconds
      this.realtime = this.resttime
      this.percentage = this.restpercentage
      this.onepercent = this.restonepercent
      this.isresting = true;
    }

    ///TO DO
    if (this.realtime<=0) {
      this.status = this.colors[0];
      this.buttonstatus = this.bcolors[0];
      this.bgstatus = this.bgcolors[0];

      //cambio de round
      this.realminutes = this.realminutes
      this.realseconds = this.realseconds
      this.realtime = this.realtime
      this.percentage = this.percentage
      this.onepercent = this.onepercent
      this.isresting = false;
    }

    //Cuando quedan N cantidad de segundos se cambian todos los colores al tono amarillo
    if (this.realtime<=10) {
      this.status = this.colors[1];
      this.buttonstatus = this.bcolors[1];
      this.bgstatus = this.bgcolors[1];
    }

    //Cuando queda menos del segundo se cambian todos los colores al tono rojo
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

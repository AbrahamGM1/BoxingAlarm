import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { FormDataService } from '../../services/form-data.service';

@Component({
  selector: 'app-alarm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alarm.component.html',
  styleUrl: './alarm.component.scss'
})
export class AlarmComponent {

  //Tiempo en minutos y segundos que tendra la alarma
  realminutes:number = 2;
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


  //Los aux son la referencia del tiempo que dura un round normal, para que no se pierda al 
  //reemplazar los tiempos del round en el periodo de descanso
  auxminutes:number = this.realminutes;
  auxseconds:number = this.realseconds;
  auxpercentage:number = this.percentage;
  //No se referencia con realtime, porque realtime al mero inicio 
  //solo valdra los segundos de preparacion antes del primer round
  auxtime:number = (this.realminutes*60)+(this.realseconds);
  auxonepercent:number = this.onepercent;

  //Boolean para el boton de pausa
  isrunning: boolean = true;

  //Boolean para aparecer el boton de reset cuando se acaben todos los rounds
  finished: boolean = false;

  //Boolean para mostrar en pantalla la cuenta regresiva
  showcountdown: boolean = false;

  //Subscripción para los intervalos del round
  private subscription!: Subscription;
  private subscriptionC!: Subscription;

  //la cantidad de rounds que estara en bucle
  //siempre habra 1 round menos de descanso porque cuando acaba el ultimo round
  //no habra necesidad de poner periodo de descanso porque se supone que ya acabaste de entrenar
  rounds:number = 99;
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
  colors: string[]=['rgb(182, 255, 146)','rgb(254, 233, 161)', 'rgb(255, 129, 129)', 'rgb(211, 211, 211)']
  bcolors: string[] = ['green', 'rgb(142, 128, 5)', 'rgb(150, 15, 15)', 'rgb(32, 32, 32)']
  bgcolors: string[]=['rgb(86, 189, 34)','rgb(255, 204, 36)', 'rgb(189, 20, 20)', 'rgb(101, 101, 101)']

  /**
   * Todos los status comienzan con el tono verde,
   * los status son las referencias de los colores que tendran los objetos html
   * con estos colores
   */
  status = signal(this.colors[0]) 
  buttonstatus = signal(this.bcolors[0])
  bgstatus = signal(this.bgcolors[0])

  //segundos para prepararse
  countdown = 3;

  constructor(private dataService:FormDataService){};

  ngOnInit(): void {

    
    this.dataService.formData$.subscribe(data => {
      if (data) {
        this.rounds=data.rounds;
        this.realminutes=data.minutes;
        this.realseconds=data.seconds;
        this.realtime = (this.realminutes*60)+(this.realseconds);
        this.onepercent = 100/this.realtime;


        this.restrounds=data.rounds-1;
        this.restminutes=data.restminutes;
        this.restseconds=data.restseconds;
        this.resttime = (this.restminutes*60)+(this.restseconds);
        this.restonepercent = 100/this.resttime;

        this.auxminutes = this.realminutes;
        this.auxseconds = this.realseconds;
        this.auxpercentage = this.percentage;
        this.auxtime = (this.realminutes*60)+(this.realseconds);
        this.auxonepercent = this.onepercent;
         
      }
    });
    this.startcountdown(false)
  }

  ngOnDestroy(): void {

    this.stop()
  }

  //isByPause se pide de parametro para pasarselo al start cuando le toque ejecutarse
  startcountdown(isByPause:boolean){
    this.showcountdown = true;

    this.subscriptionC = interval(1000).subscribe(()=>{
      this.countdown -=1;
      if(this.countdown<=0){
        this.start(isByPause);
        this.countdown = 3;
        this.showcountdown = false;
        this.subscriptionC.unsubscribe();
      }
      
    })
  }

  start(isByPause:boolean){

    if(isByPause && !this.isresting){
      this.setGreenBackground()
    }

    if(isByPause && this.isresting){
      this.setRedBackground()
    }

    //Para indicarle al boton de pausa si debe de mostrar "pause" o "resume"
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

    //Cuando se acabe el tiempo comienza el periodo de descanso
    //Si ya no hay mas rounds detiene la alarma
    if (this.realtime<=0 && this.isresting==false) {
      if (this.currentround>=this.rounds) {
        this.stop();
      } else{
        this.changeToRest();
      }
    }
    //Si esta en periodo de descanso y se acaba el tiempo comienza el siguiente round
    if (this.realtime<=0 && this.isresting==true) {
      this.currentround++;
      this.changeToActive();
    }

    //Cuando quedan N cantidad de segundos se cambian todos los colores al tono amarillo
    if (this.realtime<=10) {
      this.setYellowBackground();
    }

    //Cuando queda menos del segundo se cambian todos los colores al tono rojo
    if (this.realtime<1 && this.currentround==this.rounds){
      this.setGrayBackground();
    }
    })
  }

  goToNextRound(){
    if(this.currentround<this.rounds && this.showcountdown==false){
      this.currentround++;
      this.subscription.unsubscribe();
      this.changeToActive();
      this.startcountdown(false);
    }
  }


  changeToRest(){
    this.setRedBackground();

    //cambio de round
    this.realminutes = this.restminutes
    this.realseconds = this.restseconds
    this.realtime = this.resttime
    this.percentage = this.restpercentage
    this.onepercent = this.restonepercent
    this.isresting = true;

  }

  changeToActive(){
    this.setGreenBackground();

    //cambio de round
    this.realminutes = this.auxminutes
    this.realseconds = this.auxseconds
    this.realtime = this.auxtime
    this.percentage = this.auxpercentage
    this.onepercent = this.auxonepercent
    this.isresting = false;
  }

  stop(){

    if (this.subscription && this.showcountdown==false) {
      this.subscription.unsubscribe();
      this.setGrayBackground();

      /**La condicion isrunning esta hecha para el boton de pausa
         de manera que mientras queden segundos del tiempo se pueda poner 
         pausa, pero una vez llegue el contador a 0 el boton de pausa no 
         ejecute ninguna accion.*/
      if(this.realtime>0){
      this.isrunning = false;
      } 

      if(this.realtime<=0){
        this.finished = true;
      }
    }
  }

  reset(){
    this.finished = false;
    this.currentround = 1;
    this.changeToActive();
    //para que ponga el background color verde como lo hace el boton pausa
    this.start(true)
  }

  setGreenBackground(){
    this.status.set(this.colors[0]);
    this.buttonstatus.set(this.bcolors[0]);
    this.bgstatus.set(this.bgcolors[0]);
  }

  setYellowBackground(){
    this.status.set(this.colors[1]);
    this.buttonstatus.set(this.bcolors[1]);
    this.bgstatus.set(this.bgcolors[1]);
  }

  setRedBackground(){
    this.status.set(this.colors[2]);
    this.buttonstatus.set(this.bcolors[2]);
    this.bgstatus.set(this.bgcolors[2]);
  }

  setGrayBackground(){
    this.status.set(this.colors[3]);
    this.buttonstatus.set(this.bcolors[3]);
    this.bgstatus.set(this.bgcolors[3]);
  }

}

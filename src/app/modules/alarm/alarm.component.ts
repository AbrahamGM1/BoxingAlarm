import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-alarm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alarm.component.html',
  styleUrl: './alarm.component.scss'
})
export class AlarmComponent {

  seconds:number = 0;
  tenseconds:number = 0;
  realseconds:number = 0;
  realminutes:number = 2;
  minutes:number = 0;
  tenminutes:number = 0;
  
  /**
   * El plan de los números es el siguiente:
   * como la vista es de 00:00, seconds se encargaria de los 9 digitos del lado derecho (00:01)
   * tenseconds de las decenas de segundos (00:10), misma lógica para los minutos
   * 
   * Esto se hace porque cada 0 tiene su propio ancho designado debido a que la fuente no es monoespaciada
   * 
   * como cada variable solo almacenara una unidad, realseconds almacenara los verdaderos segundos que pasan del 0 al 59
   * y con este valor es con el que se van a hacer las condiciones, lo mismo con realminutes
   */

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.runTimer()
  }


  runTimer(){
    setInterval(() => {
    /* Empiezas con segundos en 0 y unos minutos establecidos, al empezar
    tienes que comprobar que haya 1 minuto como mínimo y 0 segundos */
    if (this.realminutes>0 && this.realseconds == 0) {
      this.realminutes -= 1;
      //60 porque justo abajo se lo va a restar
      this.realseconds = 60;
    }

    //Resta un segundo
    this.realseconds -=1;

    }, 1000);

  }
  /**
   * Contador progresivo
   */
  runProgressiveTimer(){
    setInterval(() => {
      this.seconds +=1;
      this.realseconds+=1;

      if(this.seconds>=10){
        this.seconds = 0;
        this.tenseconds += 1;
      }

      if(this.realseconds>59){
        this.seconds = 0;
        this.tenseconds = 0;
        this.realseconds = 0;
        this.minutes +=1;
      }
    }, 1000);

  }


}

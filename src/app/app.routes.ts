import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./modules/menu/menu.component').then((c) => c.MenuComponent),
    },
    {
        path: 'alarm',
        loadComponent: () =>
            import('./modules/alarm/alarm.component').then((c) => c.AlarmComponent),
    }
];

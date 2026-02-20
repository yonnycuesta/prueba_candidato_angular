import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MenubarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Sistema de Gestión';
  
  menuItems: MenuItem[] = [
    {
      label: 'Entidades',
      icon: 'pi pi-building',
      routerLink: '/entidades'
    },
    {
      label: 'Contactos',
      icon: 'pi pi-users',
      routerLink: '/contactos'
    }
  ];
}

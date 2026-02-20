import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { StateEntidad } from '../interfaces/state-entidad';
import { ApiResponse, Entidad, EntidadForm } from '../interfaces/entidad';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntidadesService {
  private http = inject(HttpClient);
  private readonly url: string = environment.apiURL;
  
  #state = signal<StateEntidad>({
    loading: true,
    entidades: []
  });

  entidades = computed(() => this.#state().entidades);
  loading = computed(() => this.#state().loading);

  constructor() {
    this.refresh();
  }

  /** Método para refrescar los datos */
  refresh(): void {
    this.#state.update(state => ({ ...state, loading: true }));
    
    this.http.get<ApiResponse<Entidad[]>>(`${this.url}entidades`).pipe(
      map(response => response.data),
      tap(entidades => {
        this.#state.set({
          loading: false,
          entidades: entidades,
        });
      }),
      catchError(error => {
        console.error('Error al cargar entidades:', error);
        this.#state.set({ loading: false, entidades: [] });
        return of([]);
      })
    ).subscribe();
  }

  /** Obtener una entidad por ID */
  getById(id: number): Observable<Entidad | null> {
    return this.http.get<ApiResponse<Entidad>>(`${this.url}entidades/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error al obtener la entidad:', error);
        return of(null);
      })
    );
  }

  /** Crear una nueva entidad */
  create(entidad: EntidadForm): Observable<ApiResponse<Entidad>> {
    return this.http.post<ApiResponse<Entidad>>(`${this.url}entidades`, entidad).pipe(
      tap(() => this.refresh()),
      catchError(error => {
        console.error('Error al crear entidad:', error);
        throw error;
      })
    );
  }

  /** Actualizar una entidad existente */
  update(id: number, entidad: EntidadForm): Observable<ApiResponse<Entidad>> {
    return this.http.put<ApiResponse<Entidad>>(`${this.url}entidades/${id}`, entidad).pipe(
      tap(() => this.refresh()),
      catchError(error => {
        console.error('Error al actualizar entidad:', error);
        throw error;
      })
    );
  }

  /** Eliminar una entidad (o inactivarla si tiene contactos) */
  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.url}entidades/${id}`).pipe(
      tap(() => this.refresh()),
      catchError(error => {
        // Si falla porque tiene contactos asociados, inactivar en lugar de eliminar
        if (error.status === 400 || error.error?.message?.toLowerCase().includes('contacto')) {
          return this.http.put<ApiResponse<any>>(`${this.url}entidades/${id}`, { estado: 0 }).pipe(
            tap(() => this.refresh())
          );
        }
        console.error('Error al eliminar la entidad:', error);
        throw error;
      })
    );
  }

  /** Eliminar múltiples entidades */
  deleteMultiple(ids: number[]): Observable<any> {
    const deleteObservables = ids.map(id => this.delete(id));
    return new Observable(observer => {
      let completed = 0;
      let errors = 0;
      let inactivated = 0;
      let deleted = 0;

      deleteObservables.forEach(obs => {
        obs.subscribe({
          next: (response) => {
            completed++;
            // Si el mensaje indica inactivación, contarla como tal
            if (response?.message?.toLowerCase().includes('inactiv')) {
              inactivated++;
            } else {
              deleted++;
            }
            if (completed + errors === ids.length) {
              this.refresh();
              observer.next({ completed, errors, inactivated, deleted });
              observer.complete();
            }
          },
          error: () => {
            errors++;
            if (completed + errors === ids.length) {
              this.refresh();
              observer.next({ completed, errors, inactivated, deleted });
              observer.complete();
            }
          }
        });
      });
    });
  }
}

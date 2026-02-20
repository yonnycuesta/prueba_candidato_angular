export interface Entidad {
    ent_id?: number;
    ent_nombre: string;
    ent_nit: string;
    ent_direccion: string;
    ent_telefono: string;
    ent_email: string;
    ent_estado?: number;
    ent_created_at?: string;
}

export interface EntidadForm {
    nombre: string;
    nit: string;
    direccion: string;
    telefono: string;
    email: string;
    estado?: number;
}

export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
    error_code?: number;
    errors?: { [key: string]: string[] };
}

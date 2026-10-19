// Registro de módulos publicados. El orden es el de la pantalla de inicio.
import { episodio1 } from './episodio1';
import { episodio2 } from './episodio2';
import type { Episode } from './types';

export const episodios: Episode[] = [episodio1, episodio2];

export function episodioPorRuta(ruta: string | undefined): Episode | undefined {
  return episodios.find((e) => e.ruta === ruta);
}

export function episodioPorId(id: string): Episode | undefined {
  return episodios.find((e) => e.id === id);
}

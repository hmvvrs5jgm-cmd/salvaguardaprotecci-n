// Registro de módulos publicados. El orden es el de la pantalla de inicio.
import { episodio1 } from './episodio1';
import { episodio2 } from './episodio2';
import { episodio3 } from './episodio3';
import { episodio4 } from './episodio4';
import { episodio5 } from './episodio5';
import { episodio6 } from './episodio6';
import type { Episode } from './types';

export const episodios: Episode[] = [episodio1, episodio2, episodio3, episodio4, episodio5, episodio6];

export function episodioPorRuta(ruta: string | undefined): Episode | undefined {
  return episodios.find((e) => e.ruta === ruta);
}

export function episodioPorId(id: string): Episode | undefined {
  return episodios.find((e) => e.id === id);
}

// src/utils.js

/**
 * Formatta una stringa di data (da qualsiasi formato standard come ISO o YYYY-MM-DD) 
 * in un formato leggibile in italiano.
 * @param {string} dateString - La data in un formato standard.
 * @returns {string} La data formattata (es. "26 ottobre 2025") o un testo di fallback.
 */
export const formatDate = (dateString) => {
  // Se la stringa della data non esiste, restituisci subito un testo di fallback.
  if (!dateString) {
    return 'Data non disponibile';
  }

  // Crea un oggetto Date direttamente dalla stringa. 
  // Il costruttore di Date è in grado di interpretare correttamente i formati ISO.
  const date = new Date(dateString);

  // Dopo aver tentato di creare la data, controlla se è valida.
  // isNaN(date.getTime()) è il modo più affidabile per verificarlo.
  if (isNaN(date.getTime())) {
    return 'Data non valida'; // Restituisce un errore specifico se il formato è irriconoscibile.
  }

  
  return date.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
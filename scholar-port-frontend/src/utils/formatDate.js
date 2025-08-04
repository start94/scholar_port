// src/utils/formatDate.js
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // gestione errori date invalide
  if (isNaN(date.getTime())) return dateString;
  
  // formato italiano: "15 gennaio 2025"
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'Europe/Rome'
  };
  
  return date.toLocaleDateString('it-IT', options);
};

// funzione alternativa per formato breve
export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  // formato breve: "15/01/2025"
  return date.toLocaleDateString('it-IT');
};

const mongoose = require('mongoose');

// Configurazione globale per i test
jest.setTimeout(30000); // 30 secondi di timeout per i test

// Gestione globale degli errori non gestiti nei test
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Setup globale per tutti i test
beforeAll(async () => {
  // Configura variabili d'ambiente per i test se non sono già impostate
  if (!process.env.MONGODB_URI) {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/scholarport_test';
  }
  process.env.NODE_ENV = 'test';
});

// Cleanup globale dopo tutti i test
afterAll(async () => {
  // Assicura che tutte le connessioni siano chiuse
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});
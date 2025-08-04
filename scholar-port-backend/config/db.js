// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // --- MODIFICA CHIAVE QUI ---
    // Determina la stringa di connessione corretta.
    // 1. Usa MONGO_URI se è definito (da Docker Compose).
    // 2. Altrimenti, usa MONGODB_URI (dal tuo file .env locale).
    // 3. Se nessuno dei due è definito, lancia un errore.
    const dbUrl = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!dbUrl) {
      throw new Error('MongoDB URI is not defined in environment variables (MONGO_URI or MONGODB_URI).');
    }
    
    // Il tuo controllo per evitare connessioni multiple, molto utile!
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    const conn = await mongoose.connect(dbUrl);
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error(`❌ MongoDB Disconnect Error: ${error.message}`);
  }
};

// Ho notato che nel tuo server.js usi l'import con le graffe, quindi l'export deve essere questo.
// Se l'errore `connectDB is not a function` dovesse riapparire, cambia questo in `module.exports = connectDB;`
// e l'import in server.js in `const connectDB = require('./config/db');`
module.exports = { connectDB, disconnectDB };
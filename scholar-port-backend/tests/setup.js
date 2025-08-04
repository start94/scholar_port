// Questo file viene eseguito prima di tutti i test
// Imposto una URI di default per evitare che db.js vada in errore
process.env.MONGODB_URI = 'mongodb://localhost:27017/jest-test-db';
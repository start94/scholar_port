# ScholarPort: Gestore di Portfolio Accademico

Sviluppato da **Raffaele Diomaiuto**, studente di AI Development, come progetto full-stack per dimostrare competenze nello sviluppo di applicazioni web moderne, robuste e testabili.

##  Scelte Implementative

Questo progetto è nato con un obiettivo chiaro: costruire un'applicazione **solida, affidabile e funzionale**, concentrando le energie sulla qualità del codice, sulla logica di business e sulla testabilità.
-   **Architettura a due Progetti (`frontend` e `backend`):** Ho scelto di separare nettamente l'interfaccia utente dal server. Questa decisione, nota come "separazione delle competenze" , è fondamentale. Mi ha permesso di lavorare in modo ordinato, concentrandomi prima sulla costruzione di un'API robusta e poi su come "consumarla" con React. Questo rende l'applicazione più facile da mantenere e, in futuro, da scalare.
-   **Un Backend "che funziona":** Tutta la mia attenzione si è concentrata qui. Ho usato lo stack MERN (MongoDB e invece di sql perchè per questo progetto lo ritenevo più flessibile, Express, React, Node.js) perché mi permette di usare JavaScript ovunque, rendendo il processo più fluido. La scelta di MongoDB è stata strategica: la sua flessibilità è perfetta per gestire dati come gli abstract accademici, che possono variare in lunghezza e struttura.
-   **Un Frontend Funzionale e Diretto:** Riconosco che il design grafico non è il mio punto di forza principale. Per questo, ho volutamente mantenuto l'interfaccia utente **minimale e pulita**. La priorità assoluta era garantire che ogni funzionalità fosse impeccabile, intuitiva e priva di bug. Ho gestito lo stato con gli hook di base di React (`useState`, `useEffect`) perché sono perfetti per un'applicazione di questa scala e mantengono il codice semplice e leggibile, senza aggiungere complessità inutili. Considero questa base funzionale un ottimo punto di partenza e sono aperto a suggerimenti su come migliorarne l'aspetto grafico.
-   **Testare, Testare, Testare:** 
    -   Per il **backend**, ho scritto test di integrazione con `Supertest` che simulano vere chiamate API, controllando che ogni operazione (creazione, lettura, modifica, eliminazione) si comporti esattamente come previsto.
    -   Per il **frontend**, ho usato `React Testing Library` per scrivere test che imitano le azioni di un utente reale , assicurandomi che l'interfaccia risponda correttamente.


 # PER IL COACH CHE DEVE ESEGUIRE IL PROGRAMMA 
## 📋 Prerequisiti

-   [Node.js](https://nodejs.org/) (v18.x o superiore)
-   npm (incluso con Node.js)
-   [MongoDB](https://www.mongodb.com/try/download/community) (istanza locale o stringa di connessione a un servizio cloud come MongoDB Atlas)

## 🚀 Installazione e Configurazione
### 2. Configurazione del Backend

1.  **dalla riga di comando :**
    
    cd scholar-port-backend
    
2.  **Installa le dipendenze:**
    
    npm install
    
3.  **Crea il file `.env`** nella root di `scholar-port-backend` e configuralo:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/scholarport
    CLIENT_URL=http://localhost:3000
    ```

### 3. Configurazione del Frontend

1.  **Apri un nuovo terminale** e naviga nella cartella del frontend:
    
    cd scholar-port-frontend
    ```
2.  **Installa le dipendenze:**
    ```bash
    npm install
    ```
3.  **Crea il file `.env`** nella root di `scholar-port-frontend` e configuralo (il prefisso `REACT_APP_` è obbligatorio):
    ```env
    REACT_APP_API_URL=http://localhost:5000/api
    ```

## Esecuzione del Progetto

### 1. Avviare il Server Backend

Nel terminale di `scholar-port-backend`:
npm run dev
Il server sarà disponibile su `http://localhost:5000`.

### 2. Avviare l'Applicazione Frontend

Nel secondo terminale, in `scholar-port-frontend`:
```bash
npm start
```
L'applicazione React sarà disponibile su `http://localhost:3000`.


Esecuzione con Docker:

Questo è il modo più semplice e veloce per avviare l'intero ambiente di sviluppo con un singolo comando.
 Garantisce che l'applicazione funzioni in un ambiente consistente, senza problemi di compatibilità.

### Prerequisiti
Assicurati di avere Docker Desktopinstallato e in esecuzione sul tuo sistema.

### Avvio dell'Applicazione
 **Avvia tutti i servizi** (frontend, backend, database):
    -   **Per il primo avvio**
        
        docker-compose up --build
        
        Questo comando costruirà le immagini dei container e poi avvierà i servizi. Potrebbe impiegare alcuni minuti.
    -   **Per gli avvii successivi** (se le immagini sono già state costruite):
        ```bash
        docker-compose up
        ```
        Questo riavvierà i servizi molto più velocemente.

 **Accesso all'Applicazione:**
    Una volta che i container sono stati avviati, l'applicazione sarà disponibile:
    -   **Frontend:** `http://localhost:3000`
    -   **Backend (API):** `http://localhost:5000`
    -   **Database (MongoDB):** `localhost:27017`

### Gestione dei Servizi Docker

-   **Per fermare tutti i servizi:**
    Premi `CTRL + C` nel terminale dove hai eseguito `docker-compose up`.
-   **Per fermare e rimuovere i container, le reti e i volumi (per una pulizia completa):**
    nella riga di comando : 
    docker-compose down


## Testing

Per verificare l'integrità del codice, esegui le suite di test in entrambe le cartelle.
N.B per i test sul frontend ho passato i guai 
### Esegui i Test del Backend
```bash
cd scholar-port-backend
npm test
```

### Esegui i Test del Frontend
```bash
cd scholar-port-frontend
npm test




## 📁 Struttura del Progetto

scholarport-project/
│
├── scholar-port-backend/ # Contiene tutta la logica del server Node.js
│ ├── config/ # File di configurazione (es. connessione al DB)
│ ├── controllers/ # Logica di business: gestisce le richieste e le risposte
│ ├── models/ # Schemi Mongoose che definiscono la struttura dei dati
│ ├── routes/ # Definizione degli endpoint dell'API (es. /api/articles)
│ ├── tests/ # Test di integrazione per gli endpoint dell'API
│ ├── .env # File per le variabili d'ambiente (non versionato)
│ └── server.js # Punto di ingresso principale del server Express
│
├── scholar-port-frontend/ # Contiene tutta l'applicazione React (client-side)
│ ├── src/ # Cartella principale del codice sorgente
│ │ ├── components/ # Componenti React riutilizzabili e i loro test specifici
│ │ ├── utils/ # Funzioni di utilità (es. formattazione date)
│ │ ├── App.js # Componente radice dell'applicazione
│ │ ├── App.test.js # Test per il componente radice App
│ │ └── api.js # Modulo centralizzato per le chiamate all'API del backend
│ ├── .env # File per le variabili d'ambiente del client
│ └── public/ # File statici (es. index.html, favicon)
│
└── README.md # Questo file di documentazione

## 👤 Autore

-   **Raffaele Diomaiuto** - *Studente di AI Development*
[Profilo GitHub](https://github.com/start94)
    

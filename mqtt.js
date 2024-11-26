const mqtt = require('mqtt');
const mysql = require('mysql2');

// Configurazione del database
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Vmware1!', // Inserisci la tua password
    database: 'casetta_del_acqua' // Modificato il nome del database per evitare spazi
});

// Connessione al database
db.connect((err) => {
    if (err) {
        console.error('Errore durante la connessione al database:', err);
        process.exit(1); // Arresta il programma in caso di errore
    } else {
        console.log('Connesso al database MySQL');
    }
});

// Connessione al broker MQTT
const mqttClient = mqtt.connect('mqtt://test.mosquitto.org'); // Broker pubblico Mosquitto

mqttClient.on('connect', () => {
    console.log('Connesso al broker MQTT');

    // Sottoscrizione al topic
    mqttClient.subscribe('water_coolers/+/data', (err) => {
        if (err) {
            console.error('Errore durante la sottoscrizione:', err);
        } else {
            console.log('Sottoscritto al topic water_coolers/+/data');
        }
    });
});

// Gestione degli errori MQTT
mqttClient.on('error', (err) => {
    console.error('Errore nella connessione al broker MQTT:', err);
});

// Gestione dei messaggi MQTT
mqttClient.on('message', (topic, message) => {
    console.log(`Messaggio ricevuto su ${topic}:`, message.toString());

    let payload;

    // Decodifica del messaggio
    try {
        payload = JSON.parse(message.toString());
        console.log('Dati decodificati:', payload);
    } catch (err) {
        console.error('Errore durante la conversione del messaggio in JSON:', err);
        return; // Esce se il messaggio non è un JSON valido
    }

    // Prepara i dati per l'inserimento nel database
    const values = [
        payload.WaterLevel,
        payload.WaterPressure,
        payload.WaterTemp
    ];

    // Query per inserire i dati nel database
    const query = `
        INSERT INTO sensori (WaterLevel, WaterPressure, WaterTemp)
        VALUES (?, ?, ?)
    `;

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Errore durante l\'inserimento nel database:', err);
        } else {
            console.log('Dati registrati nel database con successo. ID:', result.insertId);
        }
    });
});

// Simulazione di messaggi per test
// Usa questa funzione per verificare il funzionamento del codice senza un vero broker MQTT
function simulateMessage() {
    const testMessage = JSON.stringify({
        WaterLevel: 75,
        WaterPressure: 1.5,
        WaterTemp: 22.8
    });
    mqttClient.emit('message', 'water_coolers/1/data', testMessage);
    console.log('Simulazione messaggio completata.');
}

// Abilita la simulazione (opzionale)
// simulateMessage();

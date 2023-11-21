const axios = require('axios');

let dataStore = [];

const connect = () => {
    console.log('Conectado a la base de datos (almacenamiento en memoria)');
}

const getDB = () => dataStore;

const syncDataWithExternalService = async () => {
    try {
        const response = await axios.get('http://www.raydelto.org/agenda.php');
        dataStore = response.data;
        console.log('Datos sincronizados con el servicio externo');
    } catch (error) {
        console.error('Error al sincronizar datos con el servicio externo:', error);
    }
}

module.exports = { connect, getDB, syncDataWithExternalService };

const express = require('express');
const axios = require('axios');
const { connect, getDB, syncDataWithExternalService } = require('./DB/mongodb');
const Joi = require('joi');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Definir el esquema de validación
const contactoSchema = Joi.object({
    nombre: Joi.string().required(),
    apellido: Joi.string().required(),
    telefono: Joi.string().required().length(10),
});

// Define Routes
app.get('/', async (req, res) => {
    const contactos = getDB(); // Obtener contactos del almacenamiento en memoria
    res.json(contactos);
});

app.post('/', async (req, res) => {
    // Validar la entrada
    const { error } = contactoSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { nombre, apellido, telefono } = req.body;
    const nuevoContacto = { nombre, apellido, telefono };

    // Almacenar el nuevo contacto en el almacenamiento en memoria
    const dataStore = getDB();
    dataStore.push(nuevoContacto);

    res.json(nuevoContacto);
});

// Conectar y sincronizar datos con el servicio externo
try {
    connect();
    syncDataWithExternalService().then(() => {
        // Iniciar el servidor después de que se hayan sincronizado los datos
        app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
    });
} catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
}

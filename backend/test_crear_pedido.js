require('dotenv').config(); const fs = require('fs');
const http = require('http');

const payload = JSON.parse(fs.readFileSync('debug_payload.json', 'utf8'));
// Simularemos el request. Pero no tenemos el token JWT real.
// En su lugar, usaremos el endpoint para crear pedido pasando un body válido,
// pero esto nos dará 401 si no tenemos token. 
// Para ver por qué daría 404, llamaremos directamente a la función crearPedido de controller.

const { crearPedido } = require('./controllers/pedido.controller.js');
const req = {
  body: payload.body,
  usuario: payload.user
};

const res = {
  status: function(code) {
    console.log('STATUS:', code);
    return this;
  },
  json: function(data) {
    console.log('JSON:', data);
    return this;
  }
};

async function test() {
  await crearPedido(req, res);
}
test();

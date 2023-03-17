const express = require('express');
const { readJson, readTalkerById, 
  generateToken, validateEmail, 
  validatePassword, addNewTalker, 
  validateToken, validateName, 
  validateAge, validateTalkAndWatchedAt, validateTalkRate, validateId, 
  editTalkerById, deleteTalkerById, 
  findTalkerByTerm, findTalkerByRate, 
  validateQueryRate, 
  validateQueryDate, 
  findByDate, 
  editTalkerRateById, 
  validateRate } = require('./appUtils');

const app = express();
const connection = require('./db/connection');
const { findAll } = require('./db/tasksDB');

app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// req 1
app.get('/talker', async (req, res) => res.status(200).send(await readJson()));

// req 12
app.get('/talker/db', async (req, res) => {
  const [result] = await findAll();
  const reestructuredArray = result.map((talker) => (
    { name: talker.name, 
      age: talker.age, 
      id: talker.id, 
      talk: { watchedAt: talker.talk_watched_at, rate: talker.talk_rate } }));
  return res.status(200).json(reestructuredArray);
});

// req 8, 9 e 10
app.get('/talker/search', validateToken, validateQueryRate, validateQueryDate, async (req, res) => {
  const { q, rate, date } = req.query;
  console.log(q, rate);
  if (!date) {
    if (!q) return res.status(200).send(findTalkerByRate(await readJson(), rate));
    return res.status(200).send(findTalkerByRate(await findTalkerByTerm(q), rate));
  }
  if (!q) return res.status(200).send(findByDate(findTalkerByRate(await readJson(), rate), date));
  return res.status(200).send(findByDate(findTalkerByRate(await findTalkerByTerm(q), rate), date));
});

// req 2
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkerById = await readTalkerById(Number(id));
  if (talkerById) return res.status(200).send(talkerById);
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});
// req 3
app.post('/login', validateEmail, validatePassword, (req, res) => {
  const token = generateToken();
  return res.status(200).send({
    token,
  });
});
// req 5
app.post('/talker', validateToken, 
validateName, validateAge, validateTalkAndWatchedAt, validateTalkRate, async (req, res) => {
  const newTalker = req.body;
  return res.status(201).send(await addNewTalker(newTalker));
});
// req 6
app.put('/talker/:id', validateId, validateToken, 
validateName, validateAge, validateTalkAndWatchedAt, validateTalkRate, async (req, res) => {
  const id = Number(req.params.id);
  return res.status(200).send(await editTalkerById(id, req));
});
// req 7
app.delete('/talker/:id', validateToken, async (req, res) => {
  const id = Number(req.params.id);
  return res.status(204).send(await deleteTalkerById(id));
});
// req 11
app.patch('/talker/rate/:id', validateToken, validateRate, async (req, res) => {
  const id = Number(req.params.id);
  const rateToEdit = req.body.rate;
  return res.status(204).send(await editTalkerRateById(id, rateToEdit));
});

app.listen(PORT, async () => {
  console.log('Online');

  const [result] = await connection.execute('SELECT 1');
  if (result) {
  console.log('MySQL connection OK');
}
});

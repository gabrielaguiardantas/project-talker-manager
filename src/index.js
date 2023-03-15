const express = require('express');
const { readJson, readTalkerById, 
  generateToken, validateEmail, 
  validatePassword, addNewTalker, 
  validateToken, validateName, validateAge, validateTalkAndWatchedAt } = require('./appUtils');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// req 1
app.get('/talker', async (req, res) => res.status(200).send(await readJson()));

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
validateName, validateAge, validateTalkAndWatchedAt, async (req, res) => {
  const newTalker = req.body;
  addNewTalker(newTalker);
  return res.status(201).send(newTalker);
});

app.listen(PORT, () => {
  console.log('Online');
});

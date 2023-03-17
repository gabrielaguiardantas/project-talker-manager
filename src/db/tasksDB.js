const conn = require('./connection');

const insert = (task) => conn.execute(
  'INSERT INTO talkers (nome, descricao) VALUES (?, ?)',
  [task.nome, task.descricao],
);

const update = (task, id) => conn.execute(
  'UPDATE talkers SET nome = ?, descricao = ? WHERE id = ?',
  [task.nome, task.descricao, id],
);

const remove = (id) => conn.execute(
  'DELETE FROM talkers WHERE id = ?',
  [id],
);

const findAll = () => conn.execute(
  'SELECT * FROM talkers',
);

const findById = (id) => conn.execute(
  'SELECT * FROM talkers WHERE id = ?',
  [id],
);

module.exports = {
  insert,
  update,
  remove,
  findAll,
  findById,
};
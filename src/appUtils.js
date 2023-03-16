const fs = require('fs').promises;
const path = require('path');

// req 1
async function readJson() {
  const talkers = await fs.readFile(path.resolve('./src/talker.json'), 'utf-8');
  return JSON.parse(talkers);
}
// req 2
async function readTalkerById(id) {
    const talkers = await fs.readFile(path.resolve('./src/talker.json'), 'utf-8');
    const talkersArray = JSON.parse(talkers);
    return talkersArray.find((talker) => talker.id === id);
}

function generateToken() {
    const rand = Math.random().toString(36).substring(2);
    const token = (rand + rand + rand).substring(0, 16);
    return token;
}
// req 4
function validateEmail(req, res, next) {
    const { email } = req.body;
    if (!email) {
 return res.status(400).json({
        message: 'O campo "email" é obrigatório',
    }); 
}
    if (!(email.includes('@') && email.includes('.com') && !email.includes('@.com'))) {
 return res.status(400).json({
        message: 'O "email" deve ter o formato "email@email.com"',
    }); 
}
    next();
}
function validatePassword(req, res, next) {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({
            message: 'O campo "password" é obrigatório',
          });
    }
    if (password.length < 6) {
        return res.status(400).json({
            message: 'O "password" deve ter pelo menos 6 caracteres',
          });
    }
    next();
}
// req 5
async function addNewTalker(newTalker) {
    const talkers = await fs.readFile(path.resolve('./src/talker.json'), 'utf-8');
    const talkersArray = JSON.parse(talkers);
    const objectTalker = {
        name: newTalker.name,
        age: newTalker.age,
        id: talkersArray.length + 1,
        talk: {
            watchedAt: newTalker.talk.watchedAt,
            rate: newTalker.talk.rate,
        },
    };
    talkersArray.push(objectTalker);
    await fs.writeFile(path.resolve(__dirname, './talker.json'), 
    JSON.stringify(talkersArray, null, 2));
    return objectTalker;
}

function validateToken(req, res, next) {
    const token = req.header('authorization');
    if (!token) {
        return res.status(401).send({
        message: 'Token não encontrado',
        }); 
    }
    if (!(token.length === 16 && typeof (token) === 'string')) {
        return res.status(401).send({
        message: 'Token inválido',
    }); 
    }
    next();
}

function validateName(req, res, next) {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send({
               message: 'O campo "name" é obrigatório',
        }); 
    }
    if (name.length < 3) {
        return res.status(400).send({
               message: 'O "name" deve ter pelo menos 3 caracteres',
        }); 
    }
    next();
}

function validateAge(req, res, next) {
    const { age } = req.body;
    if (!age) {
        return res.status(400).send({
        message: 'O campo "age" é obrigatório',
        }); 
    }
    if (!Number.isInteger(age) || age < 18) {
        return res.status(400).send({
        message: 'O campo "age" deve ser um número inteiro igual ou maior que 18',
        });
    }
    next();
}

function validateTalkAndWatchedAt(req, res, next) {
    const { talk } = req.body;
    if (!talk) return res.status(400).send({ message: 'O campo "talk" é obrigatório' }); 
    const { watchedAt } = req.body.talk;
    if (!watchedAt) return res.status(400).send({ message: 'O campo "watchedAt" é obrigatório' }); 
    const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!watchedAt.match(dateFormat)) {
        return res.status(400)
        .send({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
    } 
    next();
}

function validateTalkRate(req, res, next) {
    const { rate } = req.body.talk;
    switch (true) {
        case rate === undefined: return res.status(400).send({
            message: 'O campo "rate" é obrigatório',
          });
        case rate < 1 || rate > 5 || !Number.isInteger(rate): return res.status(400).send({
            message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
        });
        default: next();
    }
}

module.exports = {
    readJson,
    readTalkerById,
    generateToken,
    validateEmail,
    validatePassword,
    addNewTalker,
    validateToken,
    validateName,
    validateAge,
    validateTalkAndWatchedAt,
    validateTalkRate,
};

const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

router.post('/createUser', controller.createUser);
router.post('/loginUser', controller.loginUser);
router.get('/fetchQuestions', controller.fetchQuestions);
router.post('/result', controller.result);
router.get('/getResults', controller.getResults);

module.exports = router;

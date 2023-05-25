const express = require('express');
const router = express.Router();
const ChatController = require('../src/controllers/ChatController')

/* GET users listing. */
router.post('/', ChatController.Chat);

module.exports = router;

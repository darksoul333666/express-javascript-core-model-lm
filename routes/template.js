const express = require('express');
const router = express.Router();
const TemplateController = require('../src/controllers/TemplateController')

/* GET users listing. */
router.post('/create', TemplateController.CreateTemplate);
router.get('/get', TemplateController.GetTemplatesList);

module.exports = router;

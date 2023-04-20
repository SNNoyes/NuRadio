const { Router } = require('express');
const router = Router();
const controller = require('./controller.js');

router.get("/", controller.sendHello);
router.get("/tracks", controller.listFiles);
router.get("/tracks/:file", controller.serveFile);

module.exports = router;
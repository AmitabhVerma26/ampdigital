var express = require('express');
var router = express.Router();

// Define the route for /manage/team
router.get('/team', function(req, res, next) {
    res.send('Team Management Page');
});

module.exports = router;

const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {


    res.json({ household: {
        zipcode: 91701
    }});
});

module.exports = router;
const router = require('express').Router();
const DeviceSession = require('../models/DeviceSession');

router.get('/', (req, res) => {
    res.send('On device sessions get')
});

//Start a device session
router.post('/', async (req, res) => {
    const dvcSsn = new DeviceSession ({
        startTime: req.body.startTime,
        owner: req.body.owner,
        macAddress: req.body.macAddress,
        data: req.body.data
    });
    console.log(dvcSsn)
    try { 
        const savedDvcSsn = await dvcSsn.save();
        //Send session id back to device
        res.send(savedDvcSsn._id);
    } catch(err) {
        res.json({ message: err});
    }
});

//Update a device session
router.patch('/:dvcSsnId', async (req, res) => {
    try { 
        console.log(req.params.dvcSsnId);
        console.log(req.body.data);
        const updatedDvcSsn = await DeviceSession.findByIdAndUpdate(
            req.params.dvcSsnId,
            { $push : { data: req.body.data} }
        );
        res.json(updatedDvcSsn);
    } catch(err) {
        res.json({ message: err});
    }
});

module.exports = router
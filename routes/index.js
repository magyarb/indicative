var express = require('express');
var router = express.Router();
var db = require('../db');

//return capex based on filled data

router.get('/capex', function (req, res, next) {
  var channels = req.query.channels || 0;
  var speed = req.query.speed || 0;
  Promise.all([
    //finding the general expenses
    db.Expense.findAll({
      where: {
        expType: "capex",
        $and: [{$or: [{service: req.query.service}, {service: 'all'}]},
          {$or: [{maxSpeed: {$gte: speed}}, {maxSpeed: null}]}, //gte: greater than or equal
          {$or: [{maxChannels: {$gte: channels}}, {maxChannels: null}]},
          {type: null}]
      }
    }),
    //finding the CPE
    db.Expense.findAll({
      where: {
        expType: "capex",
        $and: [{$or: [{service: req.query.service}, {service: 'all'}]},
          {$or: [{maxSpeed: {$gte: speed}}, {maxSpeed: null}]}, //gte: greater than or equal
          {$or: [{maxChannels: {$gte: channels}}, {maxChannels: null}]},
          {type: 'CPE'}]
      },
      order: [['price', 'ASC']]
    }),
    db.Expense.findAll({
      where: {
        expType: "capex",
        $and: [{$or: [{service: req.query.service}, {service: 'all'}]},
          {$or: [{maxSpeed: {$gte: speed}}, {maxSpeed: null}]}, //gte: greater than or equal
          {$or: [{maxChannels: {$gte: channels}}, {maxChannels: null}]},
          {type: 'TRM'}]
      },
      order: [['price', 'ASC']]
    })
  ]).then(function (results) {
    var ret = results[0]; //general expenses
    ret.push(results[1][0]); //cheapest suitable cpe
    ret.push(results[2][0]); //cheapest suitable trm
    res.send(ret);
  });
});

router.get('/opex', function (req, res, next) {
  var channels = req.query.channels || 0;
  var speed = req.query.speed || 0;
  Promise.all([
    //finding the general expenses
    db.Expense.findAll({
      where: {
        expType: "opex",
        $and: [{$or: [{service: req.query.service}, {service: 'all'}]},
          {$or: [{maxSpeed: {$gte: speed}}, {maxSpeed: null}]}, //gte: greater than or equal
          {$or: [{maxChannels: {$gte: channels}}, {maxChannels: null}]},
          {type: null}]
      }
    }),
    //finding the CG
    db.Expense.findAll({
      where: {
        expType: "opex",
        $and: [{$or: [{service: req.query.service}, {service: 'all'}]},
          {$or: [{maxSpeed: {$gte: speed}}, {maxSpeed: null}]}, //gte: greater than or equal
          {$or: [{maxChannels: {$gte: channels}}, {maxChannels: null}]},
          {type: 'CG'}]
      },
      order: [['price', 'ASC']]
    }),
    db.Expense.findAll({
      where: {
        expType: "opex",
        $and: [{$or: [{service: req.query.service}, {service: 'all'}]},
          {$or: [{maxSpeed: {$gte: speed}}, {maxSpeed: null}]}, //gte: greater than or equal
          {$or: [{maxChannels: {$gte: channels}}, {maxChannels: null}]},
          {type: 'TRM'}]
      },
      order: [['price', 'ASC']]
    })
  ]).then(function (results) {
    var ret = results[0]; //general expenses
    ret.push(results[1][0]); //cheapest suitable cpe
    ret.push(results[2][0]); //cheapest suitable trm
    res.send(ret);
  });
});

//return locations for list
router.get('/locations', function (req, res, next) {
  db.Location.findAll().then(function (data) {
    res.send(data);
  });
});

module.exports = router;

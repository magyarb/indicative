var express = require('express');
var router = express.Router();

const config = {
  user: 'testuser',
  password: 'test',
  server: '127.0.0.1', // You can use 'localhost\\instance' to connect to named instance
  database: 'tdb',
  options: {
    encrypt: false // Use this if you're on Windows Azure
  }
};

//creating connection pool
const sql = require('mssql');
var spool;
sql.connect(config).then(pool => {
  // Query
  spool = pool;
  return pool;
});

router.get('/', function (req, res, next) {
  var isRequest = false;
  if (req.query.service !== undefined) {
    isRequest = true;
  }
  var loc;
  var sumc = 0;
  var sumo = 0;
  var capexdata;
  //console.log(isRequest);
  spool.request()
    .query("SELECT * FROM [tdb].[dbo].[DST3]").then(locations => {
    loc = locations;
    if (!isRequest) {
      res.render('index', {capex: null, opex: null, sumc: 0, sumo: 0, places: loc.recordset});
      return;
    }
    //handling results
    spool.request()
      .input('service', req.query.service)
      .input('speed', sql.Int, req.query.speed)
      .input('channels', sql.Int, req.query.channels)
      .input('distance', sql.Int, req.query.distance)
              .query(`
          SELECT name, price, amount, price*amount as sum, type FROM
        (SELECT TOP 1 *  FROM [tdb].[dbo].[CAPEX2]
        WHERE (service = 'all' OR service = @service) 
        AND (type = 'CPE')
        AND ((maxSpeed >= @speed OR maxSpeed IS NULL)
        AND (maxDistance >= @distance OR maxDistance IS NULL)
        AND (maxChannels >= @channels OR maxChannels IS NULL))
        ORDER BY price*amount ASC) as cpe
        
        UNION
        
        SELECT name, price, amount, price*amount as sum, type FROM
        (SELECT TOP 1 *  FROM [tdb].[dbo].[CAPEX2]
        WHERE (service = 'all' OR service = @service) 
        AND (type = 'TRM')
        AND ((maxSpeed >= @speed OR maxSpeed IS NULL)
        AND (maxDistance >= @distance OR maxDistance IS NULL)
        AND (maxChannels >= @channels OR maxChannels IS NULL))
        ORDER BY price*amount ASC) as trm
        
        UNION 
        
        SELECT name, price, amount, price*amount as sum, type  FROM [tdb].[dbo].[CAPEX2]
        WHERE (service = 'all' OR service = @service) 
        AND (type IS NULL)
        AND ((maxSpeed >= @speed OR maxSpeed IS NULL)
        AND (maxDistance >= @distance OR maxDistance IS NULL)
        AND (maxChannels >= @channels OR maxChannels IS NULL))
        
        ORDER BY type DESC
`).then(result => {
      //handling results
      capexdata = result;
      for (var item in result.recordset)
      {
        sumc += result.recordset[item].sum;
      }
      spool.request()
        .input('service', req.query.service)
        .input('speed', sql.Int, req.query.speed)
        .input('channels', sql.Int, req.query.channels)
        .input('distance', sql.Int, req.query.distance)
        .query(`
          SELECT name, price, amount, price*amount as sum, type FROM
(SELECT TOP 1 *  FROM [tdb].[dbo].[OPEX]
WHERE (service = 'all' OR service = @service) 
AND (type = 'TRM')
AND ((maxSpeed >= @speed OR maxSpeed IS NULL)
AND (maxDistance >= @distance OR maxDistance IS NULL)
AND (maxChannels >= @channels OR maxChannels IS NULL))
ORDER BY price*amount ASC) as cpe

UNION

SELECT name, price, amount, price*amount as sum, type FROM
(SELECT TOP 1 *  FROM [tdb].[dbo].[OPEX]
WHERE (service = 'all' OR service = @service) 
AND (type = 'CG')
AND ((maxSpeed >= @speed OR maxSpeed IS NULL)
AND (maxDistance >= @distance OR maxDistance IS NULL)
AND (maxChannels >= @channels OR maxChannels IS NULL))
ORDER BY price*amount ASC) as trm

UNION

SELECT name, price, amount, price*amount as sum, type FROM
(SELECT TOP 1 *  FROM [tdb].[dbo].[OPEX]
WHERE (service = 'all' OR service = @service) 
AND (type = 'DST')
AND ((maxSpeed >= @speed OR maxSpeed IS NULL)
AND (maxDistance >= @distance OR maxDistance IS NULL)
AND (maxChannels >= @channels OR maxChannels IS NULL))
ORDER BY price*amount ASC) as dst

UNION 

SELECT name, price, amount, price*amount as sum, type  FROM [tdb].[dbo].[OPEX]
WHERE (service = 'all' OR service = @service) 
AND (type IS NULL)
AND ((maxSpeed >= @speed OR maxSpeed IS NULL)
AND (maxDistance >= @distance OR maxDistance IS NULL)
AND (maxChannels >= @channels OR maxChannels IS NULL))

ORDER BY type DESC

`).then(result => {
        //handling results
        for (var item in result.recordset)
        {
          sumo += result.recordset[item].sum;
        }
        // var sumc = result.recordset[0].asd;
        //var sumo = result.recordset[1].asd;
        res.render('index', {capex: capexdata.recordset, opex: result.recordset, sumc: sumc, sumo: sumo, places: loc.recordset});
      }).catch(err => {
        // ... error checks
        console.log(err);
      });
    }).catch(err => {
      // ... error checks
      console.log(err);
    });
  }).catch(err => {
    // ... error checks
    console.log(err);
  });
  /*
   sql.connect(config).then(pool => {
   // Query
   return pool.request()
   .query("SELECT TOP (1000) [asd]  FROM [tdb].[dbo].[lofasz]")
   }).then(result => {
   //handling results
   var capex = [{item: "asd", price: "500"},{item: "as4d", price: "5002"}];
   var opex = [{item: "asd", price: "500"},{item: "as4d", price: "5002"}];
   var sumc = result.recordset[0].asd;
   var sumo = result.recordset[1].asd;
   res.render('index', { title: 'Express', capex: capex, opex: opex, sumc: sumc, sumo: sumo });
   }).catch(err => {
   // ... error checks
   console.log(err);
   });*/
});

module.exports = router;

var express = require('express');
var router = express.Router();
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
/*
 var config = {
 userName: 'testuser', // update me
 password: 'test', // update me
 server: '127.0.0.1', // update me
 options: {
 database: 'tdb' //update me
 }
 }
 */

const config = {
  user: 'testuser',
  password: 'test',
  server: '127.0.0.1', // You can use 'localhost\\instance' to connect to named instance
  database: 'tdb',
  options: {
    encrypt: false // Use this if you're on Windows Azure
  }
};

/*
 // Create connection to database
 var config = {
 userName: 'testuser', // update me
 password: 'test', // update me
 server: '127.0.0.1', // update me
 options: {
 database: 'tdb' //update me
 }
 }
 var connection = new Connection(config);

 // Attempt to connect and execute queries if connection goes through
 connection.on('connect', function(err) {
 if (err) {
 console.log(err)
 }
 else{
 queryDatabase()
 }
 });

 function queryDatabase(){
 console.log('Reading rows from the Table...');

 // Read all rows from table
 request = new Request(
 "SELECT 1 as 'lofasz'",
 function(err, rowCount, rows) {
 console.log(rowCount + ' row(s) returned');
 }
 );

 request.on('row', function(columns) {
 columns.forEach(function(column) {
 console.log("%s\t%s", column.metadata.colName, column.value);
 });
 });

 connection.execSql(request);
 };*/
//creating connection pool
const sql = require('mssql');
var spool;
sql.connect(config).then(pool => {
  // Query
  spool = pool;
  return pool;
});

//Server=localhost;Database=master;Trusted_Connection=True;

/* GET home page. */
router.get('/', function (req, res, next) {
  bool isRequest = false;
  if (req.query.duration !== undefined)
    isRequest =true;

  spool.request()
    .query("SELECT TOP (1000) [asd]  FROM [tdb].[dbo].[lofasz]").then(result => {
    //handling results
    var capex = [{item: "asd", price: "500"}, {item: "as4d", price: "5002"}];
    var opex = [{item: "asd", price: "500"}, {item: "as4d", price: "5002"}];
    var sumc = result.recordset[0].asd;
    var sumo = result.recordset[1].asd;
    res.render('index', {title: 'Express', capex: capex, opex: opex, sumc: sumc, sumo: sumo});
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

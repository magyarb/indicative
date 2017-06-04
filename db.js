/**
 * Created by balazs on 6/3/2017.
 */
/**
 * Created by balazs on 5/23/2017.
 */

var env = {
  postgresSettings: {
    user: 'test', //env var: PGUSER
    database: 'indicative', //env var: PGDATABASE
    password: 'test', //env var: PGPASSWORD
  }
};

var Sequelize = require("sequelize");
var sequelize = new Sequelize(env.postgresSettings.database, env.postgresSettings.user, env.postgresSettings.password, { //nyilván jelszót is envből
  host: '127.0.0.1',
  dialect: 'postgres',
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  }
});

//MODEL

var Expense = sequelize.define('expense', {
  service: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.TEXT
  },
  price: {
    type: Sequelize.DOUBLE
  },
  amount: {
    type: Sequelize.DOUBLE
  },
  maxDistance: {
    type: Sequelize.DOUBLE
  },
  maxSpeed: {
    type: Sequelize.DOUBLE
  },
  maxChannels: {
    type: Sequelize.DOUBLE
  },
  type: {
    type: Sequelize.STRING
  },
  expType: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
  timestamps: false,
  paranoid: false
});

var Location = sequelize.define('location', {
  location: {
    type: Sequelize.STRING
  },
  distance: {
    type: Sequelize.DOUBLE
  }
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
  timestamps: false,
  paranoid: false
});

// Connect all the models/tables in the database to a db object,
//so everything is accessible via one object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.Expense = Expense;
db.Location = Location;

//RELATIONS

///SÉMA SZINKRONIZÁLÁSA

db.Expense.sync().then( function (a) {
  db.Location.sync().then( function (a) {
    console.log('init done.');
  });
});

module.exports = db;

var expect = require('chai').expect;
var pg = require('../../lib/pg/driver');

var driver = null;

describe('pg driver', function() {
  before(function(done) {
    pg.connect({ database: 'db_meta_test' }, onConnect);

    function onConnect(err, dbDriver) {
      driver = dbDriver;
      driver.client.query('CREATE TABLE person (id INTEGER PRIMARY KEY NOT NULL, name VARCHAR(255) NOT NULL, email VARCHAR(100), age INTEGER DEFAULT 30,number SERIAL NOT NULL, CONSTRAINT person_email_key UNIQUE (email))', createIndex);
    }

    function createIndex(err) {
      driver.client.query('CREATE INDEX person_name_idx ON person (name, age)', done);
    }
  });

  after(function(done) {
    driver.client.query('DROP TABLE person', driver.close.bind(driver, done));
  });

  it('should return the database version', function(done) {
    driver.getVersion(onResult);

    function onResult(err, version) {
      expect(err).to.be.null;
      expect(version).to.be.present;
      done();
    }
  });

  it('should return all database tables', function(done) {
    driver.getTables(onResult);

    function onResult(err, tables) {
      expect(err).to.be.null;
      expect(tables).not.to.be.empty;
      expect(tables.length).to.equal(1);
      expect(tables[0].getName()).to.equal('person');
      expect(tables[0].meta).not.to.be.empty;
      done();
    }
  });

  it('should return all columns for a given table', function(done) {
    driver.getColumns('person', onResult);

    function onResult(err, columns) {
      expect(err).to.be.null;
      expect(columns).not.to.be.empty;
      expect(columns.length).to.equal(5);

      var idColumn = getColumnByName(columns, 'id');
      expect(idColumn).not.to.be.null;
      expect(idColumn.meta).not.to.be.empty;
      expect(idColumn.isNullable()).to.be.false;
      expect(idColumn.getDataType()).to.equal('INTEGER');
      expect(idColumn.getMaxLength()).to.be.null;
      expect(idColumn.isPrimaryKey()).to.be.true;
      expect(idColumn.isUnique()).to.be.true;
      expect(idColumn.isAutoIncrementing()).to.be.false;

      var nameColumn = getColumnByName(columns, 'name');
      expect(nameColumn).not.to.be.null;
      expect(nameColumn.meta).not.to.be.empty;
      expect(nameColumn.isNullable()).to.be.false;
      expect(nameColumn.getMaxLength()).to.equal(255);
      expect(nameColumn.getDataType()).to.equal('CHARACTER VARYING');
      expect(nameColumn.isPrimaryKey()).to.be.false;
      expect(nameColumn.isUnique()).to.be.false;
      expect(nameColumn.isAutoIncrementing()).to.be.false;


      var emailColumn = getColumnByName(columns, 'email');
      expect(emailColumn).not.to.be.null;
      expect(emailColumn.meta).not.to.be.empty;
      expect(emailColumn.isNullable()).to.be.true;
      expect(emailColumn.getMaxLength()).to.equal(100);
      expect(emailColumn.getDataType()).to.equal('CHARACTER VARYING');
      expect(emailColumn.isPrimaryKey()).to.be.false;
      expect(emailColumn.isUnique()).to.be.true;
      expect(emailColumn.isAutoIncrementing()).to.be.false;


      var ageColumn = getColumnByName(columns, 'age');
      expect(ageColumn.getDefaultValue()).to.equal('30');

      var numberColumn = getColumnByName(columns, 'number');
      expect(numberColumn).not.to.be.null;
      expect(numberColumn.meta).not.to.be.empty;
      expect(numberColumn.isNullable()).to.be.false;
      expect(numberColumn.getDataType()).to.equal('INTEGER');
      expect(numberColumn.isPrimaryKey()).to.be.false;
      expect(numberColumn.isUnique()).to.be.false;
      expect(numberColumn.isAutoIncrementing()).to.be.true;

      done();
    }
  });

  it('should return all indexes in the database', function(done) {
    driver.getIndexes('person', onResult);

    function onResult(err, indexes) {
      expect(indexes.length).to.equal(4);
      expect(indexes[1].getName()).to.equal('person_email_key');
      expect(indexes[1].getTableName()).to.equal('person');
      expect(indexes[1].getColumnName()).to.equal('email');
      expect(indexes[2].getName()).to.equal('person_name_idx');
      expect(indexes[2].getTableName()).to.equal('person');
      expect(indexes[2].getColumnName()).to.equal('name');
      expect(indexes[3].getName()).to.equal('person_name_idx');
      expect(indexes[3].getTableName()).to.equal('person');
      expect(indexes[3].getColumnName()).to.equal('age');
      done();
    }
  });
});

function getColumnByName(columns, name) {
  for (var i = 0; i < columns.length; i++) {
    if (columns[i].getName() === name) {
      return columns[i];
    }
  }
  return null;
}
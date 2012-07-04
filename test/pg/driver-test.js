var expect = require('chai').expect;
var pg = require('../../lib/pg/driver');

var driver = null;

describe('pg driver', function() {
  before(function(done) {
    pg.connect({ database: 'db_meta_test' }, onConnect);

    function onConnect(err, dbDriver) {
      driver = dbDriver;
      driver.client.query('CREATE TABLE person (id INTEGER PRIMARY KEY NOT NULL, name VARCHAR(255) NOT NULL, email VARCHAR(100), age INTEGER);', done);
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
      expect(columns.length).to.equal(4);

      var idColumn = getColumnByName(columns, 'id');
      expect(idColumn).not.to.be.null;
      expect(idColumn.meta).not.to.be.empty;
      expect(idColumn.isNullable()).to.be.false;
      expect(idColumn.getDataType()).to.equal('INTEGER');
      expect(idColumn.getMaxLength()).to.be.null;
      expect(idColumn.isPrimaryKey()).to.be.true;

      var nameColumn = getColumnByName(columns, 'name');
      expect(nameColumn).not.to.be.null;
      expect(nameColumn.meta).not.to.be.empty;
      expect(nameColumn.isNullable()).to.be.false;
      expect(nameColumn.getMaxLength()).to.equal(255);
      expect(nameColumn.getDataType()).to.equal('CHARACTER VARYING');
      expect(nameColumn.isPrimaryKey()).to.be.false;

      var emailColumn = getColumnByName(columns, 'email');
      expect(emailColumn).not.to.be.null;
      expect(emailColumn.meta).not.to.be.empty;
      expect(emailColumn.isNullable()).to.be.true;
      expect(emailColumn.getMaxLength()).to.equal(100);
      expect(emailColumn.getDataType()).to.equal('CHARACTER VARYING');
      expect(emailColumn.isPrimaryKey()).to.be.false;

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
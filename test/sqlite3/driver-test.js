var expect = require('chai').expect;
var sqlite3 = require('../../lib/sqlite3/driver');

var driver = null;

describe('sqlite3 driver', function() {
  before(function(done) {
    sqlite3.connect(':memory:', onConnect);

    function onConnect(err, dbDriver) {
      driver = dbDriver;
      driver.client.run('CREATE TABLE person (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, email VARCHAR(100) UNIQUE, age INTEGER DEFAULT 30, ref INTEGER, FOREIGN KEY (ref) REFERENCES person(id))', createIndex);
    }

    function createIndex(err) {
      driver.client.run('CREATE INDEX person_name_idx ON person (name, age)', done);
    }
  });

  after(function(done) {
    driver.client.run('DROP TABLE person', driver.close.bind(driver, done));
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
      expect(tables.length).to.equal(2);
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
      expect(idColumn.isPrimaryKey()).to.be.true;
      expect(idColumn.isForeignKey(), 'FK').to.be.false;
      expect(idColumn.isUnique()).to.be.true;
      expect(idColumn.isAutoIncrementing()).to.be.true;

      var nameColumn = getColumnByName(columns, 'name');
      expect(nameColumn).not.to.be.null;
      expect(nameColumn.meta).not.to.be.empty;
      expect(nameColumn.isNullable()).to.be.false;
      expect(nameColumn.getMaxLength()).to.equal(255);
      expect(nameColumn.getDataType()).to.equal('VARCHAR(255)');
      expect(nameColumn.isPrimaryKey()).to.be.false;
      expect(nameColumn.isUnique()).to.be.false;
      expect(nameColumn.isAutoIncrementing()).to.be.false;

      var emailColumn = getColumnByName(columns, 'email');
      expect(emailColumn).not.to.be.null;
      expect(emailColumn.meta).not.to.be.empty;
      expect(emailColumn.isNullable()).to.be.true;
      expect(emailColumn.getMaxLength()).to.equal(100);
      expect(emailColumn.getDataType()).to.equal('VARCHAR(100)');
      expect(emailColumn.isPrimaryKey()).to.be.false;
      expect(emailColumn.isUnique()).to.be.true;
      expect(emailColumn.isAutoIncrementing()).to.be.false;

      var ageColumn = getColumnByName(columns, 'age');
      expect(ageColumn.getDefaultValue()).to.equal('30');
      expect(ageColumn.isUnique()).to.be.false;
      expect(ageColumn.isAutoIncrementing()).to.be.false;

      var refColumn = getColumnByName(columns, 'ref');
      expect(refColumn).to.be.not.null;
      expect(refColumn.meta).not.to.be.empty;
      expect(refColumn.isForeignKey(), 'FK').to.be.true;
      expect(refColumn.isPrimaryKey()).to.be.false;
      expect(refColumn.getDataType()).to.equal('INTEGER');
      expect(refColumn.getMaxLength()).to.be.null;
      expect(refColumn.isAutoIncrementing()).to.be.false;

      done();
    }
  });

  it('should return all indexes in the database for a given table', function(done) {
    driver.getIndexes('person', onResult);

    function onResult(err, indexes) {
      expect(indexes.length).to.equal(3);
      expect(indexes[0].getName()).to.equal('sqlite_autoindex_person_1');
      expect(indexes[0].getTableName()).to.equal('person');
      expect(indexes[0].getColumnName()).to.equal('name');
      expect(indexes[1].getName()).to.equal('sqlite_autoindex_person_1');
      expect(indexes[1].getTableName()).to.equal('person');
      expect(indexes[1].getColumnName()).to.equal('age');
      expect(indexes[2].getName()).to.equal('sqlite_autoindex_person_1');
      expect(indexes[2].getTableName()).to.equal('person');
      expect(indexes[2].getColumnName()).to.equal('email');
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
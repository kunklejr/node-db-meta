var expect = require('chai').expect;
var Column = require('../../lib/sqlite3/column');
var iface = require('../../lib/column').iface;

describe('sqlite3 column', function () {
  it('should implement all the methods defined in the base column interface', function (done) {
    var c = new Column({ name: 'col', type: 'varchar(255)' });
    iface.forEach(function (method) {
      c[method].call(c);
    });
    done();
  });

  it('should create an internal meta property for constructor argument', function (done) {
    var t = new Column({ name: 'col' });
    expect(t.meta).not.to.be.null;
    done();
  });

  it('should implement the getName method', function (done) {
    var c = new Column({ name: 'col' });
    expect(c.getName()).to.equal('col');
    done();
  });

  it('should implement the isNullable method', function (done) {
    var c = new Column({ column_name: 'col', notnull: 0 });
    expect(c.isNullable()).to.be.true;

    c = new Column({ column_name: 'col', notnull: 1 });
    expect(c.isNullable()).to.be.false;

    done();
  });

  it('should implement the getMaxLength method', function (done) {
    var c = new Column({ name: 'col', type: 'varchar(255)' });
    expect(c.getMaxLength()).to.equal(255);
    done();
  });

  it('should implement the getDataType method', function(done) {
    var c = new Column({ name: 'col', type: 'integer' });
    expect(c.getDataType()).to.equal('INTEGER');
    done();
  });

  it('should implement the isPrimaryKey method', function(done) {
    var c = new Column({ column_name: 'col', pk: 1 });
    expect(c.isPrimaryKey()).to.be.true;
    var c = new Column({ column_name: 'col', pk: 0 });
    expect(c.isPrimaryKey()).to.be.false;
    done();
  });

  it('should implement the isForeignKey method', function(done) {
    var c = new Column({ column_name: 'col', fk: 1 });
    expect(c.isForeignKey()).to.be.true;
    var c = new Column({ column_name: 'col', fk: 0 });
    expect(c.isForeignKey()).to.be.false;
    done();
  });

  it('should implement the getDefaultValue method', function(done) {
    var c = new Column({ column_name: 'col', dflt_value: '30' });
    expect(c.getDefaultValue()).to.equal('30');
    done();
  });

  it('should implement the isUnique method', function(done) {
    var c = new Column({ column_name: 'col', unique: true });
    expect(c.isUnique()).to.be.true;
    var c = new Column({ column_name: 'col', pk: 1 });
    expect(c.isUnique()).to.be.true;
    var c = new Column({ column_name: 'col', unique: false });
    expect(c.isUnique()).to.be.false;
    done();
  });

  it('should implement the isAutoIncrementing method', function(done) {
    var c = new Column({ column_name: 'col', auto_increment: true });
    expect(c.isAutoIncrementing()).to.be.true;
    var c = new Column({ column_name: 'col', auto_increment: false });
    expect(c.isAutoIncrementing()).to.be.false;
    done();
  });


});
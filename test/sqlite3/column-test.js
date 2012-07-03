var expect = require('chai').expect;
var Column = require('../../lib/sqlite3/column');
var iface = require('../../lib/column').iface;

describe('pg column', function () {
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
    expect(t.meta.name).to.equal('col');
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
});
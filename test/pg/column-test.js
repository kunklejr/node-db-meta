var expect = require('chai').expect;
var Column = require('../../lib/pg/column');
var iface = require('../../lib/column').iface;

describe('pg column', function () {
  it('should implement all the methods defined in the base column interface', function (done) {
    var c = new Column({ column_name: 'col', data_type: 'integer' });
    iface.forEach(function (method) {
      c[method].call(c);
    });
    done();
  });

  it('should create an internal meta property for constructor argument', function (done) {
    var t = new Column({ column_name: 'col' });
    expect(t.meta).not.to.be.null;
    expect(t.meta.column_name).to.equal('col');
    done();
  });

  it('should implement the getName method', function (done) {
    var c = new Column({ column_name: 'col' });
    expect(c.getName()).to.equal('col');
    done();
  });

  it('should implement the isNullable method', function (done) {
    var c = new Column({ column_name: 'col', is_nullable: 'YES' });
    expect(c.isNullable()).to.be.true;

    c = new Column({ column_name: 'col', is_nullable: 'NO' });
    expect(c.isNullable()).to.be.false;

    done();
  });

  it('should implement the getMaxLength method', function (done) {
    var c = new Column({ column_name: 'col', character_maximum_length: 255 });
    expect(c.getMaxLength()).to.equal(255);
    done();
  });

  it('should implement the getDataType method', function(done) {
    var c = new Column({ column_name: 'col', data_type: 'integer' });
    expect(c.getDataType()).to.equal('INTEGER');
    done();
  });

  it('should implement the isPrimaryKey method', function(done) {
    var c = new Column({ column_name: 'col', primary_key: true });
    expect(c.isPrimaryKey()).to.be.true;
    var c = new Column({ column_name: 'col', primary_key: false });
    expect(c.isPrimaryKey()).to.be.false;
    done();
  });
});
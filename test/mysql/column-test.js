var expect = require('chai').expect;
var Column = require('../../lib/mysql/column');
var iface = require('../../lib/column').iface;

describe('mysql column', function () {
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
    var c = new Column({ column_name: 'col', column_key: 'PRI' });
    expect(c.isPrimaryKey()).to.be.true;
    var c = new Column({ column_name: 'col', column_key: '' });
    expect(c.isPrimaryKey()).to.be.false;
    done();
  });
  
  it('should implement the isForeignKey method', function(done) {
    var c = new Column({ column_name: 'col', foreign_key: true });
    expect(c.isForeignKey()).to.be.true;
    var c = new Column({ column_name: 'col', foreign_key: false });
    expect(c.isForeignKey()).to.be.false;
    done();
  });

  it('should implement the getDefaultValue method', function(done) {
    var c = new Column({ column_name: 'col', column_default: '30' });
    expect(c.getDefaultValue()).to.equal('30');
    done();
  });

  it('should implement the isUnique method', function(done) {
    var c = new Column({ column_name: 'col', column_key: 'UNI' });
    expect(c.isUnique()).to.be.true;
    var c = new Column({ column_name: 'col', column_key: 'PRI' });
    expect(c.isUnique()).to.be.true;
    var c = new Column({ column_name: 'col', column_key: '' });
    expect(c.isUnique()).to.be.false;
    done();
  });

  it('should implement the isAutoIncrementing method', function(done) {
    var c = new Column({ column_name: 'col', extra: 'auto_increment' });
    expect(c.isAutoIncrementing()).to.be.true;
    var c = new Column({ column_name: 'col', extra: '' });
    expect(c.isAutoIncrementing()).to.be.false;
    done();
  });
});
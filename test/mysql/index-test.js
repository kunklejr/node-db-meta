var expect = require('chai').expect;
var Index = require('../../lib/mysql/index');
var iface = require('../../lib/index').iface;

describe('pg index', function () {
  it('should implement all the methods defined in the base index interface', function (done) {
    var t = new Index({ key_name: 'idx', table: 'tbl', column_name: 'col1, col2' });
    iface.forEach(function (method) {
      t[method].call(t);
    });
    done();
  });

  it('should create an internal meta property for constructor argument', function (done) {
    var t = new Index({ key_name: 'idx', table: 'tbl', column_name: 'col1, col2' });
    expect(t.meta).not.to.be.null;
    done();
  });

  it('should implement the getName method', function(done) {
    var t = new Index({ key_name: 'idx', table: 'tbl', column_name: 'col1, col2' });
    expect(t.getName()).to.equal('idx');
    done();
  });

  it('should implement the getTableName method', function(done) {
    var t = new Index({ key_name: 'idx', table: 'tbl', column_name: 'col1, col2' });
    expect(t.getTableName()).to.equal('tbl');
    done();
  });

  it('should implement the getColumnName method', function(done) {
    var t = new Index({ key_name: 'idx', table: 'tbl', column_name: 'col1' });
    expect(t.getColumnName()).to.equal('col1');
    done();
  });
});
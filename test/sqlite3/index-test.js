var expect = require('chai').expect;
var Index = require('../../lib/sqlite3/index');
var iface = require('../../lib/index').iface;

describe('sqlite3 index', function () {
  it('should implement all the methods defined in the base index interface', function (done) {
    var t = new Index({ index_name: 'idx', table_name: 'tbl', name: 'col' });
    iface.forEach(function (method) {
      t[method].call(t);
    });
    done();
  });

  it('should create an internal meta property for constructor argument', function (done) {
    var t = new Index({ index_name: 'idx', table_name: 'tbl', name: 'col' });
    expect(t.meta).not.to.be.null;
    done();
  });

  it('should implement the getName method', function(done) {
    var t = new Index({ index_name: 'idx', table_name: 'tbl', name: 'col' });
    expect(t.getName()).to.equal('idx');
    done();
  });

  it('should implement the getTableName method', function(done) {
    var t = new Index({ index_name: 'idx', table_name: 'tbl', name: 'col' });
    expect(t.getTableName()).to.equal('tbl');
    done();
  });

  it('should implement the getColumnName method', function(done) {
    var t = new Index({ index_name: 'idx', table_name: 'tbl', name: 'col' });
    expect(t.getColumnName()).to.equal('col');
    done();
  });
});
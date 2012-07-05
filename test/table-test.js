var expect = require('chai').expect;
var Table = require('../lib/table');

describe('table', function () {
  it('should create an internal meta property for constructor argument', function (done) {
    var t = new Table({ id: 1, table_name: 'tbl' });
    expect(t.meta).not.to.be.null;
    done();
  });

  it('should implement the getName method', function(done) {
    var t = new Table({ id: 1, table_name: 'tbl' });
    expect(t.getName()).to.equal('tbl');
    done();
  });
});
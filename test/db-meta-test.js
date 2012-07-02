var expect = require('chai').expect;
var dbmeta = require('../lib/db-meta');

describe('db-meta', function() {
  it('should return an error for an unknown driver', function(done) {
    dbmeta('unknown', {}, expectError);

    function expectError(err) {
      expect(err).to.exist;
      done();
    }
  });

  it('should not return an error for a known driver', function(done) {
    dbmeta('pg', { database: 'db-meta-test' }, done);
  });
});

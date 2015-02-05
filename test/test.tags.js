
/**
 * WPCOM module
 */

var WPCOM = require('../');
var Site = require('../lib/site');
var assert = require('assert');

/**
 * Testing data
 */

var fixture = require('./fixture');

describe('site.tag', function(){
  // Create `wpcom` and `site` global instances
  var wpcom = WPCOM(fixture.site.private.token);
  var site = wpcom.site(fixture.site.private.url);

  var testing_tag;

  // Create a new_tag before to start tests
  var new_tag;
  before(function(done){
    site.tag()
    .add(fixture.tag, function(err, tag) {
      if (err) throw err;

      new_tag = tag;
      done();
    });
  });

  after(function(done){
    site.tag(new_tag.slug)
    .delete(function(err, tag) {
      if (err) throw err;

      done();
    });
  });

  describe('site.tag.get()', function(){

    it('should get added tag', function(done){
      var cat = site.tag(new_tag.slug);

      cat.get(function(err, data){
        if (err) throw err;

        assert.ok(data);
        assert.ok(data instanceof Object, 'data is not an object');
        assert.equal(new_tag.slug, data.slug);
        assert.equal(new_tag.name, data.name);
        done();
      });
    });
  });

  describe('site.tag.add()', function(){

    it('should add a new tag', function(done){
      var tag = site.tag();
      fixture.tag.name += '-added';

      tag.add(fixture.tag, function(err, data){
        if (err) throw err;

        // checking some data date
        assert.ok(data);
        assert.ok(data instanceof Object, 'data is not an object');

        // store added catogory
        testing_tag = data;

        done();
      });
    });
  });

  describe('site.tag.update()', function(){

    it('should edit the new added tag', function(done){
      var tag = site.tag(testing_tag.slug);
      var edited_name = fixture.tag.name + '-edited';

      tag.update({ name: edited_name }, function(err, data){
        if (err) throw err;

        assert.ok(data);
        assert.equal(edited_name, data.name);

        // update added tag
        testing_tag = data;

        done();
      });
    });
  });

  describe('site.tag.delete()', function() {

    it('should delete the new added tag', function(done) {
      var cat = site.tag(testing_tag.slug);

      cat.delete(function(err, data) {
        if (err) throw err;

        assert.ok(data);
        assert.equal("true", data.success);
        assert.equal(testing_tag.slug, data.slug);

        done();
      });
    });
  });

});
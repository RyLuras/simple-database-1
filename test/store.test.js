const assert = require('assert');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const Store = require('../lib/store.js');

describe('Store Database', () => {

    const rootDirectory = path.join(__dirname, 'database');
    const store = new Store(rootDirectory);

    beforeEach(done => {
        return rimraf(rootDirectory, err => {
            err && err.code !== 'ENOENT' ? done(err) : done();
        });
    });

    beforeEach(() => {
        return mkdirp(rootDirectory);
    });

    it('saves a file to the database with a shortid', done => {
        store.save({ file: 'file contents' }, (err, object) => {
            err ? done(err) : assert.ok(object._id);
            done();
        });
    });

    it('gets file by id', done => {
        store.save({ file: 'file contents' }, (err, object) => {
            if(err) return done(err);
            done();
            store.get((object._id), (err, objectFromFile) => {
                err ? done(err) : assert.deepEqual(object.id, objectFromFile);
                done();
            });
        });
    });

    it('returns null if no object exists', done => {
        store.get(('fake-file'), (err) => {
            err !== null ? done(err) : assert.equal(err, null);
            done();
        });
    });

    it('removes a file by id and returns true', done => {
        store.save({ file: 'file contents' }, (err, object) => {
            err ? done(err) : done();
            store.remove(object._id, (err, objectFromFile) => {
                if(err) return done(err);
                assert.equal(objectFromFile.removed, true);
                done();
            }); 
        });
    });

    it('removes a file and returns false if does not exist', done => {
        store.remove(null, (err, objectFromFile) => {
            err ? done(err) : assert.equal(objectFromFile.removed, false);
            done();
        }); 
    });

});

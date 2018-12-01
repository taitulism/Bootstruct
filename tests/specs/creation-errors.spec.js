const expect  = require('chai').expect;

const bts  = require('../../');

describe('Creation errors', function () {
    it('throws an exception when web-root-folder path doesn\'t exist', function () {
        function failedApp () {
            bts('./not-exist');
        }

        expect(failedApp).to.throw('find the web-root folder');
    });

    it('throws an exception when an app hook folder doesn\'t contain an "index.js" file', function () {
        function failedApp () {
            bts('./tests/app-folders/creation-errors/app-hook-folder-no-index/www');
        }

        expect(failedApp).to.throw('Expecting an "index.js" file ');
    });
});

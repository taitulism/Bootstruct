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

        expect(failedApp).to.throw('Expecting an "index.js" file');
    });

    it('throws an exception when an `ignore` hook is not a string', function () {
        function failedApp () {
            bts('./tests/app-folders/creation-errors/ignore-not-string/www');
        }

        expect(failedApp).to.throw('a string or an array of strings');
    });

    it('throws an exception when an `ignore` hook item is not a string', function () {
        function failedApp () {
            bts('./tests/app-folders/creation-errors/ignore-item-not-string/www');
        }

        expect(failedApp).to.throw('a string or an array of strings');
    });

    it('throws an exception when a file and a folder share the same name (in the web-root folder)', function () {
        function failedApp () {
            bts('./tests/app-folders/creation-errors/file-folder-same-name/www');
        }

        expect(failedApp).to.throw('a controller and a method with the same name');
    });
});

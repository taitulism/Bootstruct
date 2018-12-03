const expect  = require('chai').expect;

const bts  = require('../../');

describe('Creation errors', function () {
    it('throws when web-root-folder path doesn\'t exist', function () {
        function failedApp () {
            bts('./not-exist');
        }

        expect(failedApp).to.throw('find the web-root folder');
    });

    it('throws when an app hook folder doesn\'t contain an "index.js" file', function () {
        function failedApp () {
            bts('./tests/app-folders/creation-errors/app-hook-folder-no-index/www');
        }

        expect(failedApp).to.throw('Expecting an "index.js" file');
    });

    it('throws when an `ignore` hook is not a string', function () {
        function failedApp () {
            bts('./tests/app-folders/creation-errors/ignore-not-string/www');
        }

        expect(failedApp).to.throw('a string or an array of strings');
    });

    it('throws when an `ignore` hook item is not a string', function () {
        function failedApp () {
            bts('./tests/app-folders/creation-errors/ignore-item-not-string/www');
        }

        expect(failedApp).to.throw('a string or an array of strings');
    });

    it('throws when a file and a folder share the same name (in the web-root folder)', function () {
        function failedApp () {
            bts('./tests/app-folders/creation-errors/file-folder-same-name/www');
        }

        expect(failedApp).to.throw('a controller and a method with the same name');
    });

    it('throws when a controller method has no params', function () {
        function failedApp () {
            bts('./tests/app-folders/creation-errors/method-no-params/www');
        }

        expect(failedApp).to.throw('must handle at least one param');
    });

    it('throws when an `io_init` hook in use and has no params', function () {
        function failedApp () {
            bts('./tests/app-folders/creation-errors/no-params-io-init/www');
        }

        expect(failedApp).to.throw('"io.init" function must handle an argument');
    });

    it('throws when an `io_init` hook is not a function', function () {
        function failedApp () {
            bts('./tests/app-folders/creation-errors/io-init-must-be-function/www');
        }

        expect(failedApp).to.throw('"io_init" expected to be a function');
    });

    it('throws when an `io_exit` hook is not a function', function () {
        function failedApp () {
            bts('./tests/app-folders/creation-errors/io-exit-must-be-function/www');
        }

        expect(failedApp).to.throw('"io_exit" expected to be a function');
    });

    it('throws when `shared_ctrl` hook is not a folder', function () {
        function failedApp () {
            bts('./tests/app-folders/creation-errors/shared-ctrl-not-folder/www');
        }

        expect(failedApp).to.throw('Controllers must be folders');
    });
});

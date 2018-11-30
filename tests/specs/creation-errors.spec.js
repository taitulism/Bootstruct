const expect  = require('chai').expect;

const bts  = require('../../');

describe('Creation errors', function () {
    it('should throw an exception when web-root-folder path doesn\'t exist', function () {
        function failedApp () {
            bts('../not-exist');
        }

        expect(failedApp).to.throw('couldn\'t find');
    });
});

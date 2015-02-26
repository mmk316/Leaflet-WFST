/**
 * Created by PRadostev on 18.02.2015.
 */
describe('WFS.Transaction', function () {
    var wfst, layer, xhr;

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
    });

    beforeEach(function () {
        wfst = new L.WFS.Transaction({
            typeNS: 'typeNS',
            typeName: 'typeName',
            namespaceUri: 'testuri'
        });
        layer = new L.Marker([0, 0]);
        layer.feature = {
            id: 1,
            properties: {
                a: 'a',
                b: 'b'
            }
        };
    });

    it('should be initialized', function () {
        var spy = sinon.spy(L.WFS.Transaction.initialize);
        new L.WFS.Transaction();
        expect(spy).called;
    });

    describe('#addLayer', function () {
        it('should set layer.state to "insert" and add it to changes', function () {
            wfst.addLayer(layer);
            var id = wfst.getLayerId(layer);
            expect(layer.state).to.be.equal('insert');
            expect(wfst.changes[id]).to.be.equal(layer);
        });

        it('should not change feature if that already exists', function () {
            var feature = layer.feature;
            wfst.addLayer(layer);
            expect(layer.feature).to.be.equal(feature);
        });
    });

    describe('#editLayer', function () {
        it('should change layer.state to "update" and add it to changes', function () {
            layer.state = 'exist';
            wfst.editLayer(layer);
            var id = wfst.getLayerId(layer);
            expect(layer.state).to.be.equal('update');
            expect(wfst.changes[id]).to.be.equal(layer);
        });

        it('should not change layer.state from "insert"', function () {
            layer.state = 'insert';
            wfst.editLayer(layer);
            expect(layer.state).to.be.equal('insert');
        });
    });

    describe('#removeLayer', function () {
        it('should change layer.state to "remove" and add it to changes', function () {
            layer.state = 'exist';
            wfst.removeLayer(layer);
            var id = wfst.getLayerId(layer);
            expect(layer.state).to.be.equal('remove');
            expect(wfst.changes[id]).to.be.equal(layer);
        });

        it('should remove layer from changes if that was with state="insert"', function () {
            var id = wfst.getLayerId(layer);
            layer.state = 'insert';
            wfst.changes[id] = layer;
            wfst.removeLayer(layer);
            expect(wfst.changes[id]).to.be.undefined;
        });
    });

    after(function () {
        xhr.restore();
    });
});
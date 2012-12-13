/*jslint browser: true, vars: false, white: true, onevar: false, undef: true, nomen: false, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */
/*global window escape */
"use strict";
(function (win) {
    if (typeof (win.adingoFluctSync) === 'undefined') {
        var AdingoFluctSync = function () {};
        AdingoFluctSync.logly = function (util, logyid) {
            var ref = '', url = util.doc.referrer;
            try {
                ref = util.win.parent.document.referrer;
            } catch (e1) { }
            try {
                url = util.win.parent.document.URL;
            } catch (e2) { }
            var _lgy_ssp_id = 1;
            var _lgy_ssp_audience_id = '$luid';
            var _lgy_query = 'sid=' + _lgy_ssp_id + '&aid=' + _lgy_ssp_audience_id + '&url=' + escape(url) + '&rurl=' + escape(ref);
            var src = (('https:' === document.location.protocol) ? 'https://' : 'http://') + 'dsp.logly.co.jp/sg.gif?' + _lgy_query;
            return util.beacon(src);
        };
        
        AdingoFluctSync.scaleout = function (util) {
            var so_tp = encodeURIComponent(util.doc.location.href), so_pp = encodeURIComponent(util.doc.referrer), so_src = 'http://bid.socdm.com/rtb/sync?proto=adingo&sspid=adingo' + '&tp=' + so_tp + '&pp=' + so_pp + "&t=.gif";
            return util.beacon(so_src);
        };
        AdingoFluctSync.fout = function (util) {
            return util.beacon('http://sync.fout.jp/sync?xid=fluct');
        };
      
        win.adingoFluctSync = AdingoFluctSync;
    }
    win = null;
}(window));
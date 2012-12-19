/*jslint indent: 2, sub: true, windows: true, browser: true, vars: false, white: true, onevar: false, undef: true, nomen: false, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false*/
/*global window escape */

if (typeof (window['adingoFluctSync']) === 'undefined') {
  var AdingoFluctSync = function () {};

  /**
   * logly 用 cookie sync tag 生成
   */
  AdingoFluctSync['logly'] = function (util, logyid) {
    var ref = '', url = window.document.referrer;
    try {
      ref = window.parent.document.referrer;
    } catch (e1) {
    }
    try {
      url = window.parent.document.URL;
    } catch (e2) {
    }
    var _lgy_ssp_id = 1;
    var _lgy_ssp_audience_id = '$luid';
    var _lgy_query = 'sid=' + _lgy_ssp_id + '&aid=' + _lgy_ssp_audience_id +
    '&url=' + escape(url) + '&rurl=' + escape(ref);
    var src = (('https:' === window.document.location.protocol) ? 'https://'
        : 'http://') +
        'dsp.logly.co.jp/sg.gif?' + _lgy_query;
    return util.beacon(src);
  };

  /**
   * scaleout 用 cookie sync tag 生成
   */
  AdingoFluctSync['scaleout'] = function (util) {
    var so_tp = encodeURIComponent(window.document.location.href);
    var so_pp = encodeURIComponent(window.document.referrer);
    var so_src = 'http://bid.socdm.com/rtb/sync?proto=adingo&sspid=adingo' +
    '&tp=' + so_tp + '&pp=' + so_pp + "&t=.gif";
    return util.beacon(so_src);
  };
  
  /**
   * freakout 用 cookie sync tag 生成
   */
  AdingoFluctSync['fout'] = function (util) {
    return util.beacon('http://sync.fout.jp/sync?xid=fluct');
  };

  /**
   * response jsonのsyncsの内容に従って、cookie sync tag をレンダリングする
   * @param util ユーティリティーオブジェクト
   * @param target レンダリングの基準となるelement
   * @param syncs response json のsyncs
   */
  AdingoFluctSync.render = function (util, target, syncs) {
    for (var sync in syncs) {
      if (sync === 'logly') {
        target.parentNode.insertBefore(AdingoFluctSync[sync](util, syncs[sync]), target);
      } else {
        target.parentNode.insertBefore(AdingoFluctSync[sync](util), target);
      }
    }
  };
  window["adingoFluctSync"] = AdingoFluctSync;
}

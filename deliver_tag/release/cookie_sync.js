/*jslint plusplus: true, laxbreak: true, indent: 2, sub: true, windows: true, browser: true, vars: false, white: true, onevar: false, undef: true, nomen: false, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false*/
/*global window escape */

(function() {

  function _script(e) {
    if (e.nodeName.toLowerCase() === 'script') {
      return e;
    }
    return _script(e.lastChild);
  }
  ;

  function _param(selfUrl) {
    if (selfUrl.indexOf('?') < 0) {
      return params;
    }
    var queryStr = selfUrl.substring(selfUrl.indexOf('?') + 1);
    var paramStr = queryStr.split('&');
    var paramNum = paramStr.length;
    var params = {};
    for ( var i = 0; i < paramNum; i += 1) {
      var param = paramStr[i].split('=');
      params[param[0]] = param[1];
    }
    return params;
  }
  ;

  function _beacon(url) {
    var beacon = window.document.createElement('img');
    beacon.setAttribute('src', url);

    beacon.setAttribute('style',
        'display:none;position:absolute;border:none;padding:0;margin:0;');
    beacon.setAttribute('width', 0);
    beacon.setAttribute('height', 0);
    beacon.setAttribute('border', 0);
    return beacon;
  }
  ;

  var __renders = {};

  function render() {
    var tag = _script(window.document);
    var params = _param(tag.src);
    for ( var sync in params) {
      if (sync !== '') {
        if (sync === 'logly') {
          tag.parentNode.insertBefore(__renders[sync](params[sync]), tag);
        } else {
          if (typeof (__renders[sync]) !== 'undefined') {
            tag.parentNode.insertBefore(__renders[sync](), tag);
          }
        }
      }
    }
  }
  ;
  /**
   * cookie sync img render method
   */
  // scaleout
  __renders['scaleout'] = function() {
    var so_tp = encodeURIComponent(window.document.location.href);
    var so_pp = encodeURIComponent(window.document.referrer);
    var so_src = 'http://bid.socdm.com/rtb/sync?proto=adingo&sspid=adingo'
        + '&tp=' + so_tp + '&pp=' + so_pp + "&t=.gif";
    return _beacon(so_src);
  };

  // freakout
  __renders['fout'] = function() {
    return _beacon('http://sync.fout.jp/sync?xid=fluct');
  };

  // logly
  __renders['logly'] = function() {
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
    var _lgy_query = 'sid=' + _lgy_ssp_id + '&aid=' + _lgy_ssp_audience_id
        + '&url=' + escape(url) + '&rurl=' + escape(ref);
    var src = (('https:' === window.document.location.protocol) ? 'https://'
        : 'http://')
        + 'dsp.logly.co.jp/sg.gif?' + _lgy_query;

    return _beacon(src);
  };
  render();
}());
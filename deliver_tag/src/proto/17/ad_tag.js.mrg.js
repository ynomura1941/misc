/*jslint windows: true, browser: true, vars: false, white: true, onevar: false, undef: true, nomen: false, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false*/
/*global window */
if (typeof (window['AdingoFluctCommon']) == 'undefined') {
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /* , from */) {
      var len = this.length;

      var from = Number(arguments[1]) || 0;
      from = (from < 0) ? Math.ceil(from) : Math.floor(from);
      if (from < 0)
        from += len;

      for (; from < len; from++) {
        if (from in this && this[from] === elt)
          return from;
      }
      return -1;
    };
  }
  ;
  var modedoc = /BackCompat/i.test(window.document.compatMode) ? window.document.body
      : window.document.documentElement;

  var AdingoFluctCommon = function() {
    this.flashInfo = (function() {
      var rtn = {};
      rtn['v'] = 0, rtn['exist'] = false, rtn['done'] = false;
      rtn['tag_template'] = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'
          + 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"'
          + 'width="{$sWidth}" height="{$sHeight}" style="border:none;padding:0;margin:0">'
          + '<param name="movie" value="{$sSrc}">'
          + '<param name="flashvars" value="{$flashVars}">'
          + '<param name="allowScriptAccess" value="always">'
          + '<param name="quality" value="autohigh">'
          + '<param name="bgcolor" value="#fff">'
          + '<param name="wmode" value="opaque">'
          + '<embed src="{$sSrc}"'
          + 'flashvars="{$flashVars}"'
          + 'quality="autohigh"'
          + 'allowscriptaccess="always"'
          + 'swliveconnect="FALSE"'
          + 'width="{$sWidth}"'
          + 'height="{$sHeight}"'
          + 'wmode="opaque"'
          + 'type="application/x-shockwave-flash"'
          + 'pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash">'
          + '</object>';
      var func = null;
      return function() {
        if (func != null) {
          return func();
        }
        var userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('msie') != -1) {
          try {
            if (typeof new ActiveXObject('ShockwaveFlash.ShockwaveFlash') !== 'undefined') {
              var flashOCX = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")
                  .GetVariable("$version");
              rtn['v'] = parseInt(flashOCX.match(/([0-9]+)/)[0]);
              rtn['exist'] = true;
            }
          } catch (e) {
          }
        } else {
          if (typeof navigator.plugins["Shockwave Flash"] !== 'undefined') {
            rtn['v'] = parseInt(navigator.plugins["Shockwave Flash"].description
                .match(/\d+\.\d+/));
            rtn['exist'] = rtn['v'] != 0 ? true : false;
          }
        }
        rtn['done'] = true;
        func = function() {
          return rtn;
        };
        return func();
      };
    })();
  };

  AdingoFluctCommon.prototype = {

    gZoom : function() {
      if (modedoc.style.zoom == '') {
        return 1;
      } else {
        return modedoc.style.zoom;
      }
    },
    lZoom : function(baseWidth) {
      if (modedoc.style.zoom != '') {
        if (this.dwidth() < baseWidth) {
          if (this.wwidth() <= baseWidth) {
            return this.dwidth() / baseWidth;
          } else {
            return this.dwidth() / this.wwidth();
          }
        } else {
          if (this.wwidth() < baseWidth) {
            return this.wwidth() / baseWidth;
          } else {
            return this.wwidth() / this.dwidth();
          }
        }
      } else {
        if (this.wwidth() < baseWidth) {
          return (this.wwidth() / baseWidth);
        } else {
          return 1;
        }
      }
    },

    lposX : function(width) {
      return ((this.offsetX() + this.wwidth() - (width * this.gZoom() * this
          .lZoom(width))) / this.gZoom())
          / this.lZoom(width) / 2;
    },

    lposY : function(height, width) {
      return ((this.offsetY() + this.wheight() - (height * this.gZoom() * this
          .lZoom(width))) / this.gZoom())
          / this.lZoom(width);
    },

    lposXY : function(width, height) {
      var lzoom = this.lZoom(width);
      var gzoom = this.gZoom();
      var tmpy = this.offsetY();
      var x = ((this.offsetX() + this.wwidth() - (width * gzoom * lzoom)) / gzoom)
          / lzoom / 2;
      var y = ((tmpy + this.wheight() - (height * gzoom * lzoom)) / gzoom)
          / lzoom;
      var top = tmpy / gzoom / lzoom;
      return {
        "x" : x,
        "y" : y,
        "top" : top
      };
    },

    /**
     * 
     * @returns {h: get window height function, w: get window width function}
     */
    wsize : function() {
      return {
        h : this.wheight,
        w : this.wwidth
      };
    },

    /**
     * 
     * @returns
     */
    wheight : function() {
      var func = null;
      return (function() {
        if (func == null) {
          if (typeof (window.innerHeight) != 'undefined') {
            func = function() {
              return window.innerHeight;
            };
          } else {
            func = function() {
              return modedoc.clientHeight;
            };
          }
        }
        return func();
      })();
    },

    /**
     * 
     * @returns
     */
    wwidth : function() {
      var func = null;
      return (function() {
        if (func == null) {
          if (typeof (window.innerWidth) != 'undefined') {
            func = function() {
              return window.innerWidth;
            };
          } else {
            func = function() {
              return modedoc.clientWidth;
            };
          }
        }
        return func();
      })();
    },

    /**
     * 
     * @returns {___anonymous4554_4586}
     */
    dsize : function() {
      return {
        h : this.dheight,
        w : this.dwidth
      };
    },

    /**
     * 
     * @returns
     */
    dheight : function() {
      var func = null;
      return (function() {
        if (func == null) {
          func = function() {
            return Math.max(modedoc.clientHeight, modedoc.scrollHeight);
          };
        }
        return func();
      })();
    },

    /**
     * 
     * @returns
     */
    dwidth : function() {
      var func = null;
      return (function() {
        if (func == null) {
          console.log(modedoc.clientHeight, modedoc.scrollHeight);
          func = function() {
            return Math.max(modedoc.clientHeight, modedoc.scrollHeight);
          };
        }
        return func();
      })();
    },

    scrollPos : function() {
      return {
        y : this.scrollY,
        x : this.scrollX
      };
    },

    /**
     * 
     * @returns
     */
    offsetY : function() {
      var func = null;
      return (function() {
        if (func == null) {
          if (typeof (window.scrollY) !== 'undefined') {
            func = function() {
              return window.scrollY;
            };
          } else if (typeof (window.pageYOffset) !== 'undefined') {
            func = function() {
              return window.pageYOffset;
            };
          } else {
            func = function() {
              return modedoc.scrollTop;
            };
          }
        }
        return func();
      })();
    },

    /**
     * 
     * @returns
     */
    offsetX : function() {
      var func = null;
      return (function() {
        if (func == null) {
          if (typeof (window.scrollX) !== 'undefined') {
            func = function() {
              return window.scrollX;
            };
          } else if (typeof (window.pageXOffset) !== 'undefined') {
            func = function() {
              return window.pageXOffset;
            };
          } else {
            func = function() {
              return modedoc.scrollLeft;
            };
          }
        }
        return func();
      })();
    },

    /**
     * image 生成 cookie sync や imp beacon用のイメージタグを生成
     * 
     * @param url
     * @returns
     */
    beacon : function(url) {
      var beacon = window.document.createElement('img');
      beacon.setAttribute('src', url);
      beacon.setAttribute('style',
          'display:none;position:absolute;border:none;padding:0;margin:0;');
      beacon.setAttribute('width', 0);
      beacon.setAttribute('height', 0);
      return beacon;
    },

    /**
     * element 生成
     * 
     * @param tagName
     *          生成するタグ名
     * @returns
     */
    create_element : function(tagName) {
      return window.document.createElement(tagName);
    },

    /**
     * ID指定でelementを削除する
     * 
     * @param id
     */
    deleteById : function(id) {
      var target = this.byId(id);
      target.parentNode.removeChild(target);
    },
    /**
     * JSONP を行うscriptタグ生成
     * 
     * @param gid
     *          グループID
     * @param url
     *          JSONPのエンドポイントURL
     * @returns {___loader0}
     */
    loader : function(gid, url) {
      var loader = this.create_element('script');
      loader.setAttribute('id', 'fluctAdLoader_' + gid);
      loader.src = url;
      return loader;
    },

    /**
     * 
     * @param id
     * @returns
     */
    byId : function(id) {
      return window.document.getElementById(id);
    },

    /**
     * 
     * @param id
     * @param ad
     * @returns
     */
    iframe : function(id, ad) {
      var w = ad['w'] + 'px', h = ad['h'] + 'px';
      var temp = this.create_element('iframe');
      temp.setAttribute('id', id);
      temp
          .setAttribute(
              'style',
              'width:'
                  + w
                  + 'px;height:'
                  + h
                  + 'px;border:none;padding:0;margin:0;margin-bottom:-4px;pointer-events:auto;');
      temp.setAttribute('marginwidth', 0);
      temp.setAttribute('marginheight', 0);
      temp.setAttribute('allowtransparency', 'false');
      temp.setAttribute('vspace', 0);
      temp.setAttribute('hspace', 0);
      temp.setAttribute('frameborder', 0);
      temp.setAttribute('scrolling', 'no');
      return temp;
    },

    /**
     * 
     * @param e
     * @returns {___anonymous5696_5697}
     */
    parse_param : function(e) {
      var params = {};

      params['tag'] = this.myTag(e);

      var selfUrl = params['tag'].src;
      if (selfUrl.indexOf('?') < 0) {
        return params;
      }
      var queryStr = selfUrl.substring(selfUrl.indexOf('?') + 1);
      var paramStr = queryStr.split('&');
      var paramNum = paramStr.length;

      for ( var i = 0; i < paramNum; i++) {
        var param = paramStr[i].split('=');
        params[param[0]] = param[1];
      }
      params['requestQuery'] = queryStr;
      return params;
    },

    /**
     * 
     * @param e
     * @returns
     */
    myTag : function(e) {
      if (e.nodeName.toLowerCase() == 'script')
        return e;
      return arguments.callee(e.lastChild);
    },
    insertAfter : function(referenceNode, newNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    },

    /**
     * 
     * @param unit_id
     * @param ad
     * @returns {Boolean}
     */
    unit_beacon : function(unit_id, ad) {
      var div = this.byId(unit_id);
      var beacon = this.beacon(ad['beacon']);

      div.appendChild(beacon);
      div = null;
      beacon = null;
      return true;
    }

    ,

    /**
     * 
     * @param id
     * @param ad
     * @returns {Boolean}
     */
    html_ad : function(id, ad) {
      var div = this.byId(id);
      var iframe = this.iframe('adingoFluctIframe_' + ad['unit_id'], ad);

      div.appendChild(iframe);
      var iframeDoc = iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc
          .write('<html><head></head><body style="padding:0px;margin:0px;border:none;">'
              + ad['html'] + '</body></html>');
      iframeDoc.close();
      iframeDoc = null;
      iframe = null;
      return true;
    },

    /**
     * 
     * @param id
     * @param ad
     * @returns {Boolean}
     */
    image_ad : function(id, ad) {
      var div = this.byId(id);
      var temp = this.create_element('img');
      temp.setAttribute('src', ad['creative_url']);
      temp.setAttribute('width', ad['width']);
      temp.setAttribute('height', ad['height']);
      temp.setAttribute('style', 'border:none;padding:0;margin:0;');
      if (ad['alt'].length > 0) {
        temp.setAttribute('alt', this.unicodeDecoder(ad['alt']));
      }
      var link = this.create_element('a');
      link.setAttribute('href', ad['landing_url']);
      link.setAttribute('target', this.openTarget(ad['open']));
      div.appendChild(link);
      link.appendChild(temp);
      div = null;
      link = null;
      img = null;
      return true;

    },

    /**
     * 
     * @param id
     * @param ad
     * @returns {Boolean}
     */
    flash_ad : function(id, ad) {
      var flashInfo = this.flashInfo();
      if (flashInfo['exist'] && flashInfo['v'] > 5) {
        var div = this.byId(id);
        var flashVars = 'clickTAG=' + escape(ad['landing_url']) + '&targetTAG='
            + this.openTarget(ad['open']);
        var objStr = flashInfo['tag_template'].replace(/\{\$sWidth\}/g,
            ad['width']);
        objStr = objStr.replace(/\{\$sHeight\}/g, ad['height']);
        objStr = objStr.replace(/\{\$sSrc}/g, ad['creative_url']);
        objStr = objStr.replace(/\{\$flashVars}/g, flashVars);
        var iframe = this.iframe('adingoFluctIframe_' + ad['unit_id'], ad);
        div.appendChild(iframe);
        var iframeDoc = iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc
            .write('<html><head></head><body style="padding:0px;margin:0px;border:none;">'
                + objStr + '</body></html>');
        iframeDoc.close();
        iframeDoc = null;
        iframe = null;
        div = null;
        return true;
      } else {
        if (ad['alt_mage'] != null && ad['alt_mage'] != '') {
          var div = this.byId(id);
          var temp = this.create_element('img');
          temp.setAttribute('src', ad['alt_image']);
          temp.setAttribute('width', ad['width']);
          temp.setAttribute('height', ad['height']);
          temp.setAttribute('style', 'border:none;padding:0;margin:0;');
          if (ad['alt'].length > 0) {
            temp.setAttribute('alt', this.unicodeDecoder(ad['alt']));
          }
          var link = this.create_element('a');
          link.setAttribute('href', ad['landing_url']);
          link.setAttribute('target', this.openTarget(ad['open']));
          div.appendChild(link);
          link.appendChild(temp);
          div = null;
          link = null;
          img = null;
          return true;
        } else {
          return false;
        }
      }
    },

    /**
     * 
     * @param str
     * @returns {String}
     */
    unicodeDecoder : function(str) {
      arrs = str.match(/\\u.{4}/g);
      var t = "";
      if (arrs == null) {
        return '';
      }
      for ( var i = 0; i < arrs.length; i++) {
        t += String.fromCharCode(arrs[i].replace("\\u", "0x"));
      }
      return (t);
    },

    /**
     * 
     * @param flg
     * @returns {String}
     */
    openTarget : function(flg) {
      switch (flg) {
      case 1:
        return '_blank';
      case 2:
        return '_top';
      default:
        return '_top';
      }
    },

    /**
     * 
     * @param ad
     * @returns
     */
    overlay : function(ad) {
      var div = this.byId('adingoFluctUnit_' + ad['unit_id']);
      var over = this.create_element('div');
      var h = ad['height'] + 'px';
      var w = ad['width'] + 'px';
      over.setAttribute('id', 'adingoFluctOverlay_' + ad['unit_id']);
      over
          .setAttribute(
              'style',
              'width:'
                  + w
                  + ';height:'
                  + h
                  + ';bottom:0px;left:0px;position:absolute;z-index:9993;display:none;font-size:18px;line-height:1.5em;visibility:visible;opacity:0;verticalAlign:middle;padding:0px;margin:0px;border:none;overflow: hidden;');
      div.appendChild(over);
      div = null;
      return over;
    },

    /**
     * 広告をクリアする
     * 
     * @param unit_id
     */
    clearDiv : function(unit_id) {
      var unit_div = this.byId('adingoFluctUnit_' + unit_id);
      var overlay_div = this.byId('adingoFluctOverlay_' + unit_id);
      if (overlay_div == null) {
        while (unit_div.firstChild) {
          unit_div.removeChild(unit_div.firstChild);
        }
      } else {
        while (overlay_div.firstChild) {
          overlay_div.removeChild(overlay_div.firstChild);
        }
      }
    },

    setOpacity : function(target, op) {
      target.style.opacity = op;
      target.style.filter = "alpha(opacity=" + 100 * op + ")";

    }
  };
  window['AdingoFluctCommon'] = AdingoFluctCommon;
}

/*jslint windows: true, browser: true, vars: false, white: true, onevar: false, undef: true, nomen: false, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false*/
/*global window escape */

if (typeof (window['adingoFluctSync']) === 'undefined') {
  var AdingoFluctSync = function() {
  };

  AdingoFluctSync['logly'] = function(util, logyid) {
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
    return util.beacon(src);
  };

  AdingoFluctSync['scaleout'] = function(util) {
    var so_tp = encodeURIComponent(window.document.location.href), so_pp = encodeURIComponent(window.document.referrer), so_src = 'http://bid.socdm.com/rtb/sync?proto=adingo&sspid=adingo'
        + '&tp=' + so_tp + '&pp=' + so_pp + "&t=.gif";
    return util.beacon(so_src);
  };
  AdingoFluctSync['fout'] = function(util) {
    return util.beacon('http://sync.fout.jp/sync?xid=fluct');
  };

  AdingoFluctSync.render = function(util, target, syncs) {
    for ( var sync in syncs) {
      if (sync === 'logly') {
        util.insertAfter(target, AdingoFluctSync[sync](util, syncs[sync]));
      } else {
        util.insertAfter(target, AdingoFluctSync[sync](util));
      }
    }
  };
  window["adingoFluctSync"] = AdingoFluctSync;
}

/*jslint windows: true, browser: true, vars: false, white: true, onevar: false, undef: true, nomen: false, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false*/
/*global window */
/**
 * @depends ../../common/1.js
 * @depends ../../cookie_sync/1.js
 */
if (typeof (window['adingoFluct']) == 'undefined') {
  var AdingoFluct = function() {
    this.util = new AdingoFluctCommon();
    this.data = {};
    this.render_queue = [];
    this.rendered_units = [];
    this.effectWatcher = null;
    this.effectExecute = false;
    this.moveWatcher = null;
    this.moveExecute = false;
    this.overlayUnits = {};
    this.reloadWatcher = null;
    this.synced = false;
  };
  //AdingoFluct.URL = 'http://y-nomura.sh.adingo.jp.dev.fluct.me/api/json/v1/?';
  AdingoFluct.URL = 'http://dl.dropbox.com/u/79806951/t31772/new_fluct_json.js?';
  AdingoFluct.LOAD_NONE = 0;
  AdingoFluct.LOADING = 1;
  AdingoFluct.LOADED = 2;
  AdingoFluct.LOAD_ERROR = 3;
  AdingoFluct.prototype = {
    /**
     * 
     */
    destroy : function() {
      this.util = null;
      this.data = null;
      this.render_queue = null;
      this.rendered_units = null;
      if (this.effectWatcher != null) {
        clearTimeout(this.effectWatcher);
        this.effectWatcher = null;
        this.effectExecute = false;
      }
      if (this.moveWatcher != null) {
        clearTimeout(this.moveWatcher);
        this.moveWatcher = null;
        this.moveExecute = false;
      }
      this.overlayUnits = null;
      if (this.reloadWatcher != null) {
        clearTimeout(this.reloadWatcher);
        this.reloadWatcher = null;
      }
      this.synced = false;
    },

    /**
     * 
     * @param el
     */
    setGroup : function(el) {
      var params = this.util.parse_param(el);
      this.data[params['G']] = params;
      this.data[params['G']]['load_status'] = AdingoFluct.LOAD_NONE;
    },

    /**
     * 
     * @param json
     */
    callback : function(json) {
      if (json['status'] == 'success') {
        this.util.deleteById('fluctAdLoader_' + json['G']);
        var s_group_data = this.data[json['G']];
        s_group_data['load_status'] = AdingoFluct.LOADED;
        s_group_data['json'] = json;
        var temp_queue = this.render_queue.slice(0);
        this.render_queue = [];
        if (temp_queue.length > 0) {
          if (this.synced === false) {
            var unit_id = temp_queue.shift();
            adingoFluctSync.render(this.util, this.util.byId('adingoFluctUnit_'
                + unit_id), json['syncs']);
            this.showAd(unit_id);
            this.synced = true;
          }
          while (temp_queue.length > 0) {
            var rest = temp_queue.shift();
            if (rest != null) {
              this.showAd(rest);
            }

          }
        }
      }

      var gcount = 0;
      var loadedcount = 0;
      for ( var g in this.data) {
        gcount = gcount + 1;
        var ginfo = this.data[g];
        if (ginfo['load_status'] == AdingoFluct.LOADED) {
          loadedcount = loadedcount + 1;
        }
      }
      if (gcount === loadedcount) {
        this.rendered_units = [];
      }
    },

    reloadInvoke : function(gid, unit_id) {
      this.reloadWatcher = setTimeout(function() {
        window['adingoFluct'].reload(gid, unit_id);
      }, 5000);
    },

    reload : function(gid, unit_id) {
      if (this.reloadWatcher != null) {
        clearTimeout(this.reloadWatcher);
        this.reloadWatcher = null;
      }

      var g_data = this.data[gid];
      g_data['load_status'] = AdingoFluct.NONE;
      this.render_queue.push(unit_id);
      this.load(gid);
    },

    load : function(gid) {
      var url = null;
      var g_data = this.data[gid];
      if (typeof (g_data['url']) != 'undefined') {
        url = g_data['url'];
      } else {
        url = AdingoFluct.URL;
      }
      g_data['load_status'] = AdingoFluct.LOADING;
      url = url + g_data['requestQuery'] + '&cb=adingoFluct.callback&ttl='
          + Math.random();
      var tag = this.util.loader(gid, url);
      this.util.insertAfter(g_data['tag'], tag);
      tag = null;
    },

    showAd : function(unit_id) {
      var target_ad = null;
      if (this.rendered_units.indexOf(unit_id) !== -1) {
        return;
      }
      var unit_div = this.util.byId('adingoFluctUnit_' + unit_id);
      if (unit_div === null) {
        unit_div = this.util.create_element('div');
        unit_div.setAttribute('id', 'adingoFluctUnit_' + unit_id);
        this.util.insertAfter(this.util.myTag(window.document), unit_div);
      }
      for ( var group_id in this.data) {
        var temp_group_info = this.data[group_id];
        if (typeof (temp_group_info['load_status']) !== 'undefined'
            && temp_group_info['load_status'] === AdingoFluct.LOADED) {
          for ( var ad_counter = 0; ad_counter < temp_group_info['json']['num']; ad_counter++) {
            var temp_ad = temp_group_info['json']['ads'][ad_counter];
            if (temp_ad['unit_id'] == unit_id) {
              target_ad = [ group_id, temp_ad ];
              temp_ad = null;
              break;
            }
          }
        } else {
          if (this.rendered_units.indexOf(unit_id) === -1) {
            this.render_queue.push(unit_id);
          }

          if (temp_group_info['load_status'] === AdingoFluct.LOAD_NONE) {
            this.load(group_id);
          }
        }
      }
      if (target_ad !== null) {
        this.rendered_units.push(unit_id);
        this.out(target_ad);
      }
    },

    out : function(adData) {

      var gid = adData.shift();
      var adinfo = adData.shift();
      var unit_div_id = 'adingoFluctUnit_' + adinfo['unit_id'];
      this.util.clearDiv(adinfo['unit_id']);

      switch (adinfo['creative_type']) {
      case 'html':
        this.util.html_ad(unit_div_id, adinfo);
        break;
      case 'flash':
        this.util.flash_ad(unit_div_id, adinfo);
        break;
      case 'image':
        if (adinfo['overlay'] === 1) {
          this.util.overlay(adinfo);
          this.util.image_ad('adingoFluctOverlay_' + adinfo['unit_id'], adinfo);
          this.visibleOverlay('adingoFluctOverlay_' + adinfo['unit_id']);
          this.moveWatcher = setTimeout(function() {
            window['adingoFluct'].move('adingoFluctOverlay_'
                + adinfo['unit_id']);
          }, 100);
        } else {
          this.util.image_ad(unit_div_id, adinfo);
        }
        this.reloadInvoke(gid, adinfo['unit_id']);
        break;
      default:

      }
      this.util.unit_beacon(unit_div_id, adinfo);
    },

    visibleOverlay : function(id) {
      this.effectExecute = false;
      var target = this.util.byId(id);
      target.style.display = 'block';
      var lpos = this.util.lposXY(parseInt(target.style.width),
          parseInt(target.style.height));
      var x = Math.max(0, lpos['x']) + 'px';
      var y = lpos['y'] + 'px';
      if (this.util.offsetY() + this.util.wheight() >= this.util.dheight()) {
        y = lpos['top'] + 'px';
      }
      target.style.opacity = 0;
      target.style.filter = "alpha(opacity=" + 0 + ")";
      target.style.top = y;
      target.style.left = x;
      target = null;
      this.overlayUnits[id] = {};
      this.overlayUnits[id]['winPosX'] = this.util.offsetX();
      this.overlayUnits[id]['winPosY'] = this.util.offsetY();

      this.effectWatcher = setTimeout(function() {
        window['adingoFluct'].show(id, 0);
      }, 500);
    },

    show : function(id, effectValue) {
      clearTimeout(this.effectWatcher);
      this.effectWatcher = null;
      var target = this.util.byId(id);
      effectValue = effectValue + 0.09;
      this.util.setOpacity(target, effectValue);
      target = null;
      if (effectValue <= 1) {
        this.effectWatcher = setTimeout(function() {
          window['adingoFluct'].show(id, effectValue);
        }, 24);
      }
    },

    move : function(id) {
      clearTimeout(this.moveWatcher);
      this.moveWatcher = null;
      isMove = false;

      var winPosX = this.overlayUnits[id]['winPosX'];
      var winPosY = this.overlayUnits[id]['winPosY'];
      if (winPosX != this.util.offsetX() || winPosY != this.util.offsetY()) {
        isMove = true;
      }
      if (isMove) {
        this.overlayUnits[id]['winPosX'] = winPosX;
        this.overlayUnits[id]['winPosY'] = winPosY;

        if (this.effectWatcher != null) {
          if (this.effectExecute === false) {
            clearTimeout(this.effectWatcher);
            this.effectWatcher = null;
          } else {
            this.moveWatcher = setTimeout(function() {
              window['adingoFluct'].move(id);
            }, 100);
            return;
          }
        } else {
          var target = this.util.byId(id);
          this.util.setOpacity(target, 0);
        }
        this.effectExecute = true;
        this.visibleOverlay(id);
      }
      this.moveWatcher = setTimeout(function() {
        window['adingoFluct'].move(id);
      }, 100);
    }
  };

  AdingoFluct.prototype['showAd'] = AdingoFluct.prototype.showAd;
  AdingoFluct.prototype['callback'] = AdingoFluct.prototype.callback;
  AdingoFluct.prototype['setGroup'] = AdingoFluct.prototype.setGroup;
  window['adingoFluct'] = new AdingoFluct();
}
window['adingoFluct'].setGroup(window.document);


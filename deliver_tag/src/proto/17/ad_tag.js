/*jslint debug: false, forin: true, laxbreak: true, indent: 2, sub: true, windows: true, browser: true, vars: false, white: true, onevar: false, undef: true, nomen: false, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false*/

/*global window AdingoFluctCommon adingoFluctSync*/
/**
 * @depends ../../common/1.js
 * @depends ../../cookie_sync/1.js
 */
if (typeof (window['adingoFluct']) === 'undefined') {
  var AdingoFluct = function () {
    this.util = new AdingoFluctCommon();
    this.data = {};
    this.render_queue = []; //unit_id list
    this.rendered_units = []; //unit_id list
    this.effectWatcher = null;
    this.effectExecute = false;
    this.moveWatcher = null;
    this.moveExecute = false;
    this.overlayUnits = {}; // {unit_id => {'winPosX' => px, 'winPosY' => px}}
    this.reloadWatcher = null;
    this.synced = false;
    this.refreshUnits = {}; //{groupId => unit_data}
  };
  AdingoFluct.URL = 'http://y-nomura.sh.adingo.jp.dev.fluct.me/api/json/v1/?';
  AdingoFluct.LOAD_NONE = 0;
  AdingoFluct.LOADING = 1;
  AdingoFluct.LOADED = 2;
  AdingoFluct.LOAD_ERROR = 3;
  
  AdingoFluct.prototype = {
    /**
     * デストラクタ
     */
    destroy : function () {
      this.util = null;
      this.data = null;
      this.render_queue = null;
      this.rendered_units = null;
      if (this.effectWatcher !== null) {
        clearTimeout(this.effectWatcher);
        this.effectWatcher = null;
        this.effectExecute = false;
      }
      if (this.moveWatcher !== null) {
        clearTimeout(this.moveWatcher);
        this.moveWatcher = null;
        this.moveExecute = false;
      }
      this.overlayUnits = null;
      if (this.reloadWatcher !== null) {
        clearTimeout(this.reloadWatcher);
        this.reloadWatcher = null;
      }
      this.synced = false;
      this.refreshUnits = null;
    },

    /**
     * グループ情報をセットする
     * @param el
     */
    setGroup : function (el) {
      var params = this.util.parse_param(el);
      this.data[params['G']] = params;
      this.data[params['G']]['load_status'] = AdingoFluct.LOAD_NONE;
    },

    /**
     * jsonpのコールバック
     * @param json
     */
    callback : function (json) {
      if (json['status'] === 'success') {
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
            if (rest !== null) {
              this.showAd(rest);
            }
          }
        }
      }

      var gcount = 0;
      var loadedcount = 0;
      for (var g in this.data) {
        gcount = gcount + 1;
        var ginfo = this.data[g];
        if (ginfo['load_status'] === AdingoFluct.LOADED) {
          loadedcount = loadedcount + 1;
        }
      }
      if (gcount === loadedcount) {
        this.rendered_units = [];
      }
    },

    /**
     * リロードを起動する
     * @param gid
     * @param unit_id
     */
    reloadInvoke : function (gid, unit_id) {
      var group_info = this.data[gid];
      
      var rate = this.util.hv(group_info, 'rate');
      
      if (rate === null || parseInt(rate, 10) <= 0) {
        rate = 60; //default refresh rate (seconds)
      }
      this.reloadWatcher = setTimeout(function () {
        window['adingoFluct'].reload(gid, unit_id);
      }, rate * 1000);
    },

    /**
     * jsonをリロードする
     * @param gid
     * @param unit_id
     */
    reload : function (gid, unit_id) {
      if (this.reloadWatcher !== null) {
        clearTimeout(this.reloadWatcher);
        this.reloadWatcher = null;
      }
      var g_data = this.data[gid];
      g_data['load_status'] = AdingoFluct.NONE;
      this.render_queue.push(unit_id);
      this.load(gid);
    },

    /**
     * jsonをロードする
     * @param gid
     */
    load : function (gid) {
      var url = null;
      var g_data = this.data[gid];
      if (typeof (g_data['url']) !== 'undefined') {
        url = g_data['url']; // from query parameter
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

    /**
     * アドを表示するためのインターフェース
     * @param unit_id
     */
    showAd : function (unit_id) {
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
      for (var group_id in this.data) {
        var temp_group_info = this.data[group_id];
        if (typeof (temp_group_info['load_status']) !== 'undefined'
            && temp_group_info['load_status'] === AdingoFluct.LOADED) {
          for (var i = 0; i < temp_group_info['json']['num']; i += 1) {
            var temp_ad = temp_group_info['json']['ads'][i];
            if (String(temp_ad['unit_id']) === unit_id) {
              target_ad = [ group_id, temp_ad ];
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

    /**
     * アドを実際に表示する
     * @param adData
     */
    out : function (adData) {
      var gid = adData.shift();
      var adinfo = adData.shift();
      var unit_div_id = 'adingoFluctUnit_' + adinfo['unit_id'];
      this.util.clearDiv(adinfo['unit_id']);

      var insertAdId = null;
      if (adinfo['overlay'] === 1) {
        insertAdId = this.util.overlay(adinfo);
        this.moveWatcher = setTimeout(function () {
          window['adingoFluct'].move(insertAdId);
        }, 100);
      }
      else {
        insertAdId = unit_div_id;
      }
      switch (adinfo['creative_type']) {
      case 'html':
        this.util.html_ad(insertAdId, adinfo);
        break;
      case 'flash':
        this.util.flash_ad(insertAdId, adinfo);
        break;
      case 'image':
        this.util.image_ad(insertAdId, adinfo);
        break;
      default:
      }
      
      if (adinfo['overlay'] === 1) {
        this.visibleOverlay(insertAdId, 500);
        window.document.addEventListener('touchstart', function (e) {
          window['adingoFluct'].toucheHandler(e);
        }, true);
      }
      this.util.unit_beacon(unit_div_id, adinfo);
      
      if (adinfo['reload'] === 1) {
        this.refreshUnits[gid] = adinfo;
        this.reloadInvoke(gid, adinfo['unit_id']);
      }
      
    },
    /**
     * タッチイベントを監視
     * @param e
     */
    toucheHandler: function (e) {
      if (e.srcElement.offsetParent === null || e.srcElement.offsetParent.className !== 'adingoFluctOverlay') {
        if (this.effectWatcher !== null) {
          if (this.effectExecute === false) {
            clearTimeout(this.effectWatcher);
            this.effectWatcher = null;
          }
          else {
            return;
          }
        }
        for (var unit_element_id in this.overlayUnits) {
          this.visibleOverlay(unit_element_id, 1000);
        }
      }
    },
    /**
     * オーバレイ枠を可視化
     * @param id
     * @param wait
     */
    visibleOverlay : function (id, wait) {
      this.effectExecute = false;
      var target = this.util.byId(id);
      target.style.display = 'block';
      var lpos = this.util.lposXY(parseInt(target.style.width, 10),
          parseInt(target.style.height, 10));
      var x = Math.max(0, lpos['x']) + 'px';
      var y = lpos['y'] + 'px';
      if (this.util.offsetY() + this.util.wheight() >= this.util.dheight()) {
        y = lpos['top'] + 'px';
      }
      this.util.setOpacity(target, 0);
      target.style.top = y;
      target.style.left = x;
      target = null;
      this.overlayUnits[id] = {};
      this.overlayUnits[id]['winPosX'] = this.util.offsetX();
      this.overlayUnits[id]['winPosY'] = this.util.offsetY();

      this.effectWatcher = setTimeout(function () {
        window['adingoFluct'].show(id, 0);
      }, wait);
    },

    /**
     * 可視化エフェクト
     * @param id
     * @param effectValue
     */
    show : function (id, effectValue) {
      clearTimeout(this.effectWatcher);
      this.effectWatcher = null;
      var target = this.util.byId(id);
      effectValue = effectValue + 0.09;
      this.util.setOpacity(target, effectValue);
      target = null;
      if (effectValue <= 1) {
        this.effectWatcher = setTimeout(function () {
          window['adingoFluct'].show(id, effectValue);
        }, 24);
      }
    },

    /**
     * スクロール監視
     * @param id
     */
    move : function (id) {
      clearTimeout(this.moveWatcher);
      this.moveWatcher = null;
      var isMove = false;

      var winPosX = this.overlayUnits[id]['winPosX'];
      var winPosY = this.overlayUnits[id]['winPosY'];
      if (winPosX !== this.util.offsetX() || winPosY !== this.util.offsetY()) {
        isMove = true;
      }
      if (isMove) {
        this.overlayUnits[id]['winPosX'] = winPosX;
        this.overlayUnits[id]['winPosY'] = winPosY;

        if (this.effectWatcher !== null) {
          if (this.effectExecute === false) {
            clearTimeout(this.effectWatcher);
            this.effectWatcher = null;
          } else {
            this.moveWatcher = setTimeout(function () {
              window['adingoFluct'].move(id);
            }, 100);
            return;
          }
        } else {
          var target = this.util.byId(id);
          this.util.setOpacity(target, 0);
        }
        this.effectExecute = true;
        this.visibleOverlay(id, 500);
      }
      this.moveWatcher = setTimeout(function () {
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

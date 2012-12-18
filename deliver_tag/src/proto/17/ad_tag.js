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

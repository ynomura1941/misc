/*jslint windows: true, browser: true, vars: false, white: true, onevar: false, undef: true, nomen: false, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false*/
/*global window */
(function(_window){
  if (typeof (_window.adingoFluctCommon) == 'undefined') {
    
    var AdingoFluctCommon = function(__w){
      this.win = __w;
      this.doc = __w.document;
      
    };
    
    AdingoFluctCommon.prototype = {
        beacon: function(url){
          var beacon = this.doc.createElement('img');
          beacon.setAttribute('src', url);
          beacon.setAttribute('style', 'display:none;position:absolute;border:none;padding:0;margin:0;');
          beacon.setAttribute('width', 0);
          beacon.setAttribute('height', 0);
          return beacon;
        },
        create_element: function(tagName){
          return this.doc.createElement(tagName);
        },
        
        loader: function(gid, url){
          var loader = this.create_element('script');
          loader.setAttribute('id', 'fluctAdLoader_'+ gid);
          loader.src = url;
          return loader;
        },
        parse_param: function(e){
          var params = {};
          
          params.tag = this.myTag(e);
          
          var selfUrl = params.tag.src;
          if( selfUrl.indexOf('?') < 0 ){
            return params;
          }
          var queryStr = selfUrl.substring(selfUrl.indexOf('?')+1);
          var paramStr = queryStr.split('&');
          var paramNum = paramStr.length;
          
          for(var i = 0; i < paramNum;i ++){
            var param = paramStr[i].split('=');
            params[param[0]] = param[1];
          }
          params.requestQuery = queryStr;
          return params;
        },
        myTag: function(e){
          if (e.nodeName.toLowerCase() == 'script')
            return e;
          return arguments.callee(e.lastChild);
        },
        insertAfter: function(referenceNode, newNode) {
          referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
    };
    _window['adingoFluctCommon'] = new AdingoFluctCommon(_window);
  }
  _window=null;
})(window);
/*jslint windows: true, browser: true, vars: false, white: true, onevar: false, undef: true, nomen: false, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false*/
/*global window escape */

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
      
        AdingoFluctSync.render = function(util, target, syncs){
          for(var sync in syncs){
            if ( sync === 'logly') {
              util.insertAfter(target, AdingoFluctSync.logly(util, syncs[sync]));
            }
            else{
              util.insertAfter(target, AdingoFluctSync[sync](util));
            }
          }
        };
        win.adingoFluctSync = AdingoFluctSync;
    }
    win = null;
}(window));
/*jslint windows: true, browser: true, vars: false, white: true, onevar: false, undef: true, nomen: false, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false*/
/*global window */
/**
 * @depends ../../common.js
 * @depends ../../sync.js
 */
(function(_window){
  if (typeof (_window.adingoFluct) == 'undefined') {
    
    
    var AdingoFluct = function(_adingoFluctCommon){
      this.util = _adingoFluctCommon;
      this.data = {};
    };
    AdingoFluct.URL = 'http://y-nomura.sh.adingo.jp.dev.fluct.me/api/json/v1/?';
    AdingoFluct.prototype = {
        setGroup: function(el){
          var params = this.util.parse_param(el);
          this.data[params.G] = params;
          this.data[params.G].render_queue = new Array();
        },
        callback: function(json){
          if( json.status == 'success'){
            this.data[json.G].loaded = true;
            this.data[json.G].json   = json;
            if ( this.data[json.G].render_queue.length > 0 ){
              var unit_id = this.data[json.G].render_queue.shift();
              adingoFluctSync.render(this.util, this.util.doc.getElementById('adingoFluctUnit_'+ unit_id), json.syncs);
              this.showAd(unit_id);
              while( this.data[json.G].render_queue.length > 0){
                var rest = this.data[json.G].render_queue.shift();
                this.showAd(rest);
              }
            }
          }
        },
        
        load: function(gid){
          var url = null;
          var g_data = this.data[gid];
          if( typeof(g_data.url) != 'undefined'){
            url = g_data.url;
          }
          else{
            url = AdingoFluct.URL;
          }
          url = url + g_data.requestQuery + '&cb=adingoFluct.callback&ttl=' + Math.random();
          var tag= this.util.loader(gid, url);
          this.util.insertAfter(g_data.tag, tag);
          tag = null;
        },
        
        showAd: function(unit_id) {
          var target_ad = null;
          var unloads = [];
          
          var unit_div = this.util.doc.getElementById('adingoFluctUnit_'+ unit_id);
          if( unit_div === null ){
            unit_div = this.util.create_element('div');
            unit_div.setAttribute('id', 'adingoFluctUnit_'+ unit_id);
            this.util.insertAfter(this.util.myTag(this.util.win.document), unit_div);
          }
          for (var group_id in this.data) {
            console.log(group_id);
            var temp_group_info = this.data[group_id];
            if ( typeof(temp_group_info.loaded) !== 'undefined' && temp_group_info.loaded === true ){
              for ( var ad_counter = 0; ad_counter < temp_group_info.json.num; ad_counter++ ){
                var temp_ad = temp_group_info.json.ads[ad_counter];
                console.log(temp_ad,unit_id);
                if( temp_ad.unit_id == unit_id){
                  target_ad = temp_ad;
                  temp_ad = null;
                  break;
                }
              }
            }
            else{
              unloads.push(group_id);
            }
          }
          if ( target_ad === null ) {
            for ( var load_counter = 0; load_counter < unloads.length; load_counter++ ){
              var load_group = unloads[load_counter];
              if (  this.data[load_group].render_queue.length == 0 ){
                this.data[load_group].render_queue.push(unit_id);
                this.load(load_group);
              }
              else{
                this.data[load_group].render_queue.push(unit_id);
              }
              
            }
          }
          else{
            console.log('prepared rendering!:', target_ad);
          }
        }
    };
    
    _window['adingoFluct'] = new AdingoFluct(adingoFluctCommon);
  }
  _window['adingoFluct'].setGroup(_window.document);
  _window = null;
})(window);

/*jslint windows: true, browser: true, vars: false, white: true, onevar: false, undef: true, nomen: false, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false*/
/*global window */
/**
 * @depends ../../common/1.js
 * @depends ../../cookie_sync/1.js
 */
(function(_window){
  if (typeof (_window['adingoFluct']) == 'undefined') {
    
    
    var AdingoFluct = function(_adingoFluctCommon){
      this.util = _adingoFluctCommon;
      this.data = {};
      this.render_queue = [];
      this.rendered_units = [];
    };
    AdingoFluct.URL = 'http://y-nomura.sh.adingo.jp.dev.fluct.me/api/json/v1/?';
    AdingoFluct.LOAD_NONE = 0;
    AdingoFluct.LOADING = 1;
    AdingoFluct.LOADED = 2;
    AdingoFluct.LOAD_ERROR = 3;
    AdingoFluct.prototype = {
        setGroup: function(el){
          
          var params = this.util.parse_param(el);
          this.data[params['G']] = params;
          this.data[params['G']]['load_status'] = AdingoFluct.LOAD_NONE;
        },
        callback: function(json){
          if( json['status'] == 'success'){
            this.util.deleteById('fluctAdLoader_' + json['G']);
            var s_group_data = this.data[json['G']];
            s_group_data['load_status'] = AdingoFluct.LOADED;
            s_group_data['json']   = json;
            var temp_queue = this.render_queue.slice(0);
            this.render_queue=[];
            if ( temp_queue.length > 0 ){
              var unit_id = temp_queue.shift();
              adingoFluctSync.render(this.util, this.util.doc.getElementById('adingoFluctUnit_'+ unit_id), json['syncs']);
              this.showAd(unit_id);
              while( temp_queue.length > 0){
                var rest = temp_queue.shift();
                if(rest != null){
                  this.showAd(rest);
                }
                
              }
            }
          }
          
          var gcount = 0;
          var loadedcount = 0;
          for(var g in this.data){
            gcount = gcount + 1;
            var ginfo = this.data[g];
            if( ginfo['load_status'] == AdingoFluct.LOADED ){
              loadedcount = loadedcount + 1;
            }
          }
          if( gcount === loadedcount ){
            this.rendered_units = [];
          }
        },
        
        load: function(gid){
          var url = null;
          var g_data = this.data[gid];
          if( typeof(g_data['url']) != 'undefined'){
            url = g_data['url'];
          }
          else{
            url = AdingoFluct.URL;
          }
          g_data['load_status'] = AdingoFluct.LOADING;
          url = url + g_data['requestQuery'] + '&cb=adingoFluct.callback&ttl=' + Math.random();
          var tag= this.util.loader(gid, url);
          this.util.insertAfter(g_data['tag'], tag);
          tag = null;
        },
        
        showAd: function(unit_id) {
          var target_ad = null;
          if( this.rendered_units.indexOf(unit_id) !== -1 ){
            return;
          }
          var unit_div = this.util.doc.getElementById('adingoFluctUnit_'+ unit_id);
          if( unit_div === null ){
            unit_div = this.util.create_element('div');
            unit_div.setAttribute('id', 'adingoFluctUnit_'+ unit_id);
            this.util.insertAfter(this.util.myTag(this.util.win.document), unit_div);
          }
          for (var group_id in this.data) {
            var temp_group_info = this.data[group_id];
            if ( typeof(temp_group_info['load_status']) !== 'undefined' && temp_group_info['load_status'] === AdingoFluct.LOADED ){
              for ( var ad_counter = 0; ad_counter < temp_group_info['json']['num']; ad_counter++ ){
                var temp_ad = temp_group_info['json']['ads'][ad_counter];
                if( temp_ad['unit_id'] == unit_id){
                  target_ad = [group_id, temp_ad];
                  temp_ad = null;
                  break;
                }
              }
            }
            else{
              if( this.rendered_units.indexOf(unit_id) === -1){
                this.render_queue.push(unit_id);
              }
              
              if( temp_group_info['load_status'] === AdingoFluct.LOAD_NONE ){
                this.load(group_id);
              }
            }
          }
          if(target_ad !== null){
            this.rendered_units.push(unit_id);
            this.out(target_ad);
          }
        },
        
        out: function(adData){
          
          var gid = adData.shift();
          var adinfo = adData.shift();
          var unit_div_id = 'adingoFluctUnit_'+ adinfo['unit_id'];
          switch(adinfo['creative_type']){
          case 'html':
            this.util.html_ad(unit_div_id, adinfo);
            break;
          case 'flash':
            this.util.flash_ad(unit_div_id, adinfo);
            break;
          case 'image':
            this.util.image_ad(unit_div_id, adinfo);
            break;
          default:
            
          }
          this.util.unit_beacon(unit_div_id, adinfo);
        }
    };
    
    AdingoFluct.prototype['showAd'] = AdingoFluct.prototype.showAd;
    AdingoFluct.prototype['callback'] = AdingoFluct.prototype.callback;
    AdingoFluct.prototype['setGroup'] = AdingoFluct.prototype.setGroup;
    _window['adingoFluct'] = new AdingoFluct(adingoFluctCommon);
  }
  _window = null;
})(window);
window['adingoFluct'].setGroup(window.document);

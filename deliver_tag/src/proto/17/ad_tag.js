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
          this.data[params['G']] = params;
          this.data[params['G']]['render_queue'] = new Array();
        },
        callback: function(json){
          if( json['status'] == 'success'){
            this.data[json['G']]['loaded'] = true;
            this.data[json['G']]['json']   = json;
            if ( this.data[json['G']]['render_queue'].length > 0 ){
              var unit_id = this.data[json['G']]['render_queue'].shift();
              adingoFluctSync.render(this.util, this.util.doc.getElementById('adingoFluctUnit_'+ unit_id), json['syncs']);
              this.showAd(unit_id);
              while( this.data[json['G']]['render_queue'].length > 0){
                var rest = this.data[json['G']]['render_queue'].shift();
                this.showAd(rest);
              }
            }
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
          url = url + g_data['requestQuery'] + '&cb=adingoFluct.callback&ttl=' + Math.random();
          var tag= this.util.loader(gid, url);
          this.util.insertAfter(g_data['tag'], tag);
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
            var temp_group_info = this.data[group_id];
            if ( typeof(temp_group_info['loaded']) !== 'undefined' && temp_group_info['loaded'] === true ){
              for ( var ad_counter = 0; ad_counter < temp_group_info['json']['num']; ad_counter++ ){
                var temp_ad = temp_group_info['json']['ads'][ad_counter];
                if( temp_ad['unit_id'] == unit_id){
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
              if (  this.data[load_group]['render_queue'].length == 0 ){
                this.data[load_group]['render_queue'].push(unit_id);
                this.load(load_group);
              }
              else{
                this.data[load_group]['render_queue'].push(unit_id);
              }
              
            }
          }
          else{
            //console.log('prepared rendering!:', target_ad);
          }
        }
    };
    
    AdingoFluct.prototype['showAd'] = AdingoFluct.prototype.showAd;
    AdingoFluct.prototype['callback'] = AdingoFluct.prototype.callback;
    _window['adingoFluct'] = new AdingoFluct(adingoFluctCommon);
  }
  _window['adingoFluct'].setGroup(_window.document);
  _window = null;
})(window);
/**
 * @depends ../../common.js
 * @depends ../../sync.js
 */
(function(_window){
  if (typeof (_window.adingoFluct) == 'undefined') {
    
    
    var AdingoFluct = function(_adingoFluctCommon){
      this.util = _adingoFluctCommon;
      this.data = {};
      this.jsons = [];
    };
    AdingoFluct.URL = 'http://y-nomura.sh.adingo.jp.dev.fluct.me/api/json/v1/?';
    AdingoFluct.prototype = {
        fetchAdData: function(el){
          var params = this.util.parse_param(el);
          this.data[params.G] = params;
          var url = null;
          if( typeof(params.url) != 'undefined'){
            url = params.url;
          }
          else{
            url = AdingoFluct.URL;
          }
          url = url + params.requestQuery + '&cb=adingoFluct.callback&ttl=' + Math.random();
          
          
          var tag= this.util.loader(params.G, url);
          
          this.util.insertAfter(params.tag, tag);
        },
        callback: function(json){
          
          if( json.status == 'success'){
            this.jsons.push(json);
          }
        },
        
        showAd: function(unit_id){
          console.log(unit_id);
        }
    };
    
    _window['adingoFluct'] = new AdingoFluct(adingoFluctCommon);
  }
  _window['adingoFluct'].fetchAdData(_window.document);
  _window = null;
})(window);
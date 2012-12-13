(function(_window){
  if (typeof (_window.adingoFluctCommon) == 'undefined') {
    
    var AdingoFluctCommon = function(__w){
      this.win = __w;
      this.doc = __w.document;
      
    };
    
    AdingoFluctCommon.prototype = {
        beacon: function(url){
          var beacon = doc.createElement('img');
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
(function(_window){
  if (typeof (_window.adingoFluctSync) == 'undefined') {
    
    var AdingoFluctSync = function(){};
    
    AdingoFluctSync.logly = function(util, logyid){
      var ref = '';
      var url = document.referrer;
      try{ ref = parent.document.referrer; }catch(e){ }
      try{ url = parent.document.URL; }catch(e){ }
      var _lgy_ssp_id = 1;
      var _lgy_ssp_audience_id = '$luid';
      var _lgy_query = 'sid='+_lgy_ssp_id+'&aid='+_lgy_ssp_audience_id+'&url='+escape(url)+'&rurl='+escape(ref);
      var src = (('https:' == document.location.protocol) ? 'https://' : 'http://') + 'dsp.logly.co.jp/sg.gif?' + _lgy_query;
      return util.beacon(src);
    };
    
    AdingoFluctSync.scaleout = function(util){
      var so_tp = encodeURIComponent(document.location.href);
      var so_pp = encodeURIComponent(document.referrer);
      var so_src = 'http://bid.socdm.com/rtb/sync?proto=adingo&sspid=adingo'+ '&tp=' + so_tp + '&pp=' + so_pp +"&t=.gif";
      return util.beacon(so_src);
    };
    AdingoFluctSync.fout = function(util){
      return util.beacon('http://sync.fout.jp/sync?xid=fluct');
    };
    
    _window['adingoFluctSync'] = AdingoFluctSync;
  }
  _window = null;
})(window);
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
          
          console.dir(this);
          
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

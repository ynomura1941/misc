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
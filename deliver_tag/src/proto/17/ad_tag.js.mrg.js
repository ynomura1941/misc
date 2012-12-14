/*jslint windows: true, browser: true, vars: false, white: true, onevar: false, undef: true, nomen: false, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false*/
/*global window */
(function(_window){
  if (typeof (_window.adingoFluctCommon) == 'undefined') {
    
    var AdingoFluctCommon = function(__w){
      this.win = __w;
      this.doc = __w.document;
      this.flashInfo = (function(){
        var rtn = {};
        rtn['v']=0, rtn['exist'] = false, rtn['done'] = false;
        rtn['tag_template'] = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' +
            'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"' +
            'width="{$sWidth}" height="{$sHeight}" style="border:none;padding:0;margin:0">' +
            '<param name="movie" value="{$sSrc}">' +
            '<param name="flashvars" value="{$flashVars}">' +
            '<param name="allowScriptAccess" value="always">' +
            '<param name="quality" value="autohigh">' +
            '<param name="bgcolor" value="#fff">' +
            '<param name="wmode" value="opaque">' +
            '<embed src="{$sSrc}"' +
            'flashvars="{$flashVars}"' +
            'quality="autohigh"' +
            'allowscriptaccess="always"' +
            'swliveconnect="FALSE"' +
            'width="{$sWidth}"' +
            'height="{$sHeight}"' +
            'wmode="opaque"' +
            'type="application/x-shockwave-flash"' +
            'pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash">' +
            '</object>';
        var func = null;
        return function(){
          if (func != null){
            return func();
          }
          var userAgent = window.navigator.userAgent.toLowerCase();
          if (userAgent.indexOf('msie') != -1) {
            try{
              if( typeof new ActiveXObject('ShockwaveFlash.ShockwaveFlash') !== 'undefined' ){
                var flashOCX = new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version");
                rtn['v'] = parseInt(flashOCX.match(/([0-9]+)/)[0]);
                rtn['exist'] = true;
              }
            }
            catch(e){
            }
          }
          else{
            if( typeof navigator.plugins["Shockwave Flash"] !== 'undefined' ){
              rtn['v'] =parseInt(navigator.plugins["Shockwave Flash"].description.match(/\d+\.\d+/));
              rtn['exist'] = rtn['v'] != 0 ? true : false;
            }
          }
          rtn['done'] = true;
          func = function(){return rtn;};
          return func();
        };
      })();
    };
    
    AdingoFluctCommon.prototype = {
        /**
         * image 生成
         * cookie sync や imp beacon用のイメージタグを生成
         * @param url 
         * @returns
         */
        beacon: function(url){
          var beacon = this.doc.createElement('img');
          beacon.setAttribute('src', url);
          beacon.setAttribute('style', 'display:none;position:absolute;border:none;padding:0;margin:0;');
          beacon.setAttribute('width', 0);
          beacon.setAttribute('height', 0);
          return beacon;
        },
        
        /**
         * element 生成
         * @param tagName 生成するタグ名
         * @returns
         */
        create_element: function(tagName){
          return this.doc.createElement(tagName);
        },
        
        /**
         * ID指定でelementを削除する
         * @param id
         */
        deleteById: function(id){
          var target = this.byId(id);
          target.parentNode.removeChild(target);
        },
        /**
         * JSONP を行うscriptタグ生成
         * @param gid グループID
         * @param url JSONPのエンドポイントURL
         * @returns {___loader0}
         */
        loader: function(gid, url){
          var loader = this.create_element('script');
          loader.setAttribute('id', 'fluctAdLoader_'+ gid);
          loader.src = url;
          return loader;
        },
        
        byId: function(id){
          return this.doc.getElementById(id);
        },
        iframe: function(id, ad){
          var w = ad['w'] + 'px', h = ad['h'] + 'px';
          var temp = this.create_element('iframe');
          temp.setAttribute('id', id);
          temp.setAttribute('style', 'width:' + w + 'px;height:' + h
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
        
        parse_param: function(e){
          var params = {};
          
          params['tag'] = this.myTag(e);
          
          var selfUrl = params['tag'].src;
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
          params['requestQuery'] = queryStr;
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
        ,
        
        unit_beacon: function(unit_id, ad){
          var div = this.byId(unit_id);
          var beacon = this.beacon(ad.beacon);
          
          div.appendChild(beacon);
          div = null;
          beacon = null;
          return true;
        }
        
        ,
        html_ad: function(id,ad){
          var div = this.byId(id);
          var iframe = this.iframe('adingoFluctIframe_'+ ad['unit_id'], ad);
          
          div.appendChild(iframe);
          var iframeDoc = iframe.contentWindow.document;
          iframeDoc.open();
          iframeDoc.write(
              '<html><head></head><body style="padding:0px;margin:0px;border:none;">'
                  + ad['html'] + '</body></html>');
          iframeDoc.close();
          iframeDoc = null;
          iframe =null;
          return true;
        },
        
        image_ad: function(id, ad){
          var div = this.byId(id);
          var temp = this.create_element('img');
          temp.setAttribute('src', ad['creative_url']);
          temp.setAttribute('width', ad['width']);
          temp.setAttribute('height', ad['height']);
          if( ad.alt.length > 0){
            temp.setAttribute('alt', this.unicodeDecoder(ad['alt']));
          }
          var link  = this.create_element('a');
          link.setAttribute('href', ad['landing_url']);
          link.setAttribute('target', '_blank');
          div.appendChild(link);
          link.appendChild(temp);
          div = null;
          link = null;
          img = null;
          return true;

        },
        
        flash_ad: function(id, ad){
          var flashInfo = this.flashInfo();
          console.log(flashInfo);
          if( flashInfo['exist'] && flashInfo['v'] > 5){
            var div = this.byId(id);
            var flashVars = 'clickTAG=' + escape(ad['landing_url']) + '&targetTAG=' + '_blank';
            var objStr = flashInfo['tag_template'].replace(/\{\$sWidth\}/g, ad['width']);
            objStr = objStr.replace(/\{\$sHeight\}/g, ad['height']);
            objStr = objStr.replace(/\{\$sSrc}/g, ad['creative_url']);
            objStr = objStr.replace(/\{\$flashVars}/g, flashVars);
            var iframe = this.iframe('adingoFluctIframe_'+ ad['unit_id'], ad);
            div.appendChild(iframe);
            var iframeDoc = iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(
                '<html><head></head><body style="padding:0px;margin:0px;border:none;">'
                    + objStr + '</body></html>');
            iframeDoc.close();
            iframeDoc = null;
            iframe =null;
            div= null;
            return true;
          }
          else{
            if(ad['alt_mage'] != null && ad['alt_mage'] != ''){
              var div = this.byId(id);
              var temp = this.create_element('img');
              temp.setAttribute('src', ad['alt_image']);
              temp.setAttribute('width', ad['width']);
              temp.setAttribute('height', ad['height']);
              if( ad.alt.length > 0){
                temp.setAttribute('alt', this.unicodeDecoder(ad['alt']));
              }
              var link  = this.create_element('a');
              link.setAttribute('href', ad['landing_url']);
              link.setAttribute('target', '_blank');
              div.appendChild(link);
              link.appendChild(temp);
              div = null;
              link = null;
              img = null;
              return true;
            }
            else{
              return false;
            }
          }
        },
        unicodeDecoder: function(str){
          arrs=str.match(/\\u.{4}/g);
          var t="";
          if( arrs == null ){
            return '';
          }
          for(var i=0;i<arrs.length;i++){
              t+=String.fromCharCode(arrs[i].replace("\\u","0x"));
          }
          return(t);
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
        AdingoFluctSync['logly'] = function (util, logyid) {
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
        
        AdingoFluctSync['scaleout'] = function (util) {
            var so_tp = encodeURIComponent(util.doc.location.href), so_pp = encodeURIComponent(util.doc.referrer), so_src = 'http://bid.socdm.com/rtb/sync?proto=adingo&sspid=adingo' + '&tp=' + so_tp + '&pp=' + so_pp + "&t=.gif";
            return util.beacon(so_src);
        };
        AdingoFluctSync['fout'] = function (util) {
            return util.beacon('http://sync.fout.jp/sync?xid=fluct');
        };
      
        AdingoFluctSync.render = function(util, target, syncs){
          for(var sync in syncs){
            if ( sync === 'logly') {
              util.insertAfter(target, AdingoFluctSync[sync](util, syncs[sync]));
            }
            else{
              util.insertAfter(target, AdingoFluctSync[sync](util));
            }
          }
        };
        win["adingoFluctSync"] = AdingoFluctSync;
    }
    win = null;
}(window));
/*jslint windows: true, browser: true, vars: false, white: true, onevar: false, undef: true, nomen: false, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false*/
/*global window */
/**
 * @depends ../../common/1.js
 * @depends ../../cookie_sync/1.js
 */
(function(_window){
  if (typeof (_window.adingoFluct) == 'undefined') {
    
    
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
          console.log(gid,adinfo);
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
    _window['adingoFluct'] = new AdingoFluct(adingoFluctCommon);
  }
  _window['adingoFluct'].setGroup(_window.document);
  _window = null;
})(window);

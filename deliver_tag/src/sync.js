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
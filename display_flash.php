<?php
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');

setcookie("hoge","test!!!");
$flash_url   = $_GET['furl'] ?: '';
$landing_url = $_GET['lurl'] ?: '';
$width       = $_GET['w']    ?: '';
$height      = $_GET['h']    ?: '';

$chk = true;
if( preg_match('/\A(http|https):\/\//iu',$flash_url) !== 1 || preg_match('/\A(http|https):\/\//iu',$landing_url) !== 1){
  $chk = false;
}
if( preg_match('/\A\d+\z/iu',$width) !== 1 || preg_match('/\A\d+\z/iu',$height) !== 1){
  $chk = false;
}

function he($str){
  return htmlspecialchars($str, ENT_COMPAT, 'UTF-8');
}

?>


<?php if($chk): ?>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <body>
    <object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' codebase='https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0' id='fluct_flash' width='<?php echo he($width);?>' height='<?php echo he($height);?>'>
      <param name='movie' value='<?php echo he($flash_url);?>'>
      <param name='flashvars' value='<?php echo he("clickTAG=".$landing_url . "&targetTAG=_blank");?>'>
      <param name='allowScriptAccess' value='never'>
      <param name='quality' value='autohigh'>
      <param name='bgcolor' value='#fff'>
      <param name='wmode' value='opaque'>
      <embed src='<?php echo he($flash_url); ?>' flashvars='<?php echo he("clickTAG=".$landing_url . "&targetTAG=_blank");?>' quality='autohigh' allowscriptaccess='always' swliveconnect='FALSE' width='<?php echo he($width);?>' height='<?php echo he($height);?>' wmode='opaque' type='application/x-shockwave-flash' pluginspage='https://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash'></object>
  </body>
</html>
<?php else: ?>
表示できません。
<?php endif; ?>

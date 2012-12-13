<?php
mb_internal_encoding('UTF-8');

$sh_host = $_GET['sh'] ?: NULL;
$gid     = $_GET['gid'] ?: NULL;
$uids    = $_GET['uid'] ?: NULL;

$chk = true;

if( preg_match('/\A[0-9a-z\.]+\z/iu', $sh_host) !== 1 ){
  $chk = false;
}

if( preg_match('/\A[0-9]+\z/iu', $gid) !== 1){
  $chk = false;
}

foreach($uids as $uid){
  if( preg_match('/\A[0-9]+\z/iu', $uid) !== 1){
    $chk = false;
    break;
  }
}

function he($str){
  return htmlspecialchars($str, ENT_COMPAT, 'UTF-8');
}
?>
<?php if($chk): ?>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <script type="text/javascript" src="<?php echo he("http://${sh_host}/?G=${gid}&guid=ON");?>"></script>
    <title>fluct tag preview</title>
  </head>
  <body>
   <div>
     <h1>グループID:<?php echo he($gid); ?></h1>
   </div>
   <?php if($uids instanceof String): ?>
    <hr/>
    <div>
      <h2>ユニットID: <?php echo he($uids); ?></h2>
      <script type="text/javascript">
        //<![CDATA[
        if(typeof(adingoFluct)!="undefined") adingoFluct.showAd('<?php echo he($uids);?>');
        //]]>
        </script>
    </div>
   <?php else: ?>
   <?php foreach($uids as $key => $value): ?>
    <hr/>
    <div>
      <h2>ユニットID: <?php echo he($value); ?></h2>
      <script type="text/javascript">
        //<![CDATA[
        if(typeof(adingoFluct)!="undefined") adingoFluct.showAd('<?php echo he($value);?>');
        //]]>
        </script>
    </div>
   <?php endforeach; ?>
   <?php endif; ?>
  </body>
</html>
<?php else: ?>
表示できません。
<?php endif; ?>

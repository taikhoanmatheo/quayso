<?php
//error_reporting(E_ERROR | E_PARSE);
error_reporting(E_ERROR | E_WARNING | E_PARSE);



$host="localhost"; //replace with your hostname 
$username="root"; //replace with your username 
$password=""; //replace with your password
$db_name="mld"; //replace with your database 
$con=mysql_connect("$host", "$username", "$password")or die("cannot connect"); 
mysql_set_charset('utf8',$con);
mysql_select_db("$db_name")or die("cannot select DB");
$sql = "select STT,MODEL,IMEI,BILL_ID,DATE_BUY,DOT from customer2";
$result = mysql_query($sql);
$json = array();
if(mysql_num_rows($result)){
	
	while($row=mysql_fetch_row($result)){
		$jr = array();
		$jr['STT']=$row[0];
		$jr['MODEL']=$row[1];
		$jr['IMEI']=$row[2];
		$jr['BILL_ID']=$row[3];
		$jr['DATE_BUY']=$row[4];
		$jr['DOT']=$row[5];
		
		$json[]=$jr;

	}
}
mysql_close();
header('Content-Type: application/json; charset=utf-8');
echo json_encode($json); 

// please refer to our PHP JSON encode function tutorial for learning json_encode function in detail 
?>

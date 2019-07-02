<?php
error_reporting(E_ERROR | E_PARSE);
$host="localhost"; //replace with your hostname 
$username="root"; //replace with your username 
$password=""; //replace with your password
$db_name="mld"; //replace with your database 
$con=mysql_connect("$host", "$username", "$password")or die("cannot connect"); 
mysql_select_db("$db_name")or die("cannot select DB");
$sql = "select STT,NGANH,MODEL,IMEI,PHONE,DOT from customer3"; //replace emp_info with your table name
$result = mysql_query($sql);
$json = array();
if(mysql_num_rows($result)){
	while($row=mysql_fetch_row($result)){
		$jr = array();
		$jr['STT']=$row[0];
		$jr['NGANH']=$row[1];
		$jr['MODEL']=$row[2];
		$jr['IMEI']=$row[3];
		$jr['PHONE']=$row[4];
		$jr['DOT']=$row[5];
		
		$json[]=$jr;

	}
}
mysql_close();
echo json_encode($json); 
// please refer to our PHP JSON encode function tutorial for learning json_encode function in detail 
?>
<?php
require 'loginproc.php';
include 'arrays.inc';
//include 'config.inc';

$vm_offset=$_GET['vm_offset'];



//Time
$cmd = "uptime -s && uptime -p";
exec($cmd, $output, $result);
$st = '"st" :["' . $output[0] . '"]';
$output[1] = str_replace("up ", "", $output[1]);
$ut = '"ut" :["' . $output[1] . '"]';

//system_usage

$q1 = "select date_format(updated_dt,'%H:%i'),cpu_percent,mem_percent from naanal.cpu_mem_usage order by updated_dt desc limit 10;";


$result = mysql_query($q1, $con2);
$labels = '"labels":[';
$data_set1 = '"data1":[';
$data_set2 = '"data2":[';
while ($select_row = mysql_fetch_array($result)) {
	$labels = $labels . '"' . $select_row[0] . '" ,';
	$data_set1 = $data_set1 . $select_row[1] . ',';
	$data_set2 = $data_set2 . $select_row[2] . ',';

}
$labels = substr($labels, 0, -1);
$data_set1 = substr($data_set1, 0, -1);
$data_set2 = substr($data_set2, 0, -1);
$labels = $labels . "]";
$data_set1 = $data_set1 . "]";
$data_set2 = $data_set2 . "]";

//Instances

$totq = mysql_query("select count(id),sum(vcpus),sum(memory_mb),sum(root_gb) from nova.instances where deleted=0", $con2);
$actq = mysql_query("select count(id),sum(vcpus),sum(memory_mb),sum(root_gb) from nova.instances where deleted=0 and power_state=1", $con2);

$tot = mysql_result($totq, 0, 0);
$act = mysql_result($actq, 0, 0);
$inact = $tot - $act;

$piedata = '"piedata" :[ {"value" : ' . $act . ', "color" : "#B40E06", "label" : "Active"},{"value" : ' . $inact . ', "color" : "#41BFFA", "label" : "Shutdown"} ]';

$ins_total = $act . " / " . $tot;
$ins = '"ins" :["' . $ins_total . '"]';

//$core='"" :["'.$.'"]';

//cores
$core_tot = mysql_result($totq, 0, 1);
$core = '"core" :["' . $core_tot . '"]';

//mem
$mem_tot = mysql_result($totq, 0, 2);
$mem = '"mem" :["' . $mem_tot . '"]';

//disk
$disk_tot = mysql_result($totq, 0, 3);
$disk = '"disk" :["' . $disk_tot . '"]';

//top_vm_cpus

$meter_id = mysql_result(mysql_query("select id from ceilometer.meter where name='cpu_util'",$con2), 0, 0);

$timestamp = mysql_result(mysql_query("select max(timestamp) from ceilometer.sample where meter_id=$meter_id",$con2), 0, 0);

$cpuq = "select  (select display_name from nova.instances where uuid = resource_id ),volume from ceilometer.sample where timestamp='$timestamp' and meter_id=$meter_id  order by volume desc limit 10";

$cpur = mysql_query($cpuq, $con2);
$cpu_labels = '"cpu_labels":[';
$cpu_data_set = '"cpu_data":[';
while ($select_row = mysql_fetch_array($cpur)) {
	$cpu_labels = $cpu_labels . '"' . $select_row[0] . '" ,';
	$cpu_data_set = $cpu_data_set . $select_row[1] . ',';

}
$cpu_labels = substr($cpu_labels, 0, -1);
$cpu_data_set = substr($cpu_data_set, 0, -1);
$cpu_labels = $cpu_labels . "]";
$cpu_data_set = $cpu_data_set . "]";

//all_vm_cpus

$all_cpuq = "select  (select display_name from nova.instances where uuid = resource_id )as name,volume from ceilometer.sample where timestamp='$timestamp' and meter_id=$meter_id  order by name asc limit $vm_offset,$vm_limit";


$all_cpur = mysql_query($all_cpuq, $con2);
$all_cpu_labels = '"all_cpu_labels":[';
$all_cpu_data_set = '"all_cpu_data":[';
while ($select_row = mysql_fetch_array($all_cpur)) {
	$all_cpu_labels = $all_cpu_labels . '"' . $select_row[0] . '" ,';
	$all_cpu_data_set = $all_cpu_data_set . $select_row[1] . ',';

}
$all_cpu_labels = substr($all_cpu_labels, 0, -1);
$all_cpu_data_set = substr($all_cpu_data_set, 0, -1);
$all_cpu_labels = $all_cpu_labels . "]";
$all_cpu_data_set = $all_cpu_data_set . "]";





mysql_close();
$php_var = '{  ' . $labels . '  , ' . $data_set1 . '  , ' . $data_set2 . ',' . $piedata . ',' . $st . ',' . $ut . ',' . $ins . ',' . $core . ',' . $mem . ',' . $disk . ' ,'.$cpu_labels.','.$cpu_data_set.','.$all_cpu_labels.','.$all_cpu_data_set.' }';
echo $php_var;
?>

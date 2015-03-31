<?php
require 'loginproc.php';
include 'arrays.inc';

$fn = $_GET['fn'];
$sub_fn = $_GET['sub_fn'];
$server = $_GET['server'];
$img_nm = $_GET['img_nm'];
$flv_nm = $_GET['flv_nm'];
$sec_grp = $_GET['sec_grp'];
$flt_ip = $_GET['flt_ip'];
$org_ins_nm = $_GET['org_ins_nm'];
$org_flv_nm = $_GET['org_flv_nm'];
$org_flt_ip = $_GET['org_flt_ip'];

$auth_cmd = $_SESSION['auth_cmd'];

#$q1 = "SELECT display_name,(select floating_ip_address from neutron.floatingips where fixed_port_id = (select id   from neutron.ports where device_id =uuid ) )as External_ip,(select ip_address from neutron.ipallocations where port_id = (select id  from neutron.ports where device_id =uuid ) )as Internal_ip,power_state,vm_state,task_state,memory_mb as allocated_ram,root_gb as allocated_harddisk FROM nova.instances where vm_state!='deleted' order by memory_mb;";

$limit = $_GET['limit'];
$offset = $_GET['offset'];

$num_rows = mysql_result(mysql_query("select count(*) from nova.instances where deleted=0 and vm_state!='deleted'",$con2), 0);
$total_pages = ceil($num_rows / $limit);
$current_page = ceil(($offset + 1) / $limit);

function instanceadd() {
	global $auth_cmd, $server, $img_nm, $flv_nm, $sec_grp, $net_id, $flt_ip,$max_count;

	$cmd1 = "nova $auth_cmd boot  --image $img_nm --flavor $flv_nm --security-groups $sec_grp --nic net-id=$net_id   $server";
	//echo $cmd1;
	exec($cmd1);
	if ($flt_ip != 'none') {
		$cmd2 = "nova $auth_cmd floating-ip-associate $server $flt_ip";
		//echo $cmd2;
		exec($cmd2);
	}
}

function instancedel($ser) {
	global $auth_cmd;

	$cmd1 = "nova $auth_cmd delete $ser";
	//echo $cmd1;
	exec($cmd1);

}

function floatip_dis_associate() {
	global $auth_cmd, $server, $flt_ip, $org_flt_ip;

	if ($org_flt_ip != 'none') {
		$cmd1 = "nova $auth_cmd floating-ip-disassociate $server $org_flt_ip";
		//echo $cmd1;
		exec($cmd1);
	}

}

function floatip_associate() {
	global $auth_cmd, $server, $flt_ip;

	if ($flt_ip != 'none') {
		$cmd = "nova $auth_cmd floating-ip-associate $server $flt_ip";
		//echo $cmd;

		exec($cmd);
	}
}

function start($ser) {
	global $auth_cmd, $con2;
	$q = "select power_state from nova.instances where display_name='$ser' and deleted=0";
	$pow_state = mysql_result(mysql_query($q, $con2), 0, 0);
	if ($pow_state == 4 or $pow_state == 3 or $pow_state == 7) {
		$cmd = "nova $auth_cmd start $ser";
		//echo $cmd;
		exec($cmd);

	}

}

function stop($ser) {
	global $auth_cmd, $con2;
	$q = "select power_state from nova.instances where display_name='$ser' and deleted=0";
	$pow_state = mysql_result(mysql_query($q, $con2), 0, 0);
	if ($pow_state == 1) {
		$cmd = "nova $auth_cmd stop $ser";
		//echo $cmd;
		exec($cmd);

	}

}

if ($sub_fn == 'activity') {
	if ($fn == 'start') {
		start($server);
	} elseif ($fn == 'start1') {

		$tmp = str_replace("'", "", $server);
		$tmp = str_replace("(select,", "", $tmp);
		$tmp = str_replace("select", "", $tmp);
		$tmp = str_replace("(", "", $tmp);
		$tmp = str_replace(")", "", $tmp);
		$arr = explode(",", $tmp);
		foreach ($arr as $val) {
			if (!empty($val)) {
				start($val);

			}
		}

	} elseif ($fn == 'stop') {
		stop($server);
	} elseif ($fn == 'stop1') {

		$tmp = str_replace("'", "", $server);
		$tmp = str_replace("(select,", "", $tmp);
		$tmp = str_replace("select", "", $tmp);
		$tmp = str_replace("(", "", $tmp);
		$tmp = str_replace(")", "", $tmp);
		$arr = explode(",", $tmp);
		foreach ($arr as $val) {
			if (!empty($val)) {
				stop($val);

			}
		}

	} elseif ($fn == 'reboot') {
		$cmd = "nova $auth_cmd reboot $server";
		//echo $cmd;
		exec($cmd);
	} elseif ($fn == 'cons') {

		$cmd = "nova $auth_cmd get-vnc-console $server novnc | awk '{split($4,a,\"Url\");print a[1] }' | awk '/http/'";
		//echo $cmd;
		exec($cmd, $output, $result);
		//echo $output[0];
		echo "<input type='hidden' id='novnc' value='$output[0]'/>";
	}
} else {
	if ($fn == 'add') {
		$q = "SELECT id FROM neutron.networks where name='lan-net' and status ='ACTIVE';";
		$net_id = mysql_result(mysql_query($q), 0, 0);
		instanceadd();
		floatip_associate();
	} elseif ($fn == 'resize') {
		if ($server != $org_ins_nm) {
			$cmd1 = "nova $auth_cmd rename $org_ins_nm $server";
			//echo $cmd1;
			exec($cmd1);
		}
		if ($flv_nm != $org_flv_nm) {
			$cmd1 = "nova $auth_cmd resize $server $org_flv_nm";
			//echo $cmd1;
			exec($cmd1);
		}
		if ($flt_ip != $org_flt_ip) {
			floatip_dis_associate();
			floatip_associate();
		}

	} elseif ($fn == 'del') {
		instancedel($server);
	} elseif ($fn == 'del1') {

		$tmp = str_replace("'", "", $server);
		$tmp = str_replace("(select,", "", $tmp);
		$tmp = str_replace("select", "", $tmp);
		$tmp = str_replace("(", "", $tmp);
		$tmp = str_replace(")", "", $tmp);
		$arr = explode(",", $tmp);
		foreach ($arr as $val) {
			if (!empty($val)) {
				instancedel($val);
			}
		}

	}
}

//<select id='num_users' name='num_users' onchange='instancessql(\"\",\"\",\"\",this.value)'><option value='1' id='1'>1</option><option value='2' id='2' selected>2</option><option value='10' id='10' selected>10</option>

$q1 = "SELECT display_name,(select floating_ip_address from neutron.floatingips where fixed_port_id = (select id   from neutron.ports where device_id =uuid ) ),(select ip_address from neutron.ipallocations where port_id = (select id  from neutron.ports where device_id =uuid ) ),power_state,vm_state,task_state,memory_mb,root_gb,instance_type_id FROM nova.instances where vm_state!='deleted' and deleted=0 order by memory_mb limit $offset,$limit";
echo "<input type='button' class='addel-button' value='Add' onclick='instanceadd()'/>&nbsp;&nbsp;<input type='button' class='addel-button' onclick='delconf(instancessql,\"del1\",\"\",\"\",\"$limit\",\"$offset\")' value='Delete'/>&nbsp;&nbsp;<input type='button' class='addel-button' onclick='action(\"start1\",\"\",\"$limit\",\"$offset\")' value='Start'/>&nbsp;&nbsp;<input type='button' class='addel-button' onclick='action(\"stop1\",\"\",\"$limit\",\"$offset\")' value='Stop'/>&nbsp;Records Per Page&nbsp<select id='num_users' class='clear-ins' name='num_users' onchange='inslimit(this.value)'>";
foreach ($num_ins as $num) {
	echo "<option value='$num' id=$num>$num</option>";
}
echo "</select>&nbsp<img src='prev.png' class='nextprev' onclick=instancessql(\"offs\",\"first\") id='first'/>&nbsp<img src='prev.png' class='nextprev' onclick=instancessql(\"offs\",\"prev\") id='left'/> (" . ($current_page) . " of " . $total_pages . ") <img src='next.png' onclick=instancessql(\"offs\",\"next\") id='right' class='nextprev' /><img src='next.png' onclick=instancessql(\"offs\",\"last\") id='last' class='nextprev' />";

echo "<table id ='instance_tbl'><tr><th rowspan=2><input type='checkbox' class='group' name='group' id='selectall' onclick='selectall()'></th><th rowspan=2>Instance Name</th><th rowspan=2>External IP</th><th rowspan=2>Internal IP</th><th rowspan=2>Status</th><th rowspan=2>RAM</th><th rowspan=2>Harddisk</th><th colspan=2>Manage</th></tr><tr><th>Activity</th><th>Edit</th></tr>";
$result = mysql_query($q1, $con2);
while ($row = mysql_fetch_array($result)) {
	$nm = $row[0];
	switch($row[3]) {
		case 1 :
			$id1 = "disabled";
			$id2 = "";
			$id3 = "";
			$nm = "<a href='javascript:console(\"$row[0]\",\"$limit\",\"$offset\")'>$row[0]</a>";
			break;
		case 3 :
			$id1 = "";
			$id2 = "";
			$id3 = "";

			break;
		case 4 :
			$id1 = "";
			$id2 = "disabled";
			$id3 = "disabled";
			break;

		case 6 :
			$id1 = "disabled";
			$id2 = "disabled";
			$id3 = "disabled";
			break;
		case 7 :
			$id1 = "";
			$id2 = "disabled";
			$id3 = "disabled";
			break;
		case 9 :
			$id1 = "disabled";
			$id2 = "disabled";
			$id3 = "disabled";
			break;
		default :
			$id1 = "";
			$id2 = "";
			$id3 = "";
	}

	$row[3] = $power_state[$row[3]];

	if ($row[6] > 1023) {
		$ram = ($row[6] / 1024) . " GB";
	} else {
		$ram = $row[6] . " MB";
	}

	if (isset($row[5])) {
		$row[3] = "";
	}

	$row[5] = lcfirst($row[5]);

	$q2 = "select flavorid from nova.instance_types  where id = $row[8] ";
	$ins_typ_id = mysql_result(mysql_query($q2, $con2), 0, 0);

	echo "<tr><td><input type='checkbox' class='group' id='" . $row[0] . "' value='" . $row[0] . "' name='group' ></td><td>$nm</td><td>$row[1]</td><td>$row[2]</td><td>$row[3] $row[5]</td><td>$ram</td><td>$row[7] GB</td><td><button title='Start' class='vdi_btn' id='start_$row[0]' onclick='action(\"start\",\"$row[0]\",\"$limit\",\"$offset\")' $id1><img class='vdi_btn_img' src='images/start.ico'/></button><button title='Stop' class='vdi_btn' id='stop_$row[0]' onclick='action(\"stop\",\"$row[0]\",\"$limit\",\"$offset\")' $id2><img class='vdi_btn_img' src='images/shutdown.ico'/></button><button title='Reboot' class='vdi_btn' id='reboot_$row[0]' onclick='action(\"reboot\",\"$row[0]\",\"$limit\",\"$offset\")' $id3><img class='vdi_btn_img' src='images/restart.ico'/></td><td></button><button title='Edit' class='vdi_btn' id='config_$row[0]' onclick='instanceadd(\"resize\",\"$row[0]\",\"$ins_typ_id\",\"$row[1]\")'><img class='vdi_btn_img' src='images/config.ico'/></button><button title='Delete' class='vdi_btn' id='ip_$row[0]' onclick='delconf(instancessql,\"del\",\"$row[0]\",\"\",\"$limit\",\"$offset\")'><img class='vdi_btn_img' src='images/delete.ico'/></button></td></tr>";
}
echo "</table><input type='hidden' id='offset' value='$offset'/><input type='hidden' id='current_page' value='$current_page'/><input type='hidden' id='total' value=$total_pages/><input type='hidden' id='lim' value=$limit />";
echo "</div>";
?>
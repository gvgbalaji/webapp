function refresh() {
	var to_select = [];
	$(".group").each(function() {
		if ($(this).is(':checked')) {
			to_select.push(this.id);
		}
	})
	var limit = $("#ins_limit").val();
	var offset = $("#ins_offset").val();
	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
	} else {
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			document.getElementById("table").innerHTML = xhr.responseText;
			document.getElementById(limit).selected = true;
			for (var x in to_select) {
				id = "#" + to_select[x];
				$(id).attr('checked', true);
			}
		}
	}
	xhr.open("GET", "instancesql.php?limit=" + limit + "&offset=" + offset, true);
	xhr.send();

}

function inslimit(limit) {
	$("#ins_limit").val(limit);
	$("#lim").val(limit);
	instancessql();
}

//Instance
function instancessql(addel, ins_nm, sub_addel) {
	var limit = $("#ins_limit").val();
	var offset = $("#ins_offset").val();
	var instance_int = $("#instance_int").val();

	var rate = 3000;
	clearInterval(instance_int);

	instance_int = setInterval(function() {
		refresh(limit, offset);
	}, rate);

	$("#instance_int").val(instance_int);

	$(".nav-button").click(function() {
		clearInterval(instance_int);
	});

	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
		var xhr1 = new XMLHttpRequest();
	} else {
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
		var xhr1 = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (addel == 'add') {
		limit = document.getElementById("limit_session").value;
		xhr1.onreadystatechange = function() {
			if (xhr1.readyState == 4 && xhr1.status == 200) {
				var a = document.getElementById("ins_nm").value;
				var b = document.getElementById("img_nm").value;
				var c = document.getElementById("flv_nm").value;
				var d = document.getElementById("sec_grp").value;
				var e = document.getElementById("flt_ip").value;

				uri = "instancesql.php?fn=add&server=" + a + "&img_nm=" + b + "&flv_nm=" + c + "&sec_grp=" + d + "&flt_ip=" + e + "&limit=" + limit + "&offset=" + offset;
				if (sub_addel === "resize") {
					var f = document.getElementById("org_ins_nm").value;
					var g = document.getElementById("org_flv_nm").value;
					var h = document.getElementById("org_flt_ip").value;
					uri = "instancesql.php?fn=resize&server=" + a + "&flv_nm=" + c + "&flt_ip=" + e + "&org_ins_nm=" + f + "&org_flv_nm=" + g + "&org_flt_ip=" + h + "&limit=" + limit + "&offset=" + offset;

				}
				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4 && xhr.status == 200) {
						document.getElementById("table").innerHTML = xhr.responseText;
						document.getElementById(limit).selected = true;
					}
				}
				xhr.open("GET", uri, true);
				xhr.send();
			}
		}
		xhr1.open("GET", "instanceadd.php", true);
		xhr1.send();
	} else if (addel === "del") {

		xhr1.onreadystatechange = function() {
			if (xhr1.readyState == 4 && xhr1.status == 200) {
				uri = "instancesql.php?fn=del&server=" + ins_nm + "&limit=" + limit + "&offset=" + offset;

				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4 && xhr.status == 200) {
						document.getElementById("table").innerHTML = xhr.responseText;
						document.getElementById(limit).selected = true;
					}
				}
				xhr.open("GET", uri, true);
				xhr.send();
			}
		}
		xhr1.open("GET", "instanceadd.php", true);
		xhr1.send();
	} else if (addel === "del1") {

		xhr1.onreadystatechange = function() {
			var checkboxes = document.getElementsByName('group');
			var chkVal = "(";

			if (xhr1.readyState == 4 && xhr1.status == 200) {
				for (var i = 0; i < checkboxes.length; i++) {
					if (checkboxes[i].checked) {
						chkVal += "'" + checkboxes[i].value + "',";

					}
				}
				chkVal = chkVal.slice(0, -1);
				chkVal += ")";

				uri = "instancesql.php?fn=del1&server=" + chkVal + "&limit=" + limit + "&offset=" + offset;
				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4 && xhr.status == 200) {
						document.getElementById("table").innerHTML = xhr.responseText;
						document.getElementById(limit).selected = true;
					}
				}
				xhr.open("GET", encodeURI(uri), true);
				xhr.send();

			}
		}
		xhr1.open("GET", "instancesql.php", true);
		xhr1.send();
	} else if (addel === "offs") {
		limit = parseInt(document.getElementById("ins_limit").value);
		offset = parseInt(document.getElementById("ins_offset").value);
		current_page = parseInt(document.getElementById("current_page").value);
		total_pages = parseInt(document.getElementById("total").value);

		if (ins_nm === "next") {
			if (current_page < total_pages) {
				offset = offset + limit;
			}
		}

		if (ins_nm === "prev") {
			if (current_page > 1) {
				offset = offset - limit;
			}
		}
		if (ins_nm === "first") {
			offset = 0;
		}
		if (ins_nm === "last") {

			offset = (total_pages * limit) - limit;
		}

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				document.getElementById("table").innerHTML = xhr.responseText;
				document.getElementById(limit).selected = true;
				document.getElementById("ins_offset").value = offset;

			}
		}
		xhr.open("GET", "instancesql.php?offset=" + offset + "&limit=" + limit, true);
		xhr.send();
	} else {
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				document.getElementById("table").innerHTML = xhr.responseText;
				document.getElementById(limit).selected = true;

			}
		}
		xhr.open("GET", "instancesql.php?limit=" + limit + "&offset=" + offset, true);
		xhr.send();
	}
}

function instanceadd(addel, a, b, c, d, e) {
	var instance_int = $("#instance_int").val();
	clearInterval(instance_int);

	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
	} else {
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	limit = document.getElementById("lim").value;

	uri = "instanceadd.php";
	if (addel === 'resize') {
		uri = "instanceadd.php?flt_ip_chk=" + c;
	}

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			document.getElementById("table").innerHTML = xhr.responseText;
			document.getElementById("limit_session").value = limit;
			var onstr = "instancessql('','',''," + limit + ")";
			document.getElementById("del").setAttribute("onclick", onstr);
			if (addel === 'resize') {
				document.getElementById("ins_nm").value = a;
				document.getElementById("org_ins_nm").value = a;

				$("#flv_nm").val(b);
				document.getElementById("org_flv_nm").value = b;

				//$("#flt_ip_tr").hide();
				if (c === '') {
					c = 'none';
				}
				$("#flt_ip").val(c);
				document.getElementById("org_flt_ip").value = c;

				$("#img_nm_tr").hide();

				$("#sec_grp_tr").hide();

				document.getElementById("instanceform").action = "javascript:instancessql('add','','resize')";

			}

		}
	}

	xhr.open("GET", uri, true);
	xhr.send();
}

//Actions
function action(fn, server, limit, offset) {
	var default_limit = 10;
	var default_offset = 0;
	if (limit === undefined) {
		limit = default_limit;

	}
	if (offset === undefined) {
		offset = default_offset;
	}

	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
		var xhr1 = new XMLHttpRequest();
	} else {
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
		var xhr1 = new ActiveXObject("Microsoft.XMLHTTP");
	}
	id1 = "start_" + server;
	id2 = "stop_" + server;
	id3 = "reboot_" + server;
	if (fn === 'start') {
		uri = "instancesql.php?fn=start&sub_fn=activity&server=" + server + "&limit=" + limit + "&offset=" + offset;
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				document.getElementById("table").innerHTML = xhr.responseText;
				document.getElementById(limit).selected = true;
			}
		}
		xhr.open("GET", uri, true);
		xhr.send();
	} else if (fn === "start1") {

		xhr1.onreadystatechange = function() {
			var checkboxes = document.getElementsByName('group');
			var chkVal = "(";

			if (xhr1.readyState == 4 && xhr1.status == 200) {
				for (var i = 0; i < checkboxes.length; i++) {
					if (checkboxes[i].checked) {
						chkVal += "'" + checkboxes[i].value + "',";

					}
				}
				chkVal = chkVal.slice(0, -1);
				chkVal += ")";

				uri = "instancesql.php?fn=start1&sub_fn=activity&server=" + chkVal + "&limit=" + limit + "&offset=" + offset;

				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4 && xhr.status == 200) {
						document.getElementById("table").innerHTML = xhr.responseText;
						document.getElementById(limit).selected = true;
					}
				}
				xhr.open("GET", encodeURI(uri), true);
				xhr.send();

			}
		}
		xhr1.open("GET", "instancesql.php", true);
		xhr1.send();
	} else if (fn === 'stop') {
		uri = "instancesql.php?fn=stop&sub_fn=activity&server=" + server + "&limit=" + limit + "&offset=" + offset;
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				document.getElementById("table").innerHTML = xhr.responseText;
				document.getElementById(limit).selected = true;
			}
		}
		xhr.open("GET", uri, true);
		xhr.send();
	} else if (fn === "stop1") {

		xhr1.onreadystatechange = function() {
			var checkboxes = document.getElementsByName('group');
			var chkVal = "(";

			if (xhr1.readyState == 4 && xhr1.status == 200) {
				for (var i = 0; i < checkboxes.length; i++) {
					if (checkboxes[i].checked) {
						chkVal += "'" + checkboxes[i].value + "',";

					}
				}
				chkVal = chkVal.slice(0, -1);
				chkVal += ")";

				uri = "instancesql.php?fn=stop1&sub_fn=activity&server=" + chkVal + "&limit=" + limit + "&offset=" + offset;

				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4 && xhr.status == 200) {
						document.getElementById("table").innerHTML = xhr.responseText;
						document.getElementById(limit).selected = true;
					}
				}
				xhr.open("GET", encodeURI(uri), true);
				xhr.send();

			}
		}
		xhr1.open("GET", "instancesql.php", true);
		xhr1.send();
	} else if (fn === 'reboot') {
		uri = "instancesql.php?fn=reboot&sub_fn=activity&server=" + server + "&limit=" + limit + "&offset=" + offset;
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				document.getElementById("table").innerHTML = xhr.responseText;
				document.getElementById(limit).selected = true;
			}
		}
		xhr.open("GET", uri, true);
		xhr.send();
	}

}

function console(server, limit, offset) {

	var default_limit = 2;
	var default_offset = 0;
	if (limit === undefined) {
		limit = default_limit;

	}
	if (offset === undefined) {
		offset = default_offset;
	}

	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
	} else {
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}

	uri = "instancesql.php?fn=cons&sub_fn=activity&server=" + server + "&limit=" + limit + "&offset=" + offset;
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			document.getElementById("table").innerHTML = xhr.responseText;
			document.getElementById(limit).selected = true;
			novnc = document.getElementById("novnc").value;
			//window.open(novnc);
			window.open(novnc, "_blank", "scrollbars=yes, resizable=yes, width=800,height=500");
		}

	}
	xhr.open("GET", uri, true);
	xhr.send();
}

//Flavor
function flavorssql(addel, flv_id, edit) {
	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
		var xhr1 = new XMLHttpRequest();
	} else {
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
		var xhr1 = new ActiveXObject("Microsoft.XMLHTTP");
	}

	if (addel === 'add') {
		xhr1.onreadystatechange = function() {
			if (xhr1.readyState == 4 && xhr1.status == 200) {
				var a = document.getElementById("flv_nm").value;
				var b = document.getElementById("flv_id").value;
				var c = document.getElementById("ram").value;
				var d = document.getElementById("disk").value;
				var e = document.getElementById("vcpu").value;

				uri = "flavorsql.php?fn=add&flv_nm=" + a + "&flv_id=" + b + "&ram=" + c + "&disk=" + d + "&vcpu=" + e;
				if (edit === "on") {
					uri = "flavorsql.php?fn=edit&flv_nm=" + a + "&flv_id=" + b + "&ram=" + c + "&disk=" + d + "&vcpu=" + e;
				}
				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4 && xhr.status == 200) {
						document.getElementById("table").innerHTML = xhr.responseText;
					}
				}
				xhr.open("GET", uri, true);
				xhr.send();
			}
		}
		xhr1.open("GET", "flavoradd.php", true);
		xhr1.send();

	} else if (addel === "del") {

		xhr1.onreadystatechange = function() {
			if (xhr1.readyState == 4 && xhr1.status == 200) {
				uri = "flavorsql.php?fn=del&flv_id=" + flv_id;

				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4 && xhr.status == 200) {
						document.getElementById("table").innerHTML = xhr.responseText;
					}
				}
				xhr.open("GET", uri, true);
				xhr.send();
			}
		}
		xhr1.open("GET", "flavoradd.php", true);
		xhr1.send();
	} else if (addel === "del1") {

		xhr1.onreadystatechange = function() {
			var checkboxes = document.getElementsByName('group');
			var chkVal = "(";

			if (xhr1.readyState == 4 && xhr1.status == 200) {
				for (var i = 0; i < checkboxes.length; i++) {
					if (checkboxes[i].checked) {
						chkVal += "'" + checkboxes[i].value + "',";

					}
				}
				chkVal = chkVal.slice(0, -1);
				chkVal += ")";

				uri = "flavorsql.php?fn=del1&flv_id=" + chkVal;
				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4 && xhr.status == 200) {
						document.getElementById("table").innerHTML = xhr.responseText;
					}
				}
				xhr.open("GET", encodeURI(uri), true);
				xhr.send();

			}
		}
		xhr1.open("GET", "flavorsql.php", true);
		xhr1.send();
	} else {
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				document.getElementById("table").innerHTML = xhr.responseText;
			}
		}
		xhr.open("GET", "flavorsql.php", true);
		xhr.send();
	}
}

function flavoradd(addel, a, b, c, d, e) {
	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
	} else {
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			document.getElementById("table").innerHTML = xhr.responseText;
			if (addel === 'add') {
				document.getElementById("flv_id").value = a;
				document.getElementById("flv_nm").value = b;
				document.getElementById("flv_id").disabled = true;
				document.getElementById("flv_nm").disabled = true;
				document.getElementById("ram").value = c;
				document.getElementById("disk").value = d;
				document.getElementById("vcpu").value = e;
				document.getElementById("flavorform").action = "javascript:flavorssql('add','','on')";

			}

		}
	}
	xhr.open("GET", "flavoradd.php", true);
	xhr.send();
}

//Firewall

function firewallsql(addel, rule_nm, edit) {
	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
		var xhr1 = new XMLHttpRequest();
	} else {
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
		var xhr1 = new ActiveXObject("Microsoft.XMLHTTP");
	}

	if (addel === "add") {
		xhr1.onreadystatechange = function() {
			if (xhr1.readyState == 4 && xhr1.status == 200) {
				var a = document.getElementById("rule_nm").value;
				var b = document.getElementById("description").value;
				var c = document.getElementById("src_host").value;
				var d = document.getElementById("dst_host").value;
				var e = document.getElementById("src_port").value;
				var f = document.getElementById("dst_port").value;
				var g = document.getElementById("services").value;
				var h = document.querySelector('input[name="actn"]:checked').value;

				var i = document.getElementById("ins_bef").value;
				var j = document.getElementById("ins_aft").value;
				uri = "fwsql.php?fn=add&rule_nm=" + a + "&description=" + b + "&src_host=" + c + "&dst_host=" + d + "&src_port=" + e + "&dst_port=" + f + "&services=" + g + "&actn=" + h + "&ins_bef=" + i + "&ins_aft=" + j;
				if (edit === "on") {

					var k = document.getElementById("org_rule_nm").value;
					var l = document.getElementById("rule_id").value;
					uri = "fwsql.php?fn=edit&rule_nm=" + a + "&description=" + b + "&src_host=" + c + "&dst_host=" + d + "&src_port=" + e + "&dst_port=" + f + "&services=" + g + "&actn=" + h + "&ins_bef=" + i + "&ins_aft=" + j + "&org_rule_nm=" + k + "&rule_id=" + l;

				}

				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4 && xhr.status == 200) {
						document.getElementById("table").innerHTML = xhr.responseText;
					}
				}
				xhr.open("GET", uri, true);
				xhr.send();
			}
		}
		xhr1.open("GET", "fwadd.php", true);
		xhr1.send();
	} else if (addel === "del") {

		xhr1.onreadystatechange = function() {
			if (xhr1.readyState == 4 && xhr1.status == 200) {
				uri = "fwsql.php?fn=del&rule_nm=" + rule_nm;

				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4 && xhr.status == 200) {
						document.getElementById("table").innerHTML = xhr.responseText;
					}
				}
				xhr.open("GET", uri, true);
				xhr.send();
			}
		}
		xhr1.open("GET", "fwadd.php", true);
		xhr1.send();
	} else if (addel === "del1") {

		xhr1.onreadystatechange = function() {
			var checkboxes = document.getElementsByName('group');
			var chkVal = "(";

			if (xhr1.readyState == 4 && xhr1.status == 200) {
				for (var i = 0; i < checkboxes.length; i++) {
					if (checkboxes[i].checked) {
						chkVal += "'" + checkboxes[i].value + "',";

					}
				}
				chkVal = chkVal.slice(0, -1);
				chkVal += ")";

				uri = "fwsql.php?fn=del1&rule_nm=" + chkVal;
				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4 && xhr.status == 200) {
						document.getElementById("table").innerHTML = xhr.responseText;
					}
				}
				xhr.open("GET", encodeURI(uri), true);
				xhr.send();

			}
		}
		xhr1.open("GET", "fwsql.php", true);
		xhr1.send();
	} else {

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				document.getElementById("table").innerHTML = xhr.responseText;
			}
		}
		xhr.open("GET", "fwsql.php", true);
		xhr.send();
	}

}

function firewalladd(addel, a, b, c, d, e, f, g, h, i, j, k) {
	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
	} else {
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			document.getElementById("table").innerHTML = xhr.responseText;
			if (addel === 'add') {

				document.getElementById("rule_nm").value = a;
				document.getElementById("org_rule_nm").value = a;
				document.getElementById("description").value = b;
				document.getElementById("src_host").value = c;
				document.getElementById("dst_host").value = d;
				document.getElementById("src_port").value = e;
				document.getElementById("dst_port").value = f;
				if (g === "") {
					g = "any"
				}
				document.getElementById(g).selected = true;
				document.getElementById(h).checked = true;

				i = parseInt(i);
				$("#ins_bef").val(i);

				j = parseInt(j);
				$("#ins_aft").val(j);

				document.getElementById("ruleform").action = "javascript:firewallsql('add','','on')";
				document.getElementById("rule_id").value = k;

			}
		}
	}
	xhr.open("GET", "fwadd.php", true);
	xhr.send();
}

//Overview

function overviewsql() {
	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();

	} else {
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");

	}

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {

			document.getElementById("table").innerHTML = xhr.responseText;
			var a = parseInt(document.getElementById("core1").innerHTML);
			var b = parseInt(document.getElementById("mem1").innerHTML);
			var c = parseInt(document.getElementById("disk1").innerHTML);

			$(document).ready(function() {
				st = new Date();
				st1 = st.toUTCString();
				$('#dt').text(st1);
				var rate = 1000;

				var overview_int = setInterval(function() {

					da1 = datetime();
					vdi_summary_chart(a, b, c);
					$('#dt').text(da1);
				}, rate);

				$(".nav-button").click(function() {
					if (this != "javascript:overviewsql()") {
						clearInterval(overview_int);
					}

				});
			});

		}
	}
	xhr.open("GET", "vdi_overview.php", true);
	xhr.send();

}

function vdi_summary_chart(a, b, c) {
	var vm_offset = $("#vm_offset").val();
	vm_offset = vm_offset.toString();
	
	url = "vdi_overview_chart.php?vm_offset=" + vm_offset;
	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();

	} else {
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			chart_output = JSON.parse(xhr.responseText);
		}
	}
	xhr.open("GET", url, true);
	xhr.send();

	var vm_data = {
		labels : chart_output.cpu_labels,
		datasets : [{
			label : "My First dataset",
			fillColor : "rgba(65, 191, 250, 1)",
			strokeColor : "rgba(220,220,220,0.8)",
			highlightFill : "rgba(0, 146, 220, 0.9)",
			highlightStroke : "rgba(220,220,220,1)",
			data : chart_output.cpu_data
		}]
	}

	var all_vm_data = {
		labels : chart_output.all_cpu_labels,
		datasets : [{
			label : "My First dataset",
			fillColor : "rgba(65, 191, 250, 1)",
			strokeColor : "rgba(220,220,220,0.8)",
			highlightFill : "rgba(0, 146, 220, 0.9)",
			highlightStroke : "rgba(220,220,220,1)",
			data : chart_output.all_cpu_data
		}]
	}

	var data1 = {
		labels : chart_output.labels,
		datasets : [{
			label : "My First dataset",
			fillColor : "rgba(65, 191, 250, 1)",
			strokeColor : "rgba(220,220,220,0.8)",
			highlightFill : "rgba(0, 146, 220, 0.9)",
			highlightStroke : "rgba(220,220,220,1)",
			data : chart_output.data1
		}]
	}
	var data2 = {
		labels : chart_output.labels,
		datasets : [{
			label : "My First dataset",
			fillColor : "rgba(65, 191, 250, 1)",
			strokeColor : "rgba(220,220,220,0.8)",
			highlightFill : "rgba(0, 146, 220, 0.9)",
			highlightStroke : "rgba(220,220,220,1)",
			data : chart_output.data2
		}]
	}

	var data3 = chart_output.piedata;

	var st = chart_output.st;
	var ut = chart_output.ut;
	var ins = chart_output.ins;
	var core = parseInt(chart_output.core);
	var mem = parseInt(chart_output.mem);
	var disk = parseInt(chart_output.disk);

	a = a - core;
	b = b - mem;
	c = c - disk;

	var data4 = JSON.parse('[{"value" : ' + core + ', "color" : "#B40E06", "label" : "Allocated Cores"},{"value" : ' + a + ', "color" : "#41BFFA", "label" : "Available Cores"}]');
	var data5 = JSON.parse('[{"value" : ' + mem + ', "color" : "#B40E06", "label" : " Allocated Memory"},{"value" : ' + b + ', "color" : "#41BFFA", "label" : "Available Memory"}]');
	var data6 = JSON.parse('[{"value" : ' + disk + ', "color" : "#B40E06", "label" : "Allocated Disk"},{"value" : ' + c + ', "color" : "#41BFFA", "label" : "Available Disk"}]');

	$("#st").text(st);
	$("#ut").text(ut);
	$("#ins").text(ins);
	$("#core").text(core);
	$("#mem").text(mem);
	$("#disk").text(disk);

	var cpuusage = document.getElementById('vdi_cpuusage').getContext('2d');
	var chart1 = new Chart(cpuusage).Bar(data1, {

		animation : false
	});

	var memoryusage = document.getElementById('vdi_memoryusage').getContext('2d');
	var chart2 = new Chart(memoryusage).Bar(data2, {

		animation : false
	});

	var instance_chart = document.getElementById('instance_chart').getContext('2d');
	var chart3 = new Chart(instance_chart).Pie(data3, {
		animation : false
	});

	var core_chart = document.getElementById('core_chart').getContext('2d');
	var chart4 = new Chart(core_chart).Pie(data4, {
		animation : false
	});
	var mem_chart = document.getElementById('mem_chart').getContext('2d');
	var chart5 = new Chart(mem_chart).Pie(data5, {
		animation : false
	});
	var disk_chart = document.getElementById('disk_chart').getContext('2d');
	var chart6 = new Chart(disk_chart).Pie(data6, {
		animation : false
	});

	var vmusage = document.getElementById('vdi_vmusage').getContext('2d');
	var chart7 = new Chart(vmusage).Bar(vm_data, {

		animation : false
	});

	var all_vmusage = document.getElementById('vdi_all_vmusage').getContext('2d');
	var chart8 = new Chart(all_vmusage).Bar(all_vm_data, {

		animation : false
	});

}

function datetime() {
	da = new Date();
	da1 = da.toUTCString();
	return da1;
}

function next_prev(btn) {

	limit = parseInt($("#vm_limit").val());
	offset = parseInt($("#vm_offset").val());
	current_page = parseInt($("#vm_curr_page").val());
	total_pages = parseInt($("#vm_tot_pages").val());

	if (btn === "next") {
		if (current_page < total_pages) {
			//offset = offset + limit;
			$("#vm_offset").val((offset + limit));
			$("#vm_curr_page").val((current_page + 1));

			$("#vdi_all_vmusage").hide("slide", {
				direction : "left"
			}, 300);
			$("#vdi_all_vmusage").show("slide", {
				direction : "right"
			}, 300);

		}
	}

	if (btn === "prev") {
		if (current_page > 1) {
			//	offset = offset - limit;
			$("#vm_offset").val((offset - limit));
			$("#vm_curr_page").val((current_page - 1));

			$("#vdi_all_vmusage").hide("slide", {
				direction : "right"
			}, 300);
			$("#vdi_all_vmusage").show("slide", {
				direction : "left"
			}, 300);

		}
	}

	vdi_summary_chart();
}

//floatingip

function floatingipsql(addel, flt_ip, server) {
	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
		var xhr1 = new XMLHttpRequest();
	} else {
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
		var xhr1 = new ActiveXObject("Microsoft.XMLHTTP");
	}

	if (addel === "add") {
		xhr1.onreadystatechange = function() {
			if (xhr1.readyState == 4 && xhr1.status == 200) {

				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4 && xhr.status == 200) {
						document.getElementById("table").innerHTML = xhr.responseText;
					}
				}
				xhr.open("GET", "floatingipsql.php?fn=add", true);
				xhr.send();
			}
		}
		xhr1.open("GET", "floatingipsql.php", true);
		xhr1.send();
	} else if (addel === "dis") {
		uri = "floatingipsql.php?fn=dis&flt_ip=" + flt_ip + "&server=" + server;
		xhr.onreadystatechange = function() {

			if (xhr.readyState == 4 && xhr.status == 200) {
				document.getElementById("table").innerHTML = xhr.responseText;
			}
		}
		xhr.open("GET", uri, true);
		xhr.send();

	} else if (addel === "asc") {
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				document.getElementById("table").innerHTML = xhr.responseText;
				document.getElementById("flt_ip").value = flt_ip;
				document.getElementById("flt_ip").disabled = true;
			}
		}
		xhr.open("GET", "floatingip_associate.php", true);
		xhr.send();
	} else if (addel === "asc_add") {
		xhr.onreadystatechange = function() {

			if (xhr.readyState == 4 && xhr.status == 200) {
				x = document.getElementById("flt_ip").value;
				y = document.getElementById("ser").value;

				xhr1.onreadystatechange = function() {

					if (xhr1.readyState == 4 && xhr1.status == 200) {
						document.getElementById("table").innerHTML = xhr1.responseText;
					}
				}
				xhr1.open("GET", "floatingipsql.php?fn=asc&flt_ip=" + x + "&server=" + y, true);
				xhr1.send();
			}
		}
		xhr.open("GET", "floatingip_associate.php", true);
		xhr.send();

	} else if (addel === "del") {

		xhr1.onreadystatechange = function() {
			if (xhr1.readyState == 4 && xhr1.status == 200) {
				uri = "floatingipsql.php?fn=del&flt_ip=" + flt_ip;

				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4 && xhr.status == 200) {
						document.getElementById("table").innerHTML = xhr.responseText;
					}
				}
				xhr.open("GET", uri, true);
				xhr.send();
			}
		}
		xhr1.open("GET", "floatingipsql.php", true);
		xhr1.send();
	} else if (addel === "del1") {

		xhr1.onreadystatechange = function() {
			var checkboxes = document.getElementsByName('group');
			var chkVal = "(";

			if (xhr1.readyState == 4 && xhr1.status == 200) {
				for (var i = 0; i < checkboxes.length; i++) {
					if (checkboxes[i].checked) {
						chkVal += "'" + checkboxes[i].value + "',";

					}
				}
				chkVal = chkVal.slice(0, -1);
				chkVal += ")";

				uri = "floatingipsql.php?fn=del1&flt_ip=" + chkVal;
				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4 && xhr.status == 200) {
						document.getElementById("table").innerHTML = xhr.responseText;
					}
				}
				xhr.open("GET", encodeURI(uri), true);
				xhr.send();

			}
		}
		xhr1.open("GET", "floatingipsql.php", true);
		xhr1.send();
	} else {

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				document.getElementById("table").innerHTML = xhr.responseText;
			}
		}
		xhr.open("GET", "floatingipsql.php", true);
		xhr.send();
	}

}

//image

function imagessql(addel, img_id) {
	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
		var xhr1 = new XMLHttpRequest();
	} else {
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
		var xhr1 = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (addel === "add") {

		xhr1.onreadystatechange = function() {
			if (xhr1.readyState == 4 && xhr1.status == 200) {
				var a = document.getElementById("img_nm").value;
				var b = document.getElementById("df").value;
				var c = document.getElementById("fl_nm").value;

				uri = "imagessql.php?fn=add&img_nm=" + a + "&df=" + b + "&fl_nm=" + c;

				xhr.onreadystatechange = function() {

					if (xhr.readyState == 4 && xhr.status == 200) {
						document.getElementById("table").innerHTML = xhr.responseText;
					}
				}
				xhr.open("GET", uri, true);
				xhr.send();
			}
		}
		xhr1.open("GET", "imageadd.php", true);
		xhr1.send();
	} else if (addel === "del") {
		uri = "imagessql.php?fn=del&id=" + img_id;
		xhr.onreadystatechange = function() {

			if (xhr.readyState == 4 && xhr.status == 200) {
				document.getElementById("table").innerHTML = xhr.responseText;
			}
		}
		xhr.open("GET", uri, true);
		xhr.send();

	} else if (addel === "del1") {

		xhr1.onreadystatechange = function() {
			var checkboxes = document.getElementsByName('group');
			var chkVal = "(";

			if (xhr1.readyState == 4 && xhr1.status == 200) {
				for (var i = 0; i < checkboxes.length; i++) {
					if (checkboxes[i].checked) {
						chkVal += "'" + checkboxes[i].value + "',";
					}
				}
				chkVal = chkVal.slice(0, -1);
				chkVal += ")";

				uri = "imagessql.php?fn=del1&id=" + img_id;

				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4 && xhr.status == 200) {
						document.getElementById("table").innerHTML = xhr.responseText;
					}
				}
				xhr.open("GET", encodeURI(uri), true);
				xhr.send();

			}
		}
		xhr1.open("GET", "imagessql.php", true);
		xhr1.send();
	} else {

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				document.getElementById("table").innerHTML = xhr.responseText;
			}
		}
		xhr.open("GET", "imagessql.php", true);
		xhr.send();
	}

}

function imageadd(up_ab) {
	if (window.XMLHttpRequest) {
		var xhr1 = new XMLHttpRequest();

	} else {
		var xhr1 = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xhr1.onreadystatechange = function() {
		if (xhr1.readyState == 4 && xhr1.status == 200) {
			document.getElementById("table").innerHTML = xhr1.responseText;
			//upload_section
			var upload_xhr = new XMLHttpRequest();
			$("#abort").hide();

			function return_obj(id) {
				return document.getElementById(id);
			}

			function upload(e) {
				e.preventDefault();
				var file = return_obj("file1").files[0];
				var type = file.name.split(".");
				type = type[type.length - 1];

				if (type == "iso" || type == "img" || type == "vmdk") {
					var df = document.getElementById("df").value

					uri = 'upload_back.php';

					var formdata = new FormData();
					formdata.append('file1', file);

					formdata.append('df', df)

					upload_xhr.upload.addEventListener('progress', progressHandler, false);
					upload_xhr.addEventListener('load', completeHandler, false);
					upload_xhr.addEventListener('abort', abortHandler, false);
					upload_xhr.addEventListener('error', errorHandler, false);
					upload_xhr.open('POST', uri);
					upload_xhr.send(formdata);
				} else {
					return_obj('status').innerHTML = type + ' file type not supported ';
				}
				$("#submit").hide();
				$("#abort").show();
			}

			function progressHandler(e) {
				var percent = (e.loaded / e.total) * 100;
				percent = Math.round(percent);
				return_obj('progress').style.width = Math.round(percent) + '%';
				return_obj('status').innerHTML = percent + '% uploaded plzz wait.....';
			}

			function completeHandler() {
				return_obj('status').innerHTML = upload_xhr.responseText;
				return_obj('progress').style.width = '100%';
				$("#ok").removeAttr("disabled");
				$("#abort").hide();
			}

			function abortHandler() {
				//alert('file upload aborted');
				return_obj('status').innerHTML = "Upload Cancelled";
				return_obj('progress').style.width = '0%';
			}

			function errorHandler() {
				//alert('file upload has an error');
				return_obj('status').innerHTML = "file upload has an error";
			}


			return_obj('abort').addEventListener('click', function() {
				upload_xhr.abort();
				$("#abort").hide();
				$("#submit").show();
			}, false);
			return_obj('upload_form').addEventListener('submit', upload, false);

			return_obj('cancel').addEventListener('click', function() {
				upload_xhr.abort();
				imagessql();
			}, false);
		}
	};
	xhr1.open("GET", "imageadd.php", true);
	xhr1.send();
}

function test_image() {
	if (window.XMLHttpRequest) {
		var xhr1 = new XMLHttpRequest();

	} else {
		var xhr1 = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xhr1.onreadystatechange = function() {
		if (xhr1.readyState == 4 && xhr1.status == 200) {
			document.getElementById("table").innerHTML = xhr1.responseText;
			$(document).ready(function() {

				var settings = {
					url : "upload.php",
					method : "POST",
					allowedTypes : "iso,img",
					fileName : "myfile",
					multiple : false,
					onSuccess : function(files, data, xhr) {
						$("#status").html("<font color='green'>Upload is success</font>");

					},
					onError : function(files, status, errMsg) {
						$("#status").html("<font color='red'>Upload is Failed</font>");
					}
				}

				$("#mulitplefileuploader").uploadFile(settings);

			});

		}
	};
	xhr1.open("GET", "test_image.php", true);
	xhr1.send();
}


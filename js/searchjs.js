var cobaltResult;
var cList = ['WDW','ACT','NEW','IFP','JQR','ENG','POL','USA','HIS','GGR','BIO','ANA','ANT','ARH','FAH','CLA','NMC','VIS',
		'JAV','UNI','COG','CDN','AST','MAT','PHY','HPS','JPH','BCH','CHM','SMC','ABS','INI','MUS','FRE','CIN','WGS','JAL',
		'GER','SLA','CTA','RLG','CSB','ANA','MGY','BCH','EEB','PSL','HMB','IMM','MST','STA','ENV','NUS','MSE','BCB','JUS',
		'JDC','COL','CSC','LIN','CAS','EAS','MUN','DTS','SOC','PSY','CRI','DRM','ENV','ESS','JEG','JPE','JGA','ECO','SDS',
		'NMC','HMB','NFS','FSL','WGS','JNS','EST','ETH','EUR','MGR','FIN','FOR','FRE','COG','HUN','IMM','IMC','TRN','CRI',
		'ITA','CJS','JEH','JEI','JEE','JGI','JFV','KPE','LMP','MGY','SPA','LAS','HMU','MUS','NMC','NFS','PSL','PCJ','PHC',
		'PHL','PLN','AST','PRT','PPG','GRK','MHB','RSM','JSV','IVP','SDS','JSU'];

// Display the user's name on the Dashboard
$.get("/api/users", function(data){
	document.getElementById("welcomes").innerHTML = "Welcome " + data[0].firstname + " " + data[0].lastname;
});

function getData(url){
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {

	//response finished loading
    if (this.readyState == 4){

    	// request was successful
    	if(this.status == 200) {

        	myObj = JSON.parse(this.responseText);

       		showResults(myObj);

    	}
    	// the given url does not exist, therefore no game data
    	else{

        	alert("did not work!");
        }

    }

};

xmlhttp.open("GET", url, true);
xmlhttp.send();
}


// make sample results visible and welcome screen disappear
function getResults(){
	var department = document.forms[0];
	var dResult = "";
	var searchfield = document.getElementById("searchfield").value;
	var courseType = document.forms[5];
	var url = "https://strawberry-cupcake-85655.herokuapp.com/cobalt/1.0/courses/search?limit=100&q=\""+searchfield+"\" AND ";
	var credit = document.forms[3];
	
	if((searchfield.length > 2)&&(searchfield.length < 10)){
		//var check = false;
		
		for (var x in cList) {
			if(searchfield.substring(0,3).toUpperCase() == cList[x])
				url = "https://strawberry-cupcake-85655.herokuapp.com/cobalt/1.0/courses/filter?limit=100&q=code:\""+
					searchfield+"\" AND ";

		}
	 } else if (searchfield.length < 1){
		url = "https://strawberry-cupcake-85655.herokuapp.com/cobalt/1.0/courses/filter?limit=100&q=";
	}

	var i;
	for (i = 0; i < department.length; i++) {
			if (department[i].checked) {
				url = url + "department:\"" + department[i].value + "\" OR ";
			}
	}

	url = url.slice(0, -4);

	var breadth = document.forms[1];

	for (i = 0; i < breadth.length; i++) {
		if (i == 0) {
			url = url + " AND ";
		}
		if (breadth[i].checked) {
				url = url + "breadth:\"" + breadth[i].value.slice(-1) + "\" OR ";
		}
	}

	url = url.slice(0, -4);

	var term = document.forms[2];

	for (i = 0; i < term.length; i++) {
		if (i == 0) {
			url = url + " AND ";
		}
		if (term[i].checked) {
			if(term[i].value.includes("Fall")) {
				url = url + "term:\"2016 " + term[i].value.slice(-4) + "\" OR ";
			}
			else {
				 url = url + "term:\"2017 " + term[i].value.slice(-6) + "\" OR ";
			}
		}
	}

	url = url.slice(0, -4);

	var level = document.forms[4];
	var lResult = "";

	for (i = 0; i < level.length; i++) {
		if (i == 0) {
			url = url + " AND ";
		}
		if (level[i].checked) {
				url = url + "level:\"" + level[i].value + "\" OR ";
		}
	}

	url = url.slice(0, -4);
	//console.log(url);


	var ctResult = "";

	for (i = 0; i < courseType.length; i++) {
			if (courseType[i].checked) {
					ctResult = ctResult + courseType[i].value + " ";
			}
	}


	creditFilter = advancedFilter(url, credit, courseType);
	//console.log(creditFilter);
// } else {
// 		url = "/cobalt/1.0/courses/filter?q=code:'"+searchfield+"'";
// 		courseType = document.forms[5];
// 		credit = document.forms[3];
// 		creditFilter = advancedFilter(url, credit, courseType);
// 	}

    document.getElementById("welcome").style.display="none";
    document.getElementById("search_results").style.display="inline";
		creditFilter;
		// result;
}

function advancedFilter(url, creditFiltered, courseTypeCheck){
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {

	//response finished loading
    if (this.readyState == 4){

    	// request was successful
    	if(this.status == 200) {

        	myObj = JSON.parse(this.responseText);
					result = [];

					if (!creditFiltered[0].checked && !creditFiltered[1].checked) {
						result = myObj;
					} else {
						for (i = 0; i < creditFiltered.length; i++) {
								if (creditFiltered[i].checked && creditFiltered[i].value == "Full") {
										for (j = 0; j < myObj.length; j++) {
											if (myObj[j].code.slice(-1) == "Y") {
												result.push(myObj[j]);
											}
										}
								}
								else if (creditFiltered[i].checked && creditFiltered[i].value == "Half") {
									for (k = 0; k < myObj.length; k++) {
										if (myObj[k].code.slice(-1) != "Y") {
											result.push(myObj[k]);
										}
									}
								}
						}
					}


					final = [];

					if (!result && !courseTypeCheck[0].checked && !courseTypeCheck[1].checked && !courseTypeCheck[2].checked) {
						final = myObj;
					} else if (!courseTypeCheck[0].checked && !courseTypeCheck[1].checked && !courseTypeCheck[2].checked){
						final = result;
					} else {
						for (i = 0; i < courseTypeCheck.length; i++) {
								if (courseTypeCheck[i].checked && courseTypeCheck[i].value == "Research") {
										for (j = 0; j < result.length; j++) {
											if (result[j].description.includes("research")) {
												final.push(result[j]);
											}
										}
								}
								else if (courseTypeCheck[i].checked && courseTypeCheck[i].value == "Pass/Fail") {
									for (k = 0; k < result.length; k++) {
										if (result[k].description.includes("pass/fail")) {
											final.push(result[k]);
										}
									}
								}
								else if (courseTypeCheck[i].checked && courseTypeCheck[i].value == "Online") {
									for (l = 0; l < result.length; l++) {
										if (result[l].description.includes(" online ")) {
											final.push(result[l]);
										}
									}
								}
						}
					}
					showResults(final);

    	}
    	// the given url does not exist, therefore no game data
    	else{
		document.getElementById("search_r").innerHTML = "";
        	console.log("did not work!");
        }

    }

};

xmlhttp.open("GET", url, true);
xmlhttp.send();
}


// if user flexes a courses, # of flexes get updated
function updateFlexes(el_code, el_id){
    var flx = document.getElementById(el_code).innerHTML;
		flx++;
		$.ajax({
						url: '/api/courseflex/',
						type: 'PUT',
						data: {code: el_code, flex: flx},
						success: function(result) {
								 document.getElementById(el_code).innerHTML++;
								 if(document.getElementById(el_id) != null){
						     		document.getElementById(el_id).innerHTML++;
						     	}
						},
						error: function(req, msg, err){
								//console.log("not logged in, no update");
						}
					});

}

$(document).on("click", ".optcheck", function() {
		getResults();
		
});

function viewCourse(course){

	var details = document.getElementById("course_details");

	details.innerHTML = "";

	details.style.display = "inline-block";

	var titletbl = document.createElement("TABLE");
	titletbl.className = "titletbl";
	var title_rw = document.createElement("TR");

	var title_th1 = document.createElement("TH");
	title_th1.className = "titletbl title";
	var name_code = document.createElement("H3");
	name_code.innerHTML = course.code + " - " + course.name;


	title_th1.appendChild(name_code);
	title_rw.appendChild(title_th1);

	var title_th2 = document.createElement("TH");
	title_th2.className = "titletbl btn_flexes";
	var flex_button = document.createElement("BUTTON");
	flex_button.className="flex_details";
	flex_button.onclick= function() {updateFlexes(course.code, course.id)};

	var flex_img = document.createElement("IMG");
	flex_img.className="flex_img_details";
	flex_img.src="https://d30y9cdsu7xlg0.cloudfront.net/png/730324-200.png";
	flex_img.alt="";

	flex_button.appendChild(flex_img);


	title_th2.appendChild(flex_button);
	title_rw.appendChild(title_th2);

	var title_th3 = document.createElement("TH");
	title_th3.className = "titletbl num_flexes";
	var num_flexes = document.createElement("P");
	num_flexes.className="num_details";
	num_flexes.id=course.id;
	num_flexes.innerHTML= document.getElementById(course.code).innerHTML;


	title_th3.appendChild(num_flexes);
	title_rw.appendChild(title_th3);

	titletbl.appendChild(title_rw);
	details.appendChild(titletbl);


	var line_div = document.createElement("DIV");
	line_div.className="line shadow";
	details.appendChild(line_div);

	var desc = document.createElement("P");
	desc.innerHTML = course.description;
	details.appendChild(desc);

	var division = document.createElement("P");
	division.innerHTML= "Division: " + course.division;
	details.appendChild(division);

	var department = document.createElement("P");
	department.innerHTML="Department: " + course.department;
	details.appendChild(department);

	var prereq = document.createElement("P");
	prereq.innerHTML = "Prerequisites: " + course.prerequisites;
	details.appendChild(prereq);

	var exclu = document.createElement("P");
	exclu.innerHTML = "Exclusions: " + course.exclusions;
	details.appendChild(exclu);

	var campus = document.createElement("P");
	campus.innerHTML = "Campus: " + course.campus;
	details.appendChild(campus);

	var term = document.createElement("P");
	term.innerHTML = "Term: " + course.term;
	details.appendChild(term);

	var breadths = document.createElement("P");
	breadths.innerHTML = "Breadths: ";
	course.breadths.forEach(function(item, index){
		if(index == 0){
			breadths.innerHTML += item;
		}
		else{
			breadths.innerHTML += ", " + item;
		}
	});
	details.appendChild(breadths);


	var timetbl_btn = document.createElement("BUTTON");
	timetbl_btn.innerHTML = "Show Timetable";
	timetbl_btn.id = "timetbl_btn";
	timetbl_btn.className="btn";
	details.appendChild(timetbl_btn);

	createTimetable(course.meeting_sections, course.code);
	document.getElementById("timetable" + course.code).style.display="none";

	document.getElementById("timetbl_btn").onclick = function() {toggleTimetable(document.getElementById("timetable" + course.code))};

}

function toggleTimetable(element){
	if(element.style.display == "none"){
		element.style.display="inline-block";
		document.getElementById("timetbl_btn").innerHTML="Hide TimeTable";
	}
	else{
		element.style.display="none";
		document.getElementById("timetbl_btn").innerHTML="Show TimeTable";
	}
}

function createTimetable(meeting_sections, crs_code){

	var timetable = document.createElement("DIV");
	timetable.id="timetable" + crs_code;

	var weekdays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

	var time_tag = "AM";
	var timehr = 9;
	var timeh = 9;
	var tbl = document.createElement("TABLE");
	tbl.className="timetbl";
	tbl.id="tbl";
	var rw1 = document.createElement("TR");
	rw1.className="timetbl_tr";
	var th1 = document.createElement("TH");
	th1.className="timetbl_th";
	th1.innerHTML = " ";
	rw1.appendChild(th1);

	for(var x=0; x<5;x++){
		var th = document.createElement("TH");
		th.className="timetbl_th";
		th.innerHTML= weekdays[x];
		rw1.appendChild(th);
	}

	tbl.appendChild(rw1);
	for(var y=0; y<13 ;y++){

		var rw = document.createElement("TR");
		rw.className="timetbl_tr";

		for(var i=0; i < 6; i++){

			var td = document.createElement("TD");
			td.className="timetbl_td";

			if(i==0){
				if(timehr > 12){
					var time_hr = timehr - 12;
					timeh = time_hr;
					time_tag="PM";
					td.innerHTML= time_hr.toString() +":00PM";

				}
				else{
					if(timehr == 12){
						td.innerHTML= "12:00PM";
						time_tag="PM";
						timeh = 12;
					}
					else{
						td.innerHTML= timehr.toString() +":00AM";
						time_tag="AM";
						timeh = timehr;
					}
				}
				timehr++;
			}
			else{

				td.id = weekdays[i-1] + timeh.toString() + time_tag + crs_code;
				td.innerHTML=" ";
			}


			rw.appendChild(td);
		}

		tbl.appendChild(rw);
	}
	timetable.appendChild(tbl);
	document.getElementById("course_details").appendChild(timetable);

	meeting_sections.forEach(function(section, index){
		section.times.forEach(function(item, index){
			var tag = "AM";
			var start = item.start/3600;
			var end = item.end/3600;
			for(var i = 0; i < item.duration/3600; i++){
				if(start >= 12){
					tag = "PM";
					if(start > 12){
						start = start - 12;
					}

				}
				var time_box = item.day + start.toString() + tag + crs_code;

				var box = document.getElementById(time_box);
				var sec_code = document.createElement("DIV");
				sec_code.id=crs_code + section.code + i.toString();
				sec_code.className="popup";

				sec_code.innerHTML=section.code;

				var pop_info = document.createElement("SPAN");
				pop_info.className="popuptext";
				pop_info.id="myPopup" + crs_code + section.code + i.toString();;
				pop_info.innerHTML = "Location: " + item.location + "<br>Instructors: ";


				section.instructors.forEach(function(inst, index){
					if(index == 0){
						pop_info.innerHTML += inst;
					}
					else{
						pop_info.innerHTML += ", " + inst;
					}
				});
				pop_info.style.color="white";

				sec_code.appendChild(pop_info);

				box.appendChild(sec_code);

				var blank = document.createElement("BR");
				box.appendChild(blank);

				sec_code.onclick = function() {createPopup(this.id)};

				box.style.color="#2e3092";

				start++;
			}

		});
	});
}

function showResults(obj){
	document.getElementById("search_r").innerHTML = "";
	obj.forEach(function(item, index){
		var tbl_div = document.createElement("DIV");
		tbl_div.className="courses";
		tbl_div.id=item.code + "_d";
		var tbl = document.createElement("TABLE");
		tbl.className="course";

		var rw1 = document.createElement("TR");
		var th_crs = document.createElement("TH");

		var crs = document.createElement("BUTTON");
		crs.className="course_name";
		crs.onclick = function() {viewCourse(item)};
		crs.innerHTML = item.code;
		th_crs.appendChild(crs);
		rw1.appendChild(th_crs);


		var th_btn = document.createElement("TH");

		var flex_button = document.createElement("BUTTON");
		flex_button.className="flex_button";
		flex_button.onclick= function() {updateFlexes(item.code, item.id)};

		var flex_img = document.createElement("IMG");
		flex_img.className="flex_img";
		flex_img.src="https://d30y9cdsu7xlg0.cloudfront.net/png/730324-200.png";
		flex_img.alt="";

		flex_button.appendChild(flex_img);
		th_btn.appendChild(flex_button);
		rw1.appendChild(th_btn);

		var th_flex = document.createElement("TH");

		var num_flexes = document.createElement("P");
		num_flexes.className="num_flexes";
		num_flexes.id=item.code;
		$.get("/api/courseflex/"+item.code, function(data){
				//console.log(data);
				num_flexes.innerHTML = data[0].numflex;
		})
		.fail(function(){
				//console.log('newflex');
				//console.log("no courses");
				num_flexes.innerHTML=0;
		});

		th_flex.appendChild(num_flexes);
		rw1.appendChild(th_flex);

		tbl.appendChild(rw1);

		var rw2 = document.createElement("TR");

		var td = document.createElement("TD");
		td.className="course_descr";
		td.innerHTML=item.name;

		rw2.appendChild(td);
		tbl.appendChild(rw2);
		tbl_div.appendChild(tbl);

		document.getElementById("search_r").appendChild(tbl_div);

	});
}

function createPopup(pop_id) {
    var popup = document.getElementById("myPopup" + pop_id);
    popup.classList.toggle("show");
}

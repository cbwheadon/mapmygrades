var drawChart = function(values,svg,school,subject,me){

    var times = ["Year 7","Year 8","Year 9","Year 10", "Year 11"];

    estimatedData = values[me];
    achievedData = estimatedData.map(function(x,y){return x+((y/4)*Math.random())});
    combinedData = estimatedData.concat(achievedData);
    times2 = times.concat(times);

    //Width and height
    var margin = {top: 80, right: 80, bottom: 80, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var padding = 30;

    var x = d3.scale.ordinal()
	.domain(times)
	.rangePoints([0, width], 0.5);

    var y = d3.scale.linear()
        .range([height, 0])

    y.domain(d3.extent(values, function(d) { return d[d.length-1]; }));
    
    var svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("class", "RdYlGn")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var line = d3.svg.line()
//	.interpolate("basis")
	.x(function(d, i) { return x(times[i]); })
	.y(y);

    var centres = svg.selectAll(".line")
	.data(values)
	.enter().append("path")
	.attr("class", function (d,i) {
 	    return "q" + Math.round(d[d.length-1]) + "-11";

	})
	.attr("d", line)

    svg.append("path")
	.datum(achievedData)
	.attr("class", "achline")
	.attr("d", line);

    svg.append("path")
	.datum(estimatedData)
	.attr("class", "estline")
	.attr("d", line);

    var circles = svg.selectAll(".circle")
	.data(combinedData)
	.enter().append("circle")
	.attr("cy", function(d) {
	    return y(d);
	})
	.attr("cx", function(d,i){
	    return x(times2[i]);
	})
	.attr("r", 10)
	.attr("class", function(d, i) {
 		return "f" + Math.round(d) + "-11";
	});


    var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")

    var yAxis = d3.svg.axis()
	.scale(y)
	.tickFormat(d3.format(".2f"))
	.orient("right")

    svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);

    svg.append("g")
	.attr("class", "y axis")
	.attr("transform", "translate(" + width + ",0)")
	.call(yAxis)
	.append("text")
	.attr("transform", "rotate(90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "beginning")
	.text("Value-added (GCSE grades)");

    var grades = ["A**","A*","A","B","C","D","E","F","G"];
    var color = function(i){
	return "f" + (grades.length - i) + "-11";;
    }

    var legend = svg.selectAll(".legend")
	.data(grades)
	.enter().append("g")
	.attr("class", "RdYlGn")
	.attr("transform", function(d, i) { return "translate(-" + (width) + "," + i * 20 + ")"; });

    legend.append("rect")
	.attr("x", width - 18)
	.attr("width", 18)
	.attr("height", 18)
	.attr("class", function(d, i) {return color(i)});

    legend.append("text")
	.attr("x", width - 24)
	.attr("y", 9)
	.attr("dy", ".35em")
	.style("text-anchor", "end")
	.text(function(d) { return d; });

    var lineLegend = svg.selectAll(".lineLegend")
	.data(["Current Progress","Predicted Progress"])
	.enter().append("g")
	.attr("transform", function(d, i) { return "translate(-" + (2*width/3) + "," + i * 20 + ")"; });
    
    lineLegend.append("text")
	.attr("x", width -100)
	.attr("y", 9)
	.attr("dy", ".35em")
	.style("text-anchor", "end")
	.text(function(d) { return d; });

    lineLegend.append("line")
	.attr("x1", width - 90)
	.attr("x2", width - 50)
	.attr("y1", 9)
	.attr("y2", 9)
	.attr("dy", ".35em")
	.attr("class", function(d,i){ 
	    if(i==0) {return "achline"} else {return "estline"}
	})
}

Subjects = new Meteor.Collection("subjects");
Schools = new Meteor.Collection("schools");

Template.caption.subject = function(){
    var subj = Session.get("subject");
    var data = Subjects.find({_id:subj},{}).fetch();
    if (data){
	return(data[0])
    }    
}

Template.subjects.list = function(){
    console.log(Session.get('school'));
    var data = Schools.find({'_id':Session.get('school'),'year':Session.get('year')}).fetch();
    if (data[0] && data[0].hasOwnProperty('subject')) {
	return(data[0].subject);
    }
}

Template.subjects.events({
    'click li a': function (event) {
	var subj = event.currentTarget.text;
	var subj_year = subj + "_" + Session.get('year');
	d3.select("svg").remove();
	Session.set('subject',subj_year);
    }
})

Template.caption.me = function(){
    return Session.get("myProgress");
}

Template.caption.myScore = function(){
    return Session.get("myScore");
}

Template.subjects.subject = function(){
    return Session.get("subject")
}

Template.caption.helpers({
  round: function (x) {
      return (parseFloat(Math.round(x * 100) / 100).toFixed(2));
  },
    split: function (x) {
	if(x){
	    return (x.split("_").join(" in "));
	}
    }
});

Template.subjects.helpers({
    split: function (x) {
	if (x) {
	    return (x.split("_").join(" in "));
	}
    }
});

var findGrade = function(x) {
    var grades = ["G","F","E","D","C","B","A","A*","A^"];
    grade = grades[Math.round(x)-1];
    return grade;
}

Template.chart.rendered = function(){
    var self = this;
    self.node = self.find("svg");
    if (!self.handle){
	self.handle = Deps.autorun(function() {
	    var ready1 = Meteor.subscribe("mySubjects");
	    var ready2 = Meteor.subscribe("mySchools");
	    if (ready1.ready() & ready2.ready()){
		var data = Subjects.find({_id:Session.get("subject")},{}).fetch();
		var dat = data[0]['schools'];
		var out = [];
		var mn = data[0]['mn_score'];
		for (var i = 0; i < dat.length; i++) {
		    var tmp = dat[i].val
		    if(dat[i].school==Session.get("school")){
			var me = i;
			var progress = findGrade(tmp);
			Session.set("myProgress",progress);
			Session.set("myScore",tmp-mn);
		    }
		    //calculate the slope of the line
		    var inc = Array.apply(0, Array(5)).map(function (x, y) { return mn + (y *((tmp-mn)/4)) ;}); 
		    out.push(inc);
		}
		drawChart(out, self.node, Session.get("school"), Session.get("subject"), me);
	    }
	});
    }
}

Meteor.startup(function () {
    Session.set("school","10322");
    Session.set("year", 2011);
    Session.set("subject","2CS01_2011");
});

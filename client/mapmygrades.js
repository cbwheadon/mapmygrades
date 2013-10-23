var drawChart = function(values,svg,school,subject,me){

    var times = ["Year 7","Year 8","Year 9","Year 10", "Year 11"];
    
    /*
    var values = [
	[2, 4, 8],
	[5, 9, 12],
	[3, 2, 2],
	[2, 4, 15]
    ];
    */
    
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

    y.domain(d3.extent(values, function(d) { return d[4]; }));
    
    var svg = d3.select(svg)
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var line = d3.svg.line()
	.interpolate("basis")
	.x(function(d, i) { return x(times[i]); })
	.y(y);

    svg.selectAll(".line")
	.data(values)
	.enter().append("path")
	.attr("class", function (d,i) {
	    if(i==me){
		return "myline";
	    } else {
		return "line";
	    }
	 })
	.attr("d", line);

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

}

Subjects = new Meteor.Collection("subjects");

Template.caption.subject = function(){
    var subj = Session.get("subject");
    var data = Subjects.find({_id:subj},{}).fetch();
    if (data){
	return(data[0])
    }    
}

Template.caption.me = function(){
    return Session.get("myProgress");
}

Template.caption.myScore = function(){
    return Session.get("myScore");
}

Template.header.subject = function(){
    return Session.get("subject")
}

Template.caption.helpers({
  round: function (x) {
      return (parseFloat(Math.round(x * 100) / 100).toFixed(2));
  },
  split: function (x) {
      return (x.split("_").join(" in "));
  }
});

Template.header.helpers({
  split: function (x) {
      return (x.split("_").join(" in "));
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
	    var ready = Meteor.subscribe("mySubjects");
	    if (ready.ready()){
		var data = Subjects.find({_id:Session.get("subject")},{}).fetch();
		var dat = data[0]['schools'];
		var out = [];
		var mn = data[0]['mn_score'];
		for (var i = 0; i < dat.length; i++) {
		    var tmp = dat[i].val
		    if(dat[i].school==Session.get("school")){
			var me = i;
			var progress = findGrade(tmp + mn);
			Session.set("myProgress",progress);
			Session.set("myScore",tmp);
		    }
		    var inc = Array.apply(0, Array(5)).map(function (x, y) { return y * (tmp/4); }); 
		    out.push(inc);
		}
		drawChart(out, self.node, Session.get("school"), Session.get("subject"), me);
	    }
	});
    }
}

Meteor.startup(function () {
    Session.set("school","10322");
    Session.set("subject","2CS01_2011");
});

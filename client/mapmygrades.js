var drawChart = function(data,svg,school,subject){
    var dataset = data[0].schools;
    //Width and height
    var margin = {top: 80, right: 80, bottom: 80, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var padding = 30;

    var xScale = d3.scale.ordinal()
        .domain(0,4)
        .range([0, width]);
    var yScale = d3.scale.linear()
        .domain([-0.2, d3.max(dataset, function(d) { return d.val; })])
        .range([height, 0]);

    var svg = d3.select(svg)
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll("line")
	.data(dataset)
	.enter()
	.append("line")
	.attr("x1", function(d) {
	    return xScale(0);
	})
	.attr("y1",function(d) {
	    return yScale(0);
	})
	.attr("x2", function(d) {
	    return xScale(4);
	})
	.attr("y2", function(d) {
            return yScale(d.val);
	})
	.attr("class",function(d) {
	    if (d.school==school){
		return "mine" 
	    } else {
		return "other";
	    }
	});

    var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("bottom")
	.tickValues(["Year 7","Year 11"])

    var yAxis = d3.svg.axis()
	.scale(yScale)
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

    svg.append("text")
	.attr("x", width - 6)
	.attr("y", height - 6)
	.style("text-anchor", "end")
	.text(subject);

}

Subjects = new Meteor.Collection("subjects");

Template.chart.rendered = function(){
    var self = this;
    self.node = self.find("svg");
    if (!self.handle){
	self.handle = Deps.autorun(function() {
	    var ready = Meteor.subscribe("mySubjects");
	    if (ready.ready()){
		var data = Subjects.find({_id:Session.get("subject")}).fetch();
		drawChart(data, self.node, Session.get("school"), Session.get("subject"));
	    }
	});
    }
}

Meteor.startup(function () {
    Session.set("school","10322");
    Session.set("subject","2CS01_2011");
});

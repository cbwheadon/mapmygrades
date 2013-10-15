function drawChart(){
    var data = {
	labels : ["2012","2013","2014","2015","2016","2017","2018"],
	datasets : [
	    {
		strokeColor : "rgba(220,220,220,1)",
		pointColor : "rgba(220,220,220,1)",
		pointStrokeColor : "#fff",
		data : [90,90,90,90,90,90,90]
	    },
	    {
		strokeColor : "rgba(151,187,205,1)",
		pointColor : "rgba(151,187,205,1)",
		pointStrokeColor : "#fff",
		data : [72,69,73,74,70,68,71]
	    },
	    {
		strokeColor : "rgba(204,119,34,0.5)",
		pointColor : "rgba(204,119,34,0.5)",
		data : [70,68,72,74,71,76,78],
		pointStrokeColor : "#fff"
	    }
	]
    }
    var options = {
	datasetFill : false,
        scaleOverride : true,
        scaleSteps : 5,
        scaleStepWidth : 20,
        scaleStartValue : 0
    }
    //Get context with jQuery - using jQuery's .get() method.
    var ctx = $("#myChart").get(0).getContext("2d");
    //This will get the first returned node in the jQuery collection.
    var myNewChart = new Chart(ctx);
    new Chart(ctx).Line(data,options);
}

Template.chart.rendered = function(){
    drawChart();
}


Meteor.startup(function () {

});

Temps = new Meteor.Collection("temps");
Meteor.publish("myTemps", function(){
    return Temps.find({});
});


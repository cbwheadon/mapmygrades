Subjects = new Meteor.Collection("subjects");
Queries = new Meteor.Collection("queries");
Schools = new Meteor.Collection("schools");

Meteor.publish("Queries", function(id){
    return Queries.find({_id:id});
});

Meteor.publish("Subjects", function(){
    return Subjects.find({});
});

Meteor.publish("Schools", function(centre){
    return Schools.find({"centre":centre});
});




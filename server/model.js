Subjects = new Meteor.Collection("subjects");
Meteor.publish("mySubjects", function(){
    return Subjects.find({});
});

Schools = new Meteor.Collection("schools");
Meteor.publish("mySchools", function(){
    return Schools.find({});
});


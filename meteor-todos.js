Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  Template.body.helpers({
    tasks: function () {
      return Tasks.find({});
    }
  });
  Template.body.events({
    "submit .new-task": function (event){
      
      // Get value from input
      var text = event.target.text.value;

      // Insert into db
      Tasks.insert({
        text: text,
        createdAt: new Date()
      });

      // Clear text field
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

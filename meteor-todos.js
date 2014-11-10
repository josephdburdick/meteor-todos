Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")){
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}})
      } else {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });
  Template.body.events({
    "submit .new-task": function (event){
      
      // Get value from input
      var text = event.target.text.value;

      // Insert into db
      Meteor.call("addTask", text);

      // Clear text field
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    },
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });
  Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite 
      // of it's current value.
      Meteor.call("setChecked", this._id, ! this.checked);
    },
    "click .delete": function () {
      Meteor.call("deleteTask", this._id);
    }
  });
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

// At the bottom of the file, outside of the client-only block.
Meteor.methods({
  addTask: function (text){
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()){
      throw new Meteor.Error("not-authorized");
    }
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function (taskId){
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked){
    Tasks.update(taskId, {$set: {checked: setChecked} });
  }
});
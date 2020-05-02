var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://localhost:27017/db');

var Schema = mongoose.Schema;

var PersonSchema = new Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
    isVegan: {type: Boolean},
    isVegetarian: {type: Boolean},
    isLactose: {type: Boolean},
    isNut: {type: Boolean},
    isGluten: {type: Boolean},
    isWeight: {type: Number},
    heightFeet: {type: Number},
    heightInches: {type: Number},
    activityLevel: {type: String},
    age: {type: Number},
    city: {type: String},
    state: {type: String},
    });

PersonSchema.methods.validateLogin = function(inputName, inputPassword) {
    return (this.username == inputName) && (this.password == inputPassword) && (this.admin);
}

//export personSchema as a class called Person
module.exports = mongoose.model('Person', PersonSchema);
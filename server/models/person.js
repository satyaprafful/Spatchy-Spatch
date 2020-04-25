var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://localhost:27017/db');

var Schema = mongoose.Schema;

var PersonSchema = new Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
    isVegan: {type: Boolean, required: true},
    isVegetarian: {type: Boolean, required: true},
    isLactose: {type: Boolean, required: true},
    isNut: {type: Boolean, required: true},
    isGluten: {type: Boolean, required: true},
    isWeight: {type: Number},
    heightFeet: {type: Number},
    heightInches: {type: Number},
    activityLevel: {type: String},
    age: {type: Number}
    });

PersonSchema.methods.validateLogin = function(inputName, inputPassword) {
    return (this.username == inputName) && (this.password == inputPassword) && (this.admin);
}

//export personSchema as a class called Person
module.exports = mongoose.model('Person', PersonSchema);
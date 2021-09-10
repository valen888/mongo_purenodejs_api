module.exports = {};

const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const UserSchema = new Schema({
    firstname:{ type: String ,required : true},
    lastname:{ type: String ,required : true},
    email:{ type: String ,required : true},
    pnumber:{ type: String ,required : true},
    location:{ type: String ,required : true},
    socials:{ type: String ,required : true},
});

const UserModel = mongoose.model('User', UserSchema);

class User {
    constructor(firstname,lastname,email,pnumber,location,socials) {
        this.firstname = firstname;// number
        this.lastname = lastname;
        this.email = email;
        this.pnumber = pnumber;
        this.location = location;
        this.socials = socials;
    }

    static getById(id){
        return UserModel.findById(id);
    }

    static getAll() {
        return UserModel.find({});
    }
    static insert(user) {
        return new UserModel(user).save();
    }
    static update(id,firstname,lastname,email,pnumber,location,socials) {
        return UserModel.updateOne({ _id: id }, {firstname:firstname,lastname:lastname,
            email:email,pnumber:pnumber,location:location,socials:socials});
    }
    static deleteById(id) {
        return UserModel.deleteOne({ _id: id });
    }  
}
module.exports = User;
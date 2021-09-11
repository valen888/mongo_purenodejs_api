module.exports = {};

const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const PdfileSchema = new Schema({
    filename: { type: String, required: true },
    createdAt: { type: String, required: true }
});

const PdfileModel = mongoose.model('Pdfile', PdfileSchema);

class Pdfile {
    constructor(filename, createdAt) {
        this.filename = filename;
        this.createdAt = createdAt;
    }

    static getById(id) {
        return PdfileModel.findById(id);
    }

    static getAll() {
        return PdfileModel.find({});
    }
    static insert(file) {
        return new PdfileModel(file).save();
    }
    static update(id, filename, createdAt) {
        return PdfileModel.updateOne({ _id: id }, {filename:filename, createdAt:createdAt});
    }
    static deleteById(id) {
        return PdfileModel.deleteOne({ _id: id });
    }
    static findByName(_filename) {
        return PdfileModel.find({ filename: _filename });
    }
}
module.exports = Pdfile;
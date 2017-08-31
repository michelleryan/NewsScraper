var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SavedSchema = new Schema({
    saveHeadline:{
        type: Boolean,
        default: 0
    }
});

var Saved = mongoose.model("Saved", SavedSchema);

module.exports = Saved;

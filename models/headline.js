var mongoose = require("mongoose");

//create schema
var Schema = mongoose.Schema;

//create headline schema
var HeadlineSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    link: {
        type: String,
        require: true
    },
    summary: {
        type: String,
        require: true
    },
    author: {
        type: String,
        required: true
    },
    //save the objectId to reference for the comment
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

//create the headline model with the HeadlineSchema
var Headline=mongoose.model("headline", HeadlineSchema);

//export the model
module.exports = Headline;

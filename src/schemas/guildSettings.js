const mongoose = require('mongoose');
const { SchemaTypes, model } = mongoose;
// const config = require('../../slappey.json');

const guildSettingsSchema = new mongoose.Schema({
	guildId: {
		type: SchemaTypes.Number,
		required: true,
		unique: true,
	},
	guildName: {
		type: SchemaTypes.String,
		required: true,
	},
    ownerId: {
        type: SchemaTypes.Number,
        required: true,
    },
    ownerTag: {
        type: SchemaTypes.String,
        required: true,
    },
    verificationChannelId: {
        type: SchemaTypes.String,
        required: false,
        default: '0',
    },
	verificationRoleId: {
        type: SchemaTypes.String,
        required: false,
        default: '0',
    },
	// shouldDeleteRole: {
    //     type: mongoose.SchemaTypes.Boolean,
    //     required: true,
    //     default: null,
	language: {
        type: SchemaTypes.String,
        required: false,
        default: 'en',
    },

})

module.exports = model("guildSettings", guildSettingsSchema);
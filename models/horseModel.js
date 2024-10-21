const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const horseSchema = new Schema({

	name:{
		type: String, required:true
	},
	
	age:{ type: String, required:true
    },

	sex:{ type: String, required:true
    },

	weight:{ type: String, required:true
    },

	breed:{ type: String, required:true
    },

	wins: {type: Number, required: true, default: 0
	}
	
}, { timestamps: true } ).set('toJSON',{
    transform: (document, object) => {
        object.id = document.id;
        delete object._id;
    }
});

const Horse = mongoose.model('horses', horseSchema);
module.exports = Horse;
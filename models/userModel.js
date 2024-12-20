const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const usrSchema = new Schema({

	email:{
		type: String, required:true, index: {unique: true, dropDups: true}
	},
	
	name:{ type: String, required:true
    },
    
	lastname:{ type: String, required:true
	},
	
	isActive:{ type: Boolean, required:true
	},
	
	roles:{ type: String, required:true, default: 'user'
	},

	password:{ type: String, required:true
	},

	money: {type: Number, required: true, default: 0
	}

	
}, { timestamps: true } ).set('toJSON',{
    transform: (document, object) => {
        object.id = document.id;
        delete object._id;
        delete object.password;
    }
});


const Usr = mongoose.model('users',usrSchema);
module.exports = Usr;
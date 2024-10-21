const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const raceSchema = new Schema({

	name:{
		type: String, required:true
	},
	
	location:{ type: String, required:true
    },

	startDate:{ type: Date, required:true
    },

	distance:{ type: String, required:true
    },

	prize:{ type: String, required:true
    },

	winner:{ type: String, required:true, default: null
	},

    // Programada, En curso, Finalizada.
    status: { type: String, required:true, default: 'Programada'
    },

    horses:[{ type: Schema.Types.ObjectId, ref: 'horses' } 
    ], // Array de referencias a caballos

	
}, { timestamps: true } ).set('toJSON',{
    transform: (document, object) => {
        object.id = document.id;
        delete object._id;
    }
});

const Race = mongoose.model('races', raceSchema);
module.exports = Race;
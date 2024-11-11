const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const betSchema = new Schema({

    user: { type: Schema.Types.ObjectId, ref: 'users'    
    },

    race: { type: Schema.Types.ObjectId, ref: 'races' 
    },

    horse: { type: Schema.Types.ObjectId, ref: 'horses' 
    },

	amount: {
		type: String, required:true
	},
	
	payout: { type: String, required:true
    },

    // pendiente - ganada - perdida
    status: { type: String, required:true, default: 'Pendiente'
    },

    betDate: { 
        type: Date, default: Date.now // Establece la fecha y hora actual como valor por defecto
    },

    
}, { timestamps: true } ).set('toJSON',{
    transform: (document, object) => {
        object.id = document.id;
        delete object._id;
    }
});

const Bet = mongoose.model('bets', betSchema);
module.exports = Bet;
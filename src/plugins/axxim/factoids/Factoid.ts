export class Factoid {

	factoid: string;
	content: string;
	owner: string;
	channel: string;
	forgotten: boolean;
	locked: boolean;
	createdAt: string;

	mongoose: any;
	DatabaseFactoid: any;

	constructor(database: any) {
		this.mongoose = database;

		var factoidSchema = this.mongoose.Schema(this.generateMongooseSchema());
		this.DatabaseFactoid = this.mongoose.model('Factoid', factoidSchema);
	}

	/*
	factoidObject() {
		return {
			factoid: this.factoid,
			content: this.content,
			owner: this.owner,
			forgotten: this.forgotten,
			locked: this.locked,
			createdAt: this.createdAt
		};
	}
	*/

	save() {
		// Create a new database entry for this factoid
		var factoid = new this.DatabaseFactoid({
			factoid: this.factoid,
			content: this.content,
			owner: this.owner
		});
		factoid.save(function(err, factoid){
			if(err){
				return err;
			}

			return factoid;
		});
	}

	generateMongooseSchema() {
		return {
			factoid: String,
			content: String,
			owner: String,
			channel: String,
			forgotten: {type: Boolean, default: false},
			locked:  {type: Boolean, default: false},
			createdAt: {type: Date, default: Date.now}
		};
	}

}

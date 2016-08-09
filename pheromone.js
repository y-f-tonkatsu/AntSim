var Pheromone;

(function(){	
	
	Pheromone = function(ch, pos, strength){
		
		this._ch = ch;
		this._current = pos;
		this._strength = strength;
	};
	
	Pheromone.prototype = {
		
		'update':function(){
			this._strength -= 0.001;
			this.draw(this._ch, this._current, this._strength);
		},
		
		'draw':function(ch, pos, amount){
			
			if(!this.isDead()){
				ch.setFillStyle(100, 100, 200, 0.01);
				ch.setStrokeStyle(0, 0, 70, 0.02);
				ch.drawShape(function(ctx){
					ctx.arc(pos.x, pos.y, amount * 100, 0, Math.PI * 2);
				}, true, true);
			}
			
		},
		
		'isDead':function(){
			return this._strength <= 0;
		},
		
		'getPosition':function(){
			return this._current;
		},
		
		'getStrength':function(){
			return this._strength;
		}
		
	}
	
})();
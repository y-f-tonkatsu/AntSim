var AntSim;

(function(){	
	
	var NEST_SIZE = 10;
	var MAX_FOOD = 10;
	var DIST_FOOOD = 10;
	
	AntSim = function(ch){
		
		this._ch = ch;
		
		this._width = ch.getCanvasWidth();
		this._height = ch.getCanvasHeight();
		
		this._unitList = {
			pheromones:[],
			foods:[],
			ants:[]
		};
		
		this._nestPos = {
			'x': this._width / 2,
			'y': this._height / 2
		}
		
	};
	
	AntSim.prototype = {
		
		'getRandomPos':function(){
			return {
				'x': Math.random() * this._width,
				'y': Math.random() * this._height
			}
		},
		
		'getRandomFoodPos':function(){
			
			var pos = {
				'x': Math.random() * this._width,
				'y': Math.random() * this._width
			};
			
			while(this._ch.dist(pos, this._nestPos) < 80 ||
				this._ch.dist(pos, this._nestPos) > this._height * 0.5
			){
				pos = {
					'x': Math.random() * this._width,
					'y': Math.random() * this._width
				};
			}
			
			return pos;
			
		},
		
		'generateAnt':function(){
			
			var ant = new Ant(this._ch, this._nestPos);
			this._unitList.ants.push(ant);
				
		},
		
		'generateFood':function(){
			
			var food = new Food(this._ch, this.getRandomFoodPos(), Math.floor(Math.random() * 50) + 25);
			this._unitList.foods.push(food);
				
		},
		
		'generatePheromone':function(pos, strength){
			
			var position = {
				'x':pos.x,
				'y':pos.y
			}
			var pheromone = new Pheromone(this._ch, position, strength);
			this._unitList.pheromones.push(pheromone);
				
		},
		
		'drawNest':function(){
			
			this._ch.setStrokeStyle(200, 5, 10, 1);
			this._ch.setFillStyle(200, 200, 50, 1);
			this._ch.drawShape(_.bind(function(ctx){
				ctx.arc(this._width * 0.5, this._height * 0.5, NEST_SIZE, 0, Math.PI * 2);
			}, this), true, true);
				
		},
		
		'update':function(delta){
			
			this._ch.clear();
			
			if(Math.random() > 0.90) {
				this.generateAnt();	
			}
			
			if(Math.random() > 0.95 && this._unitList.foods.length < MAX_FOOD) {
				this.generateFood();	
			}
			
			var that = this;
						
			_.each(this._unitList, function(units, key, list){
				
				_.each(units, function(unit){
					unit.update();
				});
				
				list[key] =  _.reject(units, function(unit){
					return unit.isDead();
				});
								
			});
			
			_.each(this._unitList.ants, function(ant, key, list){
				
				if(!ant.isRunout()){
					
					_.each(that._unitList.foods, function(food){
						ant.temptate(food.getPosition(), 2.5, food.getAmount() * 0.03 + 16);
						if(that._ch.dist(ant.getPosition(), food.getPosition()) < DIST_FOOOD){
							food.eat();
							ant.setPheromoneStrength(1.1);
							ant.putFood(1);
						}
					});
					
					_.each(that._unitList.pheromones, function(pheromone){
						ant.temptate(pheromone.getPosition(), pheromone.getStrength(), pheromone.getStrength() * 20 + 10);
					});
					
				} else {
					
					if(Math.random() > 0.85 &&
						ant.getPheromoneStrength() > 0
					){
						that.generatePheromone(ant.getPosition(), ant.getPheromoneStrength());
					}
					
				}
				
			});
			
			this.drawNest();
			
		}
		
	}
	
})();
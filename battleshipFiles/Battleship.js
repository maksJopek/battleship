class Battleship
{
	constructor(name)
	{
		// Set name
		this.name = name;
		//  Initializing game map
		this.gameMap = createGameMap();
		//  Declaring how many of which type ships there would be
		this.shipsMap = new Map();
		this.shipsMap.set(4, NUM_OF_4);
		this.shipsMap.set(3, NUM_OF_3);
		this.shipsMap.set(2, NUM_OF_2);
		this.shipsMap.set(1, NUM_OF_1);
		this.shipsArray = [];
		for(let [key, value] of this.shipsMap)
			for(let i = 0; i < value; i++)
				this.shipsArray.push(key);
		
		this.howManyShips = eval(this.shipsArray.join('+'));
		// creating vars, used later
		this.destroyedShips = 0;
	}
}
function createGameMap()
{
	let gameMap = new Array(MAP_SIZE + 2);
	for(let i = 0; i < MAP_SIZE + 2; i++)
		gameMap[i] = new Array(MAP_SIZE + 2);
	
	for(let i = 0; i < MAP_SIZE + 2; i++)
		for(let j = 0; j < MAP_SIZE + 2; j++)
			gameMap[i][j] = 0;
	
	return gameMap;
}
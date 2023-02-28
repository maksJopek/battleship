const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
Array.prototype.last = function() {return this[this.length - 1];};
Array.prototype.first = function() {return this[0];};
const removeElementFromArray = (value, array) => {
	let index = array.indexOf(value);
	if(index > -1)
		array.splice(index, 1);
};

function startNewGame()
{
	let user = new Battleship("user");
	let bot = new Battleship("bot");
	let ai = new Battleship("ai");
	delete ai.howManyShips;
	delete ai.name;
	delete ai.shipsMap;
	ai.numberOfShots = 1;
	// ai.gameMap = createGameMap();
	ai.shotShips = [];
	ai.shipWasShot = [];
	ai.shotShipDirection = "";
	//bot.ai = {};
	window.vars = {};
	
	
	createUI(user, bot, ai);
	
	populateMapRandomly(bot);
	if(IM_SPEED)
		populateMapRandomly(user);
	generateGameMap(bot);
	
	generateGameMap(user);
	if(!IM_SPEED)
		generateShipsUl(user);
	if(IM_SPEED)
		document.getElementById("button").click();
	if(!IM_SPEED)
		positionShips(user);
	//calculateSuperpositionsArray(bot, ai);
	
	//botShot(bot, user);
	let doTest = false;
	if(doTest)
	{
		setTimeout(() => {
			document.body.innerHTML = "";
			window.vars = undefined;
			startNewGame();
		}, 200);
	}
}

function positionShips(player)
{
	let table = document.getElementById("userTable");
	
	window.vars.shipDirection = "horizontally";
	
	window.vars.player = player;
	table.addEventListener('contextmenu', onRightClick);
	
	// table.addEventListener("mouseleave", clearUserShipPosition);
	table.onmouseleave = clearUserShipPosition;
	
	[...table.children].forEach((tr, trNumber) => {
		[...tr.children].forEach((td, tdNumber) => {
			td.onmouseenter = () => showUserShipPosition(tr, trNumber, td, tdNumber, player);
			td.onclick = () => putShipOnGameMap(player, trNumber + 1, tdNumber + 1, undefined, undefined, true);
		});
	});
}

function onRightClick()
{
	window.vars.shipDirection = window.vars.shipDirection === "horizontally" ? "vertically" : "horizontally";
	showUserShipPosition(window.vars.givenTr, window.vars.givenTrNumber, window.vars.givenTd, window.vars.givenTdNumber, window.vars.player);
}

function putShipOnGameMap(player, x, y, direction, ship, update)
{
	if(player.gameMap[x][y] === 1)
	{
		clearUserShipPosition();
		
		let gettedShip = getShip(x, y, player);
		player.shipsArray.push(gettedShip.array.length);
		player.shipsArray.sort((a, b) => b - a);

		for(let coordinates of gettedShip.array)
			player.gameMap[coordinates.x][coordinates.y] = 0;

		for(let td of gettedShip.table)
			td.className = TABLE_BG_COLOR;
		
		generateShipsUl(player);
		window.vars.selectedShip = document.getElementById("ul").children[0].children[0].children[0];
		
		for(let i = 0; i < MAP_SIZE; i++)
			window.vars.selectedTd[i] = undefined;
		
		for(let td of window.vars.selectedShip.children)
			td.className = SHIP_BG_COLOR;
		
		window.vars.isPlaceable = false;
		return;
	}
	// Checking if there are all arguments and sense for this function
	if(player.shipsArray.length === 0 || /*window.vars.wasShipPlaced ||*/ (update && !window.vars.isPlaceable))
		return false;
	if(direction === undefined)
		direction = window.vars.shipDirection;
	if(ship === undefined)
		ship = window.vars.selectedShip.children.length;
	
	// Preventing ability to place all ships on one td
	// TODO: usunac 2 linie
	// if(window.vars.wasShipPlaced !== undefined)
	// 	window.vars.wasShipPlaced = true;
	
	// Correct x and y, because mouse position !== ship start
	[x, y] = correctXY(x, y, ship, direction);
	
	// Updating gameMap
	if(direction === "vertically")
		for(let i = 0; i < ship; i++)
			player.gameMap[x + i][y] = 1;
	else if(direction === "horizontally")
		for(let i = 0; i < ship; i++)
			player.gameMap[x][y + i] = 1;
	
	// Preventing newly colored td's on table form being turn back to TABLE_BG_COLOR
	if(window.vars.selectedTd !== undefined)
		for(let i = 0; i < MAP_SIZE; i++)
			window.vars.selectedTd[i] = undefined;
	
	if(update)
	{
		// Update GUI efficiently
		let table = document.getElementById(player.name + "Table");
		if(direction === "vertically")
			for(let i = 0; i < ship; i++)
				table.children[x + i - 1].children[y - 1].className = SHIP_BG_COLOR;
		else if(direction === "horizontally")
			for(let i = 0; i < ship; i++)
				table.children[x - 1].children[y + i - 1].className = SHIP_BG_COLOR;
		
		// Removing ship from shipsArray
		removeElementFromArray(ship, player.shipsArray);
		
		// Removing ship from ul of ships, if there's no other ships exiting function and removing onmouseenter
		window.vars.selectedShip.parentNode.parentNode.remove();
		if(player.shipsArray.length === 0)
		{
			// Remove all vars and listeners
			[...document.getElementById("userTable").children].forEach(tr => {
				[...tr.children].forEach(td => {
					td.onmouseenter = undefined;// () => {return;};
				});
			});
			document.getElementById("userTable").onmouseleave = undefined;
			document.getElementById("userTable").removeEventListener('contextmenu', onRightClick);
			window.vars = {};
			
			document.getElementById("whosTurn").style.display = "none";
			document.getElementById("button").style.display = "inline-block";
			return;
		}
		
		window.vars.selectedShip = document.getElementById("ul").children[0].children[0].children[0];
		
		// Setting color of newly selected ship
		for(let td of window.vars.selectedShip.children)
			td.className = SHIP_BG_COLOR;
	}
}

function correctXY(x, y, ship, direction)
{
	if(direction === "vertically" && x + ship > MAP_SIZE + 1)
		x -= (x - 1 + ship) - MAP_SIZE;
	else if(direction === "horizontally" && y + ship > MAP_SIZE + 1)
		y -= (y - 1 + ship) - MAP_SIZE;
	
	return [x, y];
}

function getAllIndexes2D(array, value)
{
	let indexes = [];
	array.forEach((row, i) => {
		row.forEach((val, j) => {
			if(val === value)
				indexes.push([i, j]);
		});
	});
	
	return indexes;
}

function updateGameMap(player)
{
	let table = document.getElementById(player.name + "Table");
	[...table.children].forEach((tr, i) => {
		[...tr.children].forEach((td, j) => {
			if([1, 2].includes(player.gameMap[i + 1][j + 1]))
				td.className = SHIP_BG_COLOR;
		});
	});
}
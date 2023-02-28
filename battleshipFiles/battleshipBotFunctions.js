function populateMapRandomly(player)
{
	for(let ship of player.shipsArray)
	{
		let isSet = false;
		while(!isSet)
		{
			let direction = getRandomInt(0, 2) === 0 ? "horizontally" : "vertically";
			let x, y;
			// if(direction === "horizontally")
			if(direction === "vertically")
			{
				x = getRandomInt(1, MAP_SIZE - ship + 2);
				y = getRandomInt(1, MAP_SIZE + 1);
			}
			// else if(direction === "vertically")
			else if(direction === "horizontally")
			{
				x = getRandomInt(1, MAP_SIZE + 1);
				y = getRandomInt(1, MAP_SIZE - ship + 2);
			}
			if(checkPositionForShip(x, y, direction, ship, player) === true)
			{
				isSet = true;
				putShipOnGameMap(player, x, y, direction, ship, false);
			}
		}
	}
}

function botShot(bot, user, ai)
{
	// console.log("Shot number: " + ai.numberOfShots++ + (ai.shipWasShot.length !== 0 ? " (ship was shot)" : " (ship wasnt shot)"));
	// console.log("Start: ", ai);
	
	let superPositions = calculateSuperpositionsArray(bot, ai);
	let userTable = document.getElementById("userTable");
	let shotIndex = {x: 'x', y: 'y'};
	
	if(ai.shipWasShot.length !== 0)
	{
		let x = ai.shipWasShot[0];
		let y = ai.shipWasShot[1];
		
		if(!ai.shotShipDirection)
		{
			let possibleShots = new Map();
			if(x !== 1)
				possibleShots.set("up", [superPositions[x - 1][y], x - 1, y]);
			if(x !== 10)
				possibleShots.set("down", [superPositions[x + 1][y], x + 1, y]);
			if(y !== 1)
				possibleShots.set("left", [superPositions[x][y - 1], x, y - 1]);
			if(y !== 10)
				possibleShots.set("right", [superPositions[x][y + 1], x, y + 1]);
			
			possibleShots = new Map([...possibleShots.entries()].sort((a, b) => b[1][0] - a[1][0]));
			
			if(possibleShots.entries().next().value[0] === "up" || possibleShots.entries().next().value[0] === "down")
				ai.shotShipDirection = "vertically";
			else
				ai.shotShipDirection = "horizontally";
			
			shotIndex.x = possibleShots.entries().next().value[1][1];
			shotIndex.y = possibleShots.entries().next().value[1][2];
			
			// if(possibleShots.entries().next().value[1][0] < 1)
			// 	ai.shipWasShot = [];
		}
		else
		{
			let beforeFirst = {x: 'x', y: 'y'}, afterLast = {x: 'x', y: 'y'};
			if(ai.shotShipDirection === "vertically")
			{
				// console.log("unsorted:", ai.shotShips);
				ai.shotShips.sort((a, b) => a.x - b.x);
				// console.log("sorted:", ai.shotShips);
				beforeFirst.x = ai.shotShips.first().x - 1;
				beforeFirst.y = ai.shotShips.first().y;
				afterLast.x = ai.shotShips.last().x + 1;
				afterLast.y = ai.shotShips.last().y;
			}
			else if(ai.shotShipDirection === "horizontally")
			{
				// console.log("unsorted:", ai.shotShips);
				ai.shotShips.sort((a, b) => a.y - b.y);
				// console.log("sorted:", ai.shotShips);
				beforeFirst.x = ai.shotShips.first().x;
				beforeFirst.y = ai.shotShips.first().y - 1;
				afterLast.x = ai.shotShips.last().x;
				afterLast.y = ai.shotShips.last().y + 1;
			}
			// if(superPositions[beforeFirst.x][beforeFirst.y] > 0 || superPositions[afterLast.x][afterLast.y] > 0)
			// {
			if(superPositions[beforeFirst.x][beforeFirst.y] > superPositions[afterLast.x][afterLast.y])
			{
				shotIndex.x = beforeFirst.x;
				shotIndex.y = beforeFirst.y;
			}
			else
			{
				
				shotIndex.x = afterLast.x;
				shotIndex.y = afterLast.y;
			}
			// }
			// else
			// 	ai.shipWasShot = [];
		}
		
		// if(!ai.shotShips.includes({x: shotIndex.x, y: shotIndex.y}))
		ai.shotShips.push({x: shotIndex.x, y: shotIndex.y});
	}
	if(ai.shipWasShot.length === 0 || superPositions[shotIndex.x][shotIndex.y] === 0)
	{
		let indexes = getAllIndexes2D(superPositions, Math.max.apply(null,
			superPositions.map(row => Math.max.apply(null, row))));
		let t = indexes[getRandomInt(0, indexes.length)];
		shotIndex.x = t[0];
		shotIndex.y = t[1];
	}
	
	if(user.gameMap[shotIndex.x][shotIndex.y] !== 0)
	{
		ai.shipWasShot = [shotIndex.x, shotIndex.y];
		user.gameMap[shotIndex.x][shotIndex.y] = 2;
		ai.gameMap[shotIndex.x][shotIndex.y] = -3;
		userTable.children[shotIndex.x - 1].children[shotIndex.y - 1].innerHTML = SHIP_HITTED;
		
		if(ai.shotShips.length === 0)
			ai.shotShips.push({x: shotIndex.x, y: shotIndex.y});
	}
	else
	{
		ai.gameMap[shotIndex.x][shotIndex.y] = -2;
		userTable.children[shotIndex.x - 1].children[shotIndex.y - 1].innerHTML = SHIP_MISSED;
		user.gameMap[shotIndex.x][shotIndex.y] = 3;
		
		if(ai.shotShips.length > 1)
			ai.shotShips.pop();
		
		if(ai.shotShips.length === 1)
			ai.shotShipDirection = "";
		
		turnChange(bot.name);
	}
	if(ai.shotShips.length !== 0)
		checkShotShips(bot, ai, superPositions);
	
	// if(ai.shotShips.length !== 0)
	// 	console.log("End: ", ai.gameMap, ai.shipWasShot, ai.shotShipDirection, ai.shotShips);

	// if([0, 3].includes(bot.gameMap[shotIndex.x][shotIndex.y]) )//user.gameMap[shotIndex.x][shotIndex.y] !== 0)
	if(user.gameMap[shotIndex.x][shotIndex.y] === 2)//user.gameMap[shotIndex.x][shotIndex.y] !== 0)
	{
		user.destroyedShips += 1;
		if(user.destroyedShips === user.howManyShips)
			ifWonEndGame(user, bot);
		else if(IM_SPEED || REMOVE_WAITING)
			setTimeout(() => botShot(bot, user, ai), 200);
		else
			setTimeout(() => botShot(bot, user, ai), BOT_DELAY);
	}
}

function checkShotShips(bot, ai, superPositions)
{
	let longestShip = Math.max(...ai.shipsArray);
	if(ai.shotShips.length > longestShip)
		console.log("%cImpossible stanelo sie", "color: red;");
	else if(ai.shotShips.length < longestShip)
	{
		let xFirst = ai.shotShips.first().x,
			xLast = ai.shotShips.last().x,
			yFirst = ai.shotShips.first().y,
			yLast = ai.shotShips.last().y;
		if(ai.shotShips.length === 1)
		{
			for(let i = -1; i < 3; i += 2)
			{
				if(!checkPositionForShotShip(xFirst + i, yFirst, ai.gameMap, superPositions)
					|| !checkPositionForShotShip(xFirst, yFirst + i, ai.gameMap, superPositions))
					return;
			}
			// if(!checkPositionForShotShip(x - 1, y, ai.gameMap, superPositions)
			// 	|| !checkPositionForShotShip(x + 1, y, ai.gameMap, superPositions)
			// 	|| !checkPositionForShotShip(x, y - 1, ai.gameMap, superPositions)
			// 	|| !checkPositionForShotShip(x, y + 1, ai.gameMap, superPositions))
			// 	return;
		}
		else if(ai.shotShips.length < longestShip)
		{
			// console.log("%cship.length > 1", "color: lightgreen;");
			if(ai.shotShipDirection === "vertically")
			{
				ai.shotShips.sort((a, b) => a.x - b.x);
				if(!checkPositionForShotShip(xFirst - 1, yFirst, ai.gameMap, superPositions)
					|| !checkPositionForShotShip(xLast + 1, yLast, ai.gameMap, superPositions))
					return;
			}
			else if(ai.shotShipDirection === "horizontally")
			{
				ai.shotShips.sort((a, b) => a.y - b.y);
				if(!checkPositionForShotShip(xFirst, yFirst - 1, ai.gameMap, superPositions)
					|| !checkPositionForShotShip(xLast, yLast + 1, ai.gameMap, superPositions))
					return;
			}
		}
	}
	
	// console.log("%cimma destroy shotShips", "color: lightblue;");
	ai.shotShips.forEach(shotShip => {
		ai.gameMap[shotShip.x][shotShip.y] = -1;
	});
	
	removeElementFromArray(ai.shotShips.length, ai.shipsArray);
	ai.shipWasShot = [];
	ai.shotShips = [];
	ai.shotShipDirection = "";
}

function checkPositionForShotShip(x, y, gameMap, superPositions)
{
	if(superPositions[x][y] === 0 || gameMap[x][y] === -2)
		return true;
}

function calculateSuperpositionsArray(bot, ai)
{
	let gameMap = createGameMap();
	
	for(let ship of ai.shipsArray)
	{
		for(let i = 1; i <= MAP_SIZE; i++)
		{
			for(let j = 1; j <= MAP_SIZE; j++)
			{
				if(checkPositionForSuperShip(i, j, "horizontally", ship, ai))
					for(let k = j; k < j + ship; k++)
						if(gameMap[i][k] !== -3)
							gameMap[i][k] += 1;
				if(ship !== 1 && checkPositionForSuperShip(i, j, "vertically", ship, ai))
					for(let k = i; k < i + ship; k++)
						if(gameMap[k][j] !== -3)
							gameMap[k][j] += 1;
			}
		}
	}
	// console.table(gameMap)
	return gameMap;
}

function checkPositionForSuperShip(x, y, direction, ship, player)
{
	if(direction === "horizontally")
	{
		if(y + ship <= MAP_SIZE + 1 && checkPositionForShip(x, y, "horizontally", ship, player))
		{
			for(let k = y; k < y + ship; k++)
				if(player.gameMap[x][k] === -2)
					return false;
		}
		else
			return false;
	}
	else if(direction === "vertically")
	{
		if(x + ship <= MAP_SIZE + 1 && checkPositionForShip(x, y, "vertically", ship, player))
		{
			for(let k = x; k < x + ship; k++)
				if(player.gameMap[k][y] === -2)
					return false;
		}
		else
			return false;
	}
	
	return true;
}

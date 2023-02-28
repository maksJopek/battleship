function showUserShipPosition(givenTr, givenTrNumber, givenTd, givenTdNumber, player)
{
	// Preventing ability to place all ships on one td
	window.vars.wasShipPlaced = false;
	
	if(givenTr == null)
	{
		if(typeof window.vars.givenTr === "undefined")
			throw "window.vars.givenTr === undefined";
	}
	else
	{
		window.vars.givenTr = givenTr;
		window.vars.givenTd = givenTd;
		window.vars.givenTrNumber = givenTrNumber;
		window.vars.givenTdNumber = givenTdNumber;
	}
	
	let ship = window.vars.selectedShip.children.length;
	let newShip = ship;
	
	if(window.vars.selectedTd === undefined)
		window.vars.selectedTd = new Array(MAP_SIZE);
	
	clearUserShipPosition();
	
	let color;
	if(checkPositionForShip(givenTrNumber + 1, givenTdNumber + 1, window.vars.shipDirection, ship, player))
	{
		color = "bg-success";
		window.vars.isPlaceable = true;
		//givenTd.onclick = () => putShipOnGameMap(player, givenTdNumber + 1, givenTrNumber + 1, window.vars.shipDirection, ship, true);
	}
	else
	{
		color = "bg-danger";
		window.vars.isPlaceable = false;
	}
	
	if(window.vars.shipDirection === "vertically")
	{
		if(ship + givenTrNumber > MAP_SIZE)
			newShip = MAP_SIZE - givenTrNumber;
		
		for(let i = givenTrNumber - (ship - newShip); i < givenTrNumber + newShip; i++)
		{
			let td = givenTr.parentNode.children[i].children[givenTdNumber];
			window.vars.selectedTd[i] = [td, td.className];
			td.className = color;
		}
	}
	else if(window.vars.shipDirection === "horizontally")
	{
		if(ship + givenTdNumber > MAP_SIZE)
			newShip = MAP_SIZE - givenTdNumber;
		
		for(let i = givenTdNumber - (ship - newShip); i < givenTdNumber + newShip; i++)
		{
			window.vars.selectedTd[i] = [givenTr.children[i], givenTr.children[i].className];
			givenTr.children[i].className = color;
		}
	}
	// }
}

function clearUserShipPosition()
{
	//	Clear selection from table, used with onMouseLeave
	window.vars.selectedTd.forEach(oldTd => {
		if(oldTd !== undefined)
			oldTd[0].className = oldTd[1];
	});
}

function checkPositionForShip(x, y, direction, ship, player)
{
	// Changing x and y to match them with start of ship shown with onmouseenter
	[x, y] = correctXY(x, y, ship, direction);
	
	if(direction === "vertically")
	{
		for(let i = -1; i <= ship; i++)
			for(let j = -1; j < 2; j++)
				if(player.gameMap[x + i][y + j] === 1 || player.gameMap[x + i][y + j] === -1)
					return false;
	}
	else if(direction === "horizontally")
	{
		for(let i = -1; i <= ship; i++)
			for(let j = -1; j < 2; j++)
				if(player.gameMap[x + j][y + i] === 1 || player.gameMap[x + j][y + i] === -1)
					return false;
	}
	
	return true;
}


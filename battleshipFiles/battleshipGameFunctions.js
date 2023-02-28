function startGame(player, bot, ai)
{
	window.vars.whosTurn = "user";

	document.getElementById("button").style.display = "none";
	document.getElementById("whosTurn").style.display = "inline";
	document.getElementById("whosTurn").innerText = "Twoja tura";

	let userTable = document.getElementById("userTable");
	let botTable = document.getElementById("botTable");
	userTable.onclick = () => window.alert("To Twoja tabela -_- <script player.iq--; </script>");
	[...botTable.children].forEach((tr, trNumber) => {
		[...tr.children].forEach((td, tdNumber) => {
			td.onmouseenter = () => showUserShotPosition(td);
			// td.onmouseenter = showUserShotPosition;
			td.onmouseleave = () => hideUserShotPosition(td);
			// td.onmouseleave = hideUserShotPosition;
			td.onclick = () => userShot(td, bot, trNumber + 1, tdNumber + 1, player, ai);
		});
	});
}

// function showUserShotPosition()
// {
// 	this.innerHTML = "╳";
// }
const showUserShotPosition = td => td.innerHTML = "╳";

const hideUserShotPosition = td => td.innerHTML = "";

function userShot(td, bot, x, y, user, ai)
{
	if(window.vars.whosTurn === "bot")
	{
		window.alert("Tura sztucznej inteligencji");
		return;
	}
	if(bot.gameMap[x][y] !== 0)
	{
		bot.destroyedShips += 1;
		if(bot.destroyedShips === bot.howManyShips)
			console.log("here");
		bot.gameMap[x][y] = 2;
		td.innerHTML = SHIP_HITTED;

		// Coloring whole ship when it sunk
		// if(IM_SPEED)
		// 	checkForNearbyShips(x, y, bot);
		if(checkIfWholeShipWasShotStart(x, y, bot))
			destroyShip(bot, x, y);
		// destroyShip(td, bot, x, y);

		if(bot.destroyedShips === bot.howManyShips)
			console.log("here2");
		// bot.destroyedShips += 1;
		if(bot.destroyedShips === bot.howManyShips)
			ifWonEndGame(bot, user);
	}
	else
	{
		bot.gameMap[x][y] = 3;
		td.innerHTML = SHIP_MISSED;
		turnChange(user.name);
	}

	td.onclick = undefined;
	td.onmouseenter = undefined;
	td.onmouseleave = undefined;

	// if(IM_SPEED)
	// 	checkForNearbyShips(x, y, bot);

	// if(bot.gameMap[x][y] !== 0)
	// if([0, 3].includes(bot.gameMap[x][y]))
	if(bot.gameMap[x][y] === 3)
	{
		if(IM_SPEED || REMOVE_WAITING)
			botShot(bot, user, ai);
		else
			setTimeout(() => botShot(bot, user, ai), BOT_DELAY);
	}
	// if((!IM_SPEED || !REMOVE_WAITING) && bot.gameMap[x][y] === 0)
	// 	setTimeout(() => botShot(bot, user, ai), 1000);
	// else if(bot.gameMap[x][y] === 0)
	// 	botShot(bot, user, ai);
}

function checkForNearbyShips(x, y, player)
{
	if(player.gameMap[x][y] === 2)
		if(checkIfWholeShipWasShotStart(x, y, player))
			destroyShip(player, x, y);
		else
		{
			if(player.gameMap[x - 1][y] === 2)
				if(checkIfWholeShipWasShotStart(x - 1, y, player))
					destroyShip(player, x - 1, y);

			if(player.gameMap[x + 1][y] === 2)
				if(checkIfWholeShipWasShotStart(x + 1, y, player))
					destroyShip(player, x + 1, y);

			if(player.gameMap[x][y - 1] === 2)
				if(checkIfWholeShipWasShotStart(x, y - 1, player))
					destroyShip(player, x, y - 1);

			if(player.gameMap[x][y + 1] === 2)
				if(checkIfWholeShipWasShotStart(x, y + 1, player))
					destroyShip(player, x, y + 1);
		}
}

function destroyShip(bot, x, y)
{
	// let tdNumber = x - 1;
	// let trNumber = y - 1;
	// let td = document.getElementById(bot.name + "Table").children[tdNumber].children[tdNumber];
	// let direction = getShipDirection(x, y, bot);

	let ship = getShip(x, y, bot);
	for(let td of ship.table)
	{
		td.classList.remove(SHIP_BG_COLOR);
		td.classList.add("bg-danger");
	}
	// return ship.table.length;
}

function getShip(x, y, player)
{
	let direction = getShipDirection(x, y, player);
	let table = document.getElementById(player.name + "Table");
	let output = {};
	output.array = [];
	output.table = [];

	if(typeof direction !== "string")
	{
		output.array[0] = {
			'x': x,
			'y': y
		};
		output.table[0] = table.children[output.array[0].x - 1].children[output.array[0].y - 1];
	}
	else
	{
		let i, j;
		if(direction === "up" || direction === "down")
		{
			i = x;
			j = x;

			// while(player.gameMap[i + 1][y] !== 0)
			while(![0, 3].includes(player.gameMap[i + 1][y]))
				i++;
			// while(player.gameMap[j - 1][y] !== 0)
			while(![0, 3].includes(player.gameMap[j - 1][y]))
				j--;

			for(let k = 0; j <= i; j++, k++)
			{
				output.array[k] = {
					'x': j,
					'y': y
				};
				output.table[k] = table.children[output.array[k].x - 1].children[output.array[k].y - 1];
			}
		}
		else if(direction === "left" || direction === "right")
		{
			i = y;
			j = y;
			// while(player.gameMap[x][i + 1] !== 0)
			while(![0, 3].includes(player.gameMap[x][i + 1]))
				i++;
			// while(player.gameMap[x][j - 1] !== 0)
			while(![0, 3].includes(player.gameMap[x][j - 1]))
				j--;

			for(let k = 0; j <= i; j++, k++)
			{
				output.array[k] = {
					'x': x,
					'y': j
				};
				output.table[k] = table.children[output.array[k].x - 1].children[output.array[k].y - 1];
			}
		}
	}

	return output;
}

function getShipDirection(x, y, player)
{
	// if(player.gameMap[x - 1][y] !== 0 && player.gameMap[x + 1][y] !== 0)
	// 	return "vertical";
	//
	// else if(player.gameMap[x][y - 1] !== 0 && player.gameMap[x][y + 1] !== 0)
	//	return "horizontal";

	if(![0, 3].includes(player.gameMap[x - 1][y]))// !== 0)
		return "up";

	else if(![0, 3].includes(player.gameMap[x + 1][y]))// !== 0)
		return "down";

	else if(![0, 3].includes(player.gameMap[x][y - 1]))// !== 0)
		return "left";

	else if(![0, 3].includes(player.gameMap[x][y + 1]))// !== 0)
		return "right";

	else
		return true;
}

function checkIfWholeShipWasShotStart(x, y, bot)
{
	let direction = getShipDirection(x, y, bot);
	if(typeof direction === "string")
	{
		// window.vars.howLongIsShip = 1;
		if(direction === "up" || direction === "down")
		{
			// let output = true;
			// if(!checkIfWholeShipWasShot(x - 1, y, bot, "up", -1, 0))
			// 	output = false;
			// if(!checkIfWholeShipWasShot(x + 1, y, bot, "down", 1, 0))
			// 	output = false;
			// if(output || window.vars.howLongIsShip === Math.max(...bot.shipsArray))
				if((checkIfWholeShipWasShot(x - 1, y, bot, "up", -1, 0)
					&& checkIfWholeShipWasShot(x + 1, y, bot, "down", 1, 0)))
				// 	|| (window.vars.howLongIsShip === Math.max(...bot.shipsArray)))
			{
				removeElementFromArray(window.vars.howLongIsShip, bot.shipsArray);
				return true;
			}
			else
				return false;

		}
			// return (checkIfWholeShipWasShot(x - 1, y, bot, "up", -1, 0) &&
		// 	checkIfWholeShipWasShot(x + 1, y, bot, "down", 1, 0));
		else if(direction === "left" || direction === "right")
		{
			// let output = true;
			// if(!checkIfWholeShipWasShot(x, y - 1, bot, "left", 0, -1))
			// 	output = false;
			// if(!checkIfWholeShipWasShot(x, y + 1, bot, "right", 0, 1))
			// 	output = false;
			// if(output || window.vars.howLongIsShip === Math.max(...bot.shipsArray))
				if((checkIfWholeShipWasShot(x, y - 1, bot, "left", 0, -1)
					&& checkIfWholeShipWasShot(x, y + 1, bot, "right", 0, 1)))
				// 	|| window.vars.howLongIsShip === Math.max(...bot.shipsArray))
			{
				removeElementFromArray(window.vars.howLongIsShip, bot.shipsArray);
				return true;
			}
			else
				return false;
		}
		// return (checkIfWholeShipWasShot(x, y - 1, bot, "left", 0, -1) &&
		// 	checkIfWholeShipWasShot(x, y + 1, bot, "right", 0, 1));
	}
	// else
	// {
	// 	if(((bot.gameMap[x - 1][y] === 3 || x - 1 < 1)
	// 		&& (bot.gameMap[x + 1][y] === 3 || x + 1 > 10)
	// 		&& (bot.gameMap[x][y - 1] === 3 || y - 1 < 1)
	// 		&& (bot.gameMap[x][y + 1] === 3 || y + 1 > 10))
	// 		|| Math.max(...bot.shipsArray) === 1)
	// 	{
	// 		removeElementFromArray(1, bot.shipsArray);
	// 		console.log(bot.shipsArray);
	// 		return true;
	// 	}
	// 	else
	// 		return false;
	// }
	return direction;
}

function checkIfWholeShipWasShot(x, y, bot, direction, xShift, yShift)
{
	if(bot.gameMap[x][y] === 3 || bot.gameMap[x][y] === 0)// || x > 10 || x < 1 || y > 10 || y < 1)
		return true;
	else if(bot.gameMap[x][y] === 1)
		return false;
	else if(bot.gameMap[x][y] === 2)
	{
		// window.vars.howLongIsShip++;
		// console.log(window.vars.howLongIsShip);
		return checkIfWholeShipWasShot(x + xShift, y + yShift, bot, direction, xShift, yShift);
	}
	// else if(bot.gameMap[x][y] === 3)
	// 	return true;
}

function turnChange(from)
{
	let whosTurn = document.getElementById("whosTurn");
	if(from === "user")
	{
		whosTurn.innerHTML = "Tura sztucznej inteligencji";
		window.vars.whosTurn = "bot";
	}
	else if(from === "bot")
	{
		whosTurn.innerHTML = "Twoja tura";
		window.vars.whosTurn = "user";
	}
}

function ifWonEndGame(player, winner)
{
	let userTable = document.getElementById("userTable");
	let botTable = document.getElementById("botTable");
	let whosTurn = document.getElementById("whosTurn");
	userTable.onclick = undefined;
	[...botTable.children].forEach((tr, trNumber) => {
		[...tr.children].forEach((td, tdNumber) => {
			td.onmouseenter = undefined;
			td.onmouseleave = undefined;
			td.onclick = undefined;
		});
	});
	let ifContinue = true;
	if(player.name === "bot")
	{
		whosTurn.innerHTML = "Wygrałeś";
		window.alert("Gratulacje użytkowniku, udało Ci się pokonać naszą zaawansowaną sztuczną inteligencję, Twoje dane zostały do nas wysłane, mozłiwe że niedługo się z Tobą skontaktujemy ze względu na Twoją wybitną inteligencję");
		document.body.innerHTML = "";
		window.vars = undefined;
		startNewGame();
	}
	else
	{
		updateGameMap(winner);
		whosTurn.innerHTML = "Przegrałeś, HA HA HA";
		setTimeout(() => {
			if(player.name === "user")
				ifContinue = window.confirm("HA HA HA, przegrałeś, jeśli lubisz marnować czas i spróbować jeszcze raz kliknij OK");
			if(ifContinue)
			{
				document.body.innerHTML = "";
				window.vars = undefined;
				startNewGame();
			}
			else
			{
				document.body.innerHTML = "";
				window.vars = undefined;
				let div = document.body.appendChild(document.createElement("div"));
				div.classList.add("container");
				div.classList.add("text-center");
				let h1 = div.appendChild(document.createElement("h1"));
				h1.innerHTML = "<strong>Przegrałeś HA HA HA</strong>";
			}
		}, 5000);
	}
}

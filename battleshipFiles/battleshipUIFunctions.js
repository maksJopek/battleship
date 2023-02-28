function createUI(player, bot, ai)
{
	// Creating and appending container
	let containerFluid = document.createElement("div");
	containerFluid.className = "container-fluid";
	containerFluid.id = "container-fluid";
	document.body.appendChild(containerFluid);
	
	// Creating and appending row
	let row = document.createElement("div");
	row.className = "row";
	row.id = "row";
	row.style.marginTop = "10px";
	containerFluid.appendChild(row);
	
	// Creating and appending col-2 for ships to insert
	let colWithOptions = document.createElement("div");
	colWithOptions.className = "col-2";
	colWithOptions.id = "colWithOptions";
	row.appendChild(colWithOptions);
	
	// Creating and appending ul
	let ul = document.createElement("ul");
	ul.className = "ul";
	ul.id = "ul";
	colWithOptions.appendChild(ul);
	
	// Creating col-5 for user game map
	let colWithUserMap = document.createElement("div");
	colWithUserMap.className = "col-5";
	colWithUserMap.id = "colWithUserMap";
	row.appendChild(colWithUserMap);
	
	// Creating col-5 for bot game map
	let colWithBotMap = document.createElement("div");
	colWithBotMap.className = "col-5";
	colWithBotMap.id = "colWithBotMap";
	row.appendChild(colWithBotMap);
	
	// Creating second row for button
	let row2 = document.createElement("div");
	row2.className = "row";
	row2.id = "row2";
	row2.style.marginTop = "10px";
	containerFluid.appendChild(row2);
	
	// Creating col-12 for button
	let colWithButton = document.createElement("div");
	colWithButton.className = "col-12 text-center";
	colWithButton.id = "colWithButton";
	row2.appendChild(colWithButton);
	
	// Creating button that will start da game
	let button = document.createElement("button");
	button.type = "button";
	button.className = "btn btn-success btn-lg font-weight-bolder";
	button.id = "button";
	button.style.width = (TABLE_WIDTH / MAP_SIZE * 4).toString() + "vh";
	button.style.height = (TABLE_WIDTH / MAP_SIZE * 2).toString() + "vh";
	button.style.fontSize = (TABLE_WIDTH / MAP_SIZE / 2.1).toString() + "vh";
	button.style.display = "none";
	button.innerHTML = "Start <em>Da</em> Game";
	button.onclick = () => startGame(player, bot, ai);
	colWithButton.appendChild(button);
	
	// Creating whosTurn sign
	let whosTurn = document.createElement("h2");
	whosTurn.innerHTML = "Statek można zdjąć z planszy klikając na niego";
	whosTurn.style.display = "inline";
	whosTurn.id = "whosTurn";
	colWithButton.appendChild(whosTurn);
}

function generateGameMap(player)
{
	let col;
	if(player.name === "user")
		col = document.getElementById("colWithUserMap");
	else
		col = document.getElementById("colWithBotMap");
	
	let table = document.createElement("table");
	table.className = "table table-bordered table-sm";
	table.id = player.name === "user" ? "userTable" : "botTable";
	table.style.width = TABLE_WIDTH.toString() + "vh";
	table.style.height = TABLE_WIDTH.toString() + "vh";
	table.oncontextmenu = (e) => {e.preventDefault(); e.stopPropagation();};
	for(let i = 1; i <= MAP_SIZE; i++)
	{
		let tr = table.appendChild(document.createElement("tr"));
		for(let j = 1; j <= MAP_SIZE; j++)
		{
			let td = document.createElement("td");
			td.className = "text-center align-middle font-weight-bold";
			td.style.width = (TABLE_WIDTH / 10).toString() + "vh";
			td.style.height = (TABLE_WIDTH / 10).toString() + "vh";
			td.style.fontSize = (TABLE_WIDTH / 10 / 1.7).toString() + "vh";
			td.style.padding = '0';
			td.style.margin = '0';
			if(player.gameMap[i][j] !== 0 && (player.name === "user" || IM_SPEED))
				td.classList.add(SHIP_BG_COLOR);
			else
				td.classList.add(TABLE_BG_COLOR);
			tr.appendChild(td);
		}
	}
	
	col.appendChild(table);
}

function generateShipsUl(player)
{
	if(player.name !== "user")
		throw "Cannot generate ships ul for not user";
	
	let ul = document.getElementsByTagName("ul")[0];
	[...ul.children].forEach(li => li.remove());
	
	if(player.shipsArray.length === 0)
		return false;
	
	player.shipsArray.forEach((ship, index) =>
	{
		//	Generate table/gameMap
		let li = document.createElement("li");
		let table = document.createElement("table");
		
		table.className = "table table-bordered table-sm";
		table.style.height = (TABLE_WIDTH / MAP_SIZE).toString() + "vh";
		table.style.width = (TABLE_WIDTH / MAP_SIZE * ship).toString() + "vh";
		let tr = table.appendChild(document.createElement("tr"));
		
		for(let i = 0; i < ship; i++)
		{
			let td = tr.appendChild(document.createElement("td"));
			td.className = TABLE_BG_COLOR;
			td.addEventListener("mouseenter", () =>
			{
				if(![...window.vars.selectedShip.children].includes(td))
					for(let t of [...tr.children])
						t.className = "bg-light";
			});
			td.addEventListener("mouseleave", () =>
			{
				if(![...window.vars.selectedShip.children].includes(td))
					for(let t of [...tr.children])
						t.className = TABLE_BG_COLOR;
			});
		}
		li.appendChild(table);
		ul.appendChild(li);
		
		// Select first ship
		table.onclick = () => selectShip(tr); // to be able to change selected ship
		if(index === 0)
		{
			window.vars.selectedShip = tr;
			selectShip(tr);
		}
		//return false;
	});
}

function selectShip(tr)
{
	for(let td of [...window.vars.selectedShip.children])
		td.className = TABLE_BG_COLOR;
	
	for(let td of [...tr.children])
		td.className = SHIP_BG_COLOR;
	
	window.vars.selectedShip = tr;
}
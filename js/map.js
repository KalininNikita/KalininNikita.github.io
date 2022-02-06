
		const createRiver = (i, j) => {
			arr[n * i + j] = {type : 1, r : 0, g: 0, b : 255}
			let length = Rand(50, 110)
			while (length-- > 0){
				if (Rand(0, 4) < 3){
					i = (n + i + 1) % n 
				}
				else {
					j = (m + j - 1) % m
				}
				if (arr[n * i + j].type == 0){
					arr[n * i + j] = {type : 1, r : 0, g: 0, b : 255}					
				}
				else {
					length = 0
				}
			}
		}
		
		const fillRiver = (i, j, distance, riverCells) => {
			let dx = 2*distance + 1
			let cnt = 0
			for (let x = (n + i - distance) % n; dx > 0; x = (x + 1) % n, dx-- )
			{
				let dy = 2*distance + 1
				for (let y = (m + j - distance) % m; dy > 0; y = (y + 1) % m, dy-- ){
					if (arr[n * x + y].type == 1){
						cnt++
					}
				}
			}
			if (cnt >= riverCells){
				arr[n * i + j] = {type : 1, r : 0, g: 0, b : 255}
			}	
		}

		const fillWater = (i, j, distance) => {
			let dx = 2*distance + 1
			let cnt = 0
			for (let x = (n + i - distance) % n; dx > 0; x = (x + 1) % n, dx-- )
			{
				let dy = 2*distance + 1
				for (let y = (m + j - distance) % m; dy > 0; y = (y + 1) % m, dy-- ){
					if (arr[n * x + y].type == 1){
						cnt++
					}
				}
			}
			arr[n * i + j].water = Math.min(255, 4*cnt)
		}

		function create()
		{
			for (let i = 0; i < n; i++){
				for (let j = 0; j < m; j++){
					arr[n * i + j] = {type : 0, r : 0, g: 0, b : 0, water : 0, soilFertility : 20}
				}
			}

			for (let i = 0; i < n; i++){
				for (let j = 0; j < m; j++){
					if (Rand(0, 1750) < 1) {
						createRiver(i, j)
					}
				}
			}
			for (let i = 0; i < n; i++){
				for (let j = 0; j < m; j++){
					if (arr[n * i + j].type == 0) {
						fillRiver(i, j, 3, 16)
					}
				}
			}

			for (let i = 0; i < n; i++){
				for (let j = 0; j < m; j++){
					if (arr[n * i + j].type == 0) {
						fillWater(i, j, 15)
					}
				}
			}

			for (let i = 0; i < n * m; i++){
					if (arr[i].type == 0 && Rand(0, 400) < 1) {
						let green = Rand(64, 193).toFixed(0) - 0
						let red = Rand(0, 65).toFixed(0) - 0
                        let energyMax = Rand(256, 513).toFixed(0) - 0 
						let energy = 150
						let age = 0
						let distance = 1
						let children = 1
						let fertility = 8
                        let locationSearch = 0
						let active = true
                        let soilEfficiency = Rand(8, 16).toFixed(0) - 0 
						arr[i].g = green 
						arr[i].r = red 
						arr[i].plant = {green, red, age, energy, energyMax, distance, children, fertility, soilEfficiency, active, locationSearch} 
					}
			}

			draw(arr);
		}

        
		function getColor(c)
		{
			let r, g, b;
			r = parseInt('0x' + c[1] + c[2], 16);
			g = parseInt('0x' + c[3] + c[4], 16);
			b = parseInt('0x' + c[5] + c[6], 16);
			return [r, g, b];
		}

		function line(context, x1, y1, x2, y2, width, color)
		{
			context.beginPath(); 
			context.lineWidth = width;
			context.strokeStyle = color;

          	context.moveTo(x1, y1);
          	context.lineTo(x2, y2);

			context.stroke();
		}

		function rect(context, x1, y1, x2, y2, color)
		{
			context.beginPath(); 
			context.fillStyle  = color;
			context.fillRect(x1, y1, x2, y2);
			context.stroke();
		}

		const getType = (name) => {
			let radios = document.getElementsByName(name);
			for (let i = 0, length = radios.length; i < length; i++) {
				if (radios[i].checked) {
					return i
				}
			}
			return -1;
		}

        function drawing()
		{
			let canvas = document.getElementById("draw"), 
            context = canvas.getContext("2d");
			let type = getType('radio');
            for (let i = 0; i < n; i++){
				for (let j = 0; j < m; j++){
					let cellArr = arr[n * i + j]
					let col = `rgb(${cellArr.r}, ${cellArr.g}, ${cellArr.b})`;
					if (type == 1) col = `rgb(0, 0, ${cellArr.water})`;

                    if (type == 2 && cellArr.type == 0) col = `rgb(0, ${cellArr.soilFertility}, 0)`;

					if (cellArr.plant) {
						let plant = cellArr.plant
						if (type == 3) col = `rgb(${2*plant.age}, 255, ${2*plant.age})`;
					}
					if (drawing){
						rect(context, i*cell, j*cell,(i+1)*cell, (j+1)*cell, col)
					}
				}
			}
		}

		function draw(arr, drawing = true)
		{
			let canvas = document.getElementById("draw"), 
            context = canvas.getContext("2d");
			let type = getType('radio');
			let cnt = 0;
			let green = 0;
			let red = 0
			let distance = 0
            let distanceSearch = 0
			let children = 0 
			let fertility = 0
            let locationSearch = 0
			let energy = 0 
            let energyMax = 0
            let soilEfficiency = 0
			let age = 0
			years.fill(0)
            for (let i = 0; i < n; i++){
				for (let j = 0; j < m; j++){
					let cellArr = arr[n * i + j]
					let col = `rgb(${cellArr.r}, ${cellArr.g}, ${cellArr.b})`;
					if (type == 1) col = `rgb(0, 0, ${cellArr.water})`;

                    if (type == 2 && cellArr.type == 0) col = `rgb(0, ${cellArr.soilFertility}, 0)`;

					if (cellArr.g > 0) {
						let plant = cellArr.plant
						cnt++
						green += plant.green
						red += plant.red
						distance += plant.distance
                        distanceSearch += plant.locationSearch * plant.distance
						children += plant.children
						fertility += plant.fertility
                        locationSearch += plant.locationSearch
						energy +=  plant.energy 
                        energyMax += plant.energyMax
                        soilEfficiency += plant.soilEfficiency
						age += plant.age
						years[plant.age]++
						
						if (type == 3) col = `rgb(${2*plant.age}, 255, ${2*plant.age})`;
					}
					if (drawing){
						rect(context, i*cell, j*cell,(i+1)*cell, (j+1)*cell, col)
					}
				}
			}

			cntPlants[year] = cnt
            locationSearchPlants[year] = locationSearch

			greenPlants[year] = green / cnt
			redPlants[year] = red / cnt
			distancePlants[year] = distance / cnt
            distanceSearchPlants[year] = distanceSearch / locationSearch
			childrenPlants[year] = children / cnt
			fertilityPlants[year] = fertility / cnt
			energyPlants[year] = energy / cnt
			energyPlantsMax[year] = energyMax / cnt
            soilEfficiencyPlants[year] = soilEfficiency / cnt
			agePlants[year] = age / cnt
            
            year++

            printValues()
		}

        const printValues = () => {
            let data = document.getElementById('data')
            let str = ''

            str += `<div>sunPhase ${sunPhase.toFixed(1)}</div> `
            str += `<div>rainPhase ${rainPhase}</div>` 
            str += `<div>cnt ${cntPlants[year-1]}</div>` 
            str += `<div>year ${year}</div>` 

            if (cntPlants[year-1] == 0) str += `<div>Ну вот и всё</div>` 

            data.innerHTML = str
        }

		const createRiver = async (i, j) => {
			arr[n * i + j] = {type : 1, r : 0, g: 0, b : 255}
			let length = Rand(50, 110)
            let moveX = Rand(0, 2) < 1 ? -1 : 1;
            let moveY = Rand(0, 2) < 1 ? -1 : 1;

			while (length-- > 0){
				if (Rand(0, 4) < 3){
					i = (n + i + moveX) % n 
				}
				else { 
					j = (m + j - moveY) % m
				}
				if (arr[n * i + j].type == 0){
					arr[n * i + j] = {type : 1, r : 0, g: 0, b : 255}					
				}
				else {
					length = 0
				}
			}
		}
		
		const fillRiver = async (i, j, distance, riverCells) => {
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

		const fillWater = async (i, j, distance) => {
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
			arr[n * i + j].water = Math.min(255, 2*cnt)
			arr[n * i + j].waterMin = arr[n * i + j].water
		}

		function create()
		{
			arr = []
			for (let i = 0; i < n; i++){
				for (let j = 0; j < m; j++){
					arr[n * i + j] = {type : 0, r : 0, g: 0, b : 0, water : 0, soilFertility : 20}
				}
			}

            let randRiver = Rand(-cntRiver/3, cntRiver/3)
            for (let cnt = 0; cnt < cntRiver + randRiver; cnt++){
                let i = RandInt(0, n);
                let j = RandInt(0, m);
                createRiver(i, j)
            }

			for (let k = 1; k <= 2; k++){
				for (let i = 0; i < n; i++){
					for (let j = 0; j < m / k; j++){
						if (arr[n * i + j].type == 0) {
							fillRiver(i, j, 3, 16)
						}
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
						let green = RandInt(64, 193)
						let red = RandInt(0, 65)
                        let energyMax = RandInt(256, 513) 
						let energy = energyBegin 
						let age = 0
						let distance = 1
						let children = 1
						let fertility = 8
                        let locationSearch = 0
                        let soilEfficiency = RandInt(8, 16) 
                        let parasitism = 0; 
                        let protection = RandInt(0, 33)
                        let attack = RandInt(0, 33)
						let multicellular = 0; 
						let symbiosis = 0; 
						let uniqueColor = {r : RandInt(0, 256), g : RandInt(0, 256), b : RandInt(0, 256), }
						let cells = 1
						arr[i].g = green 
						arr[i].r = red 
						arr[i].active = true
						arr[i].plant = {green, red, age, energy, energyMax, distance, children, fertility, 
							soilEfficiency, locationSearch, 
							protection, parasitism, attack,
							multicellular, symbiosis, uniqueColor, cells, } 
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

		async function rect(context, x1, y1, x2, y2, color)
		{
			context.fillStyle  = color;
			context.fillRect(x1, y1, x2, y2);
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
						if (type == 0) col = `rgb(${plant.red}, ${plant.parasitism ^ 1 * plant.green}, ${plant.parasitism * plant.attack})`;
						if (type == 3) col = `rgb(${2*plant.age}, 255, ${2*plant.age})`;
						if (type == 4) col = `rgb(${plant.energy/2}, ${plant.energy/2}, 0)`;
						if (type == 5) col = `rgb(${plant.parasitism * plant.attack}, 0, ${plant.protection})`;
						if (type == 6) col = `rgb(${8*plant.soilEfficiency}, 0, 0)`;
						if (type == 7) col = `rgb(${plant.uniqueColor.r}, ${plant.uniqueColor.g}, ${plant.uniqueColor.b})`;
						if (type == 8) col = `rgb(${plant.multicellular * 255}, 255, 0)`;
						if (type == 9) col = `rgb(${plant.symbiosis * 255}, 255, 0)`;
					}else {
                        if ((type == 7 || type == 5) && cellArr.type == 1) col = `rgb(0,0,0)`;    
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
            let attack = 0
            let protection = 0
			let distance = 0
            let distanceSearch = 0
			let children = 0 
			let fertility = 0
            let locationSearch = 0
			let energy = 0 
            let energyMax = 0
            let soilEfficiency = 0
			let age = 0
            let parasitism = 0
			let multicellularity = 0
			let symbiosis = 0
			years.fill(0)

            for (let i = 0; i < n; i++){
				for (let j = 0; j < m; j++){
					let cellArr = arr[n * i + j]
					let col = `rgb(${cellArr.r}, ${cellArr.g}, ${cellArr.b})`;
					if (type == 1) col = `rgb(0, 0, ${cellArr.water})`;

                    if (type == 2 && cellArr.type == 0) col = `rgb(0, ${cellArr.soilFertility}, 0)`;

					if (cellArr.plant) {
						let plant = cellArr.plant
						let cells = plant.cells
						cnt++
                        parasitism += plant.parasitism
						multicellularity += plant.multicellular
						symbiosis += plant.symbiosis
						green += plant.green
						red += plant.red
                        attack += plant.parasitism * plant.attack
                        protection += plant.protection
						distance += plant.distance
                        distanceSearch += plant.locationSearch * plant.distance
						children += plant.children
						fertility += plant.fertility
                        locationSearch += plant.locationSearch
						energy +=  plant.energy / cells
                        energyMax += plant.energyMax
                        soilEfficiency += plant.soilEfficiency
						age += plant.age
						years[plant.age]++
					
						if (type == 0) col = `rgb(${plant.red}, ${plant.parasitism ^ 1 * plant.green}, ${plant.parasitism * plant.attack})`;
						if (type == 3) col = `rgb(${2*plant.age}, 255, ${2*plant.age})`;
						if (type == 4) col = `rgb(${plant.energy/2}, ${plant.energy/2}, 0)`;
						if (type == 5) col = `rgb(${plant.parasitism * plant.attack}, 0, ${plant.protection})`;
						if (type == 6) col = `rgb(${8*plant.soilEfficiency}, 0, 0)`;
						if (type == 7) col = `rgb(${plant.uniqueColor.r}, ${plant.uniqueColor.g}, ${plant.uniqueColor.b})`;
						if (type == 8) col = `rgb(${plant.multicellular * 255}, 255, 0)`;
						if (type == 9) col = `rgb(${plant.symbiosis * 255}, 255, 0)`;
					}else {
                        if ((type == 7 || type == 5) && cellArr.type == 1) col = `rgb(0,0,0)`;    
                    }

					if (drawing){
						rect(context, i*cell, j*cell,(i+1)*cell, (j+1)*cell, col)
					}
				}
			}

			cntPlants[year] = cnt
            locationSearchPlants[year] = locationSearch
            parasites[year] = parasitism
			symbionts[year] = symbiosis
			multicellular[year] = multicellularity
			greenPlants[year] = green / cnt
			redPlants[year] = red / cnt
            attackPlants[year] = attack / parasitism
            protectionPlants[year] = protection / cnt
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
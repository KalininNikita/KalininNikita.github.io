
		const smoothing = (i, j, arr, distance) => {
			let dx =  2 * distance + 1
            let x = 0;
            let y = 0;     
			let sum = 0;       
			for (let x = (n + i - distance) % n; dx > 0; x = (x + 1) % n, dx-- ) {
				let dy = 2 * distance + 1
				for (let y = (m + j - distance) % m; dy > 0; y = (y + 1) % m, dy-- ) {
                	let index = n * x + y
					sum += arr[index]
                }
			}
			return sum
		}

		const createCells = (n, m, d, value, p) => {
			if (d < 1) d = 1
			let cntWidth = Math.floor(n / d)
			let cntHeight = Math.floor(m / d)
			let arr = []
			for (let i = 0; i < cntWidth; i++){
				for (let j = 0; j < cntHeight; j++){
					arr[i * cntWidth + j] = Rand(0, 1/p) < 1 ? value : 0
				}
			}
			return arr;
		}

		const minHeight = (i, j, rivers, heights) => {
			let min = 1000; 
			let minX = -1; 
			let minY = -1;

			let x = (n + i - 1) % n
			let y = j
			let index = n * x + y
			if (rivers[index] == 0 && heights[index] < min){
				min = heights[index]
				minX = x
				minY = y
			}
			x = (n + i + 1) % n
			index = n * x + y
			if (rivers[index] == 0 && heights[index] < min){
				min = heights[index]
				minX = x
				minY = y
			}
			x = i
			y = (m + j + 1) % m
			index = n * x + y
			if (rivers[index] == 0 && heights[index] < min){
				min = heights[index]
				minX = x
				minY = y
			}
			y = (m + j - 1) % m
			index = n * x + y
			if (rivers[index] == 0 && heights[index] < min){
				min = heights[index]
				minX = x
				minY = y
			}

			return {x : minX, y : minY}
		}

const randHeight = (i, j, rivers, heights) => {
	let min = 1000;

	let x = (n + i - 1) % n
	let y = j
	if (Rand(0, 4) < 1)	return {x , y }

	x = (n + i + 1) % n
	if (Rand(0, 4) < 1)	return {x , y }

	x = i
	y = (m + j + 1) % m
	if (Rand(0, 4) < 1)	return {x , y }

	y = (m + j - 1) % m
	return {x , y }
}

		const createRiverHeight = (i, j, rivers, heights) => {
			rivers[ n * i + j] = 1
			let end = false
			let currentX = i
			let currentY = j
			while (!end) {
				let {x, y} = minHeight(currentX, currentY, rivers, heights)
				if (x == -1) return 1

                let index = n * x + y
				if (heights[index] < 0){
					end = true
				} else {
					rivers[index] = 1
					currentX = x
					currentY = y
				}
			}
			return 0
		}

		const createHeights = (n, m, d) => {
			let d128 = Math.floor(d / 2)
			let d64 = Math.floor(d / 4)
			let d32 = Math.floor(d / 8)
			let d16 = Math.floor(d / 16)
			let d4 = Math.floor(d / 16)

			let height256 = createCells(n, m, d, 256, 1/4)
			let height255 = createCells(n, m, d, 255, 1/4)
			let height128 = createCells(n, m, d128, 128, 1/2)
			let height64 = createCells(n, m, d64, 64, 1/2)
			let height32 = createCells(n, m, d32, 32, 1/2)
			let height16 = createCells(n, m, d16, 16, 1/2)
			let height4 = createCells(n, m, d4, 4, 1/2)

			let cnt256 = Math.floor(n / d)
			let cnt128 = Math.floor(n / d128)
			let cnt64 = Math.floor(n / d64)
			let cnt32 = Math.floor(n / d32)
			let cnt16 = Math.floor(n / d16)
			let cnt4 = Math.floor(n / d4)

			let arr = []
			for (let i = 0; i < n; i++){	
				for (let j = 0; j < m; j++){
					let index256 = cnt256 * Math.floor(i / d) + Math.floor(j / d)
					index256 = index256 >= height256.length ? height256.length - 1 : index256
					let index255 = cnt256 * Math.floor(i / d) + Math.floor(j / d)
					index255 = index255 >= height255.length ? height255.length - 1 : index255
					let index128 = cnt128 * Math.floor(i / d128) + Math.floor(j / d128)
					index128 = index128 >= height128.length ? height128.length - 1 : index128
					let index64 = cnt64 * Math.floor(i / d64) + Math.floor(j / d64)
					index64 = index64 >= height64.length ? height64.length - 1 : index64
					let index32 = cnt64 * Math.floor(i / d32) + Math.floor(j / d32)
					index32 = index32 >= height32.length ? height32.length - 1 : index32
					let index16 = cnt64 * Math.floor(i / d16) + Math.floor(j / d16)
					index16 = index16 >= height16.length ? height16.length - 1 : index16
					let index4 = cnt64 * Math.floor(i / d4) + Math.floor(j / d4)
					index4 = index4 >= height4.length ? height4.length - 1 : index4

					arr[i * n + j] = -256
						+ height256[index256]
						+ height255[index255]
						+ height128[index128]
						+ height64[index64]
						+ height32[index32]
						+ height16[index16]
						+ height4[index4]
				}
			}

			let smoothingArr = []
			for (let i = 0; i < n; i++){	
				for (let j = 0; j < m; j++){
					smoothingArr[i * n + j] = Math.floor(smoothing(i, j, arr, 6) / 169)
				}
			}
			let rivers = []
			let heights = []
			for (let i = 0; i < n; i++){	
				for (let j = 0; j < m; j++){
					heights[i * n + j] = Math.floor(smoothing(i, j, smoothingArr, 4) / 81)
					rivers[i * n + j] = 0
				}
			}
			/*
			for (let i = 0; i < n; i++){	
				for (let j = 0; j < m; j++){
					if (heights[i * n + j] > 200 && Rand(0, 100) < 1){
						createRiverHeight(i, j, rivers, heights)
					}
				}
			}*/

			return {heights, rivers}
		}

		const drawHeights = (arr) => {
			let canvas = document.getElementById("draw"), 
            context = canvas.getContext("2d", { alpha: false });

            for (let i = 0; i < n; i++) {
				for (let j = 0; j < m; j++) {
					let cellArr = arr[n * i + j]
					//let col = cellArr > 0 ? `rgb(${Math.floor(cellArr/4)}, ${Math.floor(255 - 2 * cellArr / 3)}, 0)` : `rgb(0, 0, ${256 + cellArr})`;
					let col =  cellArr.height > 0 ? `rgb(${Math.floor(cellArr.height/4)}, ${Math.floor(255 - 2 * cellArr.height / 3)}, 0)` : `rgb(0, 0, ${256 + cellArr.height})`;
					
					rect(context, i*cell, j*cell,(i+1)*cell, (j+1)*cell, col)
				}
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
			arr[n * i + j].water = Math.min(255, 1*cnt)
			arr[n * i + j].waterMin = arr[n * i + j].water
		}

		function create()
		{
			arr = []
			let obj = createHeights(n, m, 16)
			arr = obj.heights.map(x => ({height : x, type : x <= 0 ? 1 : 0, r : 0, g: 0, b : x <= 0 ? 255 : 0, 
				water : 0, soilFertility : 20, soilFertilityMax : Math.max(255 - x, 0) }) )

			for (let i = 0; i < n; i++){
				for (let j = 0; j < m; j++){
					fillWater(i, j, 10)
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
						let takesEnergy = RandInt(0, 33)
						let protectsEnergy = RandInt(0, 33)
						let multicellular = 0; 
						let symbiosis = 0; 
						let uniqueColor = {r : RandInt(0, 256), g : RandInt(0, 256), b : RandInt(0, 256), }
						let cells = 1
						arr[i].g = green 
						arr[i].r = red 
						arr[i].active = true
						arr[i].plant = {green, red, age, energy, energyMax, distance, children, fertility, 
							soilEfficiency, locationSearch, 
							protection, parasitism, attack, takesEnergy, protectsEnergy, 
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
            context = canvas.getContext("2d", { alpha: false });
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
						
						if (type == 11) col = `rgb(${8 * plant.parasitism * plant.takesEnergy}, 0, ${8 * plant.protectsEnergy})`;
					}else {
                        if ((type == 7 || type == 5 || type == 11) && cellArr.type == 1) col = `rgb(0,0,0)`;    
                    }
					if (type == 10) col =  cellArr.height > 0 ? `rgb(${Math.floor(cellArr.height/4)}, ${Math.floor(255 - 2 * cellArr.height / 3)}, 0)` : `rgb(0, 0, ${256 + cellArr.height})`;
					
					if (drawing){
						rect(context, i*cell, j*cell, (i+1)*cell, (j+1)*cell, col)
					}
				}
			}
		}

		function draw(arr, drawing = true)
		{
			let canvas = document.getElementById("draw"), 
            context = canvas.getContext("2d", { alpha: false });
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

						if (type == 11) col = `rgb(${8 * plant.parasitism * plant.takesEnergy}, 0, ${8 * plant.protectsEnergy})`;
					}else {
                        if ((type == 7 || type == 5 || type == 11) && cellArr.type == 1) col = `rgb(0,0,0)`;    
                    }

					if (type == 10) col =  cellArr.height > 0 ? `rgb(${Math.floor(cellArr.height/4)}, ${Math.floor(255 - 2 * cellArr.height / 3)}, 0)` : `rgb(0, 0, ${256 + cellArr.height})`;
					
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
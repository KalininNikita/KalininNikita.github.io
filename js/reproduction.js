
		const mutation = (num, size, probability = mutationProbability) => {
			let bin = (num).toString(2)
			bin = '0'.repeat( size - bin.length) + bin
			let str = []
			for (let i = 0; i < size; i++){
				str[i] = Rand(0, 1/probability) < 1 ? Math.abs(bin[i] - 1) : bin[i]
			}
			return parseInt(str.reduce((s, v) => s + v, ''), 2)
		} 

		const interbreeding = (mom, dad, size) => {
			let bin = (mom).toString(2)
			bin = '0'.repeat( size - bin.length) + bin
			let str = []
			for (let i = 0; i < size/2; i++){
				str[i] = bin[i]
			}
			bin = (dad).toString(2)
			bin = '0'.repeat( size - bin.length) + bin
			for (let i = Math.ceil(size/2); i < size; i++){
				str[i] = bin[i]
			}
			return parseInt(str.reduce((s, v) => s + v, ''), 2)
		}

		const reproduction = async (i, j, plant, type = 0) => {
			let distance = plant.distance
			let dx = plant.locationSearch * 2 * distance + 1
            let x = 0;
            let y = 0;
			for (let x = (n + i - distance) % n; dx > 0; x = (x + 1) % n, dx-- )
			{
				let dy = plant.locationSearch * 2 * distance + 1
				for (let y = (m + j - distance) % m; dy > 0; y = (y + 1) % m, dy-- )
			    {
                    if (plant.locationSearch == 0){
                        let randX = Rand(-distance, distance + 1).toFixed(0) - 0
                        let randY = Rand(-distance, distance + 1).toFixed(0) - 0
                        x = ( n + i + randX ) % n
                        y = ( m + j + randY ) % m
                    }
                    let index = n * x + y

                    if (arr[index].type == 0) {
                        if (!arr[index].plant){
                            arr[index].plant = {...plant}
                            let green = arr[index].plant.green
                            arr[index].plant.green = mutation(green, 8)
                            arr[index].plant.red = mutation(arr[index].plant.red, 8)
                            arr[index].plant.distance = mutation(distance, 5, 1/20)
                            arr[index].plant.children = mutation(plant.children, 5, 1/100)
                            arr[index].plant.fertility = mutation(plant.fertility, 4, 1/100)
                            arr[index].plant.locationSearch = mutation(plant.locationSearch, 1, 1/500)
                            arr[index].plant.soilEfficiency = mutation(plant.soilEfficiency, 5, 1/200)
                            arr[index].plant.energyMax = mutation(plant.energyMax, 14, 1/200)
                            arr[index].plant.energy = 150
                            arr[index].plant.age = 0		
                            arr[index].plant.active = false	
                            
                            arr[index].r = arr[index].plant.red
                            arr[index].g = arr[index].plant.green
                            arr[index].b = 0
                            
                            return 0
                        }
                        else {
                            if (type == 0){
                                let newPlant = {...plant}
                                newPlant.green = interbreeding(plant.green, arr[index].plant.green, 8)
                                newPlant.red = interbreeding(plant.red, arr[index].plant.red, 8)
                                newPlant.distance = interbreeding(distance, arr[index].plant.distance, 5)
                                newPlant.children = interbreeding(plant.children, arr[index].plant.children, 5)
                                newPlant.fertility = interbreeding(plant.fertility, arr[index].plant.fertility, 4)
                                newPlant.soilEfficiency = interbreeding(plant.soilEfficiency, arr[index].plant.soilEfficiency, 5)
                                newPlant.energyMax = interbreeding(plant.energyMax, arr[index].plant.energyMax, 14)
                                reproduction(x, y, newPlant, 1)
                                
                                return 2
                            }	
                        }
				    }
                }
			}
			return 1
		}	
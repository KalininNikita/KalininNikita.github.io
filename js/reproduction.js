
		const mutation = async (num, size, probability = mutationProbability) => {
			let bin = (num).toString(2)
			bin = '0'.repeat( size - bin.length) + bin
			let str = []
			for (let i = 0; i < size; i++){
				str[i] = Rand(0, 1/probability) < 1 ? Math.abs(bin[i] - 1) : bin[i]
			}
			return parseInt(str.reduce((s, v) => s + v, ''), 2)
		} 
 
		const interbreeding = async (mom, dad, size) => {
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

        const allMutations = async (plant) => {
            mutation(plant.green, 8).then( x => plant.green = x)
            mutation(plant.red, 8).then( x => plant.red = x)
            mutation(plant.distance, 5, 1/20).then( x => plant.distance = x)
            mutation(plant.children, 5, 1/100).then( x => plant.children = x)
            mutation(plant.fertility, 4, 1/100).then( x => plant.fertility = x)
            mutation(plant.locationSearch, 1, 1/500).then( x => plant.locationSearch = x)
            mutation(plant.soilEfficiency, 5, 1/200).then( x => plant.soilEfficiency = x)
            mutation(plant.energyMax, 14, 1/200).then( x => plant.energyMax = x)
            mutation(plant.parasitism, 1, 1/500).then( x => plant.parasitism = x)
            mutation(plant.protection, 8, 1/100).then( x => plant.protection = x)
            mutation(plant.attack, 7, 1/100).then( x => plant.attack = x)
        }

        const allInterbreeding = async (newPlant, mom, dad) => {
            newPlant.green = interbreeding(mom.green, dad.green, 8)
            newPlant.red = interbreeding(mom.red, dad.red, 8)
            newPlant.distance = interbreeding(mom.distance, dad.distance, 5)
            newPlant.children = interbreeding(mom.children, dad.children, 5)
            newPlant.fertility = interbreeding(mom.fertility, dad.fertility, 4)
            newPlant.soilEfficiency = interbreeding(mom.soilEfficiency, dad.soilEfficiency, 5)
            newPlant.energyMax = interbreeding(mom.energyMax, dad.energyMax, 14) 
            newPlant.protection = interbreeding(mom.protection, dad.protection, 8)
            newPlant.attack = interbreeding(mom.attack, dad.attack, 8)
        }

        const setColorPlant = async (cell) => { 
            if (cell.plant.parasitism == 0){     
                cell.r = cell.plant.red
                cell.g = cell.plant.green
                cell.b = 0
            } else {
                cell.r = cell.plant.red
                cell.g = 0
                cell.b = cell.plant.attack
            }
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
                            
                            allMutations(arr[index].plant)
                            
                            arr[index].plant.energy = energyBegin 
                            arr[index].plant.age = 0		
                            arr[index].plant.active = false	

                            setColorPlant(arr[index]) 

                            return 0
                        }
                        else {
                            if (arr[index].plant &&  plant.parasitism == 1){
                                if (arr[index].plant.protection >= plant.attack) return 4;

                                let newPlant = {...plant}
                                allMutations(newPlant).then( () => {
                                    //newPlant.energy = arr[index].plant.energy * (newPlant.attack - arr[index].plant.protection) / newPlant.attack;
                                    newPlant.energy = arr[index].plant.energy * 0.1;
                                    newPlant.age = 0
                                    newPlant.active = false	
                                    
                                    arr[index].plant = newPlant
                                    setColorPlant(arr[index])
                                })

                                return 3
                            }else{
                            if (type == 0){
                                let newPlant = {...plant}
                                allInterbreeding(newPlant, plant, arr[index].plant).then(() => reproduction(x, y, newPlant, 1)) 
                                
                                return 2
                                }	
                            }
                        }
				    }
                }
			}
			return 1
		}	
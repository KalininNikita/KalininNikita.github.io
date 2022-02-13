
		const mutation = async (num, size, probability = mutationProbability) => {
			let s = 0;
            let n = 0;
			for (let i = size - 1; i >= 0; i--){
                n = num >> i & 1
				s = 2 * s + (Rand(0, 1/probability) < 1 ? n ^ 1 : n & 1)
			}
			return s
		} 

        const testMutation = async (num, size, cnt, mutation) => {
            let begin = new Date() 
            const go = (num, size, cnt) => { 
                for (let i = 0; i < cnt; i++) {
                    mutation(num, size)
                }
                return 0
            }
            go(num, size, cnt)

            return new Date() - begin; 
        }
 
		const interbreeding = async (mom, dad, size) => {
            let l = size >> 1;
            let r = 32 - l;
			return (mom >> l << l) | (dad << r >>> r) 
		}

        const testInterbreeding = async (mom, dad, size, cnt, fun) => {
            let begin = new Date() 
            const go = () => { 
                for (let i = 0; i < cnt; i++) {
                    fun(mom, dad, size)
                }
                return 0
            }
            go()

            return new Date() - begin; 
        }

        const allMutations = async (plant) => {
            mutation(plant.green, 8).then( x => plant.green = x)
            mutation(plant.red, 8).then( x => plant.red = x)
            mutation(plant.distance, 5, 1/20).then( x => plant.distance = x)
            mutation(plant.children, 5, 1/100).then( x => plant.children = x)
            mutation(plant.fertility, 4, 1/100).then( x => plant.fertility = x)
            mutation(plant.locationSearch, 1, 1/200).then( x => plant.locationSearch = x)
            mutation(plant.soilEfficiency, 6, 1/200).then( x => plant.soilEfficiency = x)
            mutation(plant.energyMax, 14, 1/200).then( x => plant.energyMax = x)
            mutation(plant.parasitism, 1, 1/300).then( x => plant.parasitism = x)
            mutation(plant.protection, 8, 1/100).then( x => plant.protection = x)
            mutation(plant.takesEnergy, 6, 1/100).then( x => plant.takesEnergy = x)
            mutation(plant.protectsEnergy, 6, 1/100).then( x => plant.protectsEnergy = x)
            mutation(plant.attack, 8, 1/100).then( x => plant.attack = x)
            mutation(plant.symbiosis, 1, 1/10).then( x => plant.symbiosis = x)

            if (plant.multicellular == 0) mutation(plant.multicellular, 1, 1/100).then( x => plant.multicellular = x) 
        }

        const allInterbreeding = async (newPlant, mom, dad) => {
            interbreeding(mom.green, dad.green, 8).then(x => newPlant.green = x)
            interbreeding(mom.red, dad.red, 8).then(x => newPlant.red = x)
            interbreeding(mom.distance, dad.distance, 5).then(x => newPlant.distance = x)
            interbreeding(mom.children, dad.children, 5).then(x => newPlant.children = x)
            interbreeding(mom.fertility, dad.fertility, 4).then(x => newPlant.fertility = x)
            interbreeding(mom.soilEfficiency, dad.soilEfficiency, 6).then(x => newPlant.soilEfficiency = x)
            interbreeding(mom.energyMax, dad.energyMax, 14).then(x => newPlant.energyMax = x)
            interbreeding(mom.protection, dad.protection, 8).then(x => newPlant.protection = x)
            interbreeding(mom.attack, dad.attack, 8).then(x => newPlant.attack = x)
            interbreeding(mom.takesEnergy, dad.takesEnergy, 6).then(x => newPlant.takesEnergy = x)
            interbreeding(mom.protectsEnergy, dad.protectsEnergy, 6).then(x => newPlant.protectsEnergy = x)
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

		const reproduction = async (i, j, arrPlant, type = 0) => {
            let plant = arrPlant[0]
			let distance = plant.distance + 1
			let dx = plant.locationSearch * 2 * distance + 1
            
			for (let x = (n + i - distance) % n; dx > 0; x = (x + 1) % n, dx-- )
			{
				let dy = plant.locationSearch * 2 * distance + 1
				for (let y = (m + j - distance) % m; dy > 0; y = (y + 1) % m, dy-- )
			    {
                    if (plant.locationSearch == 0){
                        let randX = RandInt(-distance, distance + 1)
                        let randY = RandInt(-distance, distance + 1)
                        x = ( n + i + randX ) % n
                        y = ( m + j + randY ) % m
                    }
                    let index = n * x + y

                    if (arr[index].type == 0) {
                        if (!arr[index].plant){
                            if (plant.multicellular == 0) {
                                arr[index].plant = {...plant}
                                arr[index].plant.energy = energyBegin 
                                arr[index].plant.age = 0
                                arr[index].plant.uniqueColor = {r : RandInt(0, 256), g : RandInt(0, 256), b : RandInt(0, 256), }
                            } else {
                                arr[index].plant = arr[i * n + j].plant  
                                arr[index].plant.cells++
                            }

                            await allMutations(arr[index].plant)

                            arr[index].active = false	
                            setColorPlant(arr[index]) 

                            return 0
                        }
                        else {
                            if (arr[index].plant == plant && plant.multicellular == 0) return 5

                            if (arr[index].plant &&  plant.parasitism == 1){
                                if (arr[index].plant.protection >= plant.attack && plant.locationSearch == 0) return 4;
                                
                                if (arr[index].plant.protection < plant.attack){
                                    let newPlant = arr[i * n + j].plant 
                                    if (plant.multicellular == 0) newPlant = {...plant}

                                    await allMutations(newPlant).then( async  () => {
                                        let energy = arr[index].plant.energy / arr[index].plant.cells * (newPlant.attack - arr[index].plant.protection) / (1 + newPlant.attack)
                                        //newPlant.energy = arr[index].plant.energy * 0.1;
                                        newPlant.energy = plant.multicellular == 1 ? newPlant.energy + energy : energy;
                                        if (plant.multicellular == 0) newPlant.age = 0
                                        
                                        arr[index].active = false	

                                        arr[index].plant.energy /= arr[index].plant.cells
                                        arr[index].plant.cells--

                                        arr[index].plant = newPlant
                                        if (plant.multicellular == 1) newPlant.cells++
                                       
                                        setColorPlant(arr[index])
                                    })
                                    return 3
                                }
                            }else{
                            if (type == 0 && plant.multicellular == 0){
                                let newPlant = {...plant} 
                                await allInterbreeding(newPlant, plant, arr[index].plant).then( async () => await reproduction(x, y, [newPlant], 1)) 
                                
                                return 2
                                }	
                            }
                        }
				    }
                }
			}
			return 1
		}	
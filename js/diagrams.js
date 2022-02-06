
		let charts = {
            allChart: null,
			cntChart : null,
        	greenChart : null,
        	distanceChart : null,
        	childrenChart : null,
			energyChart : null,
			ageChart : null,
			years : null,
    	}

		const drawChart = () => {
            let datasets = [ 
                {data: cntPlants.map(x => x/100), label: 'Количество', borderColor : '#000000' }, 
                {data: greenPlants, label: 'Цвет', borderColor : '#00aa00' }, 
                {data: redPlants, label: 'Цвет', borderColor : '#aa0000' },
                {data: distancePlants, label: 'Дистанция размножения', borderColor : ['#0000aa'] },
                {data: childrenPlants, label: 'Количество потомков', borderColor : ['#00aaaa'] }, 
                {data: fertilityPlants, label: 'Шанс размножения', borderColor : ['#00aa00'] }, 
                {data: energyPlants, label: 'Энергия', borderColor : ['#00aaaa'] },
                {data: energyPlantsMax, label: 'Лимит энергии', borderColor : ['#aaaa00'] },
                {data: agePlants, label: 'Средний возраст', borderColor : ['#00ffff'] }
            ]
			let labels = Array.from({ length: greenPlants.length }, (v, k) => k)
			
			if (datasets[0]) { fillChart('allChart', labels, datasets, 'allChart') }

			datasets = [{data: cntPlants, label: 'Всего', borderColor : '#000000' }, 
            {data: locationSearchPlants, label: 'С поиском места', borderColor : '#0000ff' }, 
            {data: parasites, label: 'Паразиты', borderColor : '#ff00ff' }, ]

			if (datasets[0]) { fillChart('cntChart', labels, datasets, 'cntChart') }

			datasets = [{data: greenPlants, label: 'Средний цвет', borderColor : '#00aa00' }, 
            {data: redPlants, label: 'Средний цвет', borderColor : '#aa0000' }, 
            {data: attackPlants, label: 'Атака', borderColor : '#ff00ff' }, 
            {data: protectionPlants, label: 'Защита', borderColor : '#0000ff' },]

			if (datasets[0]) { fillChart('greenChart', labels, datasets, 'greenChart', ) }

			datasets = [{data: childrenPlants, label: 'Количество потомков', borderColor : ['#00aaaa'] }, 
                {data: fertilityPlants, label: 'Шанс размножения', borderColor : ['#00aa00'] }, 
                {data: soilEfficiencyPlants, label: 'Эффективность использования почвы', borderColor : ['#aaaa00'] }, 
                {data: distancePlants, label: 'Средняя дистанция', borderColor : ['#0000aa'] },
                {data: distanceSearchPlants, label: 'Средняя дистанция', borderColor : ['#aa0000'] },                
			]
			
			if (datasets[0]) { fillChart('childrenChart', labels, datasets, 'childrenChart', ) }
			
			datasets = [{
				data: energyPlants,
				label: 'Среднее количество энергии',
				borderColor : ['#00aaaa'] }, 
                {data: energyPlantsMax, label: 'Среднее количество максимума энергии', borderColor : ['#aaaa00'] },]

			if (datasets[0]) { fillChart('energyChart', labels, datasets, 'energyChart', ) }
			
			datasets = [{
				data: agePlants,
				label: 'Средний возраст',
				borderColor : ['#00ffff'] }]

			if (datasets[0]) { fillChart('ageChart', labels, datasets, 'ageChart', ) }

			datasets = [{
				data: years,
				label: 'Возрастная пирамида',
				borderColor : '#0000ff',  
                backroundColor : '#0000ff'
            }]

			labels = Array.from({ length: years.length }, (v, k) => k)
			if (datasets[0]) { fillChart('years', labels, datasets, 'years', 'bar') }
		}
		

const fillChart = async (chart, labels, datasets, name, typeChart = 'line') => {
    if (charts[chart] === null)
        charts[chart] = DiagramArray(labels, datasets, name, typeChart);
    else{
        charts[chart].data.labels = labels
        charts[chart].data.datasets = datasets
        charts[chart].update()
    }
}

//Готовим диаграмму
function DiagramArray (labels, datasets, canvas, type = 'line', fill=false) {
    let ctx = document.getElementById(canvas);
    
    let myChart = null;
    if (ctx){    
        myChart = new Chart (ctx, {
        type: type,
        data: {
            labels,
            datasets
        },
        options: {
            responsive: false, //Вписывать в размер canvas
            scales: {/*
                xAxes: [{
                display: true
                }],
                yAxes: [{
                display: true,
                }]*/
            },
            plugins: {
                zoom: {
                zoom: {
                wheel: {
                enabled: true,
                },
                pinch: {
                enabled: true
                },
                mode: 'xy',
                }
                }
            }
        }
    });
    }
    return myChart
}
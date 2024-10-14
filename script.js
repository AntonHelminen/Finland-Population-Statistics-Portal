// Tracking constants
let selected_municipality = "SSS"; // Default: whole country
let selected_municipality_name = "the whole country of Finland";
let selected_graph_type = 1 // Default: Population

let chart = null; // Chart initialization
let map = null; // map initialization
let geo_data = null; // Geo data initialization, this is used for map drawing. Contains data for all municipalitites but not for the whole country.
let all_data = null; // All data initialization, this is used for charts. Contains also data for the whole country

const button_1 = document.getElementById('population-chart-button');
const button_2 = document.getElementById('birth-death-chart-button');
const dl_button = document.getElementById('save-image');

button_1.addEventListener('click', async()=> {
    selected_graph_type = 1
    makeMap(geo_data); // Update map
    makeChart(all_data); // Update chart
})

button_2.addEventListener('click', async()=> {
    selected_graph_type = 2
    makeMap(geo_data); // Update map
    makeChart(all_data); // Update chart
})

dl_button.addEventListener('click', function() {
    exportMap();
})
// Event listener to refresh data at page refresh
document.addEventListener('DOMContentLoaded', async()=> {

    await refreshData();
    
    makeMap(geo_data); // Initialize map
    makeChart(all_data); // Initialize chart
})


/* Triggered on clicking a municipality or unclicking it. This function always reads and combines the data*/
async function refreshData() {
    // Get geographic data
    const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
    const response = await fetch(url);
    const geomap_data = await response.json();

    [geo_data, all_data] = await combineData(geomap_data)
}


// Initialize map
const initMap = (data) => {
    let map = L.map('map', {
        minZoom: -3
    })

    let geoJson = L.geoJSON(data, {
        onEachFeature: getFeature,
        style: getStyle
    }).addTo(map)

    let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap"
    }).addTo(map);

    let google = L.tileLayer("https://{s}.google.com/vt/lyrs=f@221097413,traffic&x={x}&y={y}&z={z}", {
        maxZoom: 0,
        minZoom: 0,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map)

    let baseMaps = {
        "OpenStreetMap": osm,
        "Google Maps": google
    }

    let overlayMaps = {
        "Europe": geoJson
    }

    let layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

    map.fitBounds(geoJson.getBounds())

}

const getFeature = (feature, layer) => {
    if (!feature.properties.name) return;
    const name = feature.properties.name;
    const positive_migration = feature.properties.migration.positive_change;
    const negative_migration = feature.properties.migration.negative_change;
    layer.bindPopup(
        `<ul>
            <li>Positive migration: ${positive_migration}</li>
            <li>Negative migration: ${negative_migration}</li>
        </ul>`
    )
    layer.bindTooltip(name)

    // When clicking on municipalities the graphs are updated with the current selections

    layer.on('click', function () {
        if (selected_municipality != name) {
            selected_municipality = name;
        } else {
            selected_municipality = "SSS";
            selected_municipality_name = "Whole Country";
        }
        
        console.log('Clicked on ' + selected_municipality);
    })
}

const getStyle = (feature) => {
    const positive_migration = feature.properties.migration.positive_change;
    const negative_migration = feature.properties.migration.negative_change;
    
    hue = Math.pow((positive_migration/negative_migration), 3) * 60;
    if (hue >= 120) {
        hue = 120;
    }
    return {
        color: `hsl(${hue}, 75%, 50%)`,
        fillOpacity: 0.5
    }
}


async function getData(url, code) {
    const jsonQuery = {
        "query": [
                {
                "code": "Vuosi",
                "selection": { 
                    "filter": "item",
                    "values": ["2000", "2001", "2002", "2003", "2004", "2005",
                               "2006", "2007", "2008", "2009", "2010", "2011",
                               "2012", "2013", "2014", "2015", "2016", "2017",
                               "2018", "2019", "2020", "2021", "2022", "2023"]
                            }
                },
                {
                "code": "Alue",
                "selection": {
                    "filter": "item",
                    "values": ["SSS",
                        "KU020",
                        "KU005",
                        "KU009",
                        "KU010",
                        "KU016",
                        "KU018",
                        "KU019",
                        "KU035",
                        "KU043",
                        "KU046",
                        "KU047",
                        "KU049",
                        "KU050",
                        "KU051",
                        "KU052",
                        "KU060",
                        "KU061",
                        "KU062",
                        "KU065",
                        "KU069",
                        "KU071",
                        "KU072",
                        "KU074",
                        "KU075",
                        "KU076",
                        "KU077",
                        "KU078",
                        "KU079",
                        "KU081",
                        "KU082",
                        "KU086",
                        "KU111",
                        "KU090",
                        "KU091",
                        "KU097",
                        "KU098",
                        "KU102",
                        "KU103",
                        "KU105",
                        "KU106",
                        "KU108",
                        "KU109",
                        "KU139",
                        "KU140",
                        "KU142",
                        "KU143",
                        "KU145",
                        "KU146",
                        "KU153",
                        "KU148",
                        "KU149",
                        "KU151",
                        "KU152",
                        "KU165",
                        "KU167",
                        "KU169",
                        "KU170",
                        "KU171",
                        "KU172",
                        "KU176",
                        "KU177",
                        "KU178",
                        "KU179",
                        "KU181",
                        "KU182",
                        "KU186",
                        "KU202",
                        "KU204",
                        "KU205",
                        "KU208",
                        "KU211",
                        "KU213",
                        "KU214",
                        "KU216",
                        "KU217",
                        "KU218",
                        "KU224",
                        "KU226",
                        "KU230",
                        "KU231",
                        "KU232",
                        "KU233",
                        "KU235",
                        "KU236",
                        "KU239",
                        "KU240",
                        "KU320",
                        "KU241",
                        "KU322",
                        "KU244",
                        "KU245",
                        "KU249",
                        "KU250",
                        "KU256",
                        "KU257",
                        "KU260",
                        "KU261",
                        "KU263",
                        "KU265",
                        "KU271",
                        "KU272",
                        "KU273",
                        "KU275",
                        "KU276",
                        "KU280",
                        "KU284",
                        "KU285",
                        "KU286",
                        "KU287",
                        "KU288",
                        "KU290",
                        "KU291",
                        "KU295",
                        "KU297",
                        "KU300",
                        "KU301",
                        "KU304",
                        "KU305",
                        "KU312",
                        "KU316",
                        "KU317",
                        "KU318",
                        "KU398",
                        "KU399",
                        "KU400",
                        "KU407",
                        "KU402",
                        "KU403",
                        "KU405",
                        "KU408",
                        "KU410",
                        "KU416",
                        "KU417",
                        "KU418",
                        "KU420",
                        "KU421",
                        "KU422",
                        "KU423",
                        "KU425",
                        "KU426",
                        "KU444",
                        "KU430",
                        "KU433",
                        "KU434",
                        "KU435",
                        "KU436",
                        "KU438",
                        "KU440",
                        "KU441",
                        "KU475",
                        "KU478",
                        "KU480",
                        "KU481",
                        "KU483",
                        "KU484",
                        "KU489",
                        "KU491",
                        "KU494",
                        "KU495",
                        "KU498",
                        "KU499",
                        "KU500",
                        "KU503",
                        "KU504",
                        "KU505",
                        "KU508",
                        "KU507",
                        "KU529",
                        "KU531",
                        "KU535",
                        "KU536",
                        "KU538",
                        "KU541",
                        "KU543",
                        "KU545",
                        "KU560",
                        "KU561",
                        "KU562",
                        "KU563",
                        "KU564",
                        "KU309",
                        "KU576",
                        "KU577",
                        "KU578",
                        "KU445",
                        "KU580",
                        "KU581",
                        "KU599",
                        "KU583",
                        "KU854",
                        "KU584",
                        "KU588",
                        "KU592",
                        "KU593",
                        "KU595",
                        "KU598",
                        "KU601",
                        "KU604",
                        "KU607",
                        "KU608",
                        "KU609",
                        "KU611",
                        "KU638",
                        "KU614",
                        "KU615",
                        "KU616",
                        "KU619",
                        "KU620",
                        "KU623",
                        "KU624",
                        "KU625",
                        "KU626",
                        "KU630",
                        "KU631",
                        "KU635",
                        "KU636",
                        "KU678",
                        "KU710",
                        "KU680",
                        "KU681",
                        "KU683",
                        "KU684",
                        "KU686",
                        "KU687",
                        "KU689",
                        "KU691",
                        "KU694",
                        "KU697",
                        "KU698",
                        "KU700",
                        "KU702",
                        "KU704",
                        "KU707",
                        "KU729",
                        "KU732",
                        "KU734",
                        "KU736",
                        "KU790",
                        "KU738",
                        "KU739",
                        "KU740",
                        "KU742",
                        "KU743",
                        "KU746",
                        "KU747",
                        "KU748",
                        "KU791",
                        "KU749",
                        "KU751",
                        "KU753",
                        "KU755",
                        "KU758",
                        "KU759",
                        "KU761",
                        "KU762",
                        "KU765",
                        "KU766",
                        "KU768",
                        "KU771",
                        "KU777",
                        "KU778",
                        "KU781",
                        "KU783",
                        "KU831",
                        "KU832",
                        "KU833",
                        "KU834",
                        "KU837",
                        "KU844",
                        "KU845",
                        "KU846",
                        "KU848",
                        "KU849",
                        "KU850",
                        "KU851",
                        "KU853",
                        "KU857",
                        "KU858",
                        "KU859",
                        "KU886",
                        "KU887",
                        "KU889",
                        "KU890",
                        "KU892",
                        "KU893",
                        "KU895",
                        "KU785",
                        "KU905",
                        "KU908",
                        "KU092",
                        "KU915",
                        "KU918",
                        "KU921",
                        "KU922",
                        "KU924",
                        "KU925",
                        "KU927",
                        "KU931",
                        "KU934",
                        "KU935",
                        "KU936",
                        "KU941",
                        "KU946",
                        "KU976",
                        "KU977",
                        "KU980",
                        "KU981",
                        "KU989",
                        "KU992"]
                            }
                },
                {
                "code": "Tiedot",
                "selection": {
                    "filter": "item",
                    "values": [code]
                            }
                }
                ],
                "response": {
                    "format": "json-stat2"}
    }
    const response = await fetch(url, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(jsonQuery)
    })
    if(!response.ok) {
        return;
    }
    const data = await response.json();

    return data;
}

// Combines and returns data gained with calls of getData()
async function combineData(geo_data) {
    const population_url = "https://pxdata.stat.fi:443/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
    const birth_death_url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";

    const pop_data = await getData(population_url, "vaesto");
    const birth_data = await getData(birth_death_url, "vm01");
    const death_data = await getData(birth_death_url, "vm11");

    const municipalities = Object.values(pop_data.dimension.Alue.category.label);
    const municipality_idx = Object.values(pop_data.dimension.Alue.category.index);
    const years = Object.values(pop_data.dimension.Vuosi.category.label);
    const year_idx = Object.values(pop_data.dimension.Vuosi.category.index);

    const pop_values = pop_data.value;
    const birth_values = birth_data.value;
    const death_values = death_data.value;

    // Loop through keys and return the data as a combined data object
    const combined_data = {};
    
    Object.keys(pop_data.dimension.Alue.category.label).forEach((municipality_key, key_idx)=> {
        const municipality_data = {};
        
        year_idx.forEach((year, y_idx) => {

            const pops = pop_values[municipalities.length*y_idx + key_idx]
            const births = birth_values[municipalities.length*y_idx + key_idx]
            const deaths = death_values[municipalities.length*y_idx + key_idx]
            
            municipality_data[year] = {
                population: pops,
                births: births,
                deaths: deaths
            }
        })
        combined_data[municipality_key] = {
            data: municipality_data
        }
    })

    // Save migration data to correct municipalities in the geo data
    geo_data.features.forEach((feature) => {
        feature.properties.combined_data = combined_data["KU" + feature.properties.kunta];
    });
    return [geo_data, combined_data];

}

// Initialize map
function makeMap(geo_data) {

    if (map) {
        map.remove();
    }
    map = L.map('map', {
        minZoom: 5.4,  // Set the minimum zoom level
        maxZoom: 10, // Set the maximum zoom level
        attributionControl: false,  // Optionally hide the attribution
        zoomControl: true  // Keep the zoom control visible
    });

    let geoJson = L.geoJSON(geo_data, {
        onEachFeature: getFeature2,
        style: getStyle2
    }).addTo(map)

    map.fitBounds(geoJson.getBounds())

}

const getFeature2 = (feature, layer) => {
    if (!feature.properties.name) return;
    const name = feature.properties.name;
    const code = ("KU" + feature.properties.kunta)

    layer.bindPopup(
        `<ul>
            <li>Positive migration: ${2}</li>
            <li>Negative migration: ${3}</li>
        </ul>`
    )
    layer.bindTooltip(name)

    // When clicking on municipalities the graphs are updated with the current selections

    layer.on('click', function () {
        if (selected_municipality != code) {
            selected_municipality = code;
            selected_municipality_name = name;
        } else {
            selected_municipality = "SSS";
            selected_municipality_name = "the whole country of Finland";
        }
        
        console.log('Clicked on ' + selected_municipality);
        makeMap(geo_data)
        makeChart(all_data)
    })
}

const getStyle2 = (feature) => {

    // Show selected municipality as slightly black
    const code = ("KU" + feature.properties.kunta)
 
    if (selected_graph_type == 1) {
        const population = feature.properties.combined_data.data["23"].population; // For now just 2023 population
        console.log(population)
            
        hue = population/200;
        if (hue >= 120) {
            hue = 120;
        }

        if (code == selected_municipality) {
            return {
                color: `hsl(${hue}, 75%, 50%)`,
                fillOpacity: 0.6,
                weight: 3,
                fillColor: `hsl(${hue}, 75%, 50%)`
            }

        } else {
            return {
                color: `white`,
                fillOpacity: 0.3,
                weight: 1,
                fillColor: `hsl(${hue}, 75%, 50%)`
            }
        }

    } else if (selected_graph_type == 2) {
        const births = feature.properties.combined_data.data["23"].births; // For now just 2023 births
        const deaths = feature.properties.combined_data.data["23"].deaths; // For now just 2023 deaths
        
        const birthrate = births-deaths
    
        if (birthrate < 0) {
            color_string = '#363636'; // Set hue to 0 (black) for negative birth rates
        } else {
            color_string =  '#63d0ff'// Scale positive birth rates to green hue (max 120)
        }
    
        if (code == selected_municipality) {
            return {
                color: 'black',
                fillOpacity: 0.6,
                weight: 3,
                fillColor: color_string
            };
    
        } else {
            return {
                color: `white`,
                fillOpacity: 0.3,
                weight: 1,
                fillColor: color_string
            };
        }
    }
}

// Make/refresh chart based on selected graph type and municipality.
async function makeChart(all_data) {
    if (!all_data) return;
    if (chart) {
        chart = null; // Reset chart if necessary
    }
    if (selected_graph_type == 1) {
        const municipality_data = all_data[selected_municipality].data;

        const labels = []
        const pop_values = []

        Object.keys(municipality_data).forEach((year) => {
            
            const population = municipality_data[year].population; // Access population data
            
            labels.push(2000 + parseInt(year))
            pop_values.push(population)
        });
        
        const chartData = {
            labels:labels,
            datasets: [
                {
                    name: "Population",
                    values: pop_values
                }
            ]
        }

        if (chart) {
            chart.data = chartData;
            chart.update();
        } else {
        chart = new frappe.Chart("#chart", {
            title: "Population of " + selected_municipality_name,
            data: chartData,
            type: "line",
            height: 450,
        
            lineOptions: {
                hideDots: 0,
                regionFill: 1
            }
            })
        }
    }
    else if (selected_graph_type == 2) {
        const municipality_data = all_data[selected_municipality].data;

        const labels = []
        const birth_values = []
        const death_values = []

        Object.keys(municipality_data).forEach((year) => {

            const births = municipality_data[year].births; // Access births
            const deaths = municipality_data[year].deaths; // Access deaths

            labels.push(2000 + parseInt(year))
            birth_values.push(births)
            death_values.push(deaths)
        });
        
        const chartData = {
            labels:labels,
            datasets: [
                {
                    name: "Births",
                    values: birth_values
                },
                {
                    name: "Deaths",
                    values: death_values
                }
            ]
        }

        if (chart) {
            chart.data = chartData;
            chart.update();
        } else {
            chart = new frappe.Chart("#chart", {
                title: "Births and Deaths of " +  selected_municipality_name,
                data: chartData,
                type: "bar",
                height: 450,
                colors: ['#63d0ff', '#363636'],
                
                lineOptions: {
                    hideDots: 0,
                    regionFill: 1
                }
            })
        }
    }
    
}

// This function came from ChatGPT
function exportMap() {
    // Use Leaflet.image to take a snapshot of the map
    html2canvas(document.querySelector("#chart")).then(canvas => {
        // Create an image from the canvas
        const imgData = canvas.toDataURL("image/png");
        
        // Create a link element to trigger download
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'graph.png';
        link.click(); // Trigger the download
    });
}


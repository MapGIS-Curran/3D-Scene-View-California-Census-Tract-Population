require(["esri/Map","esri/views/SceneView","esri/Camera","esri/layers/FeatureLayer","esri/renderers/SimpleRenderer","esri/symbols/PolygonSymbol3D","esri/symbols/ExtrudeSymbol3DLayer","esri/widgets/Legend"], function(Map,SceneView,Camera,FeatureLayer,SimpleRenderer,PolygonSymbol3D,ExtrudeSymbol3DLayer,Legend)
{
  var map = new Map({
    basemap: "dark-gray"
  });

  var template = {
    title: "California Census Tract Population",
    content: "Total Population: {TOTPOP_CY}<br/>FIPS Code: {FIPS}<br/>Square Miles: {SQMI} <br/>County: {COUNTY}",
	fieldInfos: [{
      fieldName: "TOTPOP_CY",
      format: {
        digitSeparator: true, 
        places: 0}
    },
    {
      fieldName: "FIPS"
	},
	{
      fieldName: "SQMI",
      format: {
      digitSeparator: true,
      places: 1}
    }]
  };

  var defaultSym = new PolygonSymbol3D({
    symbolLayers: [
      new ExtrudeSymbol3DLayer({
        material: {
          color: [111, 111, 111, 0.5]
        }
      })
    ]
  });

  var renderer = new SimpleRenderer({
    symbol: defaultSym,
    label: "Census Tracts",
    visualVariables: [
      {
        type: "color",
        field: "TOTPOP_CY",
        legendOptions: {
          title: "Population By Color"
        },
        stops: [
          {
            value: 100,
            color: "#eff3ff",
            label: "0 - 100"
          },
          {
            value: 1000,
            color: "#bdd7e7",
            label: "101 - 1,000"
          },
		  {
            value: 5000,
            color: "#6baed6",
            label: "1,001 - 5,000"
          },
		  {
            value: 10000,
            color: "#3182bd",
            label: "5,001 - 10,000"
          },
          {
            value: 40000,
            color: "#08519c",
            label: "10,001 - 40,000"
          }
        ]
      },
      {
        type: "size",
        field: "TOTPOP_CY",
        legendOptions: {
          title: "Population By Height"
        },
        minSize: 0,
        minDataValue: 1,
        maxSize: 40000,
        maxDataValue: 40000
      }
    ]
  });

  var popLyr = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Enriched_Census_Tracts_2016_2021/FeatureServer/0",
	renderer: renderer,
    outFields: ["*"],
    definitionExpression: "STATE = 'CA'",
	popupTemplate: template,
  });
  map.add(popLyr);

  view = new SceneView({
    container: "viewDiv",
    map: map,
    camera: new Camera({
      position: [-118, 27, 700000],
      heading: 360,
      tilt: 50
    })
  });

  var legend = new Legend({
    view: view,
    layerInfos: [
      {
        layer: popLyr,
        title: "California Census Tract Population: 2016"
      }
    ]
  });
  view.ui.add(legend, "bottom-left");
});

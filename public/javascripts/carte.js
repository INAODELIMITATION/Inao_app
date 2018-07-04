function go() {

    var styleMultipolygon = [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'yellow',
            width: 1
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 0, 0.4)'
        })
    })];

    var styleMultipolygonred = [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 1
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255, 0, 0,0.4 )'
        })
    })];



    function simpleStyle(feature) {
        if(parseInt(feature.get("insee")) < 20000 ){
            return styleMultipolygon;
            // to hide new ol.style.Style({})
           
        }
        else{
            return styleMultipolygonred;
        }
      }


    var scaleLineControl = new ol.control.ScaleLine();
    scaleLineControl.setUnits("metric");
    var extent = [-357823.2365, 6037008.6939, 1313632.3628, 7230727.3772];
    var projection = new ol.proj.Projection({
        code: 'EPSG:2154',
        extent: [-357823.2365, 6037008.6939, 1313632.3628, 7230727.3772],
        units: 'm',
        axisOrientation: 'neu'
    }); // definition du EPSG 2154
    ol.proj.addProjection(projection); //inclusion du EPSG dans openlayer
    var proj2154 = ol.proj.get('EPSG:2154'); //recupération de la projection
    proj2154.setExtent(extent);
    var projectionExtent = proj2154.getExtent(); //recupération de l'étendu de la projection 

    var variable = 21;
    var resolutions = new Array(variable);


    var matrixIds = new Array(variable);

    //alert(proj2154.getExtent());

    var maxResolution = ol.extent.getWidth(projectionExtent) / 256; //recupérationd des résolutions
    //var maxResolution = 104579.224549894;
    //alert(maxResolution);

    for (var i = 0; i < variable; ++i) {
        matrixIds[i] = 'EPSG:2154:' + i;
        resolutions[i] = (maxResolution) / Math.pow(2, i);
        //alert(resolutions[i]);

    }

    var tileGrid = new ol.tilegrid.WMTS({
        origin: ol.extent.getTopLeft(projectionExtent),
        // origin:[-378300, 7235610],
        resolutions: resolutions,
        matrixIds: matrixIds,

    });

    var languedoc_source = new ol.source.WMTS({
        url: 'http://127.0.0.1:8080/geoserver/gwc/service/wmts?REQUEST=getcapabilities',
        layer: 'test:languedoc',
        matrixSet: 'EPSG:2154',
        format: 'image/png',
        projection: proj2154,
        tileGrid: tileGrid,
        style: 'polygon',
        wrapX: true,
        bgcolor: '0x80BDE3'

    });

    var lang = new ol.layer.Tile({
        opacity: 0.7,
        source: languedoc_source,


    });


    //zone de test

    var coucheIGN = new ol.layer.Tile({
        source: new ol.source.GeoportalWMTS({
            projection: "EPSG:2154",
            layer: "CADASTRALPARCELS.PARCELS",
            //layer: "GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.ROUTIER.L93",
            style: "normal",

        }),

        opacity: 0.8
    });

   

    var map = new ol.Map({
        
        target: 'map',

        layers: [coucheIGN],
        view: new ol.View({

            projection: proj2154,
            //projection: "EPSG:3857",
            center: [690294.769471, 6206792.476654], //coord en 2154
            //center: [320729.77, 5305952.76], //coordonnées en 3857   
            zoom: 5
        })
    });
    //map.addLayer(lang); //ajout du layer languedoc à la carte
    var sourceL = new ol.source.VectorTile({
       
        tilePixelRatio: 1,
        format: new ol.format.MVT(),
        tileGrid: ol.tilegrid.createXYZ({
            extent: [-357823.2365, 6037008.6939, 1313632.3628, 7230727.3772],
            resolutions: resolutions,
           origin: ol.extent.getTopLeft(projectionExtent),
           
        }),
       
        url: 'http://127.0.0.1:8080/geoserver/gwc/service/tms/1.0.0/test:languedoc@EPSG:2154@pbf/{z}/{x}/{-y}.pbf',
        crossOrigin: 'anonymous',
        
    });
    var layerMVT = new ol.layer.VectorTile({
        style:simpleStyle,
        opacity: 0.8,
        source: sourceL,
      
       

    });
   map.addLayer(layerMVT);
}

Gp.Services.getConfig({
    apiKey: "1g3c8evz5w5tcus9a7oawl77",
    onSuccess: go
});
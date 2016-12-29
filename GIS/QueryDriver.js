define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/tasks/RelationshipQuery",
    "dojo/domReady!"],
    function (declare, array, lang, FeatureLayer, Query, QueryTask, on, RelationshipQuery) {
        return declare(null, {
            config: {},
            searchSources: [],
            map: {},
            _init: function () {

            },
            startup: function (config, map) {
                this.map = map;
                if (config) {
                    this.config = config;
                }
                array.forEach(
                    config.searchConfig.sources,
                    lang.hitch(this, function (hintLayer) {
                        this.searchSources.push(hintLayer.url);
                    })
                );
            },
            query: function (q) {
                var _this = this
                require([
                    "esri/tasks/query",
                    "esri/tasks/QueryTask"
                ], function (Query, QueryTask) {
                    var query = new Query();
                    var queryTask = new QueryTask(_this.searchSources[0]);
                    query.where = "OBJECTID like '" + q + "'";
                    query.outFields = ["*"]
                    query.returnGeometry = true;
                    query.outSpatialReference = {wkid:102100};
                    queryTask.execute(query, function (featureResults) {
                        _this.ShowResults(featureResults, _this)
                    });
                });
            },
            ShowResults: function (featureSet, me) {
                require(["esri/symbols/SimpleMarkerSymbol", "esri/InfoTemplate","dojo/_base/Color"],
                    function (SimpleMarkerSymbol, InfoTemplate,Color) {
                        var _this = me;
                        var map = me.map;
                        map.graphics.clear();
                        var resultFeatures = featureSet.features;
                        var centerpoint = featureSet.features[0].geometry.getCentroid();
                            //Loop through each feature returned
                        for (var i = 0, il = resultFeatures.length; i < il; i++) {
                            //Get the current feature from the featureSet.
                            //Feature is a graphic
                            var graphic = resultFeatures[i];
                            //Set the Symbol
                            //graphic.setSymbol(symbol);
                            //Set the infoTemplate.
                            //graphic.setInfoTemplate(infoTemplate);
                            map.centerAt(centerpoint).then(function(){
                                map.setZoom(15).then(function(){
                                    
                                },null)
                            },function(){
                                //Custom Error handling solution here
                            })
                            //Add graphic to the map graphics layer.
                            map.graphics.add(graphic);
                        }

                    })

            }

        })
    });

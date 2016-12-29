/*global define,location */
/*jslint sloppy:true */

define({
    //Default configuration settings for the application. This is where you'll define things like a bing maps key,
    //default web map, default app color theme and more. These values can be overwritten by template configuration settings and url parameters.
    "appid": "",
    "webmap": "WEBMAP ID HERE",
    "oauthappid": null,
    //Group templates must support a group url parameter. This will contain the id of the group.
    "group": "",
    //Enter the url to the proxy if needed by the application. See the 'Using the proxy page' help topic for details
    //http://developers.arcgis.com/en/javascript/jshelp/ags_proxy.html
    "proxyurl": "",
    // This is an option added so that developers working with the
    // hosted version of the application can apply custom styles
    // not used in the download version.
    "customstyle": null,
    "theme": "#f7f8f8",
    "color": "#4c4c4c",
    "title": null,
    "drawerSize": null,
    "bingKey": "", //Enter the url to your organizations bing maps key if you want to use bing basemaps
    //Defaults to arcgis.com. Set this value to your portal or organization host name.
    "sharinghost": location.protocol + "//" + "www.arcgis.com",
    "units": null,
    //If your applcation needs to edit feature layer fields set this value to true. When false the map will
    //be dreated with layers that are not set to editable which allows the FeatureLayer to load features optimally.
    "editable": true,
    "edittoolbar": false,
    "basemap": false,
    "alt_basemap": null,
    "home": true,
    "locate": false,
    "locatetrack": false,
    "search": true,
    "locationSearch": true,
    //When searchExtent is true the locator will prioritize results within the current map extent.
    "searchExtent": false,
    "searchLayers": [{
        "id": "",
        "fields": []
    }],
    "scale": true,
    "helperServices": {
        "geometry": {
            "url": null
        },
        "printTask": {
            "url": null
        },
        "elevationSync": {
            "url": null
        },
        "geocode": [{
            "url": null
        }]
    },
    "searchConfig": {
        "sources": [{
                "url": "URLHERE",
                "searchFields": ["FIELDS HERE"],
                "infoTemplateStr": "Polygon Description: ${text_field}</br>Unique ID: ${shortint_field}",
                "name": "Polygons"
        }]
    }
});

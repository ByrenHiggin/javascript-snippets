$(function () {
    Number.prototype.format = function (n, x) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        return this.toFixed(Math.max(0, ~ ~n)).replace(new RegExp(re, 'g'), '$&,');
    };
});

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
}

$(document).ready(function () {
    CoreFunctions.getCached();
    CoreFunctions.getLive();
});


var ThrowCoreError = function (err, url) {
    $.ajax({
        url: "XXXXX",
        type: "POST",
        contentType: "application/json",
        data: '{"err":"' + err + '","url":"' + url + '"}',
        dataType: "json",
        success: function (result) {
        },
        error: function (xhr, status, err) {

        }
    });
}


//These are the functions that read JSON and begin a panel building process
var CoreFunctions = {
    getCached: function() {
        $.ajax({
            url: "XXXXX",
            type: "POST",
            contentType: "application/json",
            data: '{"theme":"' + $.urlParam('th') + '", "type":"' + $.urlParam('ty') + '", "service":"' + $.urlParam('se') + '", "startdate":"' + $("#dbStartDate").val() + '", "enddate":"' + $("#dbEndDate").val() + '" }',
            dataType: "json",
            success: function (result) {
                var data = $.parseJSON(result.hasOwnProperty("d") ? result.d : result);
                CoreFunctions.processJSONSource(data);
            },
            error: function (xhr, status, err) {
            //Custom Error code - Was previously a link to a custom logging system   
           }
        });
    },
    getLive: function()
    {
        $.ajax({
            url: "XXXXX",
            type: "POST",
            contentType: "application/json",
            data: '{"theme":"' + $.urlParam('th') + '", "type":"' + $.urlParam('ty') + '", "service":"' + $.urlParam('se') + '", "startdate":"' + $("#dbStartDate").val() + '", "enddate":"' + $("#dbEndDate").val() + '" }',
            dataType: "json",
            success: function (result) {
                var data = $.parseJSON(result.hasOwnProperty("d") ? result.d : result);
                CoreFunctions.processJSONSource(data);
            },
            error: function (xhr, status, err) {
               //Custom Error code - Was previously a link to a custom logging system   
               }
        });
    },
    processJSONSource: function (json) {
      try
      {
        CoreFunctions.processRecords(json.statistics)
      }
      catch(err){
        //Custom Error code - Was previously a link to a custom logging system   
      }
    },
    processRecords: function (json) {
        $.each(json, function (i, v) {
            var exists = false
            //Check if the data record was previously provided by cached data.
            if (document.getElementById(v.id)) {
                //If yes, then delete the contents of the stickie to rewrite with new and potentially quite different data
                exists = true;
                document.getElementById(v.id).innerHTML = ''
            }
            var success = true;
            if (!exists) {
            
                if (v.type !== "Errorc") {
                    $('#StickyArea').append('<div id="' + v.id + '"></div>');
                } else {
                    ThrowCoreError(v.title, window.location.href);
                    success = false;
                }
            }
            if (success) { 
              CoreFunctions.processSingleRecord(v, $('#' + v.id)) 
            }
        });
    },
    processSingleRecord: function (json, entity) {
        entity.html(function () {
            return htmlFactory.CreateWrapper(json.type, json.span);
        });
        var Header = entity.children().children().first();
        
        Header.html(function () {
            return htmlFactory.createHeader(json) + htmlFactory.createBody(json.data, json.showas) + htmlFactory.createFooter(json.URL, json.URLText)
        })
        //Remove the "pending for live data" class
        entity.removeClass("panel-pending");
        
        var body = entity.children().children().children()[1];
        
        switch (json.showas) {
            case "DBTimeOut":
                entity.addClass("panel-error");
                break;
            case "loading":
                bodyFactory.createLoading(body);
                break;
            case "SingleLineString":
                bodyFactory.createNumeric(json, body);
                break;
            case "PieChart":
                bodyFactory.createPie(json, body);
                break;
            case "DualLineCurrString":
                bodyFactory.createDualLine(json, body, true);
                break;
            case "DualLinePlainString":
                bodyFactory.createDualLine(json, body, false);
                break;
            case "PercentageNumeric":
                bodyFactory.createPercentage(json, body);
                break;
            case "PercantageAndDoubleString":
                bodyFactory.PercantageAndDoubleString(json, body);
                break;
            case "BarGraphMoney":
                bodyFactory.createHorizontalBar(json, body, 'C');
                break;
            case "BarGraphDiscrete":
                bodyFactory.createHorizontalBar(json, body, 'N0');
                break;
            case "BigDataPanelGraph":
                bodyFactory.createLargeBar(json, body);
                break;
            case "NotImplemented":
                bodyFactory.createNotImplemented(body);
                break;
            default:
                bodyFactory.createEmpty(body);
                break;
        }
    }
};
//These are functions that build DOM 
var htmlFactory = {
    CreateWrapper: function (stype, span) {
        return '<div class="span' + span + '"><div class="stat-bar-wrapper' + '" type="' + stype + '"></div></div>'
    },
    createBody: function (data, showas) {
        return '<div class="stat-body-bar"></div>';
    },
    createHeader: function (json) {
        var str = '<div class="stat-header-bar"><h3>' + json.title + '</h3>'
        str = str + '<a type="button" class="tooltips" data-toggle="tooltip" data-placement="left" title="' + json.tooltip + '"><i class="fa fa-question-circle" aria-hidden="true"></i></a>'
        str = str + '</div>'
        return str
    },
    createFooter: function (URL, text) {
        var str = '<div class="stat-footer-bar">';
        if (URL !== '') {
            str = str + '<a href="' + URL + '" onclick="' + "_gaq.push(['_trackEvent', 'link click', 'StatisticsDashboard', '" + URL.split("?")[1] + "']);" + '">' + text + '</a></div>'
        } else {
            str = str + '</div>'
        }
        return str
    }
};

//This is a branching factory to set body values of a statistic panel.
//It basically cycles through each KeyValuePair and will print the details needed to show the statistic

//This uses the Kendo UI library for creating HTML charts, but can be very easily transitioned to GOOGLE CHARTS as a cost-save in the future
var bodyFactory = {
    createNotImplemented: function (body) {
        $(body).html(function () {
            return '<div><h1>Sorry!</h1><p>This statistics area is still being built by our team of developers! If you have any specific requirements for data in this area please let digital services know. </p></div>'
        })
    },
    createLoading: function (body) {
        $(body).html(function () {
            return '<div><h1>Loading</h1></div>'
        })
    },
    createNumeric: function (data, body) {
        $(body).html(function () {
            var stri = '';
            $.each(data.data, function (i, v) {
                stri = stri + '<h1>' + Number(v.Value).format(0) + '</h1><h2>' + v.Key + '<h2>';
            });
            var testDelta = Number(data.delta).format(0)
            if (testDelta == 0) {
                data.delta = ''
            } else if (testDelta > 0) {
                data.delta = '+' + data.delta
            } else if (testDelta < 0) {
                data.delta = '-' + data.delta
            }

            stri = stri + "<h4 class='delta'>" + data.delta + "</h4>"
            return stri;
        });
    },
    createLargeBar: function (json, body) {
        var fields = {};
        var columnsarray = [];
        var data = [];

        //Get the field values of the first row, to check how to format. 
        json.data[0].data.map(function (currentValue, index, arr) {
            var modifiedval
            var Template
            var TemplateTruncate = "0"
            modifiedval = currentValue.Key.substring(0, 2).indexOf("$") >= 0 ? currentValue.Key.substring(2, currentValue.Key.length) : currentValue.Key
            if (currentValue.Key.substring(0, 2).indexOf("$") >= 0) {
                switch (currentValue.Key.substring(0, 1)) {
                    case "C":
                        TemplateTruncate = "2"
                        break;
                    case "N":
                    default:
                        TemplateTruncate = "0"
                        break;
                }
            }
            
            Template = currentValue.Key.substring(0, 2).indexOf("$") >= 0 ? '#: kendo.format("{0:' + currentValue.Key.substring(0, 1) + TemplateTruncate + '}",' + modifiedval + ') #' : '#: ' + modifiedval + '#'

            columnsarray.push({ field: modifiedval, template: Template });
            fields[modifiedval] = {}
            fields[modifiedval]["type"] = ""
            if (!isNaN(Number(currentValue.Value))) {
                fields[modifiedval]["type"] = "number"
            } else {
                fields[modifiedval]["type"] = "string"
            }
        })

        json.data.map(function (currentValue, index, arr) {
            var item = {}
            currentValue.data.map(function (currentValue, index, arr) {
                if (!isNaN(Number(currentValue.Value))) {
                    switch (currentValue.Key.substring(0, 2)) {
                        case "N$":
                            item[currentValue.Key.substring(2, currentValue.Key.length)] = Number(currentValue.Value);
                            break;
                        case "C$":
                            item[currentValue.Key.substring(2, currentValue.Key.length)] = Number(currentValue.Value);
                            break;
                        default:
                            item[currentValue.Key] = Number(currentValue.Value);
                            break;
                    }
                } else {
                    item[currentValue.Key] = currentValue.Value
                }
            })
            data.push(item)
        })

        $(body).kendoGrid({
            dataSource: {
                data: data,
                schema: {
                    model: fields
                },
                pageSize: 25
            },
            scrollable: false,
            sortable: true,
            filterable: true,
            pageable: {
                input: true,
                numeric: false
            },
            columns: columnsarray
        });
    },
    createPie: function (json, body) {
        $(body).kendoChart({
            chartArea: {
                height: 100
            },
            dataSource: {
                data: json.data
            },
            title: { text: json.title, visible: false },
            seriesColors: ["#2196F3", "#F44336", "#9C27B0", "#FFC107"],
            seriesDefaults: {
                type: "pie",
                labels: {
                    visible: false,
                    background: "transparent",
                    template: "#= category #: \n #= value#%"
                }
            },
            series: [{ field: "Value", categoryField: "Key"}],
            tooltip: {
                visible: true,
                background: "transparent",
                border: "none",
                template: "#= dataItem.Key # : #= value #"

            },
            legend: {
                position: "right",
                labels: {
                    template: "#= dataItem.Key # : #= value #"
                }
            }
        });
    },
    createHorizontalBar: function (json, body, format) {
        $(body).kendoChart({
            chartArea: {
                height: 300
            },
            seriesColors: ["#2196F3", "#F44336", "#9C27B0", "#FFC107"],
            dataSource: {
                data: json.data
            },
            title: { text: json.title },
            seriesDefaults: {
                type: "bar",
                labels: {
                    visible: true,
                    background: "transparent",
                    template: "#= kendo.toString(kendo.parseFloat(value), '" + format + "') #",
                    position: "left"
                }
            },
            series: [{ field: "Value", gap: 0.1, spacing: 0.3}],
            categoryAxis: {
                field: "Key",
                template: "#= kendo.toString('{0:C}',parseFloat(value))#",
                majorGridLines: {
                    visible: false
                },
                line: {
                    visible: false
                }
            }
        });
    },
    createDualLine: function (data, body, showcurr) {
        $(body).html(function () {
            var stri = '';
            var arr = []
            $.each(data.data, function (i, v) {
                arr.push(Number(v.Value));
            });
            stri = stri + '<h1>' + Number(arr[0].toFixed(0)).format(0)
            if (showcurr) {
                stri = stri + '</h1><h3>$' + arr[1].format(2) + '</h3>';
            } else {
                stri = stri + ' ' + data.data[0].Key.toString() + '</h1>' + '<h3>' + Number(arr[1].toFixed(0)).format(0) + ' ' + data.data[1].Key.toString() + '</h3>';
            }

            //                    $.each(data.data, function (i, v) {
            //                        str = str + '<h3><b>' + v.Key + '</b> - ' + v.Value + '</h3><br>';
            //                    });
            return stri;
        });
    },
    PercantageAndDoubleString: function (data, body) {
        $(body).html(function () {
            var str = '<div class="row percentage-double"><div class="span2"><h1>' + 
            ((Number(data.data[0].Value) / Number(data.data[1].Value)) * 100).toFixed(1) +
            '%</h1></div><div class="span2"><h3>' +
            data.data[0].Key + ' ' + Number(data.data[0].Value).format(0) + 
            '</h3><h3>' + data.data[1].Key + "  " + Number(data.data[1].Value).format(0) + '</h3></div></div>'
            return str;
        });
    },
    createEmpty: function (body) {
        $(body).html(function () {
            return "<h3 class='muted'>No data found for this range<h3>";
        });
    },
    createGeneric: function (data, body) {
        $(body).html(function () {
            var stri = '';
            $.each(data, function (i, v) {
                stri = stri + '<h3><b>' + v.Key + '</b> - ' + v.Value + '</h3><br>';
            });
            return stri;
        });
    },
    createPercentage: function (data, body) {
        $(body).html(function () {
            if (data.data[0].Value == "0") {
                return "<h1>Not available</h1>"
            }
            var str = '<h1>' + (Number(data.data[0].Value) * 100).toFixed(1) + '%</h1>'
            return str;
        });
    }

}


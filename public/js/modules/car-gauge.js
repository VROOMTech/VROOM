function carGaugeDefaultSettings() {
    return {
        minValue: 0,
        maxValue: 100,
        startValue: 50,
        textVertPosition: 0.5,
        textSize: 1,
        displayPercent: true
    };
}

function loadCarGauge(elementClass, value, config) {
    if (config === null) {
        config = carGaugeDefaultSettings();
    }
    
    var width = 1; 
    var height = 1; 
    var offset = 0;
    var gaugeValue = value;
    var padding = 20;
    var maxValue = 100;

    //////// canvas dimensions
    width = document.getElementsByClassName(elementClass)[0].offsetWidth;
    height = width;

    //////// fuel gauge 
    // point coordinates for triangle shape
    var leftPointX = padding;
    var leftPointY = padding;
    var rightPointX = width - padding;
    var rightPointY = padding;
    var bottomPointX = width / 2;
    var bottomPointY = height - padding;
    
    // fuel gauge path
    var path = "M " + leftPointX + " " + leftPointY + " L " + bottomPointX + " " + bottomPointY + " L " + rightPointX + " " + rightPointY + " L " + leftPointX + " " + leftPointY; 

    //////// empty bar
    // empty bar points
    var emptyBarLeft = width * 0.35;
    var emptyBarRight = width - width * 0.35;
    
    // empty bar path
    var emptyBarPath = "M " + emptyBarLeft + " " + bottomPointY + " L " + emptyBarRight + " " + bottomPointY;

    //////// third bar
    // third bar points
    var thirdBarLeft = width * 0.27;
    var thirdBarRight = width * 0.33;

    // third bar heigh
    var thirdBarHeight = (bottomPointY - padding) * (2 / 3) + padding;

    // third bar path 
    var thirdBarPath = "M " + thirdBarLeft + " " + thirdBarHeight + " L " + thirdBarRight + " " + thirdBarHeight;

    // create canvas
    var svg = d3.select("." + elementClass)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // create gradient 
    var grad = svg.append("defs")
        .append("linearGradient")
        .attr({
            "id": "grad",
            "x1": "0%",
            "x2": "0%",
            "y1": "100%",
            "y2": "50%"
        });

    var clip = svg.append("defs");
    var clipPath = clip.append("clipPath")
        .attr("id", "polygon-mask");
    var polygon = clipPath
        .append("polygon")
        .attr("points", leftPointX + "," + rightPointY + " " + bottomPointX + "," + bottomPointY + " " + rightPointX + "," + rightPointY);

    grad.append("stop")
        .attr("offset", "100%")
        .style("stop-color", "#006600");

    // add gauge outline
    var gaugeOutline = svg.append('svg:path')
        .attr("d", path)
        .attr("stroke", "#006600")
        .attr("fill", "none");

    // add gauge with fill
    var gauge = svg.append('svg:path')
        .attr("d", path)
        .attr("stroke", "none")
        .attr("fill", "url(#grad)")
        .attr("opacity", ".8")
        .attr("clip-path", "url(#polygon-mask)");

    // add empty bar
    var emptyBar = svg.append('svg:path')
        .attr("d", emptyBarPath)
        .attr("stroke", "#006600")
        .attr("stroke-width", "3px");

    // add third bar
    var thirdBar = svg.append('svg:path')
        .attr("d", thirdBarPath)
        .attr("stroke", "#006600")
        .attr("stroke-width", "3px");

    //////// fuel gauge text
    var emptyBarText = svg.selectAll("text")
                            .data(emptyBar)
                            .enter();

    // empty bar text "E"
    emptyBarText.append("text")
                    .attr("x", emptyBarLeft - 15)
                    .attr("y", bottomPointY + 5)
                    .text("E")
                    .attr("font-size", "20px")
                    .attr("fill", "#006600");

    // third bar text "1/3"
    emptyBarText.append("text")
                    .attr("x", thirdBarLeft - 25)
                    .attr("y", thirdBarHeight + 5)
                    .text("1/3")
                    .attr("font-size", "20px")
                    .attr("fill", "#006600");

    var changeGauge = function(percent) {
        offset = height - padding * 2 - ((height - padding * 2) * percent / 100);
        leftPointY = padding + offset;
        rightPointY = padding + offset;
        path = getNewPath();
        polygon.attr("points", updatePolygon()); 
    };

    var getNewPath = function() {
        return "M " + leftPointX + " " + leftPointY + " L " + bottomPointX + " " + bottomPointY + " L " + rightPointX + " " + rightPointY + " L " + leftPointX + " " + leftPointY;
    };

    var updatePolygon = function() {
         return "points", leftPointX + "," + rightPointY + " " + bottomPointX + "," + bottomPointY + " " + rightPointX + "," + rightPointY;
    };

    var isAtWarningValue = function(value) {
        console.log("value is: " + value);
        if(value <= 1 / 3 * maxValue) {
            console.log("WARNING!!!");
        }
        return value <= 1 / 3 * maxValue;
    };

    return {
        updateGauge:  function(percent) {
            changeGauge(percent);
            
            if(isAtWarningValue(percent)) {
                var stop = d3.select('#grad')
                    .selectAll('stops')[0]
                    .parentNode
                    .firstChild
                    .style
                    .cssText = "stop-color: rgb(200, 0, 0);";
            }

            gauge.attr("clip-path", "url(#polygon-mask)")
                .attr("transform", null)
                .attr("fill", "url(#grad)")
                .transition()
                .attr("transform", "translate(" + 0 + "," + 0 + ")");

            gaugeValue = percent;
        },

        isAtWarningValue: function(value) {
            console.log("value is: " + value);
            if(value <= 1 / 3 * maxValue) {
                console.log("WARNING!!!");
            }
            return value <= 1 / 3 * maxValue;
        },

        changeGaugeColor: function() {
            
        },

        getGaugeValue: function() {
            return gaugeValue;
        },

        getRecommendedRefuelValue: function() {
            return 25;
        }
    };
}

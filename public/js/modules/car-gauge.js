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

    //////// empty bar path
    // empty bar points
    var emptyBarLeft = width * 0.35;
    var emptyBarRight = width - width * 0.35;
    
    //empty bar path
    var emptyLinePath = "M " + emptyBarLeft + " " + bottomPointY + " L " + emptyBarRight + " " + bottomPointY;

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
    svg.append('svg:path')
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

    // add empty line
    var emptyLine = svg.append('svg:path')
        .attr("d", emptyLinePath)
        .attr("stroke", "#006600")
        .attr("stroke-width", "3px");

    //////// fuel gauge text
    var emptyLineText = svg.selectAll("text")
                            .data(emptyLine)
                            .enter();

    // empty line text "E"
    emptyLineText.append("text")
                    .attr("x", emptyBarLeft - 15)
                    .attr("y", bottomPointY + 5)
                    .text("E")
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

    return {
        updateGauge:  function(percent) {
            changeGauge(percent);

            gauge.attr("clip-path", "url(#polygon-mask)")
                .attr("transform", null)
                .transition()
                .attr("transform", "translate(" + 0 + "," + 0 + ")");

            gaugeValue = percent;
        },

        getGaugeValue: function() {
            return gaugeValue;
        },

        getRecommendedRefuelValue: function() {
            return 25;
        }
    };
}

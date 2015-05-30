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

    // canvas dimensions
    width = document.getElementsByClassName(elementClass)[0].offsetWidth;
    height = width;

    // triangle point coordinates
    var leftPointX = padding;
    var leftPointY = padding;
    var rightPointX = width - padding;
    var rightPointY = padding;
    var bottomPointX = width / 2;
    var bottomPointY = height - padding;

    // recommender bar 
    // height
    var recommenderHeight = (height - padding * 2) * 0.75 + padding;
    // x-axis points
    var recommenderBarLeft = width * 0.1;
    var recommenderBarRight = width - width * 0.1;

    var emptyBarLeft = width * 0.35;
    var emptyBarRight = width - width * 0.35;

    var recommenderPath = "M " + recommenderBarLeft + " " + recommenderHeight + " L " + recommenderBarRight + " " + recommenderHeight;

    var emptyLinePath = "M " + emptyBarLeft + " " + bottomPointY + " L " + emptyBarRight + " " + bottomPointY;


    var path = "M " + leftPointX + " " + leftPointY + " L " + bottomPointX + " " + bottomPointY + " L " + rightPointX + " " + rightPointY + " L " + leftPointX + " " + leftPointY; 

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

    //grad.append("stop")
    //.attr("offset", "12%")
    //.style("stop-color", "red");

    //grad.append("stop")
    //    .attr("offset", "80%")
    //    .style("stop-color", "yellow");

    grad.append("stop")
        .attr("offset", "100%")
        .style("stop-color", "#006600");

    // add gauge outline
    svg.append('svg:path')
        .attr("d", path)
        .attr("stroke", "white")
        .attr("fill", "none");

    // add gauge with fill
    var gauge = svg.append('svg:path')
        .attr("d", path)
        .attr("stroke", "none")
        .attr("fill", "url(#grad)")
        .attr("opacity", ".8")
        .attr("clip-path", "url(#polygon-mask)");

    // add recommender bar
    var recommender = svg.append('svg:path')
        .attr("d", recommenderPath)
        .attr("stroke", "#006600")
        .attr("stroke-width", "3px");

    // add empty line
    var emptyLine = svg.append('svg:path')
        .attr("d", emptyLinePath)
        .attr("stroke", "#006600")
        .attr("stroke-width", "3px");

    // add empty line text
    //var emptyLineText = svg.selectAll("text")
    //                        .data(emptyLine)
    //                        .enter()
    //                        .append("text");

    //var eTextLabel = emptyLineText
    //                            .attr("x", emptyBarLeft - 15)
    //                            .attr("y", bottomPointY + 5)
    //                            .text("E")
                                //.attr("font-family", "neutra")
    //                            .attr("font-size", "20px")
    //                            .attr("fill", "white");
   
    //var eTextLabel = emptyLineText
    //                            .attr("x", emptyBarLeft - 15)
    //                            .attr("y", bottomPointY + 5)
    //                            .text("E")
                                //.attr("font-family", "neutra")
    //                            .attr("font-size", "20px")
    //                            .attr("fill", "white");
    
    var emptyLineText = svg.selectAll("text")
                            .data(emptyLine)
                            .enter();

    emptyLineText.append("text")
                    .attr("x", emptyBarLeft - 15)
                    .attr("y", bottomPointY + 5)
                    .text("E")
                                //.attr("font-family", "neutra")
                    .attr("font-size", "20px")
                    .attr("fill", "#006600");

    //emptyLineText.append("text")
    //                .attr("x", emptyBarRight + 5)
    //                .attr("y", bottomPointY + 5)
    //                .text("5 hours")
    //                            //.attr("font-family", "neutra")
    //                .attr("font-size", "20px")
    //                .attr("fill", "#006600");

    //var recommendLineText = svg.selectAll("text")
    //                        .data(recommender)
    //                        .enter();

    emptyLineText.append("text")
                    .attr("x", recommenderBarLeft - 15)
                    .attr("y", recommenderHeight - 10)
                    .text("fill up")
                    .attr("fill", "#006600")
                    .attr("font-size", "20px");

    emptyLineText.append("text")
                    .attr("x", recommenderBarLeft - 8)
                    .attr("y", recommenderHeight + 19)
                    .text("here")
                    .attr("fill", "#006600")
                    .attr("font-size", "20px");

    //emptyLineText.append("text")
    //                .attr("x", recommenderBarRight - 30)
    //                .attr("y", recommenderHeight + 19)
    //                .text("45 mins")
    //                .attr("fill", "#006600")
    //                .attr("font-size", "20px");



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
            //return (1 - recommenderHeight / (height - padding * 2)) * 100; 
            return 25;
        }
    };
}

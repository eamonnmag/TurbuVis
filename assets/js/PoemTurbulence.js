/**
 * Created by eamonnmaguire on 26/02/2014.
 */

var PoemTurbulence = {}

PoemTurbulence.variables = {
    placement: "",
    width: 0,
    height: 0,
    lastPoint: 0,
    marker: undefined,
    path: undefined,
    points: [],
    line: d3.svg.line().interpolate("basic"),
    textStyle: {font: '13px Helvetica, Verdana', "font-weight": "normal"}
}
var svg;
var data = {};
var xScale, yScale;


PoemTurbulence.rendering = {

    renderVis: function (placement, dataurl, w, h) {
        d3.json(dataurl, function (data) {
            xScale = d3.scale.linear().domain([1, 3]).range([10, (w - 10)]);
            yScale = d3.scale.linear().domain([1, 3]).range([10, (h - 10)]);

            svg = d3.select(placement).append("svg").attr("width", w).attr("height", h).append("g");

            svg.selectAll("circle").data(data).enter().append("circle").attr("r", 1).style("fill", "#ccc").attr("cx",function (d) {
                return xScale(d[1]);
            }).attr("cy", function (d) {
                    return yScale(d[0]);
                });

            // get the path...
            PoemTurbulence.variables.path = svg.append("path").attr("d", PoemTurbulence.rendering.path(data));

            setInterval(function () {
                PoemTurbulence.rendering.transition();
            }, 1000)
        });
    },

    path: function (data) {
        return PoemTurbulence.variables.line(data.map(function (d) {
            console.log(d[2]);
            console.log([xScale(d[1]), yScale(d[0], d[2])]);
            PoemTurbulence.variables.points.push([xScale(d[1]), yScale(d[0]), d[2]]);
            return [xScale(d[1]), yScale(d[0])];
        }));
    },

    midPoint: function (point) {

        if (PoemTurbulence.variables.lastPoint > 0) {
            var previousPoint = PoemTurbulence.variables.points[PoemTurbulence.variables.lastPoint - 1];

            console.log(point);
            console.log(previousPoint);

            var midY = (Math.max(previousPoint[0], point[0]) - Math.min(previousPoint[0], point[0])) / 2;
            // if on the same line, don't curve
            var midX = (Math.max(previousPoint[1], point[1]) - Math.min(previousPoint[1], point[1])) / 2;

            console.log("midY = " + midY);
            console.log("midX = " + midX);

            //  var yValue = yScale.invert(midy);
            return [point[0] + midY + 5, point[1] + midX + 5];
        }

        // by default, return the same point
        return point;

    },

    transition: function () {

        var nextPoint = PoemTurbulence.rendering.translateAlong();
//        var midPoint = PoemTurbulence.rendering.midPoint(nextPoint);

        var duration = 100;
//        PoemTurbulence.variables.marker.transition()
//            .duration(duration).ease("linear")
//
//            .style("fill", function () {
//                return (PoemTurbulence.variables.points[PoemTurbulence.variables.lastPoint][2] == "S") ? "#27aae1" : "#F15A29";
//            })
//            .attr("transform", "translate(" + midPoint[1] + "," + midPoint[0] + ")");

//        PoemTurbulence.variables.marker.transition()
//            .duration(duration)
//            .delay(100).ease("linear")
//            .style("fill", function () {
//                return (PoemTurbulence.variables.points[PoemTurbulence.variables.lastPoint][2] === "S") ? "#27aae1" : "#F15A29";
//            })
//            .attr("transform", "translate(" + nextPoint[1] + "," + nextPoint[0] + ")")
//            .each("end", PoemTurbulence.rendering.transition);


        if (PoemTurbulence.variables.lastPoint > 0) {
            var previousPoint = PoemTurbulence.variables.points[PoemTurbulence.variables.lastPoint - 1];


            for (var trailIndex = 0; trailIndex < 50; trailIndex++) {
                svg.append("circle").attr("r", 2)
                    .style("fill", function () {
                        return (previousPoint[2] === "S") ? "#27aae1" : "#F15A29";
                    })
                    .style("opacity", 0)


                    .attr("transform", "translate(" + previousPoint[0] + "," + previousPoint[1] + ")")
                    .transition().delay(trailIndex).duration(duration * (trailIndex * .25)).ease("linear")
                    .attr("transform", "translate(" + nextPoint[0] + "," + nextPoint[1] + ")").style("opacity", .1)
                    .style("fill", function () {
                        return (PoemTurbulence.variables.points[PoemTurbulence.variables.lastPoint][2] === "S") ? "#27aae1" : "#F15A29";
                    })
                    .each("end", function () {
                        this.remove();
                    });
            }
        }
//        PoemTurbulence.rendering.transition();
    },

    translateAlong: function () {
        if ((PoemTurbulence.variables.lastPoint + 1) == PoemTurbulence.variables.points.length || isNaN(PoemTurbulence.variables.lastPoint)) {
            PoemTurbulence.variables.lastPoint = 0;
        }

        PoemTurbulence.variables.lastPoint += 1;
        var p = PoemTurbulence.variables.points[PoemTurbulence.variables.lastPoint];
        return [p[0], p[1]];
//        return "translate(" + p[1] + "," + p[0] + ")";//Move marker
    }



}
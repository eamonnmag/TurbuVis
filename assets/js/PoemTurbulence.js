/**
 * Created by eamonnmaguire on 26/02/2014.
 */

var PoemTurbulence = {}

PoemTurbulence.variables = {
    placement: "",
    width: 0,
    height: 0,
    lastPoint: {},
    marker: {},
    path: {},
    points: {},
    line: d3.svg.line().interpolate("basic"),
    textStyle: {font: '13px Helvetica, Verdana', "font-weight": "normal"}
}

var svg = {};
var xScale, yScale;


PoemTurbulence.rendering = {

    renderVis: function (placement, dataurl, w, h) {
        d3.json(dataurl, function (data) {

            for (var line_index in data) {

                xScale = d3.scale.linear().domain([1, 3]).range([10, (w - 10)]);
                yScale = d3.scale.linear().domain([1, 3]).range([10, (h - 10)]);

                var place = d3.select(placement).append("div").attr("class", "turbuglyph").attr("id", line_index);
                svg[line_index] = place.append("svg").attr("width", w).attr("height", h).append("g");
                svg[line_index].selectAll("circle").data(data[line_index]).enter().append("circle").attr("r", 1).style("fill", "#ccc").attr("cx",function (d) {
                    return xScale(d[1]);
                }).attr("cy", function (d) {
                        return yScale(d[0]);
                    });

                PoemTurbulence.variables.path[line_index] = svg[line_index].append("path").attr("d", PoemTurbulence.rendering.path(data[line_index], line_index));
                PoemTurbulence.variables.marker[line_index] = svg[line_index].append("circle").attr("r", 4).style("stroke", "#ccc").style("fill", "none")
                    .attr("transform", "translate(-10-, -100)");
            }

            setInterval(function () {
                PoemTurbulence.rendering.transition();
            }, 500)
        });
    },

    path: function (data, uniqueKey) {
        return PoemTurbulence.variables.line(data.map(function (d) {
            if (!(uniqueKey in PoemTurbulence.variables.points)) {
                PoemTurbulence.variables.points[uniqueKey] = [];
            }
            PoemTurbulence.variables.points[uniqueKey].push([xScale(d[1]), yScale(d[0]), d[2]]);
            return [xScale(d[1]), yScale(d[0])];
        }));
    },

    transition: function () {

        for (var uniqueKey in Object.keys(PoemTurbulence.variables.marker)) {
            var nextPoint = PoemTurbulence.rendering.translateAlong(uniqueKey);
            //var midPoint = PoemTurbulence.rendering.midPoint(nextPoint);

            var duration = 150;


            if (PoemTurbulence.variables.lastPoint[uniqueKey] > 0) {
                var previousPoint = PoemTurbulence.variables.points[uniqueKey][PoemTurbulence.variables.lastPoint[uniqueKey]];

                PoemTurbulence.variables.marker[uniqueKey].transition()
                    .duration(duration).ease("cubic").style("stroke",function () {
                        return (PoemTurbulence.variables.points[uniqueKey][PoemTurbulence.variables.lastPoint[uniqueKey]][2] === "S") ? "#27aae1" : "#F15A29";
                    }).attr("transform", "translate(" + nextPoint[0] + "," + nextPoint[1] + ")").style("stroke-width", 2);

                for (var trailIndex = 0; trailIndex < 50; trailIndex++) {
                    svg[uniqueKey].append("circle").attr("r", 2)
                        .style("fill", function () {
                            return (previousPoint[2] === "S") ? "#27aae1" : "#F15A29";
                        })
                        .attr("id", "circle-" + trailIndex)
                        .style("opacity", 0)
                        .attr("transform", "translate(" + previousPoint[0] + "," + previousPoint[1] + ")")
                        .transition().delay(trailIndex).duration(duration * trailIndex).ease("cubic")
                        .attr("transform", "translate(" + nextPoint[0] + "," + nextPoint[1] + ")").style("opacity", .3)
                        .style("fill", function () {
                            return (PoemTurbulence.variables.points[uniqueKey][PoemTurbulence.variables.lastPoint[uniqueKey]][2] === "S") ? "#27aae1" : "#F15A29";
                        })
                        .each("end", function () {
                            this.remove();
                        });
                }
            }
        }
    },

    translateAlong: function (uniqueKey) {
        if ((PoemTurbulence.variables.lastPoint[uniqueKey] + 1) == PoemTurbulence.variables.points[uniqueKey].length || isNaN(PoemTurbulence.variables.lastPoint[uniqueKey])) {
            PoemTurbulence.variables.lastPoint[uniqueKey] = 0;
        }

        var p = PoemTurbulence.variables.points[uniqueKey][PoemTurbulence.variables.lastPoint[uniqueKey]];
        PoemTurbulence.variables.lastPoint[uniqueKey] += 1;
        return [p[0], p[1]];
    }



}
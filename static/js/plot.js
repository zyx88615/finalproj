/* to calculate R
 *  Source: http://stevegardner.net/2012/06/11/javascript-code-to-calculate-the-pearson-correlation-coefficient/
 */

function getPearsonCorrelation(x, y, id) {
    var shortestArrayLength = 0;
     
    if(x.length == y.length) {
        shortestArrayLength = x.length;
    } else if(x.length > y.length) {
        shortestArrayLength = y.length;
        console.error('x has more items in it, the last ' + (x.length - shortestArrayLength) + ' item(s) will be ignored');
    } else {
        shortestArrayLength = x.length;
        console.error('y has more items in it, the last ' + (y.length - shortestArrayLength) + ' item(s) will be ignored');
    }
  
    var xy = [];
    var x2 = [];
    var y2 = [];
  
    for(var i=0; i<shortestArrayLength; i++) {
        xy.push(x[i] * y[i]);
        x2.push(x[i] * x[i]);
        y2.push(y[i] * y[i]);
    }
  
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_x2 = 0;
    var sum_y2 = 0;
  
    for(var i=0; i< shortestArrayLength; i++) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += xy[i];
        sum_x2 += x2[i];
        sum_y2 += y2[i];
    }
  
    var step1 = (shortestArrayLength * sum_xy) - (sum_x * sum_y);
    var step2 = (shortestArrayLength * sum_x2) - (sum_x * sum_x);
    var step3 = (shortestArrayLength * sum_y2) - (sum_y * sum_y);
    var step4 = Math.sqrt(step2 * step3);
    var answer = step1 / step4;
  
    console.log(answer);
    
    d3.select("#"+id)
    .append("h6")
    .append("text")
    .text("r = " + answer);

};

function buildCharts(year) {
    /* data route */
    var url = `/released_year/${year}`

    // d3.select("#r").html('')

    d3.json(url).then(function(response) {

    console.log(response);

    var movie = response.map(row => row.movie);
    var gross = response.map(row => row.gross);
    var like_count = response.map(row => row.like_count);
    var view_count = response.map(row => row.view_count);
    var comment_count = response.map(row => row.comment_count);

    var trace1 = {
        x : like_count, 
        y : gross,
        text: movie,
        mode: 'markers',
        type: 'scatter'
    };

    var data1 = [trace1];

    var layout1 = { 
        xaxis: { title: "Youtube Like Count",  automargin: true, ticks: "outside"},
        yaxis: { title: "Movie Gross ($)", automargin: true},
        margin: {
            l: 20,
            r: 20,
            b: 100,
            t: 100,
          },
    };

    var trace2 = {
        x : view_count, 
        y : gross,
        text: movie,
        mode: 'markers',
        type: 'scatter'
    };

    var data2 = [trace2];

    var layout2 = {
        xaxis: { title: "Youtube View Count",  automargin: true, ticks: "outside"},
        yaxis: { automargin: true},
        margin: {
            l: 20,
            r: 20,
            b: 100,
            t: 100,
          },
    };

    var trace3 = {
        x : comment_count, 
        y : gross,
        text: movie,
        mode: 'markers',
        type: 'scatter'
    };

    var data3 = [trace3];

    var layout3 = {
        xaxis: { title: "Youtube Comment Count",  automargin: true, ticks: "outside"},
        yaxis: { automargin: true},
        margin: {
            l: 20,
            r: 20,
            b: 100,
            t: 100,
          },
    };

    Plotly.newPlot("scatter1", data1, layout1);
    Plotly.newPlot("scatter2", data2, layout2);
    Plotly.newPlot("scatter3", data3, layout3);

    getPearsonCorrelation(like_count, gross, 'r1');
    getPearsonCorrelation(view_count, gross, 'r2');
    getPearsonCorrelation(comment_count, gross, 'r3');

    });
};

function init() {

    // grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    console.log("This is selector: " + selector)
    // use the list of sample names to populate the select options
    d3.json("/select_year").then((all_years) => {
        
        all_years.forEach((year) => {
            selector
            .append("option")
            .text(year)
            .property("value", year);
            console.log("Year: " + year);
        });

        console.log("all_years: " + all_years);
        // build default plot
        const defaultyear = all_years[0];
        console.log("This is default year: " + defaultyear)
        buildCharts(defaultyear);

    });
};

function optionChanged(updatedyear) {
    d3.select("#r1").select("h6").remove();
    d3.select("#r2").select("h6").remove();
    d3.select("#r3").select("h6").remove();
    buildCharts(updatedyear);
};

init();
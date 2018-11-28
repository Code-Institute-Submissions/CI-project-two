queue()
    .defer(d3.csv, "data/Titanic.csv")
    .await(makeGraphs);

function makeGraphs(error, titanicData) {
    var ndx = crossfilter(titanicData);

    titanicData.forEach(function(d) {
        d.total = parseInt(d.total);
    });

    show_class_selector(ndx);

    show_gender_selector(ndx);

    show_average_selector(ndx);

    show_age_selector(ndx);
    show_class_distribution(ndx);
    show_total_class(ndx);
    show_total_sex(ndx);
    show_total_age(ndx);
    show_total_survival(ndx);
    show_survival_by_class(ndx);
    show_survival_by_gender(ndx);
    show_survival_by_age(ndx);
    show_class_balance_rowchart(ndx);
    show_total_onboard(ndx);
    // show_survival_of_class_correlation(ndx);
    dc.renderAll();
}


//============================================//



function show_class_selector(ndx) {
    dim = ndx.dimension(dc.pluck('classification'));
    group = dim.group()

    dc.selectMenu("#class-selector")
        .dimension(dim)
        .group(group);

}

//============================================//


function show_gender_selector(ndx) {
    dim = ndx.dimension(dc.pluck('sex'));
    group = dim.group()

    dc.selectMenu("#gender-selector")
        .dimension(dim)
        .group(group);

}



//============================================//

function show_average_selector(ndx) {
    dim = ndx.dimension(dc.pluck('survived'));
    group = dim.group()

    dc.selectMenu("#average-selector")
        .dimension(dim)
        .group(group);

}

//============================================//


function show_age_selector(ndx) {
    dim = ndx.dimension(dc.pluck('age'));
    group = dim.group()

    dc.selectMenu("#age-selector")
        .dimension(dim)
        .group(group);

}

//============================================//






function show_total_class(ndx) {
    var name_dim = ndx.dimension(dc.pluck('classification'));
    var total_per_class = name_dim.group().reduceSum(dc.pluck('total'));

    dc.pieChart('#total-class-piechart')
        .width(200)
        .height(200)
        .innerRadius(50)
        .transitionDuration(1500)
        .dimension(name_dim)
        .group(total_per_class)
        .colors(d3.scale.ordinal().range(['#56A5EC', '#ED9C55', '#3EA99F', '#E67451']));
        
}

function show_total_sex(ndx) {
    var name_dim = ndx.dimension(dc.pluck('sex'));
    var total_per_sex = name_dim.group().reduceSum(dc.pluck('total'));

    dc.pieChart('#total-sex-piechart')
        .width(200)
        .height(200)
        .innerRadius(50)
        .transitionDuration(1500)
        .dimension(name_dim)
        .group(total_per_sex)
        .colors(d3.scale.ordinal().range(['#56A5EC', '#ED9C55', '#3EA99F', '#E67451']));
}

function show_total_age(ndx) {
    var name_dim = ndx.dimension(dc.pluck('age'));
    var total_per_age = name_dim.group().reduceSum(dc.pluck('total'));

    dc.pieChart('#total-age-piechart')
        .width(200)
        .height(200)
        .innerRadius(50)
        .transitionDuration(1500)
        .dimension(name_dim)
        .group(total_per_age)
        .colors(d3.scale.ordinal().range(['#56A5EC', '#ED9C55', '#3EA99F', '#E67451']));
}

function show_total_survival(ndx) {
    var name_dim = ndx.dimension(dc.pluck('survived'));
    var total_per_survival = name_dim.group().reduceSum(dc.pluck('total'));

    dc.pieChart('#total-survival-piechart')
        .width(200)
        .height(200)
        .innerRadius(50)
        .transitionDuration(1500)
        .dimension(name_dim)
        .group(total_per_survival)
        .colors(d3.scale.ordinal().range(['#56A5EC', '#ED9C55', '#3EA99F', '#E67451']));;
}

function show_class_distribution(ndx) {

    function classByGender(dimension, classification) {
        return dimension.group().reduce(
            function(p, v) {
                p.total++;
                if (v.classification == classification) {
                    p.match++;
                }
                return p;
            },
            function(p, v) {
                p.total--;
                if (v.classification == classification) {
                    p.match--;
                }
                return p;
            },
            function() {
                return { total: 0, match: 0 };
            }
        );
    }

    var dim = ndx.dimension(dc.pluck("sex"));
    var firstByGender = classByGender(dim, "1st");
    var secondByGender = classByGender(dim, "2nd");
    var thirdByGender = classByGender(dim, "3rd");
    var crewByGender = classByGender(dim, "Crew");

    dc.barChart("#class-distribution")
        .width(360)
        .height(270)
        .dimension(dim)
        .group(firstByGender, "1st Class %")
        .stack(secondByGender, "2nd Class %")
        .stack(thirdByGender, "3rd Class %")
        .stack(crewByGender, "Crew %")
        .valueAccessor(function(d) {
            if (d.value.total > 0) {
                return (d.value.match / d.value.total) * 100;
            }
            else {
                return 0;
            }
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .colors(d3.scale.ordinal().range(['#56A5EC', '#ED9C55', '#3EA99F', '#E67451']))
        // .xAxisLabel("Total Percentage of Passengers")
        .legend(dc.legend().x(266).y(19).itemHeight(13).gap(10))
        .margins({ top: 10, right: 100, bottom: 30, left: 30 });

}


function show_survival_by_class(ndx) {
    var name_dim = ndx.dimension(dc.pluck('classification'));
    var survivalByClassYes = name_dim.group().reduceSum(function(d) {
        if (d.survived === 'Yes') {
            return +d.total;
        }
        else {
            return 0;
        }
    });

    var name_dim = ndx.dimension(dc.pluck('classification'));
    var survivalByClassNo = name_dim.group().reduceSum(function(d) {
        if (d.survived === 'No') {
            return +d.total;
        }
        else {
            return 0;
        }
    });

    var stackedChart = dc.barChart("#survival-by-class");
    stackedChart
        .width(300)
        .height(225)
        .dimension(name_dim)
        .group(survivalByClassYes, "Survived")
        .stack(survivalByClassNo, "Perished")
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .colors(d3.scale.ordinal().range(['#56A5EC', '#ED9C55', '#3EA99F', '#E67451']))
    // .legend(dc.legend().x(320).y(20).itemHeight(15).gap(5));
    stackedChart.margins({ top: 10, right: 50, bottom: 30, left: 50 });
}

function show_survival_by_gender(ndx) {
    var name_dim = ndx.dimension(dc.pluck('sex'));
    var survivalByGenderYes = name_dim.group().reduceSum(function(d) {
        if (d.survived === 'Yes') {
            return +d.total;
        }
        else {
            return 0;
        }
    });

    var name_dim = ndx.dimension(dc.pluck('sex'));
    var survivalByGenderNo = name_dim.group().reduceSum(function(d) {
        if (d.survived === 'No') {
            return +d.total;
        }
        else {
            return 0;
        }
    });

    var stackedChart = dc.barChart("#survival-by-gender");
    stackedChart
        .width(300)
        .height(225)
        .dimension(name_dim)
        .group(survivalByGenderYes, "Survived")
        .stack(survivalByGenderNo, "Perished")
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .colors(d3.scale.ordinal().range(['#56A5EC', '#ED9C55', '#3EA99F', '#E67451']))
    // .legend(dc.legend().x(320).y(20).itemHeight(15).gap(5));
    stackedChart.margins({ top: 10, right: 50, bottom: 30, left: 50 });
}

function show_survival_by_age(ndx) {
    var name_dim = ndx.dimension(dc.pluck('age'));
    var survivalByAgeYes = name_dim.group().reduceSum(function(d) {
        if (d.survived === 'Yes') {
            return +d.total;
        }
        else {
            return 0;
        }
    });

    var name_dim = ndx.dimension(dc.pluck('age'));
    var survivalByAgeNo = name_dim.group().reduceSum(function(d) {
        if (d.survived === 'No') {
            return +d.total;
        }
        else {
            return 0;
        }
    });

    var stackedChart = dc.barChart("#survival-by-age");
    stackedChart
        .width(300)
        .height(225)
        .dimension(name_dim)
        .group(survivalByAgeYes, "Survived")
        .stack(survivalByAgeNo, "Perished")
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .colors(d3.scale.ordinal().range(['#56A5EC', '#ED9C55', '#3EA99F', '#E67451']))
        .legend(dc.legend().x(210).y(15).itemHeight(12).gap(5));
    stackedChart.margins({ top: 10, right: 50, bottom: 30, left: 50 });
}





function show_class_balance_rowchart(ndx) {
    var dim = ndx.dimension(dc.pluck('classification'));
    var group = dim.group();

    dc.rowChart("#class-balance-rowchart")
        .width(360)
        .height(270)
        .dimension(dim)
        .group(group)
        .colors(d3.scale.ordinal().range(['#56A5EC', '#ED9C55', '#3EA99F', '#E67451']))
        .xAxis().ticks(4);

}

function show_total_onboard(ndx) {
    var totalOnboard = ndx.groupAll().reduceSum(function(d) {
        return d["total"];
    });



    dc.numberDisplay("#show-total-onboard")
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d) {
            return d;
        })
        .group(totalOnboard)
        .formatNumber(d3.format(",.0f"));
}


/*
function show_survival_of_class_correlation(ndx) {
    var survivedDim = ndx.dimension(dc.pluck("survived"));
    
   var minSurvival = survivedDim.bottom(1)[0].survived;
   var maxSurvival = survivedDim.top(1)[0].survived;
    
    var classDim = ndx.dimension(function(d){
        return [d.total, d.classification];
    });
    
    var classSurvivalGroup = classDim.group();
    
    dc.scatterPlot("#show-survival-of-class-correlation")
    .width(800)
    .height(400)
    //.x(d3.scale.ordinal().domain([minSurvival, maxSurvival]))
   .x(d3.scale.linear().domain([0,1000]))
    //.x(d3.scale.ordinal())
    .brushOn(false)
    .symbolSize(8)
    .clipPadding(10)
    .yAxislabel("Survival Rates")
  
    .dimension(classDim)
    .group(classSurvivalGroup);
    
}


*/
 /* 
function show_survival_of_class_correlation(ndx) {
     var scatterDimension = ndx.dimension(dc.pluck('total'));
    var scatterGroup = scatterDimension.group().reduceSum(function(d) { return [d.total, d.classification, d.survived]; });
    

// var survivedDim = ndx.dimension(dc.pluck("classification")); 
// var scatterDimension = ndx.dimension(function(d){ return [d.classification, d.survived]; });
//   var scatterGroup = scatterDimension.group();
    
    dc.scatterPlot("#show-survival-of-class-correlation")
           .width(1000)
          .height(200)
          .dimension(scatterDimension)
          .group(scatterGroup)
          .x(d3.scale.ordinal())
          .y(d3.scale.linear().domain([0,800]))
          .symbolSize(10)
          .clipPadding(10);
       // dc.scatterPlot.yAxis().ticks(5);
     
}

*/
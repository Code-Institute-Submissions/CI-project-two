queue()
    .defer(d3.csv, "data/Titanic.csv")
    .await(makeGraphs);

function makeGraphs(error, titanicData) {
    var ndx = crossfilter(titanicData);

    titanicData.forEach(function(d) {
        d.total = parseInt(d.total);
    });

    show_class_selector(ndx);
    show_class_balance(ndx);
    //  show_gender_selector(ndx);
    show_gender_balance(ndx);
    show_average_balance(ndx);
    show_average_selector(ndx);
    show_age_balance(ndx);
    show_age_selector(ndx);
    show_class_distribution(ndx);
    show_total_class(ndx);
    show_total_sex(ndx);
    show_total_age(ndx);
    show_total_survival(ndx);
    show_survival_by_class_and_gender(ndx);


    dc.renderAll();
}


//============================================//

function show_class_balance(ndx) {
    var dim = ndx.dimension(dc.pluck('classification'));
    var group = dim.group();

    dc.barChart("#class-balance")
        .width(360)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(1500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .colors(d3.scale.ordinal().range(['#56A5EC']))
        .xAxisLabel("Class")
        .yAxis().ticks(10);

}

function show_class_selector(ndx) {
    dim = ndx.dimension(dc.pluck('classification'));
    group = dim.group()

    dc.selectMenu("#class-selector")
        .dimension(dim)
        .group(group);

}

//============================================//

function show_gender_balance(ndx) {
    var dim = ndx.dimension(dc.pluck('sex'));
    var group = dim.group();

    dc.barChart("#gender-balance")
        .width(360)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(1500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .colors(d3.scale.ordinal().range(['#56A5EC']))
        .xAxisLabel("Gender")
        .yAxis().ticks(12);

}

/* function show_gender_selector(ndx){
        dim = ndx.dimension(dc.pluck('sex'));
        group = dim.group()
        
        dc.selectMenu("#gender-selector")
        .dimension(dim)
        .group(group);
        
    }*/



//============================================//
function show_average_balance(ndx) {
    var dim = ndx.dimension(dc.pluck('survived'));
    var group = dim.group();

    dc.barChart("#average-balance")
        .width(360)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(1500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .colors(d3.scale.ordinal().range(['#56A5EC']))
        .xAxisLabel("Survival Rate")
        .yAxis().ticks(10);

}

function show_average_selector(ndx) {
    dim = ndx.dimension(dc.pluck('survived'));
    group = dim.group()

    dc.selectMenu("#average-selector")
        .dimension(dim)
        .group(group);

}

//============================================//
function show_age_balance(ndx) {
    var dim = ndx.dimension(dc.pluck('age'));
    var group = dim.group();

    dc.barChart("#age-balance")
        .width(360)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(1500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .colors(d3.scale.ordinal().range(['#56A5EC']))
        .xAxisLabel("Survival By Age Group")
        .yAxis().ticks(8);

}

function show_age_selector(ndx) {
    dim = ndx.dimension(dc.pluck('age'));
    group = dim.group()

    dc.selectMenu("#age-selector")
        .dimension(dim)
        .group(group);

}

//============================================//



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
        .width(400)
        .height(300)
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
        .legend(dc.legend().x(320).y(20).itemHeight(15).gap(5))
        .margins({ top: 10, right: 100, bottom: 30, left: 30 });

}


function show_total_class(ndx) {
    var name_dim = ndx.dimension(dc.pluck('classification'));
    var total_per_class = name_dim.group().reduceSum(dc.pluck('total'));

    dc.pieChart('#total-class-piechart')
        .height(300)
        .radius(75)
        .transitionDuration(1500)
        .dimension(name_dim)
        .group(total_per_class)
        .colors(d3.scale.ordinal().range(['#56A5EC', '#ED9C55', '#3EA99F', '#E67451']));

}

function show_total_sex(ndx) {
    var name_dim = ndx.dimension(dc.pluck('sex'));
    var total_per_sex = name_dim.group().reduceSum(dc.pluck('total'));

    dc.pieChart('#total-sex-piechart')
        .height(300)
        .radius(75)
        .transitionDuration(1500)
        .dimension(name_dim)
        .group(total_per_sex)
        .colors(d3.scale.ordinal().range(['#56A5EC', '#ED9C55', '#3EA99F', '#E67451']));
}

function show_total_age(ndx) {
    var name_dim = ndx.dimension(dc.pluck('age'));
    var total_per_age = name_dim.group().reduceSum(dc.pluck('total'));

    dc.pieChart('#total-age-piechart')
        .height(300)
        .radius(75)
        .transitionDuration(1500)
        .dimension(name_dim)
        .group(total_per_age)
        .colors(d3.scale.ordinal().range(['#56A5EC', '#ED9C55', '#3EA99F', '#E67451']));
}

function show_total_survival(ndx) {
    var name_dim = ndx.dimension(dc.pluck('survived'));
    var total_per_survival = name_dim.group().reduceSum(dc.pluck('total'));

    dc.pieChart('#total-survival-piechart')
        .height(300)
        .radius(75)
        .transitionDuration(1500)
        .dimension(name_dim)
        .group(total_per_survival)
        .colors(d3.scale.ordinal().range(['#56A5EC', '#ED9C55', '#3EA99F', '#E67451']));;
}

function show_survival_by_class_and_gender(ndx) {
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

    var stackedChart = dc.barChart("#survival-by-class-and-gender");
    stackedChart
        .width(400)
        .height(300)
        .dimension(name_dim)
        .group(survivalByClassYes, "Survived")
        .stack(survivalByClassNo, "Perished")
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .colors(d3.scale.ordinal().range(['#56A5EC', '#ED9C55', '#3EA99F', '#E67451']))
        .legend(dc.legend().x(320).y(20).itemHeight(15).gap(5));
    stackedChart.margins().right = 100;
}

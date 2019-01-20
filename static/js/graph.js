queue()
    /*Include the Titanic csv file*/ 
    .defer(d3.csv, "data/Titanic.csv")
    .await(makeGraphs);

function makeGraphs(error, titanicData) {
    /*Create a crossfilter instance*/ 
    var ndx = crossfilter(titanicData);

    titanicData.forEach(function(d) {
        d.total = parseInt(d.total);
    });
    /*Call all functions*/ 
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
    dc.renderAll();
}

/*selectors for displaying information for classes, gender, survival rates and age groups*/

function show_class_selector(ndx) {
    dim = ndx.dimension(dc.pluck('classification'));
    group = dim.group()
    dc.selectMenu("#class-selector")
        .dimension(dim)
        .group(group);
}

function show_gender_selector(ndx) {
    dim = ndx.dimension(dc.pluck('sex'));
    group = dim.group()
    dc.selectMenu("#gender-selector")
        .dimension(dim)
        .group(group);
}

function show_average_selector(ndx) {
    dim = ndx.dimension(dc.pluck('survived'));
    group = dim.group()
    dc.selectMenu("#average-selector")
        .dimension(dim)
        .group(group);
}

function show_age_selector(ndx) {
    dim = ndx.dimension(dc.pluck('age'));
    group = dim.group()
    dc.selectMenu("#age-selector")
        .dimension(dim)
        .group(group);

}


/*pieCharts for displaying information for classes, gender, age groups and survival rates*/

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
        .colors(d3.scale.ordinal().range(['#75251F', '#3B2810', '#1F4B75', '#1F7561']));
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
        .colors(d3.scale.ordinal().range(['#1F4B75', '#75251F']));
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
        .colors(d3.scale.ordinal().range(['#1F7561', '#75251F']));
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
        .colors(d3.scale.ordinal().range(['#3B2810', '#1F7561']));
}


/*barChart for displaying the gender of humans in each group onboard*/

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
        .colors(d3.scale.ordinal().range(['#6AA9F6', '#F67D6A', '#F6F16A', '#86F66A']))
        .legend(dc.legend().x(266).y(19).itemHeight(13).gap(10))
        .margins({ top: 10, right: 100, bottom: 30, left: 30 });
}


/*stackedCharts for showing survival rates by class, gender and age*/

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
        .colors(d3.scale.ordinal().range(['#00E083', '#E40000']))
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
        .colors(d3.scale.ordinal().range(['#00E083', '#E40000']))
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
        .colors(d3.scale.ordinal().range(['#00E083', '#E40000']))
        .legend(dc.legend().x(210).y(15).itemHeight(12).gap(5));
    stackedChart.margins({ top: 10, right: 50, bottom: 30, left: 50 });
}


/*rowChart for displaying the amount of humans in each group onboard*/

function show_class_balance_rowchart(ndx) {
    var dim = ndx.dimension(dc.pluck('classification'));
    var group = dim.group();
    dc.rowChart("#class-balance-rowchart")
        .width(360)
        .height(270)
        .dimension(dim)
        .group(group)
        .colors(d3.scale.ordinal().range(['#86F66A', '#F6F16A', '#6AA9F6', '#F67D6A']))
        .xAxis().ticks(4);
}


/*numberDisplay; returns the count for currently selected criteria*/

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

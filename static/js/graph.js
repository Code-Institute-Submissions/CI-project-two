queue()
    .defer(d3.csv, "data/Titanic.csv")
    .await(makeGraphs);
    
    function makeGraphs(error, titanicData) {
        var ndx = crossfilter(titanicData);
        
        show_class_selector(ndx);
        show_class_balance(ndx);
        show_gender_selector(ndx);
        show_gender_balance(ndx);
        show_average_balance(ndx);
        show_average_selector(ndx);
        show_age_balance(ndx);
        show_age_selector(ndx)
        dc.renderAll();
    }
    
    
      //============================================//
   
    function show_class_balance(ndx) {
    var dim = ndx.dimension(dc.pluck('class'));
    var group = dim.group();
    
    dc.barChart("#class-balance")
    .width(400)
    .height(300)
    .margins({top: 10, right: 50, bottom: 30, left: 50})
    .dimension(dim)
    .group(group)
    .transitionDuration(1500)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Class")
    .yAxis().ticks(10);
    
    }
    
     function show_class_selector(ndx){
        dim = ndx.dimension(dc.pluck('class'));
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
    .width(400)
    .height(300)
    .margins({top: 10, right: 50, bottom: 30, left: 50})
    .dimension(dim)
    .group(group)
    .transitionDuration(1500)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Gender")
    .yAxis().ticks(12);
    
    }
    
      function show_gender_selector(ndx){
        dim = ndx.dimension(dc.pluck('sex'));
        group = dim.group()
        
        dc.selectMenu("#gender-selector")
        .dimension(dim)
        .group(group);
        
    }
   
   
   
     //============================================//
   function show_average_balance(ndx) {
    var dim = ndx.dimension(dc.pluck('survived'));
    var group = dim.group();
    
    dc.barChart("#average-balance")
    .width(400)
    .height(300)
    .margins({top: 10, right: 50, bottom: 30, left: 50})
    .dimension(dim)
    .group(group)
    .transitionDuration(1500)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Survival Rate")
    .yAxis().ticks(10);
    
    }
    
    function show_average_selector(ndx){
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
    .width(400)
    .height(300)
    .margins({top: 10, right: 50, bottom: 30, left: 50})
    .dimension(dim)
    .group(group)
    .transitionDuration(1500)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Survival By Age Group")
    .yAxis().ticks(8);
    
    }
    
  function show_age_selector(ndx){
        dim = ndx.dimension(dc.pluck('age'));
        group = dim.group()
        
        dc.selectMenu("#age-selector")
        .dimension(dim)
        .group(group);
        
    }
    
    
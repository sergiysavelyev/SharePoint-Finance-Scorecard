<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <script type="text/javascript">

    window.onload = RefreshMonth;

function RefreshMonth() {
var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'); 
var thetime = new Date(); 
var themonth1 = thetime.getMonth();
if (themonth1 == 0) {
    var themonth = 12;
} else {
   var themonth = themonth1-1;
}
var mstring=months[themonth];
var theyear = thetime.getFullYear();
var ystring = theyear.toString();
var monthyear= mstring.concat("-",ystring);
var monthBox = document.getElementById ("monthSelect");
monthBox.selectedIndex = themonth;
 }


    google.charts.load('45', {packages:['corechart'],"callback": displayChart});
    google.charts.setOnLoadCallback(displayChart);
  
function displayChart() {
     
     loadListItems('Finance Scorecard')
     .done(function(data){
          var items = data.d.results;  
          drawChart(items); 
     })
     .fail(function(error){
          console.log(error);
     });
 }

function drawChart(items) {

    var accountBox = document.getElementById ("accountSelect");
    var accountValue = accountBox.options[accountBox.selectedIndex].text;
    var monthBox = document.getElementById ("monthSelect");
    var monthValue = monthBox.options[monthBox.selectedIndex].text;

    var aActual;
    var aBudget;

    switch (accountValue) {
    case "All Accounts":
        aActual = "AllActual";
        aBudget = "AllBudget";
        break; 
    case "Uniform":
        aActual = "wrya";
        aBudget = "uBudget";
        break;
    case "Office Supplies":
        aActual = "hgwk";
        aBudget = "bc2c";
        break;
    case "Printing":
        aActual = "jium";
        aBudget = "pqoo";
        break;
    }


    var dataTable1 = new google.visualization.DataTable();
    dataTable1.addColumn({ type: 'string', id: 'Ship' });
    dataTable1.addColumn({ type: 'number', id: 'Budget1' });
    dataTable1.addColumn({ type: 'number', id: 'Actual1' });

    for (var i = 0; i < items.length-1; i++) {
     if (monthValue.toString() == items[i]['tsrg'].toString()) {
     myVal1 = parseFloat(items[i][aBudget]);
     myVal2 = parseFloat(items[i][aActual]);
     dataTable1.addRows([[
        items[i]['Ship'],myVal1,myVal2]]);
    }
    }

dataTable1.sort({column: 2, desc: true});
dataTable1.removeColumn(2);

    var dataTable2 = new google.visualization.DataTable();
    dataTable2.addColumn({ type: 'string', id: 'Ship' });
    dataTable2.addColumn({ type: 'number', id: 'Actual2' });

    for (var i = 0; i < items.length-1; i++) {
     if (monthValue.toString() == items[i]['tsrg'].toString()) {
     myVal3 = parseFloat(items[i][aActual]);
     dataTable2.addRows([[
        items[i]['Ship'],myVal3]]);
    }
    }

   dataTable2.sort({column: 1, desc: true});

    var colChartDiff = new google.visualization.ColumnChart(document.getElementById('colchart_diff'));
    var options = { legend: { position: 'none' },
                            diff: { newData: { widthFactor: 0.6 }, oldData: { opacity: 0.8, color: '#9FF781' } },
                            vAxis: {title: '$'},
                            hAxis: {textStyle: {fontSize: 10}},
                            tooltip: { isHtml: true },
                            chartArea:{width:'90%'},
                            allowHtml: true,
     };

    var diffData = colChartDiff.computeDiff(dataTable1, dataTable2);

    google.visualization.events.addListener(colChartDiff,'onmouseover',selectHandler);

    function selectHandler(){
      console.log("Entered");
      $('#colchart_diff').on("DOMNodeInserted",function(e){
    	  //console.log(e.target);
        if($(e.target).is('.google-visualization-tooltip')){
        	console.log(document.getElementsByClassName('google-visualization-tooltip-item')[1].getElementsByTagName('span')[0].innerHTML);
        	document.getElementsByClassName('google-visualization-tooltip-item')[1].getElementsByTagName('span')[0].innerHTML = accountValue;
        	document.getElementsByClassName('google-visualization-tooltip-item')[2].getElementsByTagName('span')[0].innerHTML = "Actual:";
                document.getElementsByClassName('google-visualization-tooltip-item')[3].getElementsByTagName('span')[0].innerHTML = "Budget:";
        }
      })
    }

    colChartDiff.draw(diffData, options);
   
function updateDiv() { 
    $( "#colchart_diff" ).load(window.location.href + " #colchart_diff" );
}
}


function loadListItems(listTitle){
    var monthBox = document.getElementById ("monthSelect");
    var monthValue = monthBox.options[monthBox.selectedIndex].text;
    return $.ajax({            
    url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('" + listTitle + "')/items?$top=1000",
             type: "GET",
             headers: {
                    "accept": "application/json;odata=verbose",
             }
     });             
}


</script>

<p></p>
<hr style="height:1px;border-top:1px solid #848484" />
<div>
<select id="accountSelect" onchange="displayChart()">
      <option value="All Accounts" selected>All Accounts</option>
      <option value="Uniforml">Uniform</option>
      <option value="Office Supplies">Office Supplies</option>
      <option value="Printing">Printing</option>
</select>
 &nbsp;
<select id="monthSelect" onchange="displayChart()">
      <option value="January-2019">January-2019</option>
      <option value="February-2019">February-2019</option>
      <option value="March-2019">March-2019</option>
      <option value="April-2019">April-2019</option>
      <option value="May-2019">May-2019</option>
      <option value="June-2019">June-2019</option>
      <option value="July-2018">July-2018</option>
      <option value="August-2018">August-2018</option>
      <option value="September-2018">September-2018</option>
      <option value="October-2018">October-2018</option>
      <option value="November-2018">November-2018</option>
      <option value="December-2018">December-2018</option>
</select>
</div>
<div style="margin-top: 6px;width:160px;height:20px">
<Label  style="width:45px;height:17px;background-color: #9FF781">&nbspBudget&nbsp</Label>
<Label  style="margin-left: 5px;width:45px;height:17px;background-color: #2a6cd6;color: white">&nbspActual&nbsp</Label>
</div>

<div id='colchart_diff' style='width: 1400px; height: 400px; display: inline-block'></div>
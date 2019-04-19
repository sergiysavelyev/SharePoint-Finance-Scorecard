<script type="text/javascript">

window.onload = HideControl;

function sharePointReady2() {
SP.SOD.executeFunc('sp.js', 'SP.ClientContext',sharePointReady);
}

function sharePointReady() {

var input = document.getElementById ("fileToUpload");

input.addEventListener('change', function(e) {
var file = input.files[0];
var textType = /text.*/;

if (file.type.match(textType)) {
    var reader = new FileReader();
    reader.onload = function(e) {
                    var ctx = new SP.ClientContext('http://cclportal.carnival.com/fin/fso/ffo');
                    var oList = ctx.get_web().get_lists().getByTitle('Finance Scorecard');
                    var itemCreateInfo = new SP.ListItemCreationInformation();
                    var rows = e.target.result.split("\n");
                    for (var i = 0; i < rows.length; i++) {
                    var cells = rows[i].split(",");
                      var oListItem = oList.addItem(itemCreateInfo);
		      oListItem.set_item('Ship', cells[0]);
		      oListItem.set_item('tsrg', cells[1]); //Period
		      oListItem.set_item('wrya', cells[2]); //Uniform Actual
		      oListItem.set_item('_x0072_eq3', cells[3]); //Uniform Budget
		      oListItem.set_item('hgwk', cells[4]); //Office Actual
		      oListItem.set_item('bc2c', cells[5]); //Office Budget
		      oListItem.set_item('jium', cells[6]); //Printing Actual
		      oListItem.set_item('pqoo', cells[7]); //Printing Budget
		      oListItem.update();
                      //ctx.load(oListItem);
                      
                    }
                ctx.executeQueryAsync(Function.createDelegate(this, onQuerySucceeded), Function.createDelegate(this, onQueryFailed));
delete ctx;
}

reader.readAsText(file);  
 
} else {
  alert("File not supported");
}


//delete ctx;
});

document.getElementById('fileToUpload').click();

}

function onQuerySucceeded() {
    alert('Successfully Uploaded');
    __doPostBack('','');
}

function onQueryFailed(sender, args) {
    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}

function IsCurrentUserMemberOfGroup(groupName, OnComplete) {

        var currentContext = new SP.ClientContext('http://cclportal.carnival.com/fin/fso/ffo');
        var currentWeb = currentContext.get_web();

        var currentUser = currentContext.get_web().get_currentUser();
        currentContext.load(currentUser);

        var allGroups = currentWeb.get_siteGroups();
        currentContext.load(allGroups);

        var group = allGroups.getByName(groupName);
        currentContext.load(group);

        var groupUsers = group.get_users();
        currentContext.load(groupUsers);

        currentContext.executeQueryAsync(OnSuccess,OnFailure);

        function OnSuccess(sender, args) {
            var userInGroup = false;
            var groupUserEnumerator = groupUsers.getEnumerator();
            while (groupUserEnumerator.moveNext()) {
                var groupUser = groupUserEnumerator.get_current();
                if (groupUser.get_id() == currentUser.get_id()) {
                    userInGroup = true;
                    break;
                }
            }  
            OnComplete(userInGroup);
        }

        function OnFailure(sender, args) {
            OnComplete(false);
        }    
}

function HideControl() {

var userFound = false;
IsCurrentUserMemberOfGroup("Sr Fleet Finance Managers", function (isCurrentUserInGroup) {
if(isCurrentUserInGroup) {
     document.getElementById('importButton').style.visibility = 'visible';
     userFound = true;
   } else {
     document.getElementById('importButton').style.visibility = 'hidden'; 
   }
});
}



</script>

<input type="button" onclick="sharePointReady2()" id="importButton" value="Upload Finance Actuals CSV file"></input>
<input type="file" id="fileToUpload" size="50"  style="display: none; />
<label id="spacelabel"></label>
<p></p>
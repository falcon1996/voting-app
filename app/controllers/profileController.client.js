var $ = require("jquery");

$(document).ready(function addFieldToNewPoll() {
    var counter=2;
    $("#addbutton").click(function(){
        if (counter > 10) {
            alert("You can Select Only 10  Subjects \n In one Session ");
            return false;
        }
        
        var newTextBoxDiv = $(document.createElement('div')).attr("id", "TextBoxDiv1" + counter);
        newTextBoxDiv.after().html('<input type="text" name="TextBox A ' + counter + ' value="" >');
    })
});
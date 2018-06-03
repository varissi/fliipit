$(document).ready(function(){
    var QTY = $('#qty');
    var TOTAL = $('#total');
    var PUNIT = $('#punit');
    QTY.on('change',function(){
        var total = Math.floor(QTY.val()) * parseFloat(PUNIT.text());
        TOTAL.text(total);
    });

});
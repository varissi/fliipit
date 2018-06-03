$(document).ready(function(){
    function hideNotification(){
        $("#alert").delay(5000).detach(); 
    };
    window.setTimeout( hideNotification, 5000 );


    function columnChart(){
        var item = $('.chart', '.column-chart').find('.item'),
        itemWidth = 100 / item.length;
        item.css('width', itemWidth + '%');
        
        $('.column-chart').find('.item-progress').each(function(){
            var itemProgress = $(this),
            itemProgressHeight = $(this).parent().height() * ($(this).data('percent') / 100);
            itemProgress.css('height', itemProgressHeight);
        });
    };

    columnChart()

    $('footer .rights span').text((new Date()).getFullYear())
});
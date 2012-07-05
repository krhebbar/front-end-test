var TableDemo = {
  initialdata:[{"name": "Apple", "code": "APPL", "value": "111" , "bid": "112", "offer": "110"},
               {"name": "Microsoft", "code": "MSFT", "value": "78" , "bid": "70", "offer": "75"},
               {"name": "Google", "code": "GOGL", "value": "101" , "bid": "98", "offer": "102"},
               {"name": "Nokia", "code": "NOK", "value": "10" , "bid": "8", "offer": "9"},
               {"name": "Samsung", "code": "SAMS","value": "89", "bid": "86", "offer": "90"},
               {"name": "Intel Corporation", "code": "INTC", "value": "111" ,"bid": "112","offer": "110"}],
  firstUpdate:[{"code": "APPL", "bid": "100"},
               {"code": "NOK", "offer": "10", "value": "11"}],
  secondUpdate:[{"code": "GOGL","bid": "97"}],
  initializeMockdata: function() {
    $.mockjax({
      url: '/initialdata',
      responseTime: 100,
      responseText: {
        status: 'success',
        data: TableDemo.initialdata
      }
    });
    $.mockjax({
      url: '/firstupdate',
      responseTime: 100,
      responseText: {
        status: 'success',
        data: TableDemo.firstUpdate
      }
    });
    $.mockjax({
      url: '/secondupdate',
      responseTime: 100,
      responseText: {
        status: 'success',
        data: TableDemo.secondUpdate
      }
    });
  },
  loadInitialData: function(){
    $.get('/initialdata', function(data, textStatus, xhr) {
      var rows = "";
      $.each(data.data, function(i, val) {
        rows = rows + '<tr data-attr="'+this.code+'">\
          <td class="aleft" data-attr="name">'+this.name+'</td>\
          <td class="aleft" data-attr="code">'+this.code+'</td>\
          <td class="aright" data-attr="value">'+this.value+'</td>\
          <td class="aright" data-attr="bid">'+this.bid+'</td>\
          <td class="aright" data-attr="offer">'+this.offer+'</td>\
        </tr>';
      });
      $('table tbody').append(rows);
    });
  },
  setupPolling: function(){
    window.setTimeout(function() {
        $.get('/firstupdate', function(data, textStatus, xhr) {
          TableDemo.updateData(data.data);
        });
    }, 5000);

    window.setTimeout(function() {
        $.get('/secondupdate', function(data, textStatus, xhr) {
          TableDemo.updateData(data.data);
        });
    }, 10000);
  },
  updateData: function(data){
    var $row
    $.each(data, function(index, val) {
      $row = $('table tr[data-attr="'+this.code+'"]');
      if($row.get(0)){
          $.each(this, function(index, val) {
            var $el = $row.find('td[data-attr="'+index+'"]');
            var oldvalue = parseInt($el.text());
            var newvalue = parseInt(val); 
                if (oldvalue>newvalue) {
                  $el.addClass('up');
                  $el.html(val)
                }else if(oldvalue<newvalue){
                  $el.addClass('down');
                  $el.html(val)
                }else{
                  $el.removeClass();
                }
          });
      }
    });
  }
};
$(function() {
  TableDemo.initializeMockdata();
  TableDemo.loadInitialData();
  TableDemo.setupPolling()
});
   //method to trigger when user hits enter key
  $("#shout_message").keypress(function(evt) {
    if(evt.which == 13) {
        var message = $('#shout_message').val();
        var post_data = {'message':message};
        jQuery.post('/api/v1/post', post_data, function(data, textStatus, xhr) {
          //append data into messagebox with jQuery fade effect!
          $(data).hide().appendTo('.message_box').fadeIn();
  
          //keep scrolled to bottom of chat!
          var scrolltoh = $('.message_box')[0].scrollHeight;
          $('.message_box').scrollTop(scrolltoh);
          
          
          $('#shout_message').val('');
          
        }).fail(function(err) { 
        
        
        console.log(err.statusText); 
        });
      }
  });
$(document).ready(function() {
  // load messages every 1000 milliseconds from server. from this url /api/v1/post
  // load_data = {'fetch':1};
  // window.setInterval(function(){
  //  $.post('/api/v1/post', load_data,  function(data) {
  //   $('.message_box').html(data);
  //   var scrolltoh = $('.message_box')[0].scrollHeight;
  //   $('.message_box').scrollTop(scrolltoh);
  //  });
  // }, 10000000000);


  $('.toggle_chat').slideToggle();


  //now change state accordingly of user click
  $(".close_btn").click(function (e) {
    //get CSS display state of .toggle_chat element
    var toggleState = $('.toggle_chat').css('display');
    
    //toggle show/hide chat box
    $('.toggle_chat').slideToggle();
    
    //use toggleState var to change close/open icon image
    if(toggleState == 'block')
    {
      $(".header div").attr('class', 'open_btn');
    }else{
      $(".header div").attr('class', 'close_btn');
    } 
  });
  $(".header div").attr('class', 'open_btn');
});

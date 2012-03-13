function loadModule(moduleUrl,moduleName,submoduleName){  
  $('#tabs>li.active').removeClass('active');
  $('#'+moduleName).addClass('active');
  $.get(moduleUrl, function(result){
    $("#contentDiv").html(result);
    $("#contentDiv").show();
  });
}

function showChangePassword(){
  $('#changePassword').modal('show');
}

function closeChangePasswordWindow(){
  $('#changePassword').modal('hide');
  $('#result').empty();
  $('#password_old').val('');
  $('#password_new').val('');
  $('#password_confirm').val('');
}

function changePassword(){
  var password_old = $('#password_old').val();
  var password_new = $('#password_new').val();
  var password_confirm = $('#password_confirm').val();
  if(password_new != password_confirm){
    $('#result').html("<span style='color:#FF0000'>"+"The new password and confirm password should be same."+"<span>");
      return;
  }
  var data = {'action':'changePassword','password_new': password_new, 'password_old': password_old};   
  $.post('/auth/invoke?', data, function(response, status){
    console.log(response)
    if(response.success === true){
      $('#result').html("<span style='color:green'>"+response.message+"</span>");
      setTimeout("closeChangePasswordWindow()",4000);
    }else if(response.type ==='error' || response.type ==='failure'){
      $('#result').html("<span style='color:#FF0000'>"+response.message+"<span>");
    }
  });      
}

function logout(){
  var data={};
  data['action']= 'logout';
  $.post('/auth/invoke?', data, function(response, status){
    console.log(response);
    if(response.success === true){
      window.location= response.url;
    }else if(response.type ==='error' || response.type ==='failure'){
      $('#status').html("<span style='color:#FF0000'>"+response.message+"<span>");
    }
  });
}
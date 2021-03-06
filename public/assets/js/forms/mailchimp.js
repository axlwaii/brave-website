//TODO: add timeout handler and ui notification

$("#formRequestBuildSubmit").on('click', function() {
  var formData = $('#formRequestBuild').serializeObject()
  if(formData.MERGE0 && formData.MERGE0 != '') {
    if(!validateEmail(formData.MERGE0))
    {
      alert('Please check Email format.')
      return false
    }
    formData.call = 'getbrave'
    var crumb = getCookie('crumb')
    if(!crumb) {
      alert('cookie error: Please make sure cookies are enabled. You may need to delete your cookies and try again.')
      return false
    }
    formData.crumb = crumb
    $("#formRequestBuildSubmit").text('Sending...')
    $.ajax({
       url: '/api/mailchimp',
       type: 'POST',
       xhrFields: {
          withCredentials: true
       },
       dataType: 'json',
       data: formData,
       error: function(err) {console.log('err',err)
          // ajaxPostInProgress = false
          $("#formRequestBuild").html('<h2>'+err.responseText+'</h2>')
       },
       success: function(data) {
          // ajaxPostInProgress = false
          if(data.euid)
          {
            $("#formRequestBuild").html($('#formRequestBuildThankYou').html())
          }
          else
          {
            console.log('failed',data)
            $("#formRequestBuild").html(data)
          }
       }
    });
  }
})

$("#formNewsletterSubscriptionSubmit").on('click', function() {
  var formData = $('#formNewsletterSubscription').serializeObject()
  console.log(formData)
  if(formData.newsletteremail && formData.newsletteremail != '') {
    if(!validateEmail(formData.newsletteremail))
    {
      alert('Please check Email format.')
      return false
    }
    formData.call = 'newsletter'
    var crumb = getCookie('crumb')
    if(!crumb) {
      alert('cookie error: Please make sure cookies are enabled. You may need to delete your cookies and try again.')
      return false
    }
    formData.crumb = crumb
    $("#formNewsletterSubscriptionSubmit").text('Sending...')
    $.ajax({
       url: '/api/mailchimp',
       type: 'POST',
       xhrFields: {
          withCredentials: true
       },
       dataType: 'json',
       data: formData,
       error: function(err) {console.log('err',err)
          alert(err.responseText)
       },
       success: function(data) {
          console.log(data)
          if(data.euid)
          {
            $("#mailchimpNewsletterConfirmationModal").modal('show')
            $("#formNewsletterSubscriptionSubmit").text('Subscribed!')
            $("#formNewsletterSubscriptionSubmit").attr('disabled',true)
            $("#newsletteremail").attr('disabled',true)
          }
          else
          {
            console.log('failed',data)
            alert(data)
          }
       }
    });
  }
})

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

$.fn.serializeObject = function()
{
    var o = {}
    var a = this.serializeArray()
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]]
            }
            o[this.name].push(this.value || '')
        } else {
            o[this.name] = this.value || ''
        }
    })
    return o
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
} 

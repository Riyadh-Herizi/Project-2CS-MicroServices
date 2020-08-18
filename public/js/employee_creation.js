function create() {
    $.ajax({
        url: '/client/add',
        type: 'POST',
        cache: false,
        data: { email:document.getElementById("email").value,
            firstName:document.getElementById("firstName").value,
            lastName : document.getElementById("lastName").value,
            password :document.getElementById("password").value,
            confirmPassword:document.getElementById("confirmPassword").value },
        success: function(data){
            alert(data)
        }
        , error: function(jqXHR, textStatus, err){
            alert('text status '+textStatus+', err '+err)
        }
    })
}
function create_planning(){
        
    var id_group=document.getElementById("groups_select").options[document.getElementById("groups_select").selectedIndex].value;

    $.ajax({
        url: '/planning_control/create_planning',
        type: 'POST',
        cache: false,
        data: {
            name: document.getElementById("planning_name2").value,
            id_group: id_group,
            start:document.getElementById("start").value,
            end:document.getElementById("end").value
        },
        success: function(data){
               window.location.replace("/planning_control/"+data.id)
        }
        , error: function(jqXHR, textStatus, err){
            alert('status '+textStatus+', err '+err)
        }
    })
}
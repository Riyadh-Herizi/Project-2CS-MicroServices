var json_global ; var json_employees ; var json_time ; var json_constraints ;
var text_global ; var text_employees ; var text_time ; var text_constraints ;
var current_step = "global";
var wait = document.getElementById("wait");
var content_global = document.getElementById("content_global");
var content_time = document.getElementById("content_time");
var content_employees = document.getElementById("content_employees");
var content_constraints = document.getElementById("content_constraints");
var planning_name = document.getElementById("planning_name");
var ed_planning = document.getElementById("ed");
var mult_planning = document.getElementById("mp");
var simple_planning = document.getElementById("sp");
var text ="";
function next_step() {
    if (current_step === "global") {
        text = '{ "planning_name" : "'+planning_name.value+'", ';
        if (ed_planning.checked)     {text = text+' "planning_type" :"education", ';     }
        else if (mult_planning.checked)   {text = text+' "planning_type" :"multiple", ' ;}
        else if (simple_planning.checked) {text = text+' "planning_type" :"simple", '   ;}
        text = text +'"use_accounts" :"'+document.getElementById("use_accounts").checked+'", ';
        text = text +'"allow_change" :"'+document.getElementById("allow_change").checked+'", ';
        text = text +'"employees_other" :"'+document.getElementById("employees_other").checked+'" ';
        json_global =JSON.parse(text +'}');
        text_global = text;
        console.log(json_global);
        content_global.classList.add("d-none");



        wait.classList.remove("d-none");
       getemp();


        setTimeout(function(){
            current_step="employees";
            next_content("employees");
        }, 1400);



    }
    else  if (current_step === "employees") {
        text_employees = text_global +'';



        content_employees.classList.add("d-none");
        wait.classList.remove("d-none");
        setTimeout(function(){
            current_step="time";
            next_content("time");
        }, 1000);
    }
    else  if (current_step === "time") {
        content_time.classList.add("d-none");
        wait.classList.remove("d-none");
        setTimeout(function(){
            current_step="constraints";
            next_content("constraints");
        }, 1000);
    }
    else if (current_step === "constraints") {
        content_constraints.classList.add("d-none");
        wait.classList.remove("d-none");
        setTimeout(function(){
            current_step="generation";
            next_content("generation");
        }, 1000);
    }
    else if (current_step === "generation") {
       // SEND POST TO SERVER
        wait.classList.remove("d-none");

    }
}
function next_content(step) {
    if (step === "global") {
        wait.classList.add("d-none");
        content_global.classList.remove("d-none");
    }
    else  if (step === "employees") {
        wait.classList.add("d-none");
        content_employees.classList.remove("d-none");
    }
    else  if (step === "time") {
        wait.classList.add("d-none");
        content_time.classList.remove("d-none");
    }
    else if (step === "constraints") {
        wait.classList.add("d-none");
        content_constraints.classList.remove("d-none");
    }
    else if (step === "generation") {
        wait.classList.add("d-none");
        content_generation.classList.remove("d-none");
    }
}

function getemp() {
    $.ajax({
        url: '/client/get_emp',
        type: 'POST',
        cache: false,
        data: {},
        success: function(data){
            var emp = document.getElementById("emp_list");

            for(var i = 0; i < data.length; i++) {
                emp.innerHTML = emp.innerHTML + '<tr>\n' +
                    '                                            <td>'+data[i].firstName+'&nbsp;'+data[i].lastName+'</td>\n' +
                    '                                            <td>'+data[i].email+'</td>\n' +
                    '                                            <td> MCA </td>\n' +
                    '                                            <td class="text-center">' +
                    '<button class="btn btn-primary btn-sm">include</button></td> ' +
                    '                                        </tr>';
            }
        }
        , error: function(jqXHR, textStatus, err){
            alert('text status '+textStatus+', err '+err)
        }
    });

}

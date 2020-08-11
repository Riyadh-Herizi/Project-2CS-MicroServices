var compenents = {"day0":[],"day1":[],"day2":[],"day3":[],"day4":[],"day5":[],"day6":[]}
function switch_day_auto(day) {
    var check= document.getElementById("check_box-"+day);
    if(work_days[day]=== 0 ) {
        check.checked =false
        document.getElementById(day).classList.add("bg-secondary");
        document.getElementById(day).style.height="600px";
        document.getElementById(day).classList.remove("bg-white");
        document.getElementById("time-empty-"+day).disabled=true;
        document.getElementById("gap-"+day).style.display="none";
        update_empty_after(day);
        for(let i =0 ;i< sub_entities.length;i++) {
            if(sub_entities[i].day==day){
                restore(sub_entities[i].id)
            }
        }
    }
}
$(function() {
    $( "#0" ).sortable( {
        update :()=>{
            update_time(0)
        }
    });
    $( "#1" ).sortable( {
        update :()=>{
            update_time(1)
        }
    });
    $( "#2" ).sortable( {
        update :()=>{
            update_time(2)
        }
    });
    $( "#3" ).sortable( {
        update :()=>{
            update_time(3)
        }
    });
    $( "#4" ).sortable( {
        update :()=>{
            update_time(4)
        }
    });
    $( "#6" ).sortable( {
        update :()=>{
            update_time(6)
        }
    });
    $( "#5" ).sortable( {
        update :()=>{
            update_time(5)
        }
    });
});
function get_responsible(id,emp_number,sub_entity_id) {
    current_entity=id;
    $.ajax({
        url: '/client/get_responsible',
        type: 'POST',
        cache: false,
        data: {
            id_entity :id
        },
        success: function(data){
            var x ="";
            var empty = true;
            for (var i = 0; i < data.users.length ; i++) {
                empty=false;
                x =x +"<option value='"+data.users[i].id+"'>"+data.users[i].firstName+" "+data.users[i].lastName+"</option>"
            }
            if(empty) {
                document.getElementById("responsible_list").innerHTML ="<h5 class=\"text-primary\">This entity has no responsible</h5>";
            }
            else {
                document.getElementById("responsible_list").innerHTML ="";
                for(let i=0;i<emp_number;i++) {
                    document.getElementById("responsible_list").innerHTML =  document.getElementById("responsible_list").innerHTML +
                        "<div class=\"form-group\">\n" +
                        "  <select class=\" form-control\" id=\"sel-"+sub_entity_id+"-"+i+"\">\n" +
                        x+
                        "  </select>\n" +
                        "</div>"
                }

            }

        }
        , error: function(jqXHR, textStatus, err){
            alert('status '+textStatus+', err '+err)
        }
    })
}
function switch_day(day) {
    var check= document.getElementById("check_box-"+day);
    if(check.checked=== false ) {
        work_days[day] = 0;
        document.getElementById(day).classList.add("bg-secondary");
        document.getElementById(day).style.height="600px";
        document.getElementById(day).classList.remove("bg-white");
        document.getElementById("time-empty-"+day).disabled=true;
        document.getElementById("gap-"+day).style.display="none";
        update_empty_after(day);
        for(let i =0 ;i< sub_entities.length;i++) {
            if(sub_entities[i].day==day){
                restore(sub_entities[i].id)
            }
        }
        document.getElementById(day).innerHTML="";
    }
    else {
        work_days[day] = 1;
        document.getElementById(day).classList.remove("bg-secondary");
        document.getElementById("time-empty-"+day).disabled=false;
        document.getElementById(day).style.height="auto";
        document.getElementById("gap-"+day).style.display="block";
        document.getElementById(day).classList.add("bg-white");
        update_empty(null,day);
    }
}
function on() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("overlay").classList.add("d-flex")
}
function off() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("overlay").classList.remove("d-flex")
    notyf.success('Your planning have been successfully saved!');
}
function off_error() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("overlay").classList.remove("d-flex")
    notyf.error('Ops , try again later!');
}
function off2() {
    document.getElementById("overlay2").style.display = "none";
    document.getElementById("overlay2").classList.remove("d-flex")
}
function on2() {
    document.getElementById("overlay2").style.display = "block";
    document.getElementById("overlay2").classList.add("d-flex")
}
function update_empty_after(id) {

    var num = id % 6 +1;
    var empty=document.getElementById("time-empty-"+num).value;
    for(let i=1;i<7;i++){
        if(i!== id) {
            var temp=document.getElementById("time-empty-"+i).value;
            if(temp.split(":")[0]<empty.split(":")[0]){
                empty=temp;
            }else if(temp.split(":")[0]==empty.split(":")[0]){
                if(temp.split(":")[1]<empty.split(":")[1]){
                    empty=temp;
                }
            }
        }
    }
    for(let i=0;i<7;i++){
        var card = document.getElementById("empty-"+i);
        var time = document.getElementById("time-empty-"+i).value;
        if(i!== id) {  card.style.height=Math.abs(1.1*(((time.split(":")[0]-empty.split(":")[0])*60)+Math.abs(time.split(":")[1]-empty.split(":")[1])))+"px"
        } else {
            card.style.height=0+"px"
        }
    }
}
function add_gaps(day) {
    current_day = day;
}
function confirm_gap() {
    saved_tmp.push(JSON.parse(JSON.stringify(sub_entities.slice(0))));
    var hour_num = document.getElementById("hour_num").value;
    var min_num = document.getElementById("min_num").value;
    document.getElementById(current_day).innerHTML= document.getElementById(current_day).innerHTML + "<div data-hours='"+hour_num+"' data-min='"+min_num+"' data-day='day-"+current_day+"' class=\"card bg-primary rounded-0\" id=\"gap-"+current_day+"-"+gaps_id+"\" style=\" height:"+1.1*((parseInt(hour_num)*60)+parseInt(min_num))+"px;\"><div  class='gap card-body text-center d-flex justify-content-center' style='padding: 0px' > <button class='btn btn-light text-primary ' onclick='delete_gap(this)' style='align-self: center '><i class='fa fa-trash'></i></button></div></div>"
    gaps_id++;
}
function timeline(min) {
    var content="<div class=\" border-primary time card bg-white  text-black  d-flex justify-content-center\" style='margin-top:5px;border-radius: 0px;'  >"+(min)+":00 - "+(min+1)+":00</div>";

    for(let i =min+1 ; i<23 ; i++){
        content = content +"  <div class=\" border-primary time card bg-white text-black d-flex justify-content-center \" style='border-radius: 0px' >"+(i)+":00 - "+(i+1)+":00</div>\n"
    }
    document.getElementById("vertical-time").innerHTML = content;
}
function delete_gap(e) {
    saved_tmp.push(JSON.parse(JSON.stringify(sub_entities.slice(0))));
    var day = e.parentElement.parentElement.parentElement.id;
    e.parentElement.parentElement.remove();
    update_time(day)
}
var saved_tmp= [];
function update_time(id) {
    times[id].current.hour =  times[id].start.hour;
    times[id].current.min =  times[id].start.min;
    var cards = document.querySelectorAll("[data-day=day-"+id+"]")
    cards.forEach(card => {
        if(card.id.toString().includes("card-")) {
            var element = get(card.id.substring(5, card.id.length));
            element.start.hour =  times[id].current.hour;
            element.start.min =  times[id].current.min;
            times[id].current.hour = times[id].current.hour + element.hours ;
            times[id].current.min = times[id].current.min + element.min ;
            if(times[id].current.min>59) {
                times[id].current.hour++;
                times[id].current.min = times[id].current.min - 60 ;
            }
            element.end.hour =  times[id].current.hour;
            element.end.min =  times[id].current.min;
            document.getElementById("time-"+element.id).innerText = time_format(element.start.hour,element.start.min)+" - " +
                time_format(element.end.hour,element.end.min);

        } else  {
            times[id].current.hour =times[id].current.hour + parseInt(card.getAttribute("data-hours")) ;
            times[id].current.min = times[id].current.min +parseInt(card.getAttribute("data-min")) ;
            if(times[id].current.min>59) {
                times[id].current.hour++;
                times[id].current.min = times[id].current.min - 60 ;
            }
        }

    })
}
function save() {
    on()
    var days ="";
    for (let i=0 ;i<7;i++){
        days=days+work_days[i];
    }
    var data ={ data :sub_entities ,id_planning:document.getElementById("id_planning").value,days:days}
    $.ajax({
        url: '/planning_control/save',
        type: 'POST',
        cache: false,
        data: {
            positions : JSON.stringify(data)
        },
        success: function(data){
            if(data.final === true) {
                setTimeout(off, 2000);

            } else {
                setTimeout(function () {
                    off_error() ; on2()
                }, 2000);
            }

        }
        , error: function(jqXHR, textStatus, err){

        }
    })
}
function init_start_days_loading(id) {
    if (compenents["day"+id].length>=1 ) {
        var minimum = {hour:compenents["day"+id][0].start.hour,min:compenents["day"+id][0].start.min};
        for (let i =1; i < compenents["day"+id].length; i++) {
            if (minimum.hour>compenents["day"+id][i].start.hour) {
                minimum.hour=compenents["day"+id][i].start.hour;
                minimum.min =compenents["day"+id][i].start.min;
            }
            else if(minimum.hour===compenents["day"+id][i].start.hour && minimum.min>compenents["day"+id][i].start.min){
                minimum.min =compenents["day"+id][i].start.min;
            }
        }
        document.getElementById("time-empty-"+id).value =time_format(minimum.hour,minimum.min);
    }
    update_empty(null,id)

}
function init_start_days(id) {
    if (compenents["day"+id].length>=1 ) {
        var minimum = {hour:compenents["day"+id][0].start.hour,min:compenents["day"+id][0].start.min};
        for (let i =1; i < compenents["day"+id].length; i++) {
            if (minimum.hour>compenents["day"+id][i].start.hour) {
                minimum.hour=compenents["day"+id][i].start.hour;
                minimum.min =compenents["day"+id][i].start.min;
            }
            else if(minimum.hour===compenents["day"+id][i].start.hour && minimum.min>compenents["day"+id][i].start.min){
                minimum.min =compenents["day"+id][i].start.min;
            }
        }
        document.getElementById("time-empty-"+id).value =time_format(minimum.hour,minimum.min);
    }
    update_empty(null,id)
    saved_tmp.push(JSON.parse(JSON.stringify(sub_entities.slice(0))));

}
function time_format(hour,min) {
    var new_hour = hour+"";
    var new_min = min+"";
    if (new_hour.length===1 ){
        new_hour ="0"+new_hour;
    }
    if (new_min.length===1 ){
        new_min ="0"+new_min;
    }
    return new_hour+":"+new_min
}
function check_complex_day(id) {
    var complex = 0;
    for (let i=0 ; i<sub_entities.length;i++){
        if(sub_entities[i].day=== id ){
            complex =complex+ sub_entities[i].complex*sub_entities[i].entity_complex
        }
    }
    var somme= get_complex();

    var activated_days=0;
    for (let i=0;i<7;i++) {
        if(document.getElementById("check_box-"+i).checked ===true){
            activated_days++;
        }
    }

    if(complex>(somme/activated_days) ) {
        notyf.open({
            type: 'warning',
            message: 'too much <b>pressure</b> on that day',
            duration:10000
        });

    }

}
function get_complex() {
    let somme=0;
    for (let i=0 ; i<sub_entities.length;i++){
        somme =somme+ sub_entities[i].complex*sub_entities[i].entity_complex
    }
    return somme;
}
for (let i=0 ; i<7;i++) {
    init_start_days_loading(i)
}
function affecte_day(id,day) {

    for(var i=0; i<sub_entities.length; i++) {
        if(sub_entities[i].id==id) {
            sub_entities[i].day = day
        }
    }
}
function get(id) {
    for(var i=0; i<sub_entities.length; i++) {
        if(sub_entities[i].id==id) {
            return sub_entities[i]
        }
    }
}
function restore(id) {
    var restore = document.getElementById("card-"+id)
    var id_day = restore.getAttribute("data-day");
    restore.setAttribute("data-day","-1");
    get(id).day=-1;
    document.getElementById("time-"+id).innerText=""
    document.getElementById("restore-"+id).style.display="none"
    document.getElementById("move-h-"+id).style.display="none"
    document.getElementById("emp-"+id).style.display="none"
    document.getElementById("entities").appendChild(restore)
    document.getElementById("card-"+id).style.height="auto"
    document.getElementById("duration-"+id).style.display="block"
    update_time(id_day.substring(4,id_day.length))

}
function restore_prev() {
    compenents.day0=[];
    compenents.day1=[];
    compenents.day2=[];
    compenents.day3=[];
    compenents.day4=[];
    compenents.day5=[];
    compenents.day6=[];
    x="";
    for (let i = 0; i < sub_entities.length ; i++) {
        if(sub_entities[i].day==-1) {
            console.log("i'm here")
            x = x + "  <tr ><td>\n" +
                "               <div data-day='' id=\"card-" + sub_entities[i].id + "\" class=\"card shadow text-center rounded-0 cont\" style=\" background:#ffffff;border: 1px solid rgb(103, 128, 240)\" draggable=\"true\" ondragstart=\"drag(event)\" >\n" +
                "                        <div class=\"card-body card-over\" style=\"padding: 3px 3px 0px 3px; \">\n" +
                "                        <div class=\"card-title d-flex justify-content-between\" style=\" align-self:center;margin-bottom:0px\">\n" +
                "                                               <h5 class=\"card-title\" style=\"font-size: 15px\"> " + sub_entities[i].name + "</h5>\n" +
                "                                                <h5 class=\"card-title text-primary\" id='duration-" + sub_entities[i].id + "' style=\"font-size: 15px\">" + sub_entities[i].hours + "h" + sub_entities[i].min + "min</h5>\n" +
                "                                                <h6 id=\"time-" + sub_entities[i].id + "\" class='card-title' ></h6>" +
                "                                            </div>\n" +
                "                                           <h5 class=\"card-title text-primary\" style=\"font-size: 15px;\">" + sub_entities[i].entity_name + " </h5>\n" +

                "                                          " +
                " </div>\n" +
                "<div class=' justify-content-around middle' > " +
                "<button id='restore-" + sub_entities[i].id + "' style='display: none' onclick='restore(" + sub_entities[i].id + ")' class='  btn btn-outline-primary btn-sm'><i class='fa fa-trash'></i></button>" +
                "<button id='move-h-" + sub_entities[i].id + "' style='display: none'  class='move  btn btn-outline-primary btn-sm'><i class='fa fa-arrows-h'></i></button>" +

                " <div class=\"dropdown\"> " +
                "<button id='emp-" + sub_entities[i].id + "' data-toggle=\"modal\" data-target=\"#responsible\" onclick='get_responsible(" + sub_entities[i].entity_id + "," + sub_entities[i].emp_number + "," + sub_entities[i].id + ")' style='display: none'  class='btn btn-outline-primary btn-sm'><i class='fa fa-users'></i></button>" +
                "</div>   </div>                   <h6 id=\"time-" + sub_entities[i].id + "\" class='card-title' ></h6>  " +
                "   </div>\n" +
                "         </td>\n" +
                "                </tr>";
        }
        else {
            compenents["day"+sub_entities[i].day].push( {
                id: sub_entities[i].id ,
                name : sub_entities[i].name,
                entity_name: sub_entities[i].entity_name ,
                entity_id: sub_entities[i].entity_id,
                emp_number :  sub_entities[i].emp_number,
                emp: [],
                start : {hour: sub_entities[i].start.hour , min :sub_entities[i].start.min},
                end : {hour: sub_entities[i].end.hour, min :sub_entities[i].end.min},
                day: sub_entities[i].day ,
                hours: sub_entities[i].hours ,
                min: sub_entities[i].min }
            )
        }
    }
    for(let i=0;i<7;i++) {
        init_start_days_loading(i)
        var day_cards =""
        for(let j =0 ;j< compenents["day"+i].length;j++) {

            if (j < compenents["day"+i].length-1 ) {
                mins = compenents["day"+i][j+1].start.hour*60+compenents["day"+i][j+1].start.min;
            }
            else {
                mins  = compenents["day"+i][j].end.hour*60+compenents["day"+i][j].end.min;
            }
            let diff = mins - (compenents["day"+i][j].end.hour*60+compenents["day"+i][j].end.min);

            let height = (compenents["day"+i][j].hours*60+compenents["day"+i][j].min)*1.1
            day_cards =day_cards +"  <tr ><td>\n" +
                "               <div data-day='day-"+compenents["day"+i][j].day+"' id=\"card-" + compenents["day"+i][j].id + "\" class=\"card shadow text-center cont rounded-0\" style=\" height:"+height+"px ;background:#ffffff;border: 1px solid rgb(103, 128, 240)\"  draggable=\"true\" ondragstart=\"drag(event)\" >\n" +
                "                        <div class=\"card-body card-over\" style=\"padding: 3px 3px 0px 3px; \">\n" +
                "                        <div class=\"card-title d-flex justify-content-between\" style=\" align-self:center;margin-bottom:0px\">\n" +
                "                                               <h5 class=\"card-title\" style=\"font-size: 15px\"> " + compenents["day"+i][j].name + "</h5>\n" +
                "                                                <h5 class=\"card-title text-primary\" id='duration-" + compenents["day"+i][j].id + "' style=\"display:none;font-size: 15px\">" +compenents["day"+i][j].hours + "h" +compenents["day"+i][j].min + "min</h5>\n" +
                "                                                <h6 id=\"time-" + compenents["day"+i][j].id + "\" class='card-title' >"+  time_format(compenents["day"+i][j].start.hour,compenents["day"+i][j].start.min)+" - "+ time_format(compenents["day"+i][j].end.hour,compenents["day"+i][j].end.min) +"  </h6>" +
                "                                            </div>\n" +
                "                                           <h5 class=\"card-title text-primary\" style=\"font-size: 15px;\">" + compenents["day"+i][j].entity_name + " </h5>\n" +

                "                                          " +
                " </div>\n" +
                "<div class=' justify-content-around middle' > " +
                "<button id='restore-" + compenents["day"+i][j].id + "'  onclick='restore(" + compenents["day"+i][j].id + ")' class='  btn btn-outline-primary btn-sm'><i class='fa fa-trash'></i></button>" +
                "<button id='move-h-" +compenents["day"+i][j].id + "'  class='move  btn btn-outline-primary btn-sm'><i class='fa fa-arrows-h'></i></button>" +

                " <div class=\"dropdown\"> " +
                "<button id='emp-" + compenents["day"+i][j].id + "' data-toggle=\"modal\" data-target=\"#responsible\" onclick='get_responsible(" + compenents["day"+i][j].entity_id + "," + compenents["day"+i][j].emp_number + "," + compenents["day"+i][j].id + ")'  class='btn btn-outline-primary btn-sm'><i class='fa fa-users'></i></button>" +
                "</div>   </div>                   <h6 id=\"time-" + compenents["day"+i][j].id + "\" class='card-title' ></h6>  " +
                "   </div>\n" +
                "         </td>\n" +
                "                </tr>";

            if(diff>0) {day_cards = day_cards+
                "<div data-hours="+diff / 60 +" data-min="+(diff%60)+"' data-day='day-"+ compenents["day"+i][j].day+"' class=\"card bg-primary rounded-0\" id=\"gap-"+ compenents["day"+i][j].day+"-"+gaps_id+"\" style=\" height:"+(diff*1.1)+"px;\"><div  class='gap card-body text-center d-flex justify-content-center' style='padding: 0px' > <button class='btn btn-light text-primary ' onclick='delete_gap(this)' style='align-self: center '><i class='fa fa-trash'></i></button></div></div>"
                gaps_id++;
            }
        }
        document.getElementById(i+"").innerHTML=day_cards;
        switch_day_auto(i)
    }
    document.getElementById("entities").innerHTML =x;

}
function update_empty(e,id) {
    times[id].start.hour=parseInt(document.getElementById("time-empty-"+id).value.split(":")[0]);
    times[id].start.min=parseInt(document.getElementById("time-empty-"+id).value.split(":")[1]);
    times[id].current.hour=parseInt(document.getElementById("time-empty-"+id).value.split(":")[0]);
    times[id].current.min=parseInt(document.getElementById("time-empty-"+id).value.split(":")[1]);
    update_time(id)
    var empty=document.getElementById("time-empty-0").value;
    for(let i=1;i<7;i++){
        var temp=document.getElementById("time-empty-"+i).value;
        if(temp.split(":")[0]<empty.split(":")[0]){
            empty=temp;
        }else
        if(temp.split(":")[0]==empty.split(":")[0]){
            if(temp.split(":")[1]<empty.split(":")[1]){
                empty=temp;
            }
        }
    }

    timeline(parseInt(empty.split(":")[0]))
    for(let i=0;i<7;i++){
        var card = document.getElementById("empty-"+i);
        var time = document.getElementById("time-empty-"+i).value;
        card.style.height=Math.abs(1.1*(((time.split(":")[0]-empty.split(":")[0])*60)+Math.abs(time.split(":")[1]-empty.split(":")[1])))+"px"
    }
}
function allowDrop(ev,e) {
    ev.preventDefault();

}
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
function drop(ev) {
    if (sub_entities.length>0)
    saved_tmp.push(JSON.parse(JSON.stringify(sub_entities.slice(0))));
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var x = document.getElementById(data)
    var sub_entity_id= x.id;
    var day_id= ev.target.id;
    if( ev.target.id != "" && document.getElementById("check_box-"+day_id).checked ===true) {
        var card= get(sub_entity_id.substring(5, sub_entity_id.length));

        var height= ((card.hours*60)+card.min)*1.1;
        document.getElementById("card-"+sub_entity_id.substring(5, sub_entity_id.length)).style.height =height+"px";
        document.getElementById("duration-"+sub_entity_id.substring(5, sub_entity_id.length)).style.display="none"
        var p_day = document.getElementById(ev.dataTransfer.getData("text")).parentElement.id;
        ev.target.appendChild(x);
        document.getElementById("restore-"+sub_entity_id.substring(5, sub_entity_id.length)).style.display ="block"
        document.getElementById("move-h-"+sub_entity_id.substring(5, sub_entity_id.length)).style.display ="block"
        document.getElementById("emp-"+sub_entity_id.substring(5, sub_entity_id.length)).style.display ="block"
        affecte_day(sub_entity_id.substring(5, sub_entity_id.length),day_id);
        document.getElementById("card-"+sub_entity_id.substring(5, sub_entity_id.length)).setAttribute("data-day","day-"+day_id)
        update_time(day_id)
        check_complex_day(day_id);
        if (p_day!== "entities")
            update_time(p_day)

    }
}
var x ="";
timeline(8)
for (let i = 0; i < sub_entities.length ; i++) {
    if(sub_entities[i].day==-1) {
        x = x + "  <tr ><td>\n" +
            "               <div data-day='' id=\"card-" + sub_entities[i].id + "\" class=\"card shadow text-center rounded-0 cont\" style=\" background:#ffffff;border: 1px solid rgb(103, 128, 240)\" draggable=\"true\" ondragstart=\"drag(event)\" >\n" +
            "                        <div class=\"card-body card-over\" style=\"padding: 3px 3px 0px 3px; \">\n" +
            "                        <div class=\"card-title d-flex justify-content-between\" style=\" align-self:center;margin-bottom:0px\">\n" +
            "                                               <h5 class=\"card-title\" style=\"font-size: 15px\"> " + sub_entities[i].name + "</h5>\n" +
            "                                                <h5 class=\"card-title text-primary\" id='duration-" + sub_entities[i].id + "' style=\"font-size: 15px\">" + sub_entities[i].hours + "h" + sub_entities[i].min + "min</h5>\n" +
            "                                                <h6 id=\"time-" + sub_entities[i].id + "\" class='card-title' ></h6>" +
            "                                            </div>\n" +
            "                                           <h5 class=\"card-title text-primary\" style=\"font-size: 15px;\">" + sub_entities[i].entity_name + " </h5>\n" +

            "                                          " +
            " </div>\n" +
            "<div class=' justify-content-around middle' > " +
            "<button id='restore-" + sub_entities[i].id + "' style='display: none' onclick='restore(" + sub_entities[i].id + ")' class='  btn btn-outline-primary btn-sm'><i class='fa fa-trash'></i></button>" +
            "<button id='move-h-" + sub_entities[i].id + "' style='display: none'  class='move  btn btn-outline-primary btn-sm'><i class='fa fa-arrows-h'></i></button>" +

            " <div class=\"dropdown\"> " +
            "<button id='emp-" + sub_entities[i].id + "' data-toggle=\"modal\" data-target=\"#responsible\" onclick='get_responsible(" + sub_entities[i].entity_id + "," + sub_entities[i].emp_number + "," + sub_entities[i].id + ")' style='display: none'  class='btn btn-outline-primary btn-sm'><i class='fa fa-users'></i></button>" +
            "</div>   </div>                   <h6 id=\"time-" + sub_entities[i].id + "\" class='card-title' ></h6>  " +
            "   </div>\n" +
            "         </td>\n" +
            "                </tr>";
    }
    else {

        compenents["day"+sub_entities[i].day].push( {
            id: sub_entities[i].id ,
            name : sub_entities[i].name,
            entity_name: sub_entities[i].entity_name ,
            entity_id: sub_entities[i].entity_id,
            emp_number :  sub_entities[i].emp_number,
            emp: [],
            start : {hour: sub_entities[i].start.hour , min :sub_entities[i].start.min},
            end : {hour: sub_entities[i].end.hour, min :sub_entities[i].end.min},
            day: sub_entities[i].day ,
            hours: sub_entities[i].hours ,
            min: sub_entities[i].min }
        )
    }
}
var mins =0;
for(let i=0;i<7;i++) {
    var day_cards =""
    for(let j =0 ;j< compenents["day"+i].length;j++) {

        if (j < compenents["day"+i].length-1 ) {
            mins = compenents["day"+i][j+1].start.hour*60+compenents["day"+i][j+1].start.min;
        }
        else {
            mins  = compenents["day"+i][j].end.hour*60+compenents["day"+i][j].end.min;
        }
        let diff = mins - (compenents["day"+i][j].end.hour*60+compenents["day"+i][j].end.min);
        let height = (compenents["day"+i][j].hours*60+compenents["day"+i][j].min)*1.1
        day_cards =day_cards +"  <tr ><td>\n" +
            "               <div data-day='day-"+compenents["day"+i][j].day+"' id=\"card-" + compenents["day"+i][j].id + "\" class=\"card shadow text-center cont rounded-0\" style=\" height:"+height+"px ;background:#ffffff;border: 1px solid rgb(103, 128, 240)\"  draggable=\"true\" ondragstart=\"drag(event)\" >\n" +
            "                        <div class=\"card-body card-over\" style=\"padding: 3px 3px 0px 3px; \">\n" +
            "                        <div class=\"card-title d-flex justify-content-between\" style=\" align-self:center;margin-bottom:0px\">\n" +
            "                                               <h5 class=\"card-title\" style=\"font-size: 15px\"> " + compenents["day"+i][j].name + "</h5>\n" +
            "                                                <h5 class=\"card-title text-primary\" id='duration-" + compenents["day"+i][j].id + "' style=\"display:none;font-size: 15px\">" +compenents["day"+i][j].hours + "h" +compenents["day"+i][j].min + "min</h5>\n" +
            "                                                <h6 id=\"time-" + compenents["day"+i][j].id + "\" class='card-title' >"+  time_format(compenents["day"+i][j].start.hour,compenents["day"+i][j].start.min)+" - "+ time_format(compenents["day"+i][j].end.hour,compenents["day"+i][j].end.min) +"  </h6>" +
            "                                            </div>\n" +
            "                                           <h5 class=\"card-title text-primary\" style=\"font-size: 15px;\">" + compenents["day"+i][j].entity_name + " </h5>\n" +

            "                                          " +
            " </div>\n" +
            "<div class=' justify-content-around middle' > " +
            "<button id='restore-" + compenents["day"+i][j].id + "'  onclick='restore(" + compenents["day"+i][j].id + ")' class='  btn btn-outline-primary btn-sm'><i class='fa fa-trash'></i></button>" +
            "<button id='move-h-" +compenents["day"+i][j].id + "'  class='move  btn btn-outline-primary btn-sm'><i class='fa fa-arrows-h'></i></button>" +

            " <div class=\"dropdown\"> " +
            "<button id='emp-" + compenents["day"+i][j].id + "' data-toggle=\"modal\" data-target=\"#responsible\" onclick='get_responsible(" + compenents["day"+i][j].entity_id + "," + compenents["day"+i][j].emp_number + "," + compenents["day"+i][j].id + ")'  class='btn btn-outline-primary btn-sm'><i class='fa fa-users'></i></button>" +
            "</div>   </div>                   <h6 id=\"time-" + compenents["day"+i][j].id + "\" class='card-title' ></h6>  " +
            "   </div>\n" +
            "         </td>\n" +
            "                </tr>";

        if(diff>0) {day_cards = day_cards+
            "<div data-hours="+diff / 60 +" data-min="+(diff%60)+"' data-day='day-"+ compenents["day"+i][j].day+"' class=\"card bg-primary rounded-0\" id=\"gap-"+ compenents["day"+i][j].day+"-"+gaps_id+"\" style=\" height:"+(diff*1.1)+"px;\"><div  class='gap card-body text-center d-flex justify-content-center' style='padding: 0px' > <button class='btn btn-light text-primary ' onclick='delete_gap(this)' style='align-self: center '><i class='fa fa-trash'></i></button></div></div>"
            gaps_id++;
        }
    }
    document.getElementById(i+"").innerHTML=day_cards;
    switch_day_auto(i)
}
document.getElementById("entities").innerHTML=x;
var current_day =-1;
var gaps_id =0;
function KeyPress(e) {
    var evtobj = window.event? event : e;
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
        if(saved_tmp.length>0){
            sub_entities=JSON.parse(JSON.stringify(saved_tmp.pop()));
            console.log(saved_tmp)
            restore_prev();
    }
    }
}

document.onkeydown = KeyPress;
//ondrop="drop(event)" ondragover="allowDrop(event,this)"

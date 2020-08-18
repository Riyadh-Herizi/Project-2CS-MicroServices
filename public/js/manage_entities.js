var current_group;
var current_entity;
function create_sub_entity(){

  var hour=document.getElementById("hour").value;
  var min=document.getElementById("min").value;
  console.log(time);

  $.ajax({
      url: '/client/add_sub_entity',
      type: 'POST',
      cache: false,
      data: {
          id_entity:current_entity,
          sub_entity_name:document.getElementById("sub_entity_name").value,
          hours:hour,
          min:min,
          complexity:document.getElementById("complexity_sub").value,
          repetetion:document.getElementById("repetition").value,
          nb_emp:document.getElementById("nb_emp").value,
          },
      success: function(data){
          get_sub_entities(current_entity);
      }
      , error: function(jqXHR, textStatus, err){
          alert('status '+textStatus+', err '+err)
      }
  })
}

function create_group() {
    $.ajax({
        url: '/client/add_group',
        type: 'POST',
        cache: false,
        data: {
            group_name:document.getElementById("group_name").value,
            },
        success: function(data){
            update_groups();
        }
        , error: function(jqXHR, textStatus, err){
            alert('status '+textStatus+', err '+err)
        }
    })
}
function create_entity() {
    $.ajax({
        url: '/client/add_entity',
        type: 'POST',
        cache: false,
        data: {
            group : current_group,
            entity_name:document.getElementById("entity_name").value,
            complexity:document.getElementById("complexity").value,
        },
        success: function(data){
            update_entities(current_group);
        }
        , error: function(jqXHR, textStatus, err){
            alert('status '+textStatus+', err '+err)
        }
    })
}
function update_groups() {
    $.ajax({
        url: '/client/get_group',
        type: 'POST',
        cache: false,
        data: {
        },
        success: function(data){
            var x ="";
           for (var i = 0; i < data.groups.length ; i++) {
            x = x + "<tr>\n" +
                "                <td class=\"text-center\"> <button class=\"btn btn-sm btn-light text-primary bg-white\" onclick=\"show_group("+data.groups[i].id+")\">\n" +
                "                    "+  data.groups[i].group_name+ "\n" +
                "                    </button>  </td>\n" +
                "                </tr>"

             }

           document.getElementById("groups").innerHTML = x;
        }
        , error: function(jqXHR, textStatus, err){
            alert('status '+textStatus+', err '+err)
        }
    })
}
function update_users() {
    $.ajax({
        url: '/client/get_emp',
        type: 'POST',
        cache: false,
        data: {
        },
        success: function(data){
            var x ="";
           for (var i = 0; i < data.users.length ; i++) {
            x = x + "<tr>\n" +
                "                <td class=\"text-center\"> <button class=\"btn btn-sm btn-light text-primary bg-white\" onclick=\"\">\n" +
                "                    "+  data.users[i].firstName+ "\n" +
                "                    </button>  </td>\n" +
                "                </tr>"

             }

           document.getElementById("users").innerHTML = x;
        }
        , error: function(jqXHR, textStatus, err){
            alert('status '+textStatus+', err '+err)
        }
    })
}
function update_entities(id) {
    $.ajax({
        url: '/client/get_entities',
        type: 'POST',
        cache: false,
        data: {
            id_group: id
        },
        success: function(data){
            var x ="";
            var empty = true;
            for (var i = 0; i < data.entities.length ; i++) {
                empty=false;
                x = x +" <tr>\n" +
                    "                    <td class=\"group text-black font-weight-bold\"> "+data.entities[i].name+"</td>\n" +
                    "                    <td class=\"group text-black font-weight-bold\"> "+data.entities[i].complex+"</td>\n" +
                    "                    <td class=\"group text-black font-weight-bold\">\n"+
                    "                         <button data-toggle=\"modal\" data-target=\"#sub_entity\" onclick=\"get_sub_entities("+data.entities[i].id+")\" class=\"btn btn-info btn-sm text-center text-white\" >Sub-Entities</button>" +
                    "                         <button onclick=\"delete_entity("+data.entities[i].id+")\" class=\"btn btn-danger btn-sm text-center text-white\" ><i class=\"fa fa-trash\"></i></button>\n" +
                    "                        <button onclick=\"get_sub_entities("+data.entities[i].id+")\" class=\"btn btn-warning btn-sm text-center text-white\" ><i class=\"fa fa-pen\"></i></button>\n" +
                    "                    </td>\n" +
                    "                    <td class=\"group text-black font-weight-bold\">\n"+
                    "                         <button data-toggle=\"modal\" data-target=\"#responsibles\" onclick=\"get_responsible("+data.entities[i].id+")\" class=\"btn btn-primary btn-sm text-center text-white\" >Show</button>" +
                    "                    </td>\n" +
                    "                </tr>";
            }

            if(!empty)
            document.getElementById("view").innerHTML = "\n" +
                "            <table class=\"table text-center\">\n" +
                "                <thead>\n" +
                "                <tr>\n" +
                "                    <th class=\"bg-primary text-white font-weight-bold\">Entity name</th>\n" +
                "                    <th class=\"bg-primary text-white font-weight-bold\">Complexity</th>\n" +
                "                    <th class=\"bg-primary text-white font-weight-bold\">Options</th>\n" +
                "                    <th class=\"bg-primary text-white font-weight-bold\">Responsibles</th></tr>\n" +
                "                </thead>\n" +
                "                <tbody>\n" +x+"\n" +
                "                </tbody>\n" +
                "            </table>\n"+"  <button data-toggle=\"modal\" data-target=\"#add_entity\" class=\"btn btn-primary btn-sm text-center text-white\" >Add entity</button>";
        else
                document.getElementById("view").innerHTML ="   <div class=\"container-fluid text-center \" style=\"height: 500px ;" +
                    "  justify-content: center;\n" +
                    "  align-items: center;\">\n" +
                    "\n" +
                    "                <br><br><br><br><br><br>   <br>          <h4 class=\"text-primary\">This group is empty add new entities</h4>\n" +
                    "\n" +"<button data-toggle=\"modal\" data-target=\"#add_entity\" class=\"btn btn-primary btn-sm text-center text-white\" >Add entity</button>"+
                    "                      </div>";
            }
        , error: function(jqXHR, textStatus, err){
            alert('status '+textStatus+', err '+err)
        }
    })
}
function delete_entity(id){
  $.ajax({
    url: '/client/delete_entity',
    type: 'POST',
    cache: false,
    data: {
        id_entity:id,
    },
    success: function(data){
      show_group(current_group);
        }
    , error: function(jqXHR, textStatus, err){
        alert('status '+textStatus+', err '+err)
    }
  })
}
function delete_sub_entity(id){
  $.ajax({
    url: '/client/delete_sub_entity',
    type: 'POST',
    cache: false,
    data: {
        id_sub_entity:id,
    },
    success: function(data){
      get_sub_entities(current_entity);
        }
    , error: function(jqXHR, textStatus, err){
        alert('status '+textStatus+', err '+err)
    }
  })
}
function show_group(id) {
   current_group = id;
    $.ajax({
        url: '/client/show_group',
        type: 'POST',
        cache: false,
        data: {
            id_group:id,
        },
        success: function(data){
            var x ="";
            var empty = true;
            for (var i = 0; i < data.entities.length ; i++) {
                empty=false;
                x = x +" <tr>\n" +
                    "                    <td class=\"group text-black font-weight-bold\"> "+data.entities[i].name+"</td>\n" +
                    "                    <td class=\"group text-black font-weight-bold\"> "+data.entities[i].complex+"</td>\n" +
                    "                    <td class=\"group text-black font-weight-bold\">\n"+
                    "                         <button data-toggle=\"modal\" data-target=\"#sub_entity\" onclick=\"get_sub_entities("+data.entities[i].id+")\" class=\"btn btn-info btn-sm text-center text-white\" >Sub-Entities</button>" +
                    "                         <button onclick=\"delete_entity("+data.entities[i].id+")\" class=\"btn btn-danger btn-sm text-center text-white\" ><i class=\"fa fa-trash\"></i></button>\n" +
                    "                        <button onclick=\"get_sub_entities("+data.entities[i].id+")\" class=\"btn btn-warning btn-sm text-center text-white\" ><i class=\"fa fa-pen\"></i></button>\n" +
                    "                    </td>\n" +
                    "                    <td class=\"group text-black font-weight-bold\">\n"+
                    "                         <button data-toggle=\"modal\" data-target=\"#responsibles\" onclick=\"get_responsible("+data.entities[i].id+")\" class=\"btn btn-primary btn-sm text-center text-white\" >Show</button>" +
                    "                    </td>\n" +
                    "                </tr>";
            }

            if(!empty)
            document.getElementById("view").innerHTML = "\n" +
                "            <table class=\"table text-center\">\n" +
                "                <thead>\n" +
                "                <tr>\n" +
                "                    <th class=\"bg-primary text-white font-weight-bold\">Entity name</th>\n" +
                "                    <th class=\"bg-primary text-white font-weight-bold\">Complexity</th>\n" +
                "                    <th class=\"bg-primary text-white font-weight-bold\">Options</th>\n" +
                "                    <th class=\"bg-primary text-white font-weight-bold\">Responsibles</th></tr>\n" +
                "                </thead>\n" +
                "                <tbody>\n" +x+"\n" +
                "                </tbody>\n" +
                "            </table>\n"+"  <button data-toggle=\"modal\" data-target=\"#add_entity\" class=\"btn btn-primary btn-sm text-center text-white\" >Add entity</button>";
        else
                document.getElementById("view").innerHTML ="   <div class=\"container-fluid text-center \" style=\"height: 500px ;" +
                    "  justify-content: center;\n" +
                    "  align-items: center;\">\n" +
                    "\n" +
                    "                <br><br><br><br><br><br>   <br>          <h4 class=\"text-primary\">This group is empty add new entities</h4>\n" +
                    "\n" +"<button data-toggle=\"modal\" data-target=\"#add_entity\" class=\"btn btn-primary btn-sm text-center text-white\" >Add entity</button>"+
                    "                      </div>";
            }
        , error: function(jqXHR, textStatus, err){
            alert('status '+textStatus+', err '+err)
        }
    })
}

function get_sub_entities(id) {
  current_entity=id;
    $.ajax({
        url: '/client/get_sub_entities',
        type: 'POST',
        cache: false,
        data: {
            id_entity :id
        },
        success: function(data){
            console.log("executed")
            var x ="";
            var empty = true;

            for (var i = 0; i < data.sub_entities.length ; i++) {
                empty=false;
                x = x + "   <tr>\n" +
                    "                                <td class=\"font-weight-bold\">"+ data.sub_entities[i].name+"</td>\n" +
                    "                                <td  class=\"font-weight-bold\">"+data.sub_entities[i].hours+":"+data.sub_entities[i].min+"</td>\n" +
                    "                                <td  class=\"font-weight-bold\">"+data.sub_entities[i].complex+"</td>\n" +
                    "                                <td  class=\"font-weight-bold\">"+data.sub_entities[i].nb_emp+"</td>\n" +
                    "                                <td> <button onclick=\"delete_sub_entity("+data.sub_entities[i].id+")\" class=\"btn btn-primary btn-sm text-center text-white\" >Delete</button></td>"+
                    "                            </tr>\n"

            }
            if(empty) {
                document.getElementById("table").style.display = "none";
                document.getElementById("model_body").innerHTML= "<div id= \"empty\" class=\"container-fluid text-center \" >" +

                    "                  <h5 class=\"text-primary\">This entity is empty add new sub-entities</h5>\n" +
                    "                      </div>";
            }
            else {
                document.getElementById("sub_entities_table").innerHTML=x;
                document.getElementById("table").style.display = "table";
                document.getElementById("empty").style.display = "none";
            }

        }
        , error: function(jqXHR, textStatus, err){
            alert('status '+textStatus+', err '+err)
        }
    })
}
function get_responsible(id) {
    current_entity=id;
    $.ajax({
        url: '/client/get_responsible',
        type: 'POST',
        cache: false,
        data: {
            id_entity :id
        },
        success: function(data){
            console.log("executed")
            var x ="";
            var empty1 = true;
            document.getElementById("users_table").innerHTML="";

            for (var i = 0; i < data.users.length ; i++) {
                empty1=false;
                x = x + "   <tr>\n" +
                    "                                <td class=\"font-weight-bold\">"+ data.users[i].firstName+"</td>\n" +
                    "                                <td  class=\"font-weight-bold\">"+data.users[i].lastName+"</td>\n" +
                    "                                <td> <button class=\"btn btn-primary btn-sm text-center text-white\" >Delete</button></td>"+
                    "                            </tr>\n"

            }
            if(empty1) {
                document.getElementById("table").style.display = "none";
                document.getElementById("model_body").innerHTML= "<div id= \"empty2\" class=\"container-fluid text-center \" >" +

                    "                  <h5 class=\"text-primary\">This entity has no responsible</h5>\n" +
                    "                      </div>";
            }
            else {
                document.getElementById("users_table").innerHTML=x;
                document.getElementById("table2").style.display = "table";
                document.getElementById("empty2").style.display = "none";
            }

        }
        , error: function(jqXHR, textStatus, err){
            alert('status '+textStatus+', err '+err)
        }
    })
}
function create_respo(){

    var id_emp=document.getElementById("select_emp").options[document.getElementById("select_emp").selectedIndex].value;

    $.ajax({
        url: '/client/create_respo',
        type: 'POST',
        cache: false,
        data: {
            id_entity:current_entity,
            id_emp:id_emp
        },
        success: function(data){
           get_responsible(current_entity);
        }
        , error: function(jqXHR, textStatus, err){
            alert('status '+textStatus+', err '+err)
        }
    })
}
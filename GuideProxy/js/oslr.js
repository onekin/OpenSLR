// see: https://github.com/summerstyle/jsonTreeViewer

var slideIndex = 1;
var itIsDisconnected= true;
var pub = {};
var guide =  null;
var host = null;
var port = null;
var user = null;
var password = null;
var viz;

var tab = {
  nav : null, // holds all tabs
  txt : null, // holds all text containers
  init : function () {
  // tab.init() : init tab interface

    // Get all tabs + contents
    tab.nav = document.getElementById("tab-nav").getElementsByClassName("tabnav");
    tab.txt = document.getElementById("tab-contents").getElementsByClassName("tabtxt");

    // Error checking
    if (tab.nav.length==0 || tab.txt.length==0 || tab.nav.length!=tab.txt.length) {
      console.log("ERROR STARTING TABS");
    } else {
      // Attach onclick events to navigation tabs
      for (var i=0; i<tab.nav.length; i++) {
        tab.nav[i].dataset.pos = i;
        tab.nav[i].addEventListener("click", tab.switch);
      }

      // Default - show first tab
      tab.nav[0].classList.add("active");
      tab.txt[0].classList.add("active");
    }
  },

  switch : function () {
  // tab.switch() : change to another tab

    // Hide all tabs & text
    for (var t of tab.nav) {
      t.classList.remove("active");
    }
    for (var t of tab.txt) {
      t.classList.remove("active");
    }
    // Set current tab
    tab.nav[this.dataset.pos].classList.add("active");
    tab.txt[this.dataset.pos].classList.add("active");
  }
};

function enable(el){
  $(el).removeAttr("disabled");
}

function disable(el){
   $(el).attr("disabled", "disabled");
}

function enableAll(el){
  $(el+" *").removeAttr("disabled");
}

function disableAll(el){
    $(el+" *").attr("disabled", "disabled");
}

function hideThis (el){
  $(el).hide();
}

$(document).ready(function(){
    $(".linklike").click(function() {
       $(this).parents('.entry').find('.description').slideToggle(600);
        return false;
    });
    //BUTTON EVENTS
    $("#connect-button").click(function() {
       connect();
    });
    $("#disconnect-button").click(function() {
       disconnect();
    });
    $("#ezker").click(function() {
       plusDivs(-1);
    });
    $("#eskuin").click(function() {
       plusDivs(1);
    });
    $("#play").click(function() {
       loading();
    });
    $("#anulableSetup").click(function() {
       getparameterizedURL();
    });
    $("#run-button").click(function() {
       run2html($("#cypher").val());
    });
    $("#help").click(function() {
       helping();
    });
tab.init ()
    //PROCESSING:
    disconnectedFromNeo4j();
    disconnectedFromGuide()
    //NeoVis.js
    $("#result-form").hide();

    //URL params:
     guide = getUrlParam('guide', 'https://raw.githubusercontent.com/onekin/OpenSLR/master/graphgist/oslr_guide.html');
     host = getUrlParam('host', 'localhost');
     port = getUrlParam('port', 7687);
     user = getUrlParam('user', 'neo4j');
     password = getUrlParam('password', '');
     $("#guide").val (guide);
     $("#host").val(host);
     $("#port").val(port);
     $("#user").val(user);
     $("#password").val(nocode(password));
     dataModelNoCompliance();
     counter = 0;
     if(window.location.href.indexOf("guide") > -1){loading();}
     if(window.location.href.indexOf("host") > -1){counter++}
     if(window.location.href.indexOf("port") > -1){counter++}
     if(window.location.href.indexOf("user") > -1){counter++}
     if(window.location.href.indexOf("password") > -1){counter++}
     if (counter == 4) {
       hideThis('#anulableSetup')
     }
     connect();
});

function helping (){
  rsp = confirm ('This web page is a proxy connecting a Neo4J engine and a cypher guide. ')
  if (!rsp) {return;}
  rsp = confirm ('It works in two modes: Configuration Mode and Preset Mode. ')
  if (!rsp) {return;}
  rsp = confirm ('In Configuration Mode you set the guide and the engine to be connected. Afterwards, you can copy and share the setup URL.')
  if (!rsp) {return;}
  rsp = confirm ('The setup URL opens the proxy with the configuration data connecting a guide and an engine. This is the Preset Mode.')
}

function nocode(pssw){
  var newtxt = "";
  for (var i=0; i< pssw.length;i+=3){
    newtxt += String.fromCharCode(parseInt(pssw.substring(i, i+3)))
  }
  return newtxt;
}

function yescode(pssw){
  var newtxt = "";
  for (var i=0; i< pssw.length;i++){
    newtxt += pad (pssw.charCodeAt(i),3);
    }
  return newtxt;
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getparameterizedURL(){
  guide = $("#guide").val ();
  host = $("#host").val();
  port = $("#port").val();
  user = $("#user").val();
  password = $("#password").val();
  var url = window.location.href.split('?')[0];
  url +='?guide='+guide+'&host='+host+'&port='+port+'&user='+user+'&password='+yescode(password);
  url = encodeURI(url);
  //window.location.href= url;
  //window.location.href.select();
  document.execCommand("copy");
  alert ('Copy this parameterized URL:\n\n\n' + url);
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

function getUrlVars() {
    var vars = {};
    var url = decodeURI(window.location.href);
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
function dataModelCompliance(){
  document.getElementById('w3cIcon').style.backgroundColor = 'honeydew';
  setDataModelManagementStatus('Verified W3C Annotation data model.')
}

function dataModelNoCompliance(){
  document.getElementById('w3cIcon').style.backgroundColor = 'lightcoral';
  setDataModelManagementStatus('No data model compliance.')
}

function connectedToNeo4j(){
  document.getElementById('connectionIcon').style.backgroundColor = 'honeydew';
  itIsDisconnected = false;
  enable("#run-button");
  disableAll('#anulableEngine')
  let q = "call db.schema";
    console.log ('Querying: '+q);
    $('#cypher').val (q);
    run2html(q);
}

function disconnectedFromNeo4j(){
  setConnectionManagementStatus("No connected Neo4j engine...." );
  document.getElementById('connectionIcon').style.backgroundColor = 'lightcoral';
  itIsDisconnected = true;
  disable("#run-button");
  enableAll('#anulableEngine');
  dataModelNoCompliance()
}
function connectedToGuide(){
  setGuideConnectionManagementStatus("Loaded guide." );
  document.getElementById('graphIcon').style.backgroundColor = 'honeydew';
  enable("#ezker");
  enable("#eskuin");
  disableAll('#anulableGuide')
}

function disconnectedFromGuide(){
  setGuideConnectionManagementStatus("There is not a guide..." );
  document.getElementById('graphIcon').style.backgroundColor = 'lightcoral';
  disable("#ezker");
  disable("#eskuin");
  enableAll('#anulableGuide')
}

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = $( "slide" );
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex-1].style.display = "block";
   $( "#num" ).html(slideIndex);
   $( "#numtotal" ).html (x.length);
}

function injectExecutionButtons(){
  var x = $( "pre.code" );
  for (i = 0; i < x.length; i++) {
    let el = x[i];
    elparent = el.parentElement;
    el.setAttribute("id", 'query_'+i);
    var btn = document.createElement("button");
    btn.setAttribute('id', 'button_'+i);
    btn.textContent =  'Run query_'+i;
    btn.setAttribute('onclick', 'runQuery('+i+')');
    elparent.prepend(btn);
  }
}

function runQuery (query){
  let name = "#query_"+query;
  var x = $( name )[0];
  let q = x.textContent;
    console.log ('Querying: '+q);
    $('#cypher').val (q);
    run2html(q);
}



function reRunMultiple(multiquery){
console.log (multiquery)
var lines = multiquery.split(';');
var lineNo = lines.length;
console.log (lineNo)
for (i = 0; i < lineNo; i++) {
  var q = lines[i];
  console.log (i+'>>'+lines[i]);
  run2html (q);
}

}

function loading (){
let url = $( "#guide" ).val();
console.log (url)
$( "#slides" ).load( url , function( response, status, xhr ) {
  if ( status == "error" ) {
    var msg = "Sorry but there was an error: ";
    disconnectedFromGuide();
    setGuideConnectionManagementStatus( msg + xhr.status + " " + xhr.statusText );
  } else {
    connectedToGuide()
    injectExecutionButtons();
    showDivs(slideIndex);
//NO    //MathJax.startup.document.render();
/*    MathJax.texReset();
    MathJax.typesetClear();
    MathJax.typesetPromise().catch(function (err) {
      output.innerHTML = '';
      output.appendChild(document.createTextNode(err.message));
      console.error(err);
    }).then(function () {
      console.log('ok')
    });*/
  }
});
}

  function setGuideConnectionManagementStatus(message) {
    $( "#playStatus" ).html(message );
  }

/////js2Neo4

  function setConnectionManagementStatus(message) {
    $( "#connection-management-status" ).html(message );
  }

    function setDataModelManagementStatus(message) {
      $( "#data-model-status" ).html(message );
    }

  function connect() {
      pub.cx = js2neo.open({secure:false,
          host: document.getElementById("host").value,
          port: parseInt(document.getElementById("port").value),
          user: document.getElementById("user").value,
          password: document.getElementById("password").value,
          onOpen: function(metadata) {
              // for (var key in metadata) {
              //     if (metadata.hasOwnProperty(key)) pub[key] = metadata[key];
              // }
              // setConnectionManagementStatus("success", "Connected to " + pub.host + " on port " + pub.port);
              connectedToNeo4j();
          },
          onHandshake: function(metadata) {
              // for (var key in metadata) {
              //     if (metadata.hasOwnProperty(key)) pub[key] = metadata[key];
              // }
              // setConnectionManagementStatus("success", "Using Bolt protocol v" + pub.protocolVersion);
          },
          onInit: function(metadata) {
              for (var key in metadata) {
                  if (metadata.hasOwnProperty(key)) pub[key] = metadata[key];
              }
              setConnectionManagementStatus("Connected with Bolt v" + pub.protocolVersion + " to " + pub.host + " on port " + pub.port + " as user " + pub.user);
          },
          onInitFailure: function(failure) {
              setConnectionManagementStatus(failure.code + ": " + failure.message);
              disconnectedFromNeo4j();
          },
          onClose: function(event) {
              switch (event.code)
              {
                  case 1000:
                  case 1001:
                      setConnectionManagementStatus();
                      break;
                  case 1006:
                      setConnectionManagementStatus("Connection failed");
                      break;
                  default:
                      setConnectionManagementStatus("Connection failed with code " + event.code);
              }
              pub.cx = undefined;
              disconnectedFromNeo4j();
          }
      });
  }

  function disconnect() {
      pub.cx.close();
      disconnectedFromNeo4j();
  }

  function nodeValue(container, id, labels, properties) {
      var card = document.createElement("div"),
          cardHeader = document.createElement("h5"),
          cardBody = document.createElement("div");
      card.setAttribute("class", "card");
      cardHeader.setAttribute("class", "card-header");
      cardHeader.appendChild(document.createTextNode("#" + id + " " + labels));
      cardBody.setAttribute("class", "card-body");
      cardBody.appendChild(document.createTextNode(JSON.stringify(properties)));
      card.appendChild(cardHeader);
      card.appendChild(cardBody);
      return card;
  }

    function run2html(cypher) {
      if (itIsDisconnected){
        alert ('You should connect this proxy to a Ne4oj engine!!!')
        return;
      }
        // Clear any existing result
        var head = document.getElementById("result-head"),
            body = document.getElementById("result-body"),
            foot = document.getElementById("result-foot");
            foot = head;
        while (head.firstChild) head.removeChild(head.firstChild);
        while (body.firstChild) body.removeChild(body.firstChild);
        while (foot.firstChild) foot.removeChild(foot.firstChild);
console.log ('1')
        var fields = [],
            count = 0,
            t0 = new Date();
            console.log ('11'+cypher)

            pub.cx.run(cypher, {}, {
                onHeader: function (metadata) {
                    $("#result-form").show();
                    var tr = document.createElement("tr");
                    for (var i = 0; i < metadata.fields.length; i++) {
                        fields.push(metadata.fields[i]);
                        var th = document.createElement("th");
                        th.appendChild(document.createTextNode(fields[i]));
                        tr.appendChild(th);
                    }
                    head.appendChild(tr)
                    console.log('header :: '+ fields)
                },
                onRecord: function (fields) {
                  console.log('record :: '+ fields)
                    count += 1;
                    var tr = document.createElement("tr");
                    for (var i = 0; i < fields.length; i++) {
                        var td = document.createElement("td");
                        var div = document.createElement("div");
                        var value = fields[i], content;
                          console.log('record2 :: '+ value)
                          try {
                            let v = JSON.stringify (value);
                            if (v.indexOf('Annotation')>-1 && v.indexOf('TextQuoteSelector')>-1 && v.indexOf('NamespacePrefixDefinition')>-1) {
                              dataModelCompliance()
                            }
                          }catch(error) {
                              console.error(error);
                            }
                        if (value === null) {
                            content = undefined;
                        }
                        else if (typeof value === "string") {
                            content = document.createTextNode(value);

                        }
                        else if (typeof value === "object" && !Array.isArray(value)) {
                            var type = value.constructor.name;
                            switch (type) {
                                case "Node":
                                    content = nodeValue(div, value.id, value.labels, value.properties);
                                    break;
                                default:
                                    div.setAttribute("style", "white-space: pre");
                                    content = document.createTextNode(type + "(" + JSON.stringify(value, null, "  ") + ")");
                            }
                        }
                        else {
                            content = document.createTextNode(JSON.stringify(value));
                        }
                        if (content !== undefined)
                            div.appendChild(content);
                        td.appendChild(div);
                        tr.appendChild(td);
                    }
                    body.appendChild(tr)
                },
                onFooter: function (metadata) {
                    var time = new Date() - t0;
                    var tr = document.createElement("tr");
                    var th = document.createElement("th");
                    th.setAttribute("colspan", "" + fields.length);
                    var server = pub.user + "@" + pub.host + ":" + pub.port;
                    th.appendChild(document.createTextNode(
                        count + " record" + (count === 1 ? "" : "s") +
                        " received from " + server + " in " + time + "ms"));
                    tr.appendChild(th);
                    //foot.appendChild(tr)
                    foot.insertBefore(tr, foot.firstChild);
                      console.log('onFooter :: '+ metadata)
                },
                onFailure: function (failure) {
                  if (failure.message.indexOf ('Expected exactly one statement per query')>= 0 ){
                      reRunMultiple (cypher);
                  }else{
                    console.log(failure.code + ": " + failure.message);
                  }
                }
            });
            console.log ('111')

    }

///Vis

        function draw() {
            var config = {
                container_id: "viz",
                server_url: "bolt://" + $("#host").val()+':'+$("#port").val(),
                server_user: $("#user").val(),
                server_password: $("#password").val(),
                labels: {},
                relationships: {},
                initial_cypher: $("#cypher").val()
            };
            config.labels["#labels"] = {
                "caption": "name",
                "size": "id",
                "community": "community"
            };
            config.relationships["oa__motivatedBy"] = {
                "thickness": "id",
                "caption": "start"
            }
            console.log(config);
            viz = new NeoVis.default(config);
            viz.render();
            console.log(viz);

        }


        function traverse (o) {
          for (var i in o) {
            //debuggingg('>>>> ' + i + ' <<<<' + JSON.stringify(o[i]))
            if (i === 'text') {
              o[i] = unescape(o[i])
            }
            if (i === 'description') {
              o[i] = unescape(o[i])
            }
            if (i === 'group' && o[i] !== null && typeof (o[i]) === 'object') {
              o[i] = o[i]['@value']
            }
            if (i === 'id' && o[i] !== null && typeof (o[i]) === 'object') {
            //  debuggingg('>>>> RETURNING')
              return traverse(o[i])
            }
            if (o[i] !== null && typeof (o[i]) === 'object') {
              // going one step down in the object tree!!
              //debuggingg('>>>> TRAVERSING')
              o[i] = traverse(o[i])
            }
          }
          return o
        }


  function traverseFor (o, ) {
    for (var i in o) {
      console.log(i);
      if (i === 'text') {
        o[i] = o[i];
      }
      if (o[i] !== null && typeof (o[i]) === 'object') {
        o[i] = traverseFor(o[i])
      }
    }
    return o
  }

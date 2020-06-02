
  var cont = 1;
  var startHour=0;
  var endHour= 24;
  var f;
  var t;

  var createScript = function (){
    let out = "";
    try {
    var data = $( "#data" ).val();
    var s = $( "#script" ).val();
    data = JSON.parse (data);

      	out = `<div>MATCH (n) detach delete (n); <br/>
        CREATE INDEX ON :Resource(uri);<br/>
UNWIND [{_id:0, properties:{\`http://www.w3.org/1999/02/22-rdf-syntax-ns#\`:"rdf", \`http://purl.org/spar/datacite/\`:"datacite", \`http://www.w3.org/2000/01/rdf-schema#\`:"rdfs", \`http://purl.org/dc/elements/1.1/\`:"dc", \`http://purl.org/dc/terms/\`:"dcterms", \`http://www.w3.org/ns/oa#\`:"oa", \`http://www.w3.org/ns/activitystreams#\`:"as", \`http://www.w3.org/2002/07/owl#\`:"owl", \`http://www.w3.org/ns/prov#\`:"prov", \`http://www.w3.org/2004/02/skos/core#\`:"skos", \`http://www.w3.org/ns/shacl#\`:"sh", \`http://rdf.onekin.org/resources/ns/\`:"onekin", \`http://xmlns.com/foaf/0.1/\`:"foaf"}}] as row
        CREATE (n:\`UNIQUE IMPORT LABEL\`{\`UNIQUE IMPORT ID\`: row._id}) SET n += row.properties SET n:NamespacePrefixDefinition;<br/>
        UNWIND [{_id:"slr__codebookDevelopment", properties:{uri:"http://rdf.onekin.org/resource/ns/slr/codebookDevelopment"}}, {_id:"oa__linking", properties:{uri:"http://www.w3.org/ns/oa#linking"}}, {_id:"oa__assessing", properties:{uri:"http://www.w3.org/ns/oa#assessing"}}, {_id:"oa__classifying", properties:{uri:"http://www.w3.org/ns/oa#classifying"}}] as row
        CREATE (n:\`UNIQUE IMPORT LABEL\`{\`UNIQUE IMPORT ID\`: row._id}) SET n += row.properties SET n:Resource;<br/>`;

      	//Transform each type
        out += json2html.transform({"people":data.R.concat(data.D)},transforms.typePerson);
         out += json2html.transform({"papers":data.P},transforms.typePaper);
        f= 100;
        t= 90;
        out += json2html.transform({"codes":data.E},transforms.typeCode);
        out += json2html.transform({"categories":data.K},transforms.typeCategory);
        f= 89;
        t= 85;
        out += json2html.transform({"codebook":data.B},transforms.typeCodeBook);
        f= 80;
        t= 20;
        out += json2html.transform({"codings":data.C},transforms.typeCoding);
        f= 20;
        t= 0;
        out += json2html.transform({"checkings":data.V},transforms.typeChecking);

      /*  out += json2html.transform({"type":"OBJECT","values":data.V[0]},transforms.itemtraversal);
      out += json2html.transform({"type":"CODINGS-ANNOTATIONS","values":data.C},transforms.typeCoding);
    */
      	//Spit out the result
//      	document.write(out);
out += `<br/>MATCH (n:\`UNIQUE IMPORT LABEL\` {\`UNIQUE IMPORT ID\`: "void"} )  detach delete n;<br/>
  MATCH (n:\`UNIQUE IMPORT LABEL\`)  WITH n LIMIT 20000 REMOVE n:\`UNIQUE IMPORT LABEL\` REMOVE n.\`UNIQUE IMPORT ID\`;<br/></div>`;
}catch (error){
  out = "<div>ERROR: "+error+"</div>";
}
    deleteChildren("#scriptDiv");
    let el = $( "#scriptDiv" );
    el.append(out);
  }

 function randomDate(from, to, timestamp) {
   if (timestamp) { console.log (timestamp); return timestamp;}
   if (document.getElementById("completedata").checked == false) return "";
    var start= Date.now() - (from * 8.64e+7);
    var end= Date.now() - (to * 8.64e+7);
    var date = new Date(+start + Math.random() * (end - start));
    var hour = startHour + Math.random() * (endHour - startHour) | 0;
    date.setHours(hour);
    timestamp= date.toISOString()
    console.log ("GENERATED: "+ timestamp)
    return timestamp;
  }

  function CopyToClipboard(containerid) {
    if (document.selection) {
      var range = document.body.createTextRange();
      range.moveToElementText(document.getElementById(containerid));
      range.select().createTextRange();
      document.execCommand("copy");
    } else if (window.getSelection) {
      var range = document.createRange();
      range.selectNode(document.getElementById(containerid));
      window.getSelection().addRange(range);
      document.execCommand("copy");
      //alert("Copied")
    }
  }

  function deleteChildren(containerid) {
              var e = document.querySelector(containerid);
              var first = e.firstElementChild;
              while (first) {
                  first.remove();
                  first = e.firstElementChild;
              }
          }

  	var transforms = {
///////////PERSON
      "typePerson":[
        {"<>":"span", "text":"UNWIND ["},
        {"<>":"span", "html":function(){
          //Transform the type array
          return(json2html.transform(this.people,transforms.itemPerson));
        }},
        {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
        {"<>":"br"},
        {"<>":"span", "text":"CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Resource:foaf__Person;"},
        {"<>":"br"}
      ],
      "itemPerson":[{"<>": "span", "text":"{"},
      {"<>": "span", "text":"_id:\"${value}\""},
      {"<>": "span", "text":", properties:{uri:\"http://neo4j.com/base/${value}\"}}, "}
    ],

///////////PAPER
    "typePaper":[
      {"<>":"span", "text":"UNWIND ["},
      {"<>":"span", "html":function(){
        //Transform the type array
        return(json2html.transform(this.papers,transforms.itemPaper));
      }},
      {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
      {"<>":"br"},
      {"<>":"span", "text":"CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Resource:foaf__Document;"},
      {"<>":"br"}
    ],
    "itemPaper":[{"<>": "span", "text":"{"},
    {"<>": "span", "text":"_id:\"${value}\""},
    {"<>": "span", "text":", properties:{datacite__url:\"https://example.com/${value}\", dcterms__title:\"${value}\", uri:\"https://example.com/${value}\"}}, "}
  ],

  ///////////CODE
    "typeCode":[
      {"<>":"span", "text":"UNWIND ["},
      {"<>":"span", "html":function(){
        //Transform the type array
        return(json2html.transform(this.codes,transforms.itemCodeBookStep1));
      }},
      {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
      {"<>":"br"},
      {"<>":"span", "text":"CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Resource:oa__Annotation;"},
      {"<>":"br"},

      {"<>":"span", "text":"UNWIND ["},
      {"<>":"span", "html":function(){
        //Transform the type array
        return(json2html.transform(this.codes,transforms.itemCodeBookStep2));
      }},
      {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
      {"<>":"br"},
      {"<>":"span", "text":"CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Resource:oa__SpecificResource;"},
      {"<>":"br"},

      {"<>":"span", "text":"UNWIND ["},
      {"<>":"span", "html":function(){
        //Transform the type array
        return(json2html.transform(this.codes,transforms.itemCodeBookStep3));
      }},
      {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
      {"<>":"br"},
      {"<>":"span", "text":"MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})"},
      {"<>":"br"},
      {"<>":"span", "text":"MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})"},
      {"<>":"br"},
      {"<>":"span", "text":"CREATE (start)-[r:oa__hasBody]->(end) SET r += row.properties;"},
      {"<>":"br"},

      {"<>":"span", "text":"UNWIND ["},
      {"<>":"span", "html":function(){
        //Transform the type array
        return(json2html.transform(this.codes,transforms.itemCodeBookStep4));
      }},
      {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
      {"<>":"br"},
      {"<>":"span", "text":"MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})"},
      {"<>":"br"},
      {"<>":"span", "text":"MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})"},
      {"<>":"br"},
      {"<>":"span", "text":"CREATE (start)-[r:oa__motivatedBy]->(end) SET r += row.properties;"},
      {"<>":"br"}

    ],

///////////CATEGORY
  "typeCategory":[
    {"<>":"span", "text":"UNWIND ["},
    {"<>":"span", "html":function(){
      //Transform the type array
      return(json2html.transform(this.categories,transforms.itemCodeBookStep10));
    }},
    {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
    {"<>":"br"},
    {"<>":"span", "text":"CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Resource:oa__Annotation;"},
    {"<>":"br"},

    {"<>":"span", "text":"UNWIND ["},
    {"<>":"span", "html":function(){
      //Transform the type array
      return(json2html.transform(this.categories,transforms.itemCodeBookStep2));
    }},
    {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
    {"<>":"br"},
    {"<>":"span", "text":"CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Resource:oa__SpecificResource;"},
    {"<>":"br"},

    {"<>":"span", "text":"UNWIND ["},
    {"<>":"span", "html":function(){
      //Transform the type array
      return(json2html.transform(this.categories,transforms.itemCodeBookStep30));
    }},
    {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
    {"<>":"br"},
    {"<>":"span", "text":"MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})"},
    {"<>":"br"},
    {"<>":"span", "text":"MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})"},
    {"<>":"br"},
    {"<>":"span", "text":"CREATE (start)-[r:oa__hasBody]->(end) SET r += row.properties;"},
    {"<>":"br"},

    {"<>":"span", "text":"UNWIND ["},
    {"<>":"span", "html":function(){
      //Transform the type array
      return(json2html.transform(this.categories,transforms.itemCodeBookStep40));
    }},
    {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
    {"<>":"br"},
    {"<>":"span", "text":"MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})"},
    {"<>":"br"},
    {"<>":"span", "text":"MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})"},
    {"<>":"br"},
    {"<>":"span", "text":"CREATE (start)-[r:oa__motivatedBy]->(end) SET r += row.properties;"},
    {"<>":"br"},

/*
    {"<>":"span", "text":"UNWIND ["},
    {"<>":"span", "html":function(){
      //Transform the type array
      return(json2html.transform(this.categories,transforms.itemCodeBookStep50));
    }},
    {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
    {"<>":"br"},
    {"<>":"span", "text":"MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})"},
    {"<>":"br"},
    {"<>":"span", "text":"MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})"},
    {"<>":"br"},
    {"<>":"span", "text":"CREATE (start)-[r:oa__hasTarget]->(end) SET r += row.properties;"},
    {"<>":"br"}*/
  ],

  ///////////

  "itemCodeBookStep10":[{"<>": "span", "text":"{"},
  {"<>": "span", "text":"_id:\"${value}\""},
  {"<>": "span", "text":", properties:{dcterms__created:\""},
  {"<>": "span", "text":function(){
    return(randomDate(f, t, this.timestamp));
  }},
  {"<>": "span", "text":"\"}}, "},
  {"<>": "span", "text":"{"},
  {"<>": "span", "text":"_id:\"${value}_CAT\""},
  {"<>": "span", "text":", properties:{dcterms__created:\""},
  {"<>": "span", "text":function(){
    return(randomDate(f, t, this.timestamp));
  }},
  {"<>": "span", "text":"\"}}, "}
],

  "itemCodeBookStep1":[{"<>": "span", "text":"{"},
  {"<>": "span", "text":"_id:\"${value}\""},
  {"<>": "span", "text":", properties:{dcterms__created:\""},
  {"<>": "span", "text":function(){
    return(randomDate(f, t, this.timestamp));
  }},
  {"<>": "span", "text":"\"}}, "}
],
"itemCodeBookStep2":[{"<>": "span", "text":"{"},
{"<>": "span", "text":"_id:\"${value}_SPR\""},
{"<>": "span", "text":", properties:{rdf__value: \"${value}\"}}, "}
],
"itemCodeBookStep3":[{"<>": "span", "text":"{"},
{"<>": "span", "text":"start:{_id:\"${value}\"}"},
{"<>": "span", "text":", end:{_id:\"${value}_SPR\"}"},
{"<>": "span", "text":", properties:{}}, "}
],
"itemCodeBookStep30":[{"<>": "span", "text":"{"},
{"<>": "span", "text":"start:{_id:\"${value}\"}"},
{"<>": "span", "text":", end:{_id:\"${value}_SPR\"}"},
{"<>": "span", "text":", properties:{}}, "},
{"<>": "span", "text":"{"},
{"<>": "span", "text":"start:{_id:\"${value}_CAT\"}"},
{"<>": "span", "text":", end:{_id:\"${value}\"}"},
{"<>": "span", "text":", properties:{}}, "}
],
"itemCodeBookStep4":[{"<>": "span", "text":"{"},
{"<>": "span", "text":"start:{_id:\"${value}\"}"},
{"<>": "span", "text":", end:{_id:\"slr__codebookDevelopment\"}"},
{"<>": "span", "text":", properties:{}}, "}
],
"itemCodeBookStep40":[{"<>": "span", "text":"{"},
{"<>": "span", "text":"start:{_id:\"${value}\"}"},
{"<>": "span", "text":", end:{_id:\"slr__codebookDevelopment\"}"},
{"<>": "span", "text":", properties:{}}, "},
{"<>": "span", "text":"{"},
{"<>": "span", "text":"start:{_id:\"${value}_CAT\"}"},
{"<>": "span", "text":", end:{_id:\"oa__linking\"}"},
{"<>": "span", "text":", properties:{}}, "}
],

///////////CODEBOOK

"typeCodeBook":[
  {"<>":"span", "text":"UNWIND ["},
  {"<>":"span", "html":function(){
    //Transform the type array
    return(json2html.transform(this.codebook,transforms.itemCategorization));
  }},
  {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
  {"<>":"br"},
  {"<>":"span", "text":"MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})"},
  {"<>":"br"},
  {"<>":"span", "text":"MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})"},
  {"<>":"br"},
  {"<>":"span", "text":"CREATE (start)-[r:oa__hasTarget]->(end) SET r += row.properties;"},
  {"<>":"br"},
],
"itemCategorization":[{"<>": "span", "text":"{"},
{"<>": "span", "text":"start:{_id:\"${category}_CAT\"}"},
{"<>": "span", "text":", end:{_id:\"${code}\"}"},
{"<>": "span", "text":", properties:{}}, "}
],

/////////////CODINGS
"typeCoding":[

  {"<>":"span", "text":"UNWIND ["},
  {"<>":"span", "html":function(){
    //Transform the type array
    return(json2html.transform(this.codings,transforms.itemCoding));
  }},
  {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
  {"<>":"br"},
  {"<>":"span", "text":"CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Resource:oa__Annotation;"},
  {"<>":"br"},

  {"<>":"span", "text":"UNWIND ["},
  {"<>":"span", "html":function(){
    //Transform the type array
    return(json2html.transform(this.codings,transforms.itemCodingTarget));
  }},
  {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
  {"<>":"br"},
  {"<>":"span", "text":"CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Resource;"},
  {"<>":"br"},


  {"<>":"span", "text":"UNWIND ["},
  {"<>":"span", "html":function(){
    //Transform the type array
    return(json2html.transform(this.codings,transforms.itemTextQuoteSelector));
  }},
  {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
  {"<>":"br"},
  {"<>":"span", "text":"CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Resource:oa__TextQuoteSelector;"},
  {"<>":"br"},

  {"<>":"span", "text":"UNWIND ["},
  {"<>":"span", "html":function(){
    //Transform the type array
    return(json2html.transform(this.codings,transforms.itemCodingMotivationLink));
  }},
  {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
  {"<>":"br"},
  {"<>":"span", "text":"MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})"},
  {"<>":"br"},
  {"<>":"span", "text":"MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})"},
  {"<>":"br"},
  {"<>":"span", "text":"CREATE (start)-[r:oa__motivatedBy]->(end) SET r += row.properties;"},
  {"<>":"br"},

  {"<>":"span", "text":"UNWIND ["},
  {"<>":"span", "html":function(){
    //Transform the type array
    return(json2html.transform(this.codings,transforms.itemCodingBodyLink));
  }},
  {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
  {"<>":"br"},
  {"<>":"span", "text":"MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})"},
  {"<>":"br"},
  {"<>":"span", "text":"MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})"},
  {"<>":"br"},
  {"<>":"span", "text":"CREATE (start)-[r:oa__hasBody]->(end) SET r += row.properties;"},
  {"<>":"br"},

  {"<>":"span", "text":"UNWIND ["},
  {"<>":"span", "html":function(){
    //Transform the type array
    return(json2html.transform(this.codings,transforms.itemCodingCreatorLink));
  }},
  {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
  {"<>":"br"},
  {"<>":"span", "text":"MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})"},
  {"<>":"br"},
  {"<>":"span", "text":"MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})"},
  {"<>":"br"},
  {"<>":"span", "text":"CREATE (start)-[r:dcterms__creator]->(end) SET r += row.properties;"},
  {"<>":"br"},

  {"<>":"span", "text":"UNWIND ["},
  {"<>":"span", "html":function(){
    //Transform the type array
    return(json2html.transform(this.codings,transforms.itemCodingTargetLink));
  }},
  {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
  {"<>":"br"},
  {"<>":"span", "text":"MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})"},
  {"<>":"br"},
  {"<>":"span", "text":"MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})"},
  {"<>":"br"},
  {"<>":"span", "text":"CREATE (start)-[r:oa__hasTarget]->(end) SET r += row.properties;"},
  {"<>":"br"},


  {"<>":"span", "text":"UNWIND ["},
  {"<>":"span", "html":function(){
    //Transform the type array
    return(json2html.transform(this.codings,transforms.itemCodingTargetSourceLink));
  }},
  {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
  {"<>":"br"},
  {"<>":"span", "text":"MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})"},
  {"<>":"br"},
  {"<>":"span", "text":"MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})"},
  {"<>":"br"},
  {"<>":"span", "text":"CREATE (start)-[r:oa__hasSource]->(end) SET r += row.properties;"},
  {"<>":"br"},


  {"<>":"span", "text":"UNWIND ["},
  {"<>":"span", "html":function(){
    //Transform the type array
    return(json2html.transform(this.codings,transforms.itemCodingTargetSelectorLink));
  }},
  {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
  {"<>":"br"},
  {"<>":"span", "text":"MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})"},
  {"<>":"br"},
  {"<>":"span", "text":"MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})"},
  {"<>":"br"},
  {"<>":"span", "text":"CREATE (start)-[r:oa__hasSelector]->(end) SET r += row.properties;"},
  {"<>":"br"},
],
////

  "itemCoding":[{"<>": "span", "text":"{"},
  {"<>": "span", "text":"_id:\"${codingId}\""},
  {"<>": "span", "text":", properties:{dcterms__created:\""},
  {"<>": "span", "text":function(){
    return(randomDate(f, t, this.timestamp));
  }},
  {"<>": "span", "text":"\"}}, "}
],

"itemCodingTarget":[{"<>": "span", "text":"{"},
{"<>": "span", "text":"_id:\"${codingId}_TRGT\""},
{"<>": "span", "text":", properties:{}},"}
],
"itemTextQuoteSelector":[{"<>": "span", "text":"{"},
{"<>": "span", "text":"_id:\"${codingId}_SLTR\""},
{"<>": "span", "text":", properties: {oa__exact:"},
{"<>": "span", "text": "\"${quote}\""},
{"<>": "span", "text":"}}, "}
],
"itemCodingMotivationLink":[{"<>": "span", "text":"{"},
{"<>": "span", "text":"start:{_id:\"${codingId}\"}"},
{"<>": "span", "text":", end:{_id:\"oa__classifying\"}"},
{"<>": "span", "text":", properties:{}}, "}],
"itemCodingBodyLink":[{"<>": "span", "text":"{"},
{"<>": "span", "text":"start:{_id:\"${codingId}\"}"},
{"<>": "span", "text":", end:{_id:\"${code}\"}"},
{"<>": "span", "text":", properties:{}}, "}],
"itemCodingCreatorLink":[{"<>": "span", "text":"{"},
{"<>": "span", "text":"start:{_id:\"${codingId}\"}"},
{"<>": "span", "text":", end:{_id:\"${reviewer}\"}"},
{"<>": "span", "text":", properties:{}}, "}],
"itemCodingTargetLink":[{"<>": "span", "text":"{"},
{"<>": "span", "text":"start:{_id:\"${codingId}\"}"},
{"<>": "span", "text":", end:{_id:\"${codingId}_TRGT\"}"},
{"<>": "span", "text":", properties:{}}, "}]
,
"itemCodingTargetSourceLink":[{"<>": "span", "text":"{"},
{"<>": "span", "text":"start:{_id:\"${codingId}_TRGT\"}"},
{"<>": "span", "text":", end:{_id:\"${paper}\"}"},
{"<>": "span", "text":", properties:{}}, "}],
"itemCodingTargetSelectorLink":[{"<>": "span", "text":"{"},
{"<>": "span", "text":"start:{_id:\"${codingId}_TRGT\"}"},
{"<>": "span", "text":", end:{_id:\"${codingId}_SLTR\"}"},
{"<>": "span", "text":", properties:{}}, "}
],


///////////Checkings
  "typeChecking":[
    {"<>":"span", "text":"UNWIND ["},
    {"<>":"span", "html":function(){
      //Transform the type array
      return(json2html.transform(this.checkings,transforms.itemChecking));
    }},
    {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
    {"<>":"br"},
    {"<>":"span", "text":"CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Resource:oa__Annotation;"},
    {"<>":"br"},

    {"<>":"span", "text":"UNWIND ["},
    {"<>":"span", "html":function(){
      //Transform the type array
      return(json2html.transform(this.checkings,transforms.itemCheckingTextualBody));
    }},
    {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
    {"<>":"br"},
    {"<>":"span", "text":"CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Resource:oa__TextualBody;"},
    {"<>":"br"},

    {"<>":"span", "text":"UNWIND ["},
    {"<>":"span", "html":function(){
      //Transform the type array
      return(json2html.transform(this.checkings,transforms.itemCheckingBodyLink));
    }},
    {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
    {"<>":"br"},
    {"<>":"span", "text":"MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})"},
    {"<>":"br"},
    {"<>":"span", "text":"MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})"},
    {"<>":"br"},
    {"<>":"span", "text":"CREATE (start)-[r:oa__hasBody]->(end) SET r += row.properties;"},
    {"<>":"br"},

    {"<>":"span", "text":"UNWIND ["},
    {"<>":"span", "html":function(){
      //Transform the type array
      return(json2html.transform(this.checkings,transforms.itemCheckingTargetLink));
    }},
    {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
    {"<>":"br"},
    {"<>":"span", "text":"MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})"},
    {"<>":"br"},
    {"<>":"span", "text":"MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})"},
    {"<>":"br"},
    {"<>":"span", "text":"CREATE (start)-[r:oa__hasTarget]->(end) SET r += row.properties;"},
    {"<>":"br"},

    {"<>":"span", "text":"UNWIND ["},
    {"<>":"span", "html":function(){
      return(json2html.transform(this.checkings,transforms.itemCheckingMotivationLink));
    }},
    {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
    {"<>":"br"},
    {"<>":"span", "text":"MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})"},
    {"<>":"br"},
    {"<>":"span", "text":"MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})"},
    {"<>":"br"},
    {"<>":"span", "text":"CREATE (start)-[r:oa__motivatedBy]->(end) SET r += row.properties;"},
    {"<>":"br"},

      {"<>":"span", "text":"UNWIND ["},
      {"<>":"span", "html":function(){
        //Transform the type array
        return(json2html.transform(this.checkings,transforms.itemCheckingCreatorLink));
      }},
      {"<>":"span", "text":"{_id:\"void\", properties:{}}]  as row"},
      {"<>":"br"},
      {"<>":"span", "text":"MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})"},
      {"<>":"br"},
      {"<>":"span", "text":"MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})"},
      {"<>":"br"},
      {"<>":"span", "text":"CREATE (start)-[r:dcterms__creator]->(end) SET r += row.properties;"},
      {"<>":"br"}
    ],
    ////


    "itemChecking":[{"<>": "span", "text":"{"},
    {"<>": "span", "text":"_id:\"${checker}_${codingId}\""},
    {"<>": "span", "text":", properties:{dcterms__created:\""},
    {"<>": "span", "text":function(){
      return(randomDate(f, t, this.timestamp));
    }},
    {"<>": "span", "text":"\"}}, "}
  ],


    "itemCheckingTextualBody":[{"<>": "span", "text":"{"},
    {"<>": "span", "text":"_id:\"${checker}_${codingId}_TXTBD\""},
    {"<>": "span", "text":", properties:{rdfs__comment: \"${comment}\""},
    {"<>": "span", "text":", rdf__value: \"${assessment}\"}}, "}
    ],

    "itemCheckingBodyLink":[{"<>": "span", "text":"{"},
    {"<>": "span", "text":"start:{_id:\"${checker}_${codingId}\"}"},
    {"<>": "span", "text":", end:{_id:\"${checker}_${codingId}_TXTBD\"}"},
    {"<>": "span", "text":", properties:{}}, "}],

    "itemCheckingTargetLink":[{"<>": "span", "text":"{"},
    {"<>": "span", "text":"start:{_id:\"${checker}_${codingId}\"}"},
    {"<>": "span", "text":", end:{_id:\"${codingId}\"}"},
    {"<>": "span", "text":", properties:{}}, "}],

    "itemCheckingMotivationLink":[{"<>": "span", "text":"{"},
    {"<>": "span", "text":"start:{_id:\"${checker}_${codingId}\"}"},
    {"<>": "span", "text":", end:{_id:\"oa__assessing\"}"},
    {"<>": "span", "text":", properties:{}}, "}],

    "itemCheckingCreatorLink":[{"<>": "span", "text":"{"},
    {"<>": "span", "text":"start:{_id:\"${checker}_${codingId}\"}"},
    {"<>": "span", "text":", end:{_id:\"${checker}\"}"},
    {"<>": "span", "text":", properties:{}}, "}]

  	};

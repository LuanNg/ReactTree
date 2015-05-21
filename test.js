var sortable ;



switcher.onclick = function () {
  
  var option = {
    CallBack: {
      filterText: '',
      DragOver: function(e,b){
        console.log(e);
        console.log(b);
      }
    }
  }
  
      
var treedata = {
    Id: 1,
    Name: 'Node 1',
    Checked: 0,
    Type: 0,
    SiteCount: 1,
    Sites: [
      {Id: 2,  Name: 'Node 2',  Checked: 0,  Type: 1,SiteCount: 1,  Sites: []},
      {Id: 3,  Name: 'Node 3',  Checked: 0,  Type: 1, SiteCount: 1, Sites: []},
      {Id: 31,  Name: 'Node 31',  Checked: 0,  Type: 1, SiteCount: 1, Sites: []},
      {Id: 32,  Name: 'Node 32',  Checked: 0,  Type: 1, SiteCount: 1, Sites: []},
      {Id: 4,  Name: 'Node 4',  Checked: 0,  Type: 0,SiteCount: 1,  Sites: [
        {Id: 51,  Name: 'Node 51',  Checked: 0,  Type: 1,SiteCount: 1,  Sites: []},
        {Id: 52,  Name: 'Node 52',  Checked: 0,  Type: 1,SiteCount: 1,  Sites: []},
        {Id: 53,  Name: 'Node 53',  Checked: 0,  Type: 1,SiteCount: 1,  Sites: []},
        {Id: 54,  Name: 'Node 54',  Checked: 0,  Type: 0,SiteCount: 1,  Sites: [
           {Id: 13,  Name: 'Node 15',  Checked: 0,  Type: 1,SiteCount: 1,  Sites: []},
           {Id: 23,  Name: 'Node 25',  Checked: 0,  Type: 1,SiteCount: 1,  Sites: []},
           {Id: 33,  Name: 'Node 35',  Checked: 0,  Type: 1,SiteCount: 1,  Sites: []},
           {Id: 43,  Name: 'Node 45',  Checked: 0,  Type: 1,SiteCount: 1,  Sites: []}
          ]}
      ]},
      {Id: 154,  Name: 'Node 154',  Checked: 0,  Type: 0,SiteCount: 1,  Sites: [
       {Id: 17813,  Name: 'Node 115',  Checked: 0,  Type: 1,SiteCount: 1,  Sites: []},
       {Id: 123,  Name: 'Node 125',  Checked: 0,  Type: 1,SiteCount: 1,  Sites: []},
       {Id: 133,  Name: 'Node 135',  Checked: 0,  Type: 1,SiteCount: 1,  Sites: []},
       {Id: 143,  Name: 'Node 145',  Checked: 0,  Type: 1,SiteCount: 1,  Sites: []}
      ]},
      {Id: 1541,  Name: 'Node 1543',  Checked: 0,  Type: 0,SiteCount: 1,  Sites: []},
      {Id: 1542,  Name: 'Node 1544',  Checked: 0,  Type: 0,SiteCount: 1,  Sites: []},
      {Id: 1543,  Name: 'Node 1545',  Checked: 0,  Type: 0,SiteCount: 1,  Sites: []},
      {Id: 1544,  Name: 'Node 1546',  Checked: 0,  Type: 0,SiteCount: 1,  Sites: []},
      {Id: 1545,  Name: 'Node 1547',  Checked: 0,  Type: 0,SiteCount: 1,  Sites: []},
      {Id: 1546,  Name: 'Node 1548',  Checked: 0,  Type: 0,SiteCount: 1,  Sites: []}
    ]
};

for(var i =0; i< 100; i ++){

var test = {Id: 54 + i,  Name: 'Node 54'+i,  Checked: 0,  Type: 0,SiteCount: 1,  Sites: [
              {Id: 13 + i,  Name: 'Node 15+i',  Checked: 0,  Type: 1,SiteCount: 1,  Sites: []},
              {Id: 23 + i,  Name: 'Node 25'+i,  Checked: 0,  Type: 1,SiteCount: 1,  Sites: []}]
  
            }
treedata.Sites.push(test);
}

var def = {
  Model: treedata
}
var i = 0;

 console.log(def.Model);
  
  if(i === 0){  option.CallBack.filterText = 'Node 2';  CMSTree.create(document.getElementById("cms-tree"), def,option ); i++; return;}
  if(i === 1){ option.CallBack.filterText = 'Node';   CMSTree.create(document.getElementById("cms-tree"), def,option ); console.log(option);  i++; return;}
  if(i === 2){ option.CallBack.filterText = 'Node 1';  CMSTree.create(document.getElementById("cms-tree"), def, option);console.log(option);  i++; return;}
  if(i === 3){ option.CallBack.filterText = 'Node 2';    CMSTree.create(document.getElementById("cms-tree"), def, option);console.log(option);  i++; return;}
//	var state = CMSTree.option("disabled"); // get
};

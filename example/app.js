
var placeholder = null;
var dragged;
var over;
var dragData;
var dropData;

var BaseNode = function(id, name, checked, type, count ) {
  this.Name = name;
  this.Id = id;
  this.Checked = checked;
  this.Type = type;
  this.Count = count;
}

var FileNode = function(id, name, checked, type, count ) {
  BaseNode.call(this, id, name, checked, type, count);
  
}

var FolderNode = function(id, name, checked, type, count, childs ) {
  BaseNode.call(this, id, name, checked, type, count);
  this.Childs = [];
  this.Collapsed = false;
  
  this.initChilds = function(childs){

  }
}





function holderPlace(){
    if (!placeholder) {
        var pl = document.createElement('li');
        pl.className = 'placeholder';
        var att = document.createAttribute("data-drag-handle");
        att.value = "true";  
        pl.setAttributeNode(att);
        pl.appendChild(document.createTextNode("Drop Here"));
        placeholder = pl;
    }
    return placeholder;
}

function dropReraw(from, to){
  dropData.state.node[defCol.Childs].splice(to, 0, dragData.state.node[defCol.Childs].splice(from, 1)[0])
  dropData.setState({node: dropData.state.node});
}

var TreeNodeContent = React.createClass({
        toogleExpand: function(){
           this.props.collapsed = !this.props.collapsed;
           this.props.toggleCollapsed(this.props.collapsed);
        },
        render: function() {
            var node = this.props.node;
            var className;
            var collapsed = this.props.collapsed;

            if (this.props.selectedNode && this.props.selectedNode[defCol.Id] === this.props.node[defCol.Id]) {
                className = 'select';
            }

            var classCollapsed = 'glyphicon';
            if (node[defCol.Type] === 0) {
                classCollapsed += collapsed === true ? ' glyphicon-triangle-right' : ' glyphicon-triangle-left';
            } else {
                classCollapsed += ' icon-null';
            }
       
            var classText ='glyphicon ';
            if(node[defCol.Type] === 0){
                if(node.ParentKey !== null){
                    classText += collapsed === true? 'glyphicon-folder-close': 'glyphicon-folder-open';
                }else{
                    classText +=' glyphicon-home';
                }
            }else{
                classText +=' glyphicon-facetime-video';
            }
       
            var textConent = (
               <a className = 'btn btn-xs'>
                   <i className={classText}></i>
                   <span>{node[defCol.Name]}</span>
               </a>
            );
         
            var sitecount = (<b className="badge pull-right">{node[defCol.Count]}</b>);
         
            var addRegion , addSite, editRegionSite, deleteRegionSite;
         
            editRegionSite = ( <a className="btn btn-xs" ><i className="glyphicon glyphicon-edit"></i></a>);
            if(node[defCol.Type] === 0){
                addRegion= (<a className="btn btn-xs"> <i className="glyphicon glyphicon-cloud-upload"></i></a>);
                addSite = (<a className="btn btn-xs"><i className="glyphicon  glyphicon-plus"></i></a>);
            }
          
            if(node[defCol.Type] === 1 || (node[defCol.Type] ===0 && node[defCol.Childs].length === 0)){
                deleteRegionSite = (<a className="btn btn-xs"><i className="glyphicon glyphicon-remove-circle"></i></a>);
            }
          
          
            return (<div className = {className}>
                <div className="tree-node-content">
                    <a className = "btn btn-xs" onClick={this.toogleExpand}><i className={classCollapsed}></i></a>
                    <span>
                        {textConent}
                        {sitecount}
                        <b className="control-group pull-right">
                            {addRegion}
                            {addSite}
                            {editRegionSite}
                            {deleteRegionSite}
                        </b>
                    </span>
                </div>
            </div>);
            }
            });
 
var TreeNode = React.createClass({
   getInitialState: function() {
        var node = this.props.node;
        return {
            node: node
        }
    },
    dragStart: function(e) {
          dragged = e.currentTarget; console.log(this.dragged);
          //this.dragged.style = "display: 'none;'";
          e.dataTransfer.effectAllowed = 'move';
          this.state.node = this.props.node;
          console.log(e.currentTarget.dataset);
          dragData = this;
          console.log(dragData);

          e.dataTransfer.setData("text/html", e.currentTarget);
         //  e.preventDefault();
          e.stopPropagation();
    },
    dragEnd: function(e) {
      e.preventDefault();
          e.stopPropagation();
          dragged.style.display = "block";
          console.log(over);
          over.parentElement.removeChild(holderPlace());
          var from = Number(dragged.dataset.id);
          console.log(from);                    
          var to = Number(over.dataset.id);
          console.log(to); 
          if (from < to) {
              to--;
          }
          
            console.log(over.parentElement.dataset);
            console.log(this.state.node);
            
            if(dragData.state.node[defCol.Id] === dropData.state.node[defCol.Id]){
              this.state.node[defCol.Childs].splice(to, 0, this.state.node[defCol.Childs].splice(from, 1)[0]);
            }else{
              dropReraw(from, to);
            }
          this.setState({node: this.state.node});
          console.log(dropData);
      },
    dragOver: function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          dropData = this;
           var targetRow = e.target;
                
           dragged.style.display = "none";
           if (targetRow.className == "placeholder") return;
          
           var chekceventElm = e.target
           var eventElm = e.target
            while (eventElm && (eventElm.getAttribute("data-drag-handle") !== "true")) {
                      eventElm = eventElm.parentElement;
            }
                  
            if(!eventElm){
              console.log("No Drop");
              return;
            }
            
            over = eventElm;
    //console.log(over);
            if (eventElm.getAttribute("data-drag-handle") !== "true") {
                return;
            }
            
            var select = Number(eventElm.dataset.id);
           // console.log(select);
            if(this.state.node[defCol.Childs][select] && this.state.node[defCol.Childs][select].Sites.length === 0){
              
              var ca =  eventElm.getElementsByTagName("ol")[0];
              if(ca){
                ca.className  =" "  
              }
              
             //console.log(ca);
             
            }
            var posEventEl = e.clientY - eventElm.offsetTop;
            
            var heightOfOver = eventElm.offsetHeight /2;
            var parent = eventElm.parentElement;
            
            
            if(posEventEl > heightOfOver){
              parent.insertBefore(holderPlace(), eventElm.nextElementSibling);
            }else if(posEventEl < heightOfOver){
               parent.insertBefore(holderPlace(), eventElm);
            }
    },
    render: function() {
        var node = this.props.node;
        var collapsed = this.props.collapsed;
       
        var collapsedClass = '';
        if(collapsed === true){
            collapsedClass = 'hidden';
        }

        var treenode = [];
        if (node[defCol.Childs] && node[defCol.Childs].length > 0) {
          
          
            // treenode = node.Sites.map((function(n, i) {
            //     if(this.props.node.Name.indexOf(this.props.filterText) === -1){
            //          return ;
            //    }else{
            //      return (<li data-id={i} key={i}  draggable="true" data-drag-handle="true" onDragEnd={this.dragEnd} onDragStart={this.dragStart}><Tree node = {n} filterText = {this.props.filterText} /></li>);
            //    }
            // }).bind(this));
             
            node[defCol.Childs].forEach(function(n,i) {
                if (n.Type === 1 &&  n.Name.indexOf(this.props.filterText) === -1) {
                  return;
                }
                treenode.push(<li data-id={i} key={i}  draggable="true" data-drag-handle="true" onDragEnd={this.dragEnd} onDragStart={this.dragStart}><Tree node = {n} filterText = {this.props.filterText} /></li>);
            }.bind(this));
        
             
        return (<ol className = {collapsedClass} onDragOver={this.dragOver}>{treenode}</ol>);
        }else{
          if(node[defCol.Type] === 0){
            var treenode = (<li data-id={-1} data-drag-handle="true"></li>);
            return (<ol className = {collapsedClass} onDragOver={this.dragOver}>{treenode}</ol>);
          }else{
            return null;
          }
        }
      }
});

var Tree = React.createClass({
    getInitialState: function() {
        var node = this.props.node;
        return {
            node: node,
            collapsed: (node.state && node.state.hasOwnProperty('collapsed')) ? node.state.collapsed : false
        }
    },
    toggleCollapsed: function(collapsed) {
        this.setState({
            collapsed: collapsed
        });
    },
    render: function() {
        var collapsed = this.state.collapsed;
        
        return (<groupNode>
          <TreeNodeContent node ={ this.props.node} selectedNode = {this.props.selectedNode} toggleCollapsed={this.toggleCollapsed}  collapsed={collapsed} /> 
          <TreeNode node= { this.props.node} selectedNode = {this.props.selectedNode} collapsed={collapsed}  toggleCollapsed={this.toggleCollapsed} filterText = {this.props.filterText} />
        </groupNode>);
    }
});
    
var treedata = {
    Id: 1,
    Name: 'Node 1',
    Checked: false,
    Type: 0,
    SiteCount: 1,
    Sites: [
      {Id: 2,  Name: 'Node 2',  Checked: false,  Type: 1,SiteCount: 1,  Sites: []},
      {Id: 3,  Name: 'Node 3',  Checked: false,  Type: 1, SiteCount: 1, Sites: []},
      {Id: 31,  Name: 'Node 31',  Checked: false,  Type: 1, SiteCount: 1, Sites: []},
      {Id: 32,  Name: 'Node 32',  Checked: false,  Type: 1, SiteCount: 1, Sites: []},
      {Id: 4,  Name: 'Node 4',  Checked: false,  Type: 0,SiteCount: 1,  Sites: [
        {Id: 51,  Name: 'Node 51',  Checked: false,  Type: 1,SiteCount: 1,  Sites: []},
        {Id: 52,  Name: 'Node 52',  Checked: false,  Type: 1,SiteCount: 1,  Sites: []},
        {Id: 53,  Name: 'Node 53',  Checked: false,  Type: 1,SiteCount: 1,  Sites: []},
        {Id: 54,  Name: 'Node 54',  Checked: false,  Type: 0,SiteCount: 1,  Sites: [
           {Id: 13,  Name: 'Node 15',  Checked: false,  Type: 1,SiteCount: 1,  Sites: []},
           {Id: 23,  Name: 'Node 25',  Checked: false,  Type: 1,SiteCount: 1,  Sites: []},
           {Id: 33,  Name: 'Node 35',  Checked: false,  Type: 1,SiteCount: 1,  Sites: []},
           {Id: 43,  Name: 'Node 45',  Checked: false,  Type: 1,SiteCount: 1,  Sites: []}
          ]}
      ]},
      {Id: 154,  Name: 'Node 154',  Checked: false,  Type: 0,SiteCount: 1,  Sites: [
       {Id: 113,  Name: 'Node 115',  Checked: false,  Type: 1,SiteCount: 1,  Sites: []},
       {Id: 123,  Name: 'Node 125',  Checked: false,  Type: 1,SiteCount: 1,  Sites: []},
       {Id: 133,  Name: 'Node 135',  Checked: false,  Type: 1,SiteCount: 1,  Sites: []},
       {Id: 143,  Name: 'Node 145',  Checked: false,  Type: 1,SiteCount: 1,  Sites: []}
      ]},
      {Id: 1541,  Name: 'Node 154',  Checked: false,  Type: 0,SiteCount: 1,  Sites: []},
      {Id: 1542,  Name: 'Node 154',  Checked: false,  Type: 0,SiteCount: 1,  Sites: []},
      {Id: 1543,  Name: 'Node 154',  Checked: false,  Type: 0,SiteCount: 1,  Sites: []},
      {Id: 1544,  Name: 'Node 154',  Checked: false,  Type: 0,SiteCount: 1,  Sites: []},
      {Id: 1545,  Name: 'Node 154',  Checked: false,  Type: 0,SiteCount: 1,  Sites: []},
      {Id: 1546,  Name: 'Node 154',  Checked: false,  Type: 0,SiteCount: 1,  Sites: []}
    ]
};

for(var i =0; i< 100; i ++){

var test = {Id: 54 + i,  Name: 'Node 54'+i,  Checked: false,  Type: 0,SiteCount: 1,  Sites: [
              {Id: 13 + i,  Name: 'Node 15+i',  Checked: false,  Type: 1,SiteCount: 1,  Sites: []},
              {Id: 23 + i,  Name: 'Node 25'+i,  Checked: false,  Type: 1,SiteCount: 1,  Sites: []}]
  
            }
treedata.Sites.push(test);
}

var selectedNode = {};
var filterText = "";
var testis = 0;

var defCol = {
  Id:'Id',
  Name: 'Name',
  Type: 'Type',
  Childs: 'Sites',
  Checked: 'Checked',
  Count: 'SiteCount'
}

React.render(<Tree node={treedata} selectedNode = {selectedNode} filterText = {filterText} />,  document.getElementById("cms-tree") );
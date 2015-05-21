(function (factory) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        define(factory);
    }
    else if (typeof module != "undefined" && typeof module.exports != "undefined") {
        module.exports = factory();
    }
    else if (typeof Package !== "undefined") {
        CMSTree = factory();
    }
    else {
        window["CMSTree"] = factory();
    }
})(function () {

var placeholder = null;
var dragged;
var over;
var dragData;
var dropData;
var selectedNode = {};
var filterText = "";


var defCol = {
  Id:'Id',
  Name: 'Name',
  Type: 'Type',
  Childs: 'Sites',
  Checked: 'Checked',
  Count: 'SiteCount',
  Model: {}
}

var settings= {
  Node: {
    IsShowIcon: true,
    IsShowCheckBox: false,
    IsShowRootNode: true,
    IsShowNodeMenu: true,
    IsShowCount: true,
    IsShowAddNodeButton: true,
    IsShowAddItemButton: true,
    IsShowEditButton: true,
    IsShowDelButton: true
  },
  Item: {
    IsShowItemMenu: true,
    IsShowDelButton: true,
    IsShowEditButton: true,
    IsShowIcon: true,
    IsHightlightFilter: false
  },
  Icon: {
    Expand: 'fa fa-plus-square-o',
    Collpased: 'fa fa-minus-square-o',
    NodeExpand: 'fa fa-building',
    NodeCollpased: 'fa fa-building-o',
    NodeAdd:'fa fa-plus',
    NodeAddItem:'fa fa-plus-circle',
    NodeEdit: 'fa fa-pencil',
    NodeDel:'fa fa-times',
    Item:'fa fa-th-large',
    ItemDel:'fa fa-times',
    ItemEdit: 'fa fa-pencil'
  },
  CallBack: {
    AddNode: null,
    EditNode: null,
    DelNode: null,
    EditItem: null,
    DelItem: null,
    SelectedNode: selectedNode,
    filterText: filterText,
    DragStart: null,
    DragOver: null,
    DragEnd: null
  }
}


var TreeNodeContent = React.createClass({
      checkFn: function(chck, scope){
        checkNodeStatus(this.props.node, this.refs.checkbox);
          this.props.check(chck);
        },
        toogleExpand: function(){
           this.props.collapsed = !this.props.collapsed;
           this.props.toggleCollapsed(this.props.collapsed);
        },
        selectedNodeFn: function(){
          this.props.selectedNode = this.props.node;
          this.forceUpdate();
        },
        render: function() {
            var node = this.props.node;
            var classSelect, addRegion, addSite, editRegionSite, deleteRegionSite, sitecount, boxcontrol, checkbox;
            var collapsed = this.props.collapsed;

            if (this.props.selectedNode && this.props.selectedNode[defCol.Id] === this.props.node[defCol.Id]) {
                classSelect = 'select';
            }

            var classCollapsed = collapsed === true ? settings.Icon.Expand : settings.Icon.Collpased;
     
            var classText = collapsed === true ? settings.Icon.NodeExpand : settings.Icon.NodeCollpased;
            classText = settings.Node.IsShowIcon === true ? classText: '';
            
            var textConent = (
               <a className = 'btn btn-xs' onClick={this.selectedNodeFn.bind(this)}>
                   <i className={classText}></i>
                   <ContentHightLight  node={this.props.node} filterText = {this.props.filterText} />
               </a>
            );
            //<span className="node-name">{node[defCol.Name]}</span>
         
            sitecount =  settings.Node.IsShowCount === true ?  (<b className="badge pull-right">{node[defCol.Count]}</b>) : sitecount;

            editRegionSite = settings.Node.IsShowEditButton === true ?  ( <a className="btn btn-xs" ><i className= {settings.Icon.NodeEdit}></i></a>) : editRegionSite;
            addRegion= settings.Node.IsShowAddNodeButton === true ? (<a className="btn btn-xs"> <i className= {settings.Icon.NodeAdd}></i></a>) : addRegion;
            addSite = settings.Node.IsShowAddItemButton === true ? (<a className="btn btn-xs"><i className= {settings.Icon.NodeAddItem}></i></a>) : addSite;
          
            if(settings.Node.IsShowDelButton === true && node[defCol.Type] ===0 && node[defCol.Childs].length === 0){
                deleteRegionSite = (<a className="btn btn-xs"><i className= {settings.Icon.NodeDel}></i></a>);
            }
            
            //checkbox = settings.Node.IsShowCheckBox === true? (<input type="checkbox" />) : checkbox;
            if(settings.Node.IsShowCheckBox === true){
              var checkstats =  this.props.node[defCol.Checked] === 1? true: false;
              checkbox =  (<input type="checkbox" checked={checkstats} ref="checkbox" onClick={this.checkFn.bind(this,node)} />);
              if(this.props.node[defCol.Checked] === -1){
                React.findDOMNode(this.refs.checkbox).indeterminate = true
              }else if(React.findDOMNode(this.refs.checkbox)){
                React.findDOMNode(this.refs.checkbox).indeterminate = false; //indeterminate
              }
            }
            
            boxcontrol = settings.Node.IsShowNodeMenu === true ?  (
               <b className="control-group pull-right">
                  {addRegion}
                  {addSite}
                  {editRegionSite}
                  {deleteRegionSite}
              </b>
              ) :boxcontrol ;
          
            return (<div className = {classSelect}>
                <div className="tree-node-content">
                    <a className = "btn btn-xs" onClick={this.toogleExpand}><i className={classCollapsed}></i></a>
                    <span className="node-content">
                        {checkbox}
                        {textConent}
                        {sitecount}
                        {boxcontrol}
                    </span>
                </div>
            </div>);
            }
    });
 
var TreeNode = React.createClass({
    //getInitialState: function() {
    //    var node = this.props.node;
    //    return {
    //        node: node
    //    }
    //},
    checkFn: function(chck, scope){
       this.props.check(chck);
     },
    dragStart: function(e) {
         //  e.preventDefault();
          e.stopPropagation();
          
          dragged = e.currentTarget; 
          //console.log(this.dragged);
          //this.dragged.style = "display: 'none;'";
          e.dataTransfer.effectAllowed = 'move';
          //this.state.node = this.props.node;
          //console.log(e.currentTarget.dataset);
          dragData = this;
          console.log(dragData);

          e.dataTransfer.setData("text/html", e.currentTarget);
          
          if(settings.CallBack.DragStart && typeof settings.CallBack.DragStart === 'function'){
               settings.CallBack.DragStart(e, this);
          }
          
         
    },
    dragEnd: function(e) {
      dragEndFn(this, e);
    },
    dragOver: function(e) {
        dragOverFn(this, e);
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
             
            node[defCol.Childs].forEach(function(n,i) {
                if (n.Type === 1 &&  n.Name.indexOf(this.props.filterText) === -1) {
                  return;
                }
                treenode.push(<li data-id={i} key={i} draggable="true" data-drag-handle="true" onDragEnd={this.dragEnd} onDragStart={this.dragStart}><Tree node = {n} filterText = {this.props.filterText} check={this.checkFn} /></li>);
            }.bind(this));
        
             
        return (<ol className = {collapsedClass} onDragOver={this.dragOver}>{treenode}</ol>);
        }else{
          if(node[defCol.Type] === 0){
            var treenode = (<li className="node-hidden" data-id={-1} data-drag-handle="true"></li>);
            return (<ol className = {collapsedClass} onDragOver={this.dragOver}>{treenode}</ol>);
          }else{
            return null;
          }
        }
      }
});

var ContentHightLight = React.createClass({
  render: function() {
    var filterT = this.props.filterText;
    var text = this.props.node[defCol.Name];
    if (filterT && filterT !== "" && settings.Item.IsHightlightFilter === true){
        text = text.replace(new RegExp('(' + filterT + ')', 'gi'), '<span class="highlighted">$1</span>');
        return (<span className="node-name" dangerouslySetInnerHTML={{__html: text}}></span>);
    }
    
    return (<span className="node-name">{text}</span>);
  }
});

var FileNodeContent = React.createClass({
        checkFn: function(chck, scope){
             this.props.node[defCol.Checked] = this.props.node[defCol.Checked] === 1? 0: 1;
              React.findDOMNode(this.refs.checkbox).checked = this.props.node[defCol.Checked];
              this.props.check(chck);
        },
        selectedNodeFn: function(){
          this.props.selectedNode = this.props.node;
          this.forceUpdate();
        },
        render: function() {
            var node = this.props.node;
            var classSelect, boxcontrol, editRegionSite, deleteRegionSite,checkbox;
            var classCollapsed = 'glyphicon icon-null';
            
            if (this.props.selectedNode && this.props.selectedNode[defCol.Id] === this.props.node[defCol.Id]) {
                classSelect = 'select';
            }
       
            var classText = settings.Item.IsShowIcon === true?  settings.Icon.Item : '' ;
       
            var textConent = (
               <a className = 'btn btn-xs' onClick={this.selectedNodeFn.bind(this)}>
                   <i className={classText}></i>
                   <ContentHightLight  node={this.props.node} filterText = {this.props.filterText} />
               </a>
            );
         
            editRegionSite = settings.Item.IsShowEditButton === true?  (<a className="btn btn-xs" ><i className={settings.Icon.ItemEdit}></i></a>) : editRegionSite;
          
            deleteRegionSite = settings.Item.IsShowDelButton === true?  (<a className="btn btn-xs"><i className={settings.Icon.ItemDel}></i></a>) : deleteRegionSite;
            
            if(settings.Node.IsShowCheckBox === true){
                var checkstats =  this.props.node[defCol.Checked] === 1? true: false;
                checkbox = (<input type="checkbox" checked={checkstats} ref="checkbox" onClick={this.checkFn.bind(this,node)} />);
            }
            
            boxcontrol = settings.Item.IsShowItemMenu === true? (
                <b className="control-group pull-right">
                    {editRegionSite}
                    {deleteRegionSite}
                </b>
              ): boxcontrol;
          
          
            return (<div className = {classSelect}>
                <div className="tree-node-content">
                    <a className = "btn btn-xs"><i className={classCollapsed}></i></a>
                    <span className="node-content">
                        {checkbox}
                        {textConent}
                        {boxcontrol}
                    </span>
                </div>
            </div>);
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
    forceUp: function(){
      this.setState({node: this.props.node});
      console.log(this.props.node);
      this.forceUpdate();
    },
    checkFn: function(node){
        node = this.props.node;
        nodes = node[defCol.Childs];
        setStatusCheck(node, nodes);
        this.setState({node: this.props.node});
          
        if(this.props.check){
          this.props.check(node);
        }
    },
    add: function(node){
      AddNode(this)
    },
    remove: function(node){
      DelNode(this);
    },
    edit: function(node){
      EditNode(this);
    },
    toggleCollapsed: function(collapsed) {
        this.setState({
            collapsed: collapsed
        });
    },
    render: function() {
      
      var collapsed = this.state.collapsed;
      var showRootNode = this.props.showRootNode !== undefined ? this.props.showRootNode: true;
      
      var content, nodechild;
      if(this.props.node[defCol.Type] ===0){
      
         if(showRootNode === true){
            content = (<TreeNodeContent node ={ this.props.node} selectedNode = {this.props.selectedNode} toggleCollapsed={this.toggleCollapsed}  collapsed={collapsed} check={this.checkFn} filterText = {this.props.filterText}/>) ;
          }
          
          nodechild =  (<TreeNode node= { this.props.node} forceUp={this.forceUp.bind(this)} selectedNode = {this.props.selectedNode} collapsed={collapsed}  toggleCollapsed={this.toggleCollapsed} filterText = {this.props.filterText}  check={this.checkFn}  />);
          
      }else{
        content = (<FileNodeContent node ={ this.props.node} selectedNode = {this.props.selectedNode} toggleCollapsed={this.toggleCollapsed}  collapsed={collapsed} check={this.checkFn} filterText = {this.props.filterText} />) ;
      }
        
      return (<groupNode>
        {content}
        {nodechild}
      </groupNode>);
    }
});

function AddNode(scope){
  
  if(!settings.CallBack.AddNode){
    return;
  }
  
  settings.CallBack.AddNode(scope.props.node).then(function(result){
   // scope.props.node[defCol.Childs].push(result);
      scope.setState({
        node: scope.props.node
      });
    }, function(error){
      scope.setState({
        node: scope.state.node
      });
  });
}

function EditNode(scope){
  if(!settings.CallBack.EditNode){
    return;
  }
      settings.CallBack.EditNode(scope.props.node).then(function(result){
          scope.setState({
            node: scope.props.node
          });
      }, function(error){
        scope.setState({
            node: scope.state.node
          });
      });
}

function DelNode(scope){
  if(!settings.CallBack.DelNode){
    return;
  }
  settings.CallBack.DelNode(scope.props.node).then(function(result){
      scope.setState({
        node: scope.props.node
      });
  }, function(error){
    scope.setState({
        node: scope.state.node
      });
  });
}

function CMSTree(el, def, options) {
  console.log(def);
  if(def){
    if(!def.Model){
      return; 
    }
    defCol.Id = def.Id && def.Id !== "" ? def.Id : defCol.Id;
    defCol.Name = def.Name && def.Name !== "" ? def.Name : defCol.Name;
    defCol.Type = def.Type && def.Type !== "" ? def.Type : defCol.Type;
    defCol.Childs = def.Childs && def.Childs !== "" ? def.Childs : defCol.Childs;
    defCol.Checked = def.Checked && def.Checked !== "" ? def.Checked : defCol.Checked;
    defCol.Count = def.Count && def.Count !== "" ? def.Count : defCol.Count;
    defCol.Model = def.Model ? def.Model : defCol.Model;
  }else{
    return;
  }
  
  
  
  if(options){
     if(options.Node){
       var node = options.Node;
       settings.Node.IsShowIcon = node.IsShowIcon && node.IsShowIcon !== "" ? node.IsShowIcon : settings.Node.IsShowIcon;
       settings.Node.IsShowCheckBox = node.IsShowCheckBox && node.IsShowCheckBox !== "" ? node.IsShowCheckBox : settings.Node.IsShowCheckBox;
       settings.Node.IsShowRootNode = node.IsShowRootNode && node.IsShowRootNode !== "" ? node.IsShowRootNode : settings.Node.IsShowRootNode;
       settings.Node.IsShowNodeMenu = node.IsShowNodeMenu && node.IsShowNodeMenu !== "" ? node.IsShowNodeMenu : settings.Node.IsShowNodeMenu;
       settings.Node.IsShowCount = node.IsShowCount && node.IsShowCount !== "" ? node.IsShowCount : settings.Node.IsShowCount;
     }
     if(options.Item){
       var node = options.Item;
       settings.Item.IsShowItemMenu = node.IsShowItemMenu && node.IsShowItemMenu !== "" ? node.IsShowItemMenu : settings.Item.IsShowItemMenu;
       settings.Item.IsShowIcon = node.IsShowIcon && node.IsShowIcon !== "" ? node.IsShowIcon : settings.Item.IsShowIcon;
       settings.Item.IsHightlightFilter = node.IsHightlightFilter && node.IsHightlightFilter !== "" ? node.IsHightlightFilter : settings.Item.IsHightlightFilter;
     }
     if(options.Icon){
       // implement later
     }
     
      if(options.CallBack){
       var node = options.CallBack;
       console.log(options.CallBack.filterText);
       settings.CallBack.SelectedNode = node.SelectedNode && node.SelectedNode !== {} ? node.SelectedNode : settings.CallBack.SelectedNode;
       settings.CallBack.filterText = node.filterText && node.filterText !== "" ? node.filterText : settings.CallBack.filterText;
       settings.CallBack.AddNode = node.AddNode && typeof node.AddNode === 'function' ? node.AddNode : settings.CallBack.AddNode;
       settings.CallBack.EditNode = node.EditNode && typeof node.EditNode === 'function' ? node.EditNode : settings.CallBack.EditNode;
       settings.CallBack.DelNode = node.DelNode && typeof node.DelNode === 'function' ? node.DelNode : settings.CallBack.DelNode;
       settings.CallBack.DragStart = node.DragStart && typeof node.DragStart === 'function' ? node.DragStart : settings.CallBack.DragStart;
       settings.CallBack.DragOver = node.DragOver && typeof node.DragOver === 'function' ? node.DragOver : settings.CallBack.DragOver;
       settings.CallBack.DragEnd = node.DragEnd && typeof node.DragEnd === 'function' ? node.DragEnd : settings.CallBack.DragEnd;
     }
  }
  console.log(settings.CallBack.filterText);
  React.render(<Tree node={defCol.Model} selectedNode = {selectedNode} filterText = {settings.CallBack.filterText} showRootNode={true} />, el ) // document.getElementById("cms-tree") );
  
}

function holderPlace(){
    if (!placeholder) {
        var pl = document.createElement('li');
        pl.className = 'placeholder';
        var att = document.createAttribute("data-drag-handle");
        att.value = "true";  
        pl.setAttributeNode(att);
        placeholder = pl;
    }
    return placeholder;
}

function dropReraw(from, to){
  dropData.props.node[defCol.Childs].splice(to, 0, dragData.props.node[defCol.Childs].splice(from, 1)[0])
  //dropData.setState({node: dropData.state.node});
  dropData.props.forceUp();
  console.log(dropData.props.node);
}

function checkNodeStatus(chck, refChk){
    switch (chck[defCol.Checked]){
     case 1: {
       checkChildNode(0, chck[defCol.Childs]);
       chck[defCol.Checked] = 0;
       React.findDOMNode(refChk).checked = false;
       break;
     }               
     default: {
       checkChildNode(1, chck[defCol.Childs]);
       chck[defCol.Checked] = 1;
       React.findDOMNode(refChk).checked = true;
       break;
     }
   }
}

function checkChildNode(ck, nodes){
     var leNodes = nodes.length
      for(var i=0;i<leNodes  ; i++){
         nodes[i][defCol.Checked] = ck;
         if(nodes[i][defCol.Childs].length > 0)
         {
           checkChildNode(ck, nodes[i][defCol.Childs]);
         }
      }
   }

function setStatusCheck(node, nodes){
 if(node[defCol.Type] === 0){
   var leNodes = nodes.length;
   
   if(leNodes > 0){
   var state = nodes[0][defCol.Checked];
    for(var i=1;i<leNodes  ; i++){
      if(nodes[i][defCol.Checked] !==  state){
           state = -1;
           break;
      }
   }
   node[defCol.Checked] = state;
   }else{
     node[defCol.Checked] = node[defCol.Checked];
   }
  }
}

function dragEndFn(scope, e){
    e.preventDefault();
    e.stopPropagation();
    dragged.style.display = "block";
    //console.log(over);
    over.parentElement.removeChild(holderPlace());
    var from = Number(dragged.dataset.id);
    //console.log(from);                    
    var to = Number(over.dataset.id);
    //console.log(to); 
    
    
    //console.log(over.parentElement.dataset);
    //console.log(this.state.node);
    
    //if(dragData.state.node[defCol.Id] === dropData.state.node[defCol.Id]){
    //  scope.state.node[defCol.Childs].splice(to, 0, scope.state.node[defCol.Childs].splice(from, 1)[0]);
    //  scope.setState({node: scope.state.node});
    //}else{
    //  dropReraw(from, to);
    //}
    
    if(dragData.props.node[defCol.Id] === dropData.props.node[defCol.Id]){
     // if (from < to) {
      //  to--;
      //}
      scope.props.node[defCol.Childs].splice(to, 0, scope.props.node[defCol.Childs].splice(from, 1)[0]);
      //scope.setState({node: scope.props.node});
    }else{
      dropReraw(from, to, e);
    }
    //scope.forceUpdate();
    scope.props.forceUp();
    
    if(settings.CallBack.DragEnd && typeof settings.CallBack.DragEnd === 'function'){
          settings.CallBack.DragEnd(e, scope);
    }
}

function dragOverFn(scope, e){
    e.preventDefault();
    e.stopPropagation();
          
  dropData = scope;
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
    
    var contDrop = true;
    if(settings.CallBack.DragOver && typeof settings.CallBack.DragOver === 'function'){
       contDrop = settings.CallBack.DragOver(e, scope, dragged, eventElm);
    }
    
    if(contDrop && contDrop === false){
      return;
    }
    //var select = Number(eventElm.dataset.id);
    //console.log(select);
    //if(this.state.node[defCol.Childs][select] && this.state.node[defCol.Childs][select].length === 0){
    //  var ca =  eventElm.getElementsByTagName("ol")[0];
    //  if(ca){
    //    ca.className  =" "  
    //  }
    //}
    
    var posEventEl = e.clientY - eventElm.offsetTop;
    
    var heightOfOver = eventElm.offsetHeight /2;
    var parent = eventElm.parentElement;
    
    
    if(posEventEl > heightOfOver){
      parent.insertBefore(holderPlace(), eventElm.nextElementSibling);
      //e.InBefore = true;
    }else if(posEventEl < heightOfOver){
       parent.insertBefore(holderPlace(), eventElm);
     //  e.InBefore = false;
    }
}

CMSTree.create = function (el, def, options) {
  return new CMSTree(el,def, options);
};

return CMSTree;
});

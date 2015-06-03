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

function CMSTree(el, def, options) {

var placeholder = null;
var dragged;
var over;
var dragData;
var dropData;
var selectedNode = {};
var element;
var allowDrop = false;


var defOriginal = {
  Id:'Id',
  Name: 'Name',
  Type: 'Type',
  Childs: 'Sites',
  Checked: 'Checked',
  Count: 'SiteCount',
  Model: {}
}

var defCol = {}

var opNode = {
  Node: {
    IsShowIcon: true,
    IsShowCheckBox: true,
    IsShowRootNode: true,
    IsShowNodeMenu: true,
    IsShowCount: false,
    IsShowAddNodeButton: true,
    IsShowAddItemButton: true,
    IsShowEditButton: true,
    IsShowDelButton: true,
    IsDraggable: true,
    IsCollapsedAll: null
  },
  Item: {
    IsShowItemMenu: true,
    IsShowDelButton: true,
    IsShowEditButton: true,
    IsShowIcon: true,
    IsAllowFilter: true,
    IsHightlightFilter: true
  },
  Icon: {
    Expand: 'fa fa-minus-square-o',
    Collpased: 'fa fa-plus-square-o',
    NodeExpand: 'fa fa-folder-open',
    GroupExpand: 'fa fa-building',
    NodeCollpased: 'fa fa-folder',
    GroupCollpased: 'fa fa-building-o',
    RootIcon: 'fa fa-cloud',
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
    SelectedFn: null,
    filterText: "",
    DragStart: null,
    DragOver: null,
    DragEnd: null
  }
  
};

var settings= {}

var NType = {
  Folder: 0,
  Group: 2,
  File: 1
}

var NodeType = {}

var TreeNodeContent = React.createClass({
      checkFn: function(chck, scope){
        checkNodeStatus(this.props.node, this.refs.checkbox);
          this.props.refresh(chck);
        },
        toogleExpand: function(){
           this.props.collapsed = !this.props.collapsed;
           this.props.toggleCollapsed(this.props.collapsed);
        },
        selectedNodeFn: function(){
          settings.CallBack.selectedNode = this.props.node;
          if(settings.CallBack.SelectedFn){
            settings.CallBack.SelectedFn(this.props.node, this);
          }
          //this.forceUpdate();
          this.props.refresh();
        },
        addNode: function(scope){
          AddNode(this);
        },
        addNodeItem: function(scope){
          AddNode(this);
        },
        editNode: function(scope){
          EditNode(this);
        },
        delNode: function(scope){
          DelNode(this);
        },
        render: function() {
            var node = this.props.node;
            var classSelect, addRegion, addSite, editRegionSite, deleteRegionSite, sitecount, boxcontrol, checkbox;
            var collapsed = this.props.collapsed;

            if (settings.CallBack.selectedNode && settings.CallBack.selectedNode[defCol.Id] === this.props.node[defCol.Id]) {
                classSelect = 'select';
            }

            var classCollapsed = collapsed === true ? settings.Icon.Collpased : settings.Icon.Expand;
              
            var classText;
            if(this.props.isRootNode && this.props.isRootNode === true){
              classText = settings.Icon.RootIcon;
            }else{
                classText = collapsed === true ? this.props.Icon.Collapsed : this.props.Icon.Expand;
            }
            classText = settings.Node.IsShowIcon === true ? classText: '';
            
            var textConent = (
               <a className = 'btn btn-xs' onClick={this.selectedNodeFn.bind(this)}>
                   <i className={classText}></i>
                   <ContentHightLight  node={this.props.node} filterText = {this.props.filterText} />
               </a>
            );
         
            sitecount =  settings.Node.IsShowCount === true ?  (<b className="badge pull-right">{node[defCol.Count]}</b>) : sitecount;

            editRegionSite = settings.Node.IsShowEditButton === true ?  ( <a className="btn btn-xs edit" onClick={this.editNode.bind(this)}><i className= {settings.Icon.NodeEdit}></i></a>) : editRegionSite;
            addRegion= settings.Node.IsShowAddNodeButton === true ? (<a className="btn btn-xs add" onClick={this.addNode.bind(this)}> <i className= {settings.Icon.NodeAdd}></i></a>) : addRegion;
            addSite = settings.Node.IsShowAddItemButton === true ? (<a className="btn btn-xs add" onClick={this.addNodeItem.bind(this)}><i className= {settings.Icon.NodeAddItem}></i></a>) : addSite;
          
            if(settings.Node.IsShowDelButton === true && node[defCol.Childs].length === 0){
                deleteRegionSite = (<a className="btn btn-xs del" onClick={this.delNode.bind(this)}><i className= {settings.Icon.NodeDel}></i></a>);
            }
            
            if(settings.Node.IsShowCheckBox === true){
              var checkstats =  this.props.node[defCol.Checked] === 1? true: false;
              checkbox =  (<input type="checkbox" checked={checkstats} ref="checkbox" onClick={this.checkFn.bind(this,node)} />);
              if(React.findDOMNode(this.refs.checkbox) && this.props.node[defCol.Checked] === -1){
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
    //checkFn: function(chck, scope){
    //   this.props.check(chck);
     //},
     refreshFn: function(chck, scope){
       this.props.refresh(chck);
     },
    dragStart: function(e) {
       dragStartFn(this, e)    
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
          
          //treenode = node[defCol.Childs].map(function(n,i){
          //  if(settings.Item.IsAllowFilter === true){
          //        var reg = RegExp('(' + this.props.filterText + ')', 'gi');
          //        if (n[defCol.Type] === 1 &&  n[defCol.Name].search(reg) === -1) {
          //          return;
          //        }
          //     }
          //     return (<li data-id={i} key={i} draggable="true" data-drag-handle="true" onDragEnd={this.dragEnd} onDragStart={this.dragStart}><Tree node = {n} filterText = {this.props.filterText} check={this.checkFn} /></li>);
          //}.bind(this));
          
             
           node[defCol.Childs].forEach(function(n,i) {
                if(settings.Item.IsAllowFilter === true){
                  var reg = RegExp('(' + this.props.filterText + ')', 'gi');
                  if (n[defCol.Type] === NodeType.File && n[defCol.Name] && n[defCol.Name].search(reg) === -1) {
                    return;
                  }
                }
               
              if(settings.Node.IsDraggable === true){
               treenode.push(<li data-id={i} data-type-id={n[defCol.Type]} key={n[defCol.Type]+'.'+n[defCol.Id]} draggable="true" data-drag-handle="true" onDragEnd={this.dragEnd} onDragStart={this.dragStart}><Tree node = {n} filterText = {this.props.filterText} refresh={this.refreshFn} /></li>);
              }else{
                treenode.push(<li data-id={i} data-type-id={n[defCol.Type]} key={n[defCol.Type]+'.'+n[defCol.Id]}><Tree node = {n} filterText = {this.props.filterText} refresh={this.refreshFn} /></li>);
              }
               
           }.bind(this));
        
        if(settings.Node.IsDraggable === true){     
          return (<ol className = {collapsedClass} data-type-id={node[defCol.Type]} data-id={node[defCol.Id]} onDragOver={this.dragOver}>{treenode}</ol>);
        }else{
          return (<ol className = {collapsedClass} data-type-id={node[defCol.Type]} data-id={node[defCol.Id]} >{treenode}</ol>);  
        }
        }else{
          if(settings.Node.IsDraggable === true){
            var treenode = (<li className="node-hidden" data-type-id={node[defCol.Type]} data-id={-1} data-drag-handle="true"></li>);
            return (<ol className = {collapsedClass}  data-type-id={node[defCol.Type]} data-id={node[defCol.Id]} onDragOver={this.dragOver}>{treenode}</ol>);
          }else{
            var treenode = (<li className="node-hidden" data-type-id={node[defCol.Type]} data-id={-1}></li>);
            return (<ol className = {collapsedClass}  data-type-id={node[defCol.Type]} data-id={node[defCol.Id]}>{treenode}</ol>);
          }
        }
      }
});

var ContentHightLight = React.createClass({
  render: function() {
    var filterT = this.props.filterText;
    var text = this.props.node[defCol.Name];
    if (text && settings.Item.IsAllowFilter === true && filterT && filterT !== "" && settings.Item.IsHightlightFilter === true){
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
              this.props.refresh(chck);
        },
        selectedNodeFn: function(){
          settings.CallBack.selectedNode = this.props.node;
          //this.forceUpdate();
          if(settings.CallBack.SelectedFn){
            settings.CallBack.SelectedFn(this.props.node, this);
          }
          this.props.refresh();
        },
        editNode: function(scope){
          EditNode(this);
        },
        delNode: function(scope){
          DelNode(this);
        },
        render: function() {
            var node = this.props.node;
            var classSelect, boxcontrol, editRegionSite, deleteRegionSite,checkbox;
            var classCollapsed = 'glyphicon icon-null';
            
            if (settings.CallBack.selectedNode && settings.CallBack.selectedNode[defCol.Id] === this.props.node[defCol.Id]) {
                classSelect = 'select';
            }
       
            var classText = settings.Item.IsShowIcon === true?  settings.Icon.Item : '' ;
       
            var textConent = (
               <a className = 'btn btn-xs' onClick={this.selectedNodeFn.bind(this)}>
                   <i className={classText}></i>
                   <ContentHightLight  node={this.props.node} filterText = {this.props.filterText} />
               </a>
            );
         
            editRegionSite = settings.Item.IsShowEditButton === true?  (<a className="btn btn-xs edit" onClick={this.editNode.bind(this)} ><i className={settings.Icon.ItemEdit}></i></a>) : editRegionSite;
          
            deleteRegionSite = settings.Item.IsShowDelButton === true?  (<a className="btn btn-xs del" onClick={this.delNode.bind(this)} ><i className={settings.Icon.ItemDel}></i></a>) : deleteRegionSite;
            
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
                    <a><i className={classCollapsed}></i></a>
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
        return {
            //node: node,
            collapsed: settings.Node.IsCollapsedAll === null? false : settings.Node.IsCollapsedAll
        }
    },
    forceUp: function(){
      this.forceUpdate();
    },
    refreshFn:function(node){
      
      node = this.props.node;
            if (settings.Node.IsShowCheckBox === true) {
                var nodes = node[defCol.Childs];
                setStatusCheck(node, nodes);
            }

      this.forceUpdate();
      
      if(this.props.refresh){
        this.props.refresh(node);
      }
    },
    toggleCollapsed: function(collapsed) {
      
      //setOpNode(this.props.node[defCol.Id], collapsed)
        this.setState({
            collapsed: collapsed
        });
    },
    render: function() {
      
      var showRootNode = this.props.showRootNode !== undefined ? this.props.showRootNode: true;
      var isRootNode = false;
      if(this.props.showRootNode === undefined){
        this.state.collapsed = settings.Node.IsCollapsedAll === null? this.state.collapsed : settings.Node.IsCollapsedAll;
      }else{
        isRootNode = true;
      }
      var collapsed = this.state.collapsed;
      
      var content , nodechild;

      var scope = this;
      var node = this.props.node;
  
      switch(node[defCol.Type]){
       case NodeType.Folder: {
            var Icon = {
              Expand: settings.Icon.NodeExpand,
              Collapsed: settings.Icon.NodeCollpased
            };
            if(showRootNode === true){
              content = (<TreeNodeContent node ={node} isRootNode={isRootNode} Icon={Icon} toggleCollapsed={scope.toggleCollapsed}  collapsed={collapsed} refresh={scope.refreshFn}  filterText = {scope.props.filterText}/>) ;
            }
            nodechild =  (<TreeNode node= {node} forceUp={scope.forceUp.bind(scope)} collapsed={collapsed}  toggleCollapsed={scope.toggleCollapsed} filterText = {scope.props.filterText}  refresh={scope.refreshFn}  />);
            break;
            
       }
       case NodeType.Group: {
            var Icon = {
              Expand: settings.Icon.GroupExpand,
              Collapsed: settings.Icon.GroupCollpased
            };

            content = (<TreeNodeContent node ={node} Icon={Icon} toggleCollapsed={scope.toggleCollapsed}  collapsed={collapsed} refresh={scope.refreshFn}  filterText = {scope.props.filterText}/>) ;
            nodechild =  (<TreeNode node= {node} forceUp={scope.forceUp.bind(scope)} collapsed={collapsed}  toggleCollapsed={scope.toggleCollapsed} filterText = {scope.props.filterText}  refresh={scope.refreshFn}  />);
            break;
       }
       default: {
            content = (<FileNodeContent node ={node} toggleCollapsed={scope.toggleCollapsed}  collapsed={collapsed} refresh={scope.refreshFn}  filterText = {scope.props.filterText} />) ;
            break;
       }
      }
        
      return (<groupNode>
        {content}
        {nodechild}
      </groupNode>);
    }
});

  element = el;
  
  settings = JSON.parse(JSON.stringify(opNode));
  NodeType = JSON.parse(JSON.stringify(NType));
  defCol = JSON.parse(JSON.stringify(defOriginal));
  
  contructTree(def, options);
  
  function contructTree(def, options){
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
      }
    
      if(options){
         if(options.Node){
           var node = options.Node;
           settings.Node.IsShowIcon = node.IsShowIcon !== undefined ? node.IsShowIcon : settings.Node.IsShowIcon;
           settings.Node.IsDraggable = node.IsDraggable !== undefined ? node.IsDraggable : settings.Node.IsDraggable;
           settings.Node.IsShowCheckBox = node.IsShowCheckBox !== undefined ? node.IsShowCheckBox : settings.Node.IsShowCheckBox;
           settings.Node.IsShowRootNode = node.IsShowRootNode !== undefined ? node.IsShowRootNode : settings.Node.IsShowRootNode;
           settings.Node.IsShowNodeMenu = node.IsShowNodeMenu !== undefined ? node.IsShowNodeMenu : settings.Node.IsShowNodeMenu;
           settings.Node.IsShowCount = node.IsShowCount !== undefined ? node.IsShowCount : settings.Node.IsShowCount;
         }
         if(options.Item){
           var node = options.Item;
           settings.Item.IsShowItemMenu = node.IsShowItemMenu !== undefined ? node.IsShowItemMenu : settings.Item.IsShowItemMenu;
           settings.Item.IsShowIcon = node.IsShowIcon !== undefined ? node.IsShowIcon : settings.Item.IsShowIcon;
           settings.Item.IsHightlightFilter = node.IsHightlightFilter !== undefined ? node.IsHightlightFilter : settings.Item.IsHightlightFilter;
           settings.Item.IsAllowFilter = node.IsAllowFilter !== undefined ? node.IsAllowFilter : settings.Item.IsAllowFilter;
           
         }
         if(options.Icon){
           // implement later
         }
         
          if(options.CallBack){
           var node = options.CallBack;
    
           settings.CallBack.SelectedNode = node.SelectedNode ? node.SelectedNode : settings.CallBack.SelectedNode;
           settings.CallBack.filterText = node.filterText? node.filterText : '';
           settings.CallBack.AddNode = node.AddNode && typeof node.AddNode === 'function' ? node.AddNode : settings.CallBack.AddNode;
           settings.CallBack.EditNode = node.EditNode && typeof node.EditNode === 'function' ? node.EditNode : settings.CallBack.EditNode;
           settings.CallBack.DelNode = node.DelNode && typeof node.DelNode === 'function' ? node.DelNode : settings.CallBack.DelNode;
           settings.CallBack.SelectedFn =node.SelectedFn && typeof node.SelectedFn === 'function' ? node.SelectedFn : settings.CallBack.SelectedFn;
           settings.CallBack.DragStart = node.DragStart && typeof node.DragStart === 'function' ? node.DragStart : settings.CallBack.DragStart;
           settings.CallBack.DragOver = node.DragOver && typeof node.DragOver === 'function' ? node.DragOver : settings.CallBack.DragOver;
           settings.CallBack.DragEnd = node.DragEnd && typeof node.DragEnd === 'function' ? node.DragEnd : settings.CallBack.DragEnd;
         }
         
         if (options.Type) {

              NodeType.Folder = options.Type.Folder ? options.Type.Folder : NodeType.Folder;
              NodeType.Group = options.Type.Group ? options.Type.Group : NodeType.Group;
              NodeType.File = options.Type.File ? options.Type.File : NodeType.File;
          }
      }
      
      RenderTree(element);
  }
  
  
  function RenderTree(element){
    React.render(<Tree node={defCol.Model} filterText = {settings.CallBack.filterText} showRootNode={settings.Node.IsShowRootNode} />, element )
  }
 
 this.refesh = function(){
   RenderTree(element);
 }
 
 this.filter = function(filterText){
   settings.CallBack.filterText = filterText? filterText : '';
   RenderTree(element);
 }
 
 this.expandAll = function(){
   settings.Node.IsCollapsedAll = false;
   RenderTree(element);
   settings.Node.IsCollapsedAll = null;
 }
 
 this.collapsedAll = function(){
   settings.Node.IsCollapsedAll = true;
   RenderTree(element);
   settings.Node.IsCollapsedAll = null;
 }
 
 this.destroy = function () {

			element = null;

			// Remove draggable attributes
			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
				el.removeAttribute('draggable');
			});

		}


function AddNode(scope){
  
  if(!settings.CallBack.AddNode){
    return;
  }
  
  settings.CallBack.AddNode(scope.props.node, scope);
}

function EditNode(scope){
  if(!settings.CallBack.EditNode){
    return;
  }
  settings.CallBack.EditNode(scope.props.node, scope);
}

function DelNode(scope){
  if(!settings.CallBack.DelNode){
    return;
  }
  settings.CallBack.DelNode(scope.props.node, scope);
}

function SelectedFn(scope){
  if(!settings.CallBack.SelectedFn){
    return;
  }
  settings.CallBack.SelectedFn(scope.props.node, scope);
}

function CbDragover(e, scope, dragged, eventElm){
  
    var contDrop = true;
    if(settings.CallBack.DragOver && typeof settings.CallBack.DragOver === 'function'){
       contDrop = settings.CallBack.DragOver(e, scope, dragged, eventElm);
    }
    return contDrop;
}

function CbDragend(e, scope){
  if(settings.CallBack.DragEnd && typeof settings.CallBack.DragEnd === 'function'){
    settings.CallBack.DragEnd(e, scope);
  }
}

function CbDragstart(e, scope){
  if(settings.CallBack.DragStart && typeof settings.CallBack.DragStart === 'function'){
       settings.CallBack.DragStart(e, scope);
  }
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
 if(node[defCol.Type] !== NodeType.File){
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
    
    if(allowDrop === false){
      return;
    }
    
    dragged.style.display = "block";
    
    over.parentElement.removeChild(holderPlace());
    
    var from = Number(dragged.dataset.id);
    //console.log(from);                    
    var to = Number(over.dataset.id);
    //console.log(to); 
   
    if(dragData.props.node[defCol.Id] === dropData.props.node[defCol.Id]){
      if(from < to) to--;
      if(e.InBefore === false) to++;
      scope.props.node[defCol.Childs].splice(to, 0, scope.props.node[defCol.Childs].splice(from, 1)[0]);
      //this.forceUpdate();
    }else{
      dropReraw(from, to, e);
    }
    
    scope.props.forceUp();
    
    CbDragend(e, scope);
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

    if (eventElm.getAttribute("data-drag-handle") !== "true") {
        return;
    }
    
      allowDrop = false;
      
    var contDrop = CbDragover(e, scope, dragged, eventElm);
    
    if(contDrop && contDrop === false){
      return;
    }
    
    //var posEventEl = e.pageY - 120 - eventElm.offsetTop;
    var posEventEl = e.pageY - eventElm.offsetTop;
    
    var heightOfOver = eventElm.offsetHeight /2;
    var parent = eventElm.parentElement;
    
    //console.log('Y: ' + posEventEl + ' offsetTop' + '???' + heightOfOver);
    if(posEventEl > heightOfOver){
      parent.insertBefore(holderPlace(), eventElm.nextElementSibling);
      e.InBefore = false;
    }else if(posEventEl < heightOfOver){
       parent.insertBefore(holderPlace(), eventElm);
       e.InBefore = true;
    }
    
    allowDrop = true;
}

function dragStartFn(scope, e){
    //  e.preventDefault();
    e.stopPropagation();
    
    allowDrop = false;
    
    dragged = e.currentTarget; 
    e.dataTransfer.effectAllowed = 'move';
    dragData = scope;
    console.log(dragData);

    e.dataTransfer.setData("text/html", e.currentTarget);
    
    CbDragstart(e, scope);
}


}

CMSTree.create = function (el, def, options) {
  return new CMSTree(el,def, options);
};

return CMSTree;
});

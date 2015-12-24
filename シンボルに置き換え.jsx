/*
 * シンボルに置き換え.jsx  V0.1
 *
 * Copyright (c) 2015 Yasutsugu Sasaki
 * http://2-hats.hateblo.jp
 *
 * Released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

#target illustrator

$.localize = true;
$.locale = null;

var myDoc = app.activeDocument;

if(myDoc.selection.length == 1){
  var baseObj = myDoc.selection[0];
  
  if(baseObj.typename == "PathItem"){
    var numPathPoints = baseObj.pathPoints.length;
    var diffW = baseObj.visibleBounds[2] - baseObj.visibleBounds[0] - baseObj.width;
    var diffH = -(baseObj.visibleBounds[3] - baseObj.visibleBounds[1]) - baseObj.height;
    
    //Making a new symbol of  the base object.
    var duplicatedObj= baseObj.duplicate();
    baseObj.selected = false;
    app.executeMenuCommand('Adobe New Symbol Shortcut');
    var newSymbol = myDoc.symbols[myDoc.symbols.length - 1];
    myDoc.selection[0].remove();
    baseObj.selected = true;
    
    //Finding objects which correspond to the base object.
    //Objects which have the same properties of the number of pathpoints and appearances
    //will be considered they all are corresponded.
    app.executeMenuCommand('Find Appearance menu item');
    var selectedObjs= [];
    for(var i = 0, il = myDoc.selection.length; i < il; i++){
      if(myDoc.selection[i].pathPoints.length == numPathPoints ){
        selectedObjs.push(myDoc.selection[i]);
      }
    }
    
    myDoc.selection = null;

    //Replacing the corresponded objects with instances of the new symbol.
    for(var j = 0, jl = selectedObjs.length; j < jl; j++){
      var sourceObj = selectedObjs[j];
      var instance = sourceObj.layer.symbolItems.add(newSymbol);
      instance.position = [sourceObj.left, sourceObj.top];
      instance.width = sourceObj.width + diffW;
      instance.height = sourceObj.height + diffH;
      sourceObj.remove();
    }
    
  } else {
    alert({en: "Please select a path item", ja: "選択できるのはパスオブジェクトのみです。"});
  }

} else {
  alert({en: "Please select an object which you want to trun into a symbol.", ja: "シンボル化したいオブジェクトを１つだけ選んでください。"});
}
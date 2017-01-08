

//////////////////////////////////////////querySelector('#ul li')兼容：标准浏览器、ie8以上
// 调用方法 和 原生的调用方法一样 querySelector(' #ul2 li');

function querySelector(){
    /*把父级和子级取出来*/
    //说明传了2个
    var parent = null;//获取父级
    var child = null;//获取子级
    //2个参数的时候
    if(arguments.length === 2){
      return selector(arguments[1],arguments[0]);
    }else{
      //['#ul','li']
      var arr = arguments[0].match(/\S+/g);
      //把#ul变成真正的元素
      //因为selector的第二个参数要传el
      parent = selector(arr[0]);
      child = arr[1];
      //selector(字符串子级,元素的父级)
      return selector(child,parent);
    }
  }

  function selector(str,parent){//这是给上面的函数使用的 去照class 或 ID
    parent = parent?parent:document;
    var sele = str.substring(0,1);
    var String = str.substring(1);
    switch(sele){
      case '.':
        return getByClass(String,parent)[0];
      break;
      case '#':
        return parent.getElementById(String);
      break;
      default:
        //console.log(parent)
        return parent.getElementsByTagName(str)[0];
      break;
    }
  }

//////////////////////////////////////////getByClassName:选择class的IE9以下浏览器不兼容
//调用getbyClass('class',父级对象); 第二个参数可选
//传一个父级parent在外面获取好就可以是个对象
function getByClass(str,parent){
          parent = parent?parent:document;
          if(parent.getElementsByClassName){//这是正常的
              return  parent.getElementsByClassName(str);
          }else{//这是兼容的
              var arr =[];
              var aEle = parent.getElementsByTagName('*');
              var re = new RegExp('\\b '+str+'\\b');//\b边界符
              for(var i =0; i < aEle.length; i++){
                    if(re.test(aEle[i].className)){
                          arr.push(aEle[i]);
                    }
              }
              return arr;
          }
  }


//////////////////////////////////////////计算后样式获取或修改的框架///////////////////////////////////////

/* 当css的参数个数小于3，获取否则 设置 */
function css(el,attr,val) {//兼容ie
  if(arguments.length < 3) {
  //如果传输的参数小于3就是两位的那么就是获取计算后样式
    var val  = 0;//设置变量记录这个获取到样式的值
    if(el.currentStyle) {//如果是在IE下的走这行代码
      val = el.currentStyle[attr];
    } else {//不在IE下的走这个点吗获取计算后样式
      val = getComputedStyle(el)[attr];
    }
    if(attr == "opacity") {//如果写入得是透明度的话把小数换成整数
      val*=100;
    }
    return parseFloat(val);//返回这个计算后的样式的值
  }
  if(attr == "opacity") {//这是设置样式的代码就是传入三个参数的时候
    el.style.opacity = val/100;//这是正常版的
    //总结设置样式透明度传入*100后的整数
    el.style.filter = "alpha(opacity = "+val+")";//这是兼容IE的
  } else {//设置的样式不是透明度的时候
    el.style[attr] = val + "px";//传入的元素的样式的值单位为像素
  }
}

//////////////////////////////////////////DOM找元素节点的兼容
///firstElementChild ：高版本浏览器 
//firstChild {IE8以下直接能获取到元素节点

// firstElementChild 低版本用 ->firstChild  找第一个节点
// lastElmentChild  低版本用 lastChild  找第一个节点  兼容同上
// nextElementSibling           nextSibling           兼容同上
// previousElementSibling       previousSibling       兼容同上

function next(obj){//下一个nextElementSibling
    /*如果没有传obj并且没有下个兄弟节点就返回null */
    if(!obj && !obj.nextSibling)return null;
    
    if(obj.nextElementSibling){
      return obj.nextElementSibling;
    }
    if(obj.nextSibling && obj.nextSibling.nodeType === 1){
      return obj.nextSibling;
    }
    return null;
  }
  
  function prev(obj){//上一个previousElementSibling
    /*如果没有传obj并且没有上个兄弟节点就返回null */
    if(!obj && !obj.previousSibling)return null;
    
    if(obj.previousElementSibling){
      return obj.previousElementSibling;
    }
    if(obj.previousSibling && obj.previousSibling.nodeType === 1){
      return obj.previousSibling;
    }
    return null;
  }

//-----------------------------------------------滚轮事件---------------------------------------
// 兼容 火狐的函数  正常的事chrom和IE兼容  
//调用方法
// myWheel(box,function(o){//o 是一个开关在函数里返回了 true 就是上滚轮
//    if(o){
//      //向上滚动
      
//    }else{
//      //向下滚动
//  });

function myWheel(obj,callback){//参数是1 事件元素 2 滚轮要执行的事件函数
  obj.addEventListener('DOMMouseScroll',whellFn);//ff就要走DOMMouseScroll
  obj.addEventListener('mousewheel',whellFn);//chrome就要走mousewheel
  function whellFn(ev){
    var down = true;//代理判断上下的开关
    if(ev.wheelDelta){//如果支持ev.wheelDelta说明不是火狐
      //如果ev.wheelDelta大于0,说明向上true，否则向下false
      down = ev.wheelDelta > 0 ? true : false;
    }else{//这是火狐的
      //ev.detail小于0为向上，大于0向下 
      down = ev.detail < 0 ? true : false;
    }
    if(callback && typeof callback === 'function'){
      callback(down);
    }
    ev.preventDefault();
  }
}

//----------------------------------------事件绑定函数的兼容----------------------------
//调用方法：
//addEvent(obj,evnts,fn) 1.是绑定对象 2 是绑定事件不带on 3.函数或函数名
//实例：addEvent(div,'click',function(){});
function addEvent(obj,evnts,fn){
    if(obj.addEventListener){
      return obj.addEventListener(evnts,fn);
    }else{
      obj[fn] = function (){
        var b = fn.call(obj);
        return (b===false)?false:true;
      }
      return obj.attachEvent('on'+evnts,obj[fn]);
    }
  }

// function addEvent(obj,evnts,fn){
//     if(obj.addEventListener){
//       return obj.addEventListener(evnts,fn);
//     }else{
//       obj[fn] = function (){
//         fn.call(obj);
//       }
//       return obj.attachEvent('on'+evnts,obj[fn]);
//     }
//   }
//----------------------------------------事件绑定函数的兼容----------------------------
  function removeEvent(obj,evnts,fn){
    if(obj.removeEventListener){
      return obj.removeEventListener(evnts,fn);
    }else{
      return obj.detachEvent('on'+evnts,obj[fn]);
    }
  }

(function () {

    "use strict";
    var transform = getTransform();

    function Drag(elem) {

        //if(typeof elem === 'object'){
            this.elem = typeof elem === 'object' ? elem : document.getElementById(elem);
            this.startX = 0;
            this.startY = 0;
            this.sourceX = 0;
            this.sourceY = 0;
            this.init();

        // }else {
        //     throw new Error ('Parameters can not be empty')
        // }
    }

    Drag.prototype={
        constructor:Drag,

        init:function () {
            this.setDrag()
        },
        //获取元素style属性值
        getStyle:function (property) {
            return document.defaultView.getComputedStyle?document.defaultView.getComputedStyle(this.elem,null)[property]:this.elem.currentStyle[property];
        },
        getPosition:function () {
          var pos = {x:0,y:0};
          if(transform){
              var transformValue = this.getStyle('transform');
              if(transformValue==='none'){
                  this.elem.style[transform] = 'translate(0,0)';
                  return pos
              }
              else {
                  var temp = transformValue.match(/-?\d+/g);
                  pos = {
                      x: parseInt(temp[4].trim()),
                      y: parseInt(temp[5].trim())
                  }
              }
          }else {
              if(this.getStyle('position') === 'static') {
                  this.elem.style.position = 'relative';
              } else {
                  pos = {
                      x: parseInt(this.getStyle('left') ? this.getStyle('left') : 0),
                      y: parseInt(this.getStyle('top') ? this.getStyle('top') : 0)
                  }
              }
          }

            return pos;
        },
        setPosition:function (pos) {
            if(transform) {
                //支持transform属性
                this.elem.style['transform'] = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
            }else {
                this.elem.style.top=pos.y+'px';
                this.elem.style.left=pos.x+'px';
            }
        },
        setDrag: function() {
            var self = this;
            this.elem.addEventListener('mousedown', start, false);
            function start(event) {
                self.startX = event.pageX;
                self.startY = event.pageY;

                var pos = self.getPosition();

                self.sourceX = pos.x;
                self.sourceY = pos.y;

                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', end);
            }

            function move(event) {
                var currentX = event.pageX;
                var currentY = event.pageY;

                var distanceX = currentX - self.startX;
                var distanceY = currentY - self.startY;

                self.setPosition({
                    x: (self.sourceX + distanceX).toFixed(),
                    y: (self.sourceY + distanceY).toFixed()
                })
            }

            function end() {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', end);
                // do other things
            }
        }
    };


    //判断transform属性支持
    function getTransform() {
        var transform = '',
            divStyle = document.createElement('div').style,
            transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],
            i=0,
            len=transformArr.length;

        for (i;i<len;i++){
            if (transformArr[i] in divStyle){
                return transformArr[i]
            }
        }

        return transform
    }

    window.Drag=Drag;
})();
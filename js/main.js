(function () {
    function getTransform() {
        var transform = '',
            divStyle = document.createElement('div').style,
            transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],
            i = 0,
            len = transformArr.length;

        for (i; i < len; i++) {
            if (transformArr[i] in divStyle) {
                return transform = transformArr[i]
            }
        }
        return transform
    }

    /**
     * 功能：获取渲染后标签的样式，element是标签的对象，property是标签样式属性值
     * 参数：element是元素对象，property是样式属性
     * demo：getStyle(move, "marginLeft");
     * author：zth
     */
    function getStyle(elem, property) {
        return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(elem, null)[property] : elem.currentStyle[property];
    }

    /**
     * 功能：获取elem元素的初始位置
     * 参数：elem
     * demo：getPosition(elem);
     * author：zth
     */
    function getPosition(elem) {
        var pos = {x: 0, y: 0},
            transform = getTransform();

        if (transform){
            var transformValue = getStyle(elem,transform);
            if(transformValue==='none'){
                //translate基于原来的位置，沿X轴平移，长度为x，沿Y轴平移，长度为y
                elem.style[transform] = 'translate(0,0)';
                return pos;
            }else {
                var temp = transformValue.match(/-?\d+/g);//替换字符串中的数字为空
                return pos = {
                    x: parseInt(temp[4].trim()),  //matrix属性中的第四个元素x偏移y
                    y: parseInt(temp[5].trim())   //matrix属性中的第五个元素y偏移
                }
            }
        }else {
            if(getStyle(elem, 'position') === 'static') {
                elem.style.position = 'relative';
                return pos;
            } else {
                var x = parseInt(getStyle(elem, 'left') ? getStyle(elem, 'left') : 0);
                var y = parseInt(getStyle(elem, 'top') ? getStyle(elem, 'top') : 0);
                return pos = {
                    x: x,
                    y: y
                }
            }
        }

    }

    /**
     * 功能：设置elem元素的位置
     * 参数：elem,pos是位置数组
     * demo：setPosition(elem,pos);
     * author：zth
     */
    function setPosition(elem, pos) {
        var transform = getTransform();
        if(transform) {
            elem.style[transform] = 'translate('+ pos.x +'px, '+ pos.y +'px)';
        } else {
            elem.style.left = pos.x + 'px';
            elem.style.top = pos.y + 'px';
        }
        return elem;
    }


    /**
     * 功能：获取鼠标初始位置
     * demo：setPosition(elem,pos);
     * author：zth
     */
// 获取目标元素对象
    var oElem = document.getElementById('demo');

// 声明2个变量用来保存鼠标初始位置的x，y坐标
    var startX = 0;
    var startY = 0;

// 声明2个变量用来保存目标元素初始位置的x，y坐标
    var sourceX = 0;
    var sourceY = 0;
    /**
     * 功能：获取鼠标初始位置
     * demo：setPosition(elem,pos);
     * author：zth
     */
    function start(event) {
        startX = event.pageX;
        startY = event.pageY;

        var pos = getPosition(oElem);

        sourceX = pos.x;
        sourceY = pos.y;

        document.addEventListener('mousemove', move, false);
        document.addEventListener('mouseup', end, false);
    }

    function move(event) {
        var currentX = event.pageX;
        var currentY = event.pageY;

        //移动后的鼠标位置 - 鼠标初始位置 = 移动后的目标元素位置 - 目标元素的初始位置
        //如果鼠标位置的差值我们用dis来表示，那么目标元素的位置就等于：
        //移动后目标元素的位置 = dis + 目标元素的初始位置
        var distanceX = currentX - startX; //偏移量
        var distanceY = currentY - startY;

        setPosition(oElem, {
            x: sourceX+distanceX,
            y: sourceY+distanceY
        })
    }

    function end(event) {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', end);
        // do other things
    }

   // oElem.addEventListener('mousedown', start, false);

    new Drag('demo');

})();
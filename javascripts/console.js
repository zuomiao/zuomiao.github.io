/*!
 * Console v0.1
 * www.xdnote.com
 *
 * Copyright (c) xdnote
 * Available under the BSD and MIT licenses
 */
/*
 * Console.js 为xdnote前段一个测试API,包括功能点:
 * 模式设置 <script src="console.js" debug="ture" / > 只有true为调试模式,非true值或无值都为false;
 * @authors xdnote.com
 */
! function(document, window) {
  if (document && window) {
    var scripts = document.getElementsByTagName('script'),
      debug = false,
      support = window.console ? true : false;
    for (var i = 0, j = scripts.length; i < j; i++) {
      var script = scripts[i];
      if (script.getAttribute('debug')) {
        debug = (script.getAttribute('debug') == 'true') ? true : false;
        break;
      }
    }
    var compatibility = function() {
      var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'profile', 'profileEnd', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
      var debugNotSupport = function(str) {
        window.alert(str);
      };
      var productMode = function() {};
      console = window.console = {};
      var i = 0,
        j = methods.length;
      if (debug && !support) {
        for (i = 0; i < j; i++) {
          console[methods[i]] = window.console[methods[i]] = debugNotSupport;
        }
      } else {
        for (i = 0; i < j; i++) {
          console[methods[i]] = window.console[methods[i]] = productMode;
        }
      }
    };
    var expHelp = function() {
      var comands = [{
        'key': '$$',
        'des': '$$(selector) 相当于 document.querySelectorAll(selector)'
      }, {
        'key': '$x',
        'des': '$x(path) 通过ppath取DOM'
      }, {
        'key': 'dir',
        'des': 'dir(element) 相当于console.dir(emement)'
      }, {
        'key': 'dirxml',
        'des': 'dirxml(object) 相当于console.dirxml(object)'
      }, {
        'key': 'keys',
        'des': 'keys(object) 返回对象里面所有的键'
      }, {
        'key': 'values',
        'des': 'values(object) 返回对象里面所有的值'
      }, {
        'key': 'profile',
        'des': 'profile(name) 计算JavaScript的CPU开始'
      }, {
        'key': 'profileEnd',
        'des': 'profileEnd(name) 计算JavaScript的CPU结束'
      }, {
        'key': 'monitorEvents',
        'des': 'monitorEvents(object[, events]) 查看对象上面绑定的事件'
      }, {
        'key': 'unmonitorEvents',
        'des': 'unmonitorEvents(object[, events]) 取消绑定对象上面的事件'
      }, {
        'key': 'inspect',
        'des': 'inspect(object) 在debug window上框选到object'
      }, {
        'key': 'copy',
        'des': 'copy(object) 复制对象到剪切板上'
      }, {
        'key': 'clear',
        'des': '相当于 console.clear()'
      }, {
        'key': 'getEventListeners',
        'des': 'getEventListeners(object) 查看对象上面绑定的事件,相当于monitorEvents'
      }];
      var cmdStyle = 'display:block;width:100px;color:red;font-size:12px;text-align:right;';
      var desStyle = 'color:blue;font-size:12px;';
      var args = [];
      window.console.help = console.help = function() {
        for (var i = 0, j = comands.length; i < j; i++) {
          var helptxt = '';
          helptxt += '%c' + comands[i]['key'] + ':';
          helptxt += '%c' + '   ' + comands[i]['des'];
          console.log(helptxt, cmdStyle, desStyle);
        }
      };
    };
    // 1: 调试模式,浏览器支持:保持原样
    // 2: 调试模式,浏览器不支持:将所有的console方法定义为window.alert()
    // 3: 产品模式,浏览器支持:将所有的console方法注销,没有任何操作
    // 4: 产品模式,浏览器不支持:将所有的console方法注销,没有任何操作
    if (support && debug) {
      expHelp();
      console.log('%c进入调试模式', 'font-size:x-large;color:red;');
      return;
    } else if (support && !debug) {
      console.log('%c产品模式,不会再输出控制台', 'font-size:x-large;color:red;');
    } else if (!support && debug) {
      window.alert('你的浏览器不支持console,建议上线时不要设置debug为true');
    } else {

    }
    compatibility();
  }
}(document, window);
$.ajaxSetup({
	error: function (xhr, status, error) {
		alert(error);
	},
	complete: function(xhr, status) {
		if (xhr.readyState == 4 && xhr.responseText.substring(0,19) == '<!-- login.html -->') {
			if (confirm('会话已过期，要重新登录吗？')) {
				location.href = 'login.html';
			}
		}
	}
});

var themeName = 'gray';
var customThemeHref = "../static/easyui/themes/gray/easyui.css";

$(function() {
    init();
});

function init() {
    initTopMenu();
    initLeftMenu();
    $('body').layout();
    if ($.cookie('easyuiThemeName')) {
        changeTheme($.cookie('easyuiThemeName'));
    }
}

function initTopMenu() {
    var $changeThemeMenuButton = $("#change-theme-menubutton").menubutton({
        menu: '#theme-menu',
        iconCls: 'icon-custom-theme'
    });
    var $exitMenuButton = $("#exit-menubutton").menubutton({
        menu: '#system-menu',
        iconCls: 'icon-custom-lock'
    });
    $($changeThemeMenuButton.menubutton('options').menu).menu({
        onClick: function (item) {
            themeName = item.text.toLowerCase();
            changeTheme(themeName);
        }
    });
    $($exitMenuButton.menubutton('options').menu).menu({
        onClick: function (item) {
            if ("logout-button" == item.name) {
            	logout(false);
            } else if ("exit-button" == item.name) {
            	logout(true);
            }
        }
    });
}

function logout(close) {
	$.messager.progress();
	window.location.href = '../passport/logout';
	if(close){
		window.close();
	}
//		$.post(url + '/admin/logout',function(result){
//			var t = new Date().getTime();
//			var startTag = 0;
//			var endTag = result.urls.length;
//			for (var i=0; i<result.urls.length; i++) {
//				var url = result.urls[i];
//	    		$('<iframe id="ifr-'+t+'-'+i+'" style="display:none"></iframe>').appendTo(document.body);
//	    		$('#ifr-'+t+'-'+i).load(function(){
//	    			startTag++;
//					if (startTag >= endTag) {
//						window.location.href = result.referer;
//					}
//	    		});
//	    		$('#ifr-'+t+'-'+i).attr('src',url);
//			}
//			if (result.urls.length == 0) {
//				window.location.href = result.referer;
//			}
//		});
}

/**
 * 初始化菜单栏
 */
function initLeftMenu() {
	menuTree = $('#left-menu');
	$.ajax({
		url : '../passport/menuTreeNodes',
		async : false,
		success : function(result){
			leftMenus = result;
		}
	});
	menuTree.tree({
		data : leftMenus,
		onClick : function(node){
			window.location.href = node.attributes.url;
		}
	});
	var url = location.href.substring(location.href.lastIndexOf("/")+1);
	var selectedMenu;
	var selectedTitle = '';
	for (var i=0; i<leftMenus.length; i++) {
		if (selectedMenu) {
			break;
		}
		var parentMenu = leftMenus[i];
		for (var j=0; j<parentMenu.children.length; j++) {
			var menu = parentMenu.children[j];
			if (menu.attributes!=null&&menu.attributes.url == url) {
				selectedMenu = menu;
				selectedTitle = parentMenu.text + " -> " + menu.text;
				break;
			}
		}
	}
	
	if (selectedMenu) {
		menuTree.tree('select', menuTree.tree('find', selectedMenu.id).target);
	}
	$('#mainPanel').panel({
		title:selectedTitle,
		fit:true
	});
}

/* 修改主题 */
function changeTheme(themeName) {
    var $easyuiTheme = $("link[id='easyuiTheme']");
    var oldHref = $easyuiTheme.attr("href");
    var newHref = oldHref.substring(0, oldHref.indexOf('themes')) + 'themes/' + themeName + '/easyui.css';
    $easyuiTheme.attr("href", newHref);
    customThemeHref = newHref;

    //子页面iframe
    var $iframes = $('iframe');
    if ($iframes.length > 0) {
        var iframeHref = '../' + newHref;
        for (var i = 0; i < $iframes.length; i++) {
            $($iframes[i]).contents().find('link[id="easyuiTheme"]').attr('href', iframeHref);
        }
    }
    $.cookie('easyuiThemeName', themeName, {
        expires: 7
    });
}

function refreshTheme() {
    //子页面iframe
    var $iframes = $('iframe');
    if ($iframes.length > 0) {
        var iframeHref = '../' + customThemeHref;
        for (var i = 0; i < $iframes.length; i++) {
            $($iframes[i]).contents().find('link[id="easyuiTheme"]').attr('href', iframeHref);
        }
    }
}

/**
 * 检查新添加的Tab的主题是否跟系统一致，若不一致则切换至跟系统一样
 * @param title
 */
function checkTheme(title) {
    var $iframes = $('iframe');
    if ($iframes.length > 0) {
        var iframeId = 'iframe' + title;
        for (var i = 0; i < $iframes.length; i++) {
            if (iframeId == $($iframes[i]).attr('id')) {
                $($iframes[i]).contents().find('link[id="easyuiTheme"]').attr('href', '../' + customThemeHref);
            }
        }
    }
}

//将timestamp格式化成 YYYY-mm-dd HH:MM:ss 的字符串
function formatTime(timestamp) {
    var date = new Date(timestamp); 
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    var h = date.getHours();
    var M = date.getMinutes();
    var s = date.getSeconds();
    return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d)+' '
        +(h<10?('0'+h):h)+':'+(M<10?('0'+M):M)+':'+(s<10?('0'+s):s);
}

function formatDate(timestamp) {
    var date = new Date(timestamp); 
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
}

function showSuccessMessage() {
    $.messager.show({
        title : "消息",
        msg : '操作成功！',
        showType : 'show'
    });
}

function alertFailMessage() {
    $.messager.alert('错误信息', '操作失败！', 'error');
}

function alertSelectDataMessage() {
    $.messager.alert('提示信息', '请选中一条数据！', 'info');
}
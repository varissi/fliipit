"use strict";

var Dashboard = function () {
	
	var global = {
		tooltipOptions: {
			placement: "right"
		},
		menuClass: ".c-menu"
	};

	var menuChangeActive = function menuChangeActive(el) {
		var hasSubmenu = $(el).hasClass("has-submenu");
		$(global.menuClass + " .is-active").removeClass("is-active");
		$(el).addClass("is-active");

		if (hasSubmenu && $("body").hasClass("sidebar-is-expanded")) {
				$(el).find("ul").slideDown();
				$(el).siblings().find("ul").slideUp();
				$(el).siblings().find("ul li").removeClass("content-is-active");
		}else{
			sidebarChangeWidth();
			$(el).find("ul").slideDown();
		}
	};

	var sidebarChangeWidth = function sidebarChangeWidth() {
		var $menuItemsTitle = $("li .menu-item__title");

		$("body").toggleClass("sidebar-is-reduced sidebar-is-expanded");
		$(".logo").toggleClass("is-opened");

		if ($("body").hasClass("sidebar-is-expanded")) {
			$('.toggleMainMenue i').removeClass("fa-chevron-circle-right").addClass('fa-chevron-circle-left');
			$('[data-toggle="tooltip"]').tooltip("destroy");
		} else {
			$('.toggleMainMenue i').removeClass('fa-chevron-circle-left').addClass("fa-chevron-circle-right");
			$('[data-toggle="tooltip"]').tooltip(global.tooltipOptions);
			$(".l-sidebar .u-list").find("ul").slideUp();
		}
	};

	return {
		init: function init() {
			$(".logo").on("click", sidebarChangeWidth);
			$('[data-toggle="tooltip"]').tooltip(global.tooltipOptions);
	}};
}();

Dashboard.init();

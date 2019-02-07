/*
 * Inspinia js helpers:
 *
 * correctHeight() - fix the height of main wrapper
 * detectBody() - detect windows size
 * smoothlyMenu() - add smooth fade in/out on navigation show/hide
 *
 */

export function correctLoginHeight() {
   /* var pageLogin = jQuery('#page-login');
    pageLogin.css("min-height", jQuery(window).height() + "px");*/
}

export function correctHeight() {
    var pageWrapper = jQuery('#page-wrapper');
    var navbarHeight = jQuery('nav.navbar-default').height();
    var wrapperHeigh = pageWrapper.height();

    if (navbarHeight > wrapperHeigh) {
        pageWrapper.css("min-height", navbarHeight + 20 + "px");
    }

    if (navbarHeight < wrapperHeigh) {
        if (navbarHeight < jQuery(window).height()) {
            pageWrapper.css("min-height", jQuery(window).height() + "px");
        } else {
            pageWrapper.css("min-height", navbarHeight + "px");
        }
    }

    if (jQuery('body').hasClass('fixed-nav')) {
        if (navbarHeight > wrapperHeigh) {
            pageWrapper.css("min-height", navbarHeight + "px");
        } else {
            pageWrapper.css("min-height", jQuery(window).height() - 60 + "px");
        }
    }
}

export function detectBody() {
    if (jQuery(document).width() < 769) {
        jQuery('body').addClass('body-small')
    } else {
        jQuery('body').removeClass('body-small')
    }
}

export function smoothlyMenu() {
    if (!jQuery('body').hasClass('mini-navbar') || jQuery('body').hasClass('body-small')) {
        // Hide menu in order to smoothly turn on when maximize menu
        jQuery('#side-menu').hide();
        // For smoothly turn on menu
        setTimeout(
            function () {
                jQuery('#side-menu').fadeIn(400);
            }, 200);
    } else if (jQuery('body').hasClass('fixed-sidebar')) {
        jQuery('#side-menu').hide();
        setTimeout(
            function () {
                jQuery('#side-menu').fadeIn(400);
            }, 100);
    } else {
        // Remove all inline style from jquery fadeIn function to reset menu state
        jQuery('#side-menu').removeAttr('style');
    }
}

export function existDataTable(selector) {
    return jQuery.fn.DataTable.isDataTable(selector);
}

export function loadDataTables(search, select) {
    if (jQuery.fn.DataTable.isDataTable('.dataTables-component')) {
        jQuery('.dataTables-component').DataTable().destroy();
    }

    var rownNumber = jQuery('.dataTables-component')[0].rows[0].cells.length;

    if (select)
        createDataTablesSelect(search, rownNumber - 1);
    else
        createDataTables(search, rownNumber - 1);
}

export function createDataTables(search, lastCol) {
    jQuery('.dataTables-component').DataTable({
        pageLength: 25,
        responsive: true,
        dom: 'lTgf<"clearInfo"i>tp',
        renderer: "bootstrap",
        searching: false,
        buttons: false,
        columnDefs: [
            {
                orderable: false,
                targets: lastCol
            }
        ],
        order: [[lastCol, 'asc']],
        language: {
            "search": "Buscar",
            "lengthMenu": "Mostrando _MENU_ resultados",
            "emptyTable": "No existen datos",
            "infoFiltered": "(_MAX_ total)",
            "info": "Mostrando de _START_ a _END_ de _TOTAL_ resultados",
            "infoEmpty": "",
            "paginate": {
                "first": "<<",
                "last": ">>",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        }
    });
}

export function createDataTablesSelect(search, lastCol) {
    jQuery('.dataTables-component').DataTable({
        pageLength: 100,
        responsive: true,
        dom: 'lTgf<"clearInfo"i>tp',
        renderer: "bootstrap",
        searching: false,
        buttons: false,
        columnDefs: [
            {
                orderable: false,
                className: 'select-checkbox',
                targets: lastCol
            },
        ],
        select: {
            style: 'multi',
            selector: 'tr:not(.disabled) td:last-child'
        },
        order: [[1, 'asc']],
        language: {
            "search": "Buscar",
            "lengthMenu": "Mostrando _MENU_ resultados",
            "emptyTable": "No existen datos",
            "infoFiltered": "(_MAX_ total)",
            "info": "Mostrando de _START_ a _END_ de _TOTAL_ resultados",
            "infoEmpty": "",
            "paginate": {
                "first": "<<",
                "last": ">>",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            select: {
                rows: " %d filas seleccionadas"
            }
        }
    });
}

export function loadCustomTables(tablaFields) {
    if (jQuery.fn.DataTable.isDataTable('.custom-table')) {
        jQuery('.custom-table').DataTable().destroy();
    }
    createCustomTables(tablaFields);
    jQuery('.custom-table').DataTable().order([1]).draw();
}

export function createCustomTables(tablaFields) {
    jQuery('.custom-table').DataTable({
        responsive: true,
        dom: 'lTgf<"clearInfo">tp',
        renderer: "bootstrap",
        searching: false,
        ordering: false,
        paginate: false,
        buttons: false,
        columns: tablaFields,
        language: {
            "emptyTable": "No existen datos",
            "infoEmpty": ""
        }
    });
}

export function exportChexkBoxes(inner, coldex, rowdex) {
    if (inner.length <= 0) return inner;
    var el = $.parseHTML(inner);
    var result = '';
    $.each(el, function (index, item) {
        if (item.nodeName == '#text') result = result + item.textContent;
        else if (item.nodeName == 'I') {
            if (item.classList.contains("fa-remove"))
                result = "NO";
            else result = "SI";
        }
        else if (item.nodeName == "IMG") {
            result = (item.hidden) ? '' : item.src;
        }
        else result = result + item.innerText;
    });
    return result;
}

export function exportChexkBoxesAnImages(inner, coldex, rowdex) {
    if (inner.length <= 0) return inner;
    var el = $.parseHTML(inner);
    var result = '';
    $.each(el, function (index, item) {
        if (item.nodeName == '#text') result = result + item.textContent;
        else if (item.nodeName == 'I') {
            if (item.classList.contains("fa-remove"))
                result = "NO";
            else result = "SI";
        }
        else if (item.nodeName == "IMG") {
            result = item.outerHTML;
        }
        else result = result + item.innerText;
    });
    return result;
}

export function leftPad(num, size) {
    var s = num + "";
    while (s.length < size)
       s = "0" + s;
    return s;
}
{{ -- tpl: autocomplete-template -- }}
    <ul class="dropdown-menu" style="z-index: 2000;">
        <%
            var len = _this.length;
            if (len) {
                for (var i = 0; i < len; i++) {
                    var item = _this[i];
        %>
                    <li class="auto-item" data-id="{{ item.id }}" data-text="{{ item.text }}"><a href="javascript:;">{{ item.text }}</a></li>
        <%
                }
            }
        %>
    </ul>
{{ -- /tpl -- }}
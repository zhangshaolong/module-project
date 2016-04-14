{{ -- tpl: dropdown-template -- }}
<div class="dropdown">
    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
        <span class="selected-item" data-val=""><%= _this.defaultText %></span>
        <span class="caret"></span>
        <%
            if (_this.name) {
        %>
            <input type="hidden" name="<%= _this.name %>" value="<%= _this.value %>"/>
        <%
            }
        %>
    </button>
    <ul class="dropdown-menu">
        <%
            var len = _this.list.length;
            for (var i = 0; i < len; i++) {
                var item = _this.list[i];
        %>
                <li class="dropdown-item" data-id="<%= item.id %>" data-text="<%= item.text %>"><a href="javascript:;"><%= item.text %></a></li>
        <%
            }
        %>
    </ul>
{{ -- /tpl -- }}
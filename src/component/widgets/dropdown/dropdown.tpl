{{ -- tpl: dropdown-template -- }}
<div class="{{ _this.dropup ? 'dropup' : 'dropdown' }}">
    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
        <span class="selected-item" data-val="">{{ _this.defaultText }}</span>
        <span class="caret"></span>
        <%
            if (_this.name) {
        %>
            <input type="hidden" name="{{ _this.name }}" value="{{ _this.value }}"/>
        <%
            }
        %>
    </button>
    <ul class="dropdown-menu"{{ _this.height ? ' style="max-height:' + _this.height + 'px;overflow-y:auto;"' : '' }}>
        <% include('dropdown-template-item', _this); %>
    </ul>
{{ -- /tpl -- }}

{{ -- tpl: dropdown-template-item -- }}
    <%
        var len = _this.list.length;
        for (var i = 0; i < len; i++) {
            var item = _this.list[i];
    %>
            <li class="dropdown-item{{ _this.value == item.id ? ' active' : '' }}" data-id="{{ item.id }}" data-text="{{# item.text }}" {{ item.tip ? ('title="' + item.tip + '" data-toggle="tooltip"') : '' }}><a href="javascript:;">{{ item.text }}</a></li>
    <%
        }
    %>
{{ -- /tpl -- }}
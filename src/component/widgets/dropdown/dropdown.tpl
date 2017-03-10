{{ -- tpl: dropdown-template -- }}
<div class="{{ _this.dropup ? 'dropup' : 'dropdown' }}">
    <button class="btn btn-default dropdown-toggle{{ _this.size ? ' ' + _this.size : '' }}" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
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
    <ul class="dropdown-menu{{ _this.fixedWidth ? ' fixed-width' : '' }}"{{ _this.height ? ' style="max-height:' + _this.height + 'px;overflow-y:auto;"' : '' }}>
        <%
            if (_this.filterable && _this.list.length) {
        %>
            <li class="search-container">
                <input type="text" class="form-control input-sm" placeholder="筛选列表数据">
            </li>
        <%
            }
        %>
        <% include('dropdown-template-item'); %>
    </ul>
{{ -- /tpl -- }}

{{ -- tpl: dropdown-template-item -- }}
    <%
        var len = _this.list.length;
        for (var i = 0; i < len; i++) {
            var item = _this.list[i];
            if (typeof item === 'string') {
                item = {
                    id: item,
                    text: item
                };
            }
    %>
            <li class="dropdown-item{{ _this.value == item.id ? ' active' : '' }}" 
                <%
                    for (var key in item) {
                        if (typeof item[key] !== 'object') {
                %>
                        data-{{ key }}="{{# item[key] }}"
                <%
                        }
                    }
                %>
             {{ item.tip ? ('title="' + item.tip + '" data-toggle="tooltip"') : '' }}><a href="javascript:;">{{ item.text }}</a></li>
    <%
        }
    %>
{{ -- /tpl -- }}
{{ -- tpl: multi-select-template -- }}
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
        <%
            if (_this.filterable && _this.list.length) {
        %>
            <li class="search-container">
                <input type="text" class="form-control input-sm" placeholder="筛选列表数据">
            </li>
        <%
            }
        %>
        <% include('multi-select-template-item', _this); %>
    </ul>
{{ -- /tpl -- }}

{{ -- tpl: multi-select-template-item -- }}
    <%
        var len = _this.list.length;
        for (var i = 0; i < len; i++) {
            var item = _this.list[i];
    %>
            <li class="dropdown-item{{ _this.value == item.id ? ' active' : '' }}" 
             {{ item.tip ? ('title="' + item.tip + '" data-toggle="tooltip"') : '' }}><a href="javascript:;"><input type="checkbox" class="chbox"  readonly="readonly" 
                <%
                    for (var key in item) {
                        if (typeof item[key] !== 'object') {
                %>
                        data-{{ key }}="{{# item[key] }}"
                <%
                        }
                    }
                %>
             />{{ item.text }}</a></li>
    <%
        }
    %>
{{ -- /tpl -- }}
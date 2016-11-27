{{ -- tpl:web-pagelist -- }}
    <div>
        <div class="module-block">
            <div class="block-title">页面分析</div>
            <div class="block-content">
                <div class="filters" data-module-path="web-pagelist/filters"></div>
                <div class="list" data-module-path="web-pagelist/list"></div>
            </div>
        </div>
    </div>
{{ -- /tpl -- }}

{{ -- tpl:web-pagelist-filters -- }}
    <form class="form-inline">
        <div class="form-group">
            <div class="dropdown"></div>
        </div>

        <div class="form-group">
            <label for="date-range">选择日期范围</label>
            <input type="text" class="form-control" id="date-range" value="{{ _this.start_date + ' 到 ' + _this.end_date }}">

        </div>

        <div class="form-group">
            <button type="button" class="btn btn-default dialog">点击弹窗</button>
        </div>
    </form>
{{ -- /tpl -- }}


{{ -- tpl:web-pagelist-list -- }}
    <div>
        <table class="table table-hover table-bordered">
            <thead>
                <tr>
                    <th>页面URL</th>
                    <th>页面名称</th>
                    <th>浏览量PV</th>
                    <th>访客数UV</th>
                    <th>IP</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <div class="widgets-pager"></div>
{{ -- /tpl -- }}


{{ -- tpl:web-pagelist-list-tbody -- }}
    <%
        var len = len = _this.list.length;
        if (len) {
            for (var i = 0; i < len; i++) {
                var item = _this.list[i];
    %>
            <tr>
                <td class="page-url"><a href="{{ item.page_url }}" target="_blank">{{ item.page_url }}</a><a class="trend" data-href="{{ window.rootBase + '/web/pagetrend' }}" data-url="{{ item.page_url }}" target="_blank"><span class="glyphicon glyphicon-random"></span></a></td>
                <td>{{ item.page_name }}</td>
                <td>{{ item.pvs }}</td>
                <td>{{ item.uvs }}</td>
                <td>{{ item.ips }}</td>
            </tr>
    <%
            }
        } else {
    %>
        <tr><td colspan="5"><center>没有数据</center></td></tr>
    <%
        }
    %>
{{ -- /tpl -- }}
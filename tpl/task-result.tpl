{{ -- tpl:task-result-main -- }}
<div class="row">
    <div class="item-title">任务结果</div>
    <div class="row item-body">
        <div class="col-md-12">
            <ul class="nav nav-tabs">
                <li role="presentation" class="active" data-idx="0" data-type="taskinfo"><a href="javascript:;">任务信息</a></li>
                <li role="presentation" data-idx="1" data-type="loginfo"><a href="javascript:;">运行日志</a></li>
                <li role="presentation" data-idx="2" data-type="result"><a href="javascript:;">执行结果</a></li>
                <li role="presentation" data-idx="3" data-type="chart"><a href="javascript:;">图表展示</a></li>
            </ul>
            <div class="nav-contents">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </div>
</div>
{{ -- /tpl -- }}

{{ -- tpl:task-result-main-result-table -- }}
<% for (var a = 0, l = _this.length; a < l; a++) {
    var data = _this[a];
%>
<div class="table-container">
    <table class="table table-bordered task-result-table">
        <thead>
            <tr>
                <%
                    var colsLen = data.keys.length;
                    for (var i = 0; i < colsLen; i++) {
                %>
                    <th><%= data.keys[i] %></th>
                <%
                    }
                %>
            </tr>
        </thead>
        <tbody>
            <%
                var len = data.data.length;
                if (len) {
                    for (var i = 0; i < len; i++) {
                        var item = data.data[i];
            %>
                        <tr>
                    <%
                        for (var j = 0; j < item.length; j++) {
                    %>
                            <td>
                                <%
                                    var val = item[j];
                                    if (typeof val === 'object') {
                                        val = JSON.stringify(val);
                                    }
                                %>
                                <%= val %>
                            </td>
                    <%
                        }
                    %>
                        </tr>
            <%
                    }
            %>
            <%
                } else {
            %>
                <tr><td rowspan="<%= colsLen %>">没有查询到数据</td></tr>
            <%
                }
            %>
        </tbody>
    </table>
</div>
<%
    }
%>
{{ -- /tpl -- }}


{{ -- tpl:task-list-sub-module-1 -- }}
<div>
    ip：<%= _this.ip.replace(/\n/g, '<br>') %>
</div>
<table class="table">
    <thead>
        <tr>
            <th class="width-126">日期</th>
            <th>浏览量</th>
            <th>消耗学分</th>
            <th>推广增量</th>
        </tr>
    </thead>
    <tbody>
        <% var tmp; %>
        <% for(var i = 0, len = _this.list.length ; i < len; i++) {
            tmp = _this.list[i]; %>
        <tr>
            <td>
                <%= tmp.date %>
            </td>
            <td><%= (tmp.natureFlow + tmp.tgFlow) %></td>
            <td><%= tmp.scoreCost %></td>
            <td class="text-highlight">
                <%= tmp.tgFlow %>
            </td>
        </tr>
        <% } %>
    </tbody>
</table>
<div data-module-path="task-list/sub-module-2"></div>
{{ -- /tpl -- }}

{{ -- tpl:task-list-sub-module-2 -- }}
<div>
    <a href="http://www.baidu.com">这个是子模块2</a>
</div>
<% include('task-list-sub2-include') %>
{{ -- /tpl -- }}

{{ -- tpl:task-list-sub2-include -- }}
<p>
    通过include传递参数<%= _this %>
</p>
{{ -- /tpl -- }}
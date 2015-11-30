<div class="Widget-header">
  <div class="Widget-title Widget-contentSpaced">
    <div class="Widget-contentSpaced">
      <h3 class="Widget-textBig"><%- title %></h3>
      <div class="Widget-tag Widget-tag--<%- operation %>">
        <span class="Widget-textSmaller Widget-textSmaller--upper"><%- operation %></span>
      </div>
    </div>
    <button class="Widget-threePoints js-collapse">
      <span class="Widget-threePointsItem"></span>
    </button>
  </div>
  <dl class="Widget-info">
    <dt class="Widget-infoItem Widget-textSmaller Widget-textSmaller--upper"><%- nulls %> null rows</dt>
  </dl>
</div>
<div class="Widget-content">
  <% if (value) { %>
    <h4 class="Widget-textBigger Widget-textBigger--maxWidth js-value" title="<%- value %>">
      <%- prefix %><%- value %><%- suffix %>
    </h4>
  <% } else { %>
    <div class="Widget-listItem--fake"></div>
  <% } %>
</div>
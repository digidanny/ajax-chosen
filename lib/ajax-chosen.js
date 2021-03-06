(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  (function($) {
    if ($ == null) {
      $ = jQuery;
    }
    return $.fn.ajaxChosen = function(settings, callback) {
      var chosenXhr, defaultOptions, options, select;
      if (settings == null) {
        settings = {};
      }
      if (callback == null) {
        callback = function() {};
      }
      defaultOptions = {
        minTermLength: 3,
        afterTypeDelay: 500,
        jsonTermKey: "term"
      };
      select = this;
      chosenXhr = null;
      options = $.extend({}, defaultOptions, settings);
      this.chosen();
      return this.next('.chzn-container').find(".search-field > input, .chzn-search > input").bind('keyup', function() {
        var field, msg, val;
        val = $(this).attr('value');
        msg = val.length < options.minTermLength ? "Keep typing..." : "Looking for '" + val + "'";
        select.next('.chzn-container').find('.no-results').text(msg);
        if (val === $(this).data('prevVal')) {
          return false;
        }
        $(this).data('prevVal', val);
        if (this.timer) {
          clearTimeout(this.timer);
        }
        if (val.length < options.minTermLength) {
          return false;
        }
        field = $(this);
        if (!(options.data != null)) {
          options.data = {};
        }
        options.data[options.jsonTermKey] = val;
        if (typeof success === "undefined" || success === null) {
          success = options.success;
        }
        options.success = function(data) {
          var chzn, items, selected_values;
          if (!(data != null) || data.query !== field.val()) {
            return;
          }
          selected_values = [];
          select.find('option').each(function() {
            if (!$(this).is(":selected")) {
              return $(this).remove();
            } else {
              return selected_values.push($(this).val() + "-" + $(this).text());
            }
          });
          items = callback(data);
          $.each(items, function(value, text) {
            if (selected_values.indexOf(value + "-" + text) === -1) {
              return $("<option />").attr('value', value).html(text).appendTo(select);
            }
          });
          select.trigger("liszt:updated");
          if (typeof success !== "undefined" && success !== null) {
            success();
          }
          field.attr('value', val);
          select = field.parentsUntil('.chzn-container').last().parent().prev();
          if (select.attr('multiple')) {
            field.css('width', 'auto');
          }
          if ($.map(items, __bind(function(v, k) {
            return k;
          }, this)).length === 0) {
            chzn = select.next('.chzn-container').find('.chzn-results').first();
            return chzn.append($('<li/>', {
              "class": 'no-results'
            }).text("No results"));
          }
        };
        return this.timer = setTimeout(function() {
          if (chosenXhr) {
            chosenXhr.abort();
          }
          return chosenXhr = $.ajax(options);
        }, options.afterTypeDelay);
      });
    };
  })($);
}).call(this);

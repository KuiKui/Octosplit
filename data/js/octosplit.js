$(document).ready(function() {
  addAllTheCake();
  watchForPageChanges();
  manageNewComment();
  manageTabs();
});

function addAllTheCake() {
  addWordWrapCheckbox();
  addSideBySideCheckbox();
  addNoWhitespaceCheckbox();
}

function addWordWrapCheckbox() {
  var $clickFn = function(event) {
    if ($(this).is(':checked')) {
       $('#files .data').addClass('word-wrap');
    } else {
       $('#files .data').removeClass('word-wrap');
    }
  };

  addOneCheckbox('wordwrap', 'octicon-gift', 'Word wrap', $clickFn, false);
}

function addSideBySideCheckbox() {
  var $clickFn = function(event) {
    if ($(this).is(':checked')) {
      enlarge();
      splitDiffs();
    } else {
      shrink();
      resetDiffs();
    }
  };
  addOneCheckbox('octosplit', 'octicon-mirror-public', 'Side by side', $clickFn, false);
}

function addNoWhitespaceCheckbox() {
  var $clickFn = function(event) {
    if ($(this).is(':checked')) {
      addNoWhitespaceParam();
    } else {
      removeNoWhitespaceParam();
    }
  };
  addOneCheckbox('no-whitespace', 'octicon-telescope', 'No whitespace', $clickFn, hasNoWhitespaceParam());
}

function addOneCheckbox($id, $labelSpanClasses, $labelInner, $clickFn, $checked) {
  var $checkedStr = $checked ? 'checked' : '';
  var $checkbox = $('<input type="checkbox" id="' + $id + '" ' + $checkedStr +' class="octosplit-checkbox" />');
  var $label    = $('<label id="' + $id + '-label" for="' + $id + '" class="octosplit-label"><span class="octicon ' + $labelSpanClasses + '"></span><strong>' + $labelInner + '</strong></label>');

  $('#toc .toc-diff-stats').append($label, $checkbox);

  $checkbox.on('click', $clickFn);
}

function watchForPageChanges() {
  var pjaxContainer = $("#js-repo-pjax-container");
  if (pjaxContainer.size() == 0) {
    return;
  }
  var currentToc = $("#toc").get(0);
  var observer = new MutationObserver(function(records) {
    var newToc = $("#toc").get(0);
    if (newToc != currentToc) {
      addAllTheCake();
      currentToc = newToc;
    }
  });
  observer.observe(pjaxContainer.get(0), {childList: true, subtree: true});
}

function manageNewComment() {
  $('#files').on('click', function(event) {
    if (!$('#octosplit').is(':checked')) {
      return;
    }

    $elmt = $(event.target);
    if (!$elmt.hasClass('add-line-comment')) {
      return;
    }

    window.setTimeout(function() {
      splitInlineComment($($elmt.parent().parent().next()));
    }, 800);
  });
}

function manageTabs() {
  $('.tabnav .tabnav-tab', $('.new-pull-request, .view-pull-request')).on('click', function(event) {
    window.setTimeout(function() {
      if (isFilesBucketTab() && $('#octosplit').is(':checked')) {
        enlarge();
      } else {
        shrink();
      }
    }, 100);
  });
}

function enlarge() {
  $('.wrapper .container').addClass('large');
}

function shrink() {
  $('.wrapper .container.large').removeClass('large');
}

function splitDiffs() {
  $('table.diff-table').each(function() {
    if (isSplittable($(this))) {
      $('tbody tr', $(this)).each(function() {
        if ($(this).hasClass('inline-comments')) {
          splitInlineComment($(this));
        } else if ($(this).hasClass('js-expandable-line')) {
          splitExpandableLine($(this));
        } else {
          splitDiffLine($(this))
        }
      });
    }
  })
}

function resetDiffs() {
  $('table.diff-table').each(function() {
    if (isResettable($(this))) {
      $('tbody tr', $(this)).each(function() {
        if ($(this).hasClass('inline-comments')) {
          resetInlineComment($(this));
        } else if ($(this).hasClass('js-expandable-line')) {
          resetExpandableLine($(this));
        } else {
          resetDiffLine($(this))
        }
      });
    }
  })
}

function splitDiffLine($line) {
  var $children = $line.children();

  var $oldNumber = $($children[0]);
  var $newNumber = $($children[1]);
  var $LOC = $($children[2]);

  var $oldLOC = $('<td class="blob-code blob-code-context"></td>');
  var $newLOC = $('<td class="blob-code blob-code-context"></td>');

  if ($oldNumber.hasClass('blob-num-deletion')) {
    $oldLOC.html($LOC.html());
    $oldLOC.attr('class', $LOC.attr('class'));
    $newLOC.addClass('nd');
    $newNumber.addClass('nd');
    $newLOC.html('');
  } else if ($newNumber.hasClass('blob-num-addition')) {
    $oldLOC.html('');
    $newLOC.attr('class', $LOC.attr('class'));
    $newLOC.html($LOC.html());
    $oldLOC.addClass('nd');
    $oldNumber.addClass('nd');
  } else {
    $oldLOC.html($LOC.html());
    $oldLOC.attr('class', $LOC.attr('class'));
    $newLOC.html($LOC.html());
    $newLOC.attr('class', $LOC.attr('class'));
  }

  $newNumber.addClass('new-number');

  if($oldLOC.children().first().hasClass('add-bubble')) {
    $oldLOC.children().first().remove();
  }

  $oldLOC.insertAfter($oldNumber);
  $newLOC.insertAfter($newNumber);
  $LOC.remove();
}

function resetDiffLine($line) {
  var $children = $line.children();

  var $oldNumber = $($children[0]);
  var $oldLOC    = $($children[1]);
  var $newNumber = $($children[2]);
  var $newLOC    = $($children[3]);

  if ($oldNumber.hasClass('blob-num-deletion')) {
    $newLOC.html($oldLOC.html());
    $newLOC.attr('class', $oldLOC.attr('class'));
  }

  $oldLOC.remove();

  $oldNumber.removeClass('nd');
  $newNumber.removeClass('nd');
  $newLOC.removeClass('nd');
}

function splitInlineComment($line) {
  $line.children().first().attr('colspan', 1);
  $line.children().last().attr('colspan', 3);
}

function resetInlineComment($line) {
  $line.children().first().attr('colspan', 2);
  $line.children().last().attr('colspan', 1);
}

function splitExpandableLine($line) {
  $line.children('.expandable-line-num').attr('colspan', 1);
  $line.children('.blob-code').attr('colspan', 3);
  $line.children('.expandable-line-code').attr('colspan', 3);
}

function resetExpandableLine($line) {
  $line.children('.expandable-line-num').attr('colspan', 2);
  $line.children('.blob-code').attr('colspan', 1);
  $line.children('.expandable-line-code').attr('colspan', 1);
}

function isFilesBucketTab() {
  return ($('.tabnav-tab.selected').attr('href') == '#files_bucket') || ($('.tabnav-tab.selected').data().containerId == 'files_bucket');
}

function isSplittable($table) {
  return ($('tr > td.blob-num-deletion', $table).length || $('tr > td.blob-num-addition', $table).length);
}

function isResettable($table) {
  return ($('.new-number', $table).length > 0)
}


function hasNoWhitespaceParam() {
  return getURLParameter('w') !== null; // Right now w can have any value as long is present gh will remove whitespace
}

function removeNoWhitespaceParam() {
  document.location = removeParameter(document.location.href, 'w');
}

function addNoWhitespaceParam() {
  if (!hasNoWhitespaceParam()) {
    insertParameter('w', '1');
  }
}

// Some Utility methods
// Barely based on http://stackoverflow.com/questions/486896/adding-a-parameter-to-the-url-with-javascript
function insertParameter(key, value) {
  key = encodeURIComponent(key); value = encodeURIComponent(value);

  var s = removeParameter(document.location.search, key); // We remove it in case is there already
  var kvp = key+"="+value;

  s += (s.indexOf('?') !== -1 ? '&' : '?') + kvp;

  document.location.search = s;
}
// Stolen from http://stackoverflow.com/questions/1634748/how-can-i-delete-a-query-string-parameter-in-javascript
function removeParameter(url, parameter) {
  var urlparts= url.split('?');

  if (urlparts.length>=2) {
    var urlBase=urlparts.shift(); //get first part, and remove from array
    var queryString=urlparts.join("?"); //join it back up

    var prefix = encodeURIComponent(parameter)+'=';
    var pars = queryString.split(/[&;]/g);
    if (pars.length > 0) {
      for (var i= pars.length; i-->0;)               //reverse iteration as may be destructive
        if (pars[i].lastIndexOf(prefix, 0)!==-1)   //idiom for string.startsWith
          pars.splice(i, 1);
      url = urlBase+'?'+pars.join('&');
    }
  }

  // remove trailing ?
  if(url.substr(-1) == '?') {
    url = url.substr(0, url.length - 1);
  }

  return url;
}
// From http://stackoverflow.com/questions/1403888/get-url-parameter-with-jquery
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(document.location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

$(document).ready(function() {
  addWordWrapChekbox();
  addSideBySideCheckbox();
  manageNewComment();
  manageTabs();
});

function addWordWrapChekbox() {
  var $clickFn = function(event) {
    if ($(this).is(':checked')) {
       $('#files_bucket').addClass('word-wrap');
    } else {
       $('#files_bucket').removeClass('word-wrap');
    }
  };

  addOneCheckbox('wordwrap', 'mini-icon-reorder', 'Use <strong>word wrapped</strong> view', $clickFn);
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
  addOneCheckbox('octosplit', 'mini-icon-public-mirror', 'Use <strong>side by side</strong> view', $clickFn);
}

function addOneCheckbox($id, $labelSpanClass, $labelInner, $clickFn) {
  var $checkbox = $('<input type="checkbox" id="' + $id + '" />');
  var $label    = $('<label id="' + $id + '-label" for="' + $id + '"><span class="mini-icon ' + $labelSpanClass + '"></span>' + $labelInner + '</label>');

  $('#toc .explain').append($label, $checkbox);

  $checkbox.on('click', $clickFn);
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
  $('#wrapper .container').addClass('large');
}

function shrink() {
  $('#wrapper .container.large').removeClass('large');
}

function splitDiffs() {
  $('table.file-diff').each(function() {
    if (isSplittable($(this))) {
      $('tbody tr', $(this)).each(function() {
        if ($(this).hasClass('inline-comments')) {
          splitInlineComment($(this));
        } else {
          splitDiffLine($(this))
        }
      });
    }
  })
}

function resetDiffs() {
  $('table.file-diff').each(function() {
    if (isResettable($(this))) {
      $('tbody tr', $(this)).each(function() {
        if ($(this).hasClass('inline-comments')) {
          resetInlineComment($(this));
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

  var $oldLOC = $('<td class="diff-line-code"></td>');
  var $newLOC = $('<td class="diff-line-code"></td>');

  if ($line.hasClass('gd')) {
    $oldLOC.html($LOC.html());
    $newLOC.addClass('nd');
    $newNumber.addClass('nd');
    $newLOC.html('');
  } else if ($line.hasClass('gi')) {
    $oldLOC.html('');
    $newLOC.html($LOC.html());
    $oldLOC.addClass('nd');
    $oldNumber.addClass('nd');
  } else {
    if ($line.hasClass('gc')) {
      $oldLOC.addClass('gc');
      $newLOC.addClass('gc');
    }
    $oldLOC.html($LOC.html());
    $newLOC.html($LOC.html());
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

  if($line.hasClass('gd')) {
    $newLOC.html($oldLOC.html());
  }

  $oldLOC.remove();

  $oldNumber.removeClass('nd');
  $oldNumber.css('border-right', 'none');
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

function isFilesBucketTab() {
  return ($('.tabnav-tab.selected').attr('href') == '#files_bucket') || ($('.tabnav-tab.selected').data().containerId == 'files_bucket');
}

function isSplittable($table) {
  return ($('tr.gd', $table).length && $('tr.gi', $table).length);
}

function isResettable($table) {
  return ($('.new-number', $table).length > 0)
}
$(document).ready(function() {
  addCheckbox();
  manageNewComment();
  manageTabs();
});

function addCheckbox() {
  var $checkbox = $('<input type="checkbox" id="octosplit" />');
  var $label    = $('<label id="octosplit-label" for="octosplit"><span class="mini-icon mini-icon-public-mirror"></span>Use <strong>side by side</strong> view</label>');

  $('#toc .explain').append($label, $checkbox);

  $checkbox.on('click', function(event) {
    if ($(this).is(':checked')) {
      enlarge();
      splitDiffs();
    } else {
      shrink();
      resetDiffs();
    }
  });
}

function manageNewComment() {
  $('#files').on('click', function(event) {
    if (!$('#octosplit').is(':checked')) {
      return;
    }

    $elmt = $(event.target);
    if (!$elmt.hasClass('add-bubble')) {
      return;
    }

    window.setTimeout(function() {
      splitInlineComment($($elmt.parent().parent().next()));
    }, 800);
  });
}

function manageTabs() {
  $('.tabnav .tabnav-tab', $('.new-pull-request, .view-pull-request')).on('click', function() {
    if (isFilesBucketTab() && $('#octosplit').is(':checked')) {
      enlarge();
    } else {
      shrink();
    }
  });
}

function enlarge() {
  $('#wrapper .container').addClass('large');
}

function shrink() {
  $('#wrapper .container.large').removeClass('large');
}

function splitDiffs() {
  $('table.diff-table tbody tr').each(function(index) {
    if ($(this).hasClass('inline-comments')) {
      splitInlineComment($(this));
    } else {
      splitDiffLine($(this))
    }
  });
}

function resetDiffs() {
  $('table.diff-table tbody tr').each(function(index) {
    if ($(this).hasClass('inline-comments')) {
      resetInlineComment($(this));
    } else {
      resetDiffLine($(this))
    }
  });
}

function splitDiffLine($line) {
  var $children = $line.children();

  var $oldNumber = $($children[0]);
  var $newNumber = $($children[1]);
  var $LOC = $($children[2]);

  var $oldLOC = $('<td class="diff-line"></td>');
  var $newLOC = $('<td class="diff-line"></td>');

  if ($LOC.hasClass('gd')) {
    $oldLOC.html($LOC.html());
    $oldLOC.addClass('gd');
    $newLOC.html('');
  } else if ($LOC.hasClass('gi')) {
    $oldLOC.html('');
    $newLOC.html($LOC.html());
    $newLOC.addClass('gi');
  } else {
    if ($LOC.hasClass('gc')) {
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

  if($oldLOC.hasClass('gd')) {
    $newLOC.html($oldLOC.html());
    $newLOC.addClass('gd');
  }

  $oldLOC.remove();
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
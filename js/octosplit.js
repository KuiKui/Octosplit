$(document).ready(function() {

  $('table.diff-table tbody tr').each(function(index) {
    if($(this).hasClass('inline-comments')) {
      return;
    }
    adjustDiffLines($(this))
  });

  $('.add-bubble').on('click', function(event) {
    var $this = $(this);
    window.setTimeout(function() {
      adjustInlineComments($($this.parent().parent().next()));
      adjustFooter();
    }, 1500);
  });

  $('.inline-comments').each(function() {
    adjustInlineComments($(this));
  });

  if (isFilesBucketTab()) {
    adjustFooter();
  }

  $('.tabnav .tabnav-tab', $('.new-pull-request, .view-pull-request')).bind('click', function() {
    window.setTimeout(function() {
        if (isFilesBucketTab()) {
          adjustFooter();
        }
        else {
          resetFooter();
        }
    }, 500);
  });
});

function adjustDiffLines($line) {
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

  $oldLOC.insertAfter($oldNumber);
  $newLOC.insertAfter($newNumber);
  $LOC.remove();
}

function adjustInlineComments($line) {
  $line.children().first().attr('colspan', 1);
  $line.children().last().attr('colspan', 3);
}

function adjustFooter() {
  $('#footer-push').css({marginTop: $('#files_bucket').height()});
}

function resetFooter() {
  $('#footer-push').css({marginTop: 0});
}

function isFilesBucketTab() {
  return ($('.tabnav-tab.selected').attr('href') == '#files_bucket') || ($('.tabnav-tab.selected').data().containerId == 'files_bucket');
}
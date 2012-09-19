$(document).ready(function() {
  var $fileBucket   = $('#files_bucket');
  var $footerPush   = $('#footer-push');

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
    }, 1500);
  });

  $('.inline-comments').each(function() {
    adjustInlineComments($(this));
  });

  if ($('.tabnav-tab.selected').data().containerId == 'files_bucket') {
    $footerPush.css({marginTop: $fileBucket.height()});
  }

  // adjust footer according to the active tab on click
  $('.view-pull-request .tabnav .tabnav-tab').bind('click', function() {
    if ($(this).data().containerId == 'files_bucket') {
      $footerPush.css({marginTop: $fileBucket.height()});
    }
    else {
      $footerPush.css({marginTop: 0});
    }
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
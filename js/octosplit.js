$(document).ready(function() {

    var alreadySplit = false;
    var $fileBucket   = $('#files_bucket');
    var $footerPush   = $('#footer-push');

    // adjust diff lines
    $('table.diff-table tbody tr', $fileBucket).each(function() {
        if($(this).hasClass('inline-comments')) {
            return;
        }

        adjustDiffLines($(this))
    });

    // adjust inline comments on click after 1.5s
    $('.add-bubble', $fileBucket).on('click', function() {
        var $this = $(this);
        window.setTimeout(function() {
            adjustInlineComments($($this.parent().parent().next()));
        }, 1500);
    });

    // adjust inline comments
    $('.inline-comments', $fileBucket).each(function() {
        adjustInlineComments($(this));
    });

    // adjust github footer
    if ($('.tabnav-tab.selected').data().containerId == 'files_bucket') {
        $footerPush.css({marginTop: $fileBucket.height()});
    }

    // apply css for diff split
    $fileBucket.css({position: 'absolute', width: '96%', left: '2%'});
    $('.diff-line', $fileBucket).css({width: 'auto'});

    // adjust footer according to the active tab on click
    $('.view-pull-request .tabnav .tabnav-tab').bind('click', function() {
        var container = $(this).data();

        if (container.containerId == 'files_bucket') {
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

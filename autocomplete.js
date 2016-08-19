(function($) {
   $.autocomplete = function($element, options) {
      var defaultOptions = {
         autocompleteList: [],
         label: 'Suggestions',
         maxAutoCompleteSuggestions: 10
      };

      var searchedTerm = undefined;
      var preventClose = false;
      var settings = $.extend({}, defaultOptions, options);
      var $autoCompleteList = undefined;
      var $this = this;

      $this.init = function() {
         createAutoCompleteList();
      }

      function createAutoCompleteList() {
         if ($autoCompleteList != undefined && $autoCompleteList.length > 0) {
            return;
         }

         // wrap the input in auto complete stuff and hide the auto complete stuff
         $element.wrap('<div class="ac-Wrapper"></div>');
         $autoCompleteList = $('<div class="ac-ListContainer"><ul class="ac-List"></ul></div>');
         $autoCompleteList.insertAfter($element);
         $autoCompleteList.hide();

         if (settings.label.length > 0) {
            $autoCompleteList.prepend('<div class="ac-List_Label">' + settings.label + '</div>');
         }

         // assign events to the element
         $element.off('keyup', autoCompleteCheck).on('keyup', autoCompleteCheck);
         $element.off('keydown', keyboardControl).on('keydown', keyboardControl);
         $element.off('focus', autoCompleteCheck).on('focus', autoCompleteCheck);
         $element.off('blur', hideAutoComplete).on('blur', hideAutoComplete);
      }

      function clearAutoCompleteList() {
         $autoCompleteList.find('.ac-List').html('');
      }

      function isVisible() {
         return $autoCompleteList.is(':visible');
      }

      function toggleAutoComplete() {
         if ($autoCompleteList.is(':visible') == true && preventClose != true) {
            $autoCompleteList.hide();
         } else {
            $autoCompleteList.show();
         }

         preventClose = false;
      }

      function hideAutoComplete() {
         $autoCompleteList.hide();
      }

      function addAutoCompleteItemsToList(items) {
         // check the auto complete list is there (it should be unless init wasn't called)
         if ($autoCompleteList.length == 0) {
            return;
         }

         // convert the items into an array
         if (typeof items == 'string') {
            items = [items];
         }

         // clear the list
         clearAutoCompleteList();

         // find the actual list
         var $list = $autoCompleteList.find('.ac-List');

         // loop through the items we want to add and put them in the DOM
         $.each(items, function(index, item) {
            $list.append('<li class="ac-List_Item" data-autocomplete-text="' + item + '">' + searchedTerm + '<span class="ac-List_ItemSuggestion">' + item.replace(searchedTerm, '') + '</span></li>');
         });

         // when leaving this with the mouse, remove the highlight
         $autoCompleteList.find('.ac-List_Item').off('mouseleave').on('mouseleave', function(e) {
            // remove the highlight
            $(this).removeClass('ac-List_ItemHighlight');
         });

         // go through each item and do some stuff when we mouse over it
         $autoCompleteList.find('.ac-List_Item').off('mouseenter').on('mouseenter', function(e) {
            // remove the old highlight
            $autoCompleteList.find('.ac-List_ItemHighlight').removeClass('ac-List_ItemHighlight');

            // add the highlight
            $(this).addClass('ac-List_ItemHighlight');
         })
      }

      function getRelevantAutoCompleteItems() {
         var relevantItems = [];
         var options = settings.autocompleteList;
         var option = undefined;

         for (var a in options) {
            if (options.hasOwnProperty(a) == false) {
               continue;
            }

            option = options[a];

            if (option.indexOf(searchedTerm) == 0 && option != searchedTerm) {
               relevantItems.push(option);

               if (relevantItems.length == settings.maxAutoCompleteSuggestions) {
                  break;
               }
            }
         }

         return relevantItems;
      }

      function moveItemHighlight($currentlyHighlighted, $target) {
         // move the highlight
         $currentlyHighlighted.removeClass('ac-List_ItemHighlight');
         $target.addClass('ac-List_ItemHighlight');

         // set the value
         $element.val($target.attr('data-autocomplete-text'));
      }

      function keyboardControl(e) {
         // don't do this if it's hidden
         if (isVisible() == false) {
            return;
         }

         // take note of what is highlighted
         var $highlightedItem = $autoCompleteList.find('.ac-List_ItemHighlight');

         // figure out what keycode we pressed
         switch (e.keyCode) {           
            // up key
            case 38: {
               var $nextItem = $highlightedItem.prev();
               if ($nextItem.length == 0) {
                  // if we can't go up anymore then return to the input
                  $highlightedItem.removeClass('ac-List_ItemHighlight');

                  // and put the input back to the value we had before
                  $element.val(searchedTerm);
               } else {
                  // move the higlight
                  moveItemHighlight($highlightedItem, $nextItem);
               }
            }
            break;

            // down key
            case 40: {
               var $nextItem = $highlightedItem.next();
               if ($nextItem.length == 0) {
                  $nextItem = $autoCompleteList.find('.ac-List_Item:first')
               }

               // move the higlight
               moveItemHighlight($highlightedItem, $nextItem);
            }
            break;

            // every other key
            default:
               return;
         }
      }

      function autoCompleteCheck(e) {
         // don't do this for up/down keys
         if (e.keyCode == 38 || e.keyCode == 40) {
            return;
         }

         // enter hit
         if (e.keyCode == 13) {
            hideAutoComplete();
         }

         // make sure there are items in the list to auto complete
         if (settings.hasOwnProperty('autocompleteList') == false || settings.autocompleteList == undefined || settings.autocompleteList.length == 0) {
            return;
         }

         // store what term we searched for
         searchedTerm = $(this).val();

         // clear the list and hide it if there's nothing in the input
         if (searchedTerm.length == 0) {
            clearAutoCompleteList();
            hideAutoComplete();
            return;
         }

         // get relevant items
         var items = getRelevantAutoCompleteItems();
         if (items.length == 0) {
            hideAutoComplete();
            return;
         }

         // add them to the DOM
         addAutoCompleteItemsToList(items);

         // show the list (if it's not there)
         preventClose = true;
         toggleAutoComplete();
      }

      // initialize
      $this.init();
   }

   $.fn.autocomplete = function(options) {
      // accept options to be passed to the object
      var element = this;
      return this.each(function() {
         //ensure that the element hasn't already got the plugin
         if ($(this).data('autocomplete') == undefined) {
            // For each element, create a new plugin object
            var plugin = new $.autocomplete(element, options);
            $(this).data('autocomplete', plugin);
         }
      });
   }
} (jQuery));
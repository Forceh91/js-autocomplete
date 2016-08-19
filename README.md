# js-autocomplete
js-autocomplete is a small jQuery widget that allows you to add simple autocomplete options to your inputs.

### Features
js-autocomplete supports keyboard navigation, users are able to use the up and down keys to move between suggested auto complete options. Pressing the up key when on the first option will return the user to the input and reset the value of the input.

#### Labels
You can add a custom title to the js-autocomplete dropdown by simply specifying "label" as a property alongside your "autocompleteList" when initializing js-autocomplete.

	<script>
		$('#yourselectorhere').autocomplete({
			autcompleteList: [],
			label: 'Here are some suggestions...'
		});
	</script>

#### Result Limiting
By default the widget will return no more than 10 suggestions, however this can be tweaked by specifying "maxAutoCompleteSuggestions" when initializing js-autocomplete.

	<script>
		$('#yourselectorhere').autocomplete({
			autcompleteList: [],
			maxAutoCompleteSuggestions: 5
		});
	</script>

## Dependencies
- jQuery 3.x+ (https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js)

## Setup
See the examples folder for an example on how to add the js-autocomplete widget to your website.

All you need to do is select the input that you want to have autocomplete on and then specify the items that are available for autocomplete.

	<input id="autoCompleteInput" type="text" name="test"/>

	<script>
		$('#autoCompleteInput').autocomplete({
			autocompleteList: [
				'apple',
				'alphabet',
				'alpha',
				'all',
				'alpaca',
				'banana',
				'bandanna',
				'ban',
				'band',
				'hale',
				'halestorm'
			]
		});
	</script>

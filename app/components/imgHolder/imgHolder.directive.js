// John Papa [Style Y070] One directive per file
(function(){
	'use strict';

	angular
		.module('components')
		// John Papa [Style Y073] Unique directive prefix mdb (movieDb)
		.directive('mdbImageHolder', imageHolder);

	imageHolder.$inject = ['Holder'];

	function imageHolder(Holder) {
		var directive = {
			link: link,
			// John Papa [Style Y074] Restrict to elements and attributes
			restrict: 'EA'
		};

		function link(scope, element, attrs) {
			attrs.$set('data-src', attrs.mdbImageHolder);
			
			Holder.run({ 
				images	: element[0],
				theme		: 'vine'
			});
		}

		return directive;
	}

})();

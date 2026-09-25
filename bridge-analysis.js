// Reference network lenses and derived scan metrics; independent of registration data.
(function () {
      var board = document.querySelector('.network-board');
      var lensButtons = document.querySelectorAll('[data-network-lens]');
      if (board && lensButtons.length) {
        Array.prototype.forEach.call(lensButtons, function (lensButton) {
          lensButton.addEventListener('click', function () {
            var lens = lensButton.getAttribute('data-network-lens');
            board.setAttribute('data-lens', lens);
            Array.prototype.forEach.call(lensButtons, function (item) {
              var selected = item === lensButton;
              item.classList.toggle('active', selected);
              item.setAttribute('aria-pressed', selected ? 'true' : 'false');
            });
          });
        });
      }

      var institutionNodes = document.querySelectorAll('#observed-network-list [data-pathways]');
      if (institutionNodes.length) {
        var mechanisms = {};
        var edgeCount = 0;
        Array.prototype.forEach.call(institutionNodes, function (node) {
          var pathways = node.getAttribute('data-pathways').split(',');
          edgeCount += pathways.length;
          pathways.forEach(function (pathway) { mechanisms[pathway] = true; });
        });
        var mechanismCount = Object.keys(mechanisms).length;
        var nodeCount = institutionNodes.length + mechanismCount;
        var density = Math.round((edgeCount / (institutionNodes.length * mechanismCount)) * 100);
        document.getElementById('network-node-count').textContent = String(nodeCount);
        document.getElementById('network-edge-count').textContent = String(edgeCount);
        document.getElementById('network-density').textContent = density + '%';
      }

})();

(function() {
  function radialTree() {
    let r = 1;

    function process(childnode, fromAngle, angleQuota) {
      const _a = fromAngle + (angleQuota / 2);
      const _r = Array.isArray(r) && r.length > 0
        ? r[(childnode.depth - 1) % r.length]
        : r * childnode.depth;
      childnode.x = _r * Math.cos(_a);
      childnode.y = _r * Math.sin(_a);

      if (Array.isArray(childnode.children) && childnode.children.length > 0) {
        let _fromAngle = fromAngle;
        for (let i = 0; i < childnode.children.length; i += 1) {
          const _angleQuota = angleQuota * (childnode.children[i].value) / (childnode.value - 1);
          process(childnode.children[i], _fromAngle, _angleQuota);
          _fromAngle += _angleQuota;
        }
      }
    }

    function f(root) {
      root.x = 0;
      root.y = 0;
      if (Array.isArray(root.children) && root.children.length > 0) {
        let fromAngle = 0;
        for (let i = 0; i < root.children.length; i += 1) {
          const angleQuota = (2 * Math.PI) * (root.children[i].value) / (root.value - 1);
          process(root.children[i], fromAngle, angleQuota);
          fromAngle += angleQuota;
        }
      }
      return root;
    }

    f.radius = function(rlist) {
      if (Array.isArray(rlist) && rlist.length > 0) {
        r = rlist;
      } else {
        r = parseFloat(rlist) || 1;
      }
      return f;
    }

    return f;
  }

  if (window.d3) {
    d3.radialTree = radialTree;
  } else {
    window.d3_RadialTree = radialTree;
  }
})();

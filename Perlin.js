//Perlin
class Grad {
    constructor(x, y, z) {
        this.x = x; this.y = y; this.z = z;
    }
    dot2(x, y) {
        return this.x * x + this.y * y;
    }
}
  
    var grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
                 new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
                 new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];
    var p = gArr(256).map(i => Math.trunc(Math.random() * 255));
    var perm = new Array(512);
    var gradP = new Array(512);
    function seed(seed) {
      seed *= seed > 0 && seed < 1 ? 65536 : 1;
      seed = Math.floor(seed);
      seed = seed < 256 ? seed |= seed << 8 : seed;
      gArr(256).forEach(i => {
        var v = i & 1 ? p[i] ^ (seed & 255) : p[i] ^ ((seed>>8) & 255);
        perm[i] = perm[i + 256] = v;
        gradP[i] = gradP[i + 256] = grad3[v % 12];
      });
    };
    function fade(t) {
      return t*t*t*(t*(t*6-15)+10);
    }
    function lerp(a, b, t) {
      return (1-t)*a + t*b;
    }
    function perlin2(x, y) {
      var X = Math.floor(x), Y = Math.floor(y);
      x = x - X; y = y - Y;
      X = X & 255; Y = Y & 255;
      var u = fade(x);
      var n00 = gradP[X+perm[Y]].dot2(x, y);
      var n01 = gradP[X+perm[Y+1]].dot2(x, y-1);
      var n10 = gradP[X+1+perm[Y]].dot2(x-1, y);
      var n11 = gradP[X+1+perm[Y+1]].dot2(x-1, y-1);
      return lerp(
        lerp(n00, n10, u),
        lerp(n01, n11, u),
         fade(y));
    };
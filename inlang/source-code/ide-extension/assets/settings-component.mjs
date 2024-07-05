var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i5 = decorators.length - 1, decorator; i5 >= 0; i5--)
    if (decorator = decorators[i5])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};

// ../../../node_modules/.pnpm/chroma-js@2.4.2/node_modules/chroma-js/chroma.js
var require_chroma = __commonJS({
  "../../../node_modules/.pnpm/chroma-js@2.4.2/node_modules/chroma-js/chroma.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.chroma = factory());
    })(exports, function() {
      "use strict";
      var limit$2 = function(x2, min3, max3) {
        if (min3 === void 0)
          min3 = 0;
        if (max3 === void 0)
          max3 = 1;
        return x2 < min3 ? min3 : x2 > max3 ? max3 : x2;
      };
      var limit$1 = limit$2;
      var clip_rgb$3 = function(rgb2) {
        rgb2._clipped = false;
        rgb2._unclipped = rgb2.slice(0);
        for (var i6 = 0; i6 <= 3; i6++) {
          if (i6 < 3) {
            if (rgb2[i6] < 0 || rgb2[i6] > 255) {
              rgb2._clipped = true;
            }
            rgb2[i6] = limit$1(rgb2[i6], 0, 255);
          } else if (i6 === 3) {
            rgb2[i6] = limit$1(rgb2[i6], 0, 1);
          }
        }
        return rgb2;
      };
      var classToType = {};
      for (var i$1 = 0, list$1 = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Undefined", "Null"]; i$1 < list$1.length; i$1 += 1) {
        var name = list$1[i$1];
        classToType["[object " + name + "]"] = name.toLowerCase();
      }
      var type$p = function(obj) {
        return classToType[Object.prototype.toString.call(obj)] || "object";
      };
      var type$o = type$p;
      var unpack$B = function(args, keyOrder) {
        if (keyOrder === void 0)
          keyOrder = null;
        if (args.length >= 3) {
          return Array.prototype.slice.call(args);
        }
        if (type$o(args[0]) == "object" && keyOrder) {
          return keyOrder.split("").filter(function(k2) {
            return args[0][k2] !== void 0;
          }).map(function(k2) {
            return args[0][k2];
          });
        }
        return args[0];
      };
      var type$n = type$p;
      var last$4 = function(args) {
        if (args.length < 2) {
          return null;
        }
        var l5 = args.length - 1;
        if (type$n(args[l5]) == "string") {
          return args[l5].toLowerCase();
        }
        return null;
      };
      var PI$2 = Math.PI;
      var utils = {
        clip_rgb: clip_rgb$3,
        limit: limit$2,
        type: type$p,
        unpack: unpack$B,
        last: last$4,
        PI: PI$2,
        TWOPI: PI$2 * 2,
        PITHIRD: PI$2 / 3,
        DEG2RAD: PI$2 / 180,
        RAD2DEG: 180 / PI$2
      };
      var input$h = {
        format: {},
        autodetect: []
      };
      var last$3 = utils.last;
      var clip_rgb$2 = utils.clip_rgb;
      var type$m = utils.type;
      var _input = input$h;
      var Color$D = function Color2() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var me = this;
        if (type$m(args[0]) === "object" && args[0].constructor && args[0].constructor === this.constructor) {
          return args[0];
        }
        var mode = last$3(args);
        var autodetect = false;
        if (!mode) {
          autodetect = true;
          if (!_input.sorted) {
            _input.autodetect = _input.autodetect.sort(function(a4, b3) {
              return b3.p - a4.p;
            });
            _input.sorted = true;
          }
          for (var i6 = 0, list2 = _input.autodetect; i6 < list2.length; i6 += 1) {
            var chk = list2[i6];
            mode = chk.test.apply(chk, args);
            if (mode) {
              break;
            }
          }
        }
        if (_input.format[mode]) {
          var rgb2 = _input.format[mode].apply(null, autodetect ? args : args.slice(0, -1));
          me._rgb = clip_rgb$2(rgb2);
        } else {
          throw new Error("unknown format: " + args);
        }
        if (me._rgb.length === 3) {
          me._rgb.push(1);
        }
      };
      Color$D.prototype.toString = function toString() {
        if (type$m(this.hex) == "function") {
          return this.hex();
        }
        return "[" + this._rgb.join(",") + "]";
      };
      var Color_1 = Color$D;
      var chroma$k = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(chroma$k.Color, [null].concat(args)))();
      };
      chroma$k.Color = Color_1;
      chroma$k.version = "2.4.2";
      var chroma_1 = chroma$k;
      var unpack$A = utils.unpack;
      var max$2 = Math.max;
      var rgb2cmyk$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$A(args, "rgb");
        var r8 = ref[0];
        var g2 = ref[1];
        var b3 = ref[2];
        r8 = r8 / 255;
        g2 = g2 / 255;
        b3 = b3 / 255;
        var k2 = 1 - max$2(r8, max$2(g2, b3));
        var f4 = k2 < 1 ? 1 / (1 - k2) : 0;
        var c4 = (1 - r8 - k2) * f4;
        var m3 = (1 - g2 - k2) * f4;
        var y3 = (1 - b3 - k2) * f4;
        return [c4, m3, y3, k2];
      };
      var rgb2cmyk_1 = rgb2cmyk$1;
      var unpack$z = utils.unpack;
      var cmyk2rgb = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$z(args, "cmyk");
        var c4 = args[0];
        var m3 = args[1];
        var y3 = args[2];
        var k2 = args[3];
        var alpha = args.length > 4 ? args[4] : 1;
        if (k2 === 1) {
          return [0, 0, 0, alpha];
        }
        return [
          c4 >= 1 ? 0 : 255 * (1 - c4) * (1 - k2),
          // r
          m3 >= 1 ? 0 : 255 * (1 - m3) * (1 - k2),
          // g
          y3 >= 1 ? 0 : 255 * (1 - y3) * (1 - k2),
          // b
          alpha
        ];
      };
      var cmyk2rgb_1 = cmyk2rgb;
      var chroma$j = chroma_1;
      var Color$C = Color_1;
      var input$g = input$h;
      var unpack$y = utils.unpack;
      var type$l = utils.type;
      var rgb2cmyk = rgb2cmyk_1;
      Color$C.prototype.cmyk = function() {
        return rgb2cmyk(this._rgb);
      };
      chroma$j.cmyk = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$C, [null].concat(args, ["cmyk"])))();
      };
      input$g.format.cmyk = cmyk2rgb_1;
      input$g.autodetect.push({
        p: 2,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack$y(args, "cmyk");
          if (type$l(args) === "array" && args.length === 4) {
            return "cmyk";
          }
        }
      });
      var unpack$x = utils.unpack;
      var last$2 = utils.last;
      var rnd = function(a4) {
        return Math.round(a4 * 100) / 100;
      };
      var hsl2css$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var hsla = unpack$x(args, "hsla");
        var mode = last$2(args) || "lsa";
        hsla[0] = rnd(hsla[0] || 0);
        hsla[1] = rnd(hsla[1] * 100) + "%";
        hsla[2] = rnd(hsla[2] * 100) + "%";
        if (mode === "hsla" || hsla.length > 3 && hsla[3] < 1) {
          hsla[3] = hsla.length > 3 ? hsla[3] : 1;
          mode = "hsla";
        } else {
          hsla.length = 3;
        }
        return mode + "(" + hsla.join(",") + ")";
      };
      var hsl2css_1 = hsl2css$1;
      var unpack$w = utils.unpack;
      var rgb2hsl$3 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$w(args, "rgba");
        var r8 = args[0];
        var g2 = args[1];
        var b3 = args[2];
        r8 /= 255;
        g2 /= 255;
        b3 /= 255;
        var min3 = Math.min(r8, g2, b3);
        var max3 = Math.max(r8, g2, b3);
        var l5 = (max3 + min3) / 2;
        var s5, h3;
        if (max3 === min3) {
          s5 = 0;
          h3 = Number.NaN;
        } else {
          s5 = l5 < 0.5 ? (max3 - min3) / (max3 + min3) : (max3 - min3) / (2 - max3 - min3);
        }
        if (r8 == max3) {
          h3 = (g2 - b3) / (max3 - min3);
        } else if (g2 == max3) {
          h3 = 2 + (b3 - r8) / (max3 - min3);
        } else if (b3 == max3) {
          h3 = 4 + (r8 - g2) / (max3 - min3);
        }
        h3 *= 60;
        if (h3 < 0) {
          h3 += 360;
        }
        if (args.length > 3 && args[3] !== void 0) {
          return [h3, s5, l5, args[3]];
        }
        return [h3, s5, l5];
      };
      var rgb2hsl_1 = rgb2hsl$3;
      var unpack$v = utils.unpack;
      var last$1 = utils.last;
      var hsl2css = hsl2css_1;
      var rgb2hsl$2 = rgb2hsl_1;
      var round$6 = Math.round;
      var rgb2css$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var rgba = unpack$v(args, "rgba");
        var mode = last$1(args) || "rgb";
        if (mode.substr(0, 3) == "hsl") {
          return hsl2css(rgb2hsl$2(rgba), mode);
        }
        rgba[0] = round$6(rgba[0]);
        rgba[1] = round$6(rgba[1]);
        rgba[2] = round$6(rgba[2]);
        if (mode === "rgba" || rgba.length > 3 && rgba[3] < 1) {
          rgba[3] = rgba.length > 3 ? rgba[3] : 1;
          mode = "rgba";
        }
        return mode + "(" + rgba.slice(0, mode === "rgb" ? 3 : 4).join(",") + ")";
      };
      var rgb2css_1 = rgb2css$1;
      var unpack$u = utils.unpack;
      var round$5 = Math.round;
      var hsl2rgb$1 = function() {
        var assign;
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$u(args, "hsl");
        var h3 = args[0];
        var s5 = args[1];
        var l5 = args[2];
        var r8, g2, b3;
        if (s5 === 0) {
          r8 = g2 = b3 = l5 * 255;
        } else {
          var t32 = [0, 0, 0];
          var c4 = [0, 0, 0];
          var t22 = l5 < 0.5 ? l5 * (1 + s5) : l5 + s5 - l5 * s5;
          var t1 = 2 * l5 - t22;
          var h_ = h3 / 360;
          t32[0] = h_ + 1 / 3;
          t32[1] = h_;
          t32[2] = h_ - 1 / 3;
          for (var i6 = 0; i6 < 3; i6++) {
            if (t32[i6] < 0) {
              t32[i6] += 1;
            }
            if (t32[i6] > 1) {
              t32[i6] -= 1;
            }
            if (6 * t32[i6] < 1) {
              c4[i6] = t1 + (t22 - t1) * 6 * t32[i6];
            } else if (2 * t32[i6] < 1) {
              c4[i6] = t22;
            } else if (3 * t32[i6] < 2) {
              c4[i6] = t1 + (t22 - t1) * (2 / 3 - t32[i6]) * 6;
            } else {
              c4[i6] = t1;
            }
          }
          assign = [round$5(c4[0] * 255), round$5(c4[1] * 255), round$5(c4[2] * 255)], r8 = assign[0], g2 = assign[1], b3 = assign[2];
        }
        if (args.length > 3) {
          return [r8, g2, b3, args[3]];
        }
        return [r8, g2, b3, 1];
      };
      var hsl2rgb_1 = hsl2rgb$1;
      var hsl2rgb = hsl2rgb_1;
      var input$f = input$h;
      var RE_RGB = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/;
      var RE_RGBA = /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/;
      var RE_RGB_PCT = /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
      var RE_RGBA_PCT = /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;
      var RE_HSL = /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
      var RE_HSLA = /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;
      var round$4 = Math.round;
      var css2rgb$1 = function(css) {
        css = css.toLowerCase().trim();
        var m3;
        if (input$f.format.named) {
          try {
            return input$f.format.named(css);
          } catch (e11) {
          }
        }
        if (m3 = css.match(RE_RGB)) {
          var rgb2 = m3.slice(1, 4);
          for (var i6 = 0; i6 < 3; i6++) {
            rgb2[i6] = +rgb2[i6];
          }
          rgb2[3] = 1;
          return rgb2;
        }
        if (m3 = css.match(RE_RGBA)) {
          var rgb$1 = m3.slice(1, 5);
          for (var i$12 = 0; i$12 < 4; i$12++) {
            rgb$1[i$12] = +rgb$1[i$12];
          }
          return rgb$1;
        }
        if (m3 = css.match(RE_RGB_PCT)) {
          var rgb$2 = m3.slice(1, 4);
          for (var i$2 = 0; i$2 < 3; i$2++) {
            rgb$2[i$2] = round$4(rgb$2[i$2] * 2.55);
          }
          rgb$2[3] = 1;
          return rgb$2;
        }
        if (m3 = css.match(RE_RGBA_PCT)) {
          var rgb$3 = m3.slice(1, 5);
          for (var i$3 = 0; i$3 < 3; i$3++) {
            rgb$3[i$3] = round$4(rgb$3[i$3] * 2.55);
          }
          rgb$3[3] = +rgb$3[3];
          return rgb$3;
        }
        if (m3 = css.match(RE_HSL)) {
          var hsl2 = m3.slice(1, 4);
          hsl2[1] *= 0.01;
          hsl2[2] *= 0.01;
          var rgb$4 = hsl2rgb(hsl2);
          rgb$4[3] = 1;
          return rgb$4;
        }
        if (m3 = css.match(RE_HSLA)) {
          var hsl$1 = m3.slice(1, 4);
          hsl$1[1] *= 0.01;
          hsl$1[2] *= 0.01;
          var rgb$5 = hsl2rgb(hsl$1);
          rgb$5[3] = +m3[4];
          return rgb$5;
        }
      };
      css2rgb$1.test = function(s5) {
        return RE_RGB.test(s5) || RE_RGBA.test(s5) || RE_RGB_PCT.test(s5) || RE_RGBA_PCT.test(s5) || RE_HSL.test(s5) || RE_HSLA.test(s5);
      };
      var css2rgb_1 = css2rgb$1;
      var chroma$i = chroma_1;
      var Color$B = Color_1;
      var input$e = input$h;
      var type$k = utils.type;
      var rgb2css = rgb2css_1;
      var css2rgb = css2rgb_1;
      Color$B.prototype.css = function(mode) {
        return rgb2css(this._rgb, mode);
      };
      chroma$i.css = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$B, [null].concat(args, ["css"])))();
      };
      input$e.format.css = css2rgb;
      input$e.autodetect.push({
        p: 5,
        test: function(h3) {
          var rest = [], len = arguments.length - 1;
          while (len-- > 0)
            rest[len] = arguments[len + 1];
          if (!rest.length && type$k(h3) === "string" && css2rgb.test(h3)) {
            return "css";
          }
        }
      });
      var Color$A = Color_1;
      var chroma$h = chroma_1;
      var input$d = input$h;
      var unpack$t = utils.unpack;
      input$d.format.gl = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var rgb2 = unpack$t(args, "rgba");
        rgb2[0] *= 255;
        rgb2[1] *= 255;
        rgb2[2] *= 255;
        return rgb2;
      };
      chroma$h.gl = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$A, [null].concat(args, ["gl"])))();
      };
      Color$A.prototype.gl = function() {
        var rgb2 = this._rgb;
        return [rgb2[0] / 255, rgb2[1] / 255, rgb2[2] / 255, rgb2[3]];
      };
      var unpack$s = utils.unpack;
      var rgb2hcg$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$s(args, "rgb");
        var r8 = ref[0];
        var g2 = ref[1];
        var b3 = ref[2];
        var min3 = Math.min(r8, g2, b3);
        var max3 = Math.max(r8, g2, b3);
        var delta = max3 - min3;
        var c4 = delta * 100 / 255;
        var _g = min3 / (255 - delta) * 100;
        var h3;
        if (delta === 0) {
          h3 = Number.NaN;
        } else {
          if (r8 === max3) {
            h3 = (g2 - b3) / delta;
          }
          if (g2 === max3) {
            h3 = 2 + (b3 - r8) / delta;
          }
          if (b3 === max3) {
            h3 = 4 + (r8 - g2) / delta;
          }
          h3 *= 60;
          if (h3 < 0) {
            h3 += 360;
          }
        }
        return [h3, c4, _g];
      };
      var rgb2hcg_1 = rgb2hcg$1;
      var unpack$r = utils.unpack;
      var floor$3 = Math.floor;
      var hcg2rgb = function() {
        var assign, assign$1, assign$2, assign$3, assign$4, assign$5;
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$r(args, "hcg");
        var h3 = args[0];
        var c4 = args[1];
        var _g = args[2];
        var r8, g2, b3;
        _g = _g * 255;
        var _c = c4 * 255;
        if (c4 === 0) {
          r8 = g2 = b3 = _g;
        } else {
          if (h3 === 360) {
            h3 = 0;
          }
          if (h3 > 360) {
            h3 -= 360;
          }
          if (h3 < 0) {
            h3 += 360;
          }
          h3 /= 60;
          var i6 = floor$3(h3);
          var f4 = h3 - i6;
          var p3 = _g * (1 - c4);
          var q = p3 + _c * (1 - f4);
          var t7 = p3 + _c * f4;
          var v2 = p3 + _c;
          switch (i6) {
            case 0:
              assign = [v2, t7, p3], r8 = assign[0], g2 = assign[1], b3 = assign[2];
              break;
            case 1:
              assign$1 = [q, v2, p3], r8 = assign$1[0], g2 = assign$1[1], b3 = assign$1[2];
              break;
            case 2:
              assign$2 = [p3, v2, t7], r8 = assign$2[0], g2 = assign$2[1], b3 = assign$2[2];
              break;
            case 3:
              assign$3 = [p3, q, v2], r8 = assign$3[0], g2 = assign$3[1], b3 = assign$3[2];
              break;
            case 4:
              assign$4 = [t7, p3, v2], r8 = assign$4[0], g2 = assign$4[1], b3 = assign$4[2];
              break;
            case 5:
              assign$5 = [v2, p3, q], r8 = assign$5[0], g2 = assign$5[1], b3 = assign$5[2];
              break;
          }
        }
        return [r8, g2, b3, args.length > 3 ? args[3] : 1];
      };
      var hcg2rgb_1 = hcg2rgb;
      var unpack$q = utils.unpack;
      var type$j = utils.type;
      var chroma$g = chroma_1;
      var Color$z = Color_1;
      var input$c = input$h;
      var rgb2hcg = rgb2hcg_1;
      Color$z.prototype.hcg = function() {
        return rgb2hcg(this._rgb);
      };
      chroma$g.hcg = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$z, [null].concat(args, ["hcg"])))();
      };
      input$c.format.hcg = hcg2rgb_1;
      input$c.autodetect.push({
        p: 1,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack$q(args, "hcg");
          if (type$j(args) === "array" && args.length === 3) {
            return "hcg";
          }
        }
      });
      var unpack$p = utils.unpack;
      var last = utils.last;
      var round$3 = Math.round;
      var rgb2hex$2 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$p(args, "rgba");
        var r8 = ref[0];
        var g2 = ref[1];
        var b3 = ref[2];
        var a4 = ref[3];
        var mode = last(args) || "auto";
        if (a4 === void 0) {
          a4 = 1;
        }
        if (mode === "auto") {
          mode = a4 < 1 ? "rgba" : "rgb";
        }
        r8 = round$3(r8);
        g2 = round$3(g2);
        b3 = round$3(b3);
        var u5 = r8 << 16 | g2 << 8 | b3;
        var str = "000000" + u5.toString(16);
        str = str.substr(str.length - 6);
        var hxa = "0" + round$3(a4 * 255).toString(16);
        hxa = hxa.substr(hxa.length - 2);
        switch (mode.toLowerCase()) {
          case "rgba":
            return "#" + str + hxa;
          case "argb":
            return "#" + hxa + str;
          default:
            return "#" + str;
        }
      };
      var rgb2hex_1 = rgb2hex$2;
      var RE_HEX = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      var RE_HEXA = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/;
      var hex2rgb$1 = function(hex) {
        if (hex.match(RE_HEX)) {
          if (hex.length === 4 || hex.length === 7) {
            hex = hex.substr(1);
          }
          if (hex.length === 3) {
            hex = hex.split("");
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
          }
          var u5 = parseInt(hex, 16);
          var r8 = u5 >> 16;
          var g2 = u5 >> 8 & 255;
          var b3 = u5 & 255;
          return [r8, g2, b3, 1];
        }
        if (hex.match(RE_HEXA)) {
          if (hex.length === 5 || hex.length === 9) {
            hex = hex.substr(1);
          }
          if (hex.length === 4) {
            hex = hex.split("");
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
          }
          var u$1 = parseInt(hex, 16);
          var r$1 = u$1 >> 24 & 255;
          var g$1 = u$1 >> 16 & 255;
          var b$1 = u$1 >> 8 & 255;
          var a4 = Math.round((u$1 & 255) / 255 * 100) / 100;
          return [r$1, g$1, b$1, a4];
        }
        throw new Error("unknown hex color: " + hex);
      };
      var hex2rgb_1 = hex2rgb$1;
      var chroma$f = chroma_1;
      var Color$y = Color_1;
      var type$i = utils.type;
      var input$b = input$h;
      var rgb2hex$1 = rgb2hex_1;
      Color$y.prototype.hex = function(mode) {
        return rgb2hex$1(this._rgb, mode);
      };
      chroma$f.hex = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$y, [null].concat(args, ["hex"])))();
      };
      input$b.format.hex = hex2rgb_1;
      input$b.autodetect.push({
        p: 4,
        test: function(h3) {
          var rest = [], len = arguments.length - 1;
          while (len-- > 0)
            rest[len] = arguments[len + 1];
          if (!rest.length && type$i(h3) === "string" && [3, 4, 5, 6, 7, 8, 9].indexOf(h3.length) >= 0) {
            return "hex";
          }
        }
      });
      var unpack$o = utils.unpack;
      var TWOPI$2 = utils.TWOPI;
      var min$2 = Math.min;
      var sqrt$4 = Math.sqrt;
      var acos = Math.acos;
      var rgb2hsi$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$o(args, "rgb");
        var r8 = ref[0];
        var g2 = ref[1];
        var b3 = ref[2];
        r8 /= 255;
        g2 /= 255;
        b3 /= 255;
        var h3;
        var min_ = min$2(r8, g2, b3);
        var i6 = (r8 + g2 + b3) / 3;
        var s5 = i6 > 0 ? 1 - min_ / i6 : 0;
        if (s5 === 0) {
          h3 = NaN;
        } else {
          h3 = (r8 - g2 + (r8 - b3)) / 2;
          h3 /= sqrt$4((r8 - g2) * (r8 - g2) + (r8 - b3) * (g2 - b3));
          h3 = acos(h3);
          if (b3 > g2) {
            h3 = TWOPI$2 - h3;
          }
          h3 /= TWOPI$2;
        }
        return [h3 * 360, s5, i6];
      };
      var rgb2hsi_1 = rgb2hsi$1;
      var unpack$n = utils.unpack;
      var limit = utils.limit;
      var TWOPI$1 = utils.TWOPI;
      var PITHIRD = utils.PITHIRD;
      var cos$4 = Math.cos;
      var hsi2rgb = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$n(args, "hsi");
        var h3 = args[0];
        var s5 = args[1];
        var i6 = args[2];
        var r8, g2, b3;
        if (isNaN(h3)) {
          h3 = 0;
        }
        if (isNaN(s5)) {
          s5 = 0;
        }
        if (h3 > 360) {
          h3 -= 360;
        }
        if (h3 < 0) {
          h3 += 360;
        }
        h3 /= 360;
        if (h3 < 1 / 3) {
          b3 = (1 - s5) / 3;
          r8 = (1 + s5 * cos$4(TWOPI$1 * h3) / cos$4(PITHIRD - TWOPI$1 * h3)) / 3;
          g2 = 1 - (b3 + r8);
        } else if (h3 < 2 / 3) {
          h3 -= 1 / 3;
          r8 = (1 - s5) / 3;
          g2 = (1 + s5 * cos$4(TWOPI$1 * h3) / cos$4(PITHIRD - TWOPI$1 * h3)) / 3;
          b3 = 1 - (r8 + g2);
        } else {
          h3 -= 2 / 3;
          g2 = (1 - s5) / 3;
          b3 = (1 + s5 * cos$4(TWOPI$1 * h3) / cos$4(PITHIRD - TWOPI$1 * h3)) / 3;
          r8 = 1 - (g2 + b3);
        }
        r8 = limit(i6 * r8 * 3);
        g2 = limit(i6 * g2 * 3);
        b3 = limit(i6 * b3 * 3);
        return [r8 * 255, g2 * 255, b3 * 255, args.length > 3 ? args[3] : 1];
      };
      var hsi2rgb_1 = hsi2rgb;
      var unpack$m = utils.unpack;
      var type$h = utils.type;
      var chroma$e = chroma_1;
      var Color$x = Color_1;
      var input$a = input$h;
      var rgb2hsi = rgb2hsi_1;
      Color$x.prototype.hsi = function() {
        return rgb2hsi(this._rgb);
      };
      chroma$e.hsi = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$x, [null].concat(args, ["hsi"])))();
      };
      input$a.format.hsi = hsi2rgb_1;
      input$a.autodetect.push({
        p: 2,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack$m(args, "hsi");
          if (type$h(args) === "array" && args.length === 3) {
            return "hsi";
          }
        }
      });
      var unpack$l = utils.unpack;
      var type$g = utils.type;
      var chroma$d = chroma_1;
      var Color$w = Color_1;
      var input$9 = input$h;
      var rgb2hsl$1 = rgb2hsl_1;
      Color$w.prototype.hsl = function() {
        return rgb2hsl$1(this._rgb);
      };
      chroma$d.hsl = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$w, [null].concat(args, ["hsl"])))();
      };
      input$9.format.hsl = hsl2rgb_1;
      input$9.autodetect.push({
        p: 2,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack$l(args, "hsl");
          if (type$g(args) === "array" && args.length === 3) {
            return "hsl";
          }
        }
      });
      var unpack$k = utils.unpack;
      var min$1 = Math.min;
      var max$1 = Math.max;
      var rgb2hsl = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$k(args, "rgb");
        var r8 = args[0];
        var g2 = args[1];
        var b3 = args[2];
        var min_ = min$1(r8, g2, b3);
        var max_ = max$1(r8, g2, b3);
        var delta = max_ - min_;
        var h3, s5, v2;
        v2 = max_ / 255;
        if (max_ === 0) {
          h3 = Number.NaN;
          s5 = 0;
        } else {
          s5 = delta / max_;
          if (r8 === max_) {
            h3 = (g2 - b3) / delta;
          }
          if (g2 === max_) {
            h3 = 2 + (b3 - r8) / delta;
          }
          if (b3 === max_) {
            h3 = 4 + (r8 - g2) / delta;
          }
          h3 *= 60;
          if (h3 < 0) {
            h3 += 360;
          }
        }
        return [h3, s5, v2];
      };
      var rgb2hsv$1 = rgb2hsl;
      var unpack$j = utils.unpack;
      var floor$2 = Math.floor;
      var hsv2rgb = function() {
        var assign, assign$1, assign$2, assign$3, assign$4, assign$5;
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$j(args, "hsv");
        var h3 = args[0];
        var s5 = args[1];
        var v2 = args[2];
        var r8, g2, b3;
        v2 *= 255;
        if (s5 === 0) {
          r8 = g2 = b3 = v2;
        } else {
          if (h3 === 360) {
            h3 = 0;
          }
          if (h3 > 360) {
            h3 -= 360;
          }
          if (h3 < 0) {
            h3 += 360;
          }
          h3 /= 60;
          var i6 = floor$2(h3);
          var f4 = h3 - i6;
          var p3 = v2 * (1 - s5);
          var q = v2 * (1 - s5 * f4);
          var t7 = v2 * (1 - s5 * (1 - f4));
          switch (i6) {
            case 0:
              assign = [v2, t7, p3], r8 = assign[0], g2 = assign[1], b3 = assign[2];
              break;
            case 1:
              assign$1 = [q, v2, p3], r8 = assign$1[0], g2 = assign$1[1], b3 = assign$1[2];
              break;
            case 2:
              assign$2 = [p3, v2, t7], r8 = assign$2[0], g2 = assign$2[1], b3 = assign$2[2];
              break;
            case 3:
              assign$3 = [p3, q, v2], r8 = assign$3[0], g2 = assign$3[1], b3 = assign$3[2];
              break;
            case 4:
              assign$4 = [t7, p3, v2], r8 = assign$4[0], g2 = assign$4[1], b3 = assign$4[2];
              break;
            case 5:
              assign$5 = [v2, p3, q], r8 = assign$5[0], g2 = assign$5[1], b3 = assign$5[2];
              break;
          }
        }
        return [r8, g2, b3, args.length > 3 ? args[3] : 1];
      };
      var hsv2rgb_1 = hsv2rgb;
      var unpack$i = utils.unpack;
      var type$f = utils.type;
      var chroma$c = chroma_1;
      var Color$v = Color_1;
      var input$8 = input$h;
      var rgb2hsv = rgb2hsv$1;
      Color$v.prototype.hsv = function() {
        return rgb2hsv(this._rgb);
      };
      chroma$c.hsv = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$v, [null].concat(args, ["hsv"])))();
      };
      input$8.format.hsv = hsv2rgb_1;
      input$8.autodetect.push({
        p: 2,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack$i(args, "hsv");
          if (type$f(args) === "array" && args.length === 3) {
            return "hsv";
          }
        }
      });
      var labConstants = {
        // Corresponds roughly to RGB brighter/darker
        Kn: 18,
        // D65 standard referent
        Xn: 0.95047,
        Yn: 1,
        Zn: 1.08883,
        t0: 0.137931034,
        // 4 / 29
        t1: 0.206896552,
        // 6 / 29
        t2: 0.12841855,
        // 3 * t1 * t1
        t3: 8856452e-9
        // t1 * t1 * t1
      };
      var LAB_CONSTANTS$3 = labConstants;
      var unpack$h = utils.unpack;
      var pow$a = Math.pow;
      var rgb2lab$2 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$h(args, "rgb");
        var r8 = ref[0];
        var g2 = ref[1];
        var b3 = ref[2];
        var ref$1 = rgb2xyz(r8, g2, b3);
        var x2 = ref$1[0];
        var y3 = ref$1[1];
        var z2 = ref$1[2];
        var l5 = 116 * y3 - 16;
        return [l5 < 0 ? 0 : l5, 500 * (x2 - y3), 200 * (y3 - z2)];
      };
      var rgb_xyz = function(r8) {
        if ((r8 /= 255) <= 0.04045) {
          return r8 / 12.92;
        }
        return pow$a((r8 + 0.055) / 1.055, 2.4);
      };
      var xyz_lab = function(t7) {
        if (t7 > LAB_CONSTANTS$3.t3) {
          return pow$a(t7, 1 / 3);
        }
        return t7 / LAB_CONSTANTS$3.t2 + LAB_CONSTANTS$3.t0;
      };
      var rgb2xyz = function(r8, g2, b3) {
        r8 = rgb_xyz(r8);
        g2 = rgb_xyz(g2);
        b3 = rgb_xyz(b3);
        var x2 = xyz_lab((0.4124564 * r8 + 0.3575761 * g2 + 0.1804375 * b3) / LAB_CONSTANTS$3.Xn);
        var y3 = xyz_lab((0.2126729 * r8 + 0.7151522 * g2 + 0.072175 * b3) / LAB_CONSTANTS$3.Yn);
        var z2 = xyz_lab((0.0193339 * r8 + 0.119192 * g2 + 0.9503041 * b3) / LAB_CONSTANTS$3.Zn);
        return [x2, y3, z2];
      };
      var rgb2lab_1 = rgb2lab$2;
      var LAB_CONSTANTS$2 = labConstants;
      var unpack$g = utils.unpack;
      var pow$9 = Math.pow;
      var lab2rgb$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$g(args, "lab");
        var l5 = args[0];
        var a4 = args[1];
        var b3 = args[2];
        var x2, y3, z2, r8, g2, b_;
        y3 = (l5 + 16) / 116;
        x2 = isNaN(a4) ? y3 : y3 + a4 / 500;
        z2 = isNaN(b3) ? y3 : y3 - b3 / 200;
        y3 = LAB_CONSTANTS$2.Yn * lab_xyz(y3);
        x2 = LAB_CONSTANTS$2.Xn * lab_xyz(x2);
        z2 = LAB_CONSTANTS$2.Zn * lab_xyz(z2);
        r8 = xyz_rgb(3.2404542 * x2 - 1.5371385 * y3 - 0.4985314 * z2);
        g2 = xyz_rgb(-0.969266 * x2 + 1.8760108 * y3 + 0.041556 * z2);
        b_ = xyz_rgb(0.0556434 * x2 - 0.2040259 * y3 + 1.0572252 * z2);
        return [r8, g2, b_, args.length > 3 ? args[3] : 1];
      };
      var xyz_rgb = function(r8) {
        return 255 * (r8 <= 304e-5 ? 12.92 * r8 : 1.055 * pow$9(r8, 1 / 2.4) - 0.055);
      };
      var lab_xyz = function(t7) {
        return t7 > LAB_CONSTANTS$2.t1 ? t7 * t7 * t7 : LAB_CONSTANTS$2.t2 * (t7 - LAB_CONSTANTS$2.t0);
      };
      var lab2rgb_1 = lab2rgb$1;
      var unpack$f = utils.unpack;
      var type$e = utils.type;
      var chroma$b = chroma_1;
      var Color$u = Color_1;
      var input$7 = input$h;
      var rgb2lab$1 = rgb2lab_1;
      Color$u.prototype.lab = function() {
        return rgb2lab$1(this._rgb);
      };
      chroma$b.lab = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$u, [null].concat(args, ["lab"])))();
      };
      input$7.format.lab = lab2rgb_1;
      input$7.autodetect.push({
        p: 2,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack$f(args, "lab");
          if (type$e(args) === "array" && args.length === 3) {
            return "lab";
          }
        }
      });
      var unpack$e = utils.unpack;
      var RAD2DEG = utils.RAD2DEG;
      var sqrt$3 = Math.sqrt;
      var atan2$2 = Math.atan2;
      var round$2 = Math.round;
      var lab2lch$2 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$e(args, "lab");
        var l5 = ref[0];
        var a4 = ref[1];
        var b3 = ref[2];
        var c4 = sqrt$3(a4 * a4 + b3 * b3);
        var h3 = (atan2$2(b3, a4) * RAD2DEG + 360) % 360;
        if (round$2(c4 * 1e4) === 0) {
          h3 = Number.NaN;
        }
        return [l5, c4, h3];
      };
      var lab2lch_1 = lab2lch$2;
      var unpack$d = utils.unpack;
      var rgb2lab = rgb2lab_1;
      var lab2lch$1 = lab2lch_1;
      var rgb2lch$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$d(args, "rgb");
        var r8 = ref[0];
        var g2 = ref[1];
        var b3 = ref[2];
        var ref$1 = rgb2lab(r8, g2, b3);
        var l5 = ref$1[0];
        var a4 = ref$1[1];
        var b_ = ref$1[2];
        return lab2lch$1(l5, a4, b_);
      };
      var rgb2lch_1 = rgb2lch$1;
      var unpack$c = utils.unpack;
      var DEG2RAD = utils.DEG2RAD;
      var sin$3 = Math.sin;
      var cos$3 = Math.cos;
      var lch2lab$2 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$c(args, "lch");
        var l5 = ref[0];
        var c4 = ref[1];
        var h3 = ref[2];
        if (isNaN(h3)) {
          h3 = 0;
        }
        h3 = h3 * DEG2RAD;
        return [l5, cos$3(h3) * c4, sin$3(h3) * c4];
      };
      var lch2lab_1 = lch2lab$2;
      var unpack$b = utils.unpack;
      var lch2lab$1 = lch2lab_1;
      var lab2rgb = lab2rgb_1;
      var lch2rgb$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$b(args, "lch");
        var l5 = args[0];
        var c4 = args[1];
        var h3 = args[2];
        var ref = lch2lab$1(l5, c4, h3);
        var L2 = ref[0];
        var a4 = ref[1];
        var b_ = ref[2];
        var ref$1 = lab2rgb(L2, a4, b_);
        var r8 = ref$1[0];
        var g2 = ref$1[1];
        var b3 = ref$1[2];
        return [r8, g2, b3, args.length > 3 ? args[3] : 1];
      };
      var lch2rgb_1 = lch2rgb$1;
      var unpack$a = utils.unpack;
      var lch2rgb = lch2rgb_1;
      var hcl2rgb = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var hcl = unpack$a(args, "hcl").reverse();
        return lch2rgb.apply(void 0, hcl);
      };
      var hcl2rgb_1 = hcl2rgb;
      var unpack$9 = utils.unpack;
      var type$d = utils.type;
      var chroma$a = chroma_1;
      var Color$t = Color_1;
      var input$6 = input$h;
      var rgb2lch = rgb2lch_1;
      Color$t.prototype.lch = function() {
        return rgb2lch(this._rgb);
      };
      Color$t.prototype.hcl = function() {
        return rgb2lch(this._rgb).reverse();
      };
      chroma$a.lch = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$t, [null].concat(args, ["lch"])))();
      };
      chroma$a.hcl = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$t, [null].concat(args, ["hcl"])))();
      };
      input$6.format.lch = lch2rgb_1;
      input$6.format.hcl = hcl2rgb_1;
      ["lch", "hcl"].forEach(function(m3) {
        return input$6.autodetect.push({
          p: 2,
          test: function() {
            var args = [], len = arguments.length;
            while (len--)
              args[len] = arguments[len];
            args = unpack$9(args, m3);
            if (type$d(args) === "array" && args.length === 3) {
              return m3;
            }
          }
        });
      });
      var w3cx11$1 = {
        aliceblue: "#f0f8ff",
        antiquewhite: "#faebd7",
        aqua: "#00ffff",
        aquamarine: "#7fffd4",
        azure: "#f0ffff",
        beige: "#f5f5dc",
        bisque: "#ffe4c4",
        black: "#000000",
        blanchedalmond: "#ffebcd",
        blue: "#0000ff",
        blueviolet: "#8a2be2",
        brown: "#a52a2a",
        burlywood: "#deb887",
        cadetblue: "#5f9ea0",
        chartreuse: "#7fff00",
        chocolate: "#d2691e",
        coral: "#ff7f50",
        cornflower: "#6495ed",
        cornflowerblue: "#6495ed",
        cornsilk: "#fff8dc",
        crimson: "#dc143c",
        cyan: "#00ffff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgoldenrod: "#b8860b",
        darkgray: "#a9a9a9",
        darkgreen: "#006400",
        darkgrey: "#a9a9a9",
        darkkhaki: "#bdb76b",
        darkmagenta: "#8b008b",
        darkolivegreen: "#556b2f",
        darkorange: "#ff8c00",
        darkorchid: "#9932cc",
        darkred: "#8b0000",
        darksalmon: "#e9967a",
        darkseagreen: "#8fbc8f",
        darkslateblue: "#483d8b",
        darkslategray: "#2f4f4f",
        darkslategrey: "#2f4f4f",
        darkturquoise: "#00ced1",
        darkviolet: "#9400d3",
        deeppink: "#ff1493",
        deepskyblue: "#00bfff",
        dimgray: "#696969",
        dimgrey: "#696969",
        dodgerblue: "#1e90ff",
        firebrick: "#b22222",
        floralwhite: "#fffaf0",
        forestgreen: "#228b22",
        fuchsia: "#ff00ff",
        gainsboro: "#dcdcdc",
        ghostwhite: "#f8f8ff",
        gold: "#ffd700",
        goldenrod: "#daa520",
        gray: "#808080",
        green: "#008000",
        greenyellow: "#adff2f",
        grey: "#808080",
        honeydew: "#f0fff0",
        hotpink: "#ff69b4",
        indianred: "#cd5c5c",
        indigo: "#4b0082",
        ivory: "#fffff0",
        khaki: "#f0e68c",
        laserlemon: "#ffff54",
        lavender: "#e6e6fa",
        lavenderblush: "#fff0f5",
        lawngreen: "#7cfc00",
        lemonchiffon: "#fffacd",
        lightblue: "#add8e6",
        lightcoral: "#f08080",
        lightcyan: "#e0ffff",
        lightgoldenrod: "#fafad2",
        lightgoldenrodyellow: "#fafad2",
        lightgray: "#d3d3d3",
        lightgreen: "#90ee90",
        lightgrey: "#d3d3d3",
        lightpink: "#ffb6c1",
        lightsalmon: "#ffa07a",
        lightseagreen: "#20b2aa",
        lightskyblue: "#87cefa",
        lightslategray: "#778899",
        lightslategrey: "#778899",
        lightsteelblue: "#b0c4de",
        lightyellow: "#ffffe0",
        lime: "#00ff00",
        limegreen: "#32cd32",
        linen: "#faf0e6",
        magenta: "#ff00ff",
        maroon: "#800000",
        maroon2: "#7f0000",
        maroon3: "#b03060",
        mediumaquamarine: "#66cdaa",
        mediumblue: "#0000cd",
        mediumorchid: "#ba55d3",
        mediumpurple: "#9370db",
        mediumseagreen: "#3cb371",
        mediumslateblue: "#7b68ee",
        mediumspringgreen: "#00fa9a",
        mediumturquoise: "#48d1cc",
        mediumvioletred: "#c71585",
        midnightblue: "#191970",
        mintcream: "#f5fffa",
        mistyrose: "#ffe4e1",
        moccasin: "#ffe4b5",
        navajowhite: "#ffdead",
        navy: "#000080",
        oldlace: "#fdf5e6",
        olive: "#808000",
        olivedrab: "#6b8e23",
        orange: "#ffa500",
        orangered: "#ff4500",
        orchid: "#da70d6",
        palegoldenrod: "#eee8aa",
        palegreen: "#98fb98",
        paleturquoise: "#afeeee",
        palevioletred: "#db7093",
        papayawhip: "#ffefd5",
        peachpuff: "#ffdab9",
        peru: "#cd853f",
        pink: "#ffc0cb",
        plum: "#dda0dd",
        powderblue: "#b0e0e6",
        purple: "#800080",
        purple2: "#7f007f",
        purple3: "#a020f0",
        rebeccapurple: "#663399",
        red: "#ff0000",
        rosybrown: "#bc8f8f",
        royalblue: "#4169e1",
        saddlebrown: "#8b4513",
        salmon: "#fa8072",
        sandybrown: "#f4a460",
        seagreen: "#2e8b57",
        seashell: "#fff5ee",
        sienna: "#a0522d",
        silver: "#c0c0c0",
        skyblue: "#87ceeb",
        slateblue: "#6a5acd",
        slategray: "#708090",
        slategrey: "#708090",
        snow: "#fffafa",
        springgreen: "#00ff7f",
        steelblue: "#4682b4",
        tan: "#d2b48c",
        teal: "#008080",
        thistle: "#d8bfd8",
        tomato: "#ff6347",
        turquoise: "#40e0d0",
        violet: "#ee82ee",
        wheat: "#f5deb3",
        white: "#ffffff",
        whitesmoke: "#f5f5f5",
        yellow: "#ffff00",
        yellowgreen: "#9acd32"
      };
      var w3cx11_1 = w3cx11$1;
      var Color$s = Color_1;
      var input$5 = input$h;
      var type$c = utils.type;
      var w3cx11 = w3cx11_1;
      var hex2rgb = hex2rgb_1;
      var rgb2hex = rgb2hex_1;
      Color$s.prototype.name = function() {
        var hex = rgb2hex(this._rgb, "rgb");
        for (var i6 = 0, list2 = Object.keys(w3cx11); i6 < list2.length; i6 += 1) {
          var n6 = list2[i6];
          if (w3cx11[n6] === hex) {
            return n6.toLowerCase();
          }
        }
        return hex;
      };
      input$5.format.named = function(name2) {
        name2 = name2.toLowerCase();
        if (w3cx11[name2]) {
          return hex2rgb(w3cx11[name2]);
        }
        throw new Error("unknown color name: " + name2);
      };
      input$5.autodetect.push({
        p: 5,
        test: function(h3) {
          var rest = [], len = arguments.length - 1;
          while (len-- > 0)
            rest[len] = arguments[len + 1];
          if (!rest.length && type$c(h3) === "string" && w3cx11[h3.toLowerCase()]) {
            return "named";
          }
        }
      });
      var unpack$8 = utils.unpack;
      var rgb2num$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$8(args, "rgb");
        var r8 = ref[0];
        var g2 = ref[1];
        var b3 = ref[2];
        return (r8 << 16) + (g2 << 8) + b3;
      };
      var rgb2num_1 = rgb2num$1;
      var type$b = utils.type;
      var num2rgb = function(num2) {
        if (type$b(num2) == "number" && num2 >= 0 && num2 <= 16777215) {
          var r8 = num2 >> 16;
          var g2 = num2 >> 8 & 255;
          var b3 = num2 & 255;
          return [r8, g2, b3, 1];
        }
        throw new Error("unknown num color: " + num2);
      };
      var num2rgb_1 = num2rgb;
      var chroma$9 = chroma_1;
      var Color$r = Color_1;
      var input$4 = input$h;
      var type$a = utils.type;
      var rgb2num = rgb2num_1;
      Color$r.prototype.num = function() {
        return rgb2num(this._rgb);
      };
      chroma$9.num = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$r, [null].concat(args, ["num"])))();
      };
      input$4.format.num = num2rgb_1;
      input$4.autodetect.push({
        p: 5,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          if (args.length === 1 && type$a(args[0]) === "number" && args[0] >= 0 && args[0] <= 16777215) {
            return "num";
          }
        }
      });
      var chroma$8 = chroma_1;
      var Color$q = Color_1;
      var input$3 = input$h;
      var unpack$7 = utils.unpack;
      var type$9 = utils.type;
      var round$1 = Math.round;
      Color$q.prototype.rgb = function(rnd2) {
        if (rnd2 === void 0)
          rnd2 = true;
        if (rnd2 === false) {
          return this._rgb.slice(0, 3);
        }
        return this._rgb.slice(0, 3).map(round$1);
      };
      Color$q.prototype.rgba = function(rnd2) {
        if (rnd2 === void 0)
          rnd2 = true;
        return this._rgb.slice(0, 4).map(function(v2, i6) {
          return i6 < 3 ? rnd2 === false ? v2 : round$1(v2) : v2;
        });
      };
      chroma$8.rgb = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$q, [null].concat(args, ["rgb"])))();
      };
      input$3.format.rgb = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var rgba = unpack$7(args, "rgba");
        if (rgba[3] === void 0) {
          rgba[3] = 1;
        }
        return rgba;
      };
      input$3.autodetect.push({
        p: 3,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack$7(args, "rgba");
          if (type$9(args) === "array" && (args.length === 3 || args.length === 4 && type$9(args[3]) == "number" && args[3] >= 0 && args[3] <= 1)) {
            return "rgb";
          }
        }
      });
      var log$1 = Math.log;
      var temperature2rgb$1 = function(kelvin) {
        var temp = kelvin / 100;
        var r8, g2, b3;
        if (temp < 66) {
          r8 = 255;
          g2 = temp < 6 ? 0 : -155.25485562709179 - 0.44596950469579133 * (g2 = temp - 2) + 104.49216199393888 * log$1(g2);
          b3 = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b3 = temp - 10) + 115.67994401066147 * log$1(b3);
        } else {
          r8 = 351.97690566805693 + 0.114206453784165 * (r8 = temp - 55) - 40.25366309332127 * log$1(r8);
          g2 = 325.4494125711974 + 0.07943456536662342 * (g2 = temp - 50) - 28.0852963507957 * log$1(g2);
          b3 = 255;
        }
        return [r8, g2, b3, 1];
      };
      var temperature2rgb_1 = temperature2rgb$1;
      var temperature2rgb = temperature2rgb_1;
      var unpack$6 = utils.unpack;
      var round2 = Math.round;
      var rgb2temperature$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var rgb2 = unpack$6(args, "rgb");
        var r8 = rgb2[0], b3 = rgb2[2];
        var minTemp = 1e3;
        var maxTemp = 4e4;
        var eps = 0.4;
        var temp;
        while (maxTemp - minTemp > eps) {
          temp = (maxTemp + minTemp) * 0.5;
          var rgb$1 = temperature2rgb(temp);
          if (rgb$1[2] / rgb$1[0] >= b3 / r8) {
            maxTemp = temp;
          } else {
            minTemp = temp;
          }
        }
        return round2(temp);
      };
      var rgb2temperature_1 = rgb2temperature$1;
      var chroma$7 = chroma_1;
      var Color$p = Color_1;
      var input$2 = input$h;
      var rgb2temperature = rgb2temperature_1;
      Color$p.prototype.temp = Color$p.prototype.kelvin = Color$p.prototype.temperature = function() {
        return rgb2temperature(this._rgb);
      };
      chroma$7.temp = chroma$7.kelvin = chroma$7.temperature = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$p, [null].concat(args, ["temp"])))();
      };
      input$2.format.temp = input$2.format.kelvin = input$2.format.temperature = temperature2rgb_1;
      var unpack$5 = utils.unpack;
      var cbrt = Math.cbrt;
      var pow$8 = Math.pow;
      var sign$1 = Math.sign;
      var rgb2oklab$2 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$5(args, "rgb");
        var r8 = ref[0];
        var g2 = ref[1];
        var b3 = ref[2];
        var ref$1 = [rgb2lrgb(r8 / 255), rgb2lrgb(g2 / 255), rgb2lrgb(b3 / 255)];
        var lr = ref$1[0];
        var lg = ref$1[1];
        var lb = ref$1[2];
        var l5 = cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
        var m3 = cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
        var s5 = cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
        return [
          0.2104542553 * l5 + 0.793617785 * m3 - 0.0040720468 * s5,
          1.9779984951 * l5 - 2.428592205 * m3 + 0.4505937099 * s5,
          0.0259040371 * l5 + 0.7827717662 * m3 - 0.808675766 * s5
        ];
      };
      var rgb2oklab_1 = rgb2oklab$2;
      function rgb2lrgb(c4) {
        var abs2 = Math.abs(c4);
        if (abs2 < 0.04045) {
          return c4 / 12.92;
        }
        return (sign$1(c4) || 1) * pow$8((abs2 + 0.055) / 1.055, 2.4);
      }
      var unpack$4 = utils.unpack;
      var pow$7 = Math.pow;
      var sign = Math.sign;
      var oklab2rgb$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$4(args, "lab");
        var L2 = args[0];
        var a4 = args[1];
        var b3 = args[2];
        var l5 = pow$7(L2 + 0.3963377774 * a4 + 0.2158037573 * b3, 3);
        var m3 = pow$7(L2 - 0.1055613458 * a4 - 0.0638541728 * b3, 3);
        var s5 = pow$7(L2 - 0.0894841775 * a4 - 1.291485548 * b3, 3);
        return [
          255 * lrgb2rgb(4.0767416621 * l5 - 3.3077115913 * m3 + 0.2309699292 * s5),
          255 * lrgb2rgb(-1.2684380046 * l5 + 2.6097574011 * m3 - 0.3413193965 * s5),
          255 * lrgb2rgb(-0.0041960863 * l5 - 0.7034186147 * m3 + 1.707614701 * s5),
          args.length > 3 ? args[3] : 1
        ];
      };
      var oklab2rgb_1 = oklab2rgb$1;
      function lrgb2rgb(c4) {
        var abs2 = Math.abs(c4);
        if (abs2 > 31308e-7) {
          return (sign(c4) || 1) * (1.055 * pow$7(abs2, 1 / 2.4) - 0.055);
        }
        return c4 * 12.92;
      }
      var unpack$3 = utils.unpack;
      var type$8 = utils.type;
      var chroma$6 = chroma_1;
      var Color$o = Color_1;
      var input$1 = input$h;
      var rgb2oklab$1 = rgb2oklab_1;
      Color$o.prototype.oklab = function() {
        return rgb2oklab$1(this._rgb);
      };
      chroma$6.oklab = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$o, [null].concat(args, ["oklab"])))();
      };
      input$1.format.oklab = oklab2rgb_1;
      input$1.autodetect.push({
        p: 3,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack$3(args, "oklab");
          if (type$8(args) === "array" && args.length === 3) {
            return "oklab";
          }
        }
      });
      var unpack$2 = utils.unpack;
      var rgb2oklab = rgb2oklab_1;
      var lab2lch = lab2lch_1;
      var rgb2oklch$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$2(args, "rgb");
        var r8 = ref[0];
        var g2 = ref[1];
        var b3 = ref[2];
        var ref$1 = rgb2oklab(r8, g2, b3);
        var l5 = ref$1[0];
        var a4 = ref$1[1];
        var b_ = ref$1[2];
        return lab2lch(l5, a4, b_);
      };
      var rgb2oklch_1 = rgb2oklch$1;
      var unpack$1 = utils.unpack;
      var lch2lab = lch2lab_1;
      var oklab2rgb = oklab2rgb_1;
      var oklch2rgb = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$1(args, "lch");
        var l5 = args[0];
        var c4 = args[1];
        var h3 = args[2];
        var ref = lch2lab(l5, c4, h3);
        var L2 = ref[0];
        var a4 = ref[1];
        var b_ = ref[2];
        var ref$1 = oklab2rgb(L2, a4, b_);
        var r8 = ref$1[0];
        var g2 = ref$1[1];
        var b3 = ref$1[2];
        return [r8, g2, b3, args.length > 3 ? args[3] : 1];
      };
      var oklch2rgb_1 = oklch2rgb;
      var unpack = utils.unpack;
      var type$7 = utils.type;
      var chroma$5 = chroma_1;
      var Color$n = Color_1;
      var input = input$h;
      var rgb2oklch = rgb2oklch_1;
      Color$n.prototype.oklch = function() {
        return rgb2oklch(this._rgb);
      };
      chroma$5.oklch = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$n, [null].concat(args, ["oklch"])))();
      };
      input.format.oklch = oklch2rgb_1;
      input.autodetect.push({
        p: 3,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack(args, "oklch");
          if (type$7(args) === "array" && args.length === 3) {
            return "oklch";
          }
        }
      });
      var Color$m = Color_1;
      var type$6 = utils.type;
      Color$m.prototype.alpha = function(a4, mutate) {
        if (mutate === void 0)
          mutate = false;
        if (a4 !== void 0 && type$6(a4) === "number") {
          if (mutate) {
            this._rgb[3] = a4;
            return this;
          }
          return new Color$m([this._rgb[0], this._rgb[1], this._rgb[2], a4], "rgb");
        }
        return this._rgb[3];
      };
      var Color$l = Color_1;
      Color$l.prototype.clipped = function() {
        return this._rgb._clipped || false;
      };
      var Color$k = Color_1;
      var LAB_CONSTANTS$1 = labConstants;
      Color$k.prototype.darken = function(amount) {
        if (amount === void 0)
          amount = 1;
        var me = this;
        var lab2 = me.lab();
        lab2[0] -= LAB_CONSTANTS$1.Kn * amount;
        return new Color$k(lab2, "lab").alpha(me.alpha(), true);
      };
      Color$k.prototype.brighten = function(amount) {
        if (amount === void 0)
          amount = 1;
        return this.darken(-amount);
      };
      Color$k.prototype.darker = Color$k.prototype.darken;
      Color$k.prototype.brighter = Color$k.prototype.brighten;
      var Color$j = Color_1;
      Color$j.prototype.get = function(mc) {
        var ref = mc.split(".");
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();
        if (channel) {
          var i6 = mode.indexOf(channel) - (mode.substr(0, 2) === "ok" ? 2 : 0);
          if (i6 > -1) {
            return src[i6];
          }
          throw new Error("unknown channel " + channel + " in mode " + mode);
        } else {
          return src;
        }
      };
      var Color$i = Color_1;
      var type$5 = utils.type;
      var pow$6 = Math.pow;
      var EPS = 1e-7;
      var MAX_ITER = 20;
      Color$i.prototype.luminance = function(lum) {
        if (lum !== void 0 && type$5(lum) === "number") {
          if (lum === 0) {
            return new Color$i([0, 0, 0, this._rgb[3]], "rgb");
          }
          if (lum === 1) {
            return new Color$i([255, 255, 255, this._rgb[3]], "rgb");
          }
          var cur_lum = this.luminance();
          var mode = "rgb";
          var max_iter = MAX_ITER;
          var test = function(low, high) {
            var mid = low.interpolate(high, 0.5, mode);
            var lm = mid.luminance();
            if (Math.abs(lum - lm) < EPS || !max_iter--) {
              return mid;
            }
            return lm > lum ? test(low, mid) : test(mid, high);
          };
          var rgb2 = (cur_lum > lum ? test(new Color$i([0, 0, 0]), this) : test(this, new Color$i([255, 255, 255]))).rgb();
          return new Color$i(rgb2.concat([this._rgb[3]]));
        }
        return rgb2luminance.apply(void 0, this._rgb.slice(0, 3));
      };
      var rgb2luminance = function(r8, g2, b3) {
        r8 = luminance_x(r8);
        g2 = luminance_x(g2);
        b3 = luminance_x(b3);
        return 0.2126 * r8 + 0.7152 * g2 + 0.0722 * b3;
      };
      var luminance_x = function(x2) {
        x2 /= 255;
        return x2 <= 0.03928 ? x2 / 12.92 : pow$6((x2 + 0.055) / 1.055, 2.4);
      };
      var interpolator$1 = {};
      var Color$h = Color_1;
      var type$4 = utils.type;
      var interpolator = interpolator$1;
      var mix$1 = function(col1, col2, f4) {
        if (f4 === void 0)
          f4 = 0.5;
        var rest = [], len = arguments.length - 3;
        while (len-- > 0)
          rest[len] = arguments[len + 3];
        var mode = rest[0] || "lrgb";
        if (!interpolator[mode] && !rest.length) {
          mode = Object.keys(interpolator)[0];
        }
        if (!interpolator[mode]) {
          throw new Error("interpolation mode " + mode + " is not defined");
        }
        if (type$4(col1) !== "object") {
          col1 = new Color$h(col1);
        }
        if (type$4(col2) !== "object") {
          col2 = new Color$h(col2);
        }
        return interpolator[mode](col1, col2, f4).alpha(col1.alpha() + f4 * (col2.alpha() - col1.alpha()));
      };
      var Color$g = Color_1;
      var mix = mix$1;
      Color$g.prototype.mix = Color$g.prototype.interpolate = function(col2, f4) {
        if (f4 === void 0)
          f4 = 0.5;
        var rest = [], len = arguments.length - 2;
        while (len-- > 0)
          rest[len] = arguments[len + 2];
        return mix.apply(void 0, [this, col2, f4].concat(rest));
      };
      var Color$f = Color_1;
      Color$f.prototype.premultiply = function(mutate) {
        if (mutate === void 0)
          mutate = false;
        var rgb2 = this._rgb;
        var a4 = rgb2[3];
        if (mutate) {
          this._rgb = [rgb2[0] * a4, rgb2[1] * a4, rgb2[2] * a4, a4];
          return this;
        } else {
          return new Color$f([rgb2[0] * a4, rgb2[1] * a4, rgb2[2] * a4, a4], "rgb");
        }
      };
      var Color$e = Color_1;
      var LAB_CONSTANTS = labConstants;
      Color$e.prototype.saturate = function(amount) {
        if (amount === void 0)
          amount = 1;
        var me = this;
        var lch2 = me.lch();
        lch2[1] += LAB_CONSTANTS.Kn * amount;
        if (lch2[1] < 0) {
          lch2[1] = 0;
        }
        return new Color$e(lch2, "lch").alpha(me.alpha(), true);
      };
      Color$e.prototype.desaturate = function(amount) {
        if (amount === void 0)
          amount = 1;
        return this.saturate(-amount);
      };
      var Color$d = Color_1;
      var type$3 = utils.type;
      Color$d.prototype.set = function(mc, value, mutate) {
        if (mutate === void 0)
          mutate = false;
        var ref = mc.split(".");
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();
        if (channel) {
          var i6 = mode.indexOf(channel) - (mode.substr(0, 2) === "ok" ? 2 : 0);
          if (i6 > -1) {
            if (type$3(value) == "string") {
              switch (value.charAt(0)) {
                case "+":
                  src[i6] += +value;
                  break;
                case "-":
                  src[i6] += +value;
                  break;
                case "*":
                  src[i6] *= +value.substr(1);
                  break;
                case "/":
                  src[i6] /= +value.substr(1);
                  break;
                default:
                  src[i6] = +value;
              }
            } else if (type$3(value) === "number") {
              src[i6] = value;
            } else {
              throw new Error("unsupported value for Color.set");
            }
            var out = new Color$d(src, mode);
            if (mutate) {
              this._rgb = out._rgb;
              return this;
            }
            return out;
          }
          throw new Error("unknown channel " + channel + " in mode " + mode);
        } else {
          return src;
        }
      };
      var Color$c = Color_1;
      var rgb = function(col1, col2, f4) {
        var xyz0 = col1._rgb;
        var xyz1 = col2._rgb;
        return new Color$c(
          xyz0[0] + f4 * (xyz1[0] - xyz0[0]),
          xyz0[1] + f4 * (xyz1[1] - xyz0[1]),
          xyz0[2] + f4 * (xyz1[2] - xyz0[2]),
          "rgb"
        );
      };
      interpolator$1.rgb = rgb;
      var Color$b = Color_1;
      var sqrt$2 = Math.sqrt;
      var pow$5 = Math.pow;
      var lrgb = function(col1, col2, f4) {
        var ref = col1._rgb;
        var x1 = ref[0];
        var y1 = ref[1];
        var z1 = ref[2];
        var ref$1 = col2._rgb;
        var x2 = ref$1[0];
        var y22 = ref$1[1];
        var z2 = ref$1[2];
        return new Color$b(
          sqrt$2(pow$5(x1, 2) * (1 - f4) + pow$5(x2, 2) * f4),
          sqrt$2(pow$5(y1, 2) * (1 - f4) + pow$5(y22, 2) * f4),
          sqrt$2(pow$5(z1, 2) * (1 - f4) + pow$5(z2, 2) * f4),
          "rgb"
        );
      };
      interpolator$1.lrgb = lrgb;
      var Color$a = Color_1;
      var lab = function(col1, col2, f4) {
        var xyz0 = col1.lab();
        var xyz1 = col2.lab();
        return new Color$a(
          xyz0[0] + f4 * (xyz1[0] - xyz0[0]),
          xyz0[1] + f4 * (xyz1[1] - xyz0[1]),
          xyz0[2] + f4 * (xyz1[2] - xyz0[2]),
          "lab"
        );
      };
      interpolator$1.lab = lab;
      var Color$9 = Color_1;
      var _hsx = function(col1, col2, f4, m3) {
        var assign, assign$1;
        var xyz0, xyz1;
        if (m3 === "hsl") {
          xyz0 = col1.hsl();
          xyz1 = col2.hsl();
        } else if (m3 === "hsv") {
          xyz0 = col1.hsv();
          xyz1 = col2.hsv();
        } else if (m3 === "hcg") {
          xyz0 = col1.hcg();
          xyz1 = col2.hcg();
        } else if (m3 === "hsi") {
          xyz0 = col1.hsi();
          xyz1 = col2.hsi();
        } else if (m3 === "lch" || m3 === "hcl") {
          m3 = "hcl";
          xyz0 = col1.hcl();
          xyz1 = col2.hcl();
        } else if (m3 === "oklch") {
          xyz0 = col1.oklch().reverse();
          xyz1 = col2.oklch().reverse();
        }
        var hue0, hue1, sat0, sat1, lbv0, lbv1;
        if (m3.substr(0, 1) === "h" || m3 === "oklch") {
          assign = xyz0, hue0 = assign[0], sat0 = assign[1], lbv0 = assign[2];
          assign$1 = xyz1, hue1 = assign$1[0], sat1 = assign$1[1], lbv1 = assign$1[2];
        }
        var sat, hue, lbv, dh;
        if (!isNaN(hue0) && !isNaN(hue1)) {
          if (hue1 > hue0 && hue1 - hue0 > 180) {
            dh = hue1 - (hue0 + 360);
          } else if (hue1 < hue0 && hue0 - hue1 > 180) {
            dh = hue1 + 360 - hue0;
          } else {
            dh = hue1 - hue0;
          }
          hue = hue0 + f4 * dh;
        } else if (!isNaN(hue0)) {
          hue = hue0;
          if ((lbv1 == 1 || lbv1 == 0) && m3 != "hsv") {
            sat = sat0;
          }
        } else if (!isNaN(hue1)) {
          hue = hue1;
          if ((lbv0 == 1 || lbv0 == 0) && m3 != "hsv") {
            sat = sat1;
          }
        } else {
          hue = Number.NaN;
        }
        if (sat === void 0) {
          sat = sat0 + f4 * (sat1 - sat0);
        }
        lbv = lbv0 + f4 * (lbv1 - lbv0);
        return m3 === "oklch" ? new Color$9([lbv, sat, hue], m3) : new Color$9([hue, sat, lbv], m3);
      };
      var interpolate_hsx$5 = _hsx;
      var lch = function(col1, col2, f4) {
        return interpolate_hsx$5(col1, col2, f4, "lch");
      };
      interpolator$1.lch = lch;
      interpolator$1.hcl = lch;
      var Color$8 = Color_1;
      var num = function(col1, col2, f4) {
        var c1 = col1.num();
        var c22 = col2.num();
        return new Color$8(c1 + f4 * (c22 - c1), "num");
      };
      interpolator$1.num = num;
      var interpolate_hsx$4 = _hsx;
      var hcg = function(col1, col2, f4) {
        return interpolate_hsx$4(col1, col2, f4, "hcg");
      };
      interpolator$1.hcg = hcg;
      var interpolate_hsx$3 = _hsx;
      var hsi = function(col1, col2, f4) {
        return interpolate_hsx$3(col1, col2, f4, "hsi");
      };
      interpolator$1.hsi = hsi;
      var interpolate_hsx$2 = _hsx;
      var hsl = function(col1, col2, f4) {
        return interpolate_hsx$2(col1, col2, f4, "hsl");
      };
      interpolator$1.hsl = hsl;
      var interpolate_hsx$1 = _hsx;
      var hsv = function(col1, col2, f4) {
        return interpolate_hsx$1(col1, col2, f4, "hsv");
      };
      interpolator$1.hsv = hsv;
      var Color$7 = Color_1;
      var oklab = function(col1, col2, f4) {
        var xyz0 = col1.oklab();
        var xyz1 = col2.oklab();
        return new Color$7(
          xyz0[0] + f4 * (xyz1[0] - xyz0[0]),
          xyz0[1] + f4 * (xyz1[1] - xyz0[1]),
          xyz0[2] + f4 * (xyz1[2] - xyz0[2]),
          "oklab"
        );
      };
      interpolator$1.oklab = oklab;
      var interpolate_hsx = _hsx;
      var oklch = function(col1, col2, f4) {
        return interpolate_hsx(col1, col2, f4, "oklch");
      };
      interpolator$1.oklch = oklch;
      var Color$6 = Color_1;
      var clip_rgb$1 = utils.clip_rgb;
      var pow$4 = Math.pow;
      var sqrt$1 = Math.sqrt;
      var PI$1 = Math.PI;
      var cos$2 = Math.cos;
      var sin$2 = Math.sin;
      var atan2$1 = Math.atan2;
      var average = function(colors, mode, weights) {
        if (mode === void 0)
          mode = "lrgb";
        if (weights === void 0)
          weights = null;
        var l5 = colors.length;
        if (!weights) {
          weights = Array.from(new Array(l5)).map(function() {
            return 1;
          });
        }
        var k2 = l5 / weights.reduce(function(a4, b3) {
          return a4 + b3;
        });
        weights.forEach(function(w2, i7) {
          weights[i7] *= k2;
        });
        colors = colors.map(function(c4) {
          return new Color$6(c4);
        });
        if (mode === "lrgb") {
          return _average_lrgb(colors, weights);
        }
        var first = colors.shift();
        var xyz = first.get(mode);
        var cnt = [];
        var dx = 0;
        var dy = 0;
        for (var i6 = 0; i6 < xyz.length; i6++) {
          xyz[i6] = (xyz[i6] || 0) * weights[0];
          cnt.push(isNaN(xyz[i6]) ? 0 : weights[0]);
          if (mode.charAt(i6) === "h" && !isNaN(xyz[i6])) {
            var A2 = xyz[i6] / 180 * PI$1;
            dx += cos$2(A2) * weights[0];
            dy += sin$2(A2) * weights[0];
          }
        }
        var alpha = first.alpha() * weights[0];
        colors.forEach(function(c4, ci) {
          var xyz2 = c4.get(mode);
          alpha += c4.alpha() * weights[ci + 1];
          for (var i7 = 0; i7 < xyz.length; i7++) {
            if (!isNaN(xyz2[i7])) {
              cnt[i7] += weights[ci + 1];
              if (mode.charAt(i7) === "h") {
                var A3 = xyz2[i7] / 180 * PI$1;
                dx += cos$2(A3) * weights[ci + 1];
                dy += sin$2(A3) * weights[ci + 1];
              } else {
                xyz[i7] += xyz2[i7] * weights[ci + 1];
              }
            }
          }
        });
        for (var i$12 = 0; i$12 < xyz.length; i$12++) {
          if (mode.charAt(i$12) === "h") {
            var A$1 = atan2$1(dy / cnt[i$12], dx / cnt[i$12]) / PI$1 * 180;
            while (A$1 < 0) {
              A$1 += 360;
            }
            while (A$1 >= 360) {
              A$1 -= 360;
            }
            xyz[i$12] = A$1;
          } else {
            xyz[i$12] = xyz[i$12] / cnt[i$12];
          }
        }
        alpha /= l5;
        return new Color$6(xyz, mode).alpha(alpha > 0.99999 ? 1 : alpha, true);
      };
      var _average_lrgb = function(colors, weights) {
        var l5 = colors.length;
        var xyz = [0, 0, 0, 0];
        for (var i6 = 0; i6 < colors.length; i6++) {
          var col = colors[i6];
          var f4 = weights[i6] / l5;
          var rgb2 = col._rgb;
          xyz[0] += pow$4(rgb2[0], 2) * f4;
          xyz[1] += pow$4(rgb2[1], 2) * f4;
          xyz[2] += pow$4(rgb2[2], 2) * f4;
          xyz[3] += rgb2[3] * f4;
        }
        xyz[0] = sqrt$1(xyz[0]);
        xyz[1] = sqrt$1(xyz[1]);
        xyz[2] = sqrt$1(xyz[2]);
        if (xyz[3] > 0.9999999) {
          xyz[3] = 1;
        }
        return new Color$6(clip_rgb$1(xyz));
      };
      var chroma$4 = chroma_1;
      var type$2 = utils.type;
      var pow$3 = Math.pow;
      var scale$2 = function(colors) {
        var _mode = "rgb";
        var _nacol = chroma$4("#ccc");
        var _spread = 0;
        var _domain = [0, 1];
        var _pos = [];
        var _padding = [0, 0];
        var _classes = false;
        var _colors = [];
        var _out = false;
        var _min = 0;
        var _max = 1;
        var _correctLightness = false;
        var _colorCache = {};
        var _useCache = true;
        var _gamma = 1;
        var setColors = function(colors2) {
          colors2 = colors2 || ["#fff", "#000"];
          if (colors2 && type$2(colors2) === "string" && chroma$4.brewer && chroma$4.brewer[colors2.toLowerCase()]) {
            colors2 = chroma$4.brewer[colors2.toLowerCase()];
          }
          if (type$2(colors2) === "array") {
            if (colors2.length === 1) {
              colors2 = [colors2[0], colors2[0]];
            }
            colors2 = colors2.slice(0);
            for (var c4 = 0; c4 < colors2.length; c4++) {
              colors2[c4] = chroma$4(colors2[c4]);
            }
            _pos.length = 0;
            for (var c$1 = 0; c$1 < colors2.length; c$1++) {
              _pos.push(c$1 / (colors2.length - 1));
            }
          }
          resetCache();
          return _colors = colors2;
        };
        var getClass = function(value) {
          if (_classes != null) {
            var n6 = _classes.length - 1;
            var i6 = 0;
            while (i6 < n6 && value >= _classes[i6]) {
              i6++;
            }
            return i6 - 1;
          }
          return 0;
        };
        var tMapLightness = function(t7) {
          return t7;
        };
        var tMapDomain = function(t7) {
          return t7;
        };
        var getColor2 = function(val, bypassMap) {
          var col, t7;
          if (bypassMap == null) {
            bypassMap = false;
          }
          if (isNaN(val) || val === null) {
            return _nacol;
          }
          if (!bypassMap) {
            if (_classes && _classes.length > 2) {
              var c4 = getClass(val);
              t7 = c4 / (_classes.length - 2);
            } else if (_max !== _min) {
              t7 = (val - _min) / (_max - _min);
            } else {
              t7 = 1;
            }
          } else {
            t7 = val;
          }
          t7 = tMapDomain(t7);
          if (!bypassMap) {
            t7 = tMapLightness(t7);
          }
          if (_gamma !== 1) {
            t7 = pow$3(t7, _gamma);
          }
          t7 = _padding[0] + t7 * (1 - _padding[0] - _padding[1]);
          t7 = Math.min(1, Math.max(0, t7));
          var k2 = Math.floor(t7 * 1e4);
          if (_useCache && _colorCache[k2]) {
            col = _colorCache[k2];
          } else {
            if (type$2(_colors) === "array") {
              for (var i6 = 0; i6 < _pos.length; i6++) {
                var p3 = _pos[i6];
                if (t7 <= p3) {
                  col = _colors[i6];
                  break;
                }
                if (t7 >= p3 && i6 === _pos.length - 1) {
                  col = _colors[i6];
                  break;
                }
                if (t7 > p3 && t7 < _pos[i6 + 1]) {
                  t7 = (t7 - p3) / (_pos[i6 + 1] - p3);
                  col = chroma$4.interpolate(_colors[i6], _colors[i6 + 1], t7, _mode);
                  break;
                }
              }
            } else if (type$2(_colors) === "function") {
              col = _colors(t7);
            }
            if (_useCache) {
              _colorCache[k2] = col;
            }
          }
          return col;
        };
        var resetCache = function() {
          return _colorCache = {};
        };
        setColors(colors);
        var f4 = function(v2) {
          var c4 = chroma$4(getColor2(v2));
          if (_out && c4[_out]) {
            return c4[_out]();
          } else {
            return c4;
          }
        };
        f4.classes = function(classes) {
          if (classes != null) {
            if (type$2(classes) === "array") {
              _classes = classes;
              _domain = [classes[0], classes[classes.length - 1]];
            } else {
              var d3 = chroma$4.analyze(_domain);
              if (classes === 0) {
                _classes = [d3.min, d3.max];
              } else {
                _classes = chroma$4.limits(d3, "e", classes);
              }
            }
            return f4;
          }
          return _classes;
        };
        f4.domain = function(domain) {
          if (!arguments.length) {
            return _domain;
          }
          _min = domain[0];
          _max = domain[domain.length - 1];
          _pos = [];
          var k2 = _colors.length;
          if (domain.length === k2 && _min !== _max) {
            for (var i6 = 0, list2 = Array.from(domain); i6 < list2.length; i6 += 1) {
              var d3 = list2[i6];
              _pos.push((d3 - _min) / (_max - _min));
            }
          } else {
            for (var c4 = 0; c4 < k2; c4++) {
              _pos.push(c4 / (k2 - 1));
            }
            if (domain.length > 2) {
              var tOut = domain.map(function(d4, i7) {
                return i7 / (domain.length - 1);
              });
              var tBreaks = domain.map(function(d4) {
                return (d4 - _min) / (_max - _min);
              });
              if (!tBreaks.every(function(val, i7) {
                return tOut[i7] === val;
              })) {
                tMapDomain = function(t7) {
                  if (t7 <= 0 || t7 >= 1) {
                    return t7;
                  }
                  var i7 = 0;
                  while (t7 >= tBreaks[i7 + 1]) {
                    i7++;
                  }
                  var f5 = (t7 - tBreaks[i7]) / (tBreaks[i7 + 1] - tBreaks[i7]);
                  var out = tOut[i7] + f5 * (tOut[i7 + 1] - tOut[i7]);
                  return out;
                };
              }
            }
          }
          _domain = [_min, _max];
          return f4;
        };
        f4.mode = function(_m) {
          if (!arguments.length) {
            return _mode;
          }
          _mode = _m;
          resetCache();
          return f4;
        };
        f4.range = function(colors2, _pos2) {
          setColors(colors2);
          return f4;
        };
        f4.out = function(_o) {
          _out = _o;
          return f4;
        };
        f4.spread = function(val) {
          if (!arguments.length) {
            return _spread;
          }
          _spread = val;
          return f4;
        };
        f4.correctLightness = function(v2) {
          if (v2 == null) {
            v2 = true;
          }
          _correctLightness = v2;
          resetCache();
          if (_correctLightness) {
            tMapLightness = function(t7) {
              var L0 = getColor2(0, true).lab()[0];
              var L1 = getColor2(1, true).lab()[0];
              var pol = L0 > L1;
              var L_actual = getColor2(t7, true).lab()[0];
              var L_ideal = L0 + (L1 - L0) * t7;
              var L_diff = L_actual - L_ideal;
              var t0 = 0;
              var t1 = 1;
              var max_iter = 20;
              while (Math.abs(L_diff) > 0.01 && max_iter-- > 0) {
                (function() {
                  if (pol) {
                    L_diff *= -1;
                  }
                  if (L_diff < 0) {
                    t0 = t7;
                    t7 += (t1 - t7) * 0.5;
                  } else {
                    t1 = t7;
                    t7 += (t0 - t7) * 0.5;
                  }
                  L_actual = getColor2(t7, true).lab()[0];
                  return L_diff = L_actual - L_ideal;
                })();
              }
              return t7;
            };
          } else {
            tMapLightness = function(t7) {
              return t7;
            };
          }
          return f4;
        };
        f4.padding = function(p3) {
          if (p3 != null) {
            if (type$2(p3) === "number") {
              p3 = [p3, p3];
            }
            _padding = p3;
            return f4;
          } else {
            return _padding;
          }
        };
        f4.colors = function(numColors, out) {
          if (arguments.length < 2) {
            out = "hex";
          }
          var result = [];
          if (arguments.length === 0) {
            result = _colors.slice(0);
          } else if (numColors === 1) {
            result = [f4(0.5)];
          } else if (numColors > 1) {
            var dm = _domain[0];
            var dd = _domain[1] - dm;
            result = __range__(0, numColors, false).map(function(i7) {
              return f4(dm + i7 / (numColors - 1) * dd);
            });
          } else {
            colors = [];
            var samples = [];
            if (_classes && _classes.length > 2) {
              for (var i6 = 1, end = _classes.length, asc = 1 <= end; asc ? i6 < end : i6 > end; asc ? i6++ : i6--) {
                samples.push((_classes[i6 - 1] + _classes[i6]) * 0.5);
              }
            } else {
              samples = _domain;
            }
            result = samples.map(function(v2) {
              return f4(v2);
            });
          }
          if (chroma$4[out]) {
            result = result.map(function(c4) {
              return c4[out]();
            });
          }
          return result;
        };
        f4.cache = function(c4) {
          if (c4 != null) {
            _useCache = c4;
            return f4;
          } else {
            return _useCache;
          }
        };
        f4.gamma = function(g2) {
          if (g2 != null) {
            _gamma = g2;
            return f4;
          } else {
            return _gamma;
          }
        };
        f4.nodata = function(d3) {
          if (d3 != null) {
            _nacol = chroma$4(d3);
            return f4;
          } else {
            return _nacol;
          }
        };
        return f4;
      };
      function __range__(left, right, inclusive) {
        var range = [];
        var ascending = left < right;
        var end = !inclusive ? right : ascending ? right + 1 : right - 1;
        for (var i6 = left; ascending ? i6 < end : i6 > end; ascending ? i6++ : i6--) {
          range.push(i6);
        }
        return range;
      }
      var Color$5 = Color_1;
      var scale$1 = scale$2;
      var binom_row = function(n6) {
        var row = [1, 1];
        for (var i6 = 1; i6 < n6; i6++) {
          var newrow = [1];
          for (var j2 = 1; j2 <= row.length; j2++) {
            newrow[j2] = (row[j2] || 0) + row[j2 - 1];
          }
          row = newrow;
        }
        return row;
      };
      var bezier = function(colors) {
        var assign, assign$1, assign$2;
        var I2, lab0, lab1, lab2;
        colors = colors.map(function(c4) {
          return new Color$5(c4);
        });
        if (colors.length === 2) {
          assign = colors.map(function(c4) {
            return c4.lab();
          }), lab0 = assign[0], lab1 = assign[1];
          I2 = function(t7) {
            var lab4 = [0, 1, 2].map(function(i6) {
              return lab0[i6] + t7 * (lab1[i6] - lab0[i6]);
            });
            return new Color$5(lab4, "lab");
          };
        } else if (colors.length === 3) {
          assign$1 = colors.map(function(c4) {
            return c4.lab();
          }), lab0 = assign$1[0], lab1 = assign$1[1], lab2 = assign$1[2];
          I2 = function(t7) {
            var lab4 = [0, 1, 2].map(function(i6) {
              return (1 - t7) * (1 - t7) * lab0[i6] + 2 * (1 - t7) * t7 * lab1[i6] + t7 * t7 * lab2[i6];
            });
            return new Color$5(lab4, "lab");
          };
        } else if (colors.length === 4) {
          var lab3;
          assign$2 = colors.map(function(c4) {
            return c4.lab();
          }), lab0 = assign$2[0], lab1 = assign$2[1], lab2 = assign$2[2], lab3 = assign$2[3];
          I2 = function(t7) {
            var lab4 = [0, 1, 2].map(function(i6) {
              return (1 - t7) * (1 - t7) * (1 - t7) * lab0[i6] + 3 * (1 - t7) * (1 - t7) * t7 * lab1[i6] + 3 * (1 - t7) * t7 * t7 * lab2[i6] + t7 * t7 * t7 * lab3[i6];
            });
            return new Color$5(lab4, "lab");
          };
        } else if (colors.length >= 5) {
          var labs, row, n6;
          labs = colors.map(function(c4) {
            return c4.lab();
          });
          n6 = colors.length - 1;
          row = binom_row(n6);
          I2 = function(t7) {
            var u5 = 1 - t7;
            var lab4 = [0, 1, 2].map(function(i6) {
              return labs.reduce(function(sum, el, j2) {
                return sum + row[j2] * Math.pow(u5, n6 - j2) * Math.pow(t7, j2) * el[i6];
              }, 0);
            });
            return new Color$5(lab4, "lab");
          };
        } else {
          throw new RangeError("No point in running bezier with only one color.");
        }
        return I2;
      };
      var bezier_1 = function(colors) {
        var f4 = bezier(colors);
        f4.scale = function() {
          return scale$1(f4);
        };
        return f4;
      };
      var chroma$3 = chroma_1;
      var blend = function(bottom, top, mode) {
        if (!blend[mode]) {
          throw new Error("unknown blend mode " + mode);
        }
        return blend[mode](bottom, top);
      };
      var blend_f = function(f4) {
        return function(bottom, top) {
          var c0 = chroma$3(top).rgb();
          var c1 = chroma$3(bottom).rgb();
          return chroma$3.rgb(f4(c0, c1));
        };
      };
      var each = function(f4) {
        return function(c0, c1) {
          var out = [];
          out[0] = f4(c0[0], c1[0]);
          out[1] = f4(c0[1], c1[1]);
          out[2] = f4(c0[2], c1[2]);
          return out;
        };
      };
      var normal = function(a4) {
        return a4;
      };
      var multiply = function(a4, b3) {
        return a4 * b3 / 255;
      };
      var darken = function(a4, b3) {
        return a4 > b3 ? b3 : a4;
      };
      var lighten = function(a4, b3) {
        return a4 > b3 ? a4 : b3;
      };
      var screen = function(a4, b3) {
        return 255 * (1 - (1 - a4 / 255) * (1 - b3 / 255));
      };
      var overlay = function(a4, b3) {
        return b3 < 128 ? 2 * a4 * b3 / 255 : 255 * (1 - 2 * (1 - a4 / 255) * (1 - b3 / 255));
      };
      var burn = function(a4, b3) {
        return 255 * (1 - (1 - b3 / 255) / (a4 / 255));
      };
      var dodge = function(a4, b3) {
        if (a4 === 255) {
          return 255;
        }
        a4 = 255 * (b3 / 255) / (1 - a4 / 255);
        return a4 > 255 ? 255 : a4;
      };
      blend.normal = blend_f(each(normal));
      blend.multiply = blend_f(each(multiply));
      blend.screen = blend_f(each(screen));
      blend.overlay = blend_f(each(overlay));
      blend.darken = blend_f(each(darken));
      blend.lighten = blend_f(each(lighten));
      blend.dodge = blend_f(each(dodge));
      blend.burn = blend_f(each(burn));
      var blend_1 = blend;
      var type$1 = utils.type;
      var clip_rgb = utils.clip_rgb;
      var TWOPI = utils.TWOPI;
      var pow$2 = Math.pow;
      var sin$1 = Math.sin;
      var cos$1 = Math.cos;
      var chroma$2 = chroma_1;
      var cubehelix = function(start, rotations, hue, gamma, lightness) {
        if (start === void 0)
          start = 300;
        if (rotations === void 0)
          rotations = -1.5;
        if (hue === void 0)
          hue = 1;
        if (gamma === void 0)
          gamma = 1;
        if (lightness === void 0)
          lightness = [0, 1];
        var dh = 0, dl;
        if (type$1(lightness) === "array") {
          dl = lightness[1] - lightness[0];
        } else {
          dl = 0;
          lightness = [lightness, lightness];
        }
        var f4 = function(fract) {
          var a4 = TWOPI * ((start + 120) / 360 + rotations * fract);
          var l5 = pow$2(lightness[0] + dl * fract, gamma);
          var h3 = dh !== 0 ? hue[0] + fract * dh : hue;
          var amp = h3 * l5 * (1 - l5) / 2;
          var cos_a = cos$1(a4);
          var sin_a = sin$1(a4);
          var r8 = l5 + amp * (-0.14861 * cos_a + 1.78277 * sin_a);
          var g2 = l5 + amp * (-0.29227 * cos_a - 0.90649 * sin_a);
          var b3 = l5 + amp * (1.97294 * cos_a);
          return chroma$2(clip_rgb([r8 * 255, g2 * 255, b3 * 255, 1]));
        };
        f4.start = function(s5) {
          if (s5 == null) {
            return start;
          }
          start = s5;
          return f4;
        };
        f4.rotations = function(r8) {
          if (r8 == null) {
            return rotations;
          }
          rotations = r8;
          return f4;
        };
        f4.gamma = function(g2) {
          if (g2 == null) {
            return gamma;
          }
          gamma = g2;
          return f4;
        };
        f4.hue = function(h3) {
          if (h3 == null) {
            return hue;
          }
          hue = h3;
          if (type$1(hue) === "array") {
            dh = hue[1] - hue[0];
            if (dh === 0) {
              hue = hue[1];
            }
          } else {
            dh = 0;
          }
          return f4;
        };
        f4.lightness = function(h3) {
          if (h3 == null) {
            return lightness;
          }
          if (type$1(h3) === "array") {
            lightness = h3;
            dl = h3[1] - h3[0];
          } else {
            lightness = [h3, h3];
            dl = 0;
          }
          return f4;
        };
        f4.scale = function() {
          return chroma$2.scale(f4);
        };
        f4.hue(hue);
        return f4;
      };
      var Color$4 = Color_1;
      var digits = "0123456789abcdef";
      var floor$1 = Math.floor;
      var random = Math.random;
      var random_1 = function() {
        var code = "#";
        for (var i6 = 0; i6 < 6; i6++) {
          code += digits.charAt(floor$1(random() * 16));
        }
        return new Color$4(code, "hex");
      };
      var type = type$p;
      var log = Math.log;
      var pow$1 = Math.pow;
      var floor2 = Math.floor;
      var abs$1 = Math.abs;
      var analyze = function(data, key2) {
        if (key2 === void 0)
          key2 = null;
        var r8 = {
          min: Number.MAX_VALUE,
          max: Number.MAX_VALUE * -1,
          sum: 0,
          values: [],
          count: 0
        };
        if (type(data) === "object") {
          data = Object.values(data);
        }
        data.forEach(function(val) {
          if (key2 && type(val) === "object") {
            val = val[key2];
          }
          if (val !== void 0 && val !== null && !isNaN(val)) {
            r8.values.push(val);
            r8.sum += val;
            if (val < r8.min) {
              r8.min = val;
            }
            if (val > r8.max) {
              r8.max = val;
            }
            r8.count += 1;
          }
        });
        r8.domain = [r8.min, r8.max];
        r8.limits = function(mode, num2) {
          return limits(r8, mode, num2);
        };
        return r8;
      };
      var limits = function(data, mode, num2) {
        if (mode === void 0)
          mode = "equal";
        if (num2 === void 0)
          num2 = 7;
        if (type(data) == "array") {
          data = analyze(data);
        }
        var min3 = data.min;
        var max3 = data.max;
        var values = data.values.sort(function(a4, b3) {
          return a4 - b3;
        });
        if (num2 === 1) {
          return [min3, max3];
        }
        var limits2 = [];
        if (mode.substr(0, 1) === "c") {
          limits2.push(min3);
          limits2.push(max3);
        }
        if (mode.substr(0, 1) === "e") {
          limits2.push(min3);
          for (var i6 = 1; i6 < num2; i6++) {
            limits2.push(min3 + i6 / num2 * (max3 - min3));
          }
          limits2.push(max3);
        } else if (mode.substr(0, 1) === "l") {
          if (min3 <= 0) {
            throw new Error("Logarithmic scales are only possible for values > 0");
          }
          var min_log = Math.LOG10E * log(min3);
          var max_log = Math.LOG10E * log(max3);
          limits2.push(min3);
          for (var i$12 = 1; i$12 < num2; i$12++) {
            limits2.push(pow$1(10, min_log + i$12 / num2 * (max_log - min_log)));
          }
          limits2.push(max3);
        } else if (mode.substr(0, 1) === "q") {
          limits2.push(min3);
          for (var i$2 = 1; i$2 < num2; i$2++) {
            var p3 = (values.length - 1) * i$2 / num2;
            var pb = floor2(p3);
            if (pb === p3) {
              limits2.push(values[pb]);
            } else {
              var pr = p3 - pb;
              limits2.push(values[pb] * (1 - pr) + values[pb + 1] * pr);
            }
          }
          limits2.push(max3);
        } else if (mode.substr(0, 1) === "k") {
          var cluster;
          var n6 = values.length;
          var assignments = new Array(n6);
          var clusterSizes = new Array(num2);
          var repeat = true;
          var nb_iters = 0;
          var centroids = null;
          centroids = [];
          centroids.push(min3);
          for (var i$3 = 1; i$3 < num2; i$3++) {
            centroids.push(min3 + i$3 / num2 * (max3 - min3));
          }
          centroids.push(max3);
          while (repeat) {
            for (var j2 = 0; j2 < num2; j2++) {
              clusterSizes[j2] = 0;
            }
            for (var i$4 = 0; i$4 < n6; i$4++) {
              var value = values[i$4];
              var mindist = Number.MAX_VALUE;
              var best = void 0;
              for (var j$1 = 0; j$1 < num2; j$1++) {
                var dist = abs$1(centroids[j$1] - value);
                if (dist < mindist) {
                  mindist = dist;
                  best = j$1;
                }
                clusterSizes[best]++;
                assignments[i$4] = best;
              }
            }
            var newCentroids = new Array(num2);
            for (var j$2 = 0; j$2 < num2; j$2++) {
              newCentroids[j$2] = null;
            }
            for (var i$5 = 0; i$5 < n6; i$5++) {
              cluster = assignments[i$5];
              if (newCentroids[cluster] === null) {
                newCentroids[cluster] = values[i$5];
              } else {
                newCentroids[cluster] += values[i$5];
              }
            }
            for (var j$3 = 0; j$3 < num2; j$3++) {
              newCentroids[j$3] *= 1 / clusterSizes[j$3];
            }
            repeat = false;
            for (var j$4 = 0; j$4 < num2; j$4++) {
              if (newCentroids[j$4] !== centroids[j$4]) {
                repeat = true;
                break;
              }
            }
            centroids = newCentroids;
            nb_iters++;
            if (nb_iters > 200) {
              repeat = false;
            }
          }
          var kClusters = {};
          for (var j$5 = 0; j$5 < num2; j$5++) {
            kClusters[j$5] = [];
          }
          for (var i$6 = 0; i$6 < n6; i$6++) {
            cluster = assignments[i$6];
            kClusters[cluster].push(values[i$6]);
          }
          var tmpKMeansBreaks = [];
          for (var j$6 = 0; j$6 < num2; j$6++) {
            tmpKMeansBreaks.push(kClusters[j$6][0]);
            tmpKMeansBreaks.push(kClusters[j$6][kClusters[j$6].length - 1]);
          }
          tmpKMeansBreaks = tmpKMeansBreaks.sort(function(a4, b3) {
            return a4 - b3;
          });
          limits2.push(tmpKMeansBreaks[0]);
          for (var i$7 = 1; i$7 < tmpKMeansBreaks.length; i$7 += 2) {
            var v2 = tmpKMeansBreaks[i$7];
            if (!isNaN(v2) && limits2.indexOf(v2) === -1) {
              limits2.push(v2);
            }
          }
        }
        return limits2;
      };
      var analyze_1 = { analyze, limits };
      var Color$3 = Color_1;
      var contrast = function(a4, b3) {
        a4 = new Color$3(a4);
        b3 = new Color$3(b3);
        var l1 = a4.luminance();
        var l22 = b3.luminance();
        return l1 > l22 ? (l1 + 0.05) / (l22 + 0.05) : (l22 + 0.05) / (l1 + 0.05);
      };
      var Color$2 = Color_1;
      var sqrt = Math.sqrt;
      var pow = Math.pow;
      var min2 = Math.min;
      var max2 = Math.max;
      var atan2 = Math.atan2;
      var abs = Math.abs;
      var cos = Math.cos;
      var sin = Math.sin;
      var exp = Math.exp;
      var PI = Math.PI;
      var deltaE = function(a4, b3, Kl, Kc, Kh) {
        if (Kl === void 0)
          Kl = 1;
        if (Kc === void 0)
          Kc = 1;
        if (Kh === void 0)
          Kh = 1;
        var rad2deg = function(rad) {
          return 360 * rad / (2 * PI);
        };
        var deg2rad = function(deg) {
          return 2 * PI * deg / 360;
        };
        a4 = new Color$2(a4);
        b3 = new Color$2(b3);
        var ref = Array.from(a4.lab());
        var L1 = ref[0];
        var a1 = ref[1];
        var b1 = ref[2];
        var ref$1 = Array.from(b3.lab());
        var L2 = ref$1[0];
        var a22 = ref$1[1];
        var b22 = ref$1[2];
        var avgL = (L1 + L2) / 2;
        var C1 = sqrt(pow(a1, 2) + pow(b1, 2));
        var C2 = sqrt(pow(a22, 2) + pow(b22, 2));
        var avgC = (C1 + C2) / 2;
        var G = 0.5 * (1 - sqrt(pow(avgC, 7) / (pow(avgC, 7) + pow(25, 7))));
        var a1p = a1 * (1 + G);
        var a2p = a22 * (1 + G);
        var C1p = sqrt(pow(a1p, 2) + pow(b1, 2));
        var C2p = sqrt(pow(a2p, 2) + pow(b22, 2));
        var avgCp = (C1p + C2p) / 2;
        var arctan1 = rad2deg(atan2(b1, a1p));
        var arctan2 = rad2deg(atan2(b22, a2p));
        var h1p = arctan1 >= 0 ? arctan1 : arctan1 + 360;
        var h2p = arctan2 >= 0 ? arctan2 : arctan2 + 360;
        var avgHp = abs(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h2p) / 2;
        var T2 = 1 - 0.17 * cos(deg2rad(avgHp - 30)) + 0.24 * cos(deg2rad(2 * avgHp)) + 0.32 * cos(deg2rad(3 * avgHp + 6)) - 0.2 * cos(deg2rad(4 * avgHp - 63));
        var deltaHp = h2p - h1p;
        deltaHp = abs(deltaHp) <= 180 ? deltaHp : h2p <= h1p ? deltaHp + 360 : deltaHp - 360;
        deltaHp = 2 * sqrt(C1p * C2p) * sin(deg2rad(deltaHp) / 2);
        var deltaL = L2 - L1;
        var deltaCp = C2p - C1p;
        var sl = 1 + 0.015 * pow(avgL - 50, 2) / sqrt(20 + pow(avgL - 50, 2));
        var sc = 1 + 0.045 * avgCp;
        var sh = 1 + 0.015 * avgCp * T2;
        var deltaTheta = 30 * exp(-pow((avgHp - 275) / 25, 2));
        var Rc = 2 * sqrt(pow(avgCp, 7) / (pow(avgCp, 7) + pow(25, 7)));
        var Rt = -Rc * sin(2 * deg2rad(deltaTheta));
        var result = sqrt(pow(deltaL / (Kl * sl), 2) + pow(deltaCp / (Kc * sc), 2) + pow(deltaHp / (Kh * sh), 2) + Rt * (deltaCp / (Kc * sc)) * (deltaHp / (Kh * sh)));
        return max2(0, min2(100, result));
      };
      var Color$1 = Color_1;
      var distance = function(a4, b3, mode) {
        if (mode === void 0)
          mode = "lab";
        a4 = new Color$1(a4);
        b3 = new Color$1(b3);
        var l1 = a4.get(mode);
        var l22 = b3.get(mode);
        var sum_sq = 0;
        for (var i6 in l1) {
          var d3 = (l1[i6] || 0) - (l22[i6] || 0);
          sum_sq += d3 * d3;
        }
        return Math.sqrt(sum_sq);
      };
      var Color = Color_1;
      var valid = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        try {
          new (Function.prototype.bind.apply(Color, [null].concat(args)))();
          return true;
        } catch (e11) {
          return false;
        }
      };
      var chroma$1 = chroma_1;
      var scale = scale$2;
      var scales = {
        cool: function cool() {
          return scale([chroma$1.hsl(180, 1, 0.9), chroma$1.hsl(250, 0.7, 0.4)]);
        },
        hot: function hot() {
          return scale(["#000", "#f00", "#ff0", "#fff"]).mode("rgb");
        }
      };
      var colorbrewer = {
        // sequential
        OrRd: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"],
        PuBu: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"],
        BuPu: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"],
        Oranges: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"],
        BuGn: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b"],
        YlOrBr: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"],
        YlGn: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"],
        Reds: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"],
        RdPu: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"],
        Greens: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"],
        YlGnBu: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"],
        Purples: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"],
        GnBu: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"],
        Greys: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"],
        YlOrRd: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"],
        PuRd: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"],
        Blues: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"],
        PuBuGn: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"],
        Viridis: ["#440154", "#482777", "#3f4a8a", "#31678e", "#26838f", "#1f9d8a", "#6cce5a", "#b6de2b", "#fee825"],
        // diverging
        Spectral: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"],
        RdYlGn: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"],
        RdBu: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"],
        PiYG: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"],
        PRGn: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"],
        RdYlBu: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"],
        BrBG: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"],
        RdGy: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"],
        PuOr: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"],
        // qualitative
        Set2: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"],
        Accent: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666"],
        Set1: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"],
        Set3: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"],
        Dark2: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"],
        Paired: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"],
        Pastel2: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc"],
        Pastel1: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"]
      };
      for (var i5 = 0, list = Object.keys(colorbrewer); i5 < list.length; i5 += 1) {
        var key = list[i5];
        colorbrewer[key.toLowerCase()] = colorbrewer[key];
      }
      var colorbrewer_1 = colorbrewer;
      var chroma2 = chroma_1;
      chroma2.average = average;
      chroma2.bezier = bezier_1;
      chroma2.blend = blend_1;
      chroma2.cubehelix = cubehelix;
      chroma2.mix = chroma2.interpolate = mix$1;
      chroma2.random = random_1;
      chroma2.scale = scale$2;
      chroma2.analyze = analyze_1.analyze;
      chroma2.contrast = contrast;
      chroma2.deltaE = deltaE;
      chroma2.distance = distance;
      chroma2.limits = analyze_1.limits;
      chroma2.valid = valid;
      chroma2.scales = scales;
      chroma2.colors = w3cx11_1;
      chroma2.brewer = colorbrewer_1;
      var chroma_js = chroma2;
      return chroma_js;
    });
  }
});

// ../../../node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t7, e11, o9) {
    if (this._$cssResult$ = true, o9 !== s)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t7, this.t = e11;
  }
  get styleSheet() {
    let t7 = this.o;
    const s5 = this.t;
    if (e && void 0 === t7) {
      const e11 = void 0 !== s5 && 1 === s5.length;
      e11 && (t7 = o.get(s5)), void 0 === t7 && ((this.o = t7 = new CSSStyleSheet()).replaceSync(this.cssText), e11 && o.set(s5, t7));
    }
    return t7;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t7) => new n("string" == typeof t7 ? t7 : t7 + "", void 0, s);
var i = (t7, ...e11) => {
  const o9 = 1 === t7.length ? t7[0] : e11.reduce((e12, s5, o10) => e12 + ((t8) => {
    if (true === t8._$cssResult$)
      return t8.cssText;
    if ("number" == typeof t8)
      return t8;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t8 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s5) + t7[o10 + 1], t7[0]);
  return new n(o9, t7, s);
};
var S = (s5, o9) => {
  if (e)
    s5.adoptedStyleSheets = o9.map((t7) => t7 instanceof CSSStyleSheet ? t7 : t7.styleSheet);
  else
    for (const e11 of o9) {
      const o10 = document.createElement("style"), n6 = t.litNonce;
      void 0 !== n6 && o10.setAttribute("nonce", n6), o10.textContent = e11.cssText, s5.appendChild(o10);
    }
};
var c = e ? (t7) => t7 : (t7) => t7 instanceof CSSStyleSheet ? ((t8) => {
  let e11 = "";
  for (const s5 of t8.cssRules)
    e11 += s5.cssText;
  return r(e11);
})(t7) : t7;

// ../../../node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: r2, getOwnPropertyNames: h, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t7, s5) => t7;
var u = { toAttribute(t7, s5) {
  switch (s5) {
    case Boolean:
      t7 = t7 ? l : null;
      break;
    case Object:
    case Array:
      t7 = null == t7 ? t7 : JSON.stringify(t7);
  }
  return t7;
}, fromAttribute(t7, s5) {
  let i5 = t7;
  switch (s5) {
    case Boolean:
      i5 = null !== t7;
      break;
    case Number:
      i5 = null === t7 ? null : Number(t7);
      break;
    case Object:
    case Array:
      try {
        i5 = JSON.parse(t7);
      } catch (t8) {
        i5 = null;
      }
  }
  return i5;
} };
var f = (t7, s5) => !i2(t7, s5);
var y = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var b = class extends HTMLElement {
  static addInitializer(t7) {
    this._$Ei(), (this.l ??= []).push(t7);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t7, s5 = y) {
    if (s5.state && (s5.attribute = false), this._$Ei(), this.elementProperties.set(t7, s5), !s5.noAccessor) {
      const i5 = Symbol(), r8 = this.getPropertyDescriptor(t7, i5, s5);
      void 0 !== r8 && e2(this.prototype, t7, r8);
    }
  }
  static getPropertyDescriptor(t7, s5, i5) {
    const { get: e11, set: h3 } = r2(this.prototype, t7) ?? { get() {
      return this[s5];
    }, set(t8) {
      this[s5] = t8;
    } };
    return { get() {
      return e11?.call(this);
    }, set(s6) {
      const r8 = e11?.call(this);
      h3.call(this, s6), this.requestUpdate(t7, r8, i5);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t7) {
    return this.elementProperties.get(t7) ?? y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties")))
      return;
    const t7 = n2(this);
    t7.finalize(), void 0 !== t7.l && (this.l = [...t7.l]), this.elementProperties = new Map(t7.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized")))
      return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t8 = this.properties, s5 = [...h(t8), ...o2(t8)];
      for (const i5 of s5)
        this.createProperty(i5, t8[i5]);
    }
    const t7 = this[Symbol.metadata];
    if (null !== t7) {
      const s5 = litPropertyMetadata.get(t7);
      if (void 0 !== s5)
        for (const [t8, i5] of s5)
          this.elementProperties.set(t8, i5);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t8, s5] of this.elementProperties) {
      const i5 = this._$Eu(t8, s5);
      void 0 !== i5 && this._$Eh.set(i5, t8);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s5) {
    const i5 = [];
    if (Array.isArray(s5)) {
      const e11 = new Set(s5.flat(1 / 0).reverse());
      for (const s6 of e11)
        i5.unshift(c(s6));
    } else
      void 0 !== s5 && i5.push(c(s5));
    return i5;
  }
  static _$Eu(t7, s5) {
    const i5 = s5.attribute;
    return false === i5 ? void 0 : "string" == typeof i5 ? i5 : "string" == typeof t7 ? t7.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t7) => this.enableUpdating = t7), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t7) => t7(this));
  }
  addController(t7) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t7), void 0 !== this.renderRoot && this.isConnected && t7.hostConnected?.();
  }
  removeController(t7) {
    this._$EO?.delete(t7);
  }
  _$E_() {
    const t7 = /* @__PURE__ */ new Map(), s5 = this.constructor.elementProperties;
    for (const i5 of s5.keys())
      this.hasOwnProperty(i5) && (t7.set(i5, this[i5]), delete this[i5]);
    t7.size > 0 && (this._$Ep = t7);
  }
  createRenderRoot() {
    const t7 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t7, this.constructor.elementStyles), t7;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t7) => t7.hostConnected?.());
  }
  enableUpdating(t7) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t7) => t7.hostDisconnected?.());
  }
  attributeChangedCallback(t7, s5, i5) {
    this._$AK(t7, i5);
  }
  _$EC(t7, s5) {
    const i5 = this.constructor.elementProperties.get(t7), e11 = this.constructor._$Eu(t7, i5);
    if (void 0 !== e11 && true === i5.reflect) {
      const r8 = (void 0 !== i5.converter?.toAttribute ? i5.converter : u).toAttribute(s5, i5.type);
      this._$Em = t7, null == r8 ? this.removeAttribute(e11) : this.setAttribute(e11, r8), this._$Em = null;
    }
  }
  _$AK(t7, s5) {
    const i5 = this.constructor, e11 = i5._$Eh.get(t7);
    if (void 0 !== e11 && this._$Em !== e11) {
      const t8 = i5.getPropertyOptions(e11), r8 = "function" == typeof t8.converter ? { fromAttribute: t8.converter } : void 0 !== t8.converter?.fromAttribute ? t8.converter : u;
      this._$Em = e11, this[e11] = r8.fromAttribute(s5, t8.type), this._$Em = null;
    }
  }
  requestUpdate(t7, s5, i5) {
    if (void 0 !== t7) {
      if (i5 ??= this.constructor.getPropertyOptions(t7), !(i5.hasChanged ?? f)(this[t7], s5))
        return;
      this.P(t7, s5, i5);
    }
    false === this.isUpdatePending && (this._$ES = this._$ET());
  }
  P(t7, s5, i5) {
    this._$AL.has(t7) || this._$AL.set(t7, s5), true === i5.reflect && this._$Em !== t7 && (this._$Ej ??= /* @__PURE__ */ new Set()).add(t7);
  }
  async _$ET() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t8) {
      Promise.reject(t8);
    }
    const t7 = this.scheduleUpdate();
    return null != t7 && await t7, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [t9, s6] of this._$Ep)
          this[t9] = s6;
        this._$Ep = void 0;
      }
      const t8 = this.constructor.elementProperties;
      if (t8.size > 0)
        for (const [s6, i5] of t8)
          true !== i5.wrapped || this._$AL.has(s6) || void 0 === this[s6] || this.P(s6, this[s6], i5);
    }
    let t7 = false;
    const s5 = this._$AL;
    try {
      t7 = this.shouldUpdate(s5), t7 ? (this.willUpdate(s5), this._$EO?.forEach((t8) => t8.hostUpdate?.()), this.update(s5)) : this._$EU();
    } catch (s6) {
      throw t7 = false, this._$EU(), s6;
    }
    t7 && this._$AE(s5);
  }
  willUpdate(t7) {
  }
  _$AE(t7) {
    this._$EO?.forEach((t8) => t8.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t7)), this.updated(t7);
  }
  _$EU() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t7) {
    return true;
  }
  update(t7) {
    this._$Ej &&= this._$Ej.forEach((t8) => this._$EC(t8, this[t8])), this._$EU();
  }
  updated(t7) {
  }
  firstUpdated(t7) {
  }
};
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[d("elementProperties")] = /* @__PURE__ */ new Map(), b[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: b }), (a.reactiveElementVersions ??= []).push("2.0.4");

// ../../../node_modules/.pnpm/lit-html@3.1.3/node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = t2.trustedTypes;
var s2 = i3 ? i3.createPolicy("lit-html", { createHTML: (t7) => t7 }) : void 0;
var e3 = "$lit$";
var h2 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var o3 = "?" + h2;
var n3 = `<${o3}>`;
var r3 = document;
var l2 = () => r3.createComment("");
var c3 = (t7) => null === t7 || "object" != typeof t7 && "function" != typeof t7;
var a2 = Array.isArray;
var u2 = (t7) => a2(t7) || "function" == typeof t7?.[Symbol.iterator];
var d2 = "[ 	\n\f\r]";
var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var v = /-->/g;
var _ = />/g;
var m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var p2 = /'/g;
var g = /"/g;
var $ = /^(?:script|style|textarea|title)$/i;
var y2 = (t7) => (i5, ...s5) => ({ _$litType$: t7, strings: i5, values: s5 });
var x = y2(1);
var b2 = y2(2);
var w = Symbol.for("lit-noChange");
var T = Symbol.for("lit-nothing");
var A = /* @__PURE__ */ new WeakMap();
var E = r3.createTreeWalker(r3, 129);
function C(t7, i5) {
  if (!Array.isArray(t7) || !t7.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return void 0 !== s2 ? s2.createHTML(i5) : i5;
}
var P = (t7, i5) => {
  const s5 = t7.length - 1, o9 = [];
  let r8, l5 = 2 === i5 ? "<svg>" : "", c4 = f2;
  for (let i6 = 0; i6 < s5; i6++) {
    const s6 = t7[i6];
    let a4, u5, d3 = -1, y3 = 0;
    for (; y3 < s6.length && (c4.lastIndex = y3, u5 = c4.exec(s6), null !== u5); )
      y3 = c4.lastIndex, c4 === f2 ? "!--" === u5[1] ? c4 = v : void 0 !== u5[1] ? c4 = _ : void 0 !== u5[2] ? ($.test(u5[2]) && (r8 = RegExp("</" + u5[2], "g")), c4 = m) : void 0 !== u5[3] && (c4 = m) : c4 === m ? ">" === u5[0] ? (c4 = r8 ?? f2, d3 = -1) : void 0 === u5[1] ? d3 = -2 : (d3 = c4.lastIndex - u5[2].length, a4 = u5[1], c4 = void 0 === u5[3] ? m : '"' === u5[3] ? g : p2) : c4 === g || c4 === p2 ? c4 = m : c4 === v || c4 === _ ? c4 = f2 : (c4 = m, r8 = void 0);
    const x2 = c4 === m && t7[i6 + 1].startsWith("/>") ? " " : "";
    l5 += c4 === f2 ? s6 + n3 : d3 >= 0 ? (o9.push(a4), s6.slice(0, d3) + e3 + s6.slice(d3) + h2 + x2) : s6 + h2 + (-2 === d3 ? i6 : x2);
  }
  return [C(t7, l5 + (t7[s5] || "<?>") + (2 === i5 ? "</svg>" : "")), o9];
};
var V = class _V {
  constructor({ strings: t7, _$litType$: s5 }, n6) {
    let r8;
    this.parts = [];
    let c4 = 0, a4 = 0;
    const u5 = t7.length - 1, d3 = this.parts, [f4, v2] = P(t7, s5);
    if (this.el = _V.createElement(f4, n6), E.currentNode = this.el.content, 2 === s5) {
      const t8 = this.el.content.firstChild;
      t8.replaceWith(...t8.childNodes);
    }
    for (; null !== (r8 = E.nextNode()) && d3.length < u5; ) {
      if (1 === r8.nodeType) {
        if (r8.hasAttributes())
          for (const t8 of r8.getAttributeNames())
            if (t8.endsWith(e3)) {
              const i5 = v2[a4++], s6 = r8.getAttribute(t8).split(h2), e11 = /([.?@])?(.*)/.exec(i5);
              d3.push({ type: 1, index: c4, name: e11[2], strings: s6, ctor: "." === e11[1] ? k : "?" === e11[1] ? H : "@" === e11[1] ? I : R }), r8.removeAttribute(t8);
            } else
              t8.startsWith(h2) && (d3.push({ type: 6, index: c4 }), r8.removeAttribute(t8));
        if ($.test(r8.tagName)) {
          const t8 = r8.textContent.split(h2), s6 = t8.length - 1;
          if (s6 > 0) {
            r8.textContent = i3 ? i3.emptyScript : "";
            for (let i5 = 0; i5 < s6; i5++)
              r8.append(t8[i5], l2()), E.nextNode(), d3.push({ type: 2, index: ++c4 });
            r8.append(t8[s6], l2());
          }
        }
      } else if (8 === r8.nodeType)
        if (r8.data === o3)
          d3.push({ type: 2, index: c4 });
        else {
          let t8 = -1;
          for (; -1 !== (t8 = r8.data.indexOf(h2, t8 + 1)); )
            d3.push({ type: 7, index: c4 }), t8 += h2.length - 1;
        }
      c4++;
    }
  }
  static createElement(t7, i5) {
    const s5 = r3.createElement("template");
    return s5.innerHTML = t7, s5;
  }
};
function N(t7, i5, s5 = t7, e11) {
  if (i5 === w)
    return i5;
  let h3 = void 0 !== e11 ? s5._$Co?.[e11] : s5._$Cl;
  const o9 = c3(i5) ? void 0 : i5._$litDirective$;
  return h3?.constructor !== o9 && (h3?._$AO?.(false), void 0 === o9 ? h3 = void 0 : (h3 = new o9(t7), h3._$AT(t7, s5, e11)), void 0 !== e11 ? (s5._$Co ??= [])[e11] = h3 : s5._$Cl = h3), void 0 !== h3 && (i5 = N(t7, h3._$AS(t7, i5.values), h3, e11)), i5;
}
var S2 = class {
  constructor(t7, i5) {
    this._$AV = [], this._$AN = void 0, this._$AD = t7, this._$AM = i5;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t7) {
    const { el: { content: i5 }, parts: s5 } = this._$AD, e11 = (t7?.creationScope ?? r3).importNode(i5, true);
    E.currentNode = e11;
    let h3 = E.nextNode(), o9 = 0, n6 = 0, l5 = s5[0];
    for (; void 0 !== l5; ) {
      if (o9 === l5.index) {
        let i6;
        2 === l5.type ? i6 = new M(h3, h3.nextSibling, this, t7) : 1 === l5.type ? i6 = new l5.ctor(h3, l5.name, l5.strings, this, t7) : 6 === l5.type && (i6 = new L(h3, this, t7)), this._$AV.push(i6), l5 = s5[++n6];
      }
      o9 !== l5?.index && (h3 = E.nextNode(), o9++);
    }
    return E.currentNode = r3, e11;
  }
  p(t7) {
    let i5 = 0;
    for (const s5 of this._$AV)
      void 0 !== s5 && (void 0 !== s5.strings ? (s5._$AI(t7, s5, i5), i5 += s5.strings.length - 2) : s5._$AI(t7[i5])), i5++;
  }
};
var M = class _M {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t7, i5, s5, e11) {
    this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = t7, this._$AB = i5, this._$AM = s5, this.options = e11, this._$Cv = e11?.isConnected ?? true;
  }
  get parentNode() {
    let t7 = this._$AA.parentNode;
    const i5 = this._$AM;
    return void 0 !== i5 && 11 === t7?.nodeType && (t7 = i5.parentNode), t7;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t7, i5 = this) {
    t7 = N(this, t7, i5), c3(t7) ? t7 === T || null == t7 || "" === t7 ? (this._$AH !== T && this._$AR(), this._$AH = T) : t7 !== this._$AH && t7 !== w && this._(t7) : void 0 !== t7._$litType$ ? this.$(t7) : void 0 !== t7.nodeType ? this.T(t7) : u2(t7) ? this.k(t7) : this._(t7);
  }
  S(t7) {
    return this._$AA.parentNode.insertBefore(t7, this._$AB);
  }
  T(t7) {
    this._$AH !== t7 && (this._$AR(), this._$AH = this.S(t7));
  }
  _(t7) {
    this._$AH !== T && c3(this._$AH) ? this._$AA.nextSibling.data = t7 : this.T(r3.createTextNode(t7)), this._$AH = t7;
  }
  $(t7) {
    const { values: i5, _$litType$: s5 } = t7, e11 = "number" == typeof s5 ? this._$AC(t7) : (void 0 === s5.el && (s5.el = V.createElement(C(s5.h, s5.h[0]), this.options)), s5);
    if (this._$AH?._$AD === e11)
      this._$AH.p(i5);
    else {
      const t8 = new S2(e11, this), s6 = t8.u(this.options);
      t8.p(i5), this.T(s6), this._$AH = t8;
    }
  }
  _$AC(t7) {
    let i5 = A.get(t7.strings);
    return void 0 === i5 && A.set(t7.strings, i5 = new V(t7)), i5;
  }
  k(t7) {
    a2(this._$AH) || (this._$AH = [], this._$AR());
    const i5 = this._$AH;
    let s5, e11 = 0;
    for (const h3 of t7)
      e11 === i5.length ? i5.push(s5 = new _M(this.S(l2()), this.S(l2()), this, this.options)) : s5 = i5[e11], s5._$AI(h3), e11++;
    e11 < i5.length && (this._$AR(s5 && s5._$AB.nextSibling, e11), i5.length = e11);
  }
  _$AR(t7 = this._$AA.nextSibling, i5) {
    for (this._$AP?.(false, true, i5); t7 && t7 !== this._$AB; ) {
      const i6 = t7.nextSibling;
      t7.remove(), t7 = i6;
    }
  }
  setConnected(t7) {
    void 0 === this._$AM && (this._$Cv = t7, this._$AP?.(t7));
  }
};
var R = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t7, i5, s5, e11, h3) {
    this.type = 1, this._$AH = T, this._$AN = void 0, this.element = t7, this.name = i5, this._$AM = e11, this.options = h3, s5.length > 2 || "" !== s5[0] || "" !== s5[1] ? (this._$AH = Array(s5.length - 1).fill(new String()), this.strings = s5) : this._$AH = T;
  }
  _$AI(t7, i5 = this, s5, e11) {
    const h3 = this.strings;
    let o9 = false;
    if (void 0 === h3)
      t7 = N(this, t7, i5, 0), o9 = !c3(t7) || t7 !== this._$AH && t7 !== w, o9 && (this._$AH = t7);
    else {
      const e12 = t7;
      let n6, r8;
      for (t7 = h3[0], n6 = 0; n6 < h3.length - 1; n6++)
        r8 = N(this, e12[s5 + n6], i5, n6), r8 === w && (r8 = this._$AH[n6]), o9 ||= !c3(r8) || r8 !== this._$AH[n6], r8 === T ? t7 = T : t7 !== T && (t7 += (r8 ?? "") + h3[n6 + 1]), this._$AH[n6] = r8;
    }
    o9 && !e11 && this.j(t7);
  }
  j(t7) {
    t7 === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t7 ?? "");
  }
};
var k = class extends R {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t7) {
    this.element[this.name] = t7 === T ? void 0 : t7;
  }
};
var H = class extends R {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t7) {
    this.element.toggleAttribute(this.name, !!t7 && t7 !== T);
  }
};
var I = class extends R {
  constructor(t7, i5, s5, e11, h3) {
    super(t7, i5, s5, e11, h3), this.type = 5;
  }
  _$AI(t7, i5 = this) {
    if ((t7 = N(this, t7, i5, 0) ?? T) === w)
      return;
    const s5 = this._$AH, e11 = t7 === T && s5 !== T || t7.capture !== s5.capture || t7.once !== s5.once || t7.passive !== s5.passive, h3 = t7 !== T && (s5 === T || e11);
    e11 && this.element.removeEventListener(this.name, this, s5), h3 && this.element.addEventListener(this.name, this, t7), this._$AH = t7;
  }
  handleEvent(t7) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t7) : this._$AH.handleEvent(t7);
  }
};
var L = class {
  constructor(t7, i5, s5) {
    this.element = t7, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s5;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t7) {
    N(this, t7);
  }
};
var z = { P: e3, A: h2, C: o3, M: 1, L: P, R: S2, D: u2, V: N, I: M, H: R, N: H, U: I, B: k, F: L };
var Z = t2.litHtmlPolyfillSupport;
Z?.(V, M), (t2.litHtmlVersions ??= []).push("3.1.3");
var j = (t7, i5, s5) => {
  const e11 = s5?.renderBefore ?? i5;
  let h3 = e11._$litPart$;
  if (void 0 === h3) {
    const t8 = s5?.renderBefore ?? null;
    e11._$litPart$ = h3 = new M(i5.insertBefore(l2(), t8), t8, void 0, s5 ?? {});
  }
  return h3._$AI(t7), h3;
};

// ../../../node_modules/.pnpm/lit-element@4.0.5/node_modules/lit-element/lit-element.js
var s3 = class extends b {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t7 = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t7.firstChild, t7;
  }
  update(t7) {
    const i5 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t7), this._$Do = j(i5, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return w;
  }
};
s3._$litElement$ = true, s3["finalized", "finalized"] = true, globalThis.litElementHydrateSupport?.({ LitElement: s3 });
var r4 = globalThis.litElementPolyfillSupport;
r4?.({ LitElement: s3 });
(globalThis.litElementVersions ??= []).push("4.0.5");

// ../../../node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/custom-element.js
var t3 = (t7) => (e11, o9) => {
  void 0 !== o9 ? o9.addInitializer(() => {
    customElements.define(t7, e11);
  }) : customElements.define(t7, e11);
};

// ../../../node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/property.js
var o4 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
var r5 = (t7 = o4, e11, r8) => {
  const { kind: n6, metadata: i5 } = r8;
  let s5 = globalThis.litPropertyMetadata.get(i5);
  if (void 0 === s5 && globalThis.litPropertyMetadata.set(i5, s5 = /* @__PURE__ */ new Map()), s5.set(r8.name, t7), "accessor" === n6) {
    const { name: o9 } = r8;
    return { set(r9) {
      const n7 = e11.get.call(this);
      e11.set.call(this, r9), this.requestUpdate(o9, n7, t7);
    }, init(e12) {
      return void 0 !== e12 && this.P(o9, void 0, t7), e12;
    } };
  }
  if ("setter" === n6) {
    const { name: o9 } = r8;
    return function(r9) {
      const n7 = this[o9];
      e11.call(this, r9), this.requestUpdate(o9, n7, t7);
    };
  }
  throw Error("Unsupported decorator location: " + n6);
};
function n4(t7) {
  return (e11, o9) => "object" == typeof o9 ? r5(t7, e11, o9) : ((t8, e12, o10) => {
    const r8 = e12.hasOwnProperty(o10);
    return e12.constructor.createProperty(o10, r8 ? { ...t8, wrapped: true } : t8), r8 ? Object.getOwnPropertyDescriptor(e12, o10) : void 0;
  })(t7, e11, o9);
}

// ../../../node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/state.js
function r6(r8) {
  return n4({ ...r8, state: true, attribute: false });
}

// ../../../node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/base.js
var e4 = (e11, t7, c4) => (c4.configurable = true, c4.enumerable = true, Reflect.decorate && "object" != typeof t7 && Object.defineProperty(e11, t7, c4), c4);

// ../../../node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/query.js
function e5(e11, r8) {
  return (n6, s5, i5) => {
    const o9 = (t7) => t7.renderRoot?.querySelector(e11) ?? null;
    if (r8) {
      const { get: e12, set: r9 } = "object" == typeof s5 ? n6 : i5 ?? (() => {
        const t7 = Symbol();
        return { get() {
          return this[t7];
        }, set(e13) {
          this[t7] = e13;
        } };
      })();
      return e4(n6, s5, { get() {
        let t7 = e12.call(this);
        return void 0 === t7 && (t7 = o9(this), (null !== t7 || this.hasUpdated) && r9.call(this, t7)), t7;
      } });
    }
    return e4(n6, s5, { get() {
      return o9(this);
    } });
  };
}

// src/styling/base.ts
var baseStyling = i`
	:host {
		font-family: "Inter", sans-serif;

		/*
		* Color Primitives
		*/

		/* Gray */
		--sl-color-gray-50: hsl(0 0% 97.5%);
		--sl-color-gray-100: hsl(240 4.8% 95.9%);
		--sl-color-gray-200: hsl(240 5.9% 90%);
		--sl-color-gray-300: hsl(240 4.9% 83.9%);
		--sl-color-gray-400: hsl(240 5% 64.9%);
		--sl-color-gray-500: hsl(240 3.8% 46.1%);
		--sl-color-gray-600: hsl(240 5.2% 33.9%);
		--sl-color-gray-700: hsl(240 5.3% 26.1%);
		--sl-color-gray-800: hsl(240 3.7% 15.9%);
		--sl-color-gray-900: hsl(240 5.9% 10%);
		--sl-color-gray-950: hsl(240 7.3% 8%);

		/* Red */
		--sl-color-red-50: hsl(0 85.7% 97.3%);
		--sl-color-red-100: hsl(0 93.3% 94.1%);
		--sl-color-red-200: hsl(0 96.3% 89.4%);
		--sl-color-red-300: hsl(0 93.5% 81.8%);
		--sl-color-red-400: hsl(0 90.6% 70.8%);
		--sl-color-red-500: hsl(0 84.2% 60.2%);
		--sl-color-red-600: hsl(0 72.2% 50.6%);
		--sl-color-red-700: hsl(0 73.7% 41.8%);
		--sl-color-red-800: hsl(0 70% 35.3%);
		--sl-color-red-900: hsl(0 62.8% 30.6%);
		--sl-color-red-950: hsl(0 60% 19.6%);

		/* Orange */
		--sl-color-orange-50: hsl(33.3 100% 96.5%);
		--sl-color-orange-100: hsl(34.3 100% 91.8%);
		--sl-color-orange-200: hsl(32.1 97.7% 83.1%);
		--sl-color-orange-300: hsl(30.7 97.2% 72.4%);
		--sl-color-orange-400: hsl(27 96% 61%);
		--sl-color-orange-500: hsl(24.6 95% 53.1%);
		--sl-color-orange-600: hsl(20.5 90.2% 48.2%);
		--sl-color-orange-700: hsl(17.5 88.3% 40.4%);
		--sl-color-orange-800: hsl(15 79.1% 33.7%);
		--sl-color-orange-900: hsl(15.3 74.6% 27.8%);
		--sl-color-orange-950: hsl(15.2 69.1% 19%);

		/* Amber */
		--sl-color-amber-50: hsl(48 100% 96.1%);
		--sl-color-amber-100: hsl(48 96.5% 88.8%);
		--sl-color-amber-200: hsl(48 96.6% 76.7%);
		--sl-color-amber-300: hsl(45.9 96.7% 64.5%);
		--sl-color-amber-400: hsl(43.3 96.4% 56.3%);
		--sl-color-amber-500: hsl(37.7 92.1% 50.2%);
		--sl-color-amber-600: hsl(32.1 94.6% 43.7%);
		--sl-color-amber-700: hsl(26 90.5% 37.1%);
		--sl-color-amber-800: hsl(22.7 82.5% 31.4%);
		--sl-color-amber-900: hsl(21.7 77.8% 26.5%);
		--sl-color-amber-950: hsl(22.9 74.1% 16.7%);

		/* Yellow */
		--sl-color-yellow-50: hsl(54.5 91.7% 95.3%);
		--sl-color-yellow-100: hsl(54.9 96.7% 88%);
		--sl-color-yellow-200: hsl(52.8 98.3% 76.9%);
		--sl-color-yellow-300: hsl(50.4 97.8% 63.5%);
		--sl-color-yellow-400: hsl(47.9 95.8% 53.1%);
		--sl-color-yellow-500: hsl(45.4 93.4% 47.5%);
		--sl-color-yellow-600: hsl(40.6 96.1% 40.4%);
		--sl-color-yellow-700: hsl(35.5 91.7% 32.9%);
		--sl-color-yellow-800: hsl(31.8 81% 28.8%);
		--sl-color-yellow-900: hsl(28.4 72.5% 25.7%);
		--sl-color-yellow-950: hsl(33.1 69% 13.9%);

		/* Lime */
		--sl-color-lime-50: hsl(78.3 92% 95.1%);
		--sl-color-lime-100: hsl(79.6 89.1% 89.2%);
		--sl-color-lime-200: hsl(80.9 88.5% 79.6%);
		--sl-color-lime-300: hsl(82 84.5% 67.1%);
		--sl-color-lime-400: hsl(82.7 78% 55.5%);
		--sl-color-lime-500: hsl(83.7 80.5% 44.3%);
		--sl-color-lime-600: hsl(84.8 85.2% 34.5%);
		--sl-color-lime-700: hsl(85.9 78.4% 27.3%);
		--sl-color-lime-800: hsl(86.3 69% 22.7%);
		--sl-color-lime-900: hsl(87.6 61.2% 20.2%);
		--sl-color-lime-950: hsl(86.5 60.6% 13.9%);

		/* Green */
		--sl-color-green-50: hsl(138.5 76.5% 96.7%);
		--sl-color-green-100: hsl(140.6 84.2% 92.5%);
		--sl-color-green-200: hsl(141 78.9% 85.1%);
		--sl-color-green-300: hsl(141.7 76.6% 73.1%);
		--sl-color-green-400: hsl(141.9 69.2% 58%);
		--sl-color-green-500: hsl(142.1 70.6% 45.3%);
		--sl-color-green-600: hsl(142.1 76.2% 36.3%);
		--sl-color-green-700: hsl(142.4 71.8% 29.2%);
		--sl-color-green-800: hsl(142.8 64.2% 24.1%);
		--sl-color-green-900: hsl(143.8 61.2% 20.2%);
		--sl-color-green-950: hsl(144.3 60.7% 12%);

		/* Emerald */
		--sl-color-emerald-50: hsl(151.8 81% 95.9%);
		--sl-color-emerald-100: hsl(149.3 80.4% 90%);
		--sl-color-emerald-200: hsl(152.4 76% 80.4%);
		--sl-color-emerald-300: hsl(156.2 71.6% 66.9%);
		--sl-color-emerald-400: hsl(158.1 64.4% 51.6%);
		--sl-color-emerald-500: hsl(160.1 84.1% 39.4%);
		--sl-color-emerald-600: hsl(161.4 93.5% 30.4%);
		--sl-color-emerald-700: hsl(162.9 93.5% 24.3%);
		--sl-color-emerald-800: hsl(163.1 88.1% 19.8%);
		--sl-color-emerald-900: hsl(164.2 85.7% 16.5%);
		--sl-color-emerald-950: hsl(164.3 87.5% 9.4%);

		/* Teal */
		--sl-color-teal-50: hsl(166.2 76.5% 96.7%);
		--sl-color-teal-100: hsl(167.2 85.5% 89.2%);
		--sl-color-teal-200: hsl(168.4 83.8% 78.2%);
		--sl-color-teal-300: hsl(170.6 76.9% 64.3%);
		--sl-color-teal-400: hsl(172.5 66% 50.4%);
		--sl-color-teal-500: hsl(173.4 80.4% 40%);
		--sl-color-teal-600: hsl(174.7 83.9% 31.6%);
		--sl-color-teal-700: hsl(175.3 77.4% 26.1%);
		--sl-color-teal-800: hsl(176.1 69.4% 21.8%);
		--sl-color-teal-900: hsl(175.9 60.8% 19%);
		--sl-color-teal-950: hsl(176.5 58.6% 11.4%);

		/* Cyan */
		--sl-color-cyan-50: hsl(183.2 100% 96.3%);
		--sl-color-cyan-100: hsl(185.1 95.9% 90.4%);
		--sl-color-cyan-200: hsl(186.2 93.5% 81.8%);
		--sl-color-cyan-300: hsl(187 92.4% 69%);
		--sl-color-cyan-400: hsl(187.9 85.7% 53.3%);
		--sl-color-cyan-500: hsl(188.7 94.5% 42.7%);
		--sl-color-cyan-600: hsl(191.6 91.4% 36.5%);
		--sl-color-cyan-700: hsl(192.9 82.3% 31%);
		--sl-color-cyan-800: hsl(194.4 69.6% 27.1%);
		--sl-color-cyan-900: hsl(196.4 63.6% 23.7%);
		--sl-color-cyan-950: hsl(196.8 61% 16.1%);

		/* Sky */
		--sl-color-sky-50: hsl(204 100% 97.1%);
		--sl-color-sky-100: hsl(204 93.8% 93.7%);
		--sl-color-sky-200: hsl(200.6 94.4% 86.1%);
		--sl-color-sky-300: hsl(199.4 95.5% 73.9%);
		--sl-color-sky-400: hsl(198.4 93.2% 59.6%);
		--sl-color-sky-500: hsl(198.6 88.7% 48.4%);
		--sl-color-sky-600: hsl(200.4 98% 39.4%);
		--sl-color-sky-700: hsl(201.3 96.3% 32.2%);
		--sl-color-sky-800: hsl(201 90% 27.5%);
		--sl-color-sky-900: hsl(202 80.3% 23.9%);
		--sl-color-sky-950: hsl(202.3 73.8% 16.5%);

		/* Blue */
		--sl-color-blue-50: hsl(213.8 100% 96.9%);
		--sl-color-blue-100: hsl(214.3 94.6% 92.7%);
		--sl-color-blue-200: hsl(213.3 96.9% 87.3%);
		--sl-color-blue-300: hsl(211.7 96.4% 78.4%);
		--sl-color-blue-400: hsl(213.1 93.9% 67.8%);
		--sl-color-blue-500: hsl(217.2 91.2% 59.8%);
		--sl-color-blue-600: hsl(221.2 83.2% 53.3%);
		--sl-color-blue-700: hsl(224.3 76.3% 48%);
		--sl-color-blue-800: hsl(225.9 70.7% 40.2%);
		--sl-color-blue-900: hsl(224.4 64.3% 32.9%);
		--sl-color-blue-950: hsl(226.2 55.3% 18.4%);

		/* Indigo */
		--sl-color-indigo-50: hsl(225.9 100% 96.7%);
		--sl-color-indigo-100: hsl(226.5 100% 93.9%);
		--sl-color-indigo-200: hsl(228 96.5% 88.8%);
		--sl-color-indigo-300: hsl(229.7 93.5% 81.8%);
		--sl-color-indigo-400: hsl(234.5 89.5% 73.9%);
		--sl-color-indigo-500: hsl(238.7 83.5% 66.7%);
		--sl-color-indigo-600: hsl(243.4 75.4% 58.6%);
		--sl-color-indigo-700: hsl(244.5 57.9% 50.6%);
		--sl-color-indigo-800: hsl(243.7 54.5% 41.4%);
		--sl-color-indigo-900: hsl(242.2 47.4% 34.3%);
		--sl-color-indigo-950: hsl(243.5 43.6% 22.9%);

		/* Violet */
		--sl-color-violet-50: hsl(250 100% 97.6%);
		--sl-color-violet-100: hsl(251.4 91.3% 95.5%);
		--sl-color-violet-200: hsl(250.5 95.2% 91.8%);
		--sl-color-violet-300: hsl(252.5 94.7% 85.1%);
		--sl-color-violet-400: hsl(255.1 91.7% 76.3%);
		--sl-color-violet-500: hsl(258.3 89.5% 66.3%);
		--sl-color-violet-600: hsl(262.1 83.3% 57.8%);
		--sl-color-violet-700: hsl(263.4 70% 50.4%);
		--sl-color-violet-800: hsl(263.4 69.3% 42.2%);
		--sl-color-violet-900: hsl(263.5 67.4% 34.9%);
		--sl-color-violet-950: hsl(265.1 61.5% 21.4%);

		/* Purple */
		--sl-color-purple-50: hsl(270 100% 98%);
		--sl-color-purple-100: hsl(268.7 100% 95.5%);
		--sl-color-purple-200: hsl(268.6 100% 91.8%);
		--sl-color-purple-300: hsl(269.2 97.4% 85.1%);
		--sl-color-purple-400: hsl(270 95.2% 75.3%);
		--sl-color-purple-500: hsl(270.7 91% 65.1%);
		--sl-color-purple-600: hsl(271.5 81.3% 55.9%);
		--sl-color-purple-700: hsl(272.1 71.7% 47.1%);
		--sl-color-purple-800: hsl(272.9 67.2% 39.4%);
		--sl-color-purple-900: hsl(273.6 65.6% 32%);
		--sl-color-purple-950: hsl(276 59.5% 16.5%);

		/* Fuchsia */
		--sl-color-fuchsia-50: hsl(289.1 100% 97.8%);
		--sl-color-fuchsia-100: hsl(287 100% 95.5%);
		--sl-color-fuchsia-200: hsl(288.3 95.8% 90.6%);
		--sl-color-fuchsia-300: hsl(291.1 93.1% 82.9%);
		--sl-color-fuchsia-400: hsl(292 91.4% 72.5%);
		--sl-color-fuchsia-500: hsl(292.2 84.1% 60.6%);
		--sl-color-fuchsia-600: hsl(293.4 69.5% 48.8%);
		--sl-color-fuchsia-700: hsl(294.7 72.4% 39.8%);
		--sl-color-fuchsia-800: hsl(295.4 70.2% 32.9%);
		--sl-color-fuchsia-900: hsl(296.7 63.6% 28%);
		--sl-color-fuchsia-950: hsl(297.1 56.8% 14.5%);

		/* Pink */
		--sl-color-pink-50: hsl(327.3 73.3% 97.1%);
		--sl-color-pink-100: hsl(325.7 77.8% 94.7%);
		--sl-color-pink-200: hsl(325.9 84.6% 89.8%);
		--sl-color-pink-300: hsl(327.4 87.1% 81.8%);
		--sl-color-pink-400: hsl(328.6 85.5% 70.2%);
		--sl-color-pink-500: hsl(330.4 81.2% 60.4%);
		--sl-color-pink-600: hsl(333.3 71.4% 50.6%);
		--sl-color-pink-700: hsl(335.1 77.6% 42%);
		--sl-color-pink-800: hsl(335.8 74.4% 35.3%);
		--sl-color-pink-900: hsl(335.9 69% 30.4%);
		--sl-color-pink-950: hsl(336.2 65.4% 15.9%);

		/* Rose */
		--sl-color-rose-50: hsl(355.7 100% 97.3%);
		--sl-color-rose-100: hsl(355.6 100% 94.7%);
		--sl-color-rose-200: hsl(352.7 96.1% 90%);
		--sl-color-rose-300: hsl(352.6 95.7% 81.8%);
		--sl-color-rose-400: hsl(351.3 94.5% 71.4%);
		--sl-color-rose-500: hsl(349.7 89.2% 60.2%);
		--sl-color-rose-600: hsl(346.8 77.2% 49.8%);
		--sl-color-rose-700: hsl(345.3 82.7% 40.8%);
		--sl-color-rose-800: hsl(343.4 79.7% 34.7%);
		--sl-color-rose-900: hsl(341.5 75.5% 30.4%);
		--sl-color-rose-950: hsl(341.3 70.1% 17.1%);

		/*
   * Theme Tokens
   */

		/* Primary */
		--sl-color-primary-50: var(--sl-color-sky-50);
		--sl-color-primary-100: var(--sl-color-sky-100);
		--sl-color-primary-200: var(--sl-color-sky-200);
		--sl-color-primary-300: var(--sl-color-sky-300);
		--sl-color-primary-400: var(--sl-color-sky-400);
		--sl-color-primary-500: var(--sl-color-sky-500);
		--sl-color-primary-600: var(--sl-color-sky-600);
		--sl-color-primary-700: var(--sl-color-sky-700);
		--sl-color-primary-800: var(--sl-color-sky-800);
		--sl-color-primary-900: var(--sl-color-sky-900);
		--sl-color-primary-950: var(--sl-color-sky-950);

		/* Success */
		--sl-color-success-50: var(--sl-color-green-50);
		--sl-color-success-100: var(--sl-color-green-100);
		--sl-color-success-200: var(--sl-color-green-200);
		--sl-color-success-300: var(--sl-color-green-300);
		--sl-color-success-400: var(--sl-color-green-400);
		--sl-color-success-500: var(--sl-color-green-500);
		--sl-color-success-600: var(--sl-color-green-600);
		--sl-color-success-700: var(--sl-color-green-700);
		--sl-color-success-800: var(--sl-color-green-800);
		--sl-color-success-900: var(--sl-color-green-900);
		--sl-color-success-950: var(--sl-color-green-950);

		/* Warning */
		--sl-color-warning-50: var(--sl-color-amber-50);
		--sl-color-warning-100: var(--sl-color-amber-100);
		--sl-color-warning-200: var(--sl-color-amber-200);
		--sl-color-warning-300: var(--sl-color-amber-300);
		--sl-color-warning-400: var(--sl-color-amber-400);
		--sl-color-warning-500: var(--sl-color-amber-500);
		--sl-color-warning-600: var(--sl-color-amber-600);
		--sl-color-warning-700: var(--sl-color-amber-700);
		--sl-color-warning-800: var(--sl-color-amber-800);
		--sl-color-warning-900: var(--sl-color-amber-900);
		--sl-color-warning-950: var(--sl-color-amber-950);

		/* Danger */
		--sl-color-danger-50: var(--sl-color-red-50);
		--sl-color-danger-100: var(--sl-color-red-100);
		--sl-color-danger-200: var(--sl-color-red-200);
		--sl-color-danger-300: var(--sl-color-red-300);
		--sl-color-danger-400: var(--sl-color-red-400);
		--sl-color-danger-500: var(--sl-color-red-500);
		--sl-color-danger-600: var(--sl-color-red-600);
		--sl-color-danger-700: var(--sl-color-red-700);
		--sl-color-danger-800: var(--sl-color-red-800);
		--sl-color-danger-900: var(--sl-color-red-900);
		--sl-color-danger-950: var(--sl-color-red-950);

		/* Neutral */
		--sl-color-neutral-50: var(--sl-color-gray-50);
		--sl-color-neutral-100: var(--sl-color-gray-100);
		--sl-color-neutral-200: var(--sl-color-gray-200);
		--sl-color-neutral-300: var(--sl-color-gray-300);
		--sl-color-neutral-400: var(--sl-color-gray-400);
		--sl-color-neutral-500: var(--sl-color-gray-500);
		--sl-color-neutral-600: var(--sl-color-gray-600);
		--sl-color-neutral-700: var(--sl-color-gray-700);
		--sl-color-neutral-800: var(--sl-color-gray-800);
		--sl-color-neutral-900: var(--sl-color-gray-900);
		--sl-color-neutral-950: var(--sl-color-gray-950);

		/* Neutral one-offs */
		--sl-color-neutral-0: hsl(0, 0%, 100%);
		--sl-color-neutral-1000: hsl(0, 0%, 0%);

		/*
   * Border radii
   */

		--sl-border-radius-small: 0.1875rem; /* 3px */
		--sl-border-radius-medium: 0.25rem; /* 4px */
		--sl-border-radius-large: 0.5rem; /* 8px */
		--sl-border-radius-x-large: 1rem; /* 16px */

		--sl-border-radius-circle: 50%;
		--sl-border-radius-pill: 9999px;

		/*
   * Elevations
   */

		--sl-shadow-x-small: 0 1px 2px hsl(240 3.8% 46.1% / 6%);
		--sl-shadow-small: 0 1px 2px hsl(240 3.8% 46.1% / 12%);
		--sl-shadow-medium: 0 2px 4px hsl(240 3.8% 46.1% / 12%);
		--sl-shadow-large: 0 2px 8px hsl(240 3.8% 46.1% / 12%);
		--sl-shadow-x-large: 0 4px 16px hsl(240 3.8% 46.1% / 12%);

		/*
   * Spacings
   */

		--sl-spacing-3x-small: 0.125rem; /* 2px */
		--sl-spacing-2x-small: 0.25rem; /* 4px */
		--sl-spacing-x-small: 0.5rem; /* 8px */
		--sl-spacing-small: 0.75rem; /* 12px */
		--sl-spacing-medium: 1rem; /* 16px */
		--sl-spacing-large: 1.25rem; /* 20px */
		--sl-spacing-x-large: 1.75rem; /* 28px */
		--sl-spacing-2x-large: 2.25rem; /* 36px */
		--sl-spacing-3x-large: 3rem; /* 48px */
		--sl-spacing-4x-large: 4.5rem; /* 72px */

		/*
   * Transitions
   */

		--sl-transition-x-slow: 1000ms;
		--sl-transition-slow: 500ms;
		--sl-transition-medium: 250ms;
		--sl-transition-fast: 150ms;
		--sl-transition-x-fast: 50ms;

		/*
   * Typography
   */

		/* Fonts */
		--sl-font-mono: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
		--sl-font-sans: Inter, sans-serif;
		--sl-font-serif: Inter, "Times New Roman", serif;

		/* Font sizes */
		--sl-font-size-2x-small: 0.625rem; /* 10px */
		--sl-font-size-x-small: 0.75rem; /* 12px */
		--sl-font-size-small: 0.875rem; /* 14px */
		--sl-font-size-medium: 1rem; /* 16px */
		--sl-font-size-large: 1.25rem; /* 20px */
		--sl-font-size-x-large: 1.5rem; /* 24px */
		--sl-font-size-2x-large: 2.25rem; /* 36px */
		--sl-font-size-3x-large: 3rem; /* 48px */
		--sl-font-size-4x-large: 4.5rem; /* 72px */

		/* Font weights */
		--sl-font-weight-light: 300;
		--sl-font-weight-normal: 400;
		--sl-font-weight-semibold: 500;
		--sl-font-weight-bold: 700;

		/* Letter spacings */
		--sl-letter-spacing-denser: -0.03em;
		--sl-letter-spacing-dense: -0.015em;
		--sl-letter-spacing-normal: normal;
		--sl-letter-spacing-loose: 0.075em;
		--sl-letter-spacing-looser: 0.15em;

		/* Line heights */
		--sl-line-height-denser: 1;
		--sl-line-height-dense: 1.4;
		--sl-line-height-normal: 1.8;
		--sl-line-height-loose: 2.2;
		--sl-line-height-looser: 2.6;

		/* Focus rings */
		--sl-focus-ring-color: var(--sl-color-primary-600);
		--sl-focus-ring-style: solid;
		--sl-focus-ring-width: 3px;
		--sl-focus-ring: var(--sl-focus-ring-style) var(--sl-focus-ring-width)
			var(--sl-focus-ring-color);
		--sl-focus-ring-offset: 1px;

		/*
   * Forms
   */

		/* Buttons */
		--sl-button-font-size-small: var(--sl-font-size-x-small);
		--sl-button-font-size-medium: var(--sl-font-size-small);
		--sl-button-font-size-large: var(--sl-font-size-medium);

		/* Inputs */
		--sl-input-height-small: 1.875rem; /* 30px */
		--sl-input-height-medium: 2.5rem; /* 40px */
		--sl-input-height-large: 3.125rem; /* 50px */

		--sl-input-background-color: var(--sl-color-neutral-0);
		--sl-input-background-color-hover: var(--sl-input-background-color);
		--sl-input-background-color-focus: var(--sl-input-background-color);
		--sl-input-background-color-disabled: var(--sl-color-neutral-100);
		--sl-input-border-color: var(--sl-color-neutral-300);
		--sl-input-border-color-hover: var(--sl-color-neutral-400);
		--sl-input-border-color-focus: var(--sl-color-primary-500);
		--sl-input-border-color-disabled: var(--sl-color-neutral-300);
		--sl-input-border-width: 1px;
		--sl-input-required-content: "*";
		--sl-input-required-content-offset: -2px;
		--sl-input-required-content-color: var(--sl-input-label-color);

		--sl-input-border-radius-small: var(--sl-border-radius-medium);
		--sl-input-border-radius-medium: var(--sl-border-radius-medium);
		--sl-input-border-radius-large: var(--sl-border-radius-medium);

		--sl-input-font-family: var(--sl-font-sans);
		--sl-input-font-weight: var(--sl-font-weight-normal);
		--sl-input-font-size-small: var(--sl-font-size-small);
		--sl-input-font-size-medium: var(--sl-font-size-medium);
		--sl-input-font-size-large: var(--sl-font-size-large);
		--sl-input-letter-spacing: var(--sl-letter-spacing-normal);

		--sl-input-color: var(--sl-color-neutral-700);
		--sl-input-color-hover: var(--sl-color-neutral-700);
		--sl-input-color-focus: var(--sl-color-neutral-700);
		--sl-input-color-disabled: var(--sl-color-neutral-900);
		--sl-input-icon-color: var(--sl-color-neutral-500);
		--sl-input-icon-color-hover: var(--sl-color-neutral-600);
		--sl-input-icon-color-focus: var(--sl-color-neutral-600);
		--sl-input-placeholder-color: var(--sl-color-neutral-500);
		--sl-input-placeholder-color-disabled: var(--sl-color-neutral-600);
		--sl-input-spacing-small: var(--sl-spacing-small);
		--sl-input-spacing-medium: var(--sl-spacing-medium);
		--sl-input-spacing-large: var(--sl-spacing-large);

		--sl-input-focus-ring-color: hsl(198.6 88.7% 48.4% / 40%);
		--sl-input-focus-ring-offset: 0;

		--sl-input-filled-background-color: var(--sl-color-neutral-100);
		--sl-input-filled-background-color-hover: var(--sl-color-neutral-100);
		--sl-input-filled-background-color-focus: var(--sl-color-neutral-100);
		--sl-input-filled-background-color-disabled: var(--sl-color-neutral-100);
		--sl-input-filled-color: var(--sl-color-neutral-800);
		--sl-input-filled-color-hover: var(--sl-color-neutral-800);
		--sl-input-filled-color-focus: var(--sl-color-neutral-700);
		--sl-input-filled-color-disabled: var(--sl-color-neutral-800);

		/* Labels */
		--sl-input-label-font-size-small: var(--sl-font-size-small);
		--sl-input-label-font-size-medium: var(--sl-font-size-medium);
		--sl-input-label-font-size-large: var(--sl-font-size-large);
		--sl-input-label-color: inherit;

		/* Help text */
		--sl-input-help-text-font-size-small: var(--sl-font-size-x-small);
		--sl-input-help-text-font-size-medium: var(--sl-font-size-small);
		--sl-input-help-text-font-size-large: var(--sl-font-size-medium);
		--sl-input-help-text-color: var(--sl-color-neutral-500);

		/* Toggles (checkboxes, radios, switches) */
		--sl-toggle-size-small: 0.875rem; /* 14px */
		--sl-toggle-size-medium: 1.125rem; /* 18px */
		--sl-toggle-size-large: 1.375rem; /* 22px */

		/*
   * Overlays
   */

		--sl-overlay-background-color: hsl(240 3.8% 46.1% / 33%);

		/*
   * Panels
   */

		--sl-panel-background-color: var(--sl-color-neutral-0);
		--sl-panel-border-color: var(--sl-color-neutral-200);
		--sl-panel-border-width: 1px;

		/*
   * Tooltips
   */

		--sl-tooltip-border-radius: var(--sl-border-radius-medium);
		--sl-tooltip-background-color: var(--sl-color-neutral-800);
		--sl-tooltip-color: var(--sl-color-neutral-0);
		--sl-tooltip-font-family: var(--sl-font-sans);
		--sl-tooltip-font-weight: var(--sl-font-weight-normal);
		--sl-tooltip-font-size: var(--sl-font-size-small);
		--sl-tooltip-line-height: var(--sl-line-height-dense);
		--sl-tooltip-padding: var(--sl-spacing-2x-small) var(--sl-spacing-x-small);
		--sl-tooltip-arrow-size: 6px;

		/*
   * Z-indexes
   */

		--sl-z-index-drawer: 700;
		--sl-z-index-dialog: 800;
		--sl-z-index-dropdown: 900;
		--sl-z-index-toast: 950;
		--sl-z-index-tooltip: 1000;
	}
`;

// src/stories/inlang-settings.ts
import {
  ProjectSettings
} from "@inlang/sdk";

// src/helper/checkRequired.ts
var checkRequired = (schema, property) => {
  if (schema && schema.required && schema.required.includes(property)) {
    return true;
  }
  return false;
};
var checkRequired_default = checkRequired;

// src/helper/overridePrimitiveColors.ts
var import_chroma_js = __toESM(require_chroma(), 1);
var overridePrimitiveColors = () => {
  const inlangSettings = document.querySelector("inlang-settings");
  if (!inlangSettings)
    return void 0;
  const primitives = ["primary", "success", "warning", "danger", "neutral"];
  for (const primitive of primitives) {
    const unformattedColor = window.getComputedStyle(inlangSettings).getPropertyValue(`--inlang-color-${primitive}`).trim();
    if (unformattedColor !== "") {
      const colorShades = getPalette(unformattedColor);
      appendCSSProperties(colorShades, primitive, inlangSettings);
    }
  }
};
var appendCSSProperties = (colorShades, primitive, element) => {
  let textContent = Object.entries(colorShades).map(([index, shade]) => `--sl-color-${primitive}-${index}: ${shade} !important;`).join("\n");
  textContent = ":host { " + textContent + " }";
  const shadowRoot = element.shadowRoot || element.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = textContent;
  shadowRoot.appendChild(style);
};
var getColor = (unformattedColor) => (0, import_chroma_js.default)(unformattedColor);
var getPalette = (unformattedColor) => {
  const color = getColor(unformattedColor);
  const colors = import_chroma_js.default.scale(["white", color, "black"]).domain([0, 0.6, 1]).mode("lrgb");
  const palette = {};
  palette[50] = colors(0.05).hex();
  for (let i5 = 0.1; i5 < 0.9; i5 += 0.1) {
    palette[Math.round(i5 * 1e3)] = colors(i5).hex();
  }
  palette[950] = colors(0.95).hex();
  return palette;
};
var overridePrimitiveColors_default = overridePrimitiveColors;

// ../marketplace-registry/dist/registry.js
var registry = [
  {
    uniqueID: "zu942ln6",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "app.inlang.badge",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/source-code/badge/assets/images/badge-icon.jpg",
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/badge-marketplace-cover.jpg",
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/badge-gallery/badge-gallery-image-1.jpg",
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/badge-gallery/badge-gallery-image-2.jpg"
    ],
    displayName: {
      en: "Translation status badge"
    },
    description: {
      en: "Badge showing missing messages in your codebase. Perfect for your README.md file."
    },
    pages: {
      "/": "./inlang/source-code/badge/README.md",
      "/changelog": "./inlang/source-code/badge/CHANGELOG.md"
    },
    keywords: [
      "apps",
      "badge",
      "markdown",
      "translation",
      "status",
      "lix",
      "svelte",
      "nextjs",
      "astro",
      "inlang",
      "solid"
    ],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    license: "Apache-2.0",
    pricing: "Free"
  },
  {
    uniqueID: "2qj2w8pu",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "app.inlang.cli",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/source-code/cli/assets/cli-icon.png",
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/cli-marketplace-cover.jpg",
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/cli-gallery/cli-gallery-image-1.jpg",
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/cli-gallery/cli-gallery-image-2.jpg",
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/cli-gallery/cli-gallery-image-3.jpg"
    ],
    displayName: {
      en: "CLI - Translation Automation"
    },
    description: {
      en: "Command line interface for inlang projects. Many commands and the possibility to do translation automation."
    },
    pages: {
      "/": "./inlang/source-code/cli/README.md",
      "/changelog": "./inlang/source-code/cli/CHANGELOG.md"
    },
    keywords: [
      "cli",
      "commands",
      "application",
      "website",
      "developer",
      "ai",
      "ci/cd",
      "lix",
      "svelte",
      "nextjs",
      "astro",
      "remix",
      "inlang",
      "solid"
    ],
    pricing: "free",
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    license: "Apache-2.0"
  },
  {
    uniqueID: "tdozzpar",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "app.inlang.finkLocalizationEditor",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/source-code/editor/assets/new-fink-logo.png",
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/editor-marketplace-cover.jpg",
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/editor-gallery/editor-gallery-image-1.jpg",
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/editor-gallery/editor-gallery-image-2.jpg",
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/editor-gallery/editor-gallery-image-3.jpg",
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/editor-gallery/editor-gallery-image-4.jpg"
    ],
    displayName: {
      en: "Fink \u2013 Localization Editor"
    },
    description: {
      en: "Your translation workflow with no-code setup and repository-based operation \u2014 the ideal i18n solution for translators."
    },
    pages: {
      Overview: {
        "/": "./inlang/source-code/editor/README.md",
        "/supported-i18n-libraries": "./inlang/source-code/editor/docs/supported-i18n-libraries.md"
      },
      Guides: {
        Usage: "/g/6ddyhpoi/guide-nilsjacobsen-contributeTranslationsWithFink",
        "What is inlang?": "/g/7777asdy/guide-nilsjacobsen-ecosystemCompatible"
      }
    },
    keywords: [
      "editor",
      "web",
      "apps",
      "website",
      "translator",
      "lix",
      "fink",
      "inlang",
      "astro",
      "remix",
      "nextjs",
      "svelte",
      "solid"
    ],
    recommends: ["m/3gk8n4n4", "m/gerre34r", "m/reootnfj", "m/4cxm3eqi"],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    website: "https://fink.inlang.com/",
    license: "PolyForm Noncommercial License 1.0.0",
    pricing: "Free Beta"
  },
  {
    uniqueID: "92fst3wd",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "app.inlang.globelens",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/source-code/globelens/assets/GlobeLens-logo.png",
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/source-code/globelens/assets/GlobeLens-01.png"
    ],
    displayName: {
      en: "GlobeLens \u2013 i18n SEO Analysis"
    },
    description: {
      en: "Check how your pages perform in different markets. GlobeLens is a tool for international SEO analysis."
    },
    pages: {
      "/": "./inlang/source-code/globelens/README.md"
    },
    keywords: ["analysis", "i18n", "apps", "seo", "test", "url", "keyword", "inlang"],
    pricing: "FREE BETA",
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    license: "Apache-2.0"
  },
  {
    uniqueID: "r7kp499g",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "app.inlang.ideExtension",
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/vscode_extension-marketplace-cover.jpg",
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/vscode_extension-gallery/vscode_extension-gallery-image-1.jpg",
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/vscode_extension-gallery/vscode_extension-gallery-image-2.jpg",
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/vscode_extension-gallery/vscode_extension-gallery-image-3.jpg"
    ],
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@main/inlang/source-code/ide-extension/assets/sherlock-logo.png",
    displayName: {
      en: "Sherlock - VS Code extension"
    },
    description: {
      en: "Visualize, edit & lint translated strings at a glance via Inline Decorations & Hover Support, and extract new strings with a single click."
    },
    pages: {
      "": {
        "/": "./inlang/source-code/ide-extension/MARKETPLACE.md"
      },
      "Getting Started": {
        "/quick-start": "./inlang/source-code/ide-extension/docs/quick-start.md",
        "/customization": "./inlang/source-code/ide-extension/docs/customization.md",
        "/supported-i18n-libraries": "./inlang/source-code/ide-extension/docs/supported-i18n-libraries.md",
        "/video-tour": "./inlang/source-code/ide-extension/docs/video-tour.md"
      },
      Appendix: {
        "/changelog": "./inlang/source-code/ide-extension/CHANGELOG.md"
      }
    },
    keywords: [
      "apps",
      "website",
      "developer",
      "vscode",
      "ide",
      "extension",
      "lix",
      "Sherlock",
      "inspector",
      "svelte",
      "nextjs",
      "remix",
      "astro",
      "inlang",
      "solid"
    ],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    website: "https://marketplace.visualstudio.com/items?itemName=inlang.vs-code-extension",
    license: "PolyForm Noncommercial License 1.0.0",
    pricing: "Free"
  },
  {
    uniqueID: "3gk8n4n4",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "app.inlang.ninjaI18nAction",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/source-code/github-lint-action/assets/ninja-logo.png",
    gallery: [],
    displayName: {
      en: "Ninja i18n - GitHub Lint Action"
    },
    description: {
      en: "This action checks for translation issues within your PRs."
    },
    pages: {
      "/": "./inlang/source-code/github-lint-action/MARKETPLACE.md",
      "/changelog": "./inlang/source-code/github-lint-action/CHANGELOG.md"
    },
    keywords: [
      "developer",
      "ci/cd",
      "github",
      "lint",
      "action",
      "application",
      "website",
      "translation",
      "localization",
      "i18n",
      "inlang"
    ],
    recommends: ["g/ssryldhd", "g/6ddyhpoi", "m/r7kp499g", "m/tdozzpar"],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    website: "https://github.com/marketplace/actions/ninja-i18n",
    license: "Apache-2.0",
    pricing: "Free"
  },
  {
    uniqueID: "0023fsjj",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "app.lokalise.i18nally",
    icon: "https://avatars.githubusercontent.com/u/14294501?s=200&v=4",
    gallery: [
      "https://github.com/lokalise/i18n-ally/blob/main/screenshots/full-logo-new.png?raw=true"
    ],
    displayName: {
      en: "i18n ally"
    },
    description: {
      en: "\u{1F30D} All in one i18n extension for VS Code"
    },
    readme: {
      en: "./inlang/external-projects/i18n-ally/README.md"
    },
    keywords: [
      "apps",
      "i18n-ally",
      "i18n ally",
      "vs-code",
      "ide-extension",
      "javascript",
      "developer",
      "i18n",
      "external"
    ],
    recommends: ["m/tdozzpar", "m/2qj2w8pu", "m/r7kp499g"],
    pricing: "free",
    publisherName: "lokalise",
    publisherIcon: "https://avatars.githubusercontent.com/u/14294501?s=200&v=4",
    website: "https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally",
    license: "MIT License"
  },
  {
    uniqueID: "gkrpgoir",
    id: "app.parrot.figmaPlugin",
    icon: "https://cdn.jsdelivr.net/gh/parrot-global/parrot@main/parrot-logo.svg",
    gallery: [
      "https://cdn.jsdelivr.net/gh/parrot-global/parrot@main/cover.png",
      "https://cdn.jsdelivr.net/gh/parrot-global/parrot@main/layers.png",
      "https://cdn.jsdelivr.net/gh/parrot-global/parrot@main/messages.png"
    ],
    displayName: {
      en: "Parrot \u2013 i18n Figma plugin"
    },
    description: {
      en: "Parrot simplifies the translation management process right within Figma. If you deal with multilingual design projects and want to streamline your translation workflow, this plugin is for you!"
    },
    readme: {
      en: "https://cdn.jsdelivr.net/gh/parrot-global/parrot@latest/README.md"
    },
    keywords: ["editor", "web", "figma", "application", "website", "translator", "lix"],
    publisherName: "Parrot.global",
    publisherIcon: "https://cdn.jsdelivr.net/gh/parrot-global/parrot@main/parrot-logo.svg",
    license: "PolyForm Strict License 1.0.0"
  },
  {
    uniqueID: "1153khjh",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "app.tolgee.tolgee-platform",
    gallery: [
      "https://user-images.githubusercontent.com/18496315/188632536-3547fd70-755c-4a32-9b1e-fb1afbf84b33.png"
    ],
    icon: "https://user-images.githubusercontent.com/18496315/188628892-33fcc282-26f1-4035-8105-95952bd93de9.svg",
    displayName: {
      en: "Tolgee"
    },
    description: {
      en: "An open-source localization platform developers enjoy to work with."
    },
    readme: {
      en: "./inlang/external-projects/tolgee/README.md"
    },
    keywords: ["apps", "tolgee", "editor", "messages", "translator", "external"],
    recommends: ["m/tdozzpar", "m/2qj2w8pu", "m/r7kp499g"],
    pricing: "start free",
    publisherName: "tolgee",
    publisherIcon: "https://user-images.githubusercontent.com/18496315/188628892-33fcc282-26f1-4035-8105-95952bd93de9.svg",
    license: "Apache-2.0"
  },
  {
    uniqueID: "940fn8mg",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "guide.floriankiem.i18nMistakes",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/i18n-mistakes/assets/computer-icon.jpg",
    displayName: {
      en: "Localization Mistakes and How to Avoid Them when Internationalizing (i18n) your App"
    },
    description: {
      en: "This guide will help you avoid common mistakes when localizing your app. It will also help you understand the importance of localization and how to do it right."
    },
    readme: {
      en: "./inlang/guides/i18n-mistakes/i18n-mistakes.md"
    },
    keywords: [
      "i18n",
      "mistakes",
      "error",
      "not working",
      "how to",
      "avoid",
      "localization",
      "globalization",
      "internationalization",
      "guide",
      "guides-i18n"
    ],
    recommends: ["g/38fnf03n", "m/3i8bor92", "g/3go4f04m", "g/6ddyhpoi"],
    publisherName: "Florian Kiem",
    publisherIcon: "https://avatars.githubusercontent.com/u/92092993?v=4",
    license: "Apache-2.0"
  },
  {
    uniqueID: "38fnf03n",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "guide.floriankiem.localizationStrategy",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/localization-strategy/assets/pin-icon.jpg",
    displayName: {
      en: "Localization Strategy: Best Practices for SEO and Global Ranking"
    },
    description: {
      en: "Learn how to avoid common pitfalls and implement best practices in app localization with this comprehensive guide. Discover practical tips to enhance your global ranking and ensure a successful localization strategy."
    },
    readme: {
      en: "./inlang/guides/localization-strategy/localization-strategy.md"
    },
    keywords: [
      "i18n",
      "localization",
      "l10n",
      "strategy",
      "how to do localization",
      "how to do i18n",
      "how to do l10n",
      "globalization",
      "internationalization",
      "guide",
      "localization guide",
      "guides-i18n"
    ],
    recommends: ["g/940fn8mg", "g/3go4f04m", "g/6ddyhpoi"],
    publisherName: "Florian Kiem",
    publisherIcon: "https://avatars.githubusercontent.com/u/92092993?v=4",
    license: "Apache-2.0"
  },
  {
    uniqueID: "94ng94n4",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "guide.inlang.buildOwnApp",
    displayName: {
      en: "How to build an inlang app"
    },
    description: {
      en: "This guide gives you an introduction on how to build your own inlang app."
    },
    readme: {
      en: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/how-to-inlang-app/how-to-inlang-app.md"
    },
    keywords: ["app", "build", "applicaton", "website", "guides-general"],
    publisherName: "Felix H\xE4berle",
    publisherIcon: "https://avatars.githubusercontent.com/u/34959078?v=4",
    license: "Apache-2.0"
  },
  {
    uniqueID: "pposhsfh",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "guide.kevinccbsg.useParaglideJsWithRemix",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo/inlang/external-projects/remix-paraglidejs/assets/remix.svg",
    displayName: {
      en: "Use ParaglideJS with Remix"
    },
    description: {
      en: "This guide covers how to integrate ParaglideJS into a Remix project."
    },
    readme: {
      en: "./inlang/guides/use-paraglide-with-remix/use-paraglide-with-remix.md"
    },
    keywords: [
      "application",
      "developer",
      "paraglide",
      "i18n",
      "library",
      "localization",
      "sdk",
      "sdk-js",
      "react",
      "build",
      "javascript",
      "ide",
      "guide",
      "remix",
      "react",
      "i18n routing",
      "guides-developer"
    ],
    recommends: ["m/fnhuwzrx", "m/gerre34r", "m/r7kp499g"],
    publisherName: "Kevin Mart\xEDnez",
    publisherIcon: "https://avatars.githubusercontent.com/u/12685053?v=4",
    publisherLink: "https://github.com/BRIKEV",
    license: "Apache-2.0"
  },
  {
    uniqueID: "utqgkmzp",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "guide.lorissigrist.buildAGlobalAstroApp",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/build-an-internationalized-astro-app-using-paraglide/icon.svg",
    displayName: {
      en: "Build an internationalized Astro App using Paraglide"
    },
    description: {
      en: "Learn how to set up Paraglide in an Astro project."
    },
    readme: {
      en: "./inlang/guides/build-an-internationalized-astro-app-using-paraglide/build-an-internationalized-astro-app-using-paraglide.md"
    },
    keywords: [
      "libraries",
      "developer",
      "paraglide",
      "i18n",
      "internationalization",
      "astro",
      "astro.build",
      "library",
      "localization",
      "sdk",
      "sdk-js",
      "javascript",
      "typescript",
      "ide",
      "guide",
      "guides-developer"
    ],
    recommends: ["g/3go4f04m", "g/00162hsd", "g/38fnf03n"],
    publisherName: "LorisSigrist",
    publisherIcon: "https://avatars.githubusercontent.com/u/43482866?v=4",
    publisherLink: "https://github.com/LorisSigrist",
    license: "Apache-2.0"
  },
  {
    uniqueID: "lubhdyua",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "guide.lorissigrist.buildAGlobalSolidStartApp",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/build-a-global-solidstart-app/icon.png",
    displayName: {
      en: "Build a Global SolidStart App"
    },
    description: {
      en: "A complete guide on how to adopt inlang with paraglide.js and message-format-plugin in your SolidStart project."
    },
    readme: {
      en: "./inlang/guides/build-a-global-solidstart-app/build-a-global-solidstart-app.md"
    },
    keywords: [
      "libraries",
      "developer",
      "paraglide",
      "i18n",
      "library",
      "localization",
      "sdk",
      "sdk-js",
      "solid",
      "solidstart",
      "javascript",
      "ide",
      "guide",
      "guides-developer"
    ],
    recommends: ["g/3go4f04m", "g/00162hsd", "g/38fnf03n"],
    publisherName: "LorisSigrist",
    publisherIcon: "https://avatars.githubusercontent.com/u/43482866?v=4",
    publisherLink: "https://github.com/LorisSigrist",
    license: "Apache-2.0"
  },
  {
    uniqueID: "mqlyfa7l",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "guide.lorissigrist.dontlazyload",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/dont-lazy-load/assets/icon.png",
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/dont-lazy-load/assets/thumbnail.png"
    ],
    displayName: {
      en: "Don't Lazy-Load Translations"
    },
    description: {
      en: "Lazy-loading translations can seriously hurt your web-vitals. Here is what to do instead."
    },
    readme: {
      en: "./inlang/guides/dont-lazy-load/README.md"
    },
    keywords: [
      "i18n",
      "l10n",
      "developer",
      "contribute",
      "localization",
      "globalization",
      "internationalization",
      "guide",
      "ecosystem",
      "compatible",
      "ecosystem compatible",
      "astro",
      "remix",
      "vue",
      "angular",
      "flutter",
      "guides-general",
      "guides-developer"
    ],
    recommends: ["m/gerre34r", "g/00162hsd", "g/wxcebbig", "g/uxohikde"],
    publisherName: "Loris Sigrist",
    publisherIcon: "https://avatars.githubusercontent.com/u/43482866?v=4",
    publisherLink: "https://github.com/LorisSigrist",
    license: "Apache-2.0"
  },
  {
    uniqueID: "wxcebbig",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "guide.lorissigrist.useParaglideJsWithNextjsAppRouter",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/use-paraglide-with-nextjs-app-router/app-router-logo.png",
    displayName: {
      en: "Use ParaglideJS with the NextJS App Router"
    },
    description: {
      en: "This guide covers how to integrate ParaglideJS into a NextJS project using the app router. It will cover server & client components, i18n routing and more!"
    },
    readme: {
      en: "./inlang/guides/use-paraglide-with-nextjs-app-router/use-paraglide-with-nextjs-app-router.md"
    },
    keywords: [
      "application",
      "developer",
      "paraglide",
      "i18n",
      "library",
      "localization",
      "sdk",
      "sdk-js",
      "react",
      "build",
      "javascript",
      "ide",
      "guide",
      "next",
      "nextjs",
      "react",
      "app router",
      "server components",
      "server component",
      "RSC",
      "client component",
      "client components",
      "i18n routing",
      "guides-developer"
    ],
    recommends: ["g/uxohikde", "g/2fg8ng94", "g/00162hsd"],
    publisherName: "Loris Sigrist",
    publisherIcon: "https://avatars.githubusercontent.com/u/43482866?v=4",
    publisherLink: "https://github.com/LorisSigrist",
    license: "Apache-2.0"
  },
  {
    uniqueID: "uxohikde",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "guide.lorissigrist.useParaglideJsWithNextjsPagesRouter",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/use-paraglide-with-nextjs-pages-router/pages-router-logo.png",
    displayName: {
      en: "Use ParaglideJS with the NextJS Pages Router"
    },
    description: {
      en: "This guide covers how to integrate ParaglideJS into a NextJS project using the pages router. It will cover i18n routing and SEO Pitfalls and more!"
    },
    readme: {
      en: "./inlang/guides/use-paraglide-with-nextjs-pages-router/use-paraglide-with-nextjs-pages-router.md"
    },
    keywords: [
      "application",
      "developer",
      "paraglide",
      "i18n",
      "library",
      "localization",
      "sdk",
      "sdk-js",
      "react",
      "build",
      "javascript",
      "ide",
      "guide",
      "next",
      "nextjs",
      "react",
      "pages router",
      "i18n routing",
      "guides-developer"
    ],
    recommends: ["g/wxcebbig", "g/2fg8ng94", "g/00162hsd"],
    publisherName: "Loris Sigrist",
    publisherIcon: "https://avatars.githubusercontent.com/u/43482866?v=4",
    publisherLink: "https://github.com/LorisSigrist",
    license: "Apache-2.0"
  },
  {
    uniqueID: "3go4f04m",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "guide.niklasbuchfink.whatIsInlang",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/what-is-inlang/question-mark-logo.webp",
    displayName: {
      en: "What is inlang?"
    },
    description: {
      en: "Understand general concept of inlang ecosystem and its benefits."
    },
    readme: {
      en: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/what-is-inlang/what-is-inlang.md"
    },
    keywords: [
      "application",
      "website",
      "developer",
      "translator",
      "inlang",
      "getting-started",
      "i18n",
      "localization",
      "guide",
      "guides-general"
    ],
    recommends: ["g/00162hsd", "g/6ddyhpoi", "g/38fnf03n"],
    publisherName: "Niklas Buchfink",
    publisherIcon: "https://avatars.githubusercontent.com/u/59048346?v=4",
    license: "Apache-2.0"
  },
  {
    uniqueID: "ssryldhd",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "guide.nilsjacobsen.automationSystem",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/translation-automation/assets/logo.png",
    displayName: {
      en: "Translation Automation"
    },
    description: {
      en: "How can you achieve continuous translation?"
    },
    readme: {
      en: "./inlang/guides/translation-automation/README.md"
    },
    keywords: [
      "i18n",
      "developer",
      "translator",
      "designer",
      "editor",
      "contribute",
      "localization",
      "globalization",
      "internationalization",
      "guide",
      "ecosystem",
      "compatible",
      "ecosystem compatible",
      "automation",
      "system",
      "cli",
      "ci/cd",
      "build",
      "test",
      "svelte",
      "astro",
      "guides-change-control"
    ],
    recommends: ["g/oostafhs", "g/38fnf03n", "g/940fn8mg", "g/3go4f04m"],
    publisherName: "Nils Jacobsen",
    publisherIcon: "https://avatars.githubusercontent.com/u/58360188?s=96&v=4",
    publisherLink: "https://github.com/NilsJacobsen",
    license: "Apache-2.0"
  },
  {
    uniqueID: "2fg8ng94",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "guide.nilsjacobsen.buildAGlobalSvelteApp",
    icon: "https://avatars.githubusercontent.com/u/23617963?s=200&v=4",
    displayName: {
      en: "Build a Global Svelte App"
    },
    description: {
      en: "A complete guide on how to adopt inlang with paraglide.js and message-format-plugin"
    },
    readme: {
      en: "./inlang/guides/build-a-global-svelte-app/build-a-global-svelte-app.md"
    },
    keywords: [
      "libraries",
      "developer",
      "paraglide",
      "i18n",
      "library",
      "localization",
      "sdk",
      "sdk-js",
      "svelte",
      "javascript",
      "ide",
      "guide",
      "guides-developer"
    ],
    recommends: ["g/3go4f04m", "g/00162hsd", "g/wxcebbig", "g/uxohikde"],
    publisherName: "Nils Jacobsen",
    publisherIcon: "https://avatars.githubusercontent.com/u/58360188?s=96&v=4",
    publisherLink: "https://github.com/NilsJacobsen",
    license: "Apache-2.0"
  },
  {
    uniqueID: "6ddyhpoi",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "guide.nilsjacobsen.contributeTranslationsWithFink",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/contribute-translations-with-fink/bird-contribute.png?raw=true",
    displayName: {
      en: "Contribute Translations with Fink"
    },
    description: {
      en: "You can create or improve community translations through the Fink i18n editor."
    },
    readme: {
      en: "./inlang/guides/contribute-translations-with-fink/README.md"
    },
    keywords: [
      "i18n",
      "fink",
      "messages",
      "translations",
      "editor",
      "contribute",
      "localization",
      "globalization",
      "internationalization",
      "guide",
      "guides-translator"
    ],
    recommends: ["g/2fg8ng94", "g/00162hsd", "g/wxcebbig", "g/uxohikde"],
    publisherName: "Nils Jacobsen",
    publisherIcon: "https://avatars.githubusercontent.com/u/58360188?s=96&v=4",
    publisherLink: "https://github.com/NilsJacobsen",
    license: "Apache-2.0"
  },
  {
    uniqueID: "7777asdy",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "guide.nilsjacobsen.ecosystemCompatible",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/ecosystem-compatible/assets/compatible-badge.png",
    displayName: {
      en: "inlang ecosystem compatible"
    },
    description: {
      en: "What does this term mean and why is the approach important?"
    },
    readme: {
      en: "./inlang/guides/ecosystem-compatible/README.md"
    },
    keywords: [
      "i18n",
      "developer",
      "translator",
      "designer",
      "editor",
      "contribute",
      "localization",
      "globalization",
      "internationalization",
      "guide",
      "ecosystem",
      "compatible",
      "ecosystem compatible",
      "astro",
      "nextjs",
      "remix",
      "svelte",
      "guides-general"
    ],
    recommends: ["g/2fg8ng94", "g/00162hsd", "g/wxcebbig", "g/uxohikde"],
    publisherName: "Nils Jacobsen",
    publisherLink: "https://github.com/NilsJacobsen",
    publisherIcon: "https://avatars.githubusercontent.com/u/58360188?s=96&v=4",
    license: "Apache-2.0"
  },
  {
    uniqueID: "hhfueysj",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "guide.nilsjacobsen.nextIntlIdeExtension",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/next-intl-with-ide-extension/assets/iconv3.png",
    displayName: {
      en: "Setting Up next-intl with the Sherlock VS Code extension."
    },
    description: {
      en: "I'll walk you through the integration of the next-intl internationalization library with the Sherlock VS Code extension."
    },
    readme: {
      en: "./inlang/guides/next-intl-with-ide-extension/README.md"
    },
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/next-intl-with-ide-extension/assets/next-intl-guide.png"
    ],
    keywords: [
      "i18n",
      "developer",
      "translator",
      "designer",
      "editor",
      "contribute",
      "localization",
      "globalization",
      "internationalization",
      "guide",
      "ecosystem",
      "compatible",
      "ecosystem compatible",
      "next-intl",
      "vscode",
      "sherlock",
      "ide-extension",
      "guides-developer"
    ],
    recommends: ["g/2fg8ng94", "g/00162hsd", "g/wxcebbig", "g/uxohikde"],
    publisherName: "Nils Jacobsen",
    publisherIcon: "https://avatars.githubusercontent.com/u/58360188?s=96&v=4",
    publisherLink: "https://github.com/NilsJacobsen",
    license: "Apache-2.0"
  },
  {
    uniqueID: "oostafhs",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "guide.nilsjacobsen.reviewSystem",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/translation-review-system/assets/logo.png",
    displayName: {
      en: "Translation Review System"
    },
    description: {
      en: "The aim of this system is to meet specific standards for translations."
    },
    readme: {
      en: "./inlang/guides/translation-review-system/README.md"
    },
    keywords: [
      "i18n",
      "developer",
      "translator",
      "designer",
      "editor",
      "contribute",
      "localization",
      "globalization",
      "internationalization",
      "guide",
      "ecosystem",
      "compatible",
      "ecosystem compatible",
      "review",
      "system",
      "svelte",
      "astro",
      "guides-change-control"
    ],
    recommends: ["g/ssryldhd", "g/38fnf03n", "g/940fn8mg", "g/3go4f04m"],
    publisherName: "Nils Jacobsen",
    publisherIcon: "https://avatars.githubusercontent.com/u/58360188?s=96&v=4",
    publisherLink: "https://github.com/NilsJacobsen",
    license: "Apache-2.0"
  },
  {
    uniqueID: "00162hsd",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "guide.nilsjacobsen.whatArePlugins",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/what-are-plugins/electric-plug-logo.webp",
    displayName: {
      en: "What are Plugins?"
    },
    description: {
      en: "Discover the benefits of using plugins: freedom and low-cost adoption."
    },
    readme: {
      en: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/guides/what-are-plugins/what-are-plugins.md"
    },
    keywords: [
      "application",
      "website",
      "inlang",
      "getting-started",
      "guide",
      "plugins",
      "plugin",
      "svelte",
      "guides-developer"
    ],
    recommends: ["g/2fg8ng94", "g/00162hsd", "g/wxcebbig", "g/uxohikde"],
    publisherName: "Nils Jacobsen",
    publisherIcon: "https://avatars.githubusercontent.com/u/58360188?s=96&v=4",
    publisherLink: "https://github.com/NilsJacobsen",
    license: "Apache-2.0"
  },
  {
    uniqueID: "hheug211",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "library.amannn.nextintl",
    icon: "https://emojis.wiki/thumbs/emojis/globe-with-meridians.webp",
    gallery: ["https://github.com/amannn/next-intl/blob/main/media/logo.png?raw=true"],
    displayName: {
      en: "next-intl"
    },
    description: {
      en: "Internationalization (i18n) for Next.js that gets out of your way."
    },
    readme: {
      en: "./inlang/external-projects/next-intl/README.md"
    },
    keywords: [
      "libraries",
      "next-intl",
      "nextjs",
      "next",
      "react",
      "developer",
      "i18n",
      "external",
      "inlang",
      "unlisted"
    ],
    recommends: ["m/tdozzpar", "m/2qj2w8pu", "m/r7kp499g"],
    publisherName: "amannn",
    publisherIcon: "https://avatars.githubusercontent.com/u/4038316?v=4",
    website: "https://next-intl-docs.vercel.app",
    license: "MIT License"
  },
  {
    uniqueID: "fnhuwzrx",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "library.brikev.remix-paraglidejs",
    slug: "paraglide-remix-i18n",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo/inlang/external-projects/remix-paraglidejs/assets/remix.svg",
    displayName: {
      en: "Remix-ParaglideJS"
    },
    description: {
      en: "Remix utils and examples to work with ParaglideJS"
    },
    readme: {
      en: "https://cdn.jsdelivr.net/gh/BRIKEV/remix-paraglidejs/README.md"
    },
    keywords: [
      "libraries",
      "remix",
      "remix-run",
      "react",
      "developer",
      "i18n",
      "inlang",
      "community"
    ],
    recommends: ["m/tdozzpar", "m/2qj2w8pu", "m/r7kp499g"],
    publisherName: "BRIKEV",
    publisherIcon: "https://avatars.githubusercontent.com/u/59850028?v=4",
    publisherLink: "https://github.com/BRIKEV",
    website: "https://github.com/BRIKEV/remix-paraglidejs",
    license: "MIT License",
    pricing: "Free"
  },
  {
    uniqueID: "kl95463j",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "library.i18next.i18next",
    icon: "https://avatars.githubusercontent.com/u/8546082?s=200&v=4",
    gallery: [
      "https://github.com/i18next/i18next/blob/master/assets/i18next-ecosystem.jpg?raw=true"
    ],
    displayName: {
      en: "i18next library"
    },
    description: {
      en: "learn once - translate everywhere"
    },
    readme: {
      en: "./inlang/external-projects/i18next/README.md"
    },
    keywords: [
      "libraries",
      "i18next",
      "javascript",
      "developer",
      "i18n",
      "external",
      "inlang",
      "unlisted"
    ],
    recommends: ["m/3i8bor92", "m/tdozzpar", "m/2qj2w8pu", "m/r7kp499g"],
    publisherName: "i18next",
    publisherIcon: "https://avatars.githubusercontent.com/u/8546082?s=200&v=4",
    website: "https://www.i18next.com",
    license: "MIT License"
  },
  {
    uniqueID: "8y8sxj09",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "library.inlang.languageTag",
    icon: "https://images.emojiterra.com/google/android-12l/512px/1f4db.png",
    displayName: {
      en: "Language Tag"
    },
    description: {
      en: "A library containing BCP-47 language tags types and validators, used by inlang."
    },
    pages: {
      "/": "https://cdn.jsdelivr.net/gh/opral/monorepo@main/inlang/source-code/versioned-interfaces/language-tag/README.md"
    },
    keywords: [
      "libraries",
      "website",
      "developer",
      "lang",
      "language tag",
      "bcp-47",
      "validator",
      "interface",
      "types",
      "typescript",
      "library",
      "unlisted"
    ],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    license: "Apache-2.0"
  },
  {
    uniqueID: "gerre34r",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "library.inlang.paraglideJs",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/source-code/paraglide/paraglide-js/assets/paraglideNoBg.png",
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/source-code/paraglide/paraglide-js/assets/og.png",
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/paraglide-gallery/paraglide-gallery-image-1.jpg",
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/paraglide-gallery/paraglide-gallery-image-2.jpg",
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/paraglide-gallery/paraglide-gallery-image-3.jpg",
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/paraglide-gallery/paraglide-gallery-image-4.jpg"
    ],
    displayName: {
      en: "Paraglide JS"
    },
    description: {
      en: "Simple, adaptable and tiny i18n library that integrates with any framework"
    },
    pages: {
      "": {
        "/": "./inlang/source-code/paraglide/paraglide-js/docs/why-paraglide.md",
        "/getting-started": "./inlang/source-code/paraglide/paraglide-js/README.md",
        "/usage": "./inlang/source-code/paraglide/paraglide-js/docs/usage.md",
        "/scaling": "./inlang/source-code/paraglide/paraglide-js/docs/scaling.md",
        "/architecture": "./inlang/source-code/paraglide/paraglide-js/docs/architecture.md",
        "/changelog": "./inlang/source-code/paraglide/paraglide-js/CHANGELOG.md"
      },
      "Framework Libraries": {
        NextJS: "/m/osslbuzt/paraglide-next-i18n",
        SvelteKit: "/m/dxnzrydw/paraglide-sveltekit-i18n",
        Astro: "/m/iljlwzfs/paraglide-astro-i18n",
        SolidStart: "/m/n860p17j/paraglide-solidstart-i18n",
        Remix: "/m/fnhuwzrx/paraglide-remix-i18n",
        "/framework-libraries/build-your-own": "./inlang/source-code/paraglide/paraglide-js/docs/custom-framework-library.md"
      },
      Tooling: {
        "VsCode Extension": "/m/r7kp499g/app-inlang-ideExtension",
        "Machine Translation": "/m/2qj2w8pu/app-inlang-cli",
        "Translation Editor": "/m/tdozzpar/app-inlang-finkLocalizationEditor"
      }
    },
    keywords: [
      "paraglide js",
      "libraries",
      "apps",
      "website",
      "developer",
      "paraglide",
      "i18n",
      "library",
      "localization",
      "sdk",
      "sdk-js",
      "svelte",
      "react",
      "nextjs",
      "remix",
      "vue",
      "astro",
      "javascript",
      "solid",
      "typescript",
      "inlang"
    ],
    recommends: ["m/reootnfj", "m/632iow21", "m/r7kp499g", "m/teldgniy"],
    pricing: "free",
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    license: "Apache-2.0"
  },
  {
    uniqueID: "iljlwzfs",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "library.inlang.paraglideJsAdapterAstro",
    slug: "paraglide-astro-i18n",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/source-code/paraglide/paraglide-astro/assets/icon.svg",
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/source-code/paraglide/paraglide-astro/assets/og.png"
    ],
    displayName: {
      en: "Paraglide-Astro"
    },
    description: {
      en: "An Astro integration for ParaglideJS, providing you with everything you need to internationalize your Astro App"
    },
    pages: {
      "/": "./inlang/source-code/paraglide/paraglide-astro/README.md",
      "/changelog": "./inlang/source-code/paraglide/paraglide-astro/CHANGELOG.md"
    },
    keywords: [
      "paraglide js",
      "libraries",
      "website",
      "developer",
      "paraglide",
      "i18n",
      "library",
      "localization",
      "sdk",
      "sdk-js",
      "astro",
      "astro integration",
      "islands",
      "vite",
      "javascript",
      "typescript",
      "inlang"
    ],
    recommends: ["m/reootnfj", "m/632iow21", "m/r7kp499g", "m/teldgniy"],
    pricing: "free",
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    license: "Apache-2.0"
  },
  {
    uniqueID: "osslbuzt",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "library.inlang.paraglideJsAdapterNextJs",
    slug: "paraglide-next-i18n",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/source-code/paraglide/paraglide-next/assets/next-logo.svg",
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/source-code/paraglide/paraglide-next/assets/og.png"
    ],
    displayName: {
      en: "Paraglide-Next"
    },
    description: {
      en: "A NextJS integration for ParaglideJS, providing you with everything you need for i18n routing"
    },
    pages: {
      Setup: {
        "/": "./inlang/source-code/paraglide/paraglide-next/docs/why-paraglide-next.md",
        "/get-started": "./inlang/source-code/paraglide/paraglide-next/README.md"
      },
      "Localised Routing": {
        "/localized-routing/overview": "./inlang/source-code/paraglide/paraglide-next/docs/routing/overview.md",
        "/localized-routing/prefix-strategy": "./inlang/source-code/paraglide/paraglide-next/docs/routing/prefix-strategy.md",
        "/localized-routing/other-strategies": "./inlang/source-code/paraglide/paraglide-next/docs/routing/other-strategies.md"
      },
      "Advanced Usage": {
        "/advanced/seo": "./inlang/source-code/paraglide/paraglide-next/docs/advanced/seo.md",
        "/advanced/usage-on-the-server": "./inlang/source-code/paraglide/paraglide-next/docs/advanced/server.md"
      },
      Appendix: {
        "/pages-router": "./inlang/source-code/paraglide/paraglide-next/docs/pages-router.md",
        "/manual-setup": "./inlang/source-code/paraglide/paraglide-next/docs/manual-setup.md",
        "Vanilla ParaglideJS": "/m/gerre34r/library-inlang-paraglideJs",
        "/roadmap": "./inlang/source-code/paraglide/paraglide-next/docs/roadmap.md",
        "/changelog": "./inlang/source-code/paraglide/paraglide-next/CHANGELOG.md"
      }
    },
    keywords: [
      "paraglide js",
      "libraries",
      "website",
      "developer",
      "paraglide",
      "i18n",
      "library",
      "localization",
      "sdk",
      "sdk-js",
      "next",
      "next-js",
      "react",
      "vercel",
      "vite",
      "javascript",
      "typescript",
      "inlang"
    ],
    recommends: ["m/reootnfj", "m/632iow21", "m/r7kp499g", "m/teldgniy"],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    license: "Apache-2.0",
    pricing: "Free"
  },
  {
    uniqueID: "n860p17j",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "library.inlang.paraglideJsAdapterSolidStart",
    slug: "paraglide-solidstart-i18n",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/source-code/paraglide/paraglide-solidstart/assets/icon.png",
    displayName: {
      en: "Paraglide-SolidStart"
    },
    description: {
      en: "A SolidStart integration for ParaglideJS, providing you with everything you need to take your solid app global."
    },
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/source-code/paraglide/paraglide-solidstart/assets/og.png"
    ],
    pages: {
      "/": "./inlang/source-code/paraglide/paraglide-solidstart/README.md",
      "/changelog": "./inlang/source-code/paraglide/paraglide-solidstart/CHANGELOG.md"
    },
    keywords: [
      "paraglide js",
      "libraries",
      "website",
      "developer",
      "paraglide",
      "i18n",
      "library",
      "localization",
      "sdk",
      "sdk-js",
      "solid",
      "solid-start",
      "javascript",
      "typescript",
      "inlang"
    ],
    recommends: ["m/reootnfj", "m/632iow21", "m/r7kp499g", "m/teldgniy"],
    pricing: "free",
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    license: "Apache-2.0"
  },
  {
    uniqueID: "dxnzrydw",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "library.inlang.paraglideJsAdapterSvelteKit",
    slug: "paraglide-sveltekit-i18n",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/source-code/paraglide/paraglide-sveltekit/assets/icon.png",
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/source-code/paraglide/paraglide-sveltekit/assets/og.png"
    ],
    displayName: {
      en: "Paraglide-SvelteKit"
    },
    description: {
      en: "A SvelteKit integration for ParaglideJS, providing you with everything you need for i18n routing"
    },
    pages: {
      "": {
        "/": "./inlang/source-code/paraglide/paraglide-sveltekit/docs/why-paraglide.md",
        "/getting-started": "./inlang/source-code/paraglide/paraglide-sveltekit/README.md",
        "/localised-routing": "./inlang/source-code/paraglide/paraglide-sveltekit/docs/localised-routing.md",
        "/advanced-usage": "./inlang/source-code/paraglide/paraglide-sveltekit/docs/advanced-usage.md"
      },
      Appendix: {
        "/manual-setup": "./inlang/source-code/paraglide/paraglide-sveltekit/docs/manual-setup.md",
        "/roadmap-and-caveats": "./inlang/source-code/paraglide/paraglide-sveltekit/docs/roadmap.md",
        "/changelog": "./inlang/source-code/paraglide/paraglide-sveltekit/CHANGELOG.md",
        StackBlitz: "https://stackblitz.com/~/github.com/lorissigrist/paraglide-sveltekit-example"
      }
    },
    keywords: [
      "paraglide js",
      "libraries",
      "website",
      "developer",
      "paraglide",
      "i18n",
      "library",
      "localization",
      "sdk",
      "sdk-js",
      "svelte",
      "sveltekit",
      "vite",
      "javascript",
      "typescript",
      "inlang"
    ],
    recommends: ["m/reootnfj", "m/632iow21", "m/r7kp499g", "m/teldgniy"],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    license: "Apache-2.0",
    pricing: "Free"
  },
  {
    uniqueID: "ezdlll4o",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "library.inlang.translatable",
    icon: "https://images.emojiterra.com/google/noto-emoji/unicode-15/color/svg/1f310.svg",
    displayName: {
      en: "Translatable"
    },
    description: {
      en: "This library allows you to add translation logic to your application without having to rewrite large parts."
    },
    pages: {
      "/": "https://cdn.jsdelivr.net/gh/opral/monorepo@main/inlang/source-code/versioned-interfaces/translatable/README.md"
    },
    keywords: [
      "libraries",
      "website",
      "developer",
      "translatable",
      "adoptable",
      "interface",
      "types",
      "typescript",
      "library",
      "unlisted"
    ],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    license: "Apache-2.0"
  },
  {
    uniqueID: "kkfjusgu",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "library.kaisermann.svelte-i18n",
    icon: "https://avatars.githubusercontent.com/u/23617963?s=200&v=4",
    gallery: ["https://avatars.githubusercontent.com/u/23617963?s=200&v=4"],
    displayName: {
      en: "svelte-i18n"
    },
    description: {
      en: "Internationalization library for Svelte"
    },
    readme: {
      en: "./inlang/external-projects/svelte-i18n/README.md"
    },
    keywords: ["libraries", "developer", "i18n", "external", "unlisted"],
    recommends: ["m/tdozzpar", "m/2qj2w8pu", "m/r7kp499g", "m/gerre34r"],
    publisherName: "kaisermann",
    publisherIcon: "https://avatars.githubusercontent.com/u/12702016?v=4",
    website: "https://github.com/kaisermann/svelte-i18n",
    license: "MIT License"
  },
  {
    uniqueID: "29dg63g3",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "library.kazupon.vuei18n",
    icon: "https://raw.githubusercontent.com/kazupon/vue-i18n/ca513046480ecdb4565072a3b38ec0e2643f43e3/assets/vue-i18n-logo.svg",
    gallery: [
      "https://raw.githubusercontent.com/kazupon/vue-i18n/ca513046480ecdb4565072a3b38ec0e2643f43e3/assets/vue-i18n-logo.svg"
    ],
    displayName: {
      en: "Vue I18n"
    },
    description: {
      en: "Vue I18n is internationalization plugin for Vue.js"
    },
    readme: {
      en: "./inlang/external-projects/vue-i18n/README.md"
    },
    keywords: [
      "libraries",
      "vue-i18n",
      "vue",
      "javascript",
      "developer",
      "i18n",
      "external",
      "unlisted"
    ],
    recommends: ["m/tdozzpar", "m/2qj2w8pu", "m/r7kp499g", "m/gerre34r"],
    publisherName: "kazupon",
    publisherIcon: "https://avatars.githubusercontent.com/u/72989?v=4",
    website: "https://kazupon.github.io/vue-i18n",
    license: "MIT License"
  },
  {
    uniqueID: "j8f8f832",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "library.QuiiBz.nextinternational",
    icon: "https://github.com/QuiiBz/next-international/blob/main/assets/logo-black.png?raw=true",
    gallery: [
      "https://github.com/QuiiBz/next-international/blob/main/assets/logo-black.png?raw=true"
    ],
    displayName: {
      en: "next-international"
    },
    description: {
      en: "Type-safe internationalization (i18n) for Next.js"
    },
    readme: {
      en: "./inlang/external-projects/next-international/README.md"
    },
    keywords: [
      "libraries",
      "nextjs",
      "next",
      "javascript",
      "developer",
      "i18n",
      "external",
      "unlisted"
    ],
    recommends: ["m/tdozzpar", "m/2qj2w8pu", "m/r7kp499g"],
    publisherName: "QuiiBz",
    publisherIcon: "https://avatars.githubusercontent.com/u/43268759?v=4",
    website: "https://next-international.vercel.app",
    license: "MIT License"
  },
  {
    uniqueID: "ewkole66",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "messageLintRule.inlang.camelCaseId",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@main/inlang/source-code/message-lint-rules/camelCaseId/assets/icon.png",
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/camel_case_id-cover.jpg"
    ],
    displayName: {
      en: "Camel case id"
    },
    description: {
      en: "Checks for messages to have a camel case formatted message id (e.g. 'myMessage')."
    },
    pages: {
      "/": "./inlang/source-code/message-lint-rules/camelCaseId/README.md",
      "/changelog": "./inlang/source-code/message-lint-rules/camelCaseId/CHANGELOG.md"
    },
    keywords: ["message", "lint rule", "id", "format", "camel", "case", "website"],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    website: "https://manage.inlang.com/install?module=messageLintRule.inlang.camelCaseId",
    license: "Apache-2.0",
    module: "https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-camel-case-id@latest/dist/index.js"
  },
  {
    uniqueID: "y0eo8f66",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "messageLintRule.inlang.emptyPattern",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@main/inlang/source-code/message-lint-rules/emptyPattern/assets/icon.png",
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/empty_pattern-marketplace-cover.jpg"
    ],
    displayName: {
      en: "Empty pattern"
    },
    description: {
      en: "Checks for empty pattern in a language tag. If a message exists in the reference resource but the pattern in a target resource is empty, it is likely that the message has not been translated yet."
    },
    pages: {
      "/": "./inlang/source-code/message-lint-rules/emptyPattern/README.md",
      "/changelog": "./inlang/source-code/message-lint-rules/emptyPattern/CHANGELOG.md"
    },
    keywords: ["message", "lint rule", "empty pattern", "website"],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    website: "https://manage.inlang.com/install?module=messageLintRule.inlang.emptyPattern",
    license: "Apache-2.0",
    module: "https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-empty-pattern@latest/dist/index.js"
  },
  {
    uniqueID: "asvuch18",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "messageLintRule.inlang.identicalPattern",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@main/inlang/source-code/message-lint-rules/identicalPattern/assets/icon.png",
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/identical_pattern-marketplace-cover.jpg"
    ],
    displayName: {
      en: "Identical pattern"
    },
    description: {
      en: "Checks for identical patterns in different languages.  A message with identical wording in multiple languages can indicate that the translations are redundant or can be combined into a single message to reduce translation effort."
    },
    pages: {
      "/": "./inlang/source-code/message-lint-rules/identicalPattern/README.md",
      "/changelog": "./inlang/source-code/message-lint-rules/identicalPattern/CHANGELOG.md"
    },
    keywords: ["message", "lint rule", "itentical pattern", "website"],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    website: "https://manage.inlang.com/install?module=messageLintRule.inlang.identicalPattern",
    license: "Apache-2.0",
    module: "https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-identical-pattern@latest/dist/index.js"
  },
  {
    uniqueID: "10l6oyv1",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "messageLintRule.inlang.messageWithoutSource",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@main/inlang/source-code/message-lint-rules/messageWithoutSource/assets/icon.png",
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/without_source-marketplace-cover.jpg"
    ],
    displayName: {
      en: "Message without source"
    },
    description: {
      en: "Checks for likely outdated messages.  A message with a missing source is usually an indication that the message (id) is no longer used in source code, but messages have not been updated accordingly."
    },
    pages: {
      "/": "./inlang/source-code/message-lint-rules/messageWithoutSource/README.md",
      "/changelog": "./inlang/source-code/message-lint-rules/messageWithoutSource/CHANGELOG.md"
    },
    keywords: ["message", "lint rule", "source", "missing", "website"],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    website: "https://manage.inlang.com/install?module=messageLintRule.inlang.messageWithoutSource",
    license: "Apache-2.0",
    module: "https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-without-source@latest/dist/index.js"
  },
  {
    uniqueID: "4cxm3eqi",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "messageLintRule.inlang.missingTranslation",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@main/inlang/source-code/message-lint-rules/missingTranslation/assets/icon.png",
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/missing_translation-marketplace-cover.jpg"
    ],
    displayName: {
      en: "Missing translation"
    },
    description: {
      en: "Checks for missing variants for a specific languageTag.  If a variant exists for the sourceLanguageTag but is missing for a listed languageTag, it is likely that the message has not been translated for this languageTag yet."
    },
    pages: {
      "/": "./inlang/source-code/message-lint-rules/missingTranslation/README.md",
      "/changelog": "./inlang/source-code/message-lint-rules/missingTranslation/CHANGELOG.md"
    },
    keywords: ["message", "lint rule", "missing", "website"],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    website: "https://manage.inlang.com/install?module=messageLintRule.inlang.missingTranslation",
    license: "Apache-2.0",
    module: "https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-missing-translation@latest/dist/index.js"
  },
  {
    uniqueID: "gkerinvo",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "messageLintRule.inlang.snakeCaseId",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@main/inlang/source-code/message-lint-rules/snakeCaseId/assets/icon.png",
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/snake_case_id-cover.jpg"
    ],
    displayName: {
      en: "Snake case id"
    },
    description: {
      en: "Checks for messages to have a snake case formatted message id (e.g. 'my_message_id')."
    },
    pages: {
      "/": "./inlang/source-code/message-lint-rules/snakeCaseId/README.md",
      "/changelog": "./inlang/source-code/message-lint-rules/snakeCaseId/CHANGELOG.md"
    },
    keywords: ["message", "lint rule", "id", "format", "snake", "case", "website"],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    website: "https://manage.inlang.com/install?module=messageLintRule.inlang.snakeCaseId",
    license: "Apache-2.0",
    module: "https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-snake-case-id@latest/dist/index.js"
  },
  {
    uniqueID: "teldgniy",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "messageLintRule.inlang.validJsIdentifier",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@main/inlang/source-code/message-lint-rules/validJsIdentifier/assets/icon.png",
    gallery: [
      "https://cdn.jsdelivr.net/gh/opral/monorepo@latest/inlang/assets/marketplace/valid_js_identifier_id.jpg"
    ],
    displayName: {
      en: "Valid JS Identifier"
    },
    description: {
      en: "Make sure that all message IDs are valid JavaScript identifiers."
    },
    pages: {
      "/": "./inlang/source-code/message-lint-rules/validJsIdentifier/README.md",
      "/changelog": "./inlang/source-code/message-lint-rules/validJsIdentifier/CHANGELOG.md"
    },
    keywords: ["message", "lint rule", "javascript", "paraglide", "website"],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    website: "https://manage.inlang.com/install?module=messageLintRule.inlang.validJsIdentifier",
    license: "Apache-2.0",
    module: "https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-valid-js-identifier@latest/dist/index.js"
  },
  {
    uniqueID: "neh2d6w7",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    displayName: {
      en: "Xcode String Catalogs"
    },
    publisherIcon: "https://hechenbros.com/favicon.png",
    publisherLink: "https://hechenbros.com",
    id: "plugin.hechenbros.xcstrings",
    description: {
      en: "An inlang plugin to handle Xcode String Catalogs"
    },
    keywords: ["inlang", "plugin", "xcstrings", "xcode", "translation", "ios", "mac"],
    license: "MIT",
    module: "https://cdn.jsdelivr.net/npm/inlang-plugin-xcstrings@latest/out/index.js",
    readme: "https://cdn.jsdelivr.net/npm/inlang-plugin-xcstrings@latest/README.md",
    pages: {
      "/": "https://cdn.jsdelivr.net/npm/inlang-plugin-xcstrings@latest/README.md",
      "/changelog": "https://cdn.jsdelivr.net/npm/inlang-plugin-xcstrings@latest/CHANGELOG.md"
    },
    publisherName: "Hechenbros"
  },
  {
    uniqueID: "3i8bor92",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "plugin.inlang.i18next",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@main/inlang/source-code/plugins/i18next/assets/icon.png",
    displayName: {
      en: "i18next"
    },
    description: {
      en: "A plugin for inlang projects that works with i18next and reads + writes resources."
    },
    pages: {
      "/": "./inlang/source-code/plugins/i18next/README.md",
      "/changelog": "./inlang/source-code/plugins/i18next/CHANGELOG.md"
    },
    keywords: [
      "i18next",
      "javascript",
      "react",
      "nextjs",
      "website",
      "load",
      "save",
      "import",
      "export",
      "messages",
      "plugin",
      "svelte",
      "solid",
      "astro"
    ],
    recommends: ["m/tdozzpar", "m/2qj2w8pu", "m/r7kp499g", "m/gerre34r"],
    publisherName: "inlang",
    website: "https://manage.inlang.com/install?module=plugin.inlang.i18next",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    license: "Apache-2.0",
    module: "https://cdn.jsdelivr.net/npm/@inlang/plugin-i18next@latest/dist/index.js"
  },
  {
    uniqueID: "ig84ng0o",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "plugin.inlang.json",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@main/inlang/source-code/plugins/json/assets/icon.png",
    displayName: {
      en: "JSON translation files"
    },
    description: {
      en: "This plugin enables using JSON files for messages. It is not library specific and can be used with any framework."
    },
    pages: {
      "/": "./inlang/source-code/plugins/json/README.md",
      "/changelog": "./inlang/source-code/plugins/json/CHANGELOG.md"
    },
    keywords: [
      "json",
      "flutter",
      "generic",
      "website",
      "javascript",
      "load",
      "save",
      "import",
      "export",
      "messages",
      "plugin",
      "svelte",
      "nextjs",
      "solid",
      "astro"
    ],
    recommends: ["m/tdozzpar", "m/2qj2w8pu", "m/r7kp499g", "m/gerre34r"],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    website: "https://manage.inlang.com/install?module=plugin.inlang.json",
    license: "Apache-2.0",
    module: "https://cdn.jsdelivr.net/npm/@inlang/plugin-json@latest/dist/index.js"
  },
  {
    uniqueID: "reootnfj",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "plugin.inlang.messageFormat",
    displayName: {
      en: "inlang message format"
    },
    description: {
      en: "The simplest storage plugin for inlang."
    },
    pages: {
      "/": "./inlang/source-code/plugins/inlang-message-format/README.md",
      "/changelog": "./inlang/source-code/plugins/inlang-message-format/CHANGELOG.md"
    },
    keywords: [
      "website",
      "svelte",
      "react",
      "nextjs",
      "vue",
      "javascript",
      "storage",
      "save",
      "load",
      "import",
      "export",
      "messages",
      "plugin",
      "solid",
      "astro"
    ],
    recommends: ["m/tdozzpar", "m/2qj2w8pu", "m/r7kp499g", "m/gerre34r"],
    publisherName: "inlang",
    website: "https://manage.inlang.com/install?module=plugin.inlang.messageFormat",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    license: "Apache-2.0",
    module: "https://cdn.jsdelivr.net/npm/@inlang/plugin-message-format@latest/dist/index.js"
  },
  {
    uniqueID: "632iow21",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "plugin.inlang.mFunctionMatcher",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@main/inlang/source-code/plugins/m-function-matcher/assets/m.png",
    displayName: {
      en: "m-function-matcher"
    },
    description: {
      en: "Enables the inlang Visual Studio Code extension (Sherlock) to work with paraglide"
    },
    pages: {
      "/": "./inlang/source-code/plugins/m-function-matcher/README.md",
      "/changelog": "./inlang/source-code/plugins/m-function-matcher/CHANGELOG.md"
    },
    keywords: [
      "website",
      "vscode",
      "react",
      "nextjs",
      "sveltekit",
      "svelte",
      "vue",
      "plugin",
      "solid",
      "astro"
    ],
    recommends: ["m/tdozzpar", "m/2qj2w8pu", "m/r7kp499g", "m/gerre34r"],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    website: "https://manage.inlang.com/install?module=plugin.inlang.mFunctionMatcher",
    license: "Apache-2.0",
    module: "https://cdn.jsdelivr.net/npm/@inlang/plugin-m-function-matcher@latest/dist/index.js"
  },
  {
    uniqueID: "193hsyds",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "plugin.inlang.nextIntl",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@main/inlang/source-code/plugins/next-intl/assets/plugin-next-intl-logo.png",
    displayName: {
      en: "next-intl plugin"
    },
    description: {
      en: "A plugin to make next-intl ecosystem compatible with inlang"
    },
    pages: {
      "/": "./inlang/source-code/plugins/next-intl/README.md",
      "/changelog": "./inlang/source-code/plugins/next-intl/CHANGELOG.md"
    },
    keywords: [
      "next-intl",
      "javascript",
      "react",
      "nextjs",
      "website",
      "load",
      "save",
      "import",
      "export",
      "messages",
      "plugin"
    ],
    recommends: ["m/tdozzpar", "m/2qj2w8pu", "m/r7kp499g", "m/gerre34r"],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    website: "https://manage.inlang.com/install?module=plugin.inlang.nextIntl",
    license: "Apache-2.0",
    module: "https://cdn.jsdelivr.net/npm/@inlang/plugin-next-intl@latest/dist/index.js"
  },
  {
    uniqueID: "wrh36dfb",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "plugin.inlang.sapUI5",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@main/inlang/source-code/plugins/sap-ui5/assets/icon.png",
    displayName: {
      en: "SAP UI5 plugin"
    },
    description: {
      en: "Enables the inlang Visual Studio Code extension (Sherlock) to work with SAP UI5"
    },
    pages: {
      "/": "./inlang/source-code/plugins/sap-ui5/README.md",
      "/changelog": "./inlang/source-code/plugins/sap-ui5/CHANGELOG.md"
    },
    keywords: ["website", "vscode", "sap", "sapui5", "plugin"],
    recommends: ["m/tdozzpar", "m/2qj2w8pu", "m/r7kp499g", "m/gerre34r"],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    website: "https://manage.inlang.com/install?module=plugin.inlang.sapUI5",
    license: "Apache-2.0",
    module: "https://cdn.jsdelivr.net/npm/@inlang/plugin-sap-ui5@latest/dist/index.js"
  },
  {
    uniqueID: "698iow33",
    $schema: "https://inlang.com/schema/marketplace-manifest",
    id: "plugin.inlang.tFunctionMatcher",
    icon: "https://cdn.jsdelivr.net/gh/opral/monorepo@main/inlang/source-code/plugins/t-function-matcher/assets/t.png",
    displayName: {
      en: "t-function-matcher"
    },
    description: {
      en: "Enables the inlang Visual Studio Code extension (Sherlock) to work with t-functions"
    },
    pages: {
      "/": "./inlang/source-code/plugins/t-function-matcher/README.md",
      "/changelog": "./inlang/source-code/plugins/t-function-matcher/CHANGELOG.md"
    },
    keywords: [
      "website",
      "vscode",
      "react",
      "nextjs",
      "sveltekit",
      "svelte",
      "vue",
      "plugin",
      "solid",
      "astro"
    ],
    recommends: ["m/r7kp499g", "m/3i8bor92"],
    publisherName: "inlang",
    publisherIcon: "https://inlang.com/favicon/safari-pinned-tab.svg",
    website: "https://manage.inlang.com/install?module=plugin.inlang.tFunctionMatcher",
    license: "Apache-2.0",
    module: "https://cdn.jsdelivr.net/npm/@inlang/plugin-t-function-matcher@latest/dist/index.js"
  }
];

// src/stories/field-header.ts
var FieldHeader = class extends s3 {
  constructor() {
    super(...arguments);
    this.optional = false;
  }
  render() {
    return x` <div class="header">
			${this.fieldTitle && x`<h3 part="property-title">
				${this.fieldTitle}${this.optional ? x`<span class="optinal">${" (optional)"}</span>` : ""}
			</h3>`}
			${this.description && x`<p part="property-paragraph" class="help-text">${this.description}</p>`}
			${this.examples ? x`<div class="example-container">
						<p class="help-text">Examples:</p>
						${this.examples.map((example) => x`<p class="example">${example}</p>`)}
				  </div>` : ``}
		</div>`;
  }
};
FieldHeader.styles = [
  //baseStyling,
  i`
			.header {
				display: flex;
				flex-direction: column;
				gap: 4px;
			}
			h3 {
				margin: 0;
				font-size: 14px;
				font-weight: 800;
				line-height: 1.5;
			}
			.help-text {
				font-size: 14px;
				color: var(--sl-input-help-text-color);
				margin: 0;
				line-height: 1.5;
			}
			.optinal {
				font-size: 14px;
				font-style: italic;
				font-weight: 500;
				color: var(--sl-input-help-text-color);
			}
			.example-container {
				display: flex;
				flex-wrap: wrap;
				gap: 4px;
			}
			.example {
				background-color: var(--sl-input-background-color-disabled);
				width: fit-content;
				padding: 0px 6px;
				border-radius: 2px;
				font-size: 14px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: var(--sl-input-color-disabled);
				margin: 0;
				line-height: 1.5;
			}
		`
];
__decorateClass([
  n4()
], FieldHeader.prototype, "fieldTitle", 2);
__decorateClass([
  n4()
], FieldHeader.prototype, "description", 2);
__decorateClass([
  n4({ type: Array })
], FieldHeader.prototype, "examples", 2);
__decorateClass([
  n4({ type: Boolean })
], FieldHeader.prototype, "optional", 2);
FieldHeader = __decorateClass([
  t3("field-header")
], FieldHeader);

// src/stories/input-fields/string/string-input.ts
var StringInput = class extends s3 {
  constructor() {
    super(...arguments);
    this.property = "";
    this.value = "";
    this.schema = {};
    this.required = false;
    this.handleInlangProjectChange = () => {
    };
  }
  get _description() {
    return this.schema.description || void 0;
  }
  get _examples() {
    return this.schema.examples;
  }
  get _title() {
    return this.schema.title || void 0;
  }
  render() {
    return x` <div part="property" class="property">
			<field-header
				.fieldTitle=${this._title ? this._title : this.property}
				.description=${this._description}
				.examples=${this._examples}
				.optional=${this.required ? false : true}
				exportparts="property-title, property-paragraph"
			></field-header>
			<sl-input
				value=${this.value}
				size="small"
				@input=${(e11) => {
      this.handleInlangProjectChange(
        e11.target.value,
        this.property,
        this.moduleId
      );
    }}
			>
			</sl-input>
		</div>`;
  }
};
StringInput.styles = [
  i`
			.property {
				display: flex;
				flex-direction: column;
				gap: 12px;
			}
			h3 {
				margin: 0;
				font-size: 14px;
				font-weight: 800;
			}
			.help-text {
				font-size: 14px;
				color: var(--sl-input-help-text-color);
				margin: 0;
				line-height: 1.5;
			}
			.description-container {
				display: flex;
				flex-direction: column;
				gap: 4px;
			}
		`
];
__decorateClass([
  n4()
], StringInput.prototype, "property", 2);
__decorateClass([
  n4()
], StringInput.prototype, "moduleId", 2);
__decorateClass([
  n4()
], StringInput.prototype, "value", 2);
__decorateClass([
  n4()
], StringInput.prototype, "schema", 2);
__decorateClass([
  n4()
], StringInput.prototype, "required", 2);
__decorateClass([
  n4()
], StringInput.prototype, "handleInlangProjectChange", 2);
StringInput = __decorateClass([
  t3("string-input")
], StringInput);

// src/stories/input-fields/array/default-array-input.ts
var DefaultArrayInput = class extends s3 {
  constructor() {
    super(...arguments);
    this.property = "";
    this.value = [];
    this.schema = {};
    this.required = false;
    this.handleInlangProjectChange = () => {
    };
    this._inputValue = void 0;
  }
  get _description() {
    return this.schema.description || void 0;
  }
  get _title() {
    return this.schema.title || void 0;
  }
  handleInputChange(e11) {
    const inputElement = e11.target;
    this._inputValue = inputElement.value;
  }
  handleAddItemClick() {
    if (this._inputValue && this._inputValue.trim() !== "") {
      this.value ? this.value.push(this._inputValue) : this.value = [this._inputValue];
      this.handleInlangProjectChange(this.value, this.property, this.moduleId);
      this._inputValue = "null";
      this._inputValue = void 0;
    }
  }
  handleDeleteItemClick(index) {
    if (this.value) {
      this.value.splice(index, 1);
      this.handleInlangProjectChange(this.value, this.property, this.moduleId);
      this._inputValue = "null";
      this._inputValue = void 0;
    }
  }
  render() {
    return x`<div part="property" class="property">
			<field-header
				.fieldTitle=${this._title ? this._title : this.property}
				.description=${this._description}
				.optional=${this.required ? false : true}
				exportparts="property-title, property-paragraph"
			></field-header>
			${this.value && this.value.length > 0 ? x`<div class="item-container">
						${this.value.map((arrayItem, index) => {
      return x`<sl-input
								class="disabled-input"
								size="small"
								value=${arrayItem}
								disabled
								filled
							>
								<div
									slot="suffix"
									class="icon-wrapper"
									@click=${() => {
        this.handleDeleteItemClick(index);
      }}
								>
									<svg class="icon" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
										<path
											xmlns="http://www.w3.org/2000/svg"
											d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
										/>
									</svg>
								</div>
							</sl-input>`;
    })}
				  </div>` : void 0}
			<div class="new-line-container">
				<sl-input
					class="add-input"
					size="small"
					placeholder="Add new item"
					@input=${(e11) => this.handleInputChange(e11)}
					@keydown=${(e11) => {
      if (e11.key === "Enter") {
        this.handleAddItemClick();
      }
    }}
					value=${this._inputValue}
				>
				</sl-input>
				<sl-button
					exportparts="base:button"
					size="small"
					variant="neutral"
					@click=${() => {
      this.handleAddItemClick();
    }}
				>
					Add
				</sl-button>
			</div>
		</div>`;
  }
};
DefaultArrayInput.styles = [
  i`
			.property {
				display: flex;
				flex-direction: column;
				gap: 12px;
			}
			.item-container {
				display: flex;
				flex-direction: column;
				gap: 4px;
				padding-bottom: 8px;
			}
			.disabled-input::part(base) {
				cursor: unset;
				opacity: 1;
			}
			.disabled-input::part(suffix) {
				cursor: pointer;
				opacity: 0.5;
			}
			.disabled-input::part(suffix):hover {
				opacity: 1;
			}
			.add-input {
				flex-grow: 1;
			}
			.add-input::part(suffix) {
				cursor: pointer;
			}
			.new-line-container {
				display: flex;
				gap: 4px;
			}
			.icon-wrapper {
				display: flex;
			}
		`
];
__decorateClass([
  n4()
], DefaultArrayInput.prototype, "property", 2);
__decorateClass([
  n4()
], DefaultArrayInput.prototype, "moduleId", 2);
__decorateClass([
  n4()
], DefaultArrayInput.prototype, "value", 2);
__decorateClass([
  n4()
], DefaultArrayInput.prototype, "schema", 2);
__decorateClass([
  n4()
], DefaultArrayInput.prototype, "required", 2);
__decorateClass([
  n4()
], DefaultArrayInput.prototype, "handleInlangProjectChange", 2);
__decorateClass([
  r6()
], DefaultArrayInput.prototype, "_inputValue", 2);
DefaultArrayInput = __decorateClass([
  t3("default-array-input")
], DefaultArrayInput);

// src/stories/input-fields/array/lint-config-array-input.ts
import "@inlang/sdk/v2";
var LintConfigArrayInput = class extends s3 {
  constructor() {
    super(...arguments);
    this.property = "";
    this.schema = {};
    this.required = false;
    this.handleInlangProjectChange = () => {
    };
  }
  get _description() {
    return this.schema.description || void 0;
  }
  get _title() {
    return this.schema.title || void 0;
  }
  get _levelOptions() {
    return this.schema.items.properties["level"].anyOf.map((level) => level.const);
  }
  _getConfigLevel(moduleId) {
    return this.value?.find((config) => config.ruleId === moduleId)?.level || "warning";
  }
  _getDisplayName(displayName) {
    if (typeof displayName === "string") {
      return displayName;
    }
    return displayName?.en;
  }
  handleUpdate(moduleId, value) {
    if (moduleId && value) {
      console.log(this.value);
      if (!this.value) {
        this.value = [];
      }
      const configIndex = this.value.findIndex((config) => {
        console.log("ruleId", config.ruleId, "moduleId", moduleId);
        return config.ruleId === moduleId;
      });
      console.log(configIndex);
      if (configIndex !== -1 && this.value[configIndex]) {
        this.value[configIndex].level = value;
      } else {
        this.value.push({ ruleId: moduleId, level: value });
      }
      this.handleInlangProjectChange(this.value, this.property, this.moduleId);
    }
  }
  render() {
    return this.modules && this.modules.some((module) => module.id.split(".")[0] !== "plugin") ? x` <div part="property" class="property">
					<div class="title-container">
						<field-header
							.fieldTitle=${this._title ? this._title : this.property}
							.description=${this._description}
							.optional=${this.required ? false : true}
							exportparts="property-title, property-paragraph"
						></field-header>
					</div>
					<div class="container">
						${this.modules && this.modules.map((module) => {
      return module.id.split(".")[0] !== "plugin" ? x`<div class="rule-container">
										<sl-select
											id=${module.id}
											exportparts="listbox:option-wrapper"
											value=${this._getConfigLevel(module.id) || "warning"}
											placeholder="warning"
											class="select"
											size="small"
											@sl-change=${(e11) => {
        this.handleUpdate(
          module.id,
          e11.target.value
        );
      }}
										>
											${this._getConfigLevel(module.id) === "error" ? x`<svg
														class="level-icon danger"
														slot="prefix"
														width="20"
														height="20"
														viewBox="0 0 24 24"
												  >
														<path
															fill="currentColor"
															d="M12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17m0-4q.425 0 .713-.288T13 12V8q0-.425-.288-.712T12 7t-.712.288T11 8v4q0 .425.288.713T12 13m0 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
														/>
												  </svg>` : x`<svg
														class="level-icon"
														slot="prefix"
														width="20"
														height="20"
														viewBox="0 0 24 24"
												  >
														<path
															fill="currentColor"
															d="M12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17m0-4q.425 0 .713-.288T13 12V8q0-.425-.288-.712T12 7t-.712.288T11 8v4q0 .425.288.713T12 13m0 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
														/>
												  </svg>`}
											${this._levelOptions?.map((option) => {
        return x`<sl-option
													exportparts="base:option"
													value=${option}
													class="add-item-side"
												>
													${option}
												</sl-option>`;
      })}
										</sl-select>
										<p class="ruleId">${this._getDisplayName(module.displayName)}</p>
								  </div>` : void 0;
    })}
					</div>
			  </div>` : void 0;
  }
};
LintConfigArrayInput.styles = [
  i`
			.property {
				display: flex;
				flex-direction: column;
				gap: 12px;
			}
			.container {
				display: flex;
				flex-direction: column;
				padding-top: 8px;
				gap: 12px;
			}
			.ruleId {
				font-size: 0.8rem;
				margin: 0;
				color: var(--sl-input-color);
			}
			.rule-container {
				display: flex;
				align-items: center;
				gap: 12px;
				flex-wrap: wrap;
			}
			.select {
				max-width: 140px;
				min-width: 100px;
			}
			.title-container {
				display: flex;
				gap: 8px;
			}
			sl-select::part(expand-icon) {
				color: var(--sl-input-placeholder-color);
			}
			sl-select::part(expand-icon):hover {
				color: var(--sl-input-color);
			}
			sl-select::part(base):hover {
				border: var(--sl-input-placeholder-color);
			}
			.level-icon {
				color: var(--sl-color-neutral-400);
				margin-top: 1px;
				margin-right: 6px;
			}
			.level-icon.danger {
				color: var(--sl-color-danger-600);
			}
		`
];
__decorateClass([
  n4()
], LintConfigArrayInput.prototype, "property", 2);
__decorateClass([
  n4()
], LintConfigArrayInput.prototype, "moduleId", 2);
__decorateClass([
  n4()
], LintConfigArrayInput.prototype, "modules", 2);
__decorateClass([
  n4()
], LintConfigArrayInput.prototype, "value", 2);
__decorateClass([
  n4()
], LintConfigArrayInput.prototype, "schema", 2);
__decorateClass([
  n4()
], LintConfigArrayInput.prototype, "required", 2);
__decorateClass([
  n4()
], LintConfigArrayInput.prototype, "handleInlangProjectChange", 2);
LintConfigArrayInput = __decorateClass([
  t3("lint-config-array-input")
], LintConfigArrayInput);

// src/stories/input-fields/array/languageTags-input.ts
var LanguageTagsInput = class extends s3 {
  constructor() {
    super(...arguments);
    this.property = "";
    this.value = [];
    this.schema = {};
    this.required = false;
    this.handleInlangProjectChange = () => {
    };
    this._inputValue = void 0;
  }
  get _description() {
    return this.schema.description || void 0;
  }
  get _title() {
    return this.schema.title || void 0;
  }
  handleInputChange(e11) {
    const inputElement = e11.target;
    this._inputValue = inputElement.value;
  }
  handleAddItemClick() {
    if (this._inputValue && this._inputValue.trim() !== "") {
      this.value ? this.value.push(this._inputValue) : this.value = [this._inputValue];
      this.handleInlangProjectChange(this.value, this.property, this.moduleId);
      this._inputValue = "null";
      this._inputValue = void 0;
    }
  }
  handleDeleteItemClick(index) {
    if (this.value) {
      this.value.splice(index, 1);
      this.handleInlangProjectChange(this.value, this.property, this.moduleId);
      this._inputValue = "null";
      this._inputValue = void 0;
    }
  }
  render() {
    return x`<div part="property" class="property">
			<field-header
				.fieldTitle=${this._title ? this._title : this.property}
				.description=${this._description}
				.optional=${this.required ? false : true}
				exportparts="property-title, property-paragraph"
			></field-header>
			<div class="tags-container">
				${this.value && this.value.map((arrayItem, index) => {
      return x`
						<sl-tag
							@sl-remove=${() => {
        this.handleDeleteItemClick(index);
      }}
							removable
							size="small"
							>${arrayItem}</sl-tag
						>
					`;
    })}
			</div>
			<div class="new-line-container">
				<sl-input
					class="add-input"
					size="small"
					placeholder="Enter languageTag ..."
					@input=${(e11) => this.handleInputChange(e11)}
					@keydown=${(e11) => {
      if (e11.key === "Enter") {
        this.handleAddItemClick();
      }
    }}
					value=${this._inputValue}
				>
				</sl-input>
				<sl-button
					exportparts="base:button"
					size="small"
					variant="neutral"
					@click=${() => {
      this.handleAddItemClick();
    }}
				>
					Add
				</sl-button>
			</div>
		</div>`;
  }
};
LanguageTagsInput.styles = [
  i`
			.property {
				display: flex;
				flex-direction: column;
				gap: 12px;
			}
			.tags-container {
				display: flex;
				flex-wrap: wrap;
				gap: 4px;
			}
			.disabled-input::part(base) {
				cursor: unset;
				opacity: 1;
			}
			.disabled-input::part(suffix) {
				cursor: pointer;
				opacity: 0.5;
			}
			.disabled-input::part(suffix):hover {
				opacity: 1;
			}
			.add-input {
				flex-grow: 1;
			}
			.add-input::part(suffix) {
				cursor: pointer;
			}
			.new-line-container {
				display: flex;
				gap: 4px;
			}
			sl-tag::part(base) {
				background-color: var(--sl-input-filled-background-color-disabled);
				color: var(--sl-input-color);
				border-color: transparent;
				border-radius: var(--sl-input-border-radius-small);
			}
			sl-tag::part(remove-button) {
				color: var(--sl-input-placeholder-color);
			}
			sl-tag::part(remove-button):hover {
				color: var(--sl-input-color);
			}
		`
];
__decorateClass([
  n4()
], LanguageTagsInput.prototype, "property", 2);
__decorateClass([
  n4()
], LanguageTagsInput.prototype, "moduleId", 2);
__decorateClass([
  n4()
], LanguageTagsInput.prototype, "value", 2);
__decorateClass([
  n4()
], LanguageTagsInput.prototype, "schema", 2);
__decorateClass([
  n4()
], LanguageTagsInput.prototype, "required", 2);
__decorateClass([
  n4()
], LanguageTagsInput.prototype, "handleInlangProjectChange", 2);
__decorateClass([
  r6()
], LanguageTagsInput.prototype, "_inputValue", 2);
LanguageTagsInput = __decorateClass([
  t3("language-tags-input")
], LanguageTagsInput);

// src/stories/input-fields/array/reference-pattern-input.ts
var ReferencePatternInput = class extends s3 {
  constructor() {
    super(...arguments);
    this.property = "";
    this.value = [];
    this.schema = {};
    this.required = false;
    this.handleInlangProjectChange = () => {
    };
  }
  get _description() {
    return this.schema.description || void 0;
  }
  get _title() {
    return this.schema.title || void 0;
  }
  get _examples() {
    return this.schema.examples;
  }
  render() {
    return x`<div part="property" class="property">
			<field-header
				.fieldTitle=${this._title ? this._title : this.property}
				.description=${this._description}
				.examples=${this._examples}
				.optional=${this.required ? false : true}
				exportparts="property-title, property-paragraph"
			></field-header>
			<div class="new-line-container">
				<sl-input
					class="add-input"
					size="small"
					label="Opening pattern"
					placeholder="Enter pattern ..."
					value=${this.value ? this.value[0] : ""}
					@input=${(e11) => {
      if (this.value === void 0)
        this.value = [];
      this.value[0] = e11.target.value;
      this.handleInlangProjectChange(this.value, this.property, this.moduleId);
    }}
				>
				</sl-input>
				<sl-input
					class="add-input"
					size="small"
					label="Closing pattern"
					placeholder="Enter pattern ..."
					?disabled=${!this.value}
					value=${this.value ? this.value[1] : ""}
					@input=${(e11) => {
      if (this.value === void 0)
        this.value = [];
      this.value[1] = e11.target.value;
      this.handleInlangProjectChange(this.value, this.property, this.moduleId);
    }}
				>
				</sl-input>
			</div>
		</div>`;
  }
};
ReferencePatternInput.styles = [
  i`
			.property {
				display: flex;
				flex-direction: column;
				gap: 12px;
			}
			.disabled-input::part(base) {
				cursor: unset;
				opacity: 1;
			}
			.disabled-input::part(suffix) {
				cursor: pointer;
				opacity: 0.5;
			}
			.disabled-input::part(suffix):hover {
				opacity: 1;
			}
			.add-input::part(form-control-label) {
				color: var(--sl-input-help-text-color);
				font-size: 0.8rem;
				padding-left: 0.2rem;
				padding-bottom: 0.2rem;
			}
			.add-input {
				flex-grow: 1;
			}
			.add-input::part(suffix) {
				cursor: pointer;
			}
			.new-line-container {
				display: flex;
				gap: 4px;
			}
			sl-input::part(input) {
				width: inherit;
			}
		`
];
__decorateClass([
  n4()
], ReferencePatternInput.prototype, "property", 2);
__decorateClass([
  n4()
], ReferencePatternInput.prototype, "moduleId", 2);
__decorateClass([
  n4()
], ReferencePatternInput.prototype, "value", 2);
__decorateClass([
  n4()
], ReferencePatternInput.prototype, "schema", 2);
__decorateClass([
  n4()
], ReferencePatternInput.prototype, "required", 2);
__decorateClass([
  n4()
], ReferencePatternInput.prototype, "handleInlangProjectChange", 2);
ReferencePatternInput = __decorateClass([
  t3("reference-pattern-input")
], ReferencePatternInput);

// src/stories/input-fields/array/array-input.ts
var ArrayInput = class extends s3 {
  constructor() {
    super(...arguments);
    this.property = "";
    this.value = [];
    this.schema = {};
    this.required = false;
    this.handleInlangProjectChange = () => {
    };
  }
  render() {
    const schemaPattern = this.schema.items.pattern;
    if (schemaPattern && schemaPattern === "^((?<grandfathered>(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))|((?<language>([A-Za-z]{2,3}(-(?<extlang>[A-Za-z]{3}(-[A-Za-z]{3}){0,2}))?))(-(?<script>[A-Za-z]{4}))?(-(?<region>[A-Za-z]{2}|[0-9]{3}))?(-(?<variant>[A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3}))*))$") {
      return x`
				<language-tags-input
					exportparts="property, property-title, property-paragraph, button"
					.property=${this.property}
					.moduleId=${this.moduleId}
					.value=${this.value}
					.schema=${this.schema}
					.handleInlangProjectChange=${this.handleInlangProjectChange}
					.required=${this.required}
				></language-tags-input>
			`;
    } else if (this.property === "variableReferencePattern") {
      return x`
				<reference-pattern-input
					exportparts="property, property-title, property-paragraph"
					.property=${this.property}
					.moduleId=${this.moduleId}
					.value=${this.value}
					.schema=${this.schema}
					.handleInlangProjectChange=${this.handleInlangProjectChange}
					.required=${this.required}
				></reference-pattern-input>
			`;
    } else if (this.property === "lintConfig") {
      return x`
				<lint-config-array-input
					exportparts="property, property-title, property-paragraph"
					.property=${this.property}
					.moduleId=${this.moduleId}
					.modules=${this.modules}
					.value=${this.value}
					.schema=${this.schema}
					.handleInlangProjectChange=${this.handleInlangProjectChange}
					.required=${this.required}
				></lint-config-array-input>
			`;
    } else {
      return x`
				<default-array-input
					exportparts="property, property-title, property-paragraph, button"
					.property=${this.property}
					.moduleId=${this.moduleId}
					.value=${this.value}
					.schema=${this.schema}
					.handleInlangProjectChange=${this.handleInlangProjectChange}
					.required=${this.required}
				></default-array-input>
			`;
    }
  }
};
__decorateClass([
  n4()
], ArrayInput.prototype, "property", 2);
__decorateClass([
  n4()
], ArrayInput.prototype, "moduleId", 2);
__decorateClass([
  n4()
], ArrayInput.prototype, "modules", 2);
__decorateClass([
  n4()
], ArrayInput.prototype, "value", 2);
__decorateClass([
  n4()
], ArrayInput.prototype, "schema", 2);
__decorateClass([
  n4()
], ArrayInput.prototype, "required", 2);
__decorateClass([
  n4()
], ArrayInput.prototype, "handleInlangProjectChange", 2);
ArrayInput = __decorateClass([
  t3("array-input")
], ArrayInput);

// src/stories/input-fields/object/object-input.ts
import "@inlang/sdk";

// src/stories/input-fields/object/default-object-input.ts
import "@inlang/sdk";
var DefaultObjectInput = class extends s3 {
  constructor() {
    super(...arguments);
    this.property = "";
    this.keyPlaceholder = "Enter key";
    this.valuePlaceholder = "Enter value";
    this.value = {};
    this.schema = {};
    this.withTitle = true;
    this.withDescription = true;
    this.required = false;
    this.handleInlangProjectChange = () => {
    };
    this._inputValue = void 0;
    this._inputKey = void 0;
  }
  get _description() {
    return this.schema.description || void 0;
  }
  get _title() {
    return this.schema.title || void 0;
  }
  handleAddItemClick() {
    if (this._inputValue && this._inputKey && this._inputValue.trim() !== "" && this._inputKey.trim() !== "") {
      if (!this.value) {
        this.value = {};
      }
      this.value[this._inputKey] = this._inputValue;
      this.handleInlangProjectChange(this.value, this.property, this.moduleId);
      this._inputValue = "null";
      this._inputValue = void 0;
      this._inputKey = "null";
      this._inputKey = void 0;
    }
  }
  handleDeleteItemClick(key) {
    if (this.value) {
      delete this.value[key];
      this.handleInlangProjectChange(this.value, this.property, this.moduleId);
      this._inputValue = "null";
      this._inputValue = void 0;
      this._inputKey = "null";
      this._inputKey = void 0;
    }
  }
  render() {
    return x` <div part="property" class="property">
			<field-header
				.fieldTitle=${this.withTitle ? this._title ? this._title : this.property : void 0}
				.description=${this.withDescription ? this._description : ``}
				.optional=${this.required ? false : true}
				exportparts="property-title, property-paragraph"
			></field-header>
			${this.value ? x`<div class="list-container">
						${this.value && Object.entries(this.value).map(([key, value]) => {
      return x`<div class="add-item-container">
								<sl-input
									class="disabled-input add-item-side"
									size="small"
									value=${key}
									disabled
									filled
								>
								</sl-input>
								<sl-input
									class="disabled-input add-item-side"
									size="small"
									value=${value}
									disabled
									filled
								>
								</sl-input>
								<div class="remove-icon">
									<div
										@click=${() => {
        this.handleDeleteItemClick(key);
      }}
									>
										<svg
											class="icon"
											width="16"
											height="16"
											fill="currentColor"
											viewBox="0 0 16 16"
										>
											<path
												xmlns="http://www.w3.org/2000/svg"
												d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
											/>
										</svg>
									</div>
								</div>
							</div>`;
    })}
				  </div>` : ``}
			<div class="add-item-container">
				<sl-input
					class="add-item-side"
					placeholder=${this.keyPlaceholder}
					size="small"
					@input=${(e11) => {
      this._inputKey = e11.target.value;
    }}
					@keydown=${(e11) => {
      if (e11.key === "Enter") {
        this.handleAddItemClick();
      }
    }}
					value=${this._inputKey}
				>
				</sl-input>
				<sl-input
					class="add-item-side"
					placeholder=${this.valuePlaceholder}
					size="small"
					@input=${(e11) => {
      this._inputValue = e11.target.value;
    }}
					@keydown=${(e11) => {
      if (e11.key === "Enter") {
        this.handleAddItemClick();
      }
    }}
					value=${this._inputValue}
				>
				</sl-input>
				<sl-button
					exportparts="base:button"
					size="small"
					variant="neutral"
					@click=${() => {
      this.handleAddItemClick();
    }}
				>
					Add
				</sl-button>
			</div>
		</div>`;
  }
};
DefaultObjectInput.styles = [
  i`
			.property {
				display: flex;
				flex-direction: column;
				gap: 12px;
			}
			.disabled-input::part(base) {
				cursor: unset;
				opacity: 1;
			}
			.disabled-input::part(suffix) {
				cursor: pointer;
				opacity: 0.5;
			}
			.disabled-input::part(suffix):hover {
				opacity: 1;
			}
			.add-input::part(suffix) {
				cursor: pointer;
			}
			.add-item-container {
				display: flex;
				align-items: center;
				gap: 4px;
			}
			.add-item-side {
				flex-grow: 1;
			}
			.remove-icon {
				width: 44px;
				display: flex;
				justify-content: flex-start;
				margin-left: 6px;
				cursor: pointer;
				color: var(--sl-input-placeholder-color);
			}
			.remove-icon:hover {
				color: var(--sl-input-color);
			}
			.list-container {
				display: flex;
				flex-direction: column;
				gap: 3px;
				padding-bottom: 8px;
			}
			.icon {
				padding-top: 0.5rem;
			}
			sl-input::part(input) {
				width: inherit;
			}
		`
];
__decorateClass([
  n4()
], DefaultObjectInput.prototype, "property", 2);
__decorateClass([
  n4()
], DefaultObjectInput.prototype, "keyPlaceholder", 2);
__decorateClass([
  n4()
], DefaultObjectInput.prototype, "valuePlaceholder", 2);
__decorateClass([
  n4()
], DefaultObjectInput.prototype, "moduleId", 2);
__decorateClass([
  n4()
], DefaultObjectInput.prototype, "value", 2);
__decorateClass([
  n4()
], DefaultObjectInput.prototype, "schema", 2);
__decorateClass([
  n4()
], DefaultObjectInput.prototype, "withTitle", 2);
__decorateClass([
  n4()
], DefaultObjectInput.prototype, "withDescription", 2);
__decorateClass([
  n4()
], DefaultObjectInput.prototype, "required", 2);
__decorateClass([
  n4()
], DefaultObjectInput.prototype, "handleInlangProjectChange", 2);
__decorateClass([
  r6()
], DefaultObjectInput.prototype, "_inputValue", 2);
__decorateClass([
  r6()
], DefaultObjectInput.prototype, "_inputKey", 2);
DefaultObjectInput = __decorateClass([
  t3("default-object-input")
], DefaultObjectInput);

// src/stories/input-fields/object/lint-rule-level-object-input.ts
import "@inlang/sdk";
var LintRuleLevelObjectInput = class extends s3 {
  constructor() {
    super(...arguments);
    this.property = "";
    this.value = {};
    this.schema = {};
    this.required = false;
    this.handleInlangProjectChange = () => {
    };
  }
  get _description() {
    return this.schema.description || void 0;
  }
  get _title() {
    return this.schema.title || void 0;
  }
  get _valueOptions() {
    const valuesOptions = Object.values(this.schema.patternProperties)[0]?.anyOf;
    return valuesOptions ? valuesOptions : void 0;
  }
  handleUpdate(key, value) {
    if (key && value) {
      if (!this.value) {
        this.value = {};
      }
      this.value[key] = value;
      this.handleInlangProjectChange(this.value, this.property, this.moduleId);
    }
  }
  async update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has("value")) {
      await this.updateComplete;
      const newValue = changedProperties.get("value");
      if (newValue) {
        for (const moduleId of Object.keys(newValue)) {
          const slSelect = this.shadowRoot?.getElementById(moduleId);
          if (slSelect) {
            const input = slSelect.shadowRoot?.querySelector(".select__display-input");
            if (input && input.value) {
              input.value = this.value[moduleId] ? this.value[moduleId] : "warning";
            }
          }
        }
      }
    }
  }
  render() {
    return this.modules && this.modules.some((module) => module.id.split(".")[0] !== "plugin") ? x` <div part="property" class="property">
					<div class="title-container">
						<field-header
							.fieldTitle=${this._title ? this._title : this.property}
							.description=${this._description}
							.optional=${this.required ? false : true}
							exportparts="property-title, property-paragraph"
						></field-header>
					</div>
					<div class="container">
						${this.modules && this.modules.map((module) => {
      return module.id.split(".")[0] !== "plugin" ? x`<div class="rule-container">
										<sl-select
											id=${module.id}
											exportparts="listbox:option-wrapper"
											value=${this.value ? this.value[module.id] : "warning"}
											placeholder="warning"
											class="select"
											size="small"
											@sl-change=${(e11) => {
        this.handleUpdate(
          module.id,
          e11.target.value
        );
      }}
										>
											${this.value[module.id] === "error" ? x`<svg
														class="level-icon danger"
														slot="prefix"
														width="20"
														height="20"
														viewBox="0 0 24 24"
												  >
														<path
															fill="currentColor"
															d="M12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17m0-4q.425 0 .713-.288T13 12V8q0-.425-.288-.712T12 7t-.712.288T11 8v4q0 .425.288.713T12 13m0 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
														/>
												  </svg>` : x`<svg
														class="level-icon"
														slot="prefix"
														width="20"
														height="20"
														viewBox="0 0 24 24"
												  >
														<path
															fill="currentColor"
															d="M12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17m0-4q.425 0 .713-.288T13 12V8q0-.425-.288-.712T12 7t-.712.288T11 8v4q0 .425.288.713T12 13m0 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
														/>
												  </svg>`}
											${this._valueOptions?.map((option) => {
        return x`<sl-option
													exportparts="base:option"
													value=${option.const}
													class="add-item-side"
												>
													${option.const}
												</sl-option>`;
      })}
										</sl-select>
										<p class="ruleId">${module.displayName.en}</p>
								  </div>` : void 0;
    })}
					</div>
			  </div>` : void 0;
  }
};
LintRuleLevelObjectInput.styles = [
  i`
			.property {
				display: flex;
				flex-direction: column;
				gap: 12px;
			}
			.container {
				display: flex;
				flex-direction: column;
				padding-top: 8px;
				gap: 12px;
			}
			.ruleId {
				font-size: 0.8rem;
				margin: 0;
				color: var(--sl-input-color);
			}
			.rule-container {
				display: flex;
				align-items: center;
				gap: 12px;
				flex-wrap: wrap;
			}
			.select {
				max-width: 140px;
				min-width: 100px;
			}
			.title-container {
				display: flex;
				gap: 8px;
			}
			sl-select::part(expand-icon) {
				color: var(--sl-input-placeholder-color);
			}
			sl-select::part(expand-icon):hover {
				color: var(--sl-input-color);
			}
			sl-select::part(base):hover {
				border: var(--sl-input-placeholder-color);
			}
			.level-icon {
				color: var(--sl-color-neutral-400);
				margin-top: 1px;
				margin-right: 6px;
			}
			.level-icon.danger {
				color: var(--sl-color-danger-600);
			}
		`
];
__decorateClass([
  n4()
], LintRuleLevelObjectInput.prototype, "property", 2);
__decorateClass([
  n4()
], LintRuleLevelObjectInput.prototype, "moduleId", 2);
__decorateClass([
  n4()
], LintRuleLevelObjectInput.prototype, "modules", 2);
__decorateClass([
  n4()
], LintRuleLevelObjectInput.prototype, "value", 2);
__decorateClass([
  n4()
], LintRuleLevelObjectInput.prototype, "schema", 2);
__decorateClass([
  n4()
], LintRuleLevelObjectInput.prototype, "required", 2);
__decorateClass([
  n4()
], LintRuleLevelObjectInput.prototype, "handleInlangProjectChange", 2);
LintRuleLevelObjectInput = __decorateClass([
  t3("lint-rule-level-object-input")
], LintRuleLevelObjectInput);

// src/stories/input-fields/object/object-input.ts
var ObjectInput = class extends s3 {
  constructor() {
    super(...arguments);
    this.property = "";
    this.value = {};
    this.schema = {};
    this.withTitle = true;
    this.withDescription = true;
    this.required = false;
    this.handleInlangProjectChange = () => {
    };
  }
  render() {
    if (this.property === "messageLintRuleLevels") {
      return x`<lint-rule-level-object-input
				exportparts="property, property-title, property-paragraph, option, option-wrapper"
				.property=${this.property}
				.moduleId=${this.moduleId}
				.modules=${this.modules}
				.value=${this.value}
				.schema=${this.schema}
				.handleInlangProjectChange=${this.handleInlangProjectChange}
				.required=${this.required}
			></lint-rule-level-object-input>`;
    } else {
      return x`<default-object-input
				exportparts="property, property-title, property-paragraph, button"
				.property=${this.property}
				.moduleId=${this.moduleId}
				.value=${this.value}
				.schema=${this.schema}
				.keyPlaceholder=${this.keyPlaceholder}
				.valuePlaceholder=${this.valuePlaceholder}
				.handleInlangProjectChange=${this.handleInlangProjectChange}
				.withTitle=${this.withTitle}
				.withDescription=${this.withDescription}
				.required=${this.required}
			></default-object-input>`;
    }
  }
};
__decorateClass([
  n4()
], ObjectInput.prototype, "property", 2);
__decorateClass([
  n4()
], ObjectInput.prototype, "moduleId", 2);
__decorateClass([
  n4()
], ObjectInput.prototype, "modules", 2);
__decorateClass([
  n4()
], ObjectInput.prototype, "keyPlaceholder", 2);
__decorateClass([
  n4()
], ObjectInput.prototype, "valuePlaceholder", 2);
__decorateClass([
  n4()
], ObjectInput.prototype, "value", 2);
__decorateClass([
  n4()
], ObjectInput.prototype, "schema", 2);
__decorateClass([
  n4()
], ObjectInput.prototype, "withTitle", 2);
__decorateClass([
  n4()
], ObjectInput.prototype, "withDescription", 2);
__decorateClass([
  n4()
], ObjectInput.prototype, "required", 2);
__decorateClass([
  n4()
], ObjectInput.prototype, "handleInlangProjectChange", 2);
ObjectInput = __decorateClass([
  t3("object-input")
], ObjectInput);

// src/stories/input-fields/union/path-pattern-input.ts
var PathPatternInput = class extends s3 {
  constructor() {
    super(...arguments);
    this.property = "";
    this.value = "";
    this.schema = {};
    this.required = false;
    this.handleInlangProjectChange = () => {
    };
    this._isObject = void 0;
    this._isInitialized = false;
  }
  get _descriptionObject() {
    if (this.schema.description) {
      return this.schema.description;
    } else {
      return "Specify the pathPattern to locate language files of specific namespaces in your repository. The namespace is a string taht shouldn't include '.', the path must include `{languageTag}` and end with `.json`.";
    }
  }
  get _examplesObject() {
    return [
      '{ common: "./locales/{languageTag}/common.json", app: "./locales/{languageTag}/app.json" }'
    ];
  }
  get _descriptionString() {
    if (this.schema.description) {
      return this.schema.description;
    } else {
      return this.schema.anyOf[0].description || void 0;
    }
  }
  get _examplesString() {
    return this.schema.anyOf[0].examples;
  }
  get _title() {
    return this.schema.title || void 0;
  }
  render() {
    if (this._isInitialized === false) {
      if (typeof this.value === "object") {
        this._isObject = true;
      } else {
        this._isObject = false;
      }
      this._isInitialized = true;
    }
    return x` <div part="property" class="property">
			<field-header
				.fieldTitle=${this._title ? this._title : this.property}
				.optional=${this.required ? false : true}
				exportparts="property-title"
			></field-header>
			<sl-checkbox
				?checked=${this._isObject}
				@input=${(e11) => {
      if (e11.target.checked) {
        this._isObject = true;
      } else {
        this._isObject = false;
      }
    }}
				>with namespaces</sl-checkbox
			>
			${this._isObject ? x`<div part="property" class="property">
						<field-header
							.description=${this._descriptionObject}
							.examples=${this._examplesObject}
							.optional=${this.required ? false : true}
							exportparts="property-title, property-paragraph"
						></field-header>
						<object-input
							exportparts="button"
							.value=${typeof this.value === "object" ? this.value : ""}
							.keyPlaceholder=${"Namespace"}
							.valuePlaceholder=${"Path to resource [./**/*.json]"}
							.handleInlangProjectChange=${this.handleInlangProjectChange}
							.property=${this.property}
							.moduleId=${this.moduleId}
							.schema=${this.schema}
							.withTitle=${false}
							.withDescription=${false}
							.required=${this.required}
						>
						</object-input>
				  </div>` : x`<div part="property" class="property">
						<field-header
							.description=${this._descriptionString}
							.examples=${this._examplesString}
							.optional=${this.required ? false : true}
							exportparts="property-title, property-paragraph"
						></field-header>
						<sl-input
							value=${typeof this.value === "object" ? "" : this.value}
							size="small"
							placeholder="Path to resource [./**/*.json]"
							@input=${(e11) => {
      this.handleInlangProjectChange(
        e11.target.value,
        this.property,
        this.moduleId
      );
    }}
						>
						</sl-input>
				  </div>`}
		</div>`;
  }
};
PathPatternInput.styles = [
  i`
			.property {
				display: flex;
				flex-direction: column;
				gap: 12px;
			}
			sl-checkbox::part(base) {
				font-size: 14px;
				color: var(--sl-input-help-text-color);
			}
			.description-container {
				display: flex;
				flex-direction: column;
				gap: 4px;
			}
		`
];
__decorateClass([
  n4()
], PathPatternInput.prototype, "property", 2);
__decorateClass([
  n4()
], PathPatternInput.prototype, "moduleId", 2);
__decorateClass([
  n4()
], PathPatternInput.prototype, "value", 2);
__decorateClass([
  n4()
], PathPatternInput.prototype, "schema", 2);
__decorateClass([
  n4()
], PathPatternInput.prototype, "required", 2);
__decorateClass([
  n4()
], PathPatternInput.prototype, "handleInlangProjectChange", 2);
__decorateClass([
  r6()
], PathPatternInput.prototype, "_isObject", 2);
__decorateClass([
  r6()
], PathPatternInput.prototype, "_isInitialized", 2);
PathPatternInput = __decorateClass([
  t3("path-pattern-input")
], PathPatternInput);

// src/stories/input-fields/general-input.ts
var GeneralInput = class extends s3 {
  constructor() {
    super(...arguments);
    this.property = "";
    this.value = "";
    this.schema = {};
    this.required = {};
    this.handleInlangProjectChange = () => {
    };
  }
  render() {
    if (this.schema.type) {
      if (this.schema.type === "string") {
        return x` <div>
					<string-input
						exportparts="property, property-title, property-paragraph"
						.property=${this.property}
						.moduleId=${this.moduleId}
						.value=${this.value}
						.schema=${this.schema}
						.handleInlangProjectChange=${this.handleInlangProjectChange}
						.required=${this.required}
					></string-input>
				</div>`;
      } else if (this.schema.type === "array") {
        return x` <div>
					<array-input
						exportparts="property, property-title, property-paragraph, button"
						.property=${this.property}
						.moduleId=${this.moduleId}
						.modules=${this.modules}
						.value=${this.value}
						.schema=${this.schema}
						.handleInlangProjectChange=${this.handleInlangProjectChange}
						.required=${this.required}
					></array-input>
				</div>`;
      } else if (this.schema.type === "object") {
        return x` <div>
					<object-input
						exportparts="property, property-title, property-paragraph, option, option-wrapper, button"
						.property=${this.property}
						.moduleId=${this.moduleId}
						.modules=${this.modules}
						.value=${this.value}
						.schema=${this.schema}
						.handleInlangProjectChange=${this.handleInlangProjectChange}
						.required=${this.required}
						.withTitle=${true}
						.withDescription=${true}
						.keyPlaceholder=${"Enter key"}
						.valuePlaceholder=${"Enter value"}
					></object-input>
				</div>`;
      } else {
        return x` <div>
					<string-input
						exportparts="property, property-title, property-paragraph"
						.property=${this.property}
						.moduleId=${this.moduleId}
						.value=${this.value}
						.schema=${this.schema}
						.handleInlangProjectChange=${this.handleInlangProjectChange}
						.required=${this.required}
					></string-input>
				</div>`;
      }
    } else if (this.property === "pathPattern" || this.property === "sourceLanguageFilePath") {
      return x` <div>
				<path-pattern-input
					exportparts="property, property-title, property-paragraph, button"
					.property=${this.property}
					.moduleId=${this.moduleId}
					.value=${this.value}
					.schema=${this.schema}
					.handleInlangProjectChange=${this.handleInlangProjectChange}
					.required=${this.required}
				></path-pattern-input>
			</div>`;
    } else {
      return x` <div>
				<string-input
					exportparts="property, property-title, property-paragraph"
					.property=${this.property}
					.moduleId=${this.moduleId}
					.value=${this.value}
					.schema=${this.schema}
					.handleInlangProjectChange=${this.handleInlangProjectChange}
					.required=${this.required}
				></string-input>
			</div>`;
    }
  }
};
__decorateClass([
  n4()
], GeneralInput.prototype, "property", 2);
__decorateClass([
  n4()
], GeneralInput.prototype, "moduleId", 2);
__decorateClass([
  n4()
], GeneralInput.prototype, "modules", 2);
__decorateClass([
  n4()
], GeneralInput.prototype, "value", 2);
__decorateClass([
  n4()
], GeneralInput.prototype, "schema", 2);
__decorateClass([
  n4()
], GeneralInput.prototype, "required", 2);
__decorateClass([
  n4()
], GeneralInput.prototype, "handleInlangProjectChange", 2);
GeneralInput = __decorateClass([
  t3("general-input")
], GeneralInput);

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.V2OL7VMD.js
var tag_styles_default = i`
  :host {
    display: inline-block;
  }

  .tag {
    display: flex;
    align-items: center;
    border: solid 1px;
    line-height: 1;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
  }

  .tag__remove::part(base) {
    color: inherit;
    padding: 0;
  }

  /*
   * Variant modifiers
   */

  .tag--primary {
    background-color: var(--sl-color-primary-50);
    border-color: var(--sl-color-primary-200);
    color: var(--sl-color-primary-800);
  }

  .tag--primary:active > sl-icon-button {
    color: var(--sl-color-primary-600);
  }

  .tag--success {
    background-color: var(--sl-color-success-50);
    border-color: var(--sl-color-success-200);
    color: var(--sl-color-success-800);
  }

  .tag--success:active > sl-icon-button {
    color: var(--sl-color-success-600);
  }

  .tag--neutral {
    background-color: var(--sl-color-neutral-50);
    border-color: var(--sl-color-neutral-200);
    color: var(--sl-color-neutral-800);
  }

  .tag--neutral:active > sl-icon-button {
    color: var(--sl-color-neutral-600);
  }

  .tag--warning {
    background-color: var(--sl-color-warning-50);
    border-color: var(--sl-color-warning-200);
    color: var(--sl-color-warning-800);
  }

  .tag--warning:active > sl-icon-button {
    color: var(--sl-color-warning-600);
  }

  .tag--danger {
    background-color: var(--sl-color-danger-50);
    border-color: var(--sl-color-danger-200);
    color: var(--sl-color-danger-800);
  }

  .tag--danger:active > sl-icon-button {
    color: var(--sl-color-danger-600);
  }

  /*
   * Size modifiers
   */

  .tag--small {
    font-size: var(--sl-button-font-size-small);
    height: calc(var(--sl-input-height-small) * 0.8);
    line-height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-small);
    padding: 0 var(--sl-spacing-x-small);
  }

  .tag--medium {
    font-size: var(--sl-button-font-size-medium);
    height: calc(var(--sl-input-height-medium) * 0.8);
    line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-medium);
    padding: 0 var(--sl-spacing-small);
  }

  .tag--large {
    font-size: var(--sl-button-font-size-large);
    height: calc(var(--sl-input-height-large) * 0.8);
    line-height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-large);
    padding: 0 var(--sl-spacing-medium);
  }

  .tag__remove {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  /*
   * Pill modifier
   */

  .tag--pill {
    border-radius: var(--sl-border-radius-pill);
  }
`;

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.6I2T3DLI.js
var icon_button_styles_default = i`
  :host {
    display: inline-block;
    color: var(--sl-color-neutral-600);
  }

  .icon-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-medium);
    font-size: inherit;
    color: inherit;
    padding: var(--sl-spacing-x-small);
    cursor: pointer;
    transition: var(--sl-transition-x-fast) color;
    -webkit-appearance: none;
  }

  .icon-button:hover:not(.icon-button--disabled),
  .icon-button:focus-visible:not(.icon-button--disabled) {
    color: var(--sl-color-primary-600);
  }

  .icon-button:active:not(.icon-button--disabled) {
    color: var(--sl-color-primary-700);
  }

  .icon-button:focus {
    outline: none;
  }

  .icon-button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon-button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .icon-button__icon {
    pointer-events: none;
  }
`;

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.3Y6SB6QS.js
var basePath = "";
function setBasePath(path) {
  basePath = path;
}
function getBasePath(subpath = "") {
  if (!basePath) {
    const scripts = [...document.getElementsByTagName("script")];
    const configScript = scripts.find((script) => script.hasAttribute("data-shoelace"));
    if (configScript) {
      setBasePath(configScript.getAttribute("data-shoelace"));
    } else {
      const fallbackScript = scripts.find((s5) => {
        return /shoelace(\.min)?\.js($|\?)/.test(s5.src) || /shoelace-autoloader(\.min)?\.js($|\?)/.test(s5.src);
      });
      let path = "";
      if (fallbackScript) {
        path = fallbackScript.getAttribute("src");
      }
      setBasePath(path.split("/").slice(0, -1).join("/"));
    }
  }
  return basePath.replace(/\/$/, "") + (subpath ? `/${subpath.replace(/^\//, "")}` : ``);
}

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.P7ZG6EMR.js
var library = {
  name: "default",
  resolver: (name) => getBasePath(`assets/icons/${name}.svg`)
};
var library_default_default = library;

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.3TFKS637.js
var icons = {
  caret: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,
  check: `
    <svg part="checked-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor">
          <g transform="translate(3.428571, 3.428571)">
            <path d="M0,5.71428571 L3.42857143,9.14285714"></path>
            <path d="M9.14285714,0 L3.42857143,9.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,
  "chevron-down": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,
  "chevron-left": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
  `,
  "chevron-right": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,
  copy: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
    </svg>
  `,
  eye: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
  `,
  "eye-slash": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
    </svg>
  `,
  eyedropper: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16">
      <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path>
    </svg>
  `,
  "grip-vertical": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
    </svg>
  `,
  indeterminate: `
    <svg part="indeterminate-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor" stroke-width="2">
          <g transform="translate(2.285714, 6.857143)">
            <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,
  "person-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    </svg>
  `,
  "play-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
    </svg>
  `,
  "pause-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>
    </svg>
  `,
  radio: `
    <svg part="checked-icon" class="radio__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill="currentColor">
          <circle cx="8" cy="8" r="3.42857143"></circle>
        </g>
      </g>
    </svg>
  `,
  "star-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>
  `,
  "x-lg": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
  `,
  "x-circle-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
    </svg>
  `
};
var systemLibrary = {
  name: "system",
  resolver: (name) => {
    if (name in icons) {
      return `data:image/svg+xml,${encodeURIComponent(icons[name])}`;
    }
    return "";
  }
};
var library_system_default = systemLibrary;

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.ZL53POKZ.js
var registry2 = [library_default_default, library_system_default];
var watchedIcons = [];
function watchIcon(icon) {
  watchedIcons.push(icon);
}
function unwatchIcon(icon) {
  watchedIcons = watchedIcons.filter((el) => el !== icon);
}
function getIconLibrary(name) {
  return registry2.find((lib) => lib.name === name);
}

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.QLXRCYS4.js
var icon_styles_default = i`
  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    box-sizing: content-box !important;
  }

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }
`;

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.IFDWM6P4.js
var __defProp2 = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a4, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp2.call(b3, prop))
      __defNormalProp(a4, prop, b3[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b3)) {
      if (__propIsEnum.call(b3, prop))
        __defNormalProp(a4, prop, b3[prop]);
    }
  return a4;
};
var __spreadProps = (a4, b3) => __defProps(a4, __getOwnPropDescs(b3));
var __decorateClass2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc2(target, key) : target;
  for (var i5 = decorators.length - 1, decorator; i5 >= 0; i5--)
    if (decorator = decorators[i5])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp2(target, key, result);
  return result;
};

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.2FB5TK5H.js
function watch(propertyName, options) {
  const resolvedOptions = __spreadValues({
    waitUntilFirstUpdate: false
  }, options);
  return (proto, decoratedFnName) => {
    const { update: update2 } = proto;
    const watchedProperties = Array.isArray(propertyName) ? propertyName : [propertyName];
    proto.update = function(changedProps) {
      watchedProperties.forEach((property) => {
        const key = property;
        if (changedProps.has(key)) {
          const oldValue = changedProps.get(key);
          const newValue = this[key];
          if (oldValue !== newValue) {
            if (!resolvedOptions.waitUntilFirstUpdate || this.hasUpdated) {
              this[decoratedFnName](oldValue, newValue);
            }
          }
        }
      });
      update2.call(this, changedProps);
    };
  };
}

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.TUVJKY7S.js
var component_styles_default = i`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`;

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.RVOOE4AQ.js
var ShoelaceElement = class extends s3 {
  constructor() {
    super();
    Object.entries(this.constructor.dependencies).forEach(([name, component]) => {
      this.constructor.define(name, component);
    });
  }
  emit(name, options) {
    const event = new CustomEvent(name, __spreadValues({
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {}
    }, options));
    this.dispatchEvent(event);
    return event;
  }
  /* eslint-enable */
  static define(name, elementConstructor = this, options = {}) {
    const currentlyRegisteredConstructor = customElements.get(name);
    if (!currentlyRegisteredConstructor) {
      customElements.define(name, class extends elementConstructor {
      }, options);
      return;
    }
    let newVersion = " (unknown version)";
    let existingVersion = newVersion;
    if ("version" in elementConstructor && elementConstructor.version) {
      newVersion = " v" + elementConstructor.version;
    }
    if ("version" in currentlyRegisteredConstructor && currentlyRegisteredConstructor.version) {
      existingVersion = " v" + currentlyRegisteredConstructor.version;
    }
    if (newVersion && existingVersion && newVersion === existingVersion) {
      return;
    }
    console.warn(
      `Attempted to register <${name}>${newVersion}, but <${name}>${existingVersion} has already been registered.`
    );
  }
};
ShoelaceElement.version = "2.14.0";
ShoelaceElement.dependencies = {};
__decorateClass2([
  n4()
], ShoelaceElement.prototype, "dir", 2);
__decorateClass2([
  n4()
], ShoelaceElement.prototype, "lang", 2);

// ../../../node_modules/.pnpm/lit-html@3.1.3/node_modules/lit-html/directive-helpers.js
var { I: t4 } = z;
var e6 = (o9, t7) => void 0 === t7 ? void 0 !== o9?._$litType$ : o9?._$litType$ === t7;
var f3 = (o9) => void 0 === o9.strings;
var u3 = {};
var m2 = (o9, t7 = u3) => o9._$AH = t7;

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.7YG67M3U.js
var CACHEABLE_ERROR = Symbol();
var RETRYABLE_ERROR = Symbol();
var parser;
var iconCache = /* @__PURE__ */ new Map();
var SlIcon = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.initialRender = false;
    this.svg = null;
    this.label = "";
    this.library = "default";
  }
  /** Given a URL, this function returns the resulting SVG element or an appropriate error symbol. */
  async resolveIcon(url, library2) {
    var _a;
    let fileData;
    if (library2 == null ? void 0 : library2.spriteSheet) {
      return x`<svg part="svg">
        <use part="use" href="${url}"></use>
      </svg>`;
    }
    try {
      fileData = await fetch(url, { mode: "cors" });
      if (!fileData.ok)
        return fileData.status === 410 ? CACHEABLE_ERROR : RETRYABLE_ERROR;
    } catch (e11) {
      return RETRYABLE_ERROR;
    }
    try {
      const div = document.createElement("div");
      div.innerHTML = await fileData.text();
      const svg = div.firstElementChild;
      if (((_a = svg == null ? void 0 : svg.tagName) == null ? void 0 : _a.toLowerCase()) !== "svg")
        return CACHEABLE_ERROR;
      if (!parser)
        parser = new DOMParser();
      const doc = parser.parseFromString(svg.outerHTML, "text/html");
      const svgEl = doc.body.querySelector("svg");
      if (!svgEl)
        return CACHEABLE_ERROR;
      svgEl.part.add("svg");
      return document.adoptNode(svgEl);
    } catch (e11) {
      return CACHEABLE_ERROR;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    watchIcon(this);
  }
  firstUpdated() {
    this.initialRender = true;
    this.setIcon();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    unwatchIcon(this);
  }
  getIconSource() {
    const library2 = getIconLibrary(this.library);
    if (this.name && library2) {
      return {
        url: library2.resolver(this.name),
        fromLibrary: true
      };
    }
    return {
      url: this.src,
      fromLibrary: false
    };
  }
  handleLabelChange() {
    const hasLabel = typeof this.label === "string" && this.label.length > 0;
    if (hasLabel) {
      this.setAttribute("role", "img");
      this.setAttribute("aria-label", this.label);
      this.removeAttribute("aria-hidden");
    } else {
      this.removeAttribute("role");
      this.removeAttribute("aria-label");
      this.setAttribute("aria-hidden", "true");
    }
  }
  async setIcon() {
    var _a;
    const { url, fromLibrary } = this.getIconSource();
    const library2 = fromLibrary ? getIconLibrary(this.library) : void 0;
    if (!url) {
      this.svg = null;
      return;
    }
    let iconResolver = iconCache.get(url);
    if (!iconResolver) {
      iconResolver = this.resolveIcon(url, library2);
      iconCache.set(url, iconResolver);
    }
    if (!this.initialRender) {
      return;
    }
    const svg = await iconResolver;
    if (svg === RETRYABLE_ERROR) {
      iconCache.delete(url);
    }
    if (url !== this.getIconSource().url) {
      return;
    }
    if (e6(svg)) {
      this.svg = svg;
      return;
    }
    switch (svg) {
      case RETRYABLE_ERROR:
      case CACHEABLE_ERROR:
        this.svg = null;
        this.emit("sl-error");
        break;
      default:
        this.svg = svg.cloneNode(true);
        (_a = library2 == null ? void 0 : library2.mutator) == null ? void 0 : _a.call(library2, this.svg);
        this.emit("sl-load");
    }
  }
  render() {
    return this.svg;
  }
};
SlIcon.styles = [component_styles_default, icon_styles_default];
__decorateClass2([
  r6()
], SlIcon.prototype, "svg", 2);
__decorateClass2([
  n4({ reflect: true })
], SlIcon.prototype, "name", 2);
__decorateClass2([
  n4()
], SlIcon.prototype, "src", 2);
__decorateClass2([
  n4()
], SlIcon.prototype, "label", 2);
__decorateClass2([
  n4({ reflect: true })
], SlIcon.prototype, "library", 2);
__decorateClass2([
  watch("label")
], SlIcon.prototype, "handleLabelChange", 1);
__decorateClass2([
  watch(["name", "src", "library"])
], SlIcon.prototype, "setIcon", 1);

// ../../../node_modules/.pnpm/lit-html@3.1.3/node_modules/lit-html/directive.js
var t5 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e7 = (t7) => (...e11) => ({ _$litDirective$: t7, values: e11 });
var i4 = class {
  constructor(t7) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t7, e11, i5) {
    this._$Ct = t7, this._$AM = e11, this._$Ci = i5;
  }
  _$AS(t7, e11) {
    return this.update(t7, e11);
  }
  update(t7, e11) {
    return this.render(...e11);
  }
};

// ../../../node_modules/.pnpm/lit-html@3.1.3/node_modules/lit-html/directives/class-map.js
var e8 = e7(class extends i4 {
  constructor(t7) {
    if (super(t7), t7.type !== t5.ATTRIBUTE || "class" !== t7.name || t7.strings?.length > 2)
      throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t7) {
    return " " + Object.keys(t7).filter((s5) => t7[s5]).join(" ") + " ";
  }
  update(s5, [i5]) {
    if (void 0 === this.st) {
      this.st = /* @__PURE__ */ new Set(), void 0 !== s5.strings && (this.nt = new Set(s5.strings.join(" ").split(/\s/).filter((t7) => "" !== t7)));
      for (const t7 in i5)
        i5[t7] && !this.nt?.has(t7) && this.st.add(t7);
      return this.render(i5);
    }
    const r8 = s5.element.classList;
    for (const t7 of this.st)
      t7 in i5 || (r8.remove(t7), this.st.delete(t7));
    for (const t7 in i5) {
      const s6 = !!i5[t7];
      s6 === this.st.has(t7) || this.nt?.has(t7) || (s6 ? (r8.add(t7), this.st.add(t7)) : (r8.remove(t7), this.st.delete(t7)));
    }
    return w;
  }
});

// ../../../node_modules/.pnpm/lit-html@3.1.3/node_modules/lit-html/static.js
var e9 = Symbol.for("");
var o5 = (t7) => {
  if (t7?.r === e9)
    return t7?._$litStatic$;
};
var s4 = (t7, ...r8) => ({ _$litStatic$: r8.reduce((r9, e11, o9) => r9 + ((t8) => {
  if (void 0 !== t8._$litStatic$)
    return t8._$litStatic$;
  throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t8}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
})(e11) + t7[o9 + 1], t7[0]), r: e9 });
var a3 = /* @__PURE__ */ new Map();
var l3 = (t7) => (r8, ...e11) => {
  const i5 = e11.length;
  let s5, l5;
  const n6 = [], u5 = [];
  let c4, $2 = 0, f4 = false;
  for (; $2 < i5; ) {
    for (c4 = r8[$2]; $2 < i5 && void 0 !== (l5 = e11[$2], s5 = o5(l5)); )
      c4 += s5 + r8[++$2], f4 = true;
    $2 !== i5 && u5.push(l5), n6.push(c4), $2++;
  }
  if ($2 === i5 && n6.push(r8[i5]), f4) {
    const t8 = n6.join("$$lit$$");
    void 0 === (r8 = a3.get(t8)) && (n6.raw = n6, a3.set(t8, r8 = n6)), e11 = u5;
  }
  return t7(r8, ...e11);
};
var n5 = l3(x);
var u4 = l3(b2);

// ../../../node_modules/.pnpm/lit-html@3.1.3/node_modules/lit-html/directives/if-defined.js
var o6 = (o9) => o9 ?? T;

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.7XLSSP47.js
var SlIconButton = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.hasFocus = false;
    this.label = "";
    this.disabled = false;
  }
  handleBlur() {
    this.hasFocus = false;
    this.emit("sl-blur");
  }
  handleFocus() {
    this.hasFocus = true;
    this.emit("sl-focus");
  }
  handleClick(event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  /** Simulates a click on the icon button. */
  click() {
    this.button.click();
  }
  /** Sets focus on the icon button. */
  focus(options) {
    this.button.focus(options);
  }
  /** Removes focus from the icon button. */
  blur() {
    this.button.blur();
  }
  render() {
    const isLink = this.href ? true : false;
    const tag = isLink ? s4`a` : s4`button`;
    return n5`
      <${tag}
        part="base"
        class=${e8({
      "icon-button": true,
      "icon-button--disabled": !isLink && this.disabled,
      "icon-button--focused": this.hasFocus
    })}
        ?disabled=${o6(isLink ? void 0 : this.disabled)}
        type=${o6(isLink ? void 0 : "button")}
        href=${o6(isLink ? this.href : void 0)}
        target=${o6(isLink ? this.target : void 0)}
        download=${o6(isLink ? this.download : void 0)}
        rel=${o6(isLink && this.target ? "noreferrer noopener" : void 0)}
        role=${o6(isLink ? void 0 : "button")}
        aria-disabled=${this.disabled ? "true" : "false"}
        aria-label="${this.label}"
        tabindex=${this.disabled ? "-1" : "0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${o6(this.name)}
          library=${o6(this.library)}
          src=${o6(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${tag}>
    `;
  }
};
SlIconButton.styles = [component_styles_default, icon_button_styles_default];
SlIconButton.dependencies = { "sl-icon": SlIcon };
__decorateClass2([
  e5(".icon-button")
], SlIconButton.prototype, "button", 2);
__decorateClass2([
  r6()
], SlIconButton.prototype, "hasFocus", 2);
__decorateClass2([
  n4()
], SlIconButton.prototype, "name", 2);
__decorateClass2([
  n4()
], SlIconButton.prototype, "library", 2);
__decorateClass2([
  n4()
], SlIconButton.prototype, "src", 2);
__decorateClass2([
  n4()
], SlIconButton.prototype, "href", 2);
__decorateClass2([
  n4()
], SlIconButton.prototype, "target", 2);
__decorateClass2([
  n4()
], SlIconButton.prototype, "download", 2);
__decorateClass2([
  n4()
], SlIconButton.prototype, "label", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlIconButton.prototype, "disabled", 2);

// ../../../node_modules/.pnpm/@shoelace-style+localize@3.1.2/node_modules/@shoelace-style/localize/dist/index.js
var connectedElements = /* @__PURE__ */ new Set();
var documentElementObserver = new MutationObserver(update);
var translations = /* @__PURE__ */ new Map();
var documentDirection = document.documentElement.dir || "ltr";
var documentLanguage = document.documentElement.lang || navigator.language;
var fallback;
documentElementObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["dir", "lang"]
});
function registerTranslation(...translation2) {
  translation2.map((t7) => {
    const code = t7.$code.toLowerCase();
    if (translations.has(code)) {
      translations.set(code, Object.assign(Object.assign({}, translations.get(code)), t7));
    } else {
      translations.set(code, t7);
    }
    if (!fallback) {
      fallback = t7;
    }
  });
  update();
}
function update() {
  documentDirection = document.documentElement.dir || "ltr";
  documentLanguage = document.documentElement.lang || navigator.language;
  [...connectedElements.keys()].map((el) => {
    if (typeof el.requestUpdate === "function") {
      el.requestUpdate();
    }
  });
}
var LocalizeController = class {
  constructor(host) {
    this.host = host;
    this.host.addController(this);
  }
  hostConnected() {
    connectedElements.add(this.host);
  }
  hostDisconnected() {
    connectedElements.delete(this.host);
  }
  dir() {
    return `${this.host.dir || documentDirection}`.toLowerCase();
  }
  lang() {
    return `${this.host.lang || documentLanguage}`.toLowerCase();
  }
  getTranslationData(lang) {
    var _a, _b;
    const locale = new Intl.Locale(lang.replace(/_/g, "-"));
    const language = locale === null || locale === void 0 ? void 0 : locale.language.toLowerCase();
    const region = (_b = (_a = locale === null || locale === void 0 ? void 0 : locale.region) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : "";
    const primary = translations.get(`${language}-${region}`);
    const secondary = translations.get(language);
    return { locale, language, region, primary, secondary };
  }
  exists(key, options) {
    var _a;
    const { primary, secondary } = this.getTranslationData((_a = options.lang) !== null && _a !== void 0 ? _a : this.lang());
    options = Object.assign({ includeFallback: false }, options);
    if (primary && primary[key] || secondary && secondary[key] || options.includeFallback && fallback && fallback[key]) {
      return true;
    }
    return false;
  }
  term(key, ...args) {
    const { primary, secondary } = this.getTranslationData(this.lang());
    let term;
    if (primary && primary[key]) {
      term = primary[key];
    } else if (secondary && secondary[key]) {
      term = secondary[key];
    } else if (fallback && fallback[key]) {
      term = fallback[key];
    } else {
      console.error(`No translation found for: ${String(key)}`);
      return String(key);
    }
    if (typeof term === "function") {
      return term(...args);
    }
    return term;
  }
  date(dateToFormat, options) {
    dateToFormat = new Date(dateToFormat);
    return new Intl.DateTimeFormat(this.lang(), options).format(dateToFormat);
  }
  number(numberToFormat, options) {
    numberToFormat = Number(numberToFormat);
    return isNaN(numberToFormat) ? "" : new Intl.NumberFormat(this.lang(), options).format(numberToFormat);
  }
  relativeTime(value, unit, options) {
    return new Intl.RelativeTimeFormat(this.lang(), options).format(value, unit);
  }
};

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.MAS2SHYD.js
var translation = {
  $code: "en",
  $name: "English",
  $dir: "ltr",
  carousel: "Carousel",
  clearEntry: "Clear entry",
  close: "Close",
  copied: "Copied",
  copy: "Copy",
  currentValue: "Current value",
  error: "Error",
  goToSlide: (slide, count) => `Go to slide ${slide} of ${count}`,
  hidePassword: "Hide password",
  loading: "Loading",
  nextSlide: "Next slide",
  numOptionsSelected: (num) => {
    if (num === 0)
      return "No options selected";
    if (num === 1)
      return "1 option selected";
    return `${num} options selected`;
  },
  previousSlide: "Previous slide",
  progress: "Progress",
  remove: "Remove",
  resize: "Resize",
  scrollToEnd: "Scroll to end",
  scrollToStart: "Scroll to start",
  selectAColorFromTheScreen: "Select a color from the screen",
  showPassword: "Show password",
  slideNum: (slide) => `Slide ${slide}`,
  toggleColorFormat: "Toggle color format"
};
registerTranslation(translation);
var en_default = translation;

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.WLV3FVBR.js
var LocalizeController2 = class extends LocalizeController {
};
registerTranslation(en_default);

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.7J6CPMBU.js
var SlTag = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController2(this);
    this.variant = "neutral";
    this.size = "medium";
    this.pill = false;
    this.removable = false;
  }
  handleRemoveClick() {
    this.emit("sl-remove");
  }
  render() {
    return x`
      <span
        part="base"
        class=${e8({
      tag: true,
      // Types
      "tag--primary": this.variant === "primary",
      "tag--success": this.variant === "success",
      "tag--neutral": this.variant === "neutral",
      "tag--warning": this.variant === "warning",
      "tag--danger": this.variant === "danger",
      "tag--text": this.variant === "text",
      // Sizes
      "tag--small": this.size === "small",
      "tag--medium": this.size === "medium",
      "tag--large": this.size === "large",
      // Modifiers
      "tag--pill": this.pill,
      "tag--removable": this.removable
    })}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable ? x`
              <sl-icon-button
                part="remove-button"
                exportparts="base:remove-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term("remove")}
                class="tag__remove"
                @click=${this.handleRemoveClick}
                tabindex="-1"
              ></sl-icon-button>
            ` : ""}
      </span>
    `;
  }
};
SlTag.styles = [component_styles_default, tag_styles_default];
SlTag.dependencies = { "sl-icon-button": SlIconButton };
__decorateClass2([
  n4({ reflect: true })
], SlTag.prototype, "variant", 2);
__decorateClass2([
  n4({ reflect: true })
], SlTag.prototype, "size", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlTag.prototype, "pill", 2);
__decorateClass2([
  n4({ type: Boolean })
], SlTag.prototype, "removable", 2);

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.AN6YZWTU.js
var select_styles_default = i`
  :host {
    display: block;
  }

  /** The popup */
  .select {
    flex: 1 1 auto;
    display: inline-flex;
    width: 100%;
    position: relative;
    vertical-align: middle;
  }

  .select::part(popup) {
    z-index: var(--sl-z-index-dropdown);
  }

  .select[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .select[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  /* Combobox */
  .select__combobox {
    flex: 1;
    display: flex;
    width: 100%;
    min-width: 0;
    position: relative;
    align-items: center;
    justify-content: start;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    letter-spacing: var(--sl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: pointer;
    transition:
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) border,
      var(--sl-transition-fast) box-shadow,
      var(--sl-transition-fast) background-color;
  }

  .select__display-input {
    position: relative;
    width: 100%;
    font: inherit;
    border: none;
    background: none;
    color: var(--sl-input-color);
    cursor: inherit;
    overflow: hidden;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
  }

  .select__display-input::placeholder {
    color: var(--sl-input-placeholder-color);
  }

  .select:not(.select--disabled):hover .select__display-input {
    color: var(--sl-input-color-hover);
  }

  .select__display-input:focus {
    outline: none;
  }

  /* Visually hide the display input when multiple is enabled */
  .select--multiple:not(.select--placeholder-visible) .select__display-input {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .select__value-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: -1;
  }

  .select__tags {
    display: flex;
    flex: 1;
    align-items: center;
    flex-wrap: wrap;
    margin-inline-start: var(--sl-spacing-2x-small);
  }

  .select__tags::slotted(sl-tag) {
    cursor: pointer !important;
  }

  .select--disabled .select__tags,
  .select--disabled .select__tags::slotted(sl-tag) {
    cursor: not-allowed !important;
  }

  /* Standard selects */
  .select--standard .select__combobox {
    background-color: var(--sl-input-background-color);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
  }

  .select--standard.select--disabled .select__combobox {
    background-color: var(--sl-input-background-color-disabled);
    border-color: var(--sl-input-border-color-disabled);
    color: var(--sl-input-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
    outline: none;
  }

  .select--standard:not(.select--disabled).select--open .select__combobox,
  .select--standard:not(.select--disabled).select--focused .select__combobox {
    background-color: var(--sl-input-background-color-focus);
    border-color: var(--sl-input-border-color-focus);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-focus-ring-color);
  }

  /* Filled selects */
  .select--filled .select__combobox {
    border: none;
    background-color: var(--sl-input-filled-background-color);
    color: var(--sl-input-color);
  }

  .select--filled:hover:not(.select--disabled) .select__combobox {
    background-color: var(--sl-input-filled-background-color-hover);
  }

  .select--filled.select--disabled .select__combobox {
    background-color: var(--sl-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .select--filled:not(.select--disabled).select--open .select__combobox,
  .select--filled:not(.select--disabled).select--focused .select__combobox {
    background-color: var(--sl-input-filled-background-color-focus);
    outline: var(--sl-focus-ring);
  }

  /* Sizes */
  .select--small .select__combobox {
    border-radius: var(--sl-input-border-radius-small);
    font-size: var(--sl-input-font-size-small);
    min-height: var(--sl-input-height-small);
    padding-block: 0;
    padding-inline: var(--sl-input-spacing-small);
  }

  .select--small .select__clear {
    margin-inline-start: var(--sl-input-spacing-small);
  }

  .select--small .select__prefix::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-small);
  }

  .select--small.select--multiple:not(.select--placeholder-visible) .select__combobox {
    padding-block: 2px;
    padding-inline-start: 0;
  }

  .select--small .select__tags {
    gap: 2px;
  }

  .select--medium .select__combobox {
    border-radius: var(--sl-input-border-radius-medium);
    font-size: var(--sl-input-font-size-medium);
    min-height: var(--sl-input-height-medium);
    padding-block: 0;
    padding-inline: var(--sl-input-spacing-medium);
  }

  .select--medium .select__clear {
    margin-inline-start: var(--sl-input-spacing-medium);
  }

  .select--medium .select__prefix::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-medium);
  }

  .select--medium.select--multiple:not(.select--placeholder-visible) .select__combobox {
    padding-inline-start: 0;
    padding-block: 3px;
  }

  .select--medium .select__tags {
    gap: 3px;
  }

  .select--large .select__combobox {
    border-radius: var(--sl-input-border-radius-large);
    font-size: var(--sl-input-font-size-large);
    min-height: var(--sl-input-height-large);
    padding-block: 0;
    padding-inline: var(--sl-input-spacing-large);
  }

  .select--large .select__clear {
    margin-inline-start: var(--sl-input-spacing-large);
  }

  .select--large .select__prefix::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-large);
  }

  .select--large.select--multiple:not(.select--placeholder-visible) .select__combobox {
    padding-inline-start: 0;
    padding-block: 4px;
  }

  .select--large .select__tags {
    gap: 4px;
  }

  /* Pills */
  .select--pill.select--small .select__combobox {
    border-radius: var(--sl-input-height-small);
  }

  .select--pill.select--medium .select__combobox {
    border-radius: var(--sl-input-height-medium);
  }

  .select--pill.select--large .select__combobox {
    border-radius: var(--sl-input-height-large);
  }

  /* Prefix */
  .select__prefix {
    flex: 0;
    display: inline-flex;
    align-items: center;
    color: var(--sl-input-placeholder-color);
  }

  /* Clear button */
  .select__clear {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--sl-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--sl-transition-fast) color;
    cursor: pointer;
  }

  .select__clear:hover {
    color: var(--sl-input-icon-color-hover);
  }

  .select__clear:focus {
    outline: none;
  }

  /* Expand icon */
  .select__expand-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    transition: var(--sl-transition-medium) rotate ease;
    rotate: 0;
    margin-inline-start: var(--sl-spacing-small);
  }

  .select--open .select__expand-icon {
    rotate: -180deg;
  }

  /* Listbox */
  .select__listbox {
    display: block;
    position: relative;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    box-shadow: var(--sl-shadow-large);
    background: var(--sl-panel-background-color);
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    border-radius: var(--sl-border-radius-medium);
    padding-block: var(--sl-spacing-x-small);
    padding-inline: 0;
    overflow: auto;
    overscroll-behavior: none;

    /* Make sure it adheres to the popup's auto size */
    max-width: var(--auto-size-available-width);
    max-height: var(--auto-size-available-height);
  }

  .select__listbox ::slotted(sl-divider) {
    --spacing: var(--sl-spacing-x-small);
  }

  .select__listbox ::slotted(small) {
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    color: var(--sl-color-neutral-500);
    padding-block: var(--sl-spacing-x-small);
    padding-inline: var(--sl-spacing-x-large);
  }
`;

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.RK73WSZS.js
function getOffset(element, parent) {
  return {
    top: Math.round(element.getBoundingClientRect().top - parent.getBoundingClientRect().top),
    left: Math.round(element.getBoundingClientRect().left - parent.getBoundingClientRect().left)
  };
}
function scrollIntoView(element, container, direction = "vertical", behavior = "smooth") {
  const offset3 = getOffset(element, container);
  const offsetTop = offset3.top + container.scrollTop;
  const offsetLeft = offset3.left + container.scrollLeft;
  const minX = container.scrollLeft;
  const maxX = container.scrollLeft + container.offsetWidth;
  const minY = container.scrollTop;
  const maxY = container.scrollTop + container.offsetHeight;
  if (direction === "horizontal" || direction === "both") {
    if (offsetLeft < minX) {
      container.scrollTo({ left: offsetLeft, behavior });
    } else if (offsetLeft + element.clientWidth > maxX) {
      container.scrollTo({ left: offsetLeft - container.offsetWidth + element.clientWidth, behavior });
    }
  }
  if (direction === "vertical" || direction === "both") {
    if (offsetTop < minY) {
      container.scrollTo({ top: offsetTop, behavior });
    } else if (offsetTop + element.clientHeight > maxY) {
      container.scrollTo({ top: offsetTop - container.offsetHeight + element.clientHeight, behavior });
    }
  }
}

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.SI4ACBFK.js
var form_control_styles_default = i`
  .form-control .form-control__label {
    display: none;
  }

  .form-control .form-control__help-text {
    display: none;
  }

  /* Label */
  .form-control--has-label .form-control__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    margin-bottom: var(--sl-spacing-3x-small);
  }

  .form-control--has-label.form-control--small .form-control__label {
    font-size: var(--sl-input-label-font-size-small);
  }

  .form-control--has-label.form-control--medium .form-control__label {
    font-size: var(--sl-input-label-font-size-medium);
  }

  .form-control--has-label.form-control--large .form-control__label {
    font-size: var(--sl-input-label-font-size-large);
  }

  :host([required]) .form-control--has-label .form-control__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
    color: var(--sl-input-required-content-color);
  }

  /* Help text */
  .form-control--has-help-text .form-control__help-text {
    display: block;
    color: var(--sl-input-help-text-color);
    margin-top: var(--sl-spacing-3x-small);
  }

  .form-control--has-help-text.form-control--small .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-small);
  }

  .form-control--has-help-text.form-control--medium .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-medium);
  }

  .form-control--has-help-text.form-control--large .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-large);
  }

  .form-control--has-help-text.form-control--radio-group .form-control__help-text {
    margin-top: var(--sl-spacing-2x-small);
  }
`;

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.GI7VDIWX.js
var defaultValue = (propertyName = "value") => (proto, key) => {
  const ctor = proto.constructor;
  const attributeChangedCallback = ctor.prototype.attributeChangedCallback;
  ctor.prototype.attributeChangedCallback = function(name, old, value) {
    var _a;
    const options = ctor.getPropertyOptions(propertyName);
    const attributeName = typeof options.attribute === "string" ? options.attribute : propertyName;
    if (name === attributeName) {
      const converter = options.converter || u;
      const fromAttribute = typeof converter === "function" ? converter : (_a = converter == null ? void 0 : converter.fromAttribute) != null ? _a : u.fromAttribute;
      const newValue = fromAttribute(value, options.type);
      if (this[propertyName] !== newValue) {
        this[key] = newValue;
      }
    }
    attributeChangedCallback.call(this, name, old, value);
  };
};

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.3KSWVBQ5.js
var popup_styles_default = i`
  :host {
    --arrow-color: var(--sl-color-neutral-1000);
    --arrow-size: 6px;

    /*
     * These properties are computed to account for the arrow's dimensions after being rotated 45º. The constant
     * 0.7071 is derived from sin(45), which is the diagonal size of the arrow's container after rotating.
     */
    --arrow-size-diagonal: calc(var(--arrow-size) * 0.7071);
    --arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--arrow-size));

    display: contents;
  }

  .popup {
    position: absolute;
    isolation: isolate;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);
  }

  .popup--fixed {
    position: fixed;
  }

  .popup:not(.popup--active) {
    display: none;
  }

  .popup__arrow {
    position: absolute;
    width: calc(var(--arrow-size-diagonal) * 2);
    height: calc(var(--arrow-size-diagonal) * 2);
    rotate: 45deg;
    background: var(--arrow-color);
    z-index: -1;
  }

  /* Hover bridge */
  .popup-hover-bridge:not(.popup-hover-bridge--visible) {
    display: none;
  }

  .popup-hover-bridge {
    position: fixed;
    z-index: calc(var(--sl-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--hover-bridge-top-left-x, 0) var(--hover-bridge-top-left-y, 0),
      var(--hover-bridge-top-right-x, 0) var(--hover-bridge-top-right-y, 0),
      var(--hover-bridge-bottom-right-x, 0) var(--hover-bridge-bottom-right-y, 0),
      var(--hover-bridge-bottom-left-x, 0) var(--hover-bridge-bottom-left-y, 0)
    );
  }
`;

// ../../../node_modules/.pnpm/@floating-ui+utils@0.2.2/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var min = Math.min;
var max = Math.max;
var round = Math.round;
var floor = Math.floor;
var createCoords = (v2) => ({
  x: v2,
  y: v2
});
var oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
var oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl)
        return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x: x2,
    y: y3,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y3,
    left: x2,
    right: x2 + width,
    bottom: y3 + height,
    x: x2,
    y: y3
  };
}

// ../../../node_modules/.pnpm/@floating-ui+core@1.6.1/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
var computePosition = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x: x2,
    y: y3
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i5 = 0; i5 < validMiddleware.length; i5++) {
    const {
      name,
      fn
    } = validMiddleware[i5];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x: x2,
      y: y3,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x2 = nextX != null ? nextX : x2;
    y3 = nextY != null ? nextY : y3;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x: x2,
          y: y3
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i5 = -1;
    }
  }
  return {
    x: x2,
    y: y3,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
async function detectOverflow(state2, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x: x2,
    y: y3,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state2;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state2);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    x: x2,
    y: y3,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
var arrow = (options) => ({
  name: "arrow",
  options,
  async fn(state2) {
    const {
      x: x2,
      y: y3,
      placement,
      rects,
      platform: platform2,
      elements,
      middlewareData
    } = state2;
    const {
      element,
      padding = 0
    } = evaluate(options, state2) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x: x2,
      y: y3
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform2.getDimensions(element);
    const isYAxis = axis === "y";
    const minProp = isYAxis ? "top" : "left";
    const maxProp = isYAxis ? "bottom" : "right";
    const clientProp = isYAxis ? "clientHeight" : "clientWidth";
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
    if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
    const min$1 = minPadding;
    const max2 = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset3 = clamp(min$1, center, max2);
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset3 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset3,
        centerOffset: center - offset3 - alignmentOffset,
        ...shouldAddOffset && {
          alignmentOffset
        }
      },
      reset: shouldAddOffset
    };
  }
});
var flip = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state2) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state2;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state2);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      if (!specifiedFallbackPlacements && fallbackAxisSideDirection !== "none") {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements2 = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state2, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides2 = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements2[nextIndex];
        if (nextPlacement) {
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d3) => d3.overflows[0] <= 0).sort((a4, b3) => a4.overflows[1] - b3.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$map$so;
              const placement2 = (_overflowsData$map$so = overflowsData.map((d3) => [d3.placement, d3.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a4, b3) => a4[1] - b3[1])[0]) == null ? void 0 : _overflowsData$map$so[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
async function convertValueToCoords(state2, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state2;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state2);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...rawValue
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
var offset = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state2) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x: x2,
        y: y3,
        placement,
        middlewareData
      } = state2;
      const diffCoords = await convertValueToCoords(state2, options);
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x2 + diffCoords.x,
        y: y3 + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};
var shift = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state2) {
      const {
        x: x2,
        y: y3,
        placement
      } = state2;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x3,
              y: y4
            } = _ref;
            return {
              x: x3,
              y: y4
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state2);
      const coords = {
        x: x2,
        y: y3
      };
      const overflow = await detectOverflow(state2, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state2,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x2,
          y: limitedCoords.y - y3
        }
      };
    }
  };
};
var size = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "size",
    options,
    async fn(state2) {
      const {
        placement,
        rects,
        platform: platform2,
        elements
      } = state2;
      const {
        apply = () => {
        },
        ...detectOverflowOptions
      } = evaluate(options, state2);
      const overflow = await detectOverflow(state2, detectOverflowOptions);
      const side = getSide(placement);
      const alignment = getAlignment(placement);
      const isYAxis = getSideAxis(placement) === "y";
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === "top" || side === "bottom") {
        heightSide = side;
        widthSide = alignment === (await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
      } else {
        widthSide = side;
        heightSide = alignment === "end" ? "top" : "bottom";
      }
      const overflowAvailableHeight = height - overflow[heightSide];
      const overflowAvailableWidth = width - overflow[widthSide];
      const noShift = !state2.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if (isYAxis) {
        const maximumClippingWidth = width - overflow.left - overflow.right;
        availableWidth = alignment || noShift ? min(overflowAvailableWidth, maximumClippingWidth) : maximumClippingWidth;
      } else {
        const maximumClippingHeight = height - overflow.top - overflow.bottom;
        availableHeight = alignment || noShift ? min(overflowAvailableHeight, maximumClippingHeight) : maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = max(overflow.left, 0);
        const xMax = max(overflow.right, 0);
        const yMin = max(overflow.top, 0);
        const yMax = max(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state2,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform2.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};

// ../../../node_modules/.pnpm/@floating-ui+utils@0.2.2/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle2(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isContainingBlock(element) {
  const webkit = isWebKit();
  const css = getComputedStyle2(element);
  return css.transform !== "none" || css.perspective !== "none" || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports)
    return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle2(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], win.frameElement && traverseIframes ? getOverflowAncestors(win.frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}

// ../../../node_modules/.pnpm/@floating-ui+dom@1.6.5/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getCssDimensions(element) {
  const css = getComputedStyle2(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $: $2
  } = getCssDimensions(domElement);
  let x2 = ($2 ? round(rect.width) : rect.width) / width;
  let y3 = ($2 ? round(rect.height) : rect.height) / height;
  if (!x2 || !Number.isFinite(x2)) {
    x2 = 1;
  }
  if (!y3 || !Number.isFinite(y3)) {
    y3 = 1;
  }
  return {
    x: x2,
    y: y3
  };
}
var noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x2 = (clientRect.left + visualOffsets.x) / scale.x;
  let y3 = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = currentWin.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle2(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x2 *= iframeScale.x;
      y3 *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x2 += left;
      y3 += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = currentWin.frameElement;
    }
  }
  return rectToClientRect({
    width,
    height,
    x: x2,
    y: y3
  });
}
var topLayerSelectors = [":popover-open", ":modal"];
function isTopLayer(element) {
  return topLayerSelectors.some((selector) => {
    try {
      return element.matches(selector);
    } catch (e11) {
      return false;
    }
  });
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x2 = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y3 = -scroll.scrollTop;
  if (getComputedStyle2(body).direction === "rtl") {
    x2 += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x: x2,
    y: y3
  };
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x2 = 0;
  let y3 = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x2 = visualViewport.offsetLeft;
      y3 = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x2,
    y: y3
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x2 = left * scale.x;
  const y3 = top * scale.y;
  return {
    width,
    height,
    x: x2,
    y: y3
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      ...clippingAncestor,
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle2(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle2(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle2(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  const x2 = rect.left + scroll.scrollLeft - offsets.x;
  const y3 = rect.top + scroll.scrollTop - offsets.y;
  return {
    x: x2,
    y: y3,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element) {
  return getComputedStyle2(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle2(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
}
function getOffsetParent(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}
var getElementRects = async function(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};
function isRTL(element) {
  return getComputedStyle2(element).direction === "rtl";
}
var platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const {
      left,
      top,
      width,
      height
    } = element.getBoundingClientRect();
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1e3);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (e11) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}
function autoUpdate(reference, floating, update2, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update2, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update2);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update2) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update2();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update2();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update2();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update2);
      ancestorResize && ancestor.removeEventListener("resize", update2);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
var offset2 = offset;
var shift2 = shift;
var flip2 = flip;
var size2 = size;
var arrow2 = arrow;
var computePosition2 = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};

// ../../../node_modules/.pnpm/composed-offset-position@0.0.4/node_modules/composed-offset-position/dist/composed-offset-position.browser.min.mjs
function t6(t7) {
  return r7(t7);
}
function o7(t7) {
  return t7.assignedSlot ? t7.assignedSlot : t7.parentNode instanceof ShadowRoot ? t7.parentNode.host : t7.parentNode;
}
function r7(t7) {
  for (let e11 = t7; e11; e11 = o7(e11))
    if (e11 instanceof Element && "none" === getComputedStyle(e11).display)
      return null;
  for (let e11 = o7(t7); e11; e11 = o7(e11)) {
    if (!(e11 instanceof Element))
      continue;
    const t8 = getComputedStyle(e11);
    if ("contents" !== t8.display) {
      if ("static" !== t8.position || "none" !== t8.filter)
        return e11;
      if ("BODY" === e11.tagName)
        return e11;
    }
  }
  return null;
}

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.JLIBGQ2M.js
function isVirtualElement(e11) {
  return e11 !== null && typeof e11 === "object" && "getBoundingClientRect" in e11;
}
var SlPopup = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.active = false;
    this.placement = "top";
    this.strategy = "absolute";
    this.distance = 0;
    this.skidding = 0;
    this.arrow = false;
    this.arrowPlacement = "anchor";
    this.arrowPadding = 10;
    this.flip = false;
    this.flipFallbackPlacements = "";
    this.flipFallbackStrategy = "best-fit";
    this.flipPadding = 0;
    this.shift = false;
    this.shiftPadding = 0;
    this.autoSizePadding = 0;
    this.hoverBridge = false;
    this.updateHoverBridge = () => {
      if (this.hoverBridge && this.anchorEl) {
        const anchorRect = this.anchorEl.getBoundingClientRect();
        const popupRect = this.popup.getBoundingClientRect();
        const isVertical = this.placement.includes("top") || this.placement.includes("bottom");
        let topLeftX = 0;
        let topLeftY = 0;
        let topRightX = 0;
        let topRightY = 0;
        let bottomLeftX = 0;
        let bottomLeftY = 0;
        let bottomRightX = 0;
        let bottomRightY = 0;
        if (isVertical) {
          if (anchorRect.top < popupRect.top) {
            topLeftX = anchorRect.left;
            topLeftY = anchorRect.bottom;
            topRightX = anchorRect.right;
            topRightY = anchorRect.bottom;
            bottomLeftX = popupRect.left;
            bottomLeftY = popupRect.top;
            bottomRightX = popupRect.right;
            bottomRightY = popupRect.top;
          } else {
            topLeftX = popupRect.left;
            topLeftY = popupRect.bottom;
            topRightX = popupRect.right;
            topRightY = popupRect.bottom;
            bottomLeftX = anchorRect.left;
            bottomLeftY = anchorRect.top;
            bottomRightX = anchorRect.right;
            bottomRightY = anchorRect.top;
          }
        } else {
          if (anchorRect.left < popupRect.left) {
            topLeftX = anchorRect.right;
            topLeftY = anchorRect.top;
            topRightX = popupRect.left;
            topRightY = popupRect.top;
            bottomLeftX = anchorRect.right;
            bottomLeftY = anchorRect.bottom;
            bottomRightX = popupRect.left;
            bottomRightY = popupRect.bottom;
          } else {
            topLeftX = popupRect.right;
            topLeftY = popupRect.top;
            topRightX = anchorRect.left;
            topRightY = anchorRect.top;
            bottomLeftX = popupRect.right;
            bottomLeftY = popupRect.bottom;
            bottomRightX = anchorRect.left;
            bottomRightY = anchorRect.bottom;
          }
        }
        this.style.setProperty("--hover-bridge-top-left-x", `${topLeftX}px`);
        this.style.setProperty("--hover-bridge-top-left-y", `${topLeftY}px`);
        this.style.setProperty("--hover-bridge-top-right-x", `${topRightX}px`);
        this.style.setProperty("--hover-bridge-top-right-y", `${topRightY}px`);
        this.style.setProperty("--hover-bridge-bottom-left-x", `${bottomLeftX}px`);
        this.style.setProperty("--hover-bridge-bottom-left-y", `${bottomLeftY}px`);
        this.style.setProperty("--hover-bridge-bottom-right-x", `${bottomRightX}px`);
        this.style.setProperty("--hover-bridge-bottom-right-y", `${bottomRightY}px`);
      }
    };
  }
  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    this.start();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.stop();
  }
  async updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has("active")) {
      if (this.active) {
        this.start();
      } else {
        this.stop();
      }
    }
    if (changedProps.has("anchor")) {
      this.handleAnchorChange();
    }
    if (this.active) {
      await this.updateComplete;
      this.reposition();
    }
  }
  async handleAnchorChange() {
    await this.stop();
    if (this.anchor && typeof this.anchor === "string") {
      const root = this.getRootNode();
      this.anchorEl = root.getElementById(this.anchor);
    } else if (this.anchor instanceof Element || isVirtualElement(this.anchor)) {
      this.anchorEl = this.anchor;
    } else {
      this.anchorEl = this.querySelector('[slot="anchor"]');
    }
    if (this.anchorEl instanceof HTMLSlotElement) {
      this.anchorEl = this.anchorEl.assignedElements({ flatten: true })[0];
    }
    if (this.anchorEl) {
      this.start();
    }
  }
  start() {
    if (!this.anchorEl) {
      return;
    }
    this.cleanup = autoUpdate(this.anchorEl, this.popup, () => {
      this.reposition();
    });
  }
  async stop() {
    return new Promise((resolve) => {
      if (this.cleanup) {
        this.cleanup();
        this.cleanup = void 0;
        this.removeAttribute("data-current-placement");
        this.style.removeProperty("--auto-size-available-width");
        this.style.removeProperty("--auto-size-available-height");
        requestAnimationFrame(() => resolve());
      } else {
        resolve();
      }
    });
  }
  /** Forces the popup to recalculate and reposition itself. */
  reposition() {
    if (!this.active || !this.anchorEl) {
      return;
    }
    const middleware = [
      // The offset middleware goes first
      offset2({ mainAxis: this.distance, crossAxis: this.skidding })
    ];
    if (this.sync) {
      middleware.push(
        size2({
          apply: ({ rects }) => {
            const syncWidth = this.sync === "width" || this.sync === "both";
            const syncHeight = this.sync === "height" || this.sync === "both";
            this.popup.style.width = syncWidth ? `${rects.reference.width}px` : "";
            this.popup.style.height = syncHeight ? `${rects.reference.height}px` : "";
          }
        })
      );
    } else {
      this.popup.style.width = "";
      this.popup.style.height = "";
    }
    if (this.flip) {
      middleware.push(
        flip2({
          boundary: this.flipBoundary,
          // @ts-expect-error - We're converting a string attribute to an array here
          fallbackPlacements: this.flipFallbackPlacements,
          fallbackStrategy: this.flipFallbackStrategy === "best-fit" ? "bestFit" : "initialPlacement",
          padding: this.flipPadding
        })
      );
    }
    if (this.shift) {
      middleware.push(
        shift2({
          boundary: this.shiftBoundary,
          padding: this.shiftPadding
        })
      );
    }
    if (this.autoSize) {
      middleware.push(
        size2({
          boundary: this.autoSizeBoundary,
          padding: this.autoSizePadding,
          apply: ({ availableWidth, availableHeight }) => {
            if (this.autoSize === "vertical" || this.autoSize === "both") {
              this.style.setProperty("--auto-size-available-height", `${availableHeight}px`);
            } else {
              this.style.removeProperty("--auto-size-available-height");
            }
            if (this.autoSize === "horizontal" || this.autoSize === "both") {
              this.style.setProperty("--auto-size-available-width", `${availableWidth}px`);
            } else {
              this.style.removeProperty("--auto-size-available-width");
            }
          }
        })
      );
    } else {
      this.style.removeProperty("--auto-size-available-width");
      this.style.removeProperty("--auto-size-available-height");
    }
    if (this.arrow) {
      middleware.push(
        arrow2({
          element: this.arrowEl,
          padding: this.arrowPadding
        })
      );
    }
    const getOffsetParent2 = this.strategy === "absolute" ? (element) => platform.getOffsetParent(element, t6) : platform.getOffsetParent;
    computePosition2(this.anchorEl, this.popup, {
      placement: this.placement,
      middleware,
      strategy: this.strategy,
      platform: __spreadProps(__spreadValues({}, platform), {
        getOffsetParent: getOffsetParent2
      })
    }).then(({ x: x2, y: y3, middlewareData, placement }) => {
      const isRtl = getComputedStyle(this).direction === "rtl";
      const staticSide = { top: "bottom", right: "left", bottom: "top", left: "right" }[placement.split("-")[0]];
      this.setAttribute("data-current-placement", placement);
      Object.assign(this.popup.style, {
        left: `${x2}px`,
        top: `${y3}px`
      });
      if (this.arrow) {
        const arrowX = middlewareData.arrow.x;
        const arrowY = middlewareData.arrow.y;
        let top = "";
        let right = "";
        let bottom = "";
        let left = "";
        if (this.arrowPlacement === "start") {
          const value = typeof arrowX === "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
          top = typeof arrowY === "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
          right = isRtl ? value : "";
          left = isRtl ? "" : value;
        } else if (this.arrowPlacement === "end") {
          const value = typeof arrowX === "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
          right = isRtl ? "" : value;
          left = isRtl ? value : "";
          bottom = typeof arrowY === "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
        } else if (this.arrowPlacement === "center") {
          left = typeof arrowX === "number" ? `calc(50% - var(--arrow-size-diagonal))` : "";
          top = typeof arrowY === "number" ? `calc(50% - var(--arrow-size-diagonal))` : "";
        } else {
          left = typeof arrowX === "number" ? `${arrowX}px` : "";
          top = typeof arrowY === "number" ? `${arrowY}px` : "";
        }
        Object.assign(this.arrowEl.style, {
          top,
          right,
          bottom,
          left,
          [staticSide]: "calc(var(--arrow-size-diagonal) * -1)"
        });
      }
    });
    requestAnimationFrame(() => this.updateHoverBridge());
    this.emit("sl-reposition");
  }
  render() {
    return x`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${e8({
      "popup-hover-bridge": true,
      "popup-hover-bridge--visible": this.hoverBridge && this.active
    })}
      ></span>

      <div
        part="popup"
        class=${e8({
      popup: true,
      "popup--active": this.active,
      "popup--fixed": this.strategy === "fixed",
      "popup--has-arrow": this.arrow
    })}
      >
        <slot></slot>
        ${this.arrow ? x`<div part="arrow" class="popup__arrow" role="presentation"></div>` : ""}
      </div>
    `;
  }
};
SlPopup.styles = [component_styles_default, popup_styles_default];
__decorateClass2([
  e5(".popup")
], SlPopup.prototype, "popup", 2);
__decorateClass2([
  e5(".popup__arrow")
], SlPopup.prototype, "arrowEl", 2);
__decorateClass2([
  n4()
], SlPopup.prototype, "anchor", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlPopup.prototype, "active", 2);
__decorateClass2([
  n4({ reflect: true })
], SlPopup.prototype, "placement", 2);
__decorateClass2([
  n4({ reflect: true })
], SlPopup.prototype, "strategy", 2);
__decorateClass2([
  n4({ type: Number })
], SlPopup.prototype, "distance", 2);
__decorateClass2([
  n4({ type: Number })
], SlPopup.prototype, "skidding", 2);
__decorateClass2([
  n4({ type: Boolean })
], SlPopup.prototype, "arrow", 2);
__decorateClass2([
  n4({ attribute: "arrow-placement" })
], SlPopup.prototype, "arrowPlacement", 2);
__decorateClass2([
  n4({ attribute: "arrow-padding", type: Number })
], SlPopup.prototype, "arrowPadding", 2);
__decorateClass2([
  n4({ type: Boolean })
], SlPopup.prototype, "flip", 2);
__decorateClass2([
  n4({
    attribute: "flip-fallback-placements",
    converter: {
      fromAttribute: (value) => {
        return value.split(" ").map((p3) => p3.trim()).filter((p3) => p3 !== "");
      },
      toAttribute: (value) => {
        return value.join(" ");
      }
    }
  })
], SlPopup.prototype, "flipFallbackPlacements", 2);
__decorateClass2([
  n4({ attribute: "flip-fallback-strategy" })
], SlPopup.prototype, "flipFallbackStrategy", 2);
__decorateClass2([
  n4({ type: Object })
], SlPopup.prototype, "flipBoundary", 2);
__decorateClass2([
  n4({ attribute: "flip-padding", type: Number })
], SlPopup.prototype, "flipPadding", 2);
__decorateClass2([
  n4({ type: Boolean })
], SlPopup.prototype, "shift", 2);
__decorateClass2([
  n4({ type: Object })
], SlPopup.prototype, "shiftBoundary", 2);
__decorateClass2([
  n4({ attribute: "shift-padding", type: Number })
], SlPopup.prototype, "shiftPadding", 2);
__decorateClass2([
  n4({ attribute: "auto-size" })
], SlPopup.prototype, "autoSize", 2);
__decorateClass2([
  n4()
], SlPopup.prototype, "sync", 2);
__decorateClass2([
  n4({ type: Object })
], SlPopup.prototype, "autoSizeBoundary", 2);
__decorateClass2([
  n4({ attribute: "auto-size-padding", type: Number })
], SlPopup.prototype, "autoSizePadding", 2);
__decorateClass2([
  n4({ attribute: "hover-bridge", type: Boolean })
], SlPopup.prototype, "hoverBridge", 2);

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.DL5222VR.js
var formCollections = /* @__PURE__ */ new WeakMap();
var reportValidityOverloads = /* @__PURE__ */ new WeakMap();
var checkValidityOverloads = /* @__PURE__ */ new WeakMap();
var userInteractedControls = /* @__PURE__ */ new WeakSet();
var interactions = /* @__PURE__ */ new WeakMap();
var FormControlController = class {
  constructor(host, options) {
    this.handleFormData = (event) => {
      const disabled = this.options.disabled(this.host);
      const name = this.options.name(this.host);
      const value = this.options.value(this.host);
      const isButton = this.host.tagName.toLowerCase() === "sl-button";
      if (this.host.isConnected && !disabled && !isButton && typeof name === "string" && name.length > 0 && typeof value !== "undefined") {
        if (Array.isArray(value)) {
          value.forEach((val) => {
            event.formData.append(name, val.toString());
          });
        } else {
          event.formData.append(name, value.toString());
        }
      }
    };
    this.handleFormSubmit = (event) => {
      var _a;
      const disabled = this.options.disabled(this.host);
      const reportValidity = this.options.reportValidity;
      if (this.form && !this.form.noValidate) {
        (_a = formCollections.get(this.form)) == null ? void 0 : _a.forEach((control) => {
          this.setUserInteracted(control, true);
        });
      }
      if (this.form && !this.form.noValidate && !disabled && !reportValidity(this.host)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    this.handleFormReset = () => {
      this.options.setValue(this.host, this.options.defaultValue(this.host));
      this.setUserInteracted(this.host, false);
      interactions.set(this.host, []);
    };
    this.handleInteraction = (event) => {
      const emittedEvents = interactions.get(this.host);
      if (!emittedEvents.includes(event.type)) {
        emittedEvents.push(event.type);
      }
      if (emittedEvents.length === this.options.assumeInteractionOn.length) {
        this.setUserInteracted(this.host, true);
      }
    };
    this.checkFormValidity = () => {
      if (this.form && !this.form.noValidate) {
        const elements = this.form.querySelectorAll("*");
        for (const element of elements) {
          if (typeof element.checkValidity === "function") {
            if (!element.checkValidity()) {
              return false;
            }
          }
        }
      }
      return true;
    };
    this.reportFormValidity = () => {
      if (this.form && !this.form.noValidate) {
        const elements = this.form.querySelectorAll("*");
        for (const element of elements) {
          if (typeof element.reportValidity === "function") {
            if (!element.reportValidity()) {
              return false;
            }
          }
        }
      }
      return true;
    };
    (this.host = host).addController(this);
    this.options = __spreadValues({
      form: (input) => {
        const formId = input.form;
        if (formId) {
          const root = input.getRootNode();
          const form = root.getElementById(formId);
          if (form) {
            return form;
          }
        }
        return input.closest("form");
      },
      name: (input) => input.name,
      value: (input) => input.value,
      defaultValue: (input) => input.defaultValue,
      disabled: (input) => {
        var _a;
        return (_a = input.disabled) != null ? _a : false;
      },
      reportValidity: (input) => typeof input.reportValidity === "function" ? input.reportValidity() : true,
      checkValidity: (input) => typeof input.checkValidity === "function" ? input.checkValidity() : true,
      setValue: (input, value) => input.value = value,
      assumeInteractionOn: ["sl-input"]
    }, options);
  }
  hostConnected() {
    const form = this.options.form(this.host);
    if (form) {
      this.attachForm(form);
    }
    interactions.set(this.host, []);
    this.options.assumeInteractionOn.forEach((event) => {
      this.host.addEventListener(event, this.handleInteraction);
    });
  }
  hostDisconnected() {
    this.detachForm();
    interactions.delete(this.host);
    this.options.assumeInteractionOn.forEach((event) => {
      this.host.removeEventListener(event, this.handleInteraction);
    });
  }
  hostUpdated() {
    const form = this.options.form(this.host);
    if (!form) {
      this.detachForm();
    }
    if (form && this.form !== form) {
      this.detachForm();
      this.attachForm(form);
    }
    if (this.host.hasUpdated) {
      this.setValidity(this.host.validity.valid);
    }
  }
  attachForm(form) {
    if (form) {
      this.form = form;
      if (formCollections.has(this.form)) {
        formCollections.get(this.form).add(this.host);
      } else {
        formCollections.set(this.form, /* @__PURE__ */ new Set([this.host]));
      }
      this.form.addEventListener("formdata", this.handleFormData);
      this.form.addEventListener("submit", this.handleFormSubmit);
      this.form.addEventListener("reset", this.handleFormReset);
      if (!reportValidityOverloads.has(this.form)) {
        reportValidityOverloads.set(this.form, this.form.reportValidity);
        this.form.reportValidity = () => this.reportFormValidity();
      }
      if (!checkValidityOverloads.has(this.form)) {
        checkValidityOverloads.set(this.form, this.form.checkValidity);
        this.form.checkValidity = () => this.checkFormValidity();
      }
    } else {
      this.form = void 0;
    }
  }
  detachForm() {
    if (!this.form)
      return;
    const formCollection = formCollections.get(this.form);
    if (!formCollection) {
      return;
    }
    formCollection.delete(this.host);
    if (formCollection.size <= 0) {
      this.form.removeEventListener("formdata", this.handleFormData);
      this.form.removeEventListener("submit", this.handleFormSubmit);
      this.form.removeEventListener("reset", this.handleFormReset);
      if (reportValidityOverloads.has(this.form)) {
        this.form.reportValidity = reportValidityOverloads.get(this.form);
        reportValidityOverloads.delete(this.form);
      }
      if (checkValidityOverloads.has(this.form)) {
        this.form.checkValidity = checkValidityOverloads.get(this.form);
        checkValidityOverloads.delete(this.form);
      }
      this.form = void 0;
    }
  }
  setUserInteracted(el, hasInteracted) {
    if (hasInteracted) {
      userInteractedControls.add(el);
    } else {
      userInteractedControls.delete(el);
    }
    el.requestUpdate();
  }
  doAction(type, submitter) {
    if (this.form) {
      const button = document.createElement("button");
      button.type = type;
      button.style.position = "absolute";
      button.style.width = "0";
      button.style.height = "0";
      button.style.clipPath = "inset(50%)";
      button.style.overflow = "hidden";
      button.style.whiteSpace = "nowrap";
      if (submitter) {
        button.name = submitter.name;
        button.value = submitter.value;
        ["formaction", "formenctype", "formmethod", "formnovalidate", "formtarget"].forEach((attr) => {
          if (submitter.hasAttribute(attr)) {
            button.setAttribute(attr, submitter.getAttribute(attr));
          }
        });
      }
      this.form.append(button);
      button.click();
      button.remove();
    }
  }
  /** Returns the associated `<form>` element, if one exists. */
  getForm() {
    var _a;
    return (_a = this.form) != null ? _a : null;
  }
  /** Resets the form, restoring all the control to their default value */
  reset(submitter) {
    this.doAction("reset", submitter);
  }
  /** Submits the form, triggering validation and form data injection. */
  submit(submitter) {
    this.doAction("submit", submitter);
  }
  /**
   * Synchronously sets the form control's validity. Call this when you know the future validity but need to update
   * the host element immediately, i.e. before Lit updates the component in the next update.
   */
  setValidity(isValid) {
    const host = this.host;
    const hasInteracted = Boolean(userInteractedControls.has(host));
    const required = Boolean(host.required);
    host.toggleAttribute("data-required", required);
    host.toggleAttribute("data-optional", !required);
    host.toggleAttribute("data-invalid", !isValid);
    host.toggleAttribute("data-valid", isValid);
    host.toggleAttribute("data-user-invalid", !isValid && hasInteracted);
    host.toggleAttribute("data-user-valid", isValid && hasInteracted);
  }
  /**
   * Updates the form control's validity based on the current value of `host.validity.valid`. Call this when anything
   * that affects constraint validation changes so the component receives the correct validity states.
   */
  updateValidity() {
    const host = this.host;
    this.setValidity(host.validity.valid);
  }
  /**
   * Dispatches a non-bubbling, cancelable custom event of type `sl-invalid`.
   * If the `sl-invalid` event will be cancelled then the original `invalid`
   * event (which may have been passed as argument) will also be cancelled.
   * If no original `invalid` event has been passed then the `sl-invalid`
   * event will be cancelled before being dispatched.
   */
  emitInvalidEvent(originalInvalidEvent) {
    const slInvalidEvent = new CustomEvent("sl-invalid", {
      bubbles: false,
      composed: false,
      cancelable: true,
      detail: {}
    });
    if (!originalInvalidEvent) {
      slInvalidEvent.preventDefault();
    }
    if (!this.host.dispatchEvent(slInvalidEvent)) {
      originalInvalidEvent == null ? void 0 : originalInvalidEvent.preventDefault();
    }
  }
};
var validValidityState = Object.freeze({
  badInput: false,
  customError: false,
  patternMismatch: false,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: false,
  valid: true,
  valueMissing: false
});
var valueMissingValidityState = Object.freeze(__spreadProps(__spreadValues({}, validValidityState), {
  valid: false,
  valueMissing: true
}));
var customErrorValidityState = Object.freeze(__spreadProps(__spreadValues({}, validValidityState), {
  valid: false,
  customError: true
}));

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.DHU6MIVB.js
var defaultAnimationRegistry = /* @__PURE__ */ new Map();
var customAnimationRegistry = /* @__PURE__ */ new WeakMap();
function ensureAnimation(animation) {
  return animation != null ? animation : { keyframes: [], options: { duration: 0 } };
}
function getLogicalAnimation(animation, dir) {
  if (dir.toLowerCase() === "rtl") {
    return {
      keyframes: animation.rtlKeyframes || animation.keyframes,
      options: animation.options
    };
  }
  return animation;
}
function setDefaultAnimation(animationName, animation) {
  defaultAnimationRegistry.set(animationName, ensureAnimation(animation));
}
function getAnimation(el, animationName, options) {
  const customAnimation = customAnimationRegistry.get(el);
  if (customAnimation == null ? void 0 : customAnimation[animationName]) {
    return getLogicalAnimation(customAnimation[animationName], options.dir);
  }
  const defaultAnimation = defaultAnimationRegistry.get(animationName);
  if (defaultAnimation) {
    return getLogicalAnimation(defaultAnimation, options.dir);
  }
  return {
    keyframes: [],
    options: { duration: 0 }
  };
}

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.B4BZKR24.js
function waitForEvent(el, eventName) {
  return new Promise((resolve) => {
    function done(event) {
      if (event.target === el) {
        el.removeEventListener(eventName, done);
        resolve();
      }
    }
    el.addEventListener(eventName, done);
  });
}

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.LHI6QEL2.js
function animateTo(el, keyframes, options) {
  return new Promise((resolve) => {
    if ((options == null ? void 0 : options.duration) === Infinity) {
      throw new Error("Promise-based animations must be finite.");
    }
    const animation = el.animate(keyframes, __spreadProps(__spreadValues({}, options), {
      duration: prefersReducedMotion() ? 0 : options.duration
    }));
    animation.addEventListener("cancel", resolve, { once: true });
    animation.addEventListener("finish", resolve, { once: true });
  });
}
function prefersReducedMotion() {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  return query.matches;
}
function stopAnimations(el) {
  return Promise.all(
    el.getAnimations().map((animation) => {
      return new Promise((resolve) => {
        animation.cancel();
        requestAnimationFrame(resolve);
      });
    })
  );
}

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.NYIIDP5N.js
var HasSlotController = class {
  constructor(host, ...slotNames) {
    this.slotNames = [];
    this.handleSlotChange = (event) => {
      const slot = event.target;
      if (this.slotNames.includes("[default]") && !slot.name || slot.name && this.slotNames.includes(slot.name)) {
        this.host.requestUpdate();
      }
    };
    (this.host = host).addController(this);
    this.slotNames = slotNames;
  }
  hasDefaultSlot() {
    return [...this.host.childNodes].some((node) => {
      if (node.nodeType === node.TEXT_NODE && node.textContent.trim() !== "") {
        return true;
      }
      if (node.nodeType === node.ELEMENT_NODE) {
        const el = node;
        const tagName = el.tagName.toLowerCase();
        if (tagName === "sl-visually-hidden") {
          return false;
        }
        if (!el.hasAttribute("slot")) {
          return true;
        }
      }
      return false;
    });
  }
  hasNamedSlot(name) {
    return this.host.querySelector(`:scope > [slot="${name}"]`) !== null;
  }
  test(slotName) {
    return slotName === "[default]" ? this.hasDefaultSlot() : this.hasNamedSlot(slotName);
  }
  hostConnected() {
    this.host.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
  }
  hostDisconnected() {
    this.host.shadowRoot.removeEventListener("slotchange", this.handleSlotChange);
  }
};

// ../../../node_modules/.pnpm/lit-html@3.1.3/node_modules/lit-html/directives/unsafe-html.js
var e10 = class extends i4 {
  constructor(i5) {
    if (super(i5), this.it = T, i5.type !== t5.CHILD)
      throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(r8) {
    if (r8 === T || null == r8)
      return this._t = void 0, this.it = r8;
    if (r8 === w)
      return r8;
    if ("string" != typeof r8)
      throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (r8 === this.it)
      return this._t;
    this.it = r8;
    const s5 = [r8];
    return s5.raw = s5, this._t = { _$litType$: this.constructor.resultType, strings: s5, values: [] };
  }
};
e10.directiveName = "unsafeHTML", e10.resultType = 1;
var o8 = e7(e10);

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.44XN5ATB.js
var SlSelect = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.formControlController = new FormControlController(this, {
      assumeInteractionOn: ["sl-blur", "sl-input"]
    });
    this.hasSlotController = new HasSlotController(this, "help-text", "label");
    this.localize = new LocalizeController2(this);
    this.typeToSelectString = "";
    this.hasFocus = false;
    this.displayLabel = "";
    this.selectedOptions = [];
    this.name = "";
    this.value = "";
    this.defaultValue = "";
    this.size = "medium";
    this.placeholder = "";
    this.multiple = false;
    this.maxOptionsVisible = 3;
    this.disabled = false;
    this.clearable = false;
    this.open = false;
    this.hoist = false;
    this.filled = false;
    this.pill = false;
    this.label = "";
    this.placement = "bottom";
    this.helpText = "";
    this.form = "";
    this.required = false;
    this.getTag = (option) => {
      return x`
      <sl-tag
        part="tag"
        exportparts="
              base:tag__base,
              content:tag__content,
              remove-button:tag__remove-button,
              remove-button__base:tag__remove-button__base
            "
        ?pill=${this.pill}
        size=${this.size}
        removable
        @sl-remove=${(event) => this.handleTagRemove(event, option)}
      >
        ${option.getTextLabel()}
      </sl-tag>
    `;
    };
    this.handleDocumentFocusIn = (event) => {
      const path = event.composedPath();
      if (this && !path.includes(this)) {
        this.hide();
      }
    };
    this.handleDocumentKeyDown = (event) => {
      const target = event.target;
      const isClearButton = target.closest(".select__clear") !== null;
      const isIconButton = target.closest("sl-icon-button") !== null;
      if (isClearButton || isIconButton) {
        return;
      }
      if (event.key === "Escape" && this.open && !this.closeWatcher) {
        event.preventDefault();
        event.stopPropagation();
        this.hide();
        this.displayInput.focus({ preventScroll: true });
      }
      if (event.key === "Enter" || event.key === " " && this.typeToSelectString === "") {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!this.open) {
          this.show();
          return;
        }
        if (this.currentOption && !this.currentOption.disabled) {
          if (this.multiple) {
            this.toggleOptionSelection(this.currentOption);
          } else {
            this.setSelectedOptions(this.currentOption);
          }
          this.updateComplete.then(() => {
            this.emit("sl-input");
            this.emit("sl-change");
          });
          if (!this.multiple) {
            this.hide();
            this.displayInput.focus({ preventScroll: true });
          }
        }
        return;
      }
      if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
        const allOptions = this.getAllOptions();
        const currentIndex = allOptions.indexOf(this.currentOption);
        let newIndex = Math.max(0, currentIndex);
        event.preventDefault();
        if (!this.open) {
          this.show();
          if (this.currentOption) {
            return;
          }
        }
        if (event.key === "ArrowDown") {
          newIndex = currentIndex + 1;
          if (newIndex > allOptions.length - 1)
            newIndex = 0;
        } else if (event.key === "ArrowUp") {
          newIndex = currentIndex - 1;
          if (newIndex < 0)
            newIndex = allOptions.length - 1;
        } else if (event.key === "Home") {
          newIndex = 0;
        } else if (event.key === "End") {
          newIndex = allOptions.length - 1;
        }
        this.setCurrentOption(allOptions[newIndex]);
      }
      if (event.key.length === 1 || event.key === "Backspace") {
        const allOptions = this.getAllOptions();
        if (event.metaKey || event.ctrlKey || event.altKey) {
          return;
        }
        if (!this.open) {
          if (event.key === "Backspace") {
            return;
          }
          this.show();
        }
        event.stopPropagation();
        event.preventDefault();
        clearTimeout(this.typeToSelectTimeout);
        this.typeToSelectTimeout = window.setTimeout(() => this.typeToSelectString = "", 1e3);
        if (event.key === "Backspace") {
          this.typeToSelectString = this.typeToSelectString.slice(0, -1);
        } else {
          this.typeToSelectString += event.key.toLowerCase();
        }
        for (const option of allOptions) {
          const label = option.getTextLabel().toLowerCase();
          if (label.startsWith(this.typeToSelectString)) {
            this.setCurrentOption(option);
            break;
          }
        }
      }
    };
    this.handleDocumentMouseDown = (event) => {
      const path = event.composedPath();
      if (this && !path.includes(this)) {
        this.hide();
      }
    };
  }
  /** Gets the validity state object */
  get validity() {
    return this.valueInput.validity;
  }
  /** Gets the validation message */
  get validationMessage() {
    return this.valueInput.validationMessage;
  }
  connectedCallback() {
    super.connectedCallback();
    this.open = false;
  }
  addOpenListeners() {
    var _a;
    const root = this.getRootNode();
    if ("CloseWatcher" in window) {
      (_a = this.closeWatcher) == null ? void 0 : _a.destroy();
      this.closeWatcher = new CloseWatcher();
      this.closeWatcher.onclose = () => {
        if (this.open) {
          this.hide();
          this.displayInput.focus({ preventScroll: true });
        }
      };
    }
    root.addEventListener("focusin", this.handleDocumentFocusIn);
    root.addEventListener("keydown", this.handleDocumentKeyDown);
    root.addEventListener("mousedown", this.handleDocumentMouseDown);
  }
  removeOpenListeners() {
    var _a;
    const root = this.getRootNode();
    root.removeEventListener("focusin", this.handleDocumentFocusIn);
    root.removeEventListener("keydown", this.handleDocumentKeyDown);
    root.removeEventListener("mousedown", this.handleDocumentMouseDown);
    (_a = this.closeWatcher) == null ? void 0 : _a.destroy();
  }
  handleFocus() {
    this.hasFocus = true;
    this.displayInput.setSelectionRange(0, 0);
    this.emit("sl-focus");
  }
  handleBlur() {
    this.hasFocus = false;
    this.emit("sl-blur");
  }
  handleLabelClick() {
    this.displayInput.focus();
  }
  handleComboboxMouseDown(event) {
    const path = event.composedPath();
    const isIconButton = path.some((el) => el instanceof Element && el.tagName.toLowerCase() === "sl-icon-button");
    if (this.disabled || isIconButton) {
      return;
    }
    event.preventDefault();
    this.displayInput.focus({ preventScroll: true });
    this.open = !this.open;
  }
  handleComboboxKeyDown(event) {
    if (event.key === "Tab") {
      return;
    }
    event.stopPropagation();
    this.handleDocumentKeyDown(event);
  }
  handleClearClick(event) {
    event.stopPropagation();
    if (this.value !== "") {
      this.setSelectedOptions([]);
      this.displayInput.focus({ preventScroll: true });
      this.updateComplete.then(() => {
        this.emit("sl-clear");
        this.emit("sl-input");
        this.emit("sl-change");
      });
    }
  }
  handleClearMouseDown(event) {
    event.stopPropagation();
    event.preventDefault();
  }
  handleOptionClick(event) {
    const target = event.target;
    const option = target.closest("sl-option");
    const oldValue = this.value;
    if (option && !option.disabled) {
      if (this.multiple) {
        this.toggleOptionSelection(option);
      } else {
        this.setSelectedOptions(option);
      }
      this.updateComplete.then(() => this.displayInput.focus({ preventScroll: true }));
      if (this.value !== oldValue) {
        this.updateComplete.then(() => {
          this.emit("sl-input");
          this.emit("sl-change");
        });
      }
      if (!this.multiple) {
        this.hide();
        this.displayInput.focus({ preventScroll: true });
      }
    }
  }
  handleDefaultSlotChange() {
    const allOptions = this.getAllOptions();
    const value = Array.isArray(this.value) ? this.value : [this.value];
    const values = [];
    if (customElements.get("sl-option")) {
      allOptions.forEach((option) => values.push(option.value));
      this.setSelectedOptions(allOptions.filter((el) => value.includes(el.value)));
    } else {
      customElements.whenDefined("sl-option").then(() => this.handleDefaultSlotChange());
    }
  }
  handleTagRemove(event, option) {
    event.stopPropagation();
    if (!this.disabled) {
      this.toggleOptionSelection(option, false);
      this.updateComplete.then(() => {
        this.emit("sl-input");
        this.emit("sl-change");
      });
    }
  }
  // Gets an array of all <sl-option> elements
  getAllOptions() {
    return [...this.querySelectorAll("sl-option")];
  }
  // Gets the first <sl-option> element
  getFirstOption() {
    return this.querySelector("sl-option");
  }
  // Sets the current option, which is the option the user is currently interacting with (e.g. via keyboard). Only one
  // option may be "current" at a time.
  setCurrentOption(option) {
    const allOptions = this.getAllOptions();
    allOptions.forEach((el) => {
      el.current = false;
      el.tabIndex = -1;
    });
    if (option) {
      this.currentOption = option;
      option.current = true;
      option.tabIndex = 0;
      option.focus();
    }
  }
  // Sets the selected option(s)
  setSelectedOptions(option) {
    const allOptions = this.getAllOptions();
    const newSelectedOptions = Array.isArray(option) ? option : [option];
    allOptions.forEach((el) => el.selected = false);
    if (newSelectedOptions.length) {
      newSelectedOptions.forEach((el) => el.selected = true);
    }
    this.selectionChanged();
  }
  // Toggles an option's selected state
  toggleOptionSelection(option, force) {
    if (force === true || force === false) {
      option.selected = force;
    } else {
      option.selected = !option.selected;
    }
    this.selectionChanged();
  }
  // This method must be called whenever the selection changes. It will update the selected options cache, the current
  // value, and the display value
  selectionChanged() {
    var _a, _b, _c, _d;
    this.selectedOptions = this.getAllOptions().filter((el) => el.selected);
    if (this.multiple) {
      this.value = this.selectedOptions.map((el) => el.value);
      if (this.placeholder && this.value.length === 0) {
        this.displayLabel = "";
      } else {
        this.displayLabel = this.localize.term("numOptionsSelected", this.selectedOptions.length);
      }
    } else {
      this.value = (_b = (_a = this.selectedOptions[0]) == null ? void 0 : _a.value) != null ? _b : "";
      this.displayLabel = (_d = (_c = this.selectedOptions[0]) == null ? void 0 : _c.getTextLabel()) != null ? _d : "";
    }
    this.updateComplete.then(() => {
      this.formControlController.updateValidity();
    });
  }
  get tags() {
    return this.selectedOptions.map((option, index) => {
      if (index < this.maxOptionsVisible || this.maxOptionsVisible <= 0) {
        const tag = this.getTag(option, index);
        return x`<div @sl-remove=${(e11) => this.handleTagRemove(e11, option)}>
          ${typeof tag === "string" ? o8(tag) : tag}
        </div>`;
      } else if (index === this.maxOptionsVisible) {
        return x`<sl-tag>+${this.selectedOptions.length - index}</sl-tag>`;
      }
      return x``;
    });
  }
  handleInvalid(event) {
    this.formControlController.setValidity(false);
    this.formControlController.emitInvalidEvent(event);
  }
  handleDisabledChange() {
    if (this.disabled) {
      this.open = false;
      this.handleOpenChange();
    }
  }
  handleValueChange() {
    const allOptions = this.getAllOptions();
    const value = Array.isArray(this.value) ? this.value : [this.value];
    this.setSelectedOptions(allOptions.filter((el) => value.includes(el.value)));
  }
  async handleOpenChange() {
    if (this.open && !this.disabled) {
      this.setCurrentOption(this.selectedOptions[0] || this.getFirstOption());
      this.emit("sl-show");
      this.addOpenListeners();
      await stopAnimations(this);
      this.listbox.hidden = false;
      this.popup.active = true;
      requestAnimationFrame(() => {
        this.setCurrentOption(this.currentOption);
      });
      const { keyframes, options } = getAnimation(this, "select.show", { dir: this.localize.dir() });
      await animateTo(this.popup.popup, keyframes, options);
      if (this.currentOption) {
        scrollIntoView(this.currentOption, this.listbox, "vertical", "auto");
      }
      this.emit("sl-after-show");
    } else {
      this.emit("sl-hide");
      this.removeOpenListeners();
      await stopAnimations(this);
      const { keyframes, options } = getAnimation(this, "select.hide", { dir: this.localize.dir() });
      await animateTo(this.popup.popup, keyframes, options);
      this.listbox.hidden = true;
      this.popup.active = false;
      this.emit("sl-after-hide");
    }
  }
  /** Shows the listbox. */
  async show() {
    if (this.open || this.disabled) {
      this.open = false;
      return void 0;
    }
    this.open = true;
    return waitForEvent(this, "sl-after-show");
  }
  /** Hides the listbox. */
  async hide() {
    if (!this.open || this.disabled) {
      this.open = false;
      return void 0;
    }
    this.open = false;
    return waitForEvent(this, "sl-after-hide");
  }
  /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
  checkValidity() {
    return this.valueInput.checkValidity();
  }
  /** Gets the associated form, if one exists. */
  getForm() {
    return this.formControlController.getForm();
  }
  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    return this.valueInput.reportValidity();
  }
  /** Sets a custom validation message. Pass an empty string to restore validity. */
  setCustomValidity(message) {
    this.valueInput.setCustomValidity(message);
    this.formControlController.updateValidity();
  }
  /** Sets focus on the control. */
  focus(options) {
    this.displayInput.focus(options);
  }
  /** Removes focus from the control. */
  blur() {
    this.displayInput.blur();
  }
  render() {
    const hasLabelSlot = this.hasSlotController.test("label");
    const hasHelpTextSlot = this.hasSlotController.test("help-text");
    const hasLabel = this.label ? true : !!hasLabelSlot;
    const hasHelpText = this.helpText ? true : !!hasHelpTextSlot;
    const hasClearIcon = this.clearable && !this.disabled && this.value.length > 0;
    const isPlaceholderVisible = this.placeholder && this.value.length === 0;
    return x`
      <div
        part="form-control"
        class=${e8({
      "form-control": true,
      "form-control--small": this.size === "small",
      "form-control--medium": this.size === "medium",
      "form-control--large": this.size === "large",
      "form-control--has-label": hasLabel,
      "form-control--has-help-text": hasHelpText
    })}
      >
        <label
          id="label"
          part="form-control-label"
          class="form-control__label"
          aria-hidden=${hasLabel ? "false" : "true"}
          @click=${this.handleLabelClick}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <sl-popup
            class=${e8({
      select: true,
      "select--standard": true,
      "select--filled": this.filled,
      "select--pill": this.pill,
      "select--open": this.open,
      "select--disabled": this.disabled,
      "select--multiple": this.multiple,
      "select--focused": this.hasFocus,
      "select--placeholder-visible": isPlaceholderVisible,
      "select--top": this.placement === "top",
      "select--bottom": this.placement === "bottom",
      "select--small": this.size === "small",
      "select--medium": this.size === "medium",
      "select--large": this.size === "large"
    })}
            placement=${this.placement}
            strategy=${this.hoist ? "fixed" : "absolute"}
            flip
            shift
            sync="width"
            auto-size="vertical"
            auto-size-padding="10"
          >
            <div
              part="combobox"
              class="select__combobox"
              slot="anchor"
              @keydown=${this.handleComboboxKeyDown}
              @mousedown=${this.handleComboboxMouseDown}
            >
              <slot part="prefix" name="prefix" class="select__prefix"></slot>

              <input
                part="display-input"
                class="select__display-input"
                type="text"
                placeholder=${this.placeholder}
                .disabled=${this.disabled}
                .value=${this.displayLabel}
                autocomplete="off"
                spellcheck="false"
                autocapitalize="off"
                readonly
                aria-controls="listbox"
                aria-expanded=${this.open ? "true" : "false"}
                aria-haspopup="listbox"
                aria-labelledby="label"
                aria-disabled=${this.disabled ? "true" : "false"}
                aria-describedby="help-text"
                role="combobox"
                tabindex="0"
                @focus=${this.handleFocus}
                @blur=${this.handleBlur}
              />

              ${this.multiple ? x`<div part="tags" class="select__tags">${this.tags}</div>` : ""}

              <input
                class="select__value-input"
                type="text"
                ?disabled=${this.disabled}
                ?required=${this.required}
                .value=${Array.isArray(this.value) ? this.value.join(", ") : this.value}
                tabindex="-1"
                aria-hidden="true"
                @focus=${() => this.focus()}
                @invalid=${this.handleInvalid}
              />

              ${hasClearIcon ? x`
                    <button
                      part="clear-button"
                      class="select__clear"
                      type="button"
                      aria-label=${this.localize.term("clearEntry")}
                      @mousedown=${this.handleClearMouseDown}
                      @click=${this.handleClearClick}
                      tabindex="-1"
                    >
                      <slot name="clear-icon">
                        <sl-icon name="x-circle-fill" library="system"></sl-icon>
                      </slot>
                    </button>
                  ` : ""}

              <slot name="expand-icon" part="expand-icon" class="select__expand-icon">
                <sl-icon library="system" name="chevron-down"></sl-icon>
              </slot>
            </div>

            <div
              id="listbox"
              role="listbox"
              aria-expanded=${this.open ? "true" : "false"}
              aria-multiselectable=${this.multiple ? "true" : "false"}
              aria-labelledby="label"
              part="listbox"
              class="select__listbox"
              tabindex="-1"
              @mouseup=${this.handleOptionClick}
              @slotchange=${this.handleDefaultSlotChange}
            >
              <slot></slot>
            </div>
          </sl-popup>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${hasHelpText ? "false" : "true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
};
SlSelect.styles = [component_styles_default, form_control_styles_default, select_styles_default];
SlSelect.dependencies = {
  "sl-icon": SlIcon,
  "sl-popup": SlPopup,
  "sl-tag": SlTag
};
__decorateClass2([
  e5(".select")
], SlSelect.prototype, "popup", 2);
__decorateClass2([
  e5(".select__combobox")
], SlSelect.prototype, "combobox", 2);
__decorateClass2([
  e5(".select__display-input")
], SlSelect.prototype, "displayInput", 2);
__decorateClass2([
  e5(".select__value-input")
], SlSelect.prototype, "valueInput", 2);
__decorateClass2([
  e5(".select__listbox")
], SlSelect.prototype, "listbox", 2);
__decorateClass2([
  r6()
], SlSelect.prototype, "hasFocus", 2);
__decorateClass2([
  r6()
], SlSelect.prototype, "displayLabel", 2);
__decorateClass2([
  r6()
], SlSelect.prototype, "currentOption", 2);
__decorateClass2([
  r6()
], SlSelect.prototype, "selectedOptions", 2);
__decorateClass2([
  n4()
], SlSelect.prototype, "name", 2);
__decorateClass2([
  n4({
    converter: {
      fromAttribute: (value) => value.split(" "),
      toAttribute: (value) => value.join(" ")
    }
  })
], SlSelect.prototype, "value", 2);
__decorateClass2([
  defaultValue()
], SlSelect.prototype, "defaultValue", 2);
__decorateClass2([
  n4({ reflect: true })
], SlSelect.prototype, "size", 2);
__decorateClass2([
  n4()
], SlSelect.prototype, "placeholder", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlSelect.prototype, "multiple", 2);
__decorateClass2([
  n4({ attribute: "max-options-visible", type: Number })
], SlSelect.prototype, "maxOptionsVisible", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlSelect.prototype, "disabled", 2);
__decorateClass2([
  n4({ type: Boolean })
], SlSelect.prototype, "clearable", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlSelect.prototype, "open", 2);
__decorateClass2([
  n4({ type: Boolean })
], SlSelect.prototype, "hoist", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlSelect.prototype, "filled", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlSelect.prototype, "pill", 2);
__decorateClass2([
  n4()
], SlSelect.prototype, "label", 2);
__decorateClass2([
  n4({ reflect: true })
], SlSelect.prototype, "placement", 2);
__decorateClass2([
  n4({ attribute: "help-text" })
], SlSelect.prototype, "helpText", 2);
__decorateClass2([
  n4({ reflect: true })
], SlSelect.prototype, "form", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlSelect.prototype, "required", 2);
__decorateClass2([
  n4()
], SlSelect.prototype, "getTag", 2);
__decorateClass2([
  watch("disabled", { waitUntilFirstUpdate: true })
], SlSelect.prototype, "handleDisabledChange", 1);
__decorateClass2([
  watch("value", { waitUntilFirstUpdate: true })
], SlSelect.prototype, "handleValueChange", 1);
__decorateClass2([
  watch("open", { waitUntilFirstUpdate: true })
], SlSelect.prototype, "handleOpenChange", 1);
setDefaultAnimation("select.show", {
  keyframes: [
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1 }
  ],
  options: { duration: 100, easing: "ease" }
});
setDefaultAnimation("select.hide", {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.9 }
  ],
  options: { duration: 100, easing: "ease" }
});

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.FXXKMG2P.js
var option_styles_default = i`
  :host {
    display: block;
    user-select: none;
    -webkit-user-select: none;
  }

  :host(:focus) {
    outline: none;
  }

  .option {
    position: relative;
    display: flex;
    align-items: center;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-letter-spacing-normal);
    color: var(--sl-color-neutral-700);
    padding: var(--sl-spacing-x-small) var(--sl-spacing-medium) var(--sl-spacing-x-small) var(--sl-spacing-x-small);
    transition: var(--sl-transition-fast) fill;
    cursor: pointer;
  }

  .option--hover:not(.option--current):not(.option--disabled) {
    background-color: var(--sl-color-neutral-100);
    color: var(--sl-color-neutral-1000);
  }

  .option--current,
  .option--current.option--disabled {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
    opacity: 1;
  }

  .option--disabled {
    outline: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .option__label {
    flex: 1 1 auto;
    display: inline-block;
    line-height: var(--sl-line-height-dense);
  }

  .option .option__check {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: hidden;
    padding-inline-end: var(--sl-spacing-2x-small);
  }

  .option--selected .option__check {
    visibility: visible;
  }

  .option__prefix,
  .option__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .option__prefix::slotted(*) {
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .option__suffix::slotted(*) {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .option {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }
`;

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.KWDN2DUL.js
var SlOption = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController2(this);
    this.current = false;
    this.selected = false;
    this.hasHover = false;
    this.value = "";
    this.disabled = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "option");
    this.setAttribute("aria-selected", "false");
  }
  handleDefaultSlotChange() {
    const textLabel = this.getTextLabel();
    if (typeof this.cachedTextLabel === "undefined") {
      this.cachedTextLabel = textLabel;
      return;
    }
    if (textLabel !== this.cachedTextLabel) {
      this.cachedTextLabel = textLabel;
      this.emit("slotchange", { bubbles: true, composed: false, cancelable: false });
    }
  }
  handleMouseEnter() {
    this.hasHover = true;
  }
  handleMouseLeave() {
    this.hasHover = false;
  }
  handleDisabledChange() {
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  handleSelectedChange() {
    this.setAttribute("aria-selected", this.selected ? "true" : "false");
  }
  handleValueChange() {
    if (typeof this.value !== "string") {
      this.value = String(this.value);
    }
    if (this.value.includes(" ")) {
      console.error(`Option values cannot include a space. All spaces have been replaced with underscores.`, this);
      this.value = this.value.replace(/ /g, "_");
    }
  }
  /** Returns a plain text label based on the option's content. */
  getTextLabel() {
    const nodes = this.childNodes;
    let label = "";
    [...nodes].forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (!node.hasAttribute("slot")) {
          label += node.textContent;
        }
      }
      if (node.nodeType === Node.TEXT_NODE) {
        label += node.textContent;
      }
    });
    return label.trim();
  }
  render() {
    return x`
      <div
        part="base"
        class=${e8({
      option: true,
      "option--current": this.current,
      "option--disabled": this.disabled,
      "option--selected": this.selected,
      "option--hover": this.hasHover
    })}
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
      >
        <sl-icon part="checked-icon" class="option__check" name="check" library="system" aria-hidden="true"></sl-icon>
        <slot part="prefix" name="prefix" class="option__prefix"></slot>
        <slot part="label" class="option__label" @slotchange=${this.handleDefaultSlotChange}></slot>
        <slot part="suffix" name="suffix" class="option__suffix"></slot>
      </div>
    `;
  }
};
SlOption.styles = [component_styles_default, option_styles_default];
SlOption.dependencies = { "sl-icon": SlIcon };
__decorateClass2([
  e5(".option__label")
], SlOption.prototype, "defaultSlot", 2);
__decorateClass2([
  r6()
], SlOption.prototype, "current", 2);
__decorateClass2([
  r6()
], SlOption.prototype, "selected", 2);
__decorateClass2([
  r6()
], SlOption.prototype, "hasHover", 2);
__decorateClass2([
  n4({ reflect: true })
], SlOption.prototype, "value", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlOption.prototype, "disabled", 2);
__decorateClass2([
  watch("disabled")
], SlOption.prototype, "handleDisabledChange", 1);
__decorateClass2([
  watch("selected")
], SlOption.prototype, "handleSelectedChange", 1);
__decorateClass2([
  watch("value")
], SlOption.prototype, "handleValueChange", 1);

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.OZYH3LSG.js
var input_styles_default = i`
  :host {
    display: block;
  }

  .input {
    flex: 1 1 auto;
    display: inline-flex;
    align-items: stretch;
    justify-content: start;
    position: relative;
    width: 100%;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    letter-spacing: var(--sl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: text;
    transition:
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) border,
      var(--sl-transition-fast) box-shadow,
      var(--sl-transition-fast) background-color;
  }

  /* Standard inputs */
  .input--standard {
    background-color: var(--sl-input-background-color);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
  }

  .input--standard:hover:not(.input--disabled) {
    background-color: var(--sl-input-background-color-hover);
    border-color: var(--sl-input-border-color-hover);
  }

  .input--standard.input--focused:not(.input--disabled) {
    background-color: var(--sl-input-background-color-focus);
    border-color: var(--sl-input-border-color-focus);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-focus-ring-color);
  }

  .input--standard.input--focused:not(.input--disabled) .input__control {
    color: var(--sl-input-color-focus);
  }

  .input--standard.input--disabled {
    background-color: var(--sl-input-background-color-disabled);
    border-color: var(--sl-input-border-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input--standard.input--disabled .input__control {
    color: var(--sl-input-color-disabled);
  }

  .input--standard.input--disabled .input__control::placeholder {
    color: var(--sl-input-placeholder-color-disabled);
  }

  /* Filled inputs */
  .input--filled {
    border: none;
    background-color: var(--sl-input-filled-background-color);
    color: var(--sl-input-color);
  }

  .input--filled:hover:not(.input--disabled) {
    background-color: var(--sl-input-filled-background-color-hover);
  }

  .input--filled.input--focused:not(.input--disabled) {
    background-color: var(--sl-input-filled-background-color-focus);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .input--filled.input--disabled {
    background-color: var(--sl-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input__control {
    flex: 1 1 auto;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    min-width: 0;
    height: 100%;
    color: var(--sl-input-color);
    border: none;
    background: inherit;
    box-shadow: none;
    padding: 0;
    margin: 0;
    cursor: inherit;
    -webkit-appearance: none;
  }

  .input__control::-webkit-search-decoration,
  .input__control::-webkit-search-cancel-button,
  .input__control::-webkit-search-results-button,
  .input__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .input__control:-webkit-autofill,
  .input__control:-webkit-autofill:hover,
  .input__control:-webkit-autofill:focus,
  .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--sl-input-height-large) var(--sl-input-background-color-hover) inset !important;
    -webkit-text-fill-color: var(--sl-color-primary-500);
    caret-color: var(--sl-input-color);
  }

  .input--filled .input__control:-webkit-autofill,
  .input--filled .input__control:-webkit-autofill:hover,
  .input--filled .input__control:-webkit-autofill:focus,
  .input--filled .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--sl-input-height-large) var(--sl-input-filled-background-color) inset !important;
  }

  .input__control::placeholder {
    color: var(--sl-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }

  .input:hover:not(.input--disabled) .input__control {
    color: var(--sl-input-color-hover);
  }

  .input__control:focus {
    outline: none;
  }

  .input__prefix,
  .input__suffix {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    cursor: default;
  }

  .input__prefix ::slotted(sl-icon),
  .input__suffix ::slotted(sl-icon) {
    color: var(--sl-input-icon-color);
  }

  /*
   * Size modifiers
   */

  .input--small {
    border-radius: var(--sl-input-border-radius-small);
    font-size: var(--sl-input-font-size-small);
    height: var(--sl-input-height-small);
  }

  .input--small .input__control {
    height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-small);
  }

  .input--small .input__clear,
  .input--small .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-small) * 2);
  }

  .input--small .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-small);
  }

  .input--small .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-small);
  }

  .input--medium {
    border-radius: var(--sl-input-border-radius-medium);
    font-size: var(--sl-input-font-size-medium);
    height: var(--sl-input-height-medium);
  }

  .input--medium .input__control {
    height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-medium);
  }

  .input--medium .input__clear,
  .input--medium .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-medium) * 2);
  }

  .input--medium .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-medium);
  }

  .input--medium .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-medium);
  }

  .input--large {
    border-radius: var(--sl-input-border-radius-large);
    font-size: var(--sl-input-font-size-large);
    height: var(--sl-input-height-large);
  }

  .input--large .input__control {
    height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-large);
  }

  .input--large .input__clear,
  .input--large .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-large) * 2);
  }

  .input--large .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-large);
  }

  .input--large .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-large);
  }

  /*
   * Pill modifier
   */

  .input--pill.input--small {
    border-radius: var(--sl-input-height-small);
  }

  .input--pill.input--medium {
    border-radius: var(--sl-input-height-medium);
  }

  .input--pill.input--large {
    border-radius: var(--sl-input-height-large);
  }

  /*
   * Clearable + Password Toggle
   */

  .input__clear:not(.input__clear--visible) {
    visibility: hidden;
  }

  .input__clear,
  .input__password-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--sl-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--sl-transition-fast) color;
    cursor: pointer;
  }

  .input__clear:hover,
  .input__password-toggle:hover {
    color: var(--sl-input-icon-color-hover);
  }

  .input__clear:focus,
  .input__password-toggle:focus {
    outline: none;
  }

  .input--empty .input__clear {
    visibility: hidden;
  }

  /* Don't show the browser's password toggle in Edge */
  ::-ms-reveal {
    display: none;
  }

  /* Hide the built-in number spinner */
  .input--no-spin-buttons input[type='number']::-webkit-outer-spin-button,
  .input--no-spin-buttons input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    display: none;
  }

  .input--no-spin-buttons input[type='number'] {
    -moz-appearance: textfield;
  }
`;

// ../../../node_modules/.pnpm/lit-html@3.1.3/node_modules/lit-html/directives/live.js
var l4 = e7(class extends i4 {
  constructor(r8) {
    if (super(r8), r8.type !== t5.PROPERTY && r8.type !== t5.ATTRIBUTE && r8.type !== t5.BOOLEAN_ATTRIBUTE)
      throw Error("The `live` directive is not allowed on child or event bindings");
    if (!f3(r8))
      throw Error("`live` bindings can only contain a single expression");
  }
  render(r8) {
    return r8;
  }
  update(i5, [t7]) {
    if (t7 === w || t7 === T)
      return t7;
    const o9 = i5.element, l5 = i5.name;
    if (i5.type === t5.PROPERTY) {
      if (t7 === o9[l5])
        return w;
    } else if (i5.type === t5.BOOLEAN_ATTRIBUTE) {
      if (!!t7 === o9.hasAttribute(l5))
        return w;
    } else if (i5.type === t5.ATTRIBUTE && o9.getAttribute(l5) === t7 + "")
      return w;
    return m2(i5), t7;
  }
});

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.54TJVTKO.js
var SlInput = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.formControlController = new FormControlController(this, {
      assumeInteractionOn: ["sl-blur", "sl-input"]
    });
    this.hasSlotController = new HasSlotController(this, "help-text", "label");
    this.localize = new LocalizeController2(this);
    this.hasFocus = false;
    this.title = "";
    this.__numberInput = Object.assign(document.createElement("input"), { type: "number" });
    this.__dateInput = Object.assign(document.createElement("input"), { type: "date" });
    this.type = "text";
    this.name = "";
    this.value = "";
    this.defaultValue = "";
    this.size = "medium";
    this.filled = false;
    this.pill = false;
    this.label = "";
    this.helpText = "";
    this.clearable = false;
    this.disabled = false;
    this.placeholder = "";
    this.readonly = false;
    this.passwordToggle = false;
    this.passwordVisible = false;
    this.noSpinButtons = false;
    this.form = "";
    this.required = false;
    this.spellcheck = true;
  }
  //
  // NOTE: We use an in-memory input for these getters/setters instead of the one in the template because the properties
  // can be set before the component is rendered.
  //
  /**
   * Gets or sets the current value as a `Date` object. Returns `null` if the value can't be converted. This will use the native `<input type="{{type}}">` implementation and may result in an error.
   */
  get valueAsDate() {
    var _a;
    this.__dateInput.type = this.type;
    this.__dateInput.value = this.value;
    return ((_a = this.input) == null ? void 0 : _a.valueAsDate) || this.__dateInput.valueAsDate;
  }
  set valueAsDate(newValue) {
    this.__dateInput.type = this.type;
    this.__dateInput.valueAsDate = newValue;
    this.value = this.__dateInput.value;
  }
  /** Gets or sets the current value as a number. Returns `NaN` if the value can't be converted. */
  get valueAsNumber() {
    var _a;
    this.__numberInput.value = this.value;
    return ((_a = this.input) == null ? void 0 : _a.valueAsNumber) || this.__numberInput.valueAsNumber;
  }
  set valueAsNumber(newValue) {
    this.__numberInput.valueAsNumber = newValue;
    this.value = this.__numberInput.value;
  }
  /** Gets the validity state object */
  get validity() {
    return this.input.validity;
  }
  /** Gets the validation message */
  get validationMessage() {
    return this.input.validationMessage;
  }
  firstUpdated() {
    this.formControlController.updateValidity();
  }
  handleBlur() {
    this.hasFocus = false;
    this.emit("sl-blur");
  }
  handleChange() {
    this.value = this.input.value;
    this.emit("sl-change");
  }
  handleClearClick(event) {
    this.value = "";
    this.emit("sl-clear");
    this.emit("sl-input");
    this.emit("sl-change");
    this.input.focus();
    event.stopPropagation();
  }
  handleFocus() {
    this.hasFocus = true;
    this.emit("sl-focus");
  }
  handleInput() {
    this.value = this.input.value;
    this.formControlController.updateValidity();
    this.emit("sl-input");
  }
  handleInvalid(event) {
    this.formControlController.setValidity(false);
    this.formControlController.emitInvalidEvent(event);
  }
  handleKeyDown(event) {
    const hasModifier = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (event.key === "Enter" && !hasModifier) {
      setTimeout(() => {
        if (!event.defaultPrevented && !event.isComposing) {
          this.formControlController.submit();
        }
      });
    }
  }
  handlePasswordToggle() {
    this.passwordVisible = !this.passwordVisible;
  }
  handleDisabledChange() {
    this.formControlController.setValidity(this.disabled);
  }
  handleStepChange() {
    this.input.step = String(this.step);
    this.formControlController.updateValidity();
  }
  async handleValueChange() {
    await this.updateComplete;
    this.formControlController.updateValidity();
  }
  /** Sets focus on the input. */
  focus(options) {
    this.input.focus(options);
  }
  /** Removes focus from the input. */
  blur() {
    this.input.blur();
  }
  /** Selects all the text in the input. */
  select() {
    this.input.select();
  }
  /** Sets the start and end positions of the text selection (0-based). */
  setSelectionRange(selectionStart, selectionEnd, selectionDirection = "none") {
    this.input.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
  }
  /** Replaces a range of text with a new string. */
  setRangeText(replacement, start, end, selectMode = "preserve") {
    const selectionStart = start != null ? start : this.input.selectionStart;
    const selectionEnd = end != null ? end : this.input.selectionEnd;
    this.input.setRangeText(replacement, selectionStart, selectionEnd, selectMode);
    if (this.value !== this.input.value) {
      this.value = this.input.value;
    }
  }
  /** Displays the browser picker for an input element (only works if the browser supports it for the input type). */
  showPicker() {
    if ("showPicker" in HTMLInputElement.prototype) {
      this.input.showPicker();
    }
  }
  /** Increments the value of a numeric input type by the value of the step attribute. */
  stepUp() {
    this.input.stepUp();
    if (this.value !== this.input.value) {
      this.value = this.input.value;
    }
  }
  /** Decrements the value of a numeric input type by the value of the step attribute. */
  stepDown() {
    this.input.stepDown();
    if (this.value !== this.input.value) {
      this.value = this.input.value;
    }
  }
  /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
  checkValidity() {
    return this.input.checkValidity();
  }
  /** Gets the associated form, if one exists. */
  getForm() {
    return this.formControlController.getForm();
  }
  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    return this.input.reportValidity();
  }
  /** Sets a custom validation message. Pass an empty string to restore validity. */
  setCustomValidity(message) {
    this.input.setCustomValidity(message);
    this.formControlController.updateValidity();
  }
  render() {
    const hasLabelSlot = this.hasSlotController.test("label");
    const hasHelpTextSlot = this.hasSlotController.test("help-text");
    const hasLabel = this.label ? true : !!hasLabelSlot;
    const hasHelpText = this.helpText ? true : !!hasHelpTextSlot;
    const hasClearIcon = this.clearable && !this.disabled && !this.readonly;
    const isClearIconVisible = hasClearIcon && (typeof this.value === "number" || this.value.length > 0);
    return x`
      <div
        part="form-control"
        class=${e8({
      "form-control": true,
      "form-control--small": this.size === "small",
      "form-control--medium": this.size === "medium",
      "form-control--large": this.size === "large",
      "form-control--has-label": hasLabel,
      "form-control--has-help-text": hasHelpText
    })}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${hasLabel ? "false" : "true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${e8({
      input: true,
      // Sizes
      "input--small": this.size === "small",
      "input--medium": this.size === "medium",
      "input--large": this.size === "large",
      // States
      "input--pill": this.pill,
      "input--standard": !this.filled,
      "input--filled": this.filled,
      "input--disabled": this.disabled,
      "input--focused": this.hasFocus,
      "input--empty": !this.value,
      "input--no-spin-buttons": this.noSpinButtons
    })}
          >
            <span part="prefix" class="input__prefix">
              <slot name="prefix"></slot>
            </span>

            <input
              part="input"
              id="input"
              class="input__control"
              type=${this.type === "password" && this.passwordVisible ? "text" : this.type}
              title=${this.title}
              name=${o6(this.name)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${o6(this.placeholder)}
              minlength=${o6(this.minlength)}
              maxlength=${o6(this.maxlength)}
              min=${o6(this.min)}
              max=${o6(this.max)}
              step=${o6(this.step)}
              .value=${l4(this.value)}
              autocapitalize=${o6(this.autocapitalize)}
              autocomplete=${o6(this.autocomplete)}
              autocorrect=${o6(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${this.spellcheck}
              pattern=${o6(this.pattern)}
              enterkeyhint=${o6(this.enterkeyhint)}
              inputmode=${o6(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @keydown=${this.handleKeyDown}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />

            ${hasClearIcon ? x`
                  <button
                    part="clear-button"
                    class=${e8({
      input__clear: true,
      "input__clear--visible": isClearIconVisible
    })}
                    type="button"
                    aria-label=${this.localize.term("clearEntry")}
                    @click=${this.handleClearClick}
                    tabindex="-1"
                  >
                    <slot name="clear-icon">
                      <sl-icon name="x-circle-fill" library="system"></sl-icon>
                    </slot>
                  </button>
                ` : ""}
            ${this.passwordToggle && !this.disabled ? x`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this.localize.term(this.passwordVisible ? "hidePassword" : "showPassword")}
                    @click=${this.handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${this.passwordVisible ? x`
                          <slot name="show-password-icon">
                            <sl-icon name="eye-slash" library="system"></sl-icon>
                          </slot>
                        ` : x`
                          <slot name="hide-password-icon">
                            <sl-icon name="eye" library="system"></sl-icon>
                          </slot>
                        `}
                  </button>
                ` : ""}

            <span part="suffix" class="input__suffix">
              <slot name="suffix"></slot>
            </span>
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${hasHelpText ? "false" : "true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
};
SlInput.styles = [component_styles_default, form_control_styles_default, input_styles_default];
SlInput.dependencies = { "sl-icon": SlIcon };
__decorateClass2([
  e5(".input__control")
], SlInput.prototype, "input", 2);
__decorateClass2([
  r6()
], SlInput.prototype, "hasFocus", 2);
__decorateClass2([
  n4()
], SlInput.prototype, "title", 2);
__decorateClass2([
  n4({ reflect: true })
], SlInput.prototype, "type", 2);
__decorateClass2([
  n4()
], SlInput.prototype, "name", 2);
__decorateClass2([
  n4()
], SlInput.prototype, "value", 2);
__decorateClass2([
  defaultValue()
], SlInput.prototype, "defaultValue", 2);
__decorateClass2([
  n4({ reflect: true })
], SlInput.prototype, "size", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlInput.prototype, "filled", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlInput.prototype, "pill", 2);
__decorateClass2([
  n4()
], SlInput.prototype, "label", 2);
__decorateClass2([
  n4({ attribute: "help-text" })
], SlInput.prototype, "helpText", 2);
__decorateClass2([
  n4({ type: Boolean })
], SlInput.prototype, "clearable", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlInput.prototype, "disabled", 2);
__decorateClass2([
  n4()
], SlInput.prototype, "placeholder", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlInput.prototype, "readonly", 2);
__decorateClass2([
  n4({ attribute: "password-toggle", type: Boolean })
], SlInput.prototype, "passwordToggle", 2);
__decorateClass2([
  n4({ attribute: "password-visible", type: Boolean })
], SlInput.prototype, "passwordVisible", 2);
__decorateClass2([
  n4({ attribute: "no-spin-buttons", type: Boolean })
], SlInput.prototype, "noSpinButtons", 2);
__decorateClass2([
  n4({ reflect: true })
], SlInput.prototype, "form", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlInput.prototype, "required", 2);
__decorateClass2([
  n4()
], SlInput.prototype, "pattern", 2);
__decorateClass2([
  n4({ type: Number })
], SlInput.prototype, "minlength", 2);
__decorateClass2([
  n4({ type: Number })
], SlInput.prototype, "maxlength", 2);
__decorateClass2([
  n4()
], SlInput.prototype, "min", 2);
__decorateClass2([
  n4()
], SlInput.prototype, "max", 2);
__decorateClass2([
  n4()
], SlInput.prototype, "step", 2);
__decorateClass2([
  n4()
], SlInput.prototype, "autocapitalize", 2);
__decorateClass2([
  n4()
], SlInput.prototype, "autocorrect", 2);
__decorateClass2([
  n4()
], SlInput.prototype, "autocomplete", 2);
__decorateClass2([
  n4({ type: Boolean })
], SlInput.prototype, "autofocus", 2);
__decorateClass2([
  n4()
], SlInput.prototype, "enterkeyhint", 2);
__decorateClass2([
  n4({
    type: Boolean,
    converter: {
      // Allow "true|false" attribute values but keep the property boolean
      fromAttribute: (value) => !value || value === "false" ? false : true,
      toAttribute: (value) => value ? "true" : "false"
    }
  })
], SlInput.prototype, "spellcheck", 2);
__decorateClass2([
  n4()
], SlInput.prototype, "inputmode", 2);
__decorateClass2([
  watch("disabled", { waitUntilFirstUpdate: true })
], SlInput.prototype, "handleDisabledChange", 1);
__decorateClass2([
  watch("step", { waitUntilFirstUpdate: true })
], SlInput.prototype, "handleStepChange", 1);
__decorateClass2([
  watch("value", { waitUntilFirstUpdate: true })
], SlInput.prototype, "handleValueChange", 1);

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.7DUCI5S4.js
var spinner_styles_default = i`
  :host {
    --track-width: 2px;
    --track-color: rgb(128 128 128 / 25%);
    --indicator-color: var(--sl-color-primary-600);
    --speed: 2s;

    display: inline-flex;
    width: 1em;
    height: 1em;
    flex: none;
  }

  .spinner {
    flex: 1 1 auto;
    height: 100%;
    width: 100%;
  }

  .spinner__track,
  .spinner__indicator {
    fill: none;
    stroke-width: var(--track-width);
    r: calc(0.5em - var(--track-width) / 2);
    cx: 0.5em;
    cy: 0.5em;
    transform-origin: 50% 50%;
  }

  .spinner__track {
    stroke: var(--track-color);
    transform-origin: 0% 0%;
  }

  .spinner__indicator {
    stroke: var(--indicator-color);
    stroke-linecap: round;
    stroke-dasharray: 150% 75%;
    animation: spin var(--speed) linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      stroke-dasharray: 0.05em, 3em;
    }

    50% {
      transform: rotate(450deg);
      stroke-dasharray: 1.375em, 1.375em;
    }

    100% {
      transform: rotate(1080deg);
      stroke-dasharray: 0.05em, 3em;
    }
  }
`;

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.TY4GUJRD.js
var SlSpinner = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController2(this);
  }
  render() {
    return x`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `;
  }
};
SlSpinner.styles = [component_styles_default, spinner_styles_default];

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.QPYT3OK4.js
var button_styles_default = i`
  :host {
    display: inline-block;
    position: relative;
    width: auto;
    cursor: pointer;
  }

  .button {
    display: inline-flex;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    border-style: solid;
    border-width: var(--sl-input-border-width);
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-font-weight-semibold);
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    padding: 0;
    transition:
      var(--sl-transition-x-fast) background-color,
      var(--sl-transition-x-fast) color,
      var(--sl-transition-x-fast) border,
      var(--sl-transition-x-fast) box-shadow;
    cursor: inherit;
  }

  .button::-moz-focus-inner {
    border: 0;
  }

  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* When disabled, prevent mouse events from bubbling up from children */
  .button--disabled * {
    pointer-events: none;
  }

  .button__prefix,
  .button__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .button__label {
    display: inline-block;
  }

  .button__label::slotted(sl-icon) {
    vertical-align: -2px;
  }

  /*
   * Standard buttons
   */

  /* Default */
  .button--standard.button--default {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-neutral-300);
    color: var(--sl-color-neutral-700);
  }

  .button--standard.button--default:hover:not(.button--disabled) {
    background-color: var(--sl-color-primary-50);
    border-color: var(--sl-color-primary-300);
    color: var(--sl-color-primary-700);
  }

  .button--standard.button--default:active:not(.button--disabled) {
    background-color: var(--sl-color-primary-100);
    border-color: var(--sl-color-primary-400);
    color: var(--sl-color-primary-700);
  }

  /* Primary */
  .button--standard.button--primary {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--primary:hover:not(.button--disabled) {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--primary:active:not(.button--disabled) {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  /* Success */
  .button--standard.button--success {
    background-color: var(--sl-color-success-600);
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--success:hover:not(.button--disabled) {
    background-color: var(--sl-color-success-500);
    border-color: var(--sl-color-success-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--success:active:not(.button--disabled) {
    background-color: var(--sl-color-success-600);
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  /* Neutral */
  .button--standard.button--neutral {
    background-color: var(--sl-color-neutral-600);
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--neutral:hover:not(.button--disabled) {
    background-color: var(--sl-color-neutral-500);
    border-color: var(--sl-color-neutral-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--neutral:active:not(.button--disabled) {
    background-color: var(--sl-color-neutral-600);
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  /* Warning */
  .button--standard.button--warning {
    background-color: var(--sl-color-warning-600);
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }
  .button--standard.button--warning:hover:not(.button--disabled) {
    background-color: var(--sl-color-warning-500);
    border-color: var(--sl-color-warning-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--warning:active:not(.button--disabled) {
    background-color: var(--sl-color-warning-600);
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  /* Danger */
  .button--standard.button--danger {
    background-color: var(--sl-color-danger-600);
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--danger:hover:not(.button--disabled) {
    background-color: var(--sl-color-danger-500);
    border-color: var(--sl-color-danger-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--danger:active:not(.button--disabled) {
    background-color: var(--sl-color-danger-600);
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  /*
   * Outline buttons
   */

  .button--outline {
    background: none;
    border: solid 1px;
  }

  /* Default */
  .button--outline.button--default {
    border-color: var(--sl-color-neutral-300);
    color: var(--sl-color-neutral-700);
  }

  .button--outline.button--default:hover:not(.button--disabled),
  .button--outline.button--default.button--checked:not(.button--disabled) {
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--default:active:not(.button--disabled) {
    border-color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-700);
    color: var(--sl-color-neutral-0);
  }

  /* Primary */
  .button--outline.button--primary {
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-primary-600);
  }

  .button--outline.button--primary:hover:not(.button--disabled),
  .button--outline.button--primary.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--primary:active:not(.button--disabled) {
    border-color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-700);
    color: var(--sl-color-neutral-0);
  }

  /* Success */
  .button--outline.button--success {
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-success-600);
  }

  .button--outline.button--success:hover:not(.button--disabled),
  .button--outline.button--success.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--success:active:not(.button--disabled) {
    border-color: var(--sl-color-success-700);
    background-color: var(--sl-color-success-700);
    color: var(--sl-color-neutral-0);
  }

  /* Neutral */
  .button--outline.button--neutral {
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-600);
  }

  .button--outline.button--neutral:hover:not(.button--disabled),
  .button--outline.button--neutral.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--neutral:active:not(.button--disabled) {
    border-color: var(--sl-color-neutral-700);
    background-color: var(--sl-color-neutral-700);
    color: var(--sl-color-neutral-0);
  }

  /* Warning */
  .button--outline.button--warning {
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-warning-600);
  }

  .button--outline.button--warning:hover:not(.button--disabled),
  .button--outline.button--warning.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--warning:active:not(.button--disabled) {
    border-color: var(--sl-color-warning-700);
    background-color: var(--sl-color-warning-700);
    color: var(--sl-color-neutral-0);
  }

  /* Danger */
  .button--outline.button--danger {
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-danger-600);
  }

  .button--outline.button--danger:hover:not(.button--disabled),
  .button--outline.button--danger.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--danger:active:not(.button--disabled) {
    border-color: var(--sl-color-danger-700);
    background-color: var(--sl-color-danger-700);
    color: var(--sl-color-neutral-0);
  }

  @media (forced-colors: active) {
    .button.button--outline.button--checked:not(.button--disabled) {
      outline: solid 2px transparent;
    }
  }

  /*
   * Text buttons
   */

  .button--text {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-600);
  }

  .button--text:hover:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-500);
  }

  .button--text:focus-visible:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-500);
  }

  .button--text:active:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-700);
  }

  /*
   * Size modifiers
   */

  .button--small {
    height: auto;
    min-height: var(--sl-input-height-small);
    font-size: var(--sl-button-font-size-small);
    line-height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-small);
  }

  .button--medium {
    height: auto;
    min-height: var(--sl-input-height-medium);
    font-size: var(--sl-button-font-size-medium);
    line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-medium);
  }

  .button--large {
    height: auto;
    min-height: var(--sl-input-height-large);
    font-size: var(--sl-button-font-size-large);
    line-height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-large);
  }

  /*
   * Pill modifier
   */

  .button--pill.button--small {
    border-radius: var(--sl-input-height-small);
  }

  .button--pill.button--medium {
    border-radius: var(--sl-input-height-medium);
  }

  .button--pill.button--large {
    border-radius: var(--sl-input-height-large);
  }

  /*
   * Circle modifier
   */

  .button--circle {
    padding-left: 0;
    padding-right: 0;
  }

  .button--circle.button--small {
    width: var(--sl-input-height-small);
    border-radius: 50%;
  }

  .button--circle.button--medium {
    width: var(--sl-input-height-medium);
    border-radius: 50%;
  }

  .button--circle.button--large {
    width: var(--sl-input-height-large);
    border-radius: 50%;
  }

  .button--circle .button__prefix,
  .button--circle .button__suffix,
  .button--circle .button__caret {
    display: none;
  }

  /*
   * Caret modifier
   */

  .button--caret .button__suffix {
    display: none;
  }

  .button--caret .button__caret {
    height: auto;
  }

  /*
   * Loading modifier
   */

  .button--loading {
    position: relative;
    cursor: wait;
  }

  .button--loading .button__prefix,
  .button--loading .button__label,
  .button--loading .button__suffix,
  .button--loading .button__caret {
    visibility: hidden;
  }

  .button--loading sl-spinner {
    --indicator-color: currentColor;
    position: absolute;
    font-size: 1em;
    height: 1em;
    width: 1em;
    top: calc(50% - 0.5em);
    left: calc(50% - 0.5em);
  }

  /*
   * Badges
   */

  .button ::slotted(sl-badge) {
    position: absolute;
    top: 0;
    right: 0;
    translate: 50% -50%;
    pointer-events: none;
  }

  .button--rtl ::slotted(sl-badge) {
    right: auto;
    left: 0;
    translate: -50% -50%;
  }

  /*
   * Button spacing
   */

  .button--has-label.button--small .button__label {
    padding: 0 var(--sl-spacing-small);
  }

  .button--has-label.button--medium .button__label {
    padding: 0 var(--sl-spacing-medium);
  }

  .button--has-label.button--large .button__label {
    padding: 0 var(--sl-spacing-large);
  }

  .button--has-prefix.button--small {
    padding-inline-start: var(--sl-spacing-x-small);
  }

  .button--has-prefix.button--small .button__label {
    padding-inline-start: var(--sl-spacing-x-small);
  }

  .button--has-prefix.button--medium {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--medium .button__label {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--large {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--large .button__label {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-suffix.button--small,
  .button--caret.button--small {
    padding-inline-end: var(--sl-spacing-x-small);
  }

  .button--has-suffix.button--small .button__label,
  .button--caret.button--small .button__label {
    padding-inline-end: var(--sl-spacing-x-small);
  }

  .button--has-suffix.button--medium,
  .button--caret.button--medium {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--medium .button__label,
  .button--caret.button--medium .button__label {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--large,
  .button--caret.button--large {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--large .button__label,
  .button--caret.button--large .button__label {
    padding-inline-end: var(--sl-spacing-small);
  }

  /*
   * Button groups support a variety of button types (e.g. buttons with tooltips, buttons as dropdown triggers, etc.).
   * This means buttons aren't always direct descendants of the button group, thus we can't target them with the
   * ::slotted selector. To work around this, the button group component does some magic to add these special classes to
   * buttons and we style them here instead.
   */

  :host(.sl-button-group__button--first:not(.sl-button-group__button--last)) .button {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host(.sl-button-group__button--inner) .button {
    border-radius: 0;
  }

  :host(.sl-button-group__button--last:not(.sl-button-group__button--first)) .button {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  /* All except the first */
  :host(.sl-button-group__button:not(.sl-button-group__button--first)) {
    margin-inline-start: calc(-1 * var(--sl-input-border-width));
  }

  /* Add a visual separator between solid buttons */
  :host(
      .sl-button-group__button:not(
          .sl-button-group__button--first,
          .sl-button-group__button--radio,
          [variant='default']
        ):not(:hover)
    )
    .button:after {
    content: '';
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    bottom: 0;
    border-left: solid 1px rgb(128 128 128 / 33%);
    mix-blend-mode: multiply;
  }

  /* Bump hovered, focused, and checked buttons up so their focus ring isn't clipped */
  :host(.sl-button-group__button--hover) {
    z-index: 1;
  }

  /* Focus and checked are always on top */
  :host(.sl-button-group__button--focus),
  :host(.sl-button-group__button[checked]) {
    z-index: 2;
  }
`;

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.64QWL6LI.js
var SlButton = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.formControlController = new FormControlController(this, {
      assumeInteractionOn: ["click"]
    });
    this.hasSlotController = new HasSlotController(this, "[default]", "prefix", "suffix");
    this.localize = new LocalizeController2(this);
    this.hasFocus = false;
    this.invalid = false;
    this.title = "";
    this.variant = "default";
    this.size = "medium";
    this.caret = false;
    this.disabled = false;
    this.loading = false;
    this.outline = false;
    this.pill = false;
    this.circle = false;
    this.type = "button";
    this.name = "";
    this.value = "";
    this.href = "";
    this.rel = "noreferrer noopener";
  }
  /** Gets the validity state object */
  get validity() {
    if (this.isButton()) {
      return this.button.validity;
    }
    return validValidityState;
  }
  /** Gets the validation message */
  get validationMessage() {
    if (this.isButton()) {
      return this.button.validationMessage;
    }
    return "";
  }
  firstUpdated() {
    if (this.isButton()) {
      this.formControlController.updateValidity();
    }
  }
  handleBlur() {
    this.hasFocus = false;
    this.emit("sl-blur");
  }
  handleFocus() {
    this.hasFocus = true;
    this.emit("sl-focus");
  }
  handleClick() {
    if (this.type === "submit") {
      this.formControlController.submit(this);
    }
    if (this.type === "reset") {
      this.formControlController.reset(this);
    }
  }
  handleInvalid(event) {
    this.formControlController.setValidity(false);
    this.formControlController.emitInvalidEvent(event);
  }
  isButton() {
    return this.href ? false : true;
  }
  isLink() {
    return this.href ? true : false;
  }
  handleDisabledChange() {
    if (this.isButton()) {
      this.formControlController.setValidity(this.disabled);
    }
  }
  /** Simulates a click on the button. */
  click() {
    this.button.click();
  }
  /** Sets focus on the button. */
  focus(options) {
    this.button.focus(options);
  }
  /** Removes focus from the button. */
  blur() {
    this.button.blur();
  }
  /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
  checkValidity() {
    if (this.isButton()) {
      return this.button.checkValidity();
    }
    return true;
  }
  /** Gets the associated form, if one exists. */
  getForm() {
    return this.formControlController.getForm();
  }
  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    if (this.isButton()) {
      return this.button.reportValidity();
    }
    return true;
  }
  /** Sets a custom validation message. Pass an empty string to restore validity. */
  setCustomValidity(message) {
    if (this.isButton()) {
      this.button.setCustomValidity(message);
      this.formControlController.updateValidity();
    }
  }
  render() {
    const isLink = this.isLink();
    const tag = isLink ? s4`a` : s4`button`;
    return n5`
      <${tag}
        part="base"
        class=${e8({
      button: true,
      "button--default": this.variant === "default",
      "button--primary": this.variant === "primary",
      "button--success": this.variant === "success",
      "button--neutral": this.variant === "neutral",
      "button--warning": this.variant === "warning",
      "button--danger": this.variant === "danger",
      "button--text": this.variant === "text",
      "button--small": this.size === "small",
      "button--medium": this.size === "medium",
      "button--large": this.size === "large",
      "button--caret": this.caret,
      "button--circle": this.circle,
      "button--disabled": this.disabled,
      "button--focused": this.hasFocus,
      "button--loading": this.loading,
      "button--standard": !this.outline,
      "button--outline": this.outline,
      "button--pill": this.pill,
      "button--rtl": this.localize.dir() === "rtl",
      "button--has-label": this.hasSlotController.test("[default]"),
      "button--has-prefix": this.hasSlotController.test("prefix"),
      "button--has-suffix": this.hasSlotController.test("suffix")
    })}
        ?disabled=${o6(isLink ? void 0 : this.disabled)}
        type=${o6(isLink ? void 0 : this.type)}
        title=${this.title}
        name=${o6(isLink ? void 0 : this.name)}
        value=${o6(isLink ? void 0 : this.value)}
        href=${o6(isLink ? this.href : void 0)}
        target=${o6(isLink ? this.target : void 0)}
        download=${o6(isLink ? this.download : void 0)}
        rel=${o6(isLink ? this.rel : void 0)}
        role=${o6(isLink ? void 0 : "button")}
        aria-disabled=${this.disabled ? "true" : "false"}
        tabindex=${this.disabled ? "-1" : "0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @invalid=${this.isButton() ? this.handleInvalid : null}
        @click=${this.handleClick}
      >
        <slot name="prefix" part="prefix" class="button__prefix"></slot>
        <slot part="label" class="button__label"></slot>
        <slot name="suffix" part="suffix" class="button__suffix"></slot>
        ${this.caret ? n5` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> ` : ""}
        ${this.loading ? n5`<sl-spinner part="spinner"></sl-spinner>` : ""}
      </${tag}>
    `;
  }
};
SlButton.styles = [component_styles_default, button_styles_default];
SlButton.dependencies = {
  "sl-icon": SlIcon,
  "sl-spinner": SlSpinner
};
__decorateClass2([
  e5(".button")
], SlButton.prototype, "button", 2);
__decorateClass2([
  r6()
], SlButton.prototype, "hasFocus", 2);
__decorateClass2([
  r6()
], SlButton.prototype, "invalid", 2);
__decorateClass2([
  n4()
], SlButton.prototype, "title", 2);
__decorateClass2([
  n4({ reflect: true })
], SlButton.prototype, "variant", 2);
__decorateClass2([
  n4({ reflect: true })
], SlButton.prototype, "size", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlButton.prototype, "caret", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlButton.prototype, "disabled", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlButton.prototype, "loading", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlButton.prototype, "outline", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlButton.prototype, "pill", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlButton.prototype, "circle", 2);
__decorateClass2([
  n4()
], SlButton.prototype, "type", 2);
__decorateClass2([
  n4()
], SlButton.prototype, "name", 2);
__decorateClass2([
  n4()
], SlButton.prototype, "value", 2);
__decorateClass2([
  n4()
], SlButton.prototype, "href", 2);
__decorateClass2([
  n4()
], SlButton.prototype, "target", 2);
__decorateClass2([
  n4()
], SlButton.prototype, "rel", 2);
__decorateClass2([
  n4()
], SlButton.prototype, "download", 2);
__decorateClass2([
  n4()
], SlButton.prototype, "form", 2);
__decorateClass2([
  n4({ attribute: "formaction" })
], SlButton.prototype, "formAction", 2);
__decorateClass2([
  n4({ attribute: "formenctype" })
], SlButton.prototype, "formEnctype", 2);
__decorateClass2([
  n4({ attribute: "formmethod" })
], SlButton.prototype, "formMethod", 2);
__decorateClass2([
  n4({ attribute: "formnovalidate", type: Boolean })
], SlButton.prototype, "formNoValidate", 2);
__decorateClass2([
  n4({ attribute: "formtarget" })
], SlButton.prototype, "formTarget", 2);
__decorateClass2([
  watch("disabled", { waitUntilFirstUpdate: true })
], SlButton.prototype, "handleDisabledChange", 1);

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.W7K6OMDR.js
var checkbox_styles_default = i`
  :host {
    display: inline-block;
  }

  .checkbox {
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    color: var(--sl-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .checkbox--small {
    --toggle-size: var(--sl-toggle-size-small);
    font-size: var(--sl-input-font-size-small);
  }

  .checkbox--medium {
    --toggle-size: var(--sl-toggle-size-medium);
    font-size: var(--sl-input-font-size-medium);
  }

  .checkbox--large {
    --toggle-size: var(--sl-toggle-size-large);
    font-size: var(--sl-input-font-size-large);
  }

  .checkbox__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--toggle-size);
    height: var(--toggle-size);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
    border-radius: 2px;
    background-color: var(--sl-input-background-color);
    color: var(--sl-color-neutral-0);
    transition:
      var(--sl-transition-fast) border-color,
      var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) box-shadow;
  }

  .checkbox__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  .checkbox__checked-icon,
  .checkbox__indeterminate-icon {
    display: inline-flex;
    width: var(--toggle-size);
    height: var(--toggle-size);
  }

  /* Hover */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__control:hover {
    border-color: var(--sl-input-border-color-hover);
    background-color: var(--sl-input-background-color-hover);
  }

  /* Focus */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Checked/indeterminate */
  .checkbox--checked .checkbox__control,
  .checkbox--indeterminate .checkbox__control {
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-600);
  }

  /* Checked/indeterminate + hover */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__control:hover,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__control:hover {
    border-color: var(--sl-color-primary-500);
    background-color: var(--sl-color-primary-500);
  }

  /* Checked/indeterminate + focus */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Disabled */
  .checkbox--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .checkbox__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    line-height: var(--toggle-size);
    margin-inline-start: 0.5em;
    user-select: none;
    -webkit-user-select: none;
  }

  :host([required]) .checkbox__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
  }
`;

// ../../../node_modules/.pnpm/@shoelace-style+shoelace@2.14.0_@types+react@18.3.3/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.FHOQLXTU.js
var SlCheckbox = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.formControlController = new FormControlController(this, {
      value: (control) => control.checked ? control.value || "on" : void 0,
      defaultValue: (control) => control.defaultChecked,
      setValue: (control, checked) => control.checked = checked
    });
    this.hasSlotController = new HasSlotController(this, "help-text");
    this.hasFocus = false;
    this.title = "";
    this.name = "";
    this.size = "medium";
    this.disabled = false;
    this.checked = false;
    this.indeterminate = false;
    this.defaultChecked = false;
    this.form = "";
    this.required = false;
    this.helpText = "";
  }
  /** Gets the validity state object */
  get validity() {
    return this.input.validity;
  }
  /** Gets the validation message */
  get validationMessage() {
    return this.input.validationMessage;
  }
  firstUpdated() {
    this.formControlController.updateValidity();
  }
  handleClick() {
    this.checked = !this.checked;
    this.indeterminate = false;
    this.emit("sl-change");
  }
  handleBlur() {
    this.hasFocus = false;
    this.emit("sl-blur");
  }
  handleInput() {
    this.emit("sl-input");
  }
  handleInvalid(event) {
    this.formControlController.setValidity(false);
    this.formControlController.emitInvalidEvent(event);
  }
  handleFocus() {
    this.hasFocus = true;
    this.emit("sl-focus");
  }
  handleDisabledChange() {
    this.formControlController.setValidity(this.disabled);
  }
  handleStateChange() {
    this.input.checked = this.checked;
    this.input.indeterminate = this.indeterminate;
    this.formControlController.updateValidity();
  }
  /** Simulates a click on the checkbox. */
  click() {
    this.input.click();
  }
  /** Sets focus on the checkbox. */
  focus(options) {
    this.input.focus(options);
  }
  /** Removes focus from the checkbox. */
  blur() {
    this.input.blur();
  }
  /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
  checkValidity() {
    return this.input.checkValidity();
  }
  /** Gets the associated form, if one exists. */
  getForm() {
    return this.formControlController.getForm();
  }
  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    return this.input.reportValidity();
  }
  /**
   * Sets a custom validation message. The value provided will be shown to the user when the form is submitted. To clear
   * the custom validation message, call this method with an empty string.
   */
  setCustomValidity(message) {
    this.input.setCustomValidity(message);
    this.formControlController.updateValidity();
  }
  render() {
    const hasHelpTextSlot = this.hasSlotController.test("help-text");
    const hasHelpText = this.helpText ? true : !!hasHelpTextSlot;
    return x`
      <div
        class=${e8({
      "form-control": true,
      "form-control--small": this.size === "small",
      "form-control--medium": this.size === "medium",
      "form-control--large": this.size === "large",
      "form-control--has-help-text": hasHelpText
    })}
      >
        <label
          part="base"
          class=${e8({
      checkbox: true,
      "checkbox--checked": this.checked,
      "checkbox--disabled": this.disabled,
      "checkbox--focused": this.hasFocus,
      "checkbox--indeterminate": this.indeterminate,
      "checkbox--small": this.size === "small",
      "checkbox--medium": this.size === "medium",
      "checkbox--large": this.size === "large"
    })}
        >
          <input
            class="checkbox__input"
            type="checkbox"
            title=${this.title}
            name=${this.name}
            value=${o6(this.value)}
            .indeterminate=${l4(this.indeterminate)}
            .checked=${l4(this.checked)}
            .disabled=${this.disabled}
            .required=${this.required}
            aria-checked=${this.checked ? "true" : "false"}
            aria-describedby="help-text"
            @click=${this.handleClick}
            @input=${this.handleInput}
            @invalid=${this.handleInvalid}
            @blur=${this.handleBlur}
            @focus=${this.handleFocus}
          />

          <span
            part="control${this.checked ? " control--checked" : ""}${this.indeterminate ? " control--indeterminate" : ""}"
            class="checkbox__control"
          >
            ${this.checked ? x`
                  <sl-icon part="checked-icon" class="checkbox__checked-icon" library="system" name="check"></sl-icon>
                ` : ""}
            ${!this.checked && this.indeterminate ? x`
                  <sl-icon
                    part="indeterminate-icon"
                    class="checkbox__indeterminate-icon"
                    library="system"
                    name="indeterminate"
                  ></sl-icon>
                ` : ""}
          </span>

          <div part="label" class="checkbox__label">
            <slot></slot>
          </div>
        </label>

        <div
          aria-hidden=${hasHelpText ? "false" : "true"}
          class="form-control__help-text"
          id="help-text"
          part="form-control-help-text"
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
};
SlCheckbox.styles = [component_styles_default, checkbox_styles_default];
SlCheckbox.dependencies = { "sl-icon": SlIcon };
__decorateClass2([
  e5('input[type="checkbox"]')
], SlCheckbox.prototype, "input", 2);
__decorateClass2([
  r6()
], SlCheckbox.prototype, "hasFocus", 2);
__decorateClass2([
  n4()
], SlCheckbox.prototype, "title", 2);
__decorateClass2([
  n4()
], SlCheckbox.prototype, "name", 2);
__decorateClass2([
  n4()
], SlCheckbox.prototype, "value", 2);
__decorateClass2([
  n4({ reflect: true })
], SlCheckbox.prototype, "size", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlCheckbox.prototype, "disabled", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlCheckbox.prototype, "checked", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlCheckbox.prototype, "indeterminate", 2);
__decorateClass2([
  defaultValue("checked")
], SlCheckbox.prototype, "defaultChecked", 2);
__decorateClass2([
  n4({ reflect: true })
], SlCheckbox.prototype, "form", 2);
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], SlCheckbox.prototype, "required", 2);
__decorateClass2([
  n4({ attribute: "help-text" })
], SlCheckbox.prototype, "helpText", 2);
__decorateClass2([
  watch("disabled", { waitUntilFirstUpdate: true })
], SlCheckbox.prototype, "handleDisabledChange", 1);
__decorateClass2([
  watch(["checked", "indeterminate"], { waitUntilFirstUpdate: true })
], SlCheckbox.prototype, "handleStateChange", 1);

// src/stories/inlang-settings.ts
if (!customElements.get("sl-select"))
  customElements.define("sl-select", SlSelect);
if (!customElements.get("sl-option"))
  customElements.define("sl-option", SlOption);
if (!customElements.get("sl-input"))
  customElements.define("sl-input", SlInput);
if (!customElements.get("sl-button"))
  customElements.define("sl-button", SlButton);
if (!customElements.get("sl-checkbox"))
  customElements.define("sl-checkbox", SlCheckbox);
var InlangSettings = class extends s3 {
  constructor() {
    super(...arguments);
    this.settings = {};
    this.installedPlugins = [];
    this.installedMessageLintRules = [];
    this._newSettings = void 0;
    this._unsavedChanges = false;
    this.handleInlangProjectChange = (value, property, moduleId) => {
      if (this._newSettings && moduleId) {
        this._newSettings = {
          ...this._newSettings,
          [moduleId]: {
            ...this._newSettings[moduleId],
            [property]: value
          }
        };
      } else if (this._newSettings) {
        this._newSettings = {
          ...this._newSettings,
          [property]: value
        };
      }
      if (JSON.stringify(this.settings) !== JSON.stringify(this._newSettings)) {
        this._unsavedChanges = true;
      } else {
        this._unsavedChanges = false;
      }
    };
    this._revertChanges = () => {
      if (this.settings) {
        this._newSettings = JSON.parse(JSON.stringify(this.settings));
      }
      this._unsavedChanges = false;
    };
    this._saveChanges = () => {
      if (this._newSettings) {
        this.dispatchOnSetSettings(this._newSettings);
        this.settings = JSON.parse(JSON.stringify(this._newSettings));
      }
      this._unsavedChanges = false;
    };
  }
  dispatchOnSetSettings(settings) {
    const onSetSettings = new CustomEvent("set-settings", {
      detail: {
        argument: settings
      }
    });
    this.dispatchEvent(onSetSettings);
  }
  async firstUpdated() {
    await this.updateComplete;
    if (this.settings) {
      this._newSettings = JSON.parse(JSON.stringify(this.settings));
    }
    overridePrimitiveColors_default();
  }
  get _settingProperties() {
    const _settings = this.settings;
    const _installedPlugins = this.installedPlugins;
    const _installedMessageLintRules = this.installedMessageLintRules;
    if (!_settings)
      throw new Error("No inlang settings");
    if (!_installedPlugins)
      throw new Error("No installed plugins");
    const generalSchema = { internal: { schema: ProjectSettings.allOf[0] } };
    for (const plugin of _installedPlugins) {
      if (plugin.settingsSchema) {
        generalSchema[plugin.id] = {
          schema: plugin.settingsSchema,
          meta: plugin
        };
      }
    }
    for (const lintRule of _installedMessageLintRules) {
      if (lintRule.settingsSchema) {
        generalSchema[lintRule.id] = {
          schema: lintRule.settingsSchema,
          meta: lintRule
        };
      }
    }
    return generalSchema;
  }
  render() {
    return x` <div class="container" part="base">
			${Object.entries(this._settingProperties).map(([key, value]) => {
      const item = registry.find((item2) => item2.id === value.meta?.id);
      return value.schema?.properties && this._newSettings ? x`<div class="module-container" part="module">
							${value.meta && (value.meta?.displayName).en && item && x`<div>
								<h2 part="module-title">
									${value.meta && (value.meta?.displayName).en}
								</h2>
								<div class="module-link-container">
									<svg width="24" height="24" fill="none" viewBox="0 0 24 24">
										<path
											fill="currentColor"
											d="M11 17H7c-1.383 0-2.562-.488-3.537-1.463C2.488 14.562 2.001 13.383 2 12c0-1.383.487-2.562 1.463-3.537C4.439 7.488 5.618 7 7 7h4v2H7c-.833 0-1.542.292-2.125.875A2.893 2.893 0 004 12c0 .833.292 1.542.875 2.125A2.893 2.893 0 007 15h4v2zm-3-4v-2h8v2H8zm5 4v-2h4c.833 0 1.542-.292 2.125-.875A2.893 2.893 0 0020 12c0-.833-.292-1.542-.875-2.125A2.893 2.893 0 0017 9h-4V7h4c1.383 0 2.563.488 3.538 1.463.975.975 1.463 2.154 1.462 3.537 0 1.383-.488 2.562-1.463 3.538-.975.976-2.154 1.463-3.537 1.462h-4z"
										></path>
									</svg>
									<a
										target="_blank"
										href=${`https://inlang.com/m/${item.uniqueID}/${item.id.replaceAll(".", "-")}`}
										class="module-link"
									>
										${`https://inlang.com/.../${item.id.replaceAll(".", "-")}`}
									</a>
									<div class="module-type">
										${value.meta.id.startsWith("plugin") ? "Plugin" : "Lint Rule"}
									</div>
								</div>
							</div>`}
							${Object.entries(value.schema.properties).map(([property, schema]) => {
        if (property === "$schema" || property === "modules")
          return void 0;
        return key === "internal" ? x`
											<general-input
												exportparts="property, property-title, property-paragraph, option, option-wrapper, button"
												.property=${property}
												.modules=${this.installedMessageLintRules || []}
												.value=${structuredClone(
          this._newSettings?.[property]
        )}
												.schema=${schema}
												.handleInlangProjectChange=${this.handleInlangProjectChange}
												.required=${checkRequired_default(value.schema, property)}
											></general-input>
									  ` : x`
											<general-input
												exportparts="property, property-title, property-paragraph, option, option-wrapper, button"
												.property=${property}
												.value=${// @ts-ignore
        structuredClone(this._newSettings?.[key]?.[property])}
												.schema=${schema}
												.moduleId=${key}
												.handleInlangProjectChange=${this.handleInlangProjectChange}
												.required=${checkRequired_default(value.schema, property)}
											></general-input>
									  `;
      })}
					  </div>` : void 0;
    })}
			${this._unsavedChanges ? x`<div class="hover-bar-container">
						<div class="hover-bar" part="float">
							<p class="hover-bar-text">Attention, you have unsaved changes.</p>
							<div>
								<sl-button
									exportparts="base:button"
									size="small"
									@click=${() => {
      this._revertChanges();
    }}
									varaint="default"
								>
									Cancel
								</sl-button>
								<sl-button
									size="small"
									@click=${() => {
      this._saveChanges();
    }}
									variant="primary"
								>
									Save Changes
								</sl-button>
							</div>
						</div>
				  </div>` : x``}
		</div>`;
  }
};
InlangSettings.styles = [
  baseStyling,
  i`
			h2 {
				margin: 0;
				padding-top: 1rem;
			}
			.container {
				position: relative;
				display: flex;
				flex-direction: column;
				gap: 48px;
			}
			.module-container {
				display: flex;
				flex-direction: column;
				gap: 40px;
			}
			.hover-bar-container {
				width: 100%;
				box-sizing: border-box;
				position: sticky;
				bottom: 1rem;
			}
			.hover-bar {
				box-sizing: border-box;
				width: 100%;
				max-width: 500px;
				padding-top: 0.5rem;
				padding-bottom: 0.5rem;
				margin: 0 auto;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				align-items: center;
				gap: 8px;
				background-color: var(--sl-panel-background-color);
				padding-left: 1rem;
				padding-right: 0.8rem;
				border-radius: 0.5rem;
				border: 1px solid var(--sl-panel-border-color);
				filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));
				font-weight: 600;
				line-height: 1.5;
				font-size: 14px;
			}
			.hover-bar-text {
				margin: 0;
			}
			.module-link-container {
				display: flex;
				color: var(--sl-input-help-text-color);
				gap: 6px;
				padding-top: 0.5rem;
			}
			.module-link {
				margin: 0;
				font-size: 14px;
				line-height: 1.5;
				flex-grow: 1;
				text-decoration: none;
				color: var(--sl-input-help-text-color);
			}
			.module-link:hover {
				color: var(--sl-color-primary-600);
			}
			.module-type {
				background-color: var(--sl-input-background-color-disabled);
				width: fit-content;
				padding: 0px 6px;
				border-radius: 2px;
				font-size: 14px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: var(--sl-input-color-disabled);
				margin: 0;
				line-height: 1.5;
				flex-grow: 0;
			}
		`
];
__decorateClass([
  n4({ type: Object })
], InlangSettings.prototype, "settings", 2);
__decorateClass([
  n4({ type: Array })
], InlangSettings.prototype, "installedPlugins", 2);
__decorateClass([
  n4({ type: Array })
], InlangSettings.prototype, "installedMessageLintRules", 2);
__decorateClass([
  r6()
], InlangSettings.prototype, "_newSettings", 2);
__decorateClass([
  r6()
], InlangSettings.prototype, "_unsavedChanges", 2);
InlangSettings = __decorateClass([
  t3("inlang-settings")
], InlangSettings);

// src/stories/inlang-settings2.ts
import {
  ProjectSettings2
} from "@inlang/sdk/v2";
if (!customElements.get("sl-select"))
  customElements.define("sl-select", SlSelect);
if (!customElements.get("sl-option"))
  customElements.define("sl-option", SlOption);
if (!customElements.get("sl-input"))
  customElements.define("sl-input", SlInput);
if (!customElements.get("sl-button"))
  customElements.define("sl-button", SlButton);
if (!customElements.get("sl-checkbox"))
  customElements.define("sl-checkbox", SlCheckbox);
var InlangSettings2 = class extends s3 {
  constructor() {
    super(...arguments);
    this.settings = {};
    this.installedPlugins = [];
    this.installedLintRules = [];
    this._newSettings = void 0;
    this._unsavedChanges = false;
    this.handleInlangProjectChange = (value, property, moduleId) => {
      if (this._newSettings && moduleId) {
        this._newSettings = {
          ...this._newSettings,
          [moduleId]: {
            ...this._newSettings[moduleId],
            [property]: value
          }
        };
      } else if (this._newSettings) {
        this._newSettings = {
          ...this._newSettings,
          [property]: value
        };
      }
      if (JSON.stringify(this.settings) !== JSON.stringify(this._newSettings)) {
        this._unsavedChanges = true;
      } else {
        this._unsavedChanges = false;
      }
    };
    this._revertChanges = () => {
      if (this.settings) {
        this._newSettings = JSON.parse(JSON.stringify(this.settings));
      }
      this._unsavedChanges = false;
    };
    this._saveChanges = () => {
      if (this._newSettings) {
        this.dispatchOnSetSettings(this._newSettings);
        this.settings = JSON.parse(JSON.stringify(this._newSettings));
      }
      this._unsavedChanges = false;
    };
  }
  dispatchOnSetSettings(settings) {
    const onSetSettings = new CustomEvent("set-settings", {
      detail: {
        argument: settings
      }
    });
    this.dispatchEvent(onSetSettings);
  }
  async firstUpdated() {
    await this.updateComplete;
    if (this.settings) {
      this._newSettings = JSON.parse(JSON.stringify(this.settings));
    }
    overridePrimitiveColors_default();
  }
  get _settingProperties() {
    const _settings = this.settings;
    const _installedPlugins = this.installedPlugins;
    const _installedMessageLintRules = this.installedLintRules;
    if (!_settings)
      throw new Error("No inlang settings");
    if (!_installedPlugins)
      throw new Error("No installed plugins");
    const generalSchema = { internal: { schema: ProjectSettings2.allOf[0] } };
    for (const plugin of _installedPlugins) {
      if (plugin.settingsSchema) {
        generalSchema[plugin.id] = {
          schema: plugin.settingsSchema,
          meta: plugin
        };
      }
    }
    for (const lintRule of _installedMessageLintRules) {
      if (lintRule.settingsSchema) {
        generalSchema[lintRule.id] = {
          schema: lintRule.settingsSchema,
          meta: lintRule
        };
      }
    }
    return generalSchema;
  }
  render() {
    return x` <div class="container" part="base">
			${Object.entries(this._settingProperties).map(([key, value]) => {
      const item = registry.find((item2) => item2.id === value.meta?.id);
      return value.schema?.properties && this._newSettings ? x`<div class="module-container" part="module">
							${value.meta && (value.meta?.displayName).en && item && x`<div>
								<h2 part="module-title">
									${value.meta && (value.meta?.displayName).en}
								</h2>
								<div class="module-link-container">
									<svg width="24" height="24" fill="none" viewBox="0 0 24 24">
										<path
											fill="currentColor"
											d="M11 17H7c-1.383 0-2.562-.488-3.537-1.463C2.488 14.562 2.001 13.383 2 12c0-1.383.487-2.562 1.463-3.537C4.439 7.488 5.618 7 7 7h4v2H7c-.833 0-1.542.292-2.125.875A2.893 2.893 0 004 12c0 .833.292 1.542.875 2.125A2.893 2.893 0 007 15h4v2zm-3-4v-2h8v2H8zm5 4v-2h4c.833 0 1.542-.292 2.125-.875A2.893 2.893 0 0020 12c0-.833-.292-1.542-.875-2.125A2.893 2.893 0 0017 9h-4V7h4c1.383 0 2.563.488 3.538 1.463.975.975 1.463 2.154 1.462 3.537 0 1.383-.488 2.562-1.463 3.538-.975.976-2.154 1.463-3.537 1.462h-4z"
										></path>
									</svg>
									<a
										target="_blank"
										href=${`https://inlang.com/m/${item.uniqueID}/${item.id.replaceAll(".", "-")}`}
										class="module-link"
									>
										${`https://inlang.com/.../${item.id.replaceAll(".", "-")}`}
									</a>
									<div class="module-type">
										${value.meta.id.startsWith("plugin") ? "Plugin" : "Lint Rule"}
									</div>
								</div>
							</div>`}
							${Object.entries(value.schema.properties).map(([property, schema]) => {
        if (property === "$schema" || property === "modules")
          return void 0;
        return key === "internal" ? x`
											<general-input
												exportparts="property, property-title, property-paragraph, option, option-wrapper, button"
												.property=${property}
												.modules=${this.installedLintRules || []}
												.value=${structuredClone(
          this._newSettings?.[property]
        )}
												.schema=${schema}
												.handleInlangProjectChange=${this.handleInlangProjectChange}
												.required=${checkRequired_default(value.schema, property)}
											></general-input>
									  ` : x`
											<general-input
												exportparts="property, property-title, property-paragraph, option, option-wrapper, button"
												.property=${property}
												.value=${// @ts-ignore
        structuredClone(this._newSettings?.[key]?.[property])}
												.schema=${schema}
												.moduleId=${key}
												.handleInlangProjectChange=${this.handleInlangProjectChange}
												.required=${checkRequired_default(value.schema, property)}
											></general-input>
									  `;
      })}
					  </div>` : void 0;
    })}
			${this._unsavedChanges ? x`<div class="hover-bar-container">
						<div class="hover-bar" part="float">
							<p class="hover-bar-text">Attention, you have unsaved changes.</p>
							<div>
								<sl-button
									exportparts="base:button"
									size="small"
									@click=${() => {
      this._revertChanges();
    }}
									varaint="default"
								>
									Cancel
								</sl-button>
								<sl-button
									size="small"
									@click=${() => {
      this._saveChanges();
    }}
									variant="primary"
								>
									Save Changes
								</sl-button>
							</div>
						</div>
				  </div>` : x``}
		</div>`;
  }
};
InlangSettings2.styles = [
  baseStyling,
  i`
			h2 {
				margin: 0;
				padding-top: 1rem;
			}
			.container {
				position: relative;
				display: flex;
				flex-direction: column;
				gap: 48px;
			}
			.module-container {
				display: flex;
				flex-direction: column;
				gap: 40px;
			}
			.hover-bar-container {
				width: 100%;
				box-sizing: border-box;
				position: sticky;
				bottom: 1rem;
			}
			.hover-bar {
				box-sizing: border-box;
				width: 100%;
				max-width: 500px;
				padding-top: 0.5rem;
				padding-bottom: 0.5rem;
				margin: 0 auto;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				align-items: center;
				gap: 8px;
				background-color: var(--sl-panel-background-color);
				padding-left: 1rem;
				padding-right: 0.8rem;
				border-radius: 0.5rem;
				border: 1px solid var(--sl-panel-border-color);
				filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));
				font-weight: 600;
				line-height: 1.5;
				font-size: 14px;
			}
			.hover-bar-text {
				margin: 0;
			}
			.module-link-container {
				display: flex;
				color: var(--sl-input-help-text-color);
				gap: 6px;
				padding-top: 0.5rem;
			}
			.module-link {
				margin: 0;
				font-size: 14px;
				line-height: 1.5;
				flex-grow: 1;
				text-decoration: none;
				color: var(--sl-input-help-text-color);
			}
			.module-link:hover {
				color: var(--sl-color-primary-600);
			}
			.module-type {
				background-color: var(--sl-input-background-color-disabled);
				width: fit-content;
				padding: 0px 6px;
				border-radius: 2px;
				font-size: 14px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: var(--sl-input-color-disabled);
				margin: 0;
				line-height: 1.5;
				flex-grow: 0;
			}
		`
];
__decorateClass([
  n4({ type: Object })
], InlangSettings2.prototype, "settings", 2);
__decorateClass([
  n4({ type: Array })
], InlangSettings2.prototype, "installedPlugins", 2);
__decorateClass([
  n4({ type: Array })
], InlangSettings2.prototype, "installedLintRules", 2);
__decorateClass([
  r6()
], InlangSettings2.prototype, "_newSettings", 2);
__decorateClass([
  r6()
], InlangSettings2.prototype, "_unsavedChanges", 2);
InlangSettings2 = __decorateClass([
  t3("inlang-settings2")
], InlangSettings2);
export {
  InlangSettings,
  InlangSettings2
};
//! Do not edit this file manually. It is automatically generated based on the contents of the registry.json file.
/*! Bundled license information:

chroma-js/chroma.js:
  (**
   * chroma.js - JavaScript library for color conversions
   *
   * Copyright (c) 2011-2019, Gregor Aisch
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   * list of conditions and the following disclaimer.
   *
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   * this list of conditions and the following disclaimer in the documentation
   * and/or other materials provided with the distribution.
   *
   * 3. The name Gregor Aisch may not be used to endorse or promote products
   * derived from this software without specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
   * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
   * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
   * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
   * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *
   * -------------------------------------------------------
   *
   * chroma.js includes colors from colorbrewer2.org, which are released under
   * the following license:
   *
   * Copyright (c) 2002 Cynthia Brewer, Mark Harrower,
   * and The Pennsylvania State University.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing,
   * software distributed under the License is distributed on an
   * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   * either express or implied. See the License for the specific
   * language governing permissions and limitations under the License.
   *
   * ------------------------------------------------------
   *
   * Named colors are taken from X11 Color Names.
   * http://www.w3.org/TR/css3-color/#svg-color
   *
   * @preserve
   *)

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/class-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/static.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/if-defined.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/unsafe-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/live.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/

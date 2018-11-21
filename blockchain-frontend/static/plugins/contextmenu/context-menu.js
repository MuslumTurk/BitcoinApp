/*!
 * ol3-contextmenu - v2.5.0
 * Custom Context Menu for Openlayers
 * https://github.com/jonataswalker/ol3-contextmenu
 * Built: Fri Feb 24 2017 15:11:20 GMT-0300 (BRT)
 */
! function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.ContextMenu = e()
}(this, function() {
    "use strict";
    var t = "ol-ctx-menu",
        e = "-container",
        n = "-separator",
        i = "-submenu",
        s = "-hidden",
        o = "-icon",
        a = "-zoom-in",
        r = "-zoom-out",
        l = "ol-unselectable",
        c = {
            BEFOREOPEN: "beforeopen",
            OPEN: "open",
            CLOSE: "close",
            ADD_MENU_ENTRY: "add-menu-entry",
            CONTEXTMENU: "contextmenu",
            HOVER: "mouseover"
        },
        h = {
            container: t + e,
            separator: t + n,
            submenu: t + i,
            hidden: t + s,
            icon: t + o,
            zoomIn: t + a,
            zoomOut: t + r,
            OL_unselectable: l
        },
        u = {
            width: 150,
            scrollAt: 4,
            eventType: c.CONTEXTMENU,
            defaultItems: !0
        },
        d = [{
            text: "Zoom In",
            classname: [h.zoomIn, h.icon].join(" "),
            callback: function(t, e) {
                var n = e.getView();
                n.animate({
                    zoom: +n.getZoom() + 1,
                    duration: 700,
                    center: t.coordinate
                })
            }
        }, {
            text: "Zoom Out",
            classname: [h.zoomOut, h.icon].join(" "),
            callback: function(t, e) {
                var n = e.getView();
                n.animate({
                    zoom: +n.getZoom() - 1,
                    duration: 700,
                    center: t.coordinate
                })
            }
        }],
        p = {
            isNumeric: function(t) {
                return /^\d+$/.test(t)
            },
            classRegex: function(t) {
                return new RegExp("(^|\\s+) " + t + " (\\s+|$)")
            },
            addClass: function(t, e, n) {
                var i = this;
                if (Array.isArray(t)) return void t.forEach(function(t) {
                    i.addClass(t, e)
                });
                for (var s = Array.isArray(e) ? e : e.split(/\s+/), o = s.length; o--;) i.hasClass(t, s[o]) || i._addClass(t, s[o], n)
            },
            _addClass: function(t, e, n) {
                var i = this;
                t.classList ? t.classList.add(e) : t.className = (t.className + " " + e).trim(), n && this.isNumeric(n) && window.setTimeout(function() {
                    i._removeClass(t, e)
                }, n)
            },
            removeClass: function(t, e, n) {
                var i = this;
                if (Array.isArray(t)) return void t.forEach(function(t) {
                    i.removeClass(t, e, n)
                });
                for (var s = Array.isArray(e) ? e : e.split(/\s+/), o = s.length; o--;) i.hasClass(t, s[o]) && i._removeClass(t, s[o], n)
            },
            _removeClass: function(t, e, n) {
                var i = this;
                t.classList ? t.classList.remove(e) : t.className = t.className.replace(this.classRegex(e), " ").trim(), n && this.isNumeric(n) && window.setTimeout(function() {
                    i._addClass(t, e)
                }, n)
            },
            hasClass: function(t, e) {
                return t.classList ? t.classList.contains(e) : this.classRegex(e).test(t.className)
            },
            toggleClass: function(t, e) {
                var n = this;
                return Array.isArray(t) ? void t.forEach(function(t) {
                    n.toggleClass(t, e)
                }) : void(t.classList ? t.classList.toggle(e) : this.hasClass(t, e) ? this._removeClass(t, e) : this._addClass(t, e))
            },
            $: function(t) {
                return t = "#" === t[0] ? t.substr(1, t.length) : t, document.getElementById(t)
            },
            isElement: function(t) {
                return "HTMLElement" in window ? !!t && t instanceof HTMLElement : !!t && "object" == typeof t && 1 === t.nodeType && !!t.nodeName
            },
            find: function(t, e, n) {
                void 0 === e && (e = window.document);
                var i = /^(#?[\w-]+|\.[\w-.]+)$/,
                    s = /\./g,
                    o = Array.prototype.slice,
                    a = [];
                if (i.test(t)) switch (t[0]) {
                    case "#":
                        a = [this.$(t.substr(1))];
                        break;
                    case ".":
                        a = o.call(e.getElementsByClassName(t.substr(1).replace(s, " ")));
                        break;
                    default:
                        a = o.call(e.getElementsByTagName(t))
                } else a = o.call(e.querySelectorAll(t));
                return n ? a : a[0]
            },
            offset: function(t) {
                var e = t.getBoundingClientRect(),
                    n = document.documentElement;
                return {
                    left: e.left + window.pageXOffset - n.clientLeft,
                    top: e.top + window.pageYOffset - n.clientTop,
                    width: t.offsetWidth,
                    height: t.offsetHeight
                }
            },
            getViewportSize: function() {
                return {
                    w: window.innerWidth || document.documentElement.clientWidth,
                    h: window.innerHeight || document.documentElement.clientHeight
                }
            },
            getAllChildren: function(t, e) {
                return [].slice.call(t.getElementsByTagName(e))
            },
            isEmpty: function(t) {
                return !t || 0 === t.length
            },
            emptyArray: function(t) {
                for (; t.length;) t.pop()
            },
            removeAllChildren: function(t) {
                for (; t.firstChild;) t.removeChild(t.firstChild)
            },
            mergeOptions: function(t, e) {
                var n = {};
                for (var i in t) n[i] = t[i];
                for (var s in e) n[s] = e[s];
                return n
            },
            createFragment: function(t) {
                var e = document.createDocumentFragment(),
                    n = document.createElement("div");
                for (n.innerHTML = t; n.firstChild;) e.appendChild(n.firstChild);
                return e
            },
            contains: function(t, e) {
                return !!~e.indexOf(t)
            },
            getUniqueId: function() {
                return "_" + Math.random().toString(36).substr(2, 9)
            },
            isDefAndNotNull: function(t) {
                return null != t
            },
            assertEqual: function(t, e, n) {
                if (t !== e) throw new Error(n + " mismatch: " + t + " != " + e)
            },
            assert: function(t, e) {
                if (void 0 === e && (e = "Assertion failed"), !t) {
                    if ("undefined" != typeof Error) throw new Error(e);
                    throw e
                }
            }
        },
        m = function(t) {
            return this.Base = t, this.map = void 0, this.viewport = void 0, this.coordinateClicked = void 0, this.pixelClicked = void 0, this.lineHeight = 0, this.items = {}, this.opened = !1, this.submenu = {
                left: t.options.width - 15 + "px",
                lastLeft: ""
            }, this.eventHandler = this.handleEvent.bind(this), this
        };
    m.prototype.init = function(t) {
        this.map = t, this.viewport = t.getViewport(), this.setListeners(), this.Base.Html.createMenu(), this.lineHeight = this.getItemsLength() > 0 ? this.Base.container.offsetHeight / this.getItemsLength() : this.Base.Html.cloneAndGetLineHeight()
    }, m.prototype.getItemsLength = function() {
        var t = this,
            e = 0;
        return Object.keys(this.items).forEach(function(n) {
            t.items[n].submenu || t.items[n].separator || e++
        }), e
    }, m.prototype.getPixelClicked = function() {
        return this.pixelClicked
    }, m.prototype.getCoordinateClicked = function() {
        return this.coordinateClicked
    }, m.prototype.positionContainer = function(t) {
        var e = this,
            n = this.map.getSize(),
            i = n[0],
            s = n[1],
            o = s - t[1],
            a = i - t[0],
            r = {
                w: this.Base.container.offsetWidth,
                h: Math.round(this.lineHeight * this.getItemsLength())
            },
            l = p.find("li." + h.submenu + "> div", this.Base.container, !0);
        a >= r.w ? (this.Base.container.style.right = "auto", this.Base.container.style.left = t[0] + 5 + "px") : (this.Base.container.style.left = "auto", this.Base.container.style.right = "15px"), o >= r.h ? (this.Base.container.style.bottom = "auto", this.Base.container.style.top = t[1] - 10 + "px") : (this.Base.container.style.top = "auto", this.Base.container.style.bottom = 0), p.removeClass(this.Base.container, h.hidden), l.length && (a < 2 * r.w ? this.submenu.lastLeft = "-" + r.w + "px" : this.submenu.lastLeft = this.submenu.left, l.forEach(function(t) {
            var n = p.getViewportSize(),
                i = p.offset(t),
                s = i.height,
                a = o - s;
            a < 0 && (a = s - (n.h - i.top), t.style.top = "-" + a + "px"), t.style.left = e.submenu.lastLeft
        }))
    }, m.prototype.openMenu = function(t, e) {
        this.Base.dispatchEvent({
            type: c.OPEN,
            pixel: t,
            coordinate: e
        }), this.opened = !0, this.positionContainer(t)
    }, m.prototype.closeMenu = function() {
        this.opened = !1, p.addClass(this.Base.container, h.hidden), this.Base.dispatchEvent({
            type: c.CLOSE
        })
    }, m.prototype.setListeners = function() {
        this.viewport.addEventListener(this.Base.options.eventType, this.eventHandler, !1)
    }, m.prototype.removeListeners = function() {
        this.viewport.removeEventListener(this.Base.options.eventType, this.eventHandler, !1)
    }, m.prototype.handleEvent = function(t) {
        var e = this;
        this.coordinateClicked = this.map.getEventCoordinate(t), this.pixelClicked = this.map.getEventPixel(t), this.Base.dispatchEvent({
            type: c.BEFOREOPEN,
            pixel: this.pixelClicked,
            coordinate: this.coordinateClicked
        }), this.Base.disabled || (this.Base.options.eventType === c.CONTEXTMENU && (t.stopPropagation(), t.preventDefault()), this.openMenu(this.pixelClicked, this.coordinateClicked), t.target.addEventListener("mousedown", {
            handleEvent: function(n) {
                e.closeMenu(), t.target.removeEventListener(n.type, this, !1)
            }
        }, !1))
    }, m.prototype.setItemListener = function(t, e) {
        var n = this;
        t && "function" == typeof this.items[e].callback && ! function(i) {
            t.addEventListener("click", function(t) {
                t.preventDefault();
                var s = {
                    coordinate: n.getCoordinateClicked(),
                    data: n.items[e].data || null
                };
                n.closeMenu(), i(s, n.map)
            }, !1)
        }(this.items[e].callback)
    };
    var f = function(t) {
        return this.Base = t, this.Base.container = this.container = this.createContainer(), this
    };
    f.prototype.createContainer = function(t) {
        var e = document.createElement("div"),
            n = document.createElement("ul"),
            i = [h.container, h.OL_unselectable];
        return t && i.push(h.hidden), e.className = i.join(" "), e.style.width = parseInt(this.Base.options.width, 10) + "px", e.appendChild(n), e
    }, f.prototype.createMenu = function() {
        var t = [];
        return "items" in this.Base.options ? t = this.Base.options.defaultItems ? this.Base.options.items.concat(d) : this.Base.options.items : this.Base.options.defaultItems && (t = d), 0 !== t.length && void t.forEach(this.addMenuEntry, this)
    }, f.prototype.addMenuEntry = function(t) {
        var e = this;
        if (t.items && Array.isArray(t.items)) {
            t.classname = t.classname || "", p.contains(h.submenu, t.classname) || (t.classname = t.classname.length ? " " + h.submenu : h.submenu);
            var n = this.generateHtmlAndPublish(this.container, t),
                i = this.createContainer();
            i.style.left = this.Base.Internal.submenu.lastLeft || this.Base.Internal.submenu.left, n.appendChild(i), t.items.forEach(function(t) {
                e.generateHtmlAndPublish(i, t, !0)
            })
        } else this.generateHtmlAndPublish(this.container, t)
    }, f.prototype.generateHtmlAndPublish = function(t, e, n) {
        var i, s, o, a = !1,
            r = p.getUniqueId();
        return "string" == typeof e && "-" === e.trim() ? (i = ['<li id="', r, '" class="', h.separator, '">', "<hr></li>"].join(""), s = p.createFragment(i), o = [].slice.call(s.childNodes, 0)[0], t.firstChild.appendChild(s), a = !0) : (e.classname = e.classname || "", i = "<span>" + e.text + "</span>", s = p.createFragment(i), o = document.createElement("li"), e.icon && ("" === e.classname ? e.classname = h.icon : e.classname.indexOf(h.icon) === -1 && (e.classname += " " + h.icon), o.setAttribute("style", "background-image:url(" + e.icon + ")")), o.id = r, o.className = e.classname, o.appendChild(s), t.firstChild.appendChild(o)), this.Base.Internal.items[r] = {
            id: r,
            submenu: n || 0,
            separator: a,
            callback: e.callback,
            data: e.data || null
        }, this.Base.Internal.setItemListener(o, r), o
    }, f.prototype.removeMenuEntry = function(t) {
        var e = p.find("#" + t, this.container.firstChild);
        e && this.container.firstChild.removeChild(e), delete this.Base.Internal.items[t]
    }, f.prototype.cloneAndGetLineHeight = function() {
        var t = this.container.cloneNode(),
            e = p.createFragment("<span>Foo</span>"),
            n = p.createFragment("<span>Foo</span>"),
            i = document.createElement("li"),
            s = document.createElement("li");
        i.appendChild(e), s.appendChild(n), t.appendChild(i), t.appendChild(s), this.container.parentNode.appendChild(t);
        var o = t.offsetHeight / 2;
        return this.container.parentNode.removeChild(t), o
    };
    var y = function(t) {
        function e(e) {
            void 0 === e && (e = {}), p.assert("object" == typeof e, "@param `opt_options` should be object type!"), "default_items" in e && (u.defaultItems = e.default_items), this.options = p.mergeOptions(u, e), this.disabled = !1, this.Internal = new m(this), this.Html = new f(this), t.call(this, {
                element: this.container
            })
        }
        return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.clear = function() {
            var t = this;
            Object.keys(this.Internal.items).forEach(function(e) {
                t.Html.removeMenuEntry(e)
            })
        }, e.prototype.close = function() {
            this.Internal.closeMenu()
        }, e.prototype.enable = function() {
            this.disabled = !1
        }, e.prototype.disable = function() {
            this.disabled = !0
        }, e.prototype.getDefaultItems = function() {
            return d
        }, e.prototype.extend = function(t) {
            p.assert(Array.isArray(t), "@param `arr` should be an Array."), t.forEach(this.push, this)
        }, e.prototype.isOpened = function() {
            return this.isOpen()
        }, e.prototype.isOpen = function() {
            return this.Internal.opened
        }, e.prototype.updatePosition = function(t) {
            p.assert(Array.isArray(t), "@param `pixel` should be an Array."), this.isOpen() && this.Internal.positionContainer(t)
        }, e.prototype.pop = function() {
            var t = Object.keys(this.Internal.items);
            this.Html.removeMenuEntry(t[t.length - 1])
        }, e.prototype.push = function(t) {
            p.assert(p.isDefAndNotNull(t), "@param `item` must be informed."), this.Html.addMenuEntry(t)
        }, e.prototype.shift = function() {
            this.Html.removeMenuEntry(Object.keys(this.Internal.items)[0])
        }, e.prototype.setMap = function(t) {
            ol.control.Control.prototype.setMap.call(this, t), t ? this.Internal.init(t, this) : this.Internal.removeListeners()
        }, e
    }(ol.control.Control);
    return y
});
//# sourceMappingURL=ol3-contextmenu.js.map
"use strict";
var saveAs = saveAs || function (e) {
    if ("undefined" == typeof navigator || !/MSIE [1-9]\./.test(navigator.userAgent)) {
        var t = e.document,
            n = function () {
                return e.URL || e.webkitURL || e
            },
            o = t.createElementNS("http://www.w3.org/1999/xhtml", "a"),
            r = "download" in o,
            i = function (e) {
                var t = new MouseEvent("click");
                e.dispatchEvent(t)
            },
            a = /Version\/[\d\.]+.*Safari/.test(navigator.userAgent),
            c = e.webkitRequestFileSystem,
            f = e.requestFileSystem || c || e.mozRequestFileSystem,
            u = function (t) {
                (e.setImmediate || e.setTimeout)(function () {
                    throw t
                }, 0)
            },
            d = "application/octet-stream",
            s = 0,
            l = 500,
            v = function (t) {
                var o = function () {
                    "string" == typeof t ? n().revokeObjectURL(t) : t.remove()
                };
                e.chrome ? o() : setTimeout(o, l)
            },
            p = function (e, t, n) {
                t = [].concat(t);
                for (var o = t.length; o--;) {
                    var r = e["on" + t[o]];
                    if ("function" == typeof r) try {
                        r.call(e, n || e)
                    } catch (i) {
                        u(i)
                    }
                }
            },
            w = function (e) {
                return /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob(["\ufeff", e], {
                    type: e.type
                }) : e
            },
            y = function (t, u, l) {
                l || (t = w(t));
                var y, m, S, h = this,
                    R = t.type,
                    O = !1,
                    g = function () {
                        p(h, "writestart progress write writeend".split(" "))
                    },
                    b = function () {
                        if (m && a && "undefined" != typeof FileReader) {
                            var o = new FileReader;
                            return o.onloadend = function () {
                                var e = o.result;
                                m.location.href = "data:attachment/file" + e.slice(e.search(/[,;]/)), h.readyState = h.DONE, g()
                            }, o.readAsDataURL(t), void (h.readyState = h.INIT)
                        }
                        if ((O || !y) && (y = n().createObjectURL(t)), m) m.location.href = y;
                        else {
                            var r = e.open(y, "_blank");
                            void 0 == r && a && (e.location.href = y)
                        }
                        h.readyState = h.DONE, g(), v(y)
                    },
                    E = function (e) {
                        return function () {
                            return h.readyState !== h.DONE ? e.apply(this, arguments) : void 0
                        }
                    },
                    N = {
                        create: !0,
                        exclusive: !1
                    };
                return h.readyState = h.INIT, u || (u = "download"), r ? (y = n().createObjectURL(t), o.href = y, o.download = u, void setTimeout(function () {
                    i(o), g(), v(y), h.readyState = h.DONE
                })) : (e.chrome && R && R !== d && (S = t.slice || t.webkitSlice, t = S.call(t, 0, t.size, d), O = !0), c && "download" !== u && (u += ".download"), (R === d || c) && (m = e), f ? (s += t.size, void f(e.TEMPORARY, s, E(function (e) {
                    e.root.getDirectory("saved", N, E(function (e) {
                        var n = function () {
                            e.getFile(u, N, E(function (e) {
                                e.createWriter(E(function (n) {
                                    n.onwriteend = function (t) {
                                        m.location.href = e.toURL(), h.readyState = h.DONE, p(h, "writeend", t), v(e)
                                    }, n.onerror = function () {
                                        var e = n.error;
                                        e.code !== e.ABORT_ERR && b()
                                    }, "writestart progress write abort".split(" ").forEach(function (e) {
                                        n["on" + e] = h["on" + e]
                                    }), n.write(t), h.abort = function () {
                                        n.abort(), h.readyState = h.DONE
                                    }, h.readyState = h.WRITING
                                }), b)
                            }), b)
                        };
                        e.getFile(u, {
                            create: !1
                        }, E(function (e) {
                            e.remove(), n()
                        }), E(function (e) {
                            e.code === e.NOT_FOUND_ERR ? n() : b()
                        }))
                    }), b)
                }), b)) : void b())
            },
            m = y.prototype,
            S = function (e, t, n) {
                return new y(e, t, n)
            };
        return "undefined" != typeof navigator && navigator.msSaveOrOpenBlob ? function (e, t, n) {
            return n || (e = w(e)), navigator.msSaveOrOpenBlob(e, t || "download")
        } : (m.abort = function () {
            var e = this;
            e.readyState = e.DONE, p(e, "abort")
        }, m.readyState = m.INIT = 0, m.WRITING = 1, m.DONE = 2, m.error = m.onwritestart = m.onprogress = m.onwrite = m.onabort = m.onerror = m.onwriteend = null, S)
    }
}("undefined" != typeof self && self || "undefined" != typeof window && window || this.content);
"undefined" != typeof module && module.exports ? module.exports.saveAs = saveAs : "undefined" != typeof define && null !== define && null != define.amd && define([], function () {
    return saveAs
});

function setProgress(e, t) {
    var r = t;
    r *= 100, r = Math.round(r), e === STAGE_READING ? dropzone.textContent = "Running in circles... (" + r + "%)" : e === STAGE_AGGREGATING ? dropzone.textContent = "Riding uphill... (" + r + "%)" : e === STAGE_GENERATING ? dropzone.textContent = "Lifting weights... (" + r + "%)" : e === STAGE_FINISHED ? dropzone.textContent = "Exhausted, catching a breath! (100%)" : dropzone.textContent = "Select your export.xml, ready to go!"
}

function yieldingLoop(e, t, r, n) {
    var a = 0;
    ! function o() {
        for (var i = Math.min(a + t, e); i > a;) r.call(null, a), a += 1;
        e > a ? setTimeout(o, 0) : n.call(null)
    }()
}

function aggregateData(e, t) {
    var r, n = {},
        a = 0,
        o = e.length;
    yieldingLoop(e.length, 1e3, function (t) {
        var i, s, l, c, u, d, E = e[t];
        if (void 0 !== E.attributes.type)
            if (i = E.attributes.type.value) {
                for (void 0 === n[i] && (n[i] = {
                    columns: [],
                    rows: []
                }), s = n[i], l = s.columns, c = s.rows, u = {}, r = 0; r < E.attributes.length; r += 1) d = E.attributes[r], -1 === l.indexOf(d.name) && l.push(d.name), u[d.name] = d.value, d.value.indexOf(",") > -1 && (CSV_SEPARATOR = ";");
                c.push(u)
            } else console.error("invalid record type");
        else console.error("no type attribute");
        a += 1, setProgress(STAGE_AGGREGATING, a / o)
    }, function () {
        t(null, n)
    })
}

function addFileLink(e, t, r) {
    e.addEventListener("click", function (e) {
        saveAs(t, r), e.preventDefault()
    })
}

function generateCSV(e, t) {
    var r, n, a, o, i, s, l, c, u, d, E, g, f, A = Object.keys(e),
        m = 0,
        v = t;
    l = document.createElement("tbody"), table.replaceChild(l, table.firstElementChild), yieldingLoop(A.length, 1, function (t) {
        for (r = A[t], i = "", n = e[r], i += n.columns.join(CSV_SEPARATOR) + NEWLINE, g = 0; g < n.rows.length; g += 1) {
            for (o = n.rows[g], f = 0; f < n.columns.length; f += 1) a = n.columns[f], void 0 !== o[a] && (i += o[a]), f + 1 < n.columns.length && (i += CSV_SEPARATOR);
            i += NEWLINE, m += 1, setProgress(STAGE_GENERATING, m / v)
        }
        s = new Blob([i], {
            type: "text/csv;charset=utf-8"
        }), c = document.createElement("tr"), u = document.createElement("td"), u.innerHTML = r, c.appendChild(u), d = document.createElement("td"), E = document.createElement("a"), E.className += " icon-download", addFileLink(E, s, r + ".csv"), d.appendChild(E), c.appendChild(d), l.appendChild(c)
    }, function () {
        setProgress(STAGE_FINISHED, 1)
    })
}

function extractRecords(e, t) {
    for (var r = parser.parseFromString(e, "text/xml"), n = r.getElementsByTagName("Record"), a = 0; a < n.length; a++) {
        var o = n[a],
            i = {
                attributes: []
            };
        t.push(i);
        for (var s = 0; s < o.attributes.length; s++) {
            var l = o.attributes[s],
                c = {
                    name: l.name.trim(),
                    value: l.value.trim()
                };
            i.attributes.push(c), "type" === c.name && (i.attributes.type = c)
        }
        for (var u = o.getElementsByTagName("MetadataEntry"), d = 0; d < u.length; d++) {
            var E = u[d],
                c = {
                    name: E.getAttribute("key").trim(),
                    value: E.getAttribute("value").trim()
                };
            i.attributes.push(c)
        }
    }
}

function readFileRecordByRecord(e, t) {
    function r(e, t) {
        var r = new Uint8Array(e.byteLength + t.byteLength);
        return r.set(e), r.set(t, e.byteLength), r
    }

    function n() {
        if (i >= e.size) return setProgress(STAGE_READING, 1), void t(null, c);
        var r = e.slice(i, i + o);
        s.readAsArrayBuffer(r)
    }
    var a = e.size / 33554432;
    a = Math.min(a, 33554432), a = Math.max(a, 1048576);
    var o = a,
        i = 0,
        s = new FileReader,
        l = new Uint8Array,
        c = [];
    current_file = e, setProgress(STAGE_READING, 0), s.onload = function (t) {
        for (var a = r(l, new Uint8Array(t.target.result)), s = 0, u = 0; u < a.length; u++) {
            var d = a[u];
            if (10 === d || 13 === d) {
                var E = s,
                    g = u;
                s = u;
                var f = a.subarray(E, g),
                    A = Utf8ArrayToStr(f);
                extractRecords(A, c)
            }
        }
        l = a.subarray(s), setProgress(STAGE_READING, i / e.size), i += o, n()
    }, s.onerror = function (r) {
        console.log(r, c), t('Error reading file "' + e + '" at offset: ' + i)
    }, n()
}

function Utf8ArrayToStr(e) {
    var t, r, n, a, o, i;
    for (t = "", n = e.length, r = 0; n > r;) switch (a = e[r++], a >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
            t += String.fromCharCode(a);
            break;
        case 12:
        case 13:
            o = e[r++], t += String.fromCharCode((31 & a) << 6 | 63 & o);
            break;
        case 14:
            o = e[r++], i = e[r++], t += String.fromCharCode((15 & a) << 12 | (63 & o) << 6 | (63 & i) << 0)
    }
    return t
}
var NEWLINE = "\n",
    CSV_SEPARATOR = ",",
    dropzone = document.getElementById("dropzone"),
    input = document.getElementById("input"),
    table = document.getElementById("results-table"),
    current_file, parser = new DOMParser,
    STAGE_START = 0,
    STAGE_READING = 1,
    STAGE_AGGREGATING = 2,
    STAGE_GENERATING = 3,
    STAGE_FINISHED = 4,
    STAGE_TOTAL = 3;

setProgress(0, 0), dropzone.addEventListener("click", function (e) {
    input.click(), e.preventDefault()
}, !1), input.addEventListener("change", function () {
    readFileRecordByRecord(this.files[0], function (e, t) {
        return e ? void console.error(e) : void aggregateData(t, function (e, r) {
            return e ? void console.error(e) : void generateCSV(r, t.length)
        })
    })
}, !1);

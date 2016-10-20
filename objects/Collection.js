/*
 The MIT License (MIT)

 Copyright (c) 2016 abalabahaha

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

class Collection extends Map {
    constructor(baseObject, limit) {
        super();
        this.baseObject = baseObject;
        this.limit = limit;
        if (limit) this.ids = [];
    }

    add(obj, extra) {
        if (this.limit === 0) return (obj instanceof this.baseObject) ? obj : new this.baseObject(obj, extra);
        if (!obj.id && obj.id !== 0) throw new Error("Missing object id");
        var existing = this.get(obj.id);
        if (existing) return existing;
        if (!(obj instanceof this.baseObject)) obj = new this.baseObject(obj, extra);

        this.set(obj.id, obj);

        if (this.limit) {
            this.ids.push(obj.id);
            if (this.ids.length > this.limit) {
                for (var key of this.ids.splice(0, this.ids.length - this.limit)) {
                    this.delete(key);
                }
            }
        }
        return obj;
    }

    find(func) {
        for (var item of this) {
            if (func(item[1])) return item[1];
        }
        return null;
    }

    filter(func) {
        var arr = [];
        for (var item of this) {
            if (func(item[1])) arr.push(item[1]);
        }
        return arr;
    }

    map(func) {
        var arr = [];
        for (var item of this) {
            arr.push(func(item[1]));
        }
        return arr;
    }

    update(obj, extra) {
        if (!obj.id && obj.id !== 0) throw new Error("Missing object id");
        var item = this.get(obj.id);
        if (!item) return this.add(obj, extra);
        item.update(obj, extra);
        return item;
    }

    remove(obj) {
        var item = this.get(obj.id);
        if (!item) return null;
        this.delete(obj.id);
        return item;
    }

    toString() {
        return `[Collection<${this.baseObject.name}>]`;
    }
}

module.exports = Collection;
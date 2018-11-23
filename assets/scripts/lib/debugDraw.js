let _tmp_vec2 = cc.v2();

let GREEN_COLOR = cc.Color.GREEN;
let RED_COLOR = cc.Color.RED;

function debugDraw (drawer) {
    this.m_drawFlags = 0;
    this._drawer = drawer;
    this._xf = this._dxf = new box2d.b2Transform();
}

debugDraw.prototype.SetFlags = function (flags) {
    this.m_drawFlags = flags;
};
debugDraw.prototype.GetFlags = function () {
    return this.m_drawFlags;
};
debugDraw.prototype.AppendFlags = function (flags) {
    this.m_drawFlags |= flags;
};
debugDraw.prototype.ClearFlags = function (flags) {
    this.m_drawFlags &= ~flags;
};

debugDraw.prototype._DrawPolygon = function(vertices, vertexCount){
    var drawer = this._drawer;
        
        for (var i=0; i<vertexCount; i++) {
            box2d.b2Transform.MulXV(this._xf, vertices[i], _tmp_vec2);
            let x = _tmp_vec2.x * 30,
                y = _tmp_vec2.y * 30;
            if (i === 0)
                drawer.moveTo(x, y);
            else {
                drawer.lineTo(x, y);
            }
        }

        drawer.close();
},

debugDraw.prototype.DrawPolygon =function (vertices, vertexCount, color) {
    this._applyStrokeColor(color);
    this._DrawPolygon(vertices, vertexCount);
    this._drawer.stroke();
},

debugDraw.prototype.DrawSolidPolygon = function(vertices, vertexCount, color) {
    this._applyFillColor(color);
    this._DrawPolygon(vertices, vertexCount);
    this._drawer.fill();
    this._drawer.stroke();
},

debugDraw.prototype._DrawCircle = function(center, radius) {
    let p = this._xf.p;
    this._drawer.circle((center.x + p.x) * 30, (center.y + p.y) * 30, radius * 30);
},

debugDraw.prototype.DrawCircle  = function(center, radius, color) {
    this._applyStrokeColor(color);
    this._DrawCircle(center, radius);
    this._drawer.stroke();
},

debugDraw.prototype.DrawSolidCircle =function (center, radius, axis, color) {
    this._applyFillColor(color);
    this._DrawCircle(center, radius);
    this._drawer.fill();
},

debugDraw.prototype.DrawSegment =function (p1, p2, color) {
    var drawer = this._drawer;

    if (p1.x === p2.x && p1.y === p2.y) {
        this._applyFillColor(color);
        this._DrawCircle(p1, 2/30);
        drawer.fill();
        return;
    }
    this._applyStrokeColor(color);

    box2d.b2Transform.MulXV(this._xf, p1, _tmp_vec2);
    drawer.moveTo(_tmp_vec2.x * 30, _tmp_vec2.y * 30);
    box2d.b2Transform.MulXV(this._xf, p2, _tmp_vec2);
    drawer.lineTo(_tmp_vec2.x * 30, _tmp_vec2.y * 30);
    drawer.stroke();   
},

debugDraw.prototype.DrawTransform =function (xf) {
    var drawer = this._drawer;

    drawer.strokeColor = RED_COLOR;

    _tmp_vec2.x = _tmp_vec2.y = 0;
    box2d.b2Transform.MulXV(xf, _tmp_vec2, _tmp_vec2);
    drawer.moveTo(_tmp_vec2.x * 30, _tmp_vec2.y * 30);
    
    _tmp_vec2.x = 1; _tmp_vec2.y = 0;
    box2d.b2Transform.MulXV(xf, _tmp_vec2, _tmp_vec2);
    drawer.lineTo(_tmp_vec2.x * 30, _tmp_vec2.y * 30);

    drawer.stroke();

    drawer.strokeColor = GREEN_COLOR;

    _tmp_vec2.x = _tmp_vec2.y = 0;
    box2d.b2Transform.MulXV(xf, _tmp_vec2, _tmp_vec2);
    drawer.moveTo(_tmp_vec2.x * 30, _tmp_vec2.y * 30);
    
    _tmp_vec2.x = 0; _tmp_vec2.y = 1;
    box2d.b2Transform.MulXV(xf, _tmp_vec2, _tmp_vec2);
    drawer.lineTo(_tmp_vec2.x * 30, _tmp_vec2.y * 30);

    drawer.stroke();
},

debugDraw.prototype.DrawPoint = function (center, radius, color) {
},

debugDraw.prototype. _applyStrokeColor = function (color) {
    let strokeColor = this._drawer.strokeColor;
    strokeColor.r = color.r*255;
    strokeColor.g = color.g*255;
    strokeColor.b = color.b*255;
    strokeColor.a = 150;
    this._drawer.strokeColor = strokeColor;
},

debugDraw.prototype._applyFillColor = function (color) {
    let fillColor = this._drawer.fillColor;
    fillColor.r = color.r*255;
    fillColor.g = color.g*255;
    fillColor.b = color.b*255;
    fillColor.a = 150;

    this._drawer.fillColor = fillColor;
},

debugDraw.prototype.PushTransform = function(xf) {
    this._xf = xf;
},

debugDraw.prototype.PopTransform = function () {
    this._xf = this._dxf;
}

module.exports = debugDraw;
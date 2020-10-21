// 第一种方法
function arrMaxNum2(arr) {
    return Math.max.apply(null, arr);
}
function arrMinNum2(arr) {
    return Math.min.apply(null, arr);
}
function arrAverageNum2(arr) {
    var sum = eval(arr.join("+"));
    return ~~(sum / arr.length * 100) / 100;
}


// 第二种方法
function cacl(arr, callback) {
    var ret;
    for (var i = 0; i < arr.length; i++) {
        ret = callback(arr[i], ret);
    }
    return ret;
}
Array.prototype.max = function () {
    return cacl(this, function (item, max) {
        if (!(max > item)) {
            return item;
        } else {
            return max;
        }
    });
};
Array.prototype.min = function () {
    return cacl(this, function (item, min) {
        if (!(min < item)) {
            return item;
        } else {
            return min;
        }
    });
};
Array.prototype.sum = function () {
    return cacl(this, function (item, sum) {
        if (typeof (sum) == 'undefined') {
            return item;
        } else {
            return sum += item;
        }
    });
};
Array.prototype.avg = function () {
    if (this.length == 0) {
        return 0;
    }
    return this.sum(this) / this.length;
};

// 数组最大值
Array.max = function (array) {
  return Math.max.apply(Math, array);
};
Array.min = function (array) {
  return Math.min.apply(Math, array);
};
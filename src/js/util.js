/**
 * Created by nathan on 25/10/16.
 */

(function (window) {
   'use strict';

    var util = function () {
        var numWithPoints = function (number) {
                return _.replace(number, /\B(?=(\d{3})+(?!\d))/g, ".")
            },

            randomFiveDigitsNumber = function () {
                return _.floor(Math.random() * 100000 + 1)
            },

            randomString = function (maxLength) {
                var text = "",
                    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    maxLength = maxLength ? maxLength: 5;

                for (var i = 0; i < maxLength; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }

                return text;
            };

        return {
            numWithPoints: numWithPoints,
            randomFiveDigitsNumber: randomFiveDigitsNumber,
            randomString: randomString
        };
    };

    window.util = util();
})(window);

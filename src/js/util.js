/**
 *  Created by nathan on 25/10/16.
 *  A utils service object that contains common used functions
 */

(function (window) {
   'use strict';

    var util = function () {

            /* Given a number, returns it with points
            *  @param number {Number}
            *  @return String*/
        var numWithPoints = function (number) {
                return _.replace(number, /\B(?=(\d{3})+(?!\d))/g, ".")
            },

            /*  Generate a random five digits number
             *  @return {Number} */
            randomFiveDigitsNumber = function () {
                return _.floor(Math.random() * 100000 + 1)
            },

            /*  Generate a random String
            *   @params length {Number}. The length of the string
            *   @return {String}*/
            randomString = function (length) {
                var text = "",
                    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                length = length ? length: 5;

                for (var i = 0; i < length; i++) {
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

/**
 * Created by nathan on 25/10/16.
 */

(function (window, document, $, _, util) {
    'use strict';

    $(document).ready(function () {
        var topLinksList = $('#top-links-list'),
            shortenButton = $('#shorten-button'),
            copyButton = $('#copy-button'),
            shortenInput = $('#link-input'),
            copyInput = $('#copy-input'),
            cancelButton = $('.copy-input-cancel'),

            hideCopyForm = function () {
                shortenButton.fadeIn();
                shortenInput.fadeIn();
                copyButton.hide(0);
                copyInput.hide(0);
                cancelButton.hide(0);
            },

            showCopyForm = function () {
                shortenButton.hide(0);
                shortenInput.hide(0);
                copyButton.fadeIn();
                copyInput.fadeIn();
                cancelButton.fadeIn();
            },

            linkShortener = function (linkUrl) {
                var linkObj = {
                    id: String(util.randomFiveDigitsNumber()),
                    hits: 0,
                    url: linkUrl
                };

                linkObj.shortUrl = 'http://chr.dc/'.concat(util.randomString());

                return linkObj;
            },

            createTopListElements = function (refElement, data) {
                refElement.append(
                    $('<li></li>')
                        .append($('<div class="row"></div>')
                            .append($('<div class="col-sm-6"></div>')
                                .append($('<a class="top-link"></a>')
                                    .text(data.shortUrl)
                                    .attr('href', data.url)
                                    .attr('target', '_blank')
                                )
                            )
                            .append($('<div class="col-sm-6"></div>')
                                .append($('<p class="top-hits"></p>')
                                    .text(util.numWithPoints(data.hits))
                                )
                            )
                        )
                )
            },

            /* Add links to the page
             * Receives a collection of links and append into the page the top max links.
             * @param links {Array}. An array of links
             * @param max {Number}. Max of links that will be added
             * */
            addLinks = function (links, max) {
                _.chain(links)
                    .orderBy(['hits'], ['desc'])
                    .take(max)
                    .forEach(function (linkData) {
                        createTopListElements(topLinksList, linkData);
                    }).value();
            },

            addButtonsListeners = function () {
                shortenButton.on('click', function () {
                    var url = shortenInput.val(),
                        newLinkData;

                    if (url) {
                        newLinkData = linkShortener(url);
                        copyInput.val(newLinkData.shortUrl);
                        showCopyForm();
                        chaordic.links.push(newLinkData);
                    }

                });

                copyButton.on('click', function () {
                    copyInput.select();

                    try {
                        document.execCommand('copy');
                    } catch (err) {
                        console.err('Error on copy: ', err);
                    }
                });
            };

        $.getJSON('assets/urls.json', function (data) {
            addLinks(data, 5);
            _.union(chaordic.links, data);
        });

        hideCopyForm();
        addButtonsListeners();
        window.chaordic = {links: []};
    });

})(window, document, $, _, util);

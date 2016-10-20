// Copyright (c) 2012-2016, Matt Godbolt
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright notice,
//       this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var _ = require('underscore-node');

var tabsRe = /\t/g;

function expandTabs(line) {
    "use strict";
    var extraChars = 0;
    return line.replace(tabsRe, function (match, offset) {
        var total = offset + extraChars;
        var spacesNeeded = (total + 8) & 7;
        extraChars += spacesNeeded - 1;
        return "        ".substr(spacesNeeded);
    });
}
exports.expandTabs = expandTabs;

function parseOutput(lines) {
    // TODO: better splitting here; handle Windows; no hardcoded paths,
    // maybe filter out the name itself if it matches
    var re = /^\/tmp\/[^:]+:([0-9]+)(:([0-9]+))?:\s+(.*)/;
    // var windowsRe = /^C:\\Users\\[^(]+\(([0-9]+)\):\s+(.*)/;
    var result = [];
    _.each(lines.split('\n'), function (line) {
        line = line.trim();
        if (line !== "") {
            var match = line.match(re);
            if (match) {
                result.push({line: parseInt(match[1]), text: match[4].trim()});
            } else {
                // match = line.match(windowsRe);
                result.push({text: line});
            }
        }
    });
    return result;
}
exports.parseOutput = parseOutput;
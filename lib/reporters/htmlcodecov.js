/*!
 * Nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var nodeunit = require('../nodeunit'),
    utils = require('../utils'),
    fs = require('fs'),
    path = require('path'),
    sys = require('sys'),
    AssertionError = require('assert').AssertionError;

/**
 * Reporter info string
 */

exports.info = "Report tests result as HTML";

/**
 * Run all tests within each module, reporting the results to the command-line.
 *
 * @param {Array} files
 * @api public
 */

exports.run = function (files, options, callback) {

    var start = new Date().getTime();
    var paths = files.map(function (p) {
        return path.join(process.cwd(), p);
    });

   sys.print('<html>');
   sys.print('<head>');
   sys.print('<title></title>');
   sys.print('<style type="text/css">');
   sys.print('body { font: 12px Helvetica Neue }');
   sys.print('Table {border-style:solid;border-color:black;width:100%;}');
   sys.print('table {border-spacing:0;border-collapse:collapse;border-width:0 0 1px 1px;border}');
   sys.print('H2 { margin:0 ; padding:0 }');
   sys.print('TABLE,TD,TH {border-style:solid; border-color:black;} TD,TH {margin:0;line-height:100%;padding-left:0.5em;padding-right:0.5em;} TD {border-width:0 1px 0 0;} TH {border-width:1px 1px 1px 0;} TR TD.h {color:red;} TABLE {border-spacing:0; border-collapse:collapse;border-width:0 0 1px 1px;} P,H1,H2,H3,TH {font-family:verdana,arial,sans-serif;font-size:10pt;} TD {font-family:courier,monospace;font-size:10pt;}');
   sys.print('pre { font: 11px Andale Mono; margin-left: 1em; padding-left: 1em; margin-top:0; font-size:smaller;}');
	
   sys.print('.assertion_message { margin-left: 1em; }');
   sys.print('  ol {' +
    '	list-style: none;' +
    '	margin-left: 1em;' +
    '	padding-left: 1em;' +
    '	text-indent: -1em;' +
    '}');
   sys.print('DIV.res {width:100%; height:120px; overflow-y:scroll;}');
   sys.print('  ol li.pass:before { content: "\\2714 \\0020"; }');
   sys.print('  ol li.fail:before { content: "\\2716 \\0020"; }');
   sys.print('.c0 { }');
   sys.print('.c0 td{ background-color:rgb(255,153,153); }');
   sys.print('.c1 {  }');
   sys.print('.c1 td{ background-color:rgb(204,255,204); }');
   sys.print('TABLE.s {border-width:1px 0 1px 1px;  }');
   sys.print('TABLE.c {border-width:1px ;}');
  // sys.print('TABLE.c tr td{background-color:expression(this.sourceIndex%2?"#ff0000":"#ff0f0f");}');
//   sys.print('TABLE.c tr {background-color:expression((this.sectionRowIndex%2==0)?"#cceeff":"width");}');
   sys.print('TABLE.c td {border-width:1px;}'); 
   sys.print('</style>');
   sys.print('</head>');
   sys.print('<body>');
    nodeunit.runFiles(paths, {
        testspec: options.testspec,
        moduleStart: function (name) {
           sys.print('<h2>' + name + '</h2>');
           sys.print('<div class="res"><ol>');
        },
        testDone: function (name, assertions) {
            if (!assertions.failures()) {
               sys.print('<li class="pass">' + name + '</li>');
            }
            else {
               sys.print('<li class="fail">' + name);
                assertions.forEach(function (a) {
                    if (a.failed()) {
                        a = utils.betterErrors(a);
                        if (a.error instanceof AssertionError && a.message) {
                           sys.print('<div class="assertion_message">' +
                                'Assertion Message: ' + a.message +
                            '</div>');
                        }
                       sys.print('<pre>');
                       sys.print(a.error.stack);
                       sys.print('</pre>');
                    }
                });
               sys.print('</li>');
            }
        },
        moduleDone: function () {
           sys.print('</ol></div>');
        },
        done: function (assertions,codeCoverageDetails) {
            var end = new Date().getTime();
            var duration = end - start;
            if (assertions.failures()) {
               sys.print(
                    '<h3>FAILURES: '  + assertions.failures() +
                    '/' + assertions.length + ' assertions failed (' +
                    assertions.duration + 'ms)</h3>'
                );
            }
            else {
               sys.print(
                    '<h3>OK: ' + assertions.length +
                    ' assertions (' + assertions.duration + 'ms)</h3>'
                );
            }

            //display codeCoverage
            if(codeCoverageDetails) {
                populateCoverage(codeCoverageDetails);
                reportCoverage(codeCoverageDetails);
            }
           sys.print('</body>');
// <<<<<<< HEAD
//             setTimeout(function () {
//                 process.reallyExit(assertions.failures());
//             }, 10);
// =======
           sys.print('</html>');

            if (callback) callback(assertions.failures() ? new Error('We have got test failures.') : undefined);
// >>>>>>> caolan/master
        }
    });
};



/*
    Borrowed Code from Expresso, and modify by lyj
*/

var file_matcher = /\.js$/;

/**
 * Report test coverage.
 *
 * @param  {Object} cov
 */

function reportCoverage(cov) {
//console.log('-----------------------------------------------------reportCoverage start---------------------------------------------------------------------------------')
    // Stats
     sys.print('<h1> Coverage:</h1>');
    var sep = '',
        lastSep = '<td></td>';
    sys.puts(sep);
    sys.puts('<table class="c">');
    sys.puts('<tr style="background-color:#cceeff;"><th>filename </th><th> coverage (%)</th><th> LOC </th><th>SLOC</th><th> missed </th></tr>');
    sys.puts(sep);
    var rc=0;
    for (var name in cov) {
        var file = cov[name];
        if (Array.isArray(file)) {
	    if(rc%2==0)
	    	sys.print('<tr>');
	    else 
	       sys.print('<tr style="background-color:#cceeff">');
            sys.print('<td><a href="#'+name+'">' + name+'</a></td>');
            sys.print('<td>' + lpad(file.coverage.toFixed(2), 8)+'</td>');
            sys.print('<td>' + lpad(file.LOC, 4)+'</td>');
            sys.print('<td>' + lpad(file.SLOC, 4)+'</td>');
            sys.print('<td>' + lpad(file.totalMisses, 6)+'</td>');
            sys.print('</tr>');
	    ++rc;
        }
    }
    if(rc%2==0)
    	sys.print('<tr>');
    else 
       sys.print('<tr style="background-color:#cceeff">');
    sys.print('<th style="text-align:center;">Summary</th>');
    sys.print('<td>' + lpad(cov.coverage.toFixed(2), 8)+'</td>');
    sys.print('<td>' + lpad(cov.LOC, 4)+'</td>');
    sys.print('<td>' + lpad(cov.SLOC, 4)+'</td>');
    sys.print('<td>' + lpad(cov.totalMisses, 6)+'</td>');
    sys.print('</tr>');
    sys.puts('</table>');
    sys.print('<br/>');
    sys.print('<br/>');
    // Source
    for (var name in cov) {
        if (name.match(file_matcher)) {
            var file = cov[name];
            if (codeCoverage.verbose) {
               sys.print('<a name="'+name+'"><b>' + name + '</b></a>');
               sys.print(file.source);
               sys.print('</br>');
            }
        }
    }
//console.log('-----------------------------------------------------reportCoverage end---------------------------------------------------------------------------------')
}

/**
 * Populate code coverage data.
 * @param  {Object} cov
 */

function populateCoverage(cov) {
    cov.LOC =
    cov.SLOC =
    cov.totalFiles =
    cov.totalHits =
    cov.totalMisses =
    cov.coverage = 0;
//   sys.print('-----------------------------------------------------populateCoverage---------------------------------------------------------------------------------')
    for (var name in cov) {
        var file = cov[name];
        if (Array.isArray(file)) {
            // Stats
            ++cov.totalFiles;
//console.log(name+':--------------------------------------------------------------------------------------------------------------------------------------'+coverage(file, true));
            cov.totalHits += file.totalHits = coverage(file, true);
            cov.totalMisses += file.totalMisses = coverage(file, false);
            file.totalLines = file.totalHits + file.totalMisses;
            cov.SLOC += file.SLOC = file.totalLines;
            if (!file.source) file.source = [];
            cov.LOC += file.LOC = file.source.length;
            file.coverage = (file.totalHits / file.totalLines) * 100;
            // Source
            var width = file.source.length.toString().length;
            file.source = file.source.map(function(line, i){
                ++i;
                var hits = file[i] === 0 ? 0 : (file[i] || ' ');
		ret='<tr ';      
 		if (hits === 0) {
			ret+='class="c0"';               
		} else if(hits>0){
			ret+='class="c1"';
		} else {
			//ret+='class="';		
		}        
		hits = '<td>' + hits + '</td>';
                line = '<td>' + line + '</td>'; 
		
		ret=ret +'>'+'<td>' + lpad(i, width) + '</td><td>' + hits + ' </td><td> ' + line+'</td></tr>';
		return ret;//'\n     ' + lpad(i, width) + ' | ' + hits + ' | ' + line;
            }).join('');
	    file.source = '<table class="s" cellSpacing="0">'+file.source+'</table>';
        }
    }
    cov.coverage = (cov.totalHits / cov.SLOC) * 100;
//console.log('-----------------------------------------------------populateCoverage- end--------------------------------------------------------------------------------')
}

/**
 * Total coverage for the given file data.
 *
 * @param  {Array} data
 * @return {Type}
 */

function coverage(data, val) {
    var n = 0;
//fixed bug by lyj: while data[i]>1, the coveraged-line won't be counted.
    if(val){//coverage!
    for (var i = 0, len = data.length; i < len; ++i) {
        if (data[i]>=1) {
		++n;		
	}
    }
    }else{//miss! 
     for (var i = 0, len = data.length; i < len; ++i) {
        if (data[i] !== undefined && data[i] == val) {
		++n;		
	}
    }
    }
    return n;
}



/**
 * Test if all files have 100% coverage
 *
 * @param  {Object} cov
 * @return {Boolean}
 */

function hasFullCoverage(cov) {
  for (var name in cov) {
    var file = cov[name];
    if (file instanceof Array) {
      if (file.coverage !== 100) {
          return false;
      }
    }
  }
  return true;
}

/**
 * Pad the given string to the maximum width provided.
 *
 * @param  {String} str
 * @param  {Number} width
 * @return {String}
 */

function lpad(str, width) {
    str = String(str);
    var n = width - str.length;
    if (n < 1) return str;
    while (n--) str = ' ' + str;
    return str;
}

/**
 * Pad the given string to the maximum width provided.
 *
 * @param  {String} str
 * @param  {Number} width
 * @return {String}
 */

function rpad(str, width) {
    str = String(str);
    var n = width - str.length;
    if (n < 1) return str;
    while (n--) str = str + ' ';
    return str;
}

function print(str){
    sys.error(colorize(str));
}

/**
 * Colorize the given string using ansi-escape sequences.
 * Disabled when --boring is set.
 *
 * @param {String} str
 * @return {String}
 */

function colorize(str){
    var colors = { bold: 1, red: 31, green: 32, yellow: 33 };
    return str.replace(/\[(\w+)\]\{([^]*?)\}/g, function(_, color, str){
        return '\x1B[' + colors[color] + 'm' + str + '\x1B[0m';
    });
}

/*
This file is part of classjs. It is subject to the licence terms in the COPYRIGHT file found in the top-level directory of this distribution and at https://raw.githubusercontent.com/KisanHub/classjs/master/COPYRIGHT. No part of classjs, including this file, may be copied, modified, propagated, or distributed except according to the terms contained in the COPYRIGHT file.
Copyright © 2015 The developers of classjs. See the COPYRIGHT file in the top-level directory of this distribution and at https://raw.githubusercontent.com/KisanHub/classjs/master/COPYRIGHT.
Copyright © 2014-2015 Andrea Giammarchi, WTFPL License
*/


// Modified from https://gist.github.com/WebReflection/8f227532143e63649804
// new: accepts a transformer as first argument
// str.template(html, {object:value});
module.template = function template(string, fn, object)
{
	var hasTransformer = typeof fn === 'function'
	var prefix = hasTransformer ? '__tpl' + (+new Date) : ''
	var stringify = JSON.stringify
	var re = /\$\{([\S\s]*?)\}/g
	var evaluate = []
	var i = 0
	var m

	while (m = re.exec(string))
	{
		evaluate.push
		(
			stringify(string.slice(i, re.lastIndex - m[0].length)),
			prefix + '(' + m[1] + ')'
		)
		i = re.lastIndex
	}
	evaluate.push(stringify(string.slice(i)))

	// Function is needed to opt out from possible "use strict" directive
	return Function(prefix, 'with(this)return' + evaluate.join('+')).call(
		hasTransformer ? object : fn, // the object to use inside the with
		hasTransformer && fn          // the optional transformer function to use
	)
}
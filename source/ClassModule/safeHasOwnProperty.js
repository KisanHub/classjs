/*
This file is part of classjs. It is subject to the licence terms in the COPYRIGHT file found in the top-level directory of this distribution and at https://raw.githubusercontent.com/KisanHub/classjs/master/COPYRIGHT. No part of classjs, including this file, may be copied, modified, propagated, or distributed except according to the terms contained in the COPYRIGHT file.
Copyright © 2015 The developers of classjs. See the COPYRIGHT file in the top-level directory of this distribution and at https://raw.githubusercontent.com/KisanHub/classjs/master/COPYRIGHT.
*/


// hasOwnProperty can be redefined, or even become a field with a value, not a function (eg in some JSON parsed in)
module.safeHasOwnProperty = function safeHasOwnProperty(value, name)
{
	return Object.prototype.hasOwnProperty.call(value, name)
}
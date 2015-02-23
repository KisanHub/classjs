/*
This file is part of classjs. It is subject to the licence terms in the COPYRIGHT file found in the top-level directory of this distribution and at https://raw.githubusercontent.com/KisanHub/classjs/master/COPYRIGHT. No part of classjs, including this file, may be copied, modified, propagated, or distributed except according to the terms contained in the COPYRIGHT file.
Copyright © 2015 The developers of classjs. See the COPYRIGHT file in the top-level directory of this distribution and at https://raw.githubusercontent.com/KisanHub/classjs/master/COPYRIGHT.
*/


module.Object = function Object()
{
}

module.Object.prototype.constructor = function Object()
{
}

module.Object.extend = function extend(ourModule, constructor)
{
	var subclass = function Subclass()
	{
		this.super = function super_(ourFunction)
		{
			// replacing ourFunction with this.constructor doesn't work - causes a flip-flop infinite recursion
			// replacing ourFunction with constructor, likewise, doesn't work
			
			// could be replaced with this.supercall but it's very inefficient
			ourFunction.$.constructor.apply(this, Array.prototype.slice.call(arguments, 1))
		}
		
		this.supercall = function supercall(ourFunction)
		{
			var methodName = module.functionName(ourFunction)
			ourFunction.$[methodName].apply(this, Array.prototype.slice.call(arguments, 1))
		}
		
		if (arguments[0] !== module.Object)
		{
			this.constructor.apply(this, arguments)
		}
	}

	var prototype = new this(module.Object)
	var superclass = this.prototype
	var className = module.functionName(constructor)
	
	function addMethod(method, name)
	{
		method.module = ourModule
		method.className = className
		method.$ = superclass
		prototype[name] = method
	}
	
	function validateDefinition(name)
	{
		switch(name)
		{
			case 'constructor':
				throw "A definition can not be called 'constructor'"
				break;

			case 'super':
				throw "A definition can not be called 'super'"
				break;

			case 'supercall':
				throw "A definition can not be called 'super'"
				break;
				
			default:
				break;
		}
	}
	
	addMethod(constructor, 'constructor')
	
	var definitions = Array.prototype.slice.call(arguments)
	definitions.forEach(function(definition)
	{
		if (definition instanceof Function)
		{
			var functionName = module.functionName(definition)
			
			validateDefinition(functionName)
			addMethod(definition, functionName)
		}
		else
		{
			for(var name in definition)
			{
				validateDefinition(name)
				
				var property = definition[name]
				if (property instanceof Function)
				{
					addMethod(property, name)
				}
				else
				{
					prototype[name] = property
				}
			}
		}
	})
	
	subclass.prototype = prototype
	subclass.extend = this.extend
	
	ourModule[className] = subclass
	return subclass
}

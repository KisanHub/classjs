/*
This file is part of mongojs. It is subject to the licence terms in the COPYRIGHT file found in the top-level directory of this distribution and at https://raw.githubusercontent.com/KisanHub/mongojs/master/COPYRIGHT. No part of mongojs, including this file, may be copied, modified, propagated, or distributed except according to the terms contained in the COPYRIGHT file.
Copyright © 2015 The developers of mongojs. See the COPYRIGHT file in the top-level directory of this distribution and at https://raw.githubusercontent.com/KisanHub/mongojs/master/COPYRIGHT.
*/


module.Object.extend
(
	function BaseClass(message, int)
	{
		Object.$.constructor.call(this)
		console.log("BaseClass ctor:" + message + ":" + int)
	},
	
	function getName(arg)
	{
		return getName.className + ':' + arg
	},
	
	function getId()
	{
		return 1
	}
)

module.BaseClass.extend
(
	function SubClass(message)
	{
		this.super(SubClass, message, 45)
		// or BaseClass.$.constructor.call(this, message, 45)
		console.log("SubClass ctor:" + message)
	},
	
	{
		field: "I'm a field"
	},
	
	function getName()
	{
		var supercallResult = this.supercall(getName, 'hello')
		// or getName.$.getName.call(this, 'hello')  - this syntax allows access to any method, not just getName
		return "SubClass(" + this.getId() + ") extends " +   this.supercall(getName)
	},

	function getId()
	{
		return 2;
	}
)

module.SubClass.extend
(
	function TopClass()
	{
		SubClass.$.constructor.call(this, "hello")
	},
	
	function getName()
	{
		//Calls the getName() method of SubClass
		return "TopClass(" + this.getId() + ") extends " + getName.$.getName.call(this) + getName.$.field
	},
	
	function getId()
	{
		return arguments.callee.$.getId.call(this);
	}
)

console.log(new module.TopClass().getName())

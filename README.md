# [classjs]

[classjs] is a Class and Exception framework for JavaScript originally written to make it possible to implement [mongojs] in a timely, effective manner. Whilst there are other frameworks available, we needed one that had effective super calls, was namespace-aware, module-like, did not use long strings and was suitable for incremental development (ie could be built using lots of little files). It's intrinsically linked with [developjs], which provides a way to make it simple to develop JavaScript from lots of small files.

[classjs] is MIT-licensed.

To install using [bower], do `bower install KisanHub/classjs` and then look at the contents of `bower_components/classjs/release`. Our preferred mode of use is as a git submodule; see the [mongojs] project for an example. If checking out from git, remember to do `git submodule update --init --recursive`.

A quick example is this:-

```javascript
```

## Making Use of It: A Quick Tutorial

Please note you'll need internet access for this to work. If you don't want to follow along, you can check out the tutoral results at [classjs-tutorial].

This tutorial comes in two parts:-

* Setting up a new project to use [classjs]
* Making use of [classjs] features

### Setting up a new project to use [classjs]

 We're going to:-

* Create a new repository to hold your JavaScript classes
* Add [classjs] as a library
* Link [developjs]
* Create a Module
* Try to build it

#### Create a new repository to hold your JavaScript classes

Create a new git repository called `classjs-tutorial` and add a `source` folder to it:-

```bash
git init classjs-tutorial
cd classjs-tutorial
mkdir source
```

#### Add [classjs] as a library

```bash
mkdir library
cd library
git submodule add https://github.com/KisanHub/classjs.git
git submodule update --init --recursive
cd -
```

#### Link [developjs]

[developjs] provides infrastructure for concantenating the classes and functions we write using [classjs]. [classjs] itself includes it as a submodule, as it eats its own dog food.

```bash
mkdir tools
cd tools
ln -s ../library/classjs/tools/developjs
cd -
ln -s tools/developjs/build
```

#### Create a Module

The core of [classjs] is a module. A module is a top-level namespace (it's effectively a JavaScript object under `window`). By convention, they are Pascal-cased and end in 'Module', but you are not obliged to follow this. [classjs]'s own logic is in the module `ClassModule`. The [mongojs] client uses `MongoModule`. For this example, we'll use `TutorialModule`. Each module has an associated JSON file that defines precisely which files it consists of, and the order they are loaded in. This file also defines sub-modules, so allowing a lot of finesse.

```bash
cd source
mkdir TutorialModule
cat <<EOF >'TutorialModule/module.json'
{
    "TutorialModule":
    [
    ]
}
EOF
cd -
```

#### Try to build it

Let's make sure everything's set up correctly. We can try to build the module with `./build`. Oops, that didn't work, did it? That's because [developjs] insists on there being a `COPYRIGHT` file to embed in the concatenated source. You can create one using `touch COPYRIGHT`; we prefer to use the machine-readable [Debian Format](https://www.debian.org/doc/packaging-manuals/copyright-format/1.0/) for copyright files (see this [example](https://raw.githubusercontent.com/KisanHub/classjs/master/COPYRIGHT)). As an aside, this format works rather well when combining lots of small files together.

Ok, let's have another go at `./build` (assuming you've created a `COPYRIGHT` file, eg using `touch COPYRIGHT`). This time, `build` should create a folder `release` containing `TutorialModule.js` and `TutorialModule.min.js`. Note that these files aren't empty. [developjs] adds in a [Google Closure] compatible licence annotation and boilerplate for creating *or augmenting* namespaces safely.

### Making use of [classjs] features

* Creating a Class
* Creating a Sub-Class

#### Creating a Class

Let's create a class. To do this, we'll create a file in the folder `source/TutorialModule` called `BaseClass.js` with the contents:-

```javascript
ClassModule.Object.extend
(
	module,
	
	function BaseClass(message, int)
	{
		this.super(BaseClass)
		this.message = message
		this.int = int
	},
	
	function getName(arg)
	{
		return getName.className + ':' + arg
	},
	
	function getSomething()
	{
		return 10
	}
)
```

We need to add this file to the `module.json` (a touch annoying, but we can't simply rely on alphabetic order for things to work). Replace the contents of `module.json` with:-

```javascript
{
    "TutorialModule":
    [
		"BaseClass"
    ]
}
```

Note that there's no need to specify `.js` on the end of `BaseClass`.

To instantiate this class as an object, use `new TutorialModule.BaseClass('hello world', 57)` somewhere in your code.

##### Explanation of What's Going On

###### Function call `ClassModule.Object.extend()`
The `ClassModule.Object` is a base class provided by [classjs] from which all other classes extend.

###### Argument `module`
The argument `module` is set by [developjs] to always be the current module (or sub-module), ie namespace. It must always be passed, as there's no way to infer scope otherwise (well, without setting globals, and that's horrid).

###### First function is named as per the file name

The first function name, `BaseClass`, is named ***the same as the file name conventionally***. It is this that defines the class name. This function is the class' constructor. The first line is a call to the superclass' constructor; the first argument passed is the name of *this* class. Any remaining arguments are then positional arguments to the super constructor. In this case, `ClassModule.Object` has a constructor that takes no arguments.

###### Subsequent functions

These form the methods of the class. They *must* be named functions.

###### Use of `.className`

To access class-properties, one can refer to the name of the current method. `className` is one such property (this is similar to `BaseClass.class.getSimpleName()` in Java). In the constructor, one would use `BaseClass.className`. This is done this way because in strict JavaScript it is not possible to walk the stack.

#### Creating a Sub-Class

Create a file in the folder `source/TutorialModule` called `SubClass.js` with the contents:-

```javascript
module.BaseClass.extend
(
	module,
	
	function SubClass(message)
	{
		this.super(SubClass, message, 45)
		// or BaseClass.$.constructor.call(this, message, 45)
		console.log("SubClass ctor:" + message)
	},
	
	function getName()
	{
		var supercallResult = this.supercall(getName, 'hello')
		// or getName.$.getName.call(this, 'hello')  - this syntax allows access to any method, not just getName, eg the super class's
		// getSomething is accessible via getName.$.getSomething.call(this) 
		return "SubClass(" + this.getSomething() + ") extends " + this.supercall(getName)
	},

	function getSomething()
	{
		return 2;
	}
)
```

We need to add this file to the `module.json`. Replace the contents of `module.json` with:-

```javascript
{
    "TutorialModule":
    [
		"BaseClass",
		"SubClass"
    ]
}
```

##### Explanation of What's Going On

###### Use of `module`

Since `SubClass` is in the same module as `BaseClass`, we can avoid having to hardcode the module name (`TutorialModule`) and simply reference `module`. If we then move the classes or rename the module, nothing breaks.

###### Supercalls

The `getName()` function illustrates the use of a supercall to the superclass' `getName` function.





## Other Features

Most of these features are best illustrated by the [mongojs] project.

#### Exceptions

Exceptions are just classes that extend from the class `Exception`. There are several ones provided:-

|Name|Purpose|
|----|-------|
|`Exception`|Extend from this when nothing else is appropiate|
|`ToDoException`|TODO|
|`IllegalArgumentException`|A value passed to a function is typed wrong or out-of-range|
|`VirtualMethodException`|A way of documenting that method is virtual (abstract) and intended to be implemented by a subclass|
|`TemplatedException`|An exception that takes a format string and a JSON-style object to format the string with|

You can extend from these if you wish (eg see [BsonWriterOverflowException](https://github.com/KisanHub/mongojs/blob/master/source/MongoModule/BsonWriter/BsonWriterOverflowException.js) in [mongojs]).

An example usage of `TemplatedException` might be `throw new ClassModule.TemplatedException("The value of the offset ${offset} was negative", {offset: someValueThatWasNegative})`

#### Virtual Methods

Although it's not possible to have interfaces and true abstract classes, it is possible to define methods with the expectation they should be overridden. This can be done as follows, eg on `BaseClass` above, add a method:-

```
function writeBson(writer)
{
	throw new ClassModule.VirtualMethodException()
},
```

See [mongojs' BsonValue](https://github.com/KisanHub/mongojs/blob/master/source/MongoModule/BsonValues/BsonValue.js) for an example of a pure virtual class - effectively, a Java interface, and [AbstractBsonValue](https://github.com/KisanHub/mongojs/blob/master/source/MongoModule/BsonValues/AbstractBsonValue.js) for an example of an abstract class 'implementing' an interface. This sort of design allows subsequent code to do type checking, eg `if (value instanceof BsonValue)`, as inheritance is respected.

#### Imports

It's possible to have imports, although you'll need to make sure your dependency order is correct in `module.json` (otherwise your import will be `undefined` and all hell will break out). For example, to import `ClassModule.IllegalArgumentException`, do:-

```javascript
var IllegalArgumentException = ClassModule.IllegalArgumentException

ClassModule.Object.extend
(
	module,
	
	function SomeClass(positive)
	{
		if (positive < 0)
		{
			throw new IllegalArgumentException("Argument positive was negative (actually, it was ${positive})", {positive: positive})
		}
		# Unlike in Java, super constructor calls can occur after the first line
		this.super(SomeClass)
	}
)
```

This works, because all variables and function definitions in a file are file-scoped; ie they are in a closure that does not pollute either global scope or module scope.

#### File-scoped Functions and Variables

Any variables or functions defined in a file are file-scoped; ie they are in a closure that does not pollute either global scope or module scope.

#### Module Functions as well as Classes

To define a module function, do the following (say in a file 'myFunction.js'):-

```javascript
module.myFunction = function myFunction(arg1, arg2)
{
	return 'hello' + arg1 + arg2
}
```

And add it to `module.json` as before.

#### Submodules

To have a submodule, create a subfolder and add files as normal. For example, if there's a submodule `submarine` in `TutorialModule` with the files `hello.js` and `goodbyte.js`, you'd created the folder `source/TutorialModule/submarine`, add the files `hello.js` and `goodbye.js` to it, and the in `module.json`:-

```javascript
{
    "TutorialModule":
    [
		"BaseClass",
		{
			"submarine":
			[
				"hello",
				"goodbye"
			]
		},
		"SubClass"
    ]
}
```

There is not need for another `module.json` inside `submarine`. Note also that the submodule can be ordered mid-way in the dependencies of `TutorialModule`. See [mongojs]'s [module.json](https://github.com/KisanHub/mongojs/blob/master/source/MongoModule/module.json) for a detailed example.


#### Additional Functions

|Function|Purpose|
|--------|-------|
|`default`|Provides a common wrapper around logic used to detect if an argument is not supplied to a function|
|`functionName`|Provides a common way to find a function's name|
|`isUndefined`|Common logic for checking for undefined|
|`safeHasOwnProperty`|A safe version of `hasOwnProperty` that avoids problems with `Object.hasOwnProperty` having been redefined (eg a parsed JSON result from an AJAX call)|
|`template`|A function that templates strings. Used by `TemplatedException`|

## Testing
This still needs a little work to be done to be made re-usable as a git submodule, but an example of a development set-up suitable for transfer to production use using [developjs] is provided in [mongojs] in `test`.

## Frequent Objections

### You check in the build output
Yep, this is to make it simpler to work with the popular, but flawed, 'package' manager that is [bower]. Of course, we could use GitHub releases, but then we have to post-release check in a new `bower.json` file… which is the almost the same as post-build checking in the build output, but with a need to then edit `bower.json` too!

### This isn't very JavaScript-like
Nope. But JavaScript is trully awful to work with at scale, and this makes it much easier to be organised and efficient. For much larger projects, we'd recommend using a typed higher-level language converter that a powerful IDE can inspect effectively; [Kotlin] is starting to look like a very sensible choice in this regard.

## Hacking on the Source

To reduce the amount of boilerplate required, and to make it possible to actually write [classjs], the code is broken down into files. Each file is organised into its respective namespace. A file may be either a major public function, or a class. The definitions in each file are private unless exported. As a result, `function xxx()` definitions and `var x = ` definitions are file-private.

The files are then concatenated together as part of the build process. This uses [developjs]. To build the code, call `./build` in the root of the GitHub repository. This will also invoke basic [Google Closure] minification (and so requires internet access).

To test the code without concatenation, [developjs] provides an AJAX driven class-loader, `DevelopModule`. You can see how this works in [mongojs]'s `test/root/index.html`. In essence, this lets one load either a production-quality, concatenated javascript file called `XXXXX.package.js`, or, in the event this is not found, load a set of `Module`s defined in `XXXXX.package.json` (where `XXXXX` is a package name). Each 'package' consists of one or more `Module`s. The group of classes is called a `Module`: `ClassModule`.

## Dependencies

All the dependencies listed are included as git submodules:-

* [developjs]
* [shellfire]

## Compatibility

### Browser Compatibility

[classjs] tries hard to be compatible with the vast majority of browsers current as of January 2015, and uses polyfills where necessary. If you find that support for a browser could be better improved, please submit a pull request.

|Browser|Version|Comments|
|-------|-------|--------|
|[Mozilla Firefox]|36|Tested, but should be compatible with any commonly used version|
|[Google Chrome]|41|Developed with, but any commonly used version should be compatible|
|Desktop [Safari]|7|No currently known issues|
|Desktop [Safari]|8|No currently known issues|
|Internet Explorer|—|Some testing; versions 10 & 11 should be fine. Version 9 is untested and may not work|

Please help us add to this list.



[developjs]: https://github.com/KisanHub/mongojs "developjs homepage"
[classjs]: https://github.com/KisanHub/mongojs "classjs homepage"
[classjs-tutorial]: https://github.com/KisanHub/mongojs "classjs-tutorial homepage"
[mongojs]: https://github.com/KisanHub/mongojs "mongojs homepage"
[shellfire]: https://github.com/shellfire-dev "shellfire homepage"
[bower]: http://bower.io/ "bower homepage"
[Kotlin]: http://kotlinlang.org/ "Kotlin homepace"
[Google Closure]: https://developers.google.com/closure/ "Google Closure homepage"

TypeScript Extension for StarUML 2
============================

This extension for StarUML(http://staruml.io) support to generate TypeScript code from UML model and to reverse Java code to UML model. Install this extension from Extension Manager of StarUML. It is based on TypeScript 2.0 specification.

TypeScript Code Generation
--------------------

1. Click the menu (`Tools > TypeScript > Generate Code...`)
2. Select a base model (or package) that will be generated to TypeScript.
3. Select a folder where generated TypeScript source files will be placed.

Belows are the rules to convert from UML model elements to Java source codes.

### UMLPackage

* converted to _TypeScript namespace_ (as a folder).

### UMLClass

* converted to _TypeScript Class_. (as a separate `.ts` file)
* `visibility` to one of modifiers `public`, `protected`, `private` and none.
* `isAbstract` property to `abstract` modifier.
* `isFinalSpecialization` and `isLeaf` property to `sealed` modifier.
* Default constructor is generated.
* All contained types (_UMLClass_, _UMLInterface_, _UMLEnumeration_) are generated as inner type definition.
* Documentation property to TypeScriptDoc comment.
* Annotation Type is converted to TypeScript attribute class which extends System.Attribute and postfix of class is Attribute.
  (cf. class testAttribute:System.Attribute)

### UMLAttribute

* converted to _TypeScript Field_.
* `visibility` property to one of modifiers `public`, `protected`, `private` and none.
* `name` property to field identifier.
* `type` property to field type.
* `multiplicity` property to array type.
* `isStatic` property to `static` modifier.
* `isLeaf` property to `sealed` modifier.
* `defaultValue` property to initial value.
* Documentation property to TypeScriptDoc comment.

### UMLOperation

* converted to _TypeScript Methods_.
* `visibility` property to one of modifiers `public`, `protected`, `private` and none.
* `name` property to method identifier.
* `isAbstract` property to `abstract` modifier.
* `isStatic` property to `static` modifier.
* _UMLParameter_ to _TypeScript Method Parameters_.
* _UMLParameter_'s name property to parameter identifier.
* _UMLParameter_'s type property to type of parameter.
* _UMLParameter_ with `direction` = `return` to return type of method. When no return parameter, `void` is used.
* _UMLParameter_ with `isReadOnly` = `true` to `sealed` modifier of parameter.
* Documentation property to TypeScriptDoc comment.

### UMLInterface

* converted to _TypeScript Interface_.  (as a separate `.ts` file)
* `visibility` property to one of modifiers `public`, `protected`, `private` and none.
* Documentation property to TypeScriptDoc comment.

### UMLEnumeration

* converted to _TypeScript enum_.  (as a separate `.ts` file)
* `visibility` property to one of modifiers `public`, `protected`, `private` and none.
* _UMLEnumerationLiteral_ to literals of enum.

### UMLAssociationEnd

* converted to _TypeScript Field_.
* `visibility` property to one of modifiers `public`, `protected`, `private` and none.
* `name` property to field identifier.
* `type` property to field type.
* If `multiplicity` is one of `0..*`, `1..*`, `*`, then collection type (`List<>` when `isOrdered` = `true` or `HashSet<>`) is used.
* `defaultValue` property to initial value.
* Documentation property to JavaDoc comment.

### UMLGeneralization

* converted to _TypeScript Extends_ (`:`).
* Allowed only for _UMLClass_ to _UMLClass_, and _UMLInterface_ to _UMLInterface_.

### UMLInterfaceRealization

* converted to _TypeScript Implements_ (`:`).
* Allowed only for _UMLClass_ to _UMLInterface_.



TypeScript Reverse Engineering
------------------------

1. Click the menu (`Tools > TypeScript > Reverse Code...`)
2. Select a folder containing TypeScript source files to be converted to UML model elements.
3. `CsharpReverse` model will be created in the Project.

Belows are the rules to convert from TypeScript source code to UML model elements.

### TypeScript Namespace

* converted to _UMLPackage_.

### TypeScript Class

* converted to _UMLClass_.
* Class name to `name` property.
* Type parameters to _UMLTemplateParameter_.
* Access modifier `public`, `protected` and  `private` to `visibility` property.
* `abstract` modifier to `isAbstract` property.
* `sealed` modifier to `isLeaf` property.
* Constructors to _UMLOperation_ with stereotype `<<constructor>>`.
* All contained types (_UMLClass_, _UMLInterface_, _UMLEnumeration_) are generated as inner type definition.


### TypeScript Field (to UMLAttribute)

* converted to _UMLAttribute_ if __"Use Association"__ is __off__ in Preferences.
* Field type to `type` property.

    * Primitive Types : `type` property has the primitive type name as string.
    * `T[]`(array) or its decendants: `type` property refers to `T` with multiplicity `*`.
    * `T` (User-Defined Types)  : `type` property refers to the `T` type.
    * Otherwise : `type` property has the type name as string.

* Access modifier `public`, `protected` and  `private` to `visibility` property.
* `static` modifier to `isStatic` property.
* `sealed` modifier to `isLeaf` and `isReadOnly` property.
* Initial value to `defaultValue` property.

### TypeScript Field (to UMLAssociation)

* converted to (Directed) _UMLAssociation_ if __"Use Association"__ is __on__ in Preferences and there is a UML type element (_UMLClass_, _UMLInterface_, or _UMLEnumeration_) correspond to the field type.
* Field type to `end2.reference` property.

    * `T[]`(array) or its decendants: `reference` property refers to `T` with multiplicity `*`.
    * `T` (User-Defined Types)  : `reference` property refers to the `T` type.
    * Otherwise : converted to _UMLAttribute_, not _UMLAssociation_.

* Access modifier `public`, `protected` and  `private` to `visibility` property.

### TypeScript Method

* converted to _UMLOperation_.
* Type parameters to _UMLTemplateParameter_.
* Access modifier `public`, `protected` and  `private` to `visibility` property.
* `static` modifier to `isStatic` property.
* `abstract` modifier to `isAbstract` property.
* `sealed` modifier to `isLeaf` property.

### TypeScript Interface

* converted to _UMLInterface_.
* Class name to `name` property.
* Type parameters to _UMLTemplateParameter_.
* Access modifier `public`, `protected` and  `private` to `visibility` property.

### TypeScript Enum

* converted to _UMLEnumeration_.
* Enum name to `name` property.
* Type parameters to _UMLTemplateParameter_.
* Access modifier `public`, `protected` and  `private` to `visibility` property.
* Enum constants are converted to _UMLEnumerationLiteral_.

### TypeScript AnnotationType

* converted to _UMLClass_ with stereotype `<<annotationType>>`.
* Annotation type elements to _UMLOperation_. (Default value to a Tag with `name="default"`).


---

Licensed under the MIT license (see LICENSE file).

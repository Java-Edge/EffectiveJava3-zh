# 第 5 章 泛型

## 【26】不要使用原始类型

> Don’t use raw types

First, a few terms. A class or interface whose declaration has one or more type parameters is a generic class or interface [JLS, 8.1.2, 9.1.2]. For example, the List interface has a single type parameter, E, representing its element type. The full name of the interface is `List<E>` (read “list of E”), but people often call it List for short. Generic classes and interfaces are collectively known as generic types.

> 首先，介绍一些术语。声明中具有一个或多个类型参数的类或接口就是泛型类或泛型接口 [JLS, 8.1.2, 9.1.2]。例如，List 接口有一个类型参数 E，用于表示其元素类型。该接口的全名是 `List<E>`（读作「List of E」），但人们通常简称为 List。泛型类和泛型接口统称为泛型。

Each generic type defines a set of parameterized types, which consist of the class or interface name followed by an angle-bracketed list of actual type parameters corresponding to the generic type’s formal type parameters [JLS, 4.4, 4.5]. For example, `List<String>` (read “list of string”) is a parameterized type representing a list whose elements are of type String. (String is the actual type parameter corresponding to the formal type parameter E.)

> 每个泛型定义了一组参数化类型，这些参数化类型包括类名或接口名，以及带尖括号的参数列表，参数列表是与泛型的形式类型参数相对应的实际类型 [JLS, 4.4, 4.5]。例如，`List<String>`（读作「List of String」）是一个参数化类型，表示元素类型为 String 类型的 List。（String 是与形式类型参数 E 对应的实际类型参数。）

Finally, each generic type defines a raw type, which is the name of the generic type used without any accompanying type parameters [JLS, 4.8]. For example, the raw type corresponding to `List<E>` is List. Raw types behave as if all of the generic type information were erased from the type declaration. They exist primarily for compatibility with pre-generics code.

> 最后，每个泛型都定义了一个原始类型，它是没有任何相关类型参数的泛型的名称 [JLS, 4.8]。例如，`List<E>` 对应的原始类型是 List。原始类型的行为就好像所有泛型信息都从类型声明中删除了一样。它们的存在主要是为了与之前的泛型代码兼容。

Before generics were added to Java, this would have been an exemplary collection declaration. As of Java 9, it is still legal, but far from exemplary:

> 在将泛型添加到 Java 之前，这是一个典型的集合声明。就 Java 9 而言，它仍然是合法的，但不应效仿：

```java
// Raw collection type - don't do this!
// My stamp collection. Contains only Stamp instances.
private final Collection stamps = ... ;
```

If you use this declaration today and then accidentally put a coin into your stamp collection, the erroneous insertion compiles and runs without error (though the compiler does emit a vague warning):

> 如果你今天使用这个声明，然后意外地将 coin 放入 stamp 集合中，这一错误的插入依然能够编译并没有错误地运行（尽管编译器确实发出了模糊的警告）：

```java
// Erroneous insertion of coin into stamp collection
stamps.add(new Coin( ... )); // Emits "unchecked call" warning
```

You don’t get an error until you try to retrieve the coin from the stamp collection:

> 直到从 stamp 集合中获取 coin 时才会收到错误提示：

```java
// Raw iterator type - don't do this!
for (Iterator i = stamps.iterator(); i.hasNext(); )
    Stamp stamp = (Stamp) i.next(); // Throws ClassCastException
stamp.cancel();
```

As mentioned throughout this book, it pays to discover errors as soon as possible after they are made, ideally at compile time. In this case, you don’t discover the error until runtime, long after it has happened, and in code that may be distant from the code containing the error. Once you see the ClassCastException, you have to search through the codebase looking for the method invocation that put the coin into the stamp collection. The compiler can’t help you, because it can’t understand the comment that says, “Contains only Stamp instances.”

> 正如在本书中提到的，在出现错误之后尽快发现错误是有价值的，最好是在编译时。在本例这种情况下，直到运行时（在错误发生很久之后）才发现错误，而且报错代码可能与包含错误的代码相距很远。一旦看到 ClassCastException，就必须在代码中搜索将 coin 放进 stamp 集合的方法调用。编译器不能帮助你，因为它不能理解注释「Contains only Stamp instances.」

With generics, the type declaration contains the information, not the comment:

> 对于泛型，类型声明应该包含类型信息，而不是注释：

```java
// Parameterized collection type - typesafe
private final Collection<Stamp> stamps = ... ;
```

From this declaration, the compiler knows that stamps should contain only Stamp instances and guarantees it to be true, assuming your entire codebase compiles without emitting (or suppressing; see Item 27) any warnings. When stamps is declared with a parameterized type declaration, the erroneous insertion generates a compile-time error message that tells you exactly what is wrong:

> 从这个声明看出，编译器应该知道 stamps 应该只包含 Stamp 实例，为保证它确实如此，假设你的整个代码库编译没有发出（或抑制；详见 Item-27）任何警告。当 stamps 利用一个参数化的类型进行声明时，错误的插入将生成编译时错误消息，该消息将确切地告诉你哪里出了问题：

```java
Test.java:9: error: incompatible types: Coin cannot be converted
to Stamp
c.add(new Coin());
^
```

The compiler inserts invisible casts for you when retrieving elements from collections and guarantees that they won’t fail (assuming, again, that all of your code did not generate or suppress any compiler warnings). While the prospect of accidentally inserting a coin into a stamp collection may appear far-fetched, the problem is real. For example, it is easy to imagine putting a BigInteger into a collection that is supposed to contain only BigDecimal instances.

> 当从集合中检索元素时，编译器会为你执行不可见的强制类型转换，并确保它们不会失败（再次假设你的所有代码没有产生或抑制任何编译器警告）。虽然不小心将 coin 插入 stamps 集合看起来有些牵强，但这类问题是真实存在的。例如，很容易想象将一个 BigInteger 放入一个只包含 BigDecimal 实例的集合中。

As noted earlier, it is legal to use raw types (generic types without their type parameters), but you should never do it. **If you use raw types, you lose all the safety and expressiveness benefits of generics.** Given that you shouldn’t use them, why did the language designers permit raw types in the first place? For compatibility. Java was about to enter its second decade when generics were added, and there was an enormous amount of code in existence that did not use generics. It was deemed critical that all of this code remain legal and interoperate with newer code that does use generics. It had to be legal to pass instances of parameterized types to methods that were designed for use with raw types, and vice versa. This requirement, known as migration compatibility, drove the decisions to support raw types and to implement generics using erasure (Item 28).

> 如前所述，使用原始类型（没有类型参数的泛型）是合法的，但是你永远不应该这样做。**如果使用原始类型，就会失去泛型的安全性和表现力。** 既然你不应该使用它们，那么为什么语言设计者一开始就允许原始类型呢？答案是：为了兼容性。Java 即将进入第二个十年，泛型被添加进来时，还存在大量不使用泛型的代码。保持所有这些代码合法并与使用泛型的新代码兼容被认为是关键的。将参数化类型的实例传递给设计用于原始类型的方法必须是合法的，反之亦然。这被称为迁移兼容性的需求，它促使原始类型得到支持并使用擦除实现泛型 （Item-28）。

While you shouldn’t use raw types such as List, it is fine to use types that are parameterized to allow insertion of arbitrary objects, such as `List<Object>`. Just what is the difference between the raw type List and the parameterized type `List<Object>`? Loosely speaking, the former has opted out of the generic type system, while the latter has explicitly told the compiler that it is capable of holding objects of any type. While you can pass a `List<String>` to a parameter of type List, you can’t pass it to a parameter of type `List<Object>`. There are sub-typing rules for generics, and `List<String>` is a subtype of the raw type List, but not of the parameterized type `List<Object>` (Item 28). As a consequence, **you lose type safety if you use a raw type such as List, but not if you use a parameterized type such as List&lt;Object&gt;.**

> 虽然你不应该使用原始类型（如 List），但是可以使用参数化的类型来允许插入任意对象，如 `List<Object>`。原始类型 List 和参数化类型 `List<Object>` 之间的区别是什么？粗略地说，前者选择了不使用泛型系统，而后者明确地告诉编译器它能够保存任何类型的对象。虽然可以将 `List<String>` 传递给 List 类型的参数，但不能将其传递给类型 `List<Object>` 的参数。泛型有子类型规则，`List<String>` 是原始类型 List 的子类型，而不是参数化类型 `List<Object>` 的子类型（Item-28）。因此，**如果使用原始类型（如 List），就会失去类型安全性，但如果使用参数化类型（如 `List<Object>`）则不会。**

To make this concrete, consider the following program:

> 为了使这一点具体些，考虑下面的程序：

```java
// Fails at runtime - unsafeAdd method uses a raw type (List)!

public static void main(String[] args) {
    List<String> strings = new ArrayList<>();
    unsafeAdd(strings, Integer.valueOf(42));
    String s = strings.get(0); // Has compiler-generated cast
}

private static void unsafeAdd(List list, Object o) {
    list.add(o);
}
```

This program compiles, but because it uses the raw type List, you get a warning:

> 该程序可以编译，但因为它使用原始类型 List，所以你会得到一个警告：

```java
Test.java:10: warning: [unchecked] unchecked call to add(E) as a
member of the raw type List
list.add(o);
^
```

And indeed, if you run the program, you get a ClassCastException when the program tries to cast the result of the invocation strings.get(0), which is an Integer, to a String. This is a compiler-generated cast, so it’s normally guaranteed to succeed, but in this case we ignored a compiler warning and paid the price.

> 实际上，如果你运行程序，当程序试图将调用 `strings.get(0)` 的结果强制转换为字符串时，你会得到一个 ClassCastException。这是一个由编译器生成的强制类型转换，它通常都能成功，但在本例中，我们忽略了编译器的警告，并为此付出了代价。

If you replace the raw type List with the parameterized type `List<Object>` in the unsafeAdd declaration and try to recompile the program, you’ll find that it no longer compiles but emits the error message:

> 如果将 unsafeAdd 声明中的原始类型 List 替换为参数化类型 `List<Object>`，并尝试重新编译程序，你会发现它不再编译，而是发出错误消息：

```java
Test.java:5: error: incompatible types: List<String> cannot be
converted to List<Object>
unsafeAdd(strings, Integer.valueOf(42));
^
```

You might be tempted to use a raw type for a collection whose element type is unknown and doesn’t matter. For example, suppose you want to write a method that takes two sets and returns the number of elements they have in common. Here’s how you might write such a method if you were new to generics:

> 对于元素类型未知且无关紧要的集合，你可能会尝试使用原始类型。例如，假设你希望编写一个方法，该方法接受两个集合并返回它们共有的元素数量。如果你是使用泛型的新手，那么你可以这样编写一个方法：

```java
// Use of raw type for unknown element type - don't do this!
static int numElementsInCommon(Set s1, Set s2) {
    int result = 0;
    for (Object o1 : s1)
        if (s2.contains(o1))
    result++;
    return result;
}
```

This method works but it uses raw types, which are dangerous. The safe alternative is to use unbounded wildcard types. If you want to use a generic type but you don’t know or care what the actual type parameter is, you can use a question mark instead. For example, the unbounded wildcard type for the generic type `Set<E>` is `Set<?>` (read “set of some type”). It is the most general parameterized Set type, capable of holding any set. Here is how the numElementsInCommon declaration looks with unbounded wildcard types:

> 这种方法是可行的，但是它使用的是原始类型，这是很危险的。安全的替代方法是使用无界通配符类型。如果你想使用泛型，但不知道或不关心实际的类型参数是什么，那么可以使用问号代替。例如，泛型集 `Set<E>` 的无界通配符类型是 `Set<?>`（读作「set of some type」）。它是最通用的参数化集合类型，能够容纳任何集合：

```java
// Uses unbounded wildcard type - typesafe and flexible
static int numElementsInCommon(Set<?> s1, Set<?> s2) { ... }
```

What is the difference between the unbounded wildcard type `Set<?>` and the raw type Set? Does the question mark really buy you anything? Not to belabor the point, but the wildcard type is safe and the raw type isn’t. You can put any element into a collection with a raw type, easily corrupting the collection’s type invariant (as demonstrated by the unsafeAdd method on page 119); you can’t put any element (other than null) into a `Collection<?>`. Attempting to do so will generate a compile-time error message like this:

> 无界通配符类型 `Set<?>` 和原始类型 Set 之间的区别是什么？问号真的能起作用吗？我并不是在强调这一点，但是通配符类型是安全的，而原始类型则不是。将任何元素放入具有原始类型的集合中，很容易破坏集合的类型一致性（如上述的 unsafeAdd 方法所示）；你不能将任何元素（除了 null）放入 `Collection<?>`。尝试这样做将生成这样的编译时错误消息：

```java
WildCard.java:13: error: incompatible types: String cannot be converted to CAP#1
c.add("verboten");
^ where CAP#1
is a fresh type-variable:
CAP#1 extends Object from capture of ?
```

Admittedly this error message leaves something to be desired, but the compiler has done its job, preventing you from corrupting the collection’s type invariant, whatever its element type may be. Not only can’t you put any element (other than null) into a `Collection<?>`, but you can’t assume anything about the type of the objects that you get out. If these restrictions are unacceptable, you can use generic methods (Item 30) or bounded wildcard types (Item 31).

> 无可否认，这个错误消息让人不满意，但是编译器已经完成了它的工作，防止你无视它的元素类型而破坏集合的类型一致性。你不仅不能将任何元素（除 null 之外）放入 `Collection<?>`，而且不能臆想你得到的对象的类型。如果这些限制是不可接受的，你可以使用泛型方法（Item-30）或有界通配符类型（Item-31）。

There are a few minor exceptions to the rule that you should not use raw types. **You must use raw types in class literals.** The specification does not permit the use of parameterized types (though it does permit array types and primitive types) [JLS, 15.8.2]. In other words, List.class, String[].class, and int.class are all legal, but `List<String>.class` and `List<?>.class` are not.

> 对于不应该使用原始类型的规则，有一些小的例外。**必须在类字面量中使用原始类型。** 该规范不允许使用参数化类型（尽管它允许数组类型和基本类型）[JLS, 15.8.2]。换句话说，`List.class`，`String[].class` 和 `int.class` 都是合法的，但是 `List<String>.class` 和 `List<?>.class` 不是。

A second exception to the rule concerns the instanceof operator. Because generic type information is erased at runtime, it is illegal to use the instanceof operator on parameterized types other than unbounded wildcard types. The use of unbounded wildcard types in place of raw types does not affect the behavior of the instanceof operator in any way. In this case, the angle brackets and question marks are just noise. **This is the preferred way to use the instanceof operator with generic types:**

> 规则的第二个例外是 instanceof 运算符。由于泛型信息在运行时被删除，因此在不是无界通配符类型之外的参数化类型上使用 instanceof 操作符是非法的。使用无界通配符类型代替原始类型不会以任何方式影响 instanceof 运算符的行为。在这种情况下，尖括号和问号只是多余的。**下面的例子是使用通用类型 instanceof 运算符的首选方法：**

```java
// Legitimate use of raw type - instanceof operator
if (o instanceof Set) { // Raw type
    Set<?> s = (Set<?>) o; // Wildcard type
    ...
}
```

Note that once you’ve determined that o is a Set, you must cast it to the wildcard type `Set<?>`, not the raw type Set. This is a checked cast, so it will not cause a compiler warning.

> 注意，一旦确定 o 是一个 Set，就必须将其强制转换为通配符类型 `Set<?>`，而不是原始类型 Set。这是一个经过检查的强制类型转换，所以不会引发编译器警告。

In summary, using raw types can lead to exceptions at runtime, so don’t use them. They are provided only for compatibility and interoperability with legacy code that predates the introduction of generics. As a quick review, `Set<Object>` is a parameterized type representing a set that can contain objects of any type, `Set<?>` is a wildcard（n. 通配符） type representing（v. 代表；表示，表现） a set that can contain only objects of some unknown type, and Set is a raw type, which opts out of the generic type system. The first two are safe, and the last is not.

> 总之，使用原始类型可能会在运行时导致异常，所以不要轻易使用它们。它们仅用于与引入泛型之前的遗留代码进行兼容和互操作。快速回顾一下，`Set<Object>` 是一个参数化类型，表示可以包含任何类型的对象的集合，`Set<?>` 是一个通配符类型，表示只能包含某种未知类型的对象的集合，Set 是一个原始类型，它选择了泛型系统。前两个是安全的，后一个就不安全了。

For quick reference, the terms introduced in this item (and a few introduced later in this chapter) are summarized in the following table:

> 为便于参考，本条目中介绍的术语（以及后面将要介绍的一些术语）总结如下：

|          Term           |              Example               |       Item       |
| :---------------------: | :--------------------------------: | :--------------: |
|   Parameterized type    |           `List<String>`           |     Item-26      |
|  Actual type parameter  |              `String`              |     Item-26      |
|      Generic type       |             `List<E>`              | Item-26, Item-29 |
|  Formal type parameter  |                `E`                 |     Item-26      |
| Unbounded wildcard type |             `List<?>`              |     Item-26      |
|        Raw type         |               `List`               |     Item-26      |
| Bounded type parameter  |        `<E extends Number>`        |     Item-29      |
|  Recursive type bound   |    `<T extends Comparable<T>>`     |     Item-30      |
|  Bounded wildcard type  |      `List<? extends Number>`      |     Item-31      |
|     Generic method      | `static <E> List<E> asList(E[] a)` |     Item-30      |
|       Type token        |           `String.class`           |     Item-33      |

---

## 【27】消除 unchecked 警告

> Eliminate unchecked warnings

When you program with generics, you will see many compiler warnings: unchecked cast warnings, unchecked method invocation warnings, unchecked parameterized vararg type warnings, and unchecked conversion warnings. The more experience you acquire with generics, the fewer warnings you’ll get, but don’t expect newly written code to compile cleanly.

> 当你使用泛型编程时，你将看到许多编译器警告：unchecked 强制转换警告、unchecked 方法调用警告、unchecked 可变参数类型警告和 unchecked 自动转换警告。使用泛型获得的经验越多，得到的警告就越少，但是不要期望新编写的代码能够完全正确地编译。

Many unchecked warnings are easy to eliminate. For example, suppose you accidentally write this declaration:

> 许多 unchecked 警告很容易消除。例如，假设你不小心写了这个声明：

```java
Set<Lark> exaltation = new HashSet();
```

The compiler will gently remind you what you did wrong:

> 编译器会精确地提醒你做错了什么：

```java
Venery.java:4: warning: [unchecked] unchecked conversion
Set<Lark> exaltation = new HashSet();
^ required: Set<Lark>
found: HashSet
```

You can then make the indicated（v. 表明；指出；显示；adj. 表明的；指示的） correction, causing the warning to disappear. Note that you don’t actually have to specify the type parameter, merely（adv. 仅仅，只不过；只是） to indicate（vt. 表明；指出；预示；象征） that it’s present with the diamond operator (<>), introduced in Java 7. The compiler will then infer the correct actual type parameter (in this case, Lark):

> 你可以在指定位置进行更正，使警告消失。注意，你实际上不必指定类型参数，只需给出由 Java 7 中引入的 diamond 操作符（<>）。然后编译器将推断出正确的实际类型参数（在本例中为 Lark）：

```java
Set<Lark> exaltation = new HashSet<>();
```

Some warnings will be much more difficult to eliminate. This chapter is filled with examples of such warnings. When you get warnings that require some thought, persevere! **Eliminate every unchecked warning that you can.** If you eliminate all warnings, you are assured that your code is typesafe, which is a very good thing. It means that you won’t get a ClassCastException at runtime, and it increases your confidence that your program will behave as you intended.

> 一些警告会更难消除。这一章充满这类警告的例子。当你收到需要认真思考的警告时，坚持下去！**力求消除所有 unchecked 警告。** 如果你消除了所有警告，你就可以确信你的代码是类型安全的，这是一件非常好的事情。这意味着你在运行时不会得到 ClassCastException，它增加了你的信心，你的程序将按照预期的方式运行。

**If you can’t eliminate a warning, but you can prove that the code that provoked the warning is typesafe, then (and only then) suppress the warning with an @SuppressWarnings("unchecked") annotation.** If you suppress warnings without first proving that the code is typesafe, you are giving yourself a false sense of security. The code may compile without emitting any warnings, but it can still throw a ClassCastException at runtime. If, however, you ignore unchecked warnings that you know to be safe (instead of suppressing them), you won’t notice when a new warning crops up that represents a real problem. The new warning will get lost amidst all the false alarms that you didn’t silence.

> **如果不能消除警告，但是可以证明引发警告的代码是类型安全的，那么（并且只有在那时）使用 SuppressWarnings("unchecked") 注解来抑制警告。** 如果你在没有首先证明代码是类型安全的情况下禁止警告，那么你是在给自己一种错误的安全感。代码可以在不发出任何警告的情况下编译，但它仍然可以在运行时抛出 ClassCastException。但是，如果你忽略了你知道是安全的 unchecked 警告（而不是抑制它们），那么当出现一个代表真正问题的新警告时，你将不会注意到。新出现的警告就会淹设在所有的错误警告当中。

The SuppressWarnings annotation can be used on any declaration, from an individual local variable declaration to an entire class. **Always use the SuppressWarnings annotation on the smallest scope possible.** Typically this will be a variable declaration or a very short method or constructor. Never use SuppressWarnings on an entire class. Doing so could mask critical warnings.

> SuppressWarnings 注解可以用于任何声明中，从单个局部变量声明到整个类。**总是在尽可能小的范围上使用 SuppressWarnings 注解。** 通常用在一个变量声明或一个非常短的方法或构造函数。不要在整个类中使用 SuppressWarnings。这样做可能会掩盖关键警告。

If you find yourself using the SuppressWarnings annotation on a method or constructor that’s more than one line long, you may be able to move it onto a local variable declaration. You may have to declare a new local variable, but it’s worth it. For example, consider this toArray method, which comes from ArrayList:

> 如果你发现自己在一个超过一行的方法或构造函数上使用 SuppressWarnings 注解，那么你可以将其移动到局部变量声明中。你可能需要声明一个新的局部变量，但这是值得的。例如，考虑这个 toArray 方法，它来自 ArrayList：

```java
public <T> T[] toArray(T[] a) {
    if (a.length < size)
        return (T[]) Arrays.copyOf(elements, size, a.getClass());
    System.arraycopy(elements, 0, a, 0, size);
    if (a.length > size)
        a[size] = null;
    return a;
}
```

If you compile ArrayList, the method generates this warning:

> 如果你编译 ArrayList，这个方法会产生这样的警告：

```java
ArrayList.java:305: warning: [unchecked] unchecked cast
return (T[]) Arrays.copyOf(elements, size, a.getClass());
^ required: T[]
found: Object[]
```

It is illegal to put a SuppressWarnings annotation on the return statement, because it isn’t a declaration [JLS, 9.7]. You might be tempted to put the annotation on the entire method, but don’t. Instead, declare a local variable to hold the return value and annotate its declaration, like so:

> 将 SuppressWarnings 注释放在 return 语句上是非法的，因为它不是声明 [JLS, 9.7]。你可能想把注释放在整个方法上，但是不要这样做。相反，应该声明一个局部变量来保存返回值并添加注解，如下所示：

```java
// Adding local variable to reduce scope of @SuppressWarnings
public <T> T[] toArray(T[] a) {
    if (a.length < size) {
        // This cast is correct because the array we're creating
        // is of the same type as the one passed in, which is T[].
        @SuppressWarnings("unchecked") T[] result = (T[]) Arrays.copyOf(elements, size, a.getClass());
        return result;
    }
    System.arraycopy(elements, 0, a, 0, size);
    if (a.length > size)
        a[size] = null;
    return a;
}
```

The resulting method compiles cleanly and minimizes the scope in which unchecked warnings are suppressed.

> 生成的方法编译正确，并将抑制 unchecked 警告的范围减到最小。

**Every time you use a @SuppressWarnings("unchecked") annotation, add a comment saying why it is safe to do so.** This will help others understand the code, and more importantly, it will decrease the odds that someone will modify the code so as to make the computation unsafe. If you find it hard to write such a comment, keep thinking. You may end up figuring out that the unchecked operation isn’t safe after all.

> **每次使用 SuppressWarnings("unchecked") 注解时，要添加一条注释，说明这样做是安全的。** 这将帮助他人理解代码，更重要的是，它将降低其他人修改代码而产生不安全事件的几率。如果你觉得写这样的注释很难，那就继续思考合适的方式。你最终可能会发现，unchecked 操作毕竟是不安全的。

In summary, unchecked warnings are important. Don’t ignore them. Every unchecked warning represents the potential for a ClassCastException at runtime. Do your best to eliminate these warnings. If you can’t eliminate an unchecked warning and you can prove that the code that provoked it is typesafe, suppress the warning with a @SuppressWarnings("unchecked") annotation in the narrowest possible scope. Record the rationale for your decision to suppress the warning in a comment.

> 总之，unchecked 警告很重要。不要忽视他们。每个 unchecked 警告都代表了在运行时发生 ClassCastException 的可能性。尽最大努力消除这些警告。如果不能消除 unchecked 警告，并且可以证明引发该警告的代码是类型安全的，那么可以在尽可能狭窄的范围内使用 @SuppressWarnings("unchecked") 注释来禁止警告。在注释中记录你决定隐藏警告的理由。

---

## 【28】list 优于数组

> Prefer lists to arrays

Arrays differ from generic types in two important ways. First, arrays are covariant. This scary-sounding word means simply that if Sub is a subtype of Super, then the array type Sub[] is a subtype of the array type Super[]. Generics, by contrast, are invariant: for any two distinct types Type1 and Type2, `List<Type1>` is neither a subtype nor a supertype of `List<Type2>` [JLS, 4.10; Naftalin07, 2.5]. You might think this means that generics are deficient, but arguably（可能，大概） it is arrays that are deficient. This code fragment is legal:

> 数组与泛型有两个重要区别。首先，数组是协变的。这个听起来很吓人的单词的意思很简单，如果 Sub 是 Super 的一个子类型，那么数组类型 Sub[] 就是数组类型 Super[] 的一个子类型。相比之下，泛型是不变的：对于任何两个不同类型 Type1 和 Type2，`List<Type1>` 既不是 `List<Type2>` 的子类型，也不是 `List<Type2>` 的超类型 [JLS, 4.10; Naftalin07, 2.5]。你可能认为这意味着泛型是有缺陷的，但可以说数组才是有缺陷的。这段代码是合法的：

```java
// Fails at runtime!
Object[] objectArray = new Long[1];
objectArray[0] = "I don't fit in"; // Throws ArrayStoreException
```

but this one is not:

> 但这一段代码就不是：

```java
// Won't compile!
List<Object> ol = new ArrayList<Long>(); // Incompatible types
ol.add("I don't fit in");
```

Either way you can’t put a String into a Long container, but with an array you find out that you’ve made a mistake at runtime; with a list, you find out at compile time. Of course, you’d rather find out at compile time.

> 两种方法都不能将 String 放入 Long 容器，但使用数组，你会得到一个运行时错误；使用 list，你可以在编译时发现问题。当然，你更希望在编译时找到问题。

The second major difference between arrays and generics is that arrays are reified（adj. 具体化的） [JLS, 4.7]. This means that arrays know and enforce their element type at runtime. As noted earlier, if you try to put a String into an array of Long, you’ll get an ArrayStoreException. Generics, by contrast, are implemented by erasure [JLS, 4.6]. This means that they enforce their type constraints only at compile time and discard (or erase) their element type information at runtime. Erasure is what allowed generic types to interoperate freely with legacy code that didn’t use generics (Item 26), ensuring a smooth（adj. 顺利的；光滑的；平稳的） transition to generics in Java 5.

> 数组和泛型之间的第二个主要区别：数组是具体化的 [JLS, 4.7]。这意味着数组在运行时知道并强制执行他们的元素类型。如前所述，如果试图将 String 元素放入一个 Long 类型的数组中，就会得到 ArrayStoreException。相比之下，泛型是通过擦除来实现的 [JLS, 4.6]。这意味着它们只在编译时执行类型约束，并在运行时丢弃（或擦除）元素类型信息。擦除允许泛型与不使用泛型的遗留代码自由交互操作（Item-26），确保在 Java 5 中平稳地过渡。

Because of these fundamental（adj. 基本的，根本的） differences, arrays and generics do not mix well. For example, it is illegal to create an array of a generic type, a parameterized type, or a type parameter. Therefore, none of these array creation expressions are legal: `new List<E>[]`, `new List<String>[]`, `new E[]`. All will result in generic array creation errors at compile time.

> 由于这些基本差异，数组和泛型不能很好地混合。例如，创建泛型、参数化类型或类型参数的数组是非法的。因此，这些数组创建表达式都不是合法的：`new List<E>[]`、`new List<String>[]`、`new E[]`。所有这些都会在编译时导致泛型数组创建错误。

Why is it illegal to create a generic array? Because it isn’t typesafe. If it were legal, casts generated by the compiler in an otherwise correct program could fail at runtime with a ClassCastException. This would violate the fundamental guarantee provided by the generic type system.

> 为什么创建泛型数组是非法的？因为这不是类型安全的。如果合法，编译器在其他正确的程序中生成的强制转换在运行时可能会失败，并导致 ClassCastException。这将违反泛型系统提供的基本保证。

To make this more concrete, consider the following code fragment:

> 为了更具体，请考虑以下代码片段：

```java
// Why generic array creation is illegal - won't compile!
List<String>[] stringLists = new List<String>[1]; // (1)
List<Integer> intList = List.of(42); // (2)
Object[] objects = stringLists; // (3)
objects[0] = intList; // (4)
String s = stringLists[0].get(0); // (5)
```

Let’s pretend that line 1, which creates a generic array, is legal. Line 2 creates and initializes a `List<Integer>` containing a single element. Line 3 stores the `List<String>` array into an Object array variable, which is legal because arrays are covariant. Line 4 stores the `List<Integer>` into the sole element of the Object array, which succeeds because generics are implemented by erasure: the runtime type of a `List<Integer>` instance is simply List, and the runtime type of a `List<String>`[] instance is List[], so this assignment doesn’t generate an ArrayStoreException. Now we’re in trouble. We’ve stored a `List<Integer>` instance into an array that is declared to hold only `List<String>` instances. In line 5, we retrieve the sole element from the sole list in this array. The compiler automatically casts the retrieved element to String, but it’s an Integer, so we get a ClassCastException at runtime. In order to prevent this from happening, line 1 (which creates a generic array) must generate a compile-time error.

> 假设创建泛型数组的第 1 行是合法的。第 2 行创建并初始化一个包含单个元素的 `List<Integer>`。第 3 行将 `List<String>` 数组存储到 Object 类型的数组变量中，这是合法的，因为数组是协变的。第 4 行将 `List<Integer>` 存储到 Object 类型的数组的唯一元素中，这是成功的，因为泛型是由擦除实现的：`List<Integer>` 实例的运行时类型是 List，`List<String>`[] 实例的运行时类型是 List[]，因此这个赋值不会生成 ArrayStoreException。现在我们有麻烦了。我们将一个 `List<Integer>` 实例存储到一个数组中，该数组声明只保存 `List<String>` 实例。在第 5 行，我们从这个数组的唯一列表中检索唯一元素。编译器自动将检索到的元素转换为 String 类型，但它是一个 Integer 类型的元素，因此我们在运行时得到一个 ClassCastException。为了防止这种情况发生，第 1 行（创建泛型数组）必须生成编译时错误。

Types such as E, `List<E>`, and `List<String>` are technically known as nonreifiable types [JLS, 4.7]. Intuitively speaking, a non-reifiable type is one whose runtime representation contains less information than its compile-time representation. Because of erasure, the only parameterized types that are reifiable are unbounded wildcard types such as `List<?>` and `Map<?,?>` (Item 26). It is legal, though rarely useful, to create arrays of unbounded wildcard types.

> E、`List<E>` 和 `List<string>` 等类型在技术上称为不可具体化类型 [JLS, 4.7]。直观地说，非具体化类型的运行时表示包含的信息少于其编译时表示。由于擦除，唯一可具体化的参数化类型是无限制通配符类型，如 `List<?>` 和 `Map<?,?>`（Item-26）。创建无边界通配符类型数组是合法的，但不怎么有用。

The prohibition on generic array creation can be annoying. It means, for example, that it’s not generally possible for a generic collection to return an array of its element type (but see Item 33 for a partial solution). It also means that you get confusing（adj. 混乱的；混淆的；令人困惑的） warnings when using varargs methods (Item 53) in combination with generic types. This is because every time you invoke a varargs method, an array is created to hold the varargs parameters. If the element type of this array is not reifiable, you get a warning. The SafeVarargs annotation can be used to address this issue (Item 32).

> 禁止创建泛型数组可能很烦人。例如，这意味着泛型集合通常不可能返回其元素类型的数组（部分解决方案请参见 Item-33）。这也意味着在使用 varargs 方法（Item-53）与泛型组合时，你会得到令人困惑的警告。这是因为每次调用 varargs 方法时，都会创建一个数组来保存 varargs 参数。如果该数组的元素类型不可具体化，则会得到警告。SafeVarargs 注解可以用来解决这个问题（Item-32）。

**译注：varargs 方法，指带有可变参数的方法。**

When you get a generic array creation error or an unchecked cast warning on a cast to an array type, the best solution is often to use the collection type `List<E>` in preference to the array type E[]. You might sacrifice some conciseness or performance, but in exchange you get better type safety and interoperability.

> 当你在转换为数组类型时遇到泛型数组创建错误或 unchecked 强制转换警告时，通常最好的解决方案是使用集合类型 `List<E>`，而不是数组类型 E[]。你可能会牺牲一些简洁性或性能，但作为交换，你可以获得更好的类型安全性和互操作性。

For example, suppose you want to write a Chooser class with a constructor that takes a collection, and a single method that returns an element of the collection chosen at random. Depending on what collection you pass to the constructor, you could use a chooser as a game die, a magic 8-ball, or a data source for a Monte Carlo simulation. Here’s a simplistic implementation without generics:

> 例如，假设你希望编写一个 Chooser 类，该类的构造函数接受一个集合，而单个方法返回随机选择的集合元素。根据传递给构造函数的集合，可以将选择器用作游戏骰子、魔术 8 球或蒙特卡洛模拟的数据源。下面是一个没有泛型的简单实现：

```java
// Chooser - a class badly in need of generics!
public class Chooser {
  private final Object[] choiceArray;

  public Chooser(Collection choices) {
    choiceArray = choices.toArray();
}

  public Object choose() {
    Random rnd = ThreadLocalRandom.current();
    return choiceArray[rnd.nextInt(choiceArray.length)];
  }
}
```

To use this class, you have to cast the choose method’s return value from Object to the desired type every time you use invoke the method, and the cast will fail at runtime if you get the type wrong. Taking the advice of Item 29 to heart, we attempt to modify Chooser to make it generic. Changes are shown in boldface:

> 要使用这个类，每次使用方法调用时，必须将 choose 方法的返回值从对象转换为所需的类型，如果类型错误，转换将在运行时失败。我们认真考虑了 Item-29 的建议，试图对 Chooser 进行修改，使其具有通用性。变化以粗体显示：

```java
// A first cut at making Chooser generic - won't compile
public class Chooser<T> {
  private final T[] choiceArray;

  public Chooser(Collection<T> choices) {
    choiceArray = choices.toArray();
  }

  // choose method unchanged
}
```

If you try to compile this class, you’ll get this error message:

> 如果你尝试编译这个类，你将得到这样的错误消息：

```java
Chooser.java:9: error: incompatible types: Object[] cannot be converted to T[]
choiceArray = choices.toArray();
^ where T is a type-variable:
T extends Object declared in class Chooser
```

No big deal, you say, I’ll cast the Object array to a T array:

> 没什么大不了的，你会说，我把对象数组转换成 T 数组：

```java
choiceArray = (T[]) choices.toArray();
```

This gets rid of the error, but instead you get a warning:

> 这样就消除了错误，但你得到一个警告：

```java
Chooser.java:9: warning: [unchecked] unchecked cast choiceArray = (T[]) choices.toArray();
^ required: T[], found: Object[]
where T is a type-variable:
T extends Object declared in class Chooser
```

The compiler is telling you that it can’t vouch for the safety of the cast at runtime because the program won’t know what type T represents—remember, element type information is erased from generics at runtime. Will the program work? Yes, but the compiler can’t prove it. You could prove it to yourself, put the proof in a comment and suppress the warning with an annotation, but you’re better off eliminating the cause of warning (Item 27).

> 编译器告诉你，它不能保证在运行时转换的安全性，因为程序不知道类型 T 代表什么。记住，元素类型信息在运行时从泛型中删除。这个计划会奏效吗？是的，但是编译器不能证明它。你可以向自己证明这一点，但是你最好将证据放在注释中，指出消除警告的原因（Item-27），并使用注解隐藏警告。

To eliminate the unchecked cast warning, use a list instead of an array. Here is a version of the Chooser class that compiles without error or warning:

> 若要消除 unchecked 强制转换警告，请使用 list 而不是数组。下面是编译时没有错误或警告的 Chooser 类的一个版本：

```java
// List-based Chooser - typesafe
public class Chooser<T> {
    private final List<T> choiceList;

    public Chooser(Collection<T> choices) {
        choiceList = new ArrayList<>(choices);
    }

    public T choose() {
        Random rnd = ThreadLocalRandom.current();
        return choiceList.get(rnd.nextInt(choiceList.size()));
    }
}
```

This version is a tad more verbose, and perhaps a tad slower, but it’s worth it for the peace of mind that you won’t get a ClassCastException at runtime.

> 这个版本稍微有点冗长，可能稍微慢一些，但是为了让你安心，在运行时不会得到 ClassCastException 是值得的。

In summary, arrays and generics have very different type rules. Arrays are covariant and reified; generics are invariant and erased. As a consequence, arrays provide runtime type safety but not compile-time type safety, and vice versa for generics. As a rule, arrays and generics don’t mix well. If you find yourself mixing them and getting compile-time errors or warnings, your first impulse should be to replace the arrays with lists.

> 总之，数组和泛型有非常不同的类型规则。数组是协变的、具体化的；泛型是不变的和可被擦除的。因此，数组提供了运行时类型安全，而不是编译时类型安全，对于泛型反之亦然。一般来说，数组和泛型不能很好地混合。如果你发现将它们混合在一起并得到编译时错误或警告，那么你的第一个反应该是将数组替换为 list。

---

## 【29】优先使用泛型

> Favor generic types

It is generally not too difficult to parameterize your declarations and make use of the generic types and methods provided by the JDK. Writing your own generic types is a bit more difficult, but it’s worth the effort to learn how.

> 通常，对声明进行参数化并使用 JDK 提供的泛型和方法并不太难。编写自己的泛型有点困难，但是值得努力学习。

Consider the simple (toy) stack implementation from Item 7:

> 考虑 Item-7 中简单的堆栈实现：

```java
// Object-based collection - a prime candidate for generics
public class Stack {
    private Object[] elements;
    private int size = 0;
    private static final int DEFAULT_INITIAL_CAPACITY = 16;

    public Stack() {
        elements = new Object[DEFAULT_INITIAL_CAPACITY];
    }

    public void push(Object e) {
        ensureCapacity();
        elements[size++] = e;
    }

    public Object pop() {
        if (size == 0)
            throw new EmptyStackException();
        Object result = elements[--size];
        elements[size] = null; // Eliminate obsolete reference
        return result;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    private void ensureCapacity() {
        if (elements.length == size)
            elements = Arrays.copyOf(elements, 2 * size + 1);
    }
}
```

This class should have been parameterized to begin with, but since it wasn’t, we can generify it after the fact. In other words, we can parameterize it without harming clients of the original non-parameterized version. As it stands, the client has to cast objects that are popped off the stack, and those casts might fail at runtime. The first step in generifying a class is to add one or more type parameters to its declaration. In this case there is one type parameter, representing the element type of the stack, and the conventional name for this type parameter is E (Item 68).

> 这个类一开始就应该是参数化的，但是因为它不是参数化的，所以我们可以在事后对它进行泛化。换句话说，我们可以对它进行参数化，而不会损害原始非参数化版本的客户端。按照目前的情况，客户端必须转换从堆栈中弹出的对象，而这些转换可能在运行时失败。生成类的第一步是向其声明中添加一个或多个类型参数。在这种情况下，有一个类型参数，表示堆栈的元素类型，这个类型参数的常规名称是 E（Item-68）。

The next step is to replace all the uses of the type Object with the appropriate type parameter and then try to compile the resulting program:

> 下一步是用适当的类型参数替换所有的 Object 类型，然后尝试编译修改后的程序：

```java
// Initial attempt to generify Stack - won't compile!
public class Stack<E> {
    private E[] elements;
    private int size = 0;
    private static final int DEFAULT_INITIAL_CAPACITY = 16;

    public Stack() {
        elements = new E[DEFAULT_INITIAL_CAPACITY];
    }

    public void push(E e) {
        ensureCapacity();
        elements[size++] = e;
    }

    public E pop() {
        if (size == 0)
            throw new EmptyStackException();
        E result = elements[--size];
        elements[size] = null; // Eliminate obsolete reference
        return result;
    } ... // no changes in isEmpty or ensureCapacity
}
```

You’ll generally get at least one error or warning, and this class is no exception. Luckily, this class generates only one error:

> 通常至少会得到一个错误或警告，这个类也不例外。幸运的是，这个类只生成一个错误：

```java
Stack.java:8: generic array creation
elements = new E[DEFAULT_INITIAL_CAPACITY];
^
```

As explained in Item 28, you can’t create an array of a non-reifiable type, such as E. This problem arises every time you write a generic type that is backed by an array. There are two reasonable ways to solve it. The first solution directly circumvents the prohibition on generic array creation: create an array of Object and cast it to the generic array type. Now in place of an error, the compiler will emit a warning. This usage is legal, but it’s not (in general) typesafe:

> 正如 Item-28 中所解释的，你不能创建非具体化类型的数组，例如 E。每当你编写由数组支持的泛型时，就会出现这个问题。有两种合理的方法来解决它。第一个解决方案直接绕过了创建泛型数组的禁令：创建对象数组并将其强制转换为泛型数组类型。现在，编译器将发出一个警告来代替错误。这种用法是合法的，但（一般而言）它不是类型安全的：

```java
Stack.java:8: warning: [unchecked] unchecked cast
found: Object[], required: E[]
elements = (E[]) new Object[DEFAULT_INITIAL_CAPACITY];
^
```

The compiler may not be able to prove that your program is typesafe, but you can. You must convince yourself that the unchecked cast will not compromise the type safety of the program. The array in question (elements) is stored in a private field and never returned to the client or passed to any other method. The only elements stored in the array are those passed to the push method, which are of type E, so the unchecked cast can do no harm.

> 编译器可能无法证明你的程序是类型安全的，但你可以。你必须说服自己，unchecked 的转换不会损害程序的类型安全性。所涉及的数组（元素）存储在私有字段中，从未返回给客户端或传递给任何其他方法。数组中存储的惟一元素是传递给 push 方法的元素，它们属于 E 类型，因此 unchecked 的转换不会造成任何损害。

Once you’ve proved that an unchecked cast is safe, suppress the warning in as narrow a scope as possible (Item 27). In this case, the constructor contains only the unchecked array creation, so it’s appropriate to suppress the warning in the entire constructor. With the addition of an annotation to do this, Stack compiles cleanly, and you can use it without explicit casts or fear of a ClassCastException:

> 一旦你证明了 unchecked 的转换是安全的，就将警告限制在尽可能小的范围内（Item-27）。在这种情况下，构造函数只包含 unchecked 的数组创建，因此在整个构造函数中取消警告是合适的。通过添加注解来实现这一点，Stack 可以干净地编译，而且你可以使用它而无需显式强制转换或担心 ClassCastException：

```java
// The elements array will contain only E instances from push(E).
// This is sufficient to ensure type safety, but the runtime
// type of the array won't be E[]; it will always be Object[]!
@SuppressWarnings("unchecked")
public Stack() {
    elements = (E[]) new Object[DEFAULT_INITIAL_CAPACITY];
}
```

The second way to eliminate the generic array creation error in Stack is to change the type of the field elements from E[] to Object[]. If you do this, you’ll get a different error:

> 消除 Stack 中泛型数组创建错误的第二种方法是将字段元素的类型从 E[] 更改为 Object[]。如果你这样做，你会得到一个不同的错误：

```java
Stack.java:19: incompatible types
found: Object, required: E
E result = elements[--size];
^
```

You can change this error into a warning by casting the element retrieved from the array to E, but you will get a warning:

> 通过将从数组中检索到的元素转换为 E，可以将此错误转换为警告，但你将得到警告：

```java
Stack.java:19: warning: [unchecked] unchecked cast
found: Object, required: E
E result = (E) elements[--size];
^
```

Because E is a non-reifiable type, there’s no way the compiler can check the cast at runtime. Again, you can easily prove to yourself that the unchecked cast is safe, so it’s appropriate to suppress the warning. In line with the advice of Item 27, we suppress the warning only on the assignment that contains the unchecked cast, not on the entire pop method:

> 因为 E 是不可具体化的类型，编译器无法在运行时检查强制转换。同样，你可以很容易地向自己证明 unchecked 的强制转换是安全的，因此可以适当地抑制警告。根据 Item-27 的建议，我们仅对包含 unchecked 强制转换的赋值禁用警告，而不是对整个 pop 方法禁用警告：

```java
// Appropriate suppression of unchecked warning
public E pop() {
    if (size == 0)
        throw new EmptyStackException();
    // push requires elements to be of type E, so cast is correct
    @SuppressWarnings("unchecked")
    E result =(E) elements[--size];
    elements[size] = null; // Eliminate obsolete reference
    return result;
}
```

Both techniques for eliminating the generic array creation have their adherents. The first is more readable: the array is declared to be of type E[], clearly indicating that it contains only E instances. It is also more concise: in a typical generic class, you read from the array at many points in the code; the first technique requires only a single cast (where the array is created), while the second requires a separate cast each time an array element is read. Thus, the first technique is preferable and more commonly used in practice. It does, however, cause heap pollution (Item 32): the runtime type of the array does not match its compile-time type (unless E happens to be Object). This makes some programmers sufficiently queasy that they opt for the second technique, though the heap pollution is harmless in this situation.

> 消除泛型数组创建的两种技术都有其追随者。第一个更容易读：数组声明为 E[] 类型，这清楚地表明它只包含 E 的实例。它也更简洁：在一个典型的泛型类中，从数组中读取代码中的许多点；第一种技术只需要一次转换（在创建数组的地方），而第二种技术在每次读取数组元素时都需要单独的转换。因此，第一种技术是可取的，在实践中更常用。但是，它确实会造成堆污染（Item-32）：数组的运行时类型与其编译时类型不匹配（除非 E 恰好是 Object）。尽管堆污染在这种情况下是无害的，但这使得一些程序员感到非常不安，因此他们选择了第二种技术。

The following program demonstrates the use of our generic Stack class. The program prints its command line arguments in reverse order and converted to uppercase. No explicit cast is necessary to invoke String’s toUpperCase method on the elements popped from the stack, and the automatically generated cast is guaranteed to succeed:

> 下面的程序演示了通用 Stack 的使用。程序以相反的顺序打印它的命令行参数并转换为大写。在从堆栈弹出的元素上调用 String 的 toUpperCase 方法不需要显式转换，自动生成的转换保证成功：

```java
// Little program to exercise our generic Stack
public static void main(String[] args) {
    Stack<String> stack = new Stack<>();
    for (String arg : args)
        stack.push(arg);
    while (!stack.isEmpty())
        System.out.println(stack.pop().toUpperCase());
}
```

The foregoing（adj. 前述的；前面的；在前的） example may appear to contradict Item 28, which encourages the use of lists in preference to arrays. It is not always possible or desirable to use lists inside your generic types. Java doesn’t support lists natively, so some generic types, such as ArrayList, must be implemented atop arrays. Other generic types, such as HashMap, are implemented atop arrays for performance. The great majority of generic types are like our Stack example in that their type parameters have no restrictions: you can create a `Stack<Object>`, `Stack<int[]>`, `Stack<List<String>>`, or Stack of any other object reference type. Note that you can’t create a Stack of a primitive type: trying to create a `Stack<int>` or `Stack<double>` will result in a compile-time error.

> 前面的例子可能与 Item-28 相矛盾，Item-28 鼓励优先使用列表而不是数组。在泛型中使用列表并不总是可能的或可取的。Java 本身不支持列表，因此一些泛型（如 ArrayList）必须在数组之上实现。其他泛型（如 HashMap）是在数组之上实现的，以提高性能。大多数泛型与我们的 Stack 示例相似，因为它们的类型参数没有限制：你可以创建 `Stack<Object>`、`Stack<int[]>`、`Stack<List<String>>` 或任何其他对象引用类型的堆栈。注意，不能创建基本类型的 Stack：试图创建 `Stack<int>` 或 `Stack<double>` 将导致编译时错误。

This is a fundamental limitation of Java’s generic type system. You can work around this restriction by using boxed primitive types (Item 61). There are some generic types that restrict the permissible values of their type parameters. For example, consider java.util.concurrent.DelayQueue, whose declaration looks like this:

> 这是 Java 泛型系统的一个基本限制。你可以通过使用装箱的基本类型（Item-61）来绕过这一限制。有一些泛型限制了其类型参数的允许值。例如，考虑 java.util.concurrent.DelayQueue，其声明如下：

```java
class DelayQueue<E extends Delayed> implements BlockingQueue<E>
```

The type parameter list (`<E extends Delayed>`) requires that the actual type parameter E be a subtype of java.util.concurrent.Delayed. This allows the DelayQueue implementation and its clients to take advantage of Delayed methods on the elements of a DelayQueue, without the need for explicit casting or the risk of a ClassCastException. The type parameter E is known as a bounded type parameter. Note that the subtype relation is defined so that every type is a subtype of itself [JLS, 4.10], so it is legal to create a `DelayQueue<Delayed>`.

> 类型参数列表（`<E extends Delayed>`）要求实际的类型参数 E 是 java.util.concurrent.Delayed 的一个子类型。这允许 DelayQueue 实现及其客户端利用 DelayQueue 元素上的 Delayed 方法，而不需要显式转换或 ClassCastException 的风险。类型参数 E 称为有界类型参数。注意，子类型关系的定义使得每个类型都是它自己的子类型 [JLS, 4.10]，所以创建 `DelayQueue<Delayed>` 是合法的。

In summary, generic types are safer and easier to use than types that require casts in client code. When you design new types, make sure that they can be used without such casts. This will often mean making the types generic. If you have any existing types that should be generic but aren’t, generify them. This will make life easier for new users of these types without breaking existing clients (Item 26).

> 总之，泛型比需要在客户端代码中转换的类型更安全、更容易使用。在设计新类型时，请确保可以在不使用此类类型转换的情况下使用它们。这通常意味着使类型具有通用性。如果你有任何应该是泛型但不是泛型的现有类型，请对它们进行泛型。这将使这些类型的新用户在不破坏现有客户端（Item-26）的情况下更容易使用。

---

## 【30】优先使用泛型方法

> Favor generic methods

Just as classes can be generic, so can methods. Static utility methods that operate on parameterized types are usually generic. All of the “algorithm” methods in Collections (such as binarySearch and sort) are generic.

> 类可以是泛型的，方法也可以是泛型的。操作参数化类型的静态实用程序方法通常是泛型的。Collections 类中的所有「算法」方法（如 binarySearch 和 sort）都是泛型的。

Writing generic methods is similar to writing generic types. Consider this deficient（adj. 不足的；有缺陷的；不充分的） method, which returns the union of two sets:

> 编写泛型方法类似于编写泛型类型。考虑这个有缺陷的方法，它返回两个集合的并集：

```java
// Uses raw types - unacceptable! (Item 26)
public static Set union(Set s1, Set s2) {
    Set result = new HashSet(s1);
    result.addAll(s2);
    return result;
}
```

This method compiles but with two warnings:

> 该方法可进行编译，但有两个警告：

```java
Union.java:5: warning: [unchecked] unchecked call to
HashSet(Collection<? extends E>) as a member of raw type HashSet
        Set result = new HashSet(s1);
                      ^

Union.java:6: warning: [
unchecked] unchecked call to
addAll(Collection<? extends E>) as a member of raw type Set
        result.addAll(s2);
                      ^
```

To fix these warnings and make the method typesafe, modify its declaration to declare a type parameter representing the element type for the three sets (the two arguments and the return value) and use this type parameter throughout the method. **The type parameter list, which declares the type parameters, goes between a method’s modifiers and its return type.** In this example, the type parameter list is `<E>`, and the return type is `Set<E>`. The naming conventions for type parameters are the same for generic methods and generic types (Items 29, 68):

> 要修复这些警告并使方法类型安全，请修改其声明，以声明表示三个集合（两个参数和返回值）的元素类型的类型参数，并在整个方法中使用该类型参数。类型参数列表声明类型参数，它位于方法的修饰符与其返回类型之间。在本例中，类型参数列表为 `<E>`，返回类型为 `Set<E>`。类型参数的命名约定与泛型方法和泛型类型的命名约定相同（Item-29、Item-68）:

```java
// Generic method
public static <E> Set<E> union(Set<E> s1, Set<E> s2) {
    Set<E> result = new HashSet<>(s1);
    result.addAll(s2);
    return result;
}
```

At least for simple generic methods, that’s all there is to it. This method compiles without generating any warnings and provides type safety as well as ease of use. Here’s a simple program to exercise the method. This program contains no casts and compiles without errors or warnings:

> 至少对于简单的泛型方法，这就是（要注意细节的）全部。该方法编译时不生成任何警告，并且提供了类型安全性和易用性。这里有一个简单的程序来演示。这个程序不包含转换，编译时没有错误或警告：

```java
// Simple program to exercise generic method
public static void main(String[] args) {
    Set<String> guys = Set.of("Tom", "Dick", "Harry");
    Set<String> stooges = Set.of("Larry", "Moe", "Curly");
    Set<String> aflCio = union(guys, stooges);
    System.out.println(aflCio);
}
```

When you run the program, it prints [Moe, Tom, Harry, Larry, Curly, Dick]. (The order of the elements in the output is implementation-dependent.)

> 当你运行程序时，它会打印出 [Moe, Tom, Harry, Larry, Curly, Dick]。（输出元素的顺序可能不同）。

A limitation of the union method is that the types of all three sets (both input parameters and the return value) have to be exactly the same. You can make the method more flexible by using bounded wildcard types (Item 31).

> union 方法的一个限制是，所有三个集合（输入参数和返回值）的类型必须完全相同。你可以通过使用有界通配符类型（Item-31）使方法更加灵活。

On occasion, you will need to create an object that is immutable but applicable to many different types. Because generics are implemented by erasure (Item 28), you can use a single object for all required type parameterizations, but you need to write a static factory method to repeatedly dole out the object for each requested type parameterization. This pattern, called the generic singleton factory, is used for function objects (Item 42) such as Collections.reverseOrder, and occasionally for collections such as Collections.emptySet.

> 有时，你需要创建一个对象，该对象是不可变的，但适用于许多不同类型。因为泛型是由擦除（Item-28）实现的，所以你可以为所有需要的类型参数化使用单个对象，但是你需要编写一个静态工厂方法，为每个请求的类型参数化重复分配对象。这种模式称为泛型单例工厂，可用于函数对象（Item-42），如 Collections.reverseOrder，偶尔也用于集合，如 Collections.emptySet。

Suppose that you want to write an identity function dispenser. The libraries provide Function.identity, so there’s no reason to write your own (Item 59), but it is instructive. It would be wasteful to create a new identity function object time one is requested, because it’s stateless. If Java’s generics were reified, you would need one identity function per type, but since they’re erased a generic singleton will suffice. Here’s how it looks:

> 假设你想要编写一个恒等函数分发器。这些库提供 Function.identity，所以没有理由编写自己的库（Item-59），但是它很有指导意义。在请求标识函数对象时创建一个新的标识函数对象是浪费时间的，因为它是无状态的。如果 Java 的泛型被具体化了，那么每个类型都需要一个标识函数，但是由于它们已经被擦除，一个泛型单例就足够了。它是这样的：

```java
// Generic singleton factory pattern
private static UnaryOperator<Object> IDENTITY_FN = (t) -> t;

@SuppressWarnings("unchecked")
public static <T> UnaryOperator<T> identityFunction() {
    return (UnaryOperator<T>) IDENTITY_FN;
}
```

The cast of IDENTITY_FN to (`UnaryFunction<T>`) generates an unchecked cast warning, as `UnaryOperator<Object>` is not a `UnaryOperator<T>` for every T. But the identity function is special: it returns its argument unmodified, so we know that it is typesafe to use it as a `UnaryFunction<T>`, whatever the value of T. Therefore, we can confidently suppress the unchecked cast warning generated by this cast. Once we’ve done this, the code compiles without error or warning.

> IDENTITY_FN 到（`UnaryFunction<T>`）的转换会生成一个 unchecked 转换警告，因为 `UnaryOperator<Object>` 并不是每个 T 都是 `UnaryOperator<T>`，但是恒等函数是特殊的：它会返回未修改的参数，所以我们知道，无论 T 的值是多少，都可以将其作为 `UnaryFunction<T>` 使用，这是类型安全的。一旦我们这样做了，代码编译就不会出现错误或警告。

Here is a sample program that uses our generic singleton as a `UnaryOperator<String>` and a `UnaryOperator<Number>`. As usual, it contains no casts and compiles without errors or warnings:

> 下面是一个示例程序，它使用我们的泛型单例作为 `UnaryOperator<String>` 和 `UnaryOperator<Number>`。像往常一样，它不包含类型转换和编译，没有错误或警告：

```java
// Sample program to exercise generic singleton
public static void main(String[] args) {
    String[] strings = { "jute", "hemp", "nylon" };
    UnaryOperator<String> sameString = identityFunction();

    for (String s : strings)
        System.out.println(sameString.apply(s));

    Number[] numbers = { 1, 2.0, 3L };
    UnaryOperator<Number> sameNumber = identityFunction();

    for (Number n : numbers)
        System.out.println(sameNumber.apply(n));
}
```

It is permissible, though relatively rare, for a type parameter to be bounded by some expression involving that type parameter itself. This is what’s known as a recursive type bound. A common use of recursive type bounds is in connection with the Comparable interface, which defines a type’s natural ordering (Item 14). This interface is shown here:

> 允许类型参数被包含该类型参数本身的表达式限制，尽管这种情况比较少见。这就是所谓的递归类型限定。递归类型边界的一个常见用法是与 Comparable 接口相关联，后者定义了类型的自然顺序（Item-14）。该界面如下图所示：

```java
public interface Comparable<T> {
    int compareTo(T o);
}
```

The type parameter T defines the type to which elements of the type implementing `Comparable<T>` can be compared. In practice, nearly all types can be compared only to elements of their own type. So, for example, String implements `Comparable<String>`, Integer implements `Comparable<Integer>`, and so on.

> 类型参数 T 定义了实现 `Comparable<T>` 的类型的元素可以与之进行比较的类型。在实践中，几乎所有类型都只能与它们自己类型的元素进行比较。例如，String 实现 `Comparable<String>`， Integer 实现 `Comparable<Integer>`，等等。

Many methods take a collection of elements implementing Comparable to sort it, search within it, calculate its minimum or maximum, and the like. To do these things, it is required that every element in the collection be comparable to every other element in it, in other words, that the elements of the list be mutually comparable. Here is how to express that constraint:

> 许多方法采用实现 Comparable 的元素集合，在其中进行搜索，计算其最小值或最大值，等等。要做到这些，需要集合中的每个元素与集合中的每个其他元素相比较，换句话说，就是列表中的元素相互比较。下面是如何表达这种约束（的示例）：

```java
// Using a recursive type bound to express mutual comparability
public static <E extends Comparable<E>> E max(Collection<E> c);
```

The type bound `<E extends Comparable<E>>` may be read as “any type E that can be compared to itself,” which corresponds more or less precisely to the notion of mutual comparability.

> 类型限定 `<E extends Comparable<E>>` 可以被理解为「可以与自身进行比较的任何类型 E」，这或多或少与相互可比性的概念相对应。

Here is a method to go with the previous declaration. It calculates the maximum value in a collection according to its elements’ natural order, and it compiles without errors or warnings:

> 下面是一个与前面声明相同的方法。它根据元素的自然顺序计算集合中的最大值，编译时没有错误或警告：

```java
// Returns max value in a collection - uses recursive type bound
public static <E extends Comparable<E>> E max(Collection<E> c) {
    if (c.isEmpty())
        throw new IllegalArgumentException("Empty collection");

    E result = null;

    for (E e : c)
        if (result == null || e.compareTo(result) > 0)

    result = Objects.requireNonNull(e);
    return result;
}
```

Note that this method throws IllegalArgumentException if the list is empty. A better alternative would be to return an `Optional<E>` (Item 55).

> 注意，如果列表为空，该方法将抛出 IllegalArgumentException。更好的选择是返回一个 `Optional<E>`（Item-55）。

Recursive type bounds can get much more complex, but luckily they rarely do. If you understand this idiom, its wildcard variant (Item 31), and the simulated self-type idiom (Item 2), you’ll be able to deal with most of the recursive type bounds you encounter in practice.

> 递归类型限定可能会变得复杂得多，但幸运的是，这种情况很少。如果你理解这个习惯用法、它的通配符变量（Item-31）和模拟的自类型习惯用法（Item-2），你就能够处理在实践中遇到的大多数递归类型限定。

In summary, generic methods, like generic types, are safer and easier to use than methods requiring their clients to put explicit casts on input parameters and return values. Like types, you should make sure that your methods can be used without casts, which often means making them generic. And like types, you should generify existing methods whose use requires casts. This makes life easier for new users without breaking existing clients (Item 26).

> 总之，与要求客户端对输入参数和返回值进行显式转换的方法相比，泛型方法与泛型一样，更安全、更容易使用。与类型一样，你应该确保你的方法可以在不使用类型转换的情况下使用，这通常意味着要使它们具有通用性。与类型类似，你应该将需要强制类型转换的现有方法泛型化。这使得新用户在不破坏现有客户端的情况下更容易使用（Item-26）。

---

## 【31】使用有界通配符增加 API 的灵活性

> Use bounded wildcards to increase API flexibility

As noted in Item 28, parameterized types are invariant. In other words, for any two distinct types `Type1` and `Type2`, `List<Type1>` is neither a subtype nor a supertype of `List<Type2>`. Although it is counterintuitive that `List<String>` is not a subtype of `List<Object>`, it really does make sense. You can put any object into a `List<Object>`, but you can put only strings into a `List<String>`. Since a `List<String>` can’t do everything a `List<Object>` can, it isn’t a subtype (by the Liskov substitution principal, Item 10).

> 如 Item-28 所示，参数化类型是不可变的。换句话说，对于任意两种不同类型 `Type1` 和 `Type2`，`List<Type1>` 既不是 `List<Type2>` 的子类型，也不是它的父类。虽然 `List<String>` 不是 `List<Object>` 的子类型，这和习惯的直觉不符，但它确实有意义。你可以将任何对象放入 `List<Object>`，但只能将字符串放入 `List<String>`。因为 `List<String>` 不能做 `List<Object>` 能做的所有事情，所以它不是子类型（可通过 Liskov 替换原则来理解这一点，Item-10）。

**译注：里氏替换原则（Liskov Substitution Principle，LSP）面向对象设计的基本原则之一。里氏替换原则指出：任何父类可以出现的地方，子类一定可以出现。LSP 是继承复用的基石，只有当衍生类可以替换掉父类，软件单位的功能不受到影响时，父类才能真正被复用，而衍生类也能够在父类的基础上增加新的行为。**

Sometimes you need more flexibility than invariant typing can provide. Consider the Stack class from Item 29. To refresh your memory, here is its public API:

> 有时你需要获得比不可变类型更多的灵活性。考虑 Item-29 中的堆栈类。以下是它的公共 API：

```java
public class Stack<E> {
    public Stack();
    public void push(E e);
    public E pop();
    public boolean isEmpty();
}
```

Suppose we want to add a method that takes a sequence of elements and pushes them all onto the stack. Here’s a first attempt:

> 假设我们想添加一个方法，该方法接受一系列元素并将它们全部推入堆栈。这是第一次尝试：

```java
// pushAll method without wildcard type - deficient!
public void pushAll(Iterable<E> src) {
    for (E e : src)
        push(e);
}
```

This method compiles cleanly, but it isn’t entirely satisfactory. If the element type of the `Iterable src` exactly matches that of the stack, it works fine. But suppose you have a `Stack<Number>` and you invoke `push(intVal)`, where `intVal` is of type `Integer`. This works because `Integer` is a subtype of `Number`. So logically, it seems that this should work, too:

> 该方法能够正确编译，但并不完全令人满意。如果 `Iterable src` 的元素类型与堆栈的元素类型完全匹配，那么它正常工作。但是假设你有一个 `Stack<Number>`，并且调用 `push(intVal)`，其中 `intVal` 的类型是 `Integer`。这是可行的，因为 `Integer` 是 `Number` 的子类型。因此，从逻辑上讲，这似乎也应该奏效：

```java
Stack<Number> numberStack = new Stack<>();
Iterable<Integer> integers = ... ;
numberStack.pushAll(integers);
```

If you try it, however, you’ll get this error message because parameterized types are invariant:

> 但是，如果你尝试一下，将会得到这个错误消息，因为参数化类型是不可变的：

```java
StackTest.java:7: error: incompatible types: Iterable<Integer>
cannot be converted to Iterable<Number>
        numberStack.pushAll(integers);
                    ^
```

Luckily, there’s a way out. The language provides a special kind of parameterized type call a bounded wildcard type to deal with situations like this. The type of the input parameter to pushAll should not be “Iterable of E” but “Iterable of some subtype of E,” and there is a wildcard type that means precisely that: Iterable<? extends E>. (The use of the keyword extends is slightly misleading: recall from Item 29 that subtype is defined so that every type is a subtype of itself, even though it does not extend itself.) Let’s modify pushAll to use this type:

> 幸运的是，有一种解决方法。Java 提供了一种特殊的参数化类型，`有界通配符类型`来处理这种情况。pushAll 的输入参数的类型不应该是「E 的 Iterable 接口」，而应该是「E 的某个子类型的 Iterable 接口」，并且有一个通配符类型，它的确切含义是：`Iterable<? extends E>`（关键字 extends 的使用稍微有些误导：回想一下 Item-29，定义了子类型，以便每个类型都是其本身的子类型，即使它没有扩展自己。）让我们修改 pushAll 来使用这种类型：

```java
// Wildcard type for a parameter that serves as an E producer
public void pushAll(Iterable<? extends E> src) {
    for (E e : src)
        push(e);
}
```

With this change, not only does Stack compile cleanly, but so does the client code that wouldn’t compile with the original pushAll declaration. Because Stack and its client compile cleanly, you know that everything is typesafe. Now suppose you want to write a popAll method to go with pushAll. The popAll method pops each element off the stack and adds the elements to the given collection. Here’s how a first attempt at writing the popAll method might look:

> 更改之后，不仅 Stack 可以正确编译，而且不能用原始 pushAll 声明编译的客户端代码也可以正确编译。因为 Stack 和它的客户端可以正确编译，所以你知道所有东西都是类型安全的。现在假设你想编写一个与 pushAll 一起使用的 popAll 方法。popAll 方法将每个元素从堆栈中弹出，并将这些元素添加到给定的集合中。下面是编写 popAll 方法的第一次尝试：

```java
// popAll method without wildcard type - deficient!
public void popAll(Collection<E> dst) {
    while (!isEmpty())
        dst.add(pop());
}
```

Again, this compiles cleanly and works fine if the element type of the destination collection exactly matches that of the stack. But again, it isn’t entirely satisfactory. Suppose you have a `Stack<Number>` and variable of type Object. If you pop an element from the stack and store it in the variable, it compiles and runs without error. So shouldn’t you be able to do this, too?

> 同样，如果目标集合的元素类型与堆栈的元素类型完全匹配，那么这种方法可以很好地编译。但这也不是完全令人满意。假设你有一个 `Stack<Number>` 和 Object 类型的变量。如果从堆栈中取出一个元素并将其存储在变量中，那么它将编译并运行，不会出错。所以你不能也这样做吗？

```java
Stack<Number> numberStack = new Stack<Number>();
Collection<Object> objects = ... ;
numberStack.popAll(objects);
```

If you try to compile this client code against the version of popAll shown earlier, you’ll get an error very similar to the one that we got with our first version of pushAll: `Collection<Object>` is not a subtype of `Collection<Number>`. Once again, wildcard types provide a way out. The type of the input parameter to popAll should not be “collection of E” but “collection of some supertype of E” (where supertype is defined such that E is a supertype of itself [JLS, 4.10]). Again, there is a wildcard type that means precisely that: Collection<? super E>. Let’s modify popAll to use it:

> 如果你尝试根据前面显示的 popAll 版本编译此客户端代码，你将得到一个与第一个版本的 pushAll 非常相似的错误：`Collection<Object>`不是 `Collection<Number>` 的子类型。同样，通配符类型提供解决方法。popAll 的输入参数的类型不应该是「E 的集合」，而应该是「E 的某个超类型的集合」（其中的超类型定义为 E 本身是一个超类型[JLS, 4.10]）。同样，有一个通配符类型，它的确切含义是：`Collection<? super E>`。让我们修改 popAll 来使用它：

```java
// Wildcard type for parameter that serves as an E consumer
public void popAll(Collection<? super E> dst) {
  while (!isEmpty())
    dst.add(pop());
}
```

With this change, both Stack and the client code compile cleanly.

> 通过此更改，Stack 类和客户端代码都可以正确编译。

The lesson is clear. **For maximum flexibility, use wildcard types on input parameters that represent producers or consumers.** If an input parameter is both a producer and a consumer, then wildcard types will do you no good: you need an exact type match, which is what you get without any wildcards. Here is a mnemonic to help you remember which wildcard type to use:

> 教训是清楚的。为了获得最大的灵活性，应在表示生产者或消费者的输入参数上使用通配符类型。如果输入参数既是生产者又是消费者，那么通配符类型对你没有任何好处：你需要一个精确的类型匹配，这就是在没有通配符的情况下得到的结果。这里有一个助记符帮助你记住使用哪种通配符类型：

**PECS stands for producer-extends, consumer-super.**

PECS 表示生产者应使用 extends，消费者应使用 super。

In other words, if a parameterized type represents a T producer, use `<? extends T>`; if it represents a T consumer, use `<? super T>`. In our Stack example, pushAll’s src parameter produces E instances for use by the Stack, so the appropriate type for src is `Iterable<? extends E>`; popAll’s dst parameter consumes E instances from the Stack, so the appropriate type for dst is `Collection<? super E>`. The PECS mnemonic captures the fundamental principle that guides the use of wild-card types. Naftalin and Wadler call it the Get and Put Principle [Naftalin07, 2.4].

> 换句话说，如果参数化类型表示 T 生成器，则使用 `<? extends T>`；如果它表示一个 T 消费者，则使用 `<? super T>`。在我们的 Stack 示例中，pushAll 的 src 参数生成 E 的实例供 Stack 使用，因此 src 的适当类型是 `Iterable<? extends E>`；popAll 的 dst 参数使用 Stack 中的 E 实例，因此适合 dst 的类型是 `Collection<? super E>`。PECS 助记符捕获了指导通配符类型使用的基本原则。Naftalin 和 Wadler 称之为 Get and Put 原则[Naftalin07, 2.4]。

With this mnemonic in mind, let’s take a look at some method and constructor declarations from previous items in this chapter. The Chooser constructor in Item 28 has this declaration:

> 记住这个助记符后，再让我们看一看本章前面提及的一些方法和构造函数声明。Item-28 中的 Chooser 构造函数有如下声明：

```java
public Chooser(Collection<T> choices)
```

This constructor uses the collection choices only to produce values of type T (and stores them for later use), so its declaration should use a wildcard type that **extends T.** Here’s the resulting constructor declaration:

> 这个构造函数只使用集合选项来生成类型 T 的值（并存储它们以供以后使用），因此它的声明应该使用扩展 T 的通配符类型 **extends T**。下面是生成的构造函数声明：

```java
// Wildcard type for parameter that serves as an T producer
public Chooser(Collection<? extends T> choices)
```

And would this change make any difference in practice? Yes, it would. Suppose you have a `List<Integer>`, and you want to pass it in to the constructor for a Chooser<Number>. This would not compile with the original declaration, but it does once you add the bounded wildcard type to the declaration.

> 这种改变在实践中会有什么不同吗？是的，它会。假设你有一个 `List<Integer>`，并且希望将其传递给 `Chooser<Number>` 的构造函数。这不会与原始声明一起编译，但是一旦你将有界通配符类型添加到声明中，它就会编译。

Now let’s look at the union method from Item 30. Here is the declaration:

> 现在让我们看看 Item-30 中的 union 方法。以下是声明：

```java
public static <E> Set<E> union(Set<E> s1, Set<E> s2)
```

Both parameters, s1 and s2, are E producers, so the PECS mnemonic tells us that the declaration should be as follows:

> 参数 s1 和 s2 都是 E 的生产者，因此 PECS 助记符告诉我们声明应该如下：

```java
public static <E> Set<E> union(Set<? extends E> s1,Set<? extends E> s2)
```

Note that the return type is still `Set<E>`. **Do not use bounded wildcard types as return types.** Rather than providing additional flexibility for your users, it would force them to use wildcard types in client code. With the revised declaration, this code will compile cleanly:

> 注意，返回类型仍然设置为 `Set<E>`。**不要使用有界通配符类型作为返回类型。** 它将强制用户在客户端代码中使用通配符类型，而不是为用户提供额外的灵活性。经修订后的声明可正确编译以下代码：

```java
Set<Integer> integers = Set.of(1, 3, 5);
Set<Double> doubles = Set.of(2.0, 4.0, 6.0);
Set<Number> numbers = union(integers, doubles);
```

Properly used, wildcard types are nearly invisible to the users of a class. They cause methods to accept the parameters they should accept and reject those they should reject. **If the user of a class has to think about wildcard types, there is probably something wrong with its API.**

> 如果使用得当，通配符类型对于类的用户几乎是不可见的。它们让方法接受它们应该接受的参数，拒绝应该拒绝的参数。**如果类的用户必须考虑通配符类型，那么它的 API 可能有问题。**

Prior to Java 8, the type inference rules were not clever enough to handle the previous code fragment, which requires the compiler to use the contextually specified return type (or target type) to infer the type of E. The target type of the union invocation shown earlier is `Set<Number>`. If you try to compile the fragment in an earlier version of Java (with an appropriate replacement for the Set.of factory), you’ll get a long, convoluted error message like this:

> 在 Java 8 之前，类型推断规则还不足以处理前面的代码片段，这要求编译器使用上下文指定的返回类型（或目标类型）来推断 E 的类型。前面显示的 union 调用的目标类型设置为 `Set<Number>` 如果你尝试在 Java 的早期版本中编译该片段（使用 Set.of factory 的适当替代），你将得到一条长而复杂的错误消息，如下所示：

```java
Union.java:14: error: incompatible types
Set<Number> numbers = union(integers, doubles);
^ required: Set<Number>
found: Set<INT#1>
where INT#1,INT#2 are intersection types:
INT#1 extends Number,Comparable<? extends INT#2>
INT#2 extends Number,Comparable<?>
```

Luckily there is a way to deal with this sort of error. If the compiler doesn’t infer the correct type, you can always tell it what type to use with an explicit type argument [JLS, 15.12]. Even prior to the introduction of target typing in Java 8, this isn’t something that you had to do often, which is good because explicit type arguments aren’t very pretty. With the addition of an explicit type argument, as shown here, the code fragment compiles cleanly in versions prior to Java 8:

> 幸运的是，有一种方法可以处理这种错误。如果编译器没有推断出正确的类型，你总是可以告诉它使用显式类型参数[JLS, 15.12]使用什么类型。即使在 Java 8 中引入目标类型之前，这也不是必须经常做的事情，这很好，因为显式类型参数不是很漂亮。通过添加显式类型参数，如下所示，代码片段可以在 Java 8 之前的版本中正确编译：

```java
// Explicit type parameter - required prior to Java 8
Set<Number> numbers = Union.<Number>union(integers, doubles);
```

Next let’s turn our attention to the max method in Item 30. Here is the original declaration:

> 接下来让我们将注意力转到 Item-30 中的 max 方法。以下是原始声明：

```java
public static <T extends Comparable<T>> T max(List<T> list)
```

Here is a revised declaration that uses wildcard types:

> 下面是使用通配符类型的修正声明：

```java
public static <T extends Comparable<? super T>> T max(List<? extends T> list)
```

To get the revised declaration from the original, we applied the PECS heuristic twice. The straightforward application is to the parameter list. It produces T instances, so we change the type from `List<T>` to `List<? extends T>`. The tricky application is to the type parameter T. This is the first time we’ve seen a wildcard applied to a type parameter. Originally, T was specified to extend `Comparable<T>`, but a comparable of T consumes T instances (and produces integers indicating order relations). Therefore, the parameterized type `Comparable<T>` is replaced by the bounded wildcard type `Comparable<? super T>`. Comparables are always consumers, so you should generally **use `Comparable<? super T>` in preference to `Comparable<T>`.** The same is true of comparators; therefore, you should generally **use `Comparator<? super T>` in preference to `Comparator<T>`.**

> 为了从原始声明中得到修改后的声明，我们两次应用了 PECS 启发式。直接的应用程序是参数列表。它生成 T 的实例，所以我们将类型从 `List<T>` 更改为 `List<? extends T>`。复杂的应用是类型参数 T。这是我们第一次看到通配符应用于类型参数。最初，T 被指定为扩展 `Comparable<T>`，但是 T 的 Comparable 消费 T 实例（并生成指示顺序关系的整数）。因此，将参数化类型 `Comparable<T>` 替换为有界通配符类型 `Comparable<? super T>`，Comparables 始终是消费者，所以一般应**优先使用 `Comparable<? super T>` 而不是 `Comparable<T>`**，比较器也是如此；因此，通常应该**优先使用 `Comparator<? super T>` 而不是 `Comparator<T>`。**

The revised max declaration is probably the most complex method declaration in this book. Does the added complexity really buy you anything? Again, it does. Here is a simple example of a list that would be excluded by the original declaration but is permitted by the revised one:

> 修订后的 max 声明可能是本书中最复杂的方法声明。增加的复杂性真的能给你带来什么好处吗？是的，它再次生效。下面是一个简单的列表案例，它在原来的声明中不允许使用，但经订正的声明允许：

```java
List<ScheduledFuture<?>> scheduledFutures = ... ;
```

The reason that you can’t apply the original method declaration to this list is that ScheduledFuture does not implement `Comparable<ScheduledFuture>`. Instead, it is a subinterface of Delayed, which extends `Comparable<Delayed>`. In other words, a ScheduledFuture instance isn’t merely comparable to other ScheduledFuture instances; it is comparable to any Delayed instance, and that’s enough to cause the original declaration to reject it. More generally, the wildcard is required to support types that do not implement Comparable (or Comparator) directly but extend a type that does.

> 不能将原始方法声明应用于此列表的原因是 ScheduledFuture 没有实现 `Comparable<ScheduledFuture>`。相反，它是 Delayed 的一个子接口，扩展了 `Comparable<Delayed>`。换句话说，ScheduledFuture 的实例不仅仅可以与其他 ScheduledFuture 实例进行比较；它可以与任何 Delayed 实例相比较，这足以导致初始声明时被拒绝。更通俗来说，通配符用于支持不直接实现 Comparable（或 Comparator）但扩展了实现 Comparable（或 Comparator）的类型的类型。

There is one more wildcard-related topic that bears discussing. There is a duality（n. 二元性） between type parameters and wildcards, and many methods can be declared using one or the other. For example, here are two possible declarations for a static method to swap two indexed items in a list. The first uses an unbounded type parameter (Item 30) and the second an unbounded wildcard:

> 还有一个与通配符相关的主题值得讨论。类型参数和通配符之间存在对偶性，可以使用其中一种方法声明许多方法。例如，下面是静态方法的两种可能声明，用于交换列表中的两个索引项。第一个使用无界类型参数（Item-30），第二个使用无界通配符：

```java
// Two possible declarations for the swap method
public static <E> void swap(List<E> list, int i, int j);
public static void swap(List<?> list, int i, int j);
```

Which of these two declarations is preferable, and why? In a public API, the second is better because it’s simpler. You pass in a list—any list—and the method swaps the indexed elements. There is no type parameter to worry about. As a rule, **if a type parameter appears only once in a method declaration, replace it with a wildcard.** If it’s an unbounded type parameter, replace it with an unbounded wildcard; if it’s a bounded type parameter, replace it with a bounded wildcard.

> 这两个声明中哪个更好，为什么？在公共 API 中第二个更好，因为它更简单。传入一个列表（任意列表），该方法交换索引元素。不需要担心类型参数。通常，如果类型参数在方法声明中只出现一次，则用通配符替换它。**如果它是一个无界类型参数，用一个无界通配符替换它；** 如果它是有界类型参数，则用有界通配符替换它。

There’s one problem with the second declaration for swap. The straightforward implementation won’t compile:

> 交换的第二个声明有一个问题。这个简单的实现无法编译：

```java
public static void swap(List<?> list, int i, int j) {
  list.set(i, list.set(j, list.get(i)));
}
```

Trying to compile it produces this less-than-helpful error message:

> 试图编译它会产生一个不太有用的错误消息：

```java
Swap.java:5: error: incompatible types: Object cannot be
converted to CAP#1
list.set(i, list.set(j, list.get(i)));
^ where CAP#1
is a fresh type-variable: CAP#1 extends Object from capture of ?
```

It doesn’t seem right that we can’t put an element back into the list that we just took it out of. The problem is that the type of list is `List<?>`, and you can’t put any value except null into a `List<?>`. Fortunately, there is a way to implement this method without resorting to an unsafe cast or a raw type. The idea is to write a private helper method to capture the wildcard type. The helper method must be a generic method in order to capture the type. Here’s how it looks:

> 我们不能把一个元素放回刚刚取出的列表中，这看起来是不正确的。问题是 list 的类型是 `List<?>`，你不能在 `List<?>` 中放入除 null 以外的任何值。幸运的是，有一种方法可以实现，而无需求助于不安全的强制转换或原始类型。其思想是编写一个私有助手方法来捕获通配符类型。为了捕获类型，helper 方法必须是泛型方法。它看起来是这样的：

```java
public static void swap(List<?> list, int i, int j) {
  swapHelper(list, i, j);
}
// Private helper method for wildcard capture
private static <E> void swapHelper(List<E> list, int i, int j) {
  list.set(i, list.set(j, list.get(i)));
}
```

The swapHelper method knows that list is a `List<E>`. Therefore, it knows that any value it gets out of this list is of type E and that it’s safe to put any value of type E into the list. This slightly convoluted implementation of swap compiles cleanly. It allows us to export the nice wildcard-based declaration, while taking advantage of the more complex generic method internally. Clients of the swap method don’t have to confront the more complex swapHelper declaration, but they do benefit from it. It is worth noting that the helper method has precisely the signature that we dismissed as too complex for the public method.

> swapHelper 方法知道 list 是一个 `List<E>`。因此，它知道它从这个列表中得到的任何值都是 E 类型的，并且将 E 类型的任何值放入这个列表中都是安全的。这个稍微复杂的实现能够正确编译。它允许我们导出基于 通配符的声明，同时在内部利用更复杂的泛型方法。swap 方法的客户端不必面对更复杂的 swapHelper 声明，但它们确实从中受益。值得注意的是，helper 方法具有我们认为对于公共方法过于复杂而忽略的签名。

In summary, using wildcard types in your APIs, while tricky, makes the APIs far more flexible. If you write a library that will be widely used, the proper use of wildcard types should be considered mandatory. Remember the basic rule: producer-extends, consumer-super (PECS). Also remember that all comparables and comparators are consumers.

> 总之，在 API 中使用通配符类型虽然很棘手，但可以使其更加灵活。如果你编写的库将被广泛使用，则必须考虑通配符类型的正确使用。记住基本规则：生产者使用 extends，消费者使用 super（PECS）。还要记住，所有的 comparable 和 comparator 都是消费者。

---

## 【32】明智地合用泛型和可变参数

> Combine generics and varargs judiciously

Varargs methods (Item 53) and generics were both added to the platform in Java 5, so you might expect them to interact gracefully; sadly, they do not. The purpose of varargs is to allow clients to pass a variable number of arguments to a method, but it is a leaky（adj. 漏的；有漏洞的） abstraction: when you invoke a varargs method, an array is created to hold the varargs parameters; that array, which should be an implementation detail, is visible. As a consequence, you get confusing compiler warnings when varargs parameters have generic or parameterized types.

> 可变参数方法（Item-53）和泛型都是在 Java 5 中添加的，因此你可能认为它们能够优雅地交互；可悲的是，他们并不能。可变参数的目的是允许客户端向方法传递可变数量的参数，但这是一个漏洞百出的抽象概念：当你调用可变参数方法时，将创建一个数组来保存参数；该数组的实现细节应该是可见的。因此，当可变参数具有泛型或参数化类型时，会出现令人困惑的编译器警告。

Recall from Item 28 that a non-reifiable type is one whose runtime representation（n. 代表；表现；表示法；陈述） has less information than its compile-time representation, and that nearly all generic and parameterized types are non-reifiable. If a method declares its varargs parameter to be of a non-reifiable type, the compiler generates a warning on the declaration. If the method is invoked on varargs parameters whose inferred（adj. 推论的；推测出的） type is non-reifiable, the compiler generates a warning on the invocation too. The warnings look something like this:

> 回想一下 Item-28，非具体化类型是指其运行时表示的信息少于其编译时表示的信息，并且几乎所有泛型和参数化类型都是不可具体化的。如果方法声明其可变参数为不可具体化类型，编译器将在声明上生成警告。如果方法是在其推断类型不可具体化的可变参数上调用的，编译器也会在调用时生成警告。生成的警告就像这样：

```java
warning: [unchecked] Possible heap pollution from parameterized vararg type List<String>
```

Heap pollution occurs when a variable of a parameterized type refers to an object that is not of that type [JLS, 4.12.2]. It can cause the compiler’s automatically generated casts to fail, violating the fundamental guarantee of the generic type system.

> 当参数化类型的变量引用不属于该类型的对象时，就会发生堆污染[JLS, 4.12.2]。它会导致编译器自动生成的强制类型转换失败，违反泛型类型系统的基本保证。

For example, consider this method, which is a thinly disguised（伪装的） variant of the code fragment（n. 碎片；片段或不完整部分） on page 127:

> 例如，考虑这个方法，它摘自 127 页（Item-26）的代码片段，但做了些修改：

```java
// Mixing generics and varargs can violate type safety!
// 泛型和可变参数混合使用可能违反类型安全原则！
static void dangerous(List<String>... stringLists) {
    List<Integer> intList = List.of(42);
    Object[] objects = stringLists;
    objects[0] = intList; // Heap pollution
    String s = stringLists[0].get(0); // ClassCastException
}
```

This method has no visible casts yet throws a ClassCastException when invoked with one or more arguments. Its last line has an invisible cast that is generated by the compiler. This cast fails, demonstrating that type safety has been compromised, and **it is unsafe to store a value in a generic varargs array parameter.**

> 此方法没有显式的强制类型转换，但在使用一个或多个参数调用时抛出 ClassCastException。它的最后一行有一个由编译器生成的隐式强制转换。此转换失败，表明类型安全性受到了影响，并且**在泛型可变参数数组中存储值是不安全的。**

This example raises an interesting question: Why is it even legal to declare a method with a generic varargs parameter, when it is illegal to create a generic array explicitly? In other words, why does the method shown previously generate only a warning, while the code fragment on page 127 generates an error? The answer is that methods with varargs parameters of generic or parameterized types can be very useful in practice, so the language designers opted to live with this inconsistency. In fact, the Java libraries export several such methods, including `Arrays.asList(T... a)`, `Collections.addAll(Collection<? super T> c, T... elements)`, and `EnumSet.of(E first, E... rest)`. Unlike the dangerous method shown earlier, these library methods are typesafe.

> 这个例子提出了一个有趣的问题：为什么使用泛型可变参数声明方法是合法的，而显式创建泛型数组是非法的？换句话说，为什么前面显示的方法只生成警告，而 127 页上的代码片段发生错误？答案是，带有泛型或参数化类型的可变参数的方法在实际开发中非常有用，因此语言设计人员选择忍受这种不一致性。事实上，Java 库导出了几个这样的方法，包括 `Arrays.asList(T... a)`、`Collections.addAll(Collection<? super T> c, T... elements)` 以及 `EnumSet.of(E first, E... rest)`。它们与前面显示的危险方法不同，这些库方法是类型安全的。

Prior to Java 7, there was nothing the author of a method with a generic varargs parameter could do about the warnings at the call sites. This made these APIs unpleasant to use. Users had to put up with the warnings or, preferably, to eliminate them with @SuppressWarnings("unchecked") annotations at every call site (Item 27). This was tedious, harmed readability, and hid warnings that flagged real issues.

> 在 Java 7 之前，使用泛型可变参数的方法的作者对调用点上产生的警告无能为力。使得这些 API 难以使用。用户必须忍受这些警告，或者在每个调用点（Item-27）使用 @SuppressWarnings("unchecked") 注释消除这些警告。这种做法乏善可陈，既损害了可读性，也忽略了标记实际问题的警告。

In Java 7, the SafeVarargs annotation was added to the platform, to allow the author of a method with a generic varargs parameter to suppress client warnings automatically. In essence, **the SafeVarargs annotation constitutes a promise by the author of a method that it is typesafe.** In exchange for this promise, the compiler agrees not to warn the users of the method that calls may be unsafe.

> 在 Java 7 中添加了 SafeVarargs 注释，以允许使用泛型可变参数的方法的作者自动抑制客户端警告。本质上，**SafeVarargs 注释构成了方法作者的一个承诺，即该方法是类型安全的。** 作为这个承诺的交换条件，编译器同意不对调用可能不安全的方法的用户发出警告。

It is critical that you do not annotate a method with @SafeVarargs unless it actually is safe. So what does it take to ensure this? Recall that a generic array is created when the method is invoked, to hold the varargs parameters. If the method doesn’t store anything into the array (which would overwrite the parameters) and doesn’t allow a reference to the array to escape (which would enable untrusted code to access the array), then it’s safe. In other words, if the varargs parameter array is used only to transmit a variable number of arguments from the caller to the method—which is, after all, the purpose of varargs—then the method is safe.

> 关键问题是，使用 @SafeVarargs 注释方法，该方法实际上应该是安全的。那么怎样才能确保这一点呢？回想一下，在调用该方法时创建了一个泛型数组来保存可变参数。如果方法没有将任何内容存储到数组中（这会覆盖参数），并且不允许对数组的引用进行转义（这会使不受信任的代码能够访问数组），那么它就是安全的。换句话说，如果可变参数数组仅用于将可变数量的参数从调用方传输到方法（毕竟这是可变参数的目的），那么该方法是安全的。

It is worth noting that you can violate type safety without ever storing anything in the varargs parameter array. Consider the following generic varargs method, which returns an array containing its parameters. At first glance, it may look like a handy little utility:

> 值得注意的是，在可变参数数组中不存储任何东西就可能违反类型安全性。考虑下面的通用可变参数方法，它返回一个包含参数的数组。乍一看，它似乎是一个方便的小实用程序：

```java
// UNSAFE - Exposes a reference to its generic parameter array!
static <T> T[] toArray(T... args) {
  return args;
}
```

This method simply returns its varargs parameter array. The method may not look dangerous, but it is! The type of this array is determined by the compiletime types of the arguments passed in to the method, and the compiler may not have enough information to make an accurate determination. Because this method returns its varargs parameter array, it can propagate heap pollution up the call stack.

> 这个方法只是返回它的可变参数数组。这种方法看起来并不危险，但确实危险！这个数组的类型由传递给方法的参数的编译时类型决定，编译器可能没有足够的信息来做出准确的决定。因为这个方法返回它的可变参数数组，所以它可以将堆污染传播到调用堆栈上。

To make this concrete, consider the following generic method, which takes three arguments of type T and returns an array containing two of the arguments, chosen at random:

> 为了使其具体化，请考虑下面的泛型方法，该方法接受三个类型为 T 的参数，并返回一个包含随机选择的两个参数的数组：

```java
static <T> T[] pickTwo(T a, T b, T c) {
  switch(ThreadLocalRandom.current().nextInt(3)) {
    case 0: return toArray(a, b);
    case 1: return toArray(a, c);
    case 2: return toArray(b, c);
  }
  throw new AssertionError(); // Can't get here
}
```

This method is not, in and of itself, dangerous and would not generate a warning except that it invokes the toArray method, which has a generic varargs parameter.

> 这个方法本身并不危险，并且不会生成警告，除非它调用 toArray 方法，该方法有一个通用的可变参数。

When compiling this method, the compiler generates code to create a varargs parameter array in which to pass two T instances to toArray. This code allocates an array of type Object[], which is the most specific type that is guaranteed to hold these instances, no matter what types of objects are passed to pickTwo at the call site. The toArray method simply returns this array to pickTwo, which in turn returns it to its caller, so pickTwo will always return an array of type Object[].

> 编译此方法时，编译器生成代码来创建一个可变参数数组，在该数组中向 toArray 传递两个 T 实例。这段代码分配了 type Object[] 的一个数组，这是保证保存这些实例的最特定的类型，无论调用站点上传递给 pickTwo 的是什么类型的对象。toArray 方法只是将这个数组返回给 pickTwo，而 pickTwo 又将这个数组返回给它的调用者，所以 pickTwo 总是返回一个 Object[] 类型的数组。

Now consider this main method, which exercises pickTwo:

> 现在考虑这个主要方法，练习 pickTwo：

```java
public static void main(String[] args) {
  String[] attributes = pickTwo("Good", "Fast", "Cheap");
}
```

There is nothing at all wrong with this method, so it compiles without generating any warnings. But when you run it, it throws a ClassCastException, though it contains no visible casts. What you don’t see is that the compiler has generated a hidden cast to String[] on the value returned by pickTwo so that it can be stored in attributes. The cast fails, because Object[] is not a subtype of String[]. This failure is quite disconcerting because it is two levels removed from the method that actually causes the heap pollution (toArray), and the varargs parameter array is not modified after the actual parameters are stored in it.

> 这个方法没有任何错误，因此它在编译时不会生成任何警告。但是当你运行它时，它会抛出 ClassCastException，尽管它不包含可见的强制类型转换。你没有看到的是，编译器在 pickTwo 返回的值上生成了一个隐藏的 String[] 转换，这样它就可以存储在属性中。转换失败，因为 Object[] 不是 String[] 的子类型。这个失败非常令人不安，因为它是从方法中删除了两个导致堆污染的级别（toArray），并且可变参数数组在实际参数存储在其中之后不会被修改。

This example is meant to drive home the point that **it is unsafe to give another method access to a generic varargs parameter array,** with two exceptions: it is safe to pass the array to another varargs method that is correctly annotated with @SafeVarargs, and it is safe to pass the array to a non-varargs method that merely computes some function of the contents of the array.

> 这个示例的目的是让人明白，**让另一个方法访问泛型可变参数数组是不安全的**，只有两个例外：将数组传递给另一个使用 @SafeVarargs 正确注释的可变参数方法是安全的，将数组传递给仅计算数组内容的某个函数的非可变方法也是安全的。

Here is a typical example of a safe use of a generic varargs parameter. This method takes an arbitrary number of lists as arguments and returns a single list containing the elements of all of the input lists in sequence. Because the method is annotated with @SafeVarargs, it doesn’t generate any warnings, on the declaration or at its call sites:

> 下面是一个安全使用泛型可变参数的典型示例。该方法接受任意数量的列表作为参数，并返回一个包含所有输入列表的元素的序列列表。因为该方法是用 @SafeVarargs 注释的，所以它不会在声明或调用点上生成任何警告：

```java
// Safe method with a generic varargs parameter
@SafeVarargs
static <T> List<T> flatten(List<? extends T>... lists) {
  List<T> result = new ArrayList<>();
  for (List<? extends T> list : lists)
    result.addAll(list);
  return result;
}
```

The rule for deciding when to use the SafeVarargs annotation is simple: **Use @SafeVarargs on every method with a varargs parameter of a generic or parameterized type,** so its users won’t be burdened by needless and confusing compiler warnings. This implies that you should never write unsafe varargs methods like dangerous or toArray. Every time the compiler warns you of possible heap pollution from a generic varargs parameter in a method you control, check that the method is safe. As a reminder, a generic varargs methods is safe if:

> 决定何时使用 SafeVarargs 注释的规则很简单：**在每个带有泛型或参数化类型的可变参数的方法上使用 @SafeVarargs**，这样它的用户就不会被不必要的和令人困惑的编译器警告所困扰。这意味着你永远不应该编写像 dangerous 或 toArray 这样不安全的可变参数方法。每当编译器警告你控制的方法中的泛型可变参数可能造成堆污染时，请检查该方法是否安全。提醒一下，一个通用的可变参数方法是安全的，如果：

1. it doesn’t store anything in the varargs parameter array, and

> 它没有在可变参数数组中存储任何东西，并且

2. it doesn’t make the array (or a clone) visible to untrusted code. If either of
   these prohibitions is violated, fix it.

> 它不会让数组（或者其副本）出现在不可信的代码中。如果违反了这些禁令中的任何一条，就纠正它。

Note that the SafeVarargs annotation is legal only on methods that can’t be overridden, because it is impossible to guarantee that every possible overriding method will be safe. In Java 8, the annotation was legal only on static methods and final instance methods; in Java 9, it became legal on private instance methods as well.

> 请注意，SafeVarargs 注释仅对不能覆盖的方法合法，因为不可能保证所有可能覆盖的方法都是安全的。在 Java 8 中，注释仅对静态方法和最终实例方法合法；在 Java 9 中，它在私有实例方法上也成为合法的。

An alternative to using the SafeVarargs annotation is to take the advice of Item 28 and replace the varargs parameter (which is an array in disguise) with a List parameter. Here’s how this approach looks when applied to our flatten method. Note that only the parameter declaration has changed:

> 使用 SafeVarargs 注释的另一种选择是接受 Item-28 的建议，并用 List 参数替换可变参数（它是一个伪装的数组）。下面是将这种方法应用到我们的 flatten 方法时的效果。注意，只有参数声明发生了更改：

```java
// List as a typesafe alternative to a generic varargs parameter
static <T> List<T> flatten(List<List<? extends T>> lists) {
  List<T> result = new ArrayList<>();
  for (List<? extends T> list : lists)
    result.addAll(list);
  return result;
}
```

This method can then be used in conjunction with the static factory method List.of to allow for a variable number of arguments. Note that this approach relies on the fact that the List.of declaration is annotated with @SafeVarargs:

> 然后可以将此方法与静态工厂方法 List.of 一起使用，以允许可变数量的参数。注意，这种方法依赖于 List.of 声明是用 @SafeVarargs 注释的：

```java
audience = flatten(List.of(friends, romans, countrymen));
```

The advantage of this approach is that the compiler can prove that the method is typesafe. You don’t have to vouch for its safety with a SafeVarargs annotation, and you don’t have worry that you might have erred in determining that it was safe. The main disadvantage is that the client code is a bit more verbose and may be a bit slower.

> 这种方法的优点是编译器可以证明该方法是类型安全的。你不必使用 SafeVarargs 注释来保证它的安全性，也不必担心在确定它的安全性时可能出错。主要的缺点是客户端代码比较冗长，可能会比较慢。

This trick can also be used in situations where it is impossible to write a safe varargs method, as is the case with the toArray method on page 147. Its List analogue is the List.of method, so we don’t even have to write it; the Java libraries authors have done the work for us. The pickTwo method then becomes this:

> 这种技巧也可用于无法编写安全的可变参数方法的情况，如第 147 页中的 toArray 方法。它的列表类似于 List.of 方法，我们甚至不用写；Java 库的作者为我们做了这些工作。pickTwo 方法变成这样：

```java
static <T> List<T> pickTwo(T a, T b, T c) {
  switch(rnd.nextInt(3)) {
    case 0: return List.of(a, b);
    case 1: return List.of(a, c);
    case 2: return List.of(b, c);
  }
  throw new AssertionError();
}
```

and the main method becomes this:

> main 方法是这样的：

```java
public static void main(String[] args) {
  List<String> attributes = pickTwo("Good", "Fast", "Cheap");
}
```

The resulting code is typesafe because it uses only generics, and not arrays.

> 生成的代码是类型安全的，因为它只使用泛型，而不使用数组。

In summary, varargs and generics do not interact well because the varargs facility is a leaky abstraction built atop arrays, and arrays have different type rules from generics. Though generic varargs parameters are not typesafe, they are legal. If you choose to write a method with a generic (or parameterized) varargs parameter, first ensure that the method is typesafe, and then annotate it with @SafeVarargs so it is not unpleasant to use.

> 总之，可变参数方法和泛型不能很好地交互，因为可变参数工具是构建在数组之上的漏洞抽象，并且数组具有与泛型不同的类型规则。虽然泛型可变参数不是类型安全的，但它们是合法的。如果选择使用泛型（或参数化）可变参数编写方法，首先要确保该方法是类型安全的，然后使用 @SafeVarargs 对其进行注释，这样使用起来就不会令人不愉快。

---

## 【33】考虑类型安全的异构容器

> Consider typesafe heterogeneous containers

Common uses of generics include collections, such as `Set<E>` and `Map<K,V>`, and single-element containers, such as `ThreadLocal<T>` and `AtomicReference<T>`. In all of these uses, it is the container that is parameterized. This limits you to a fixed number of type parameters per container. Normally that is exactly what you want. A Set has a single type parameter, representing its element type; a Map has two, representing its key and value types; and so forth.

> 集合是泛型的常见应用之一，如 `Set<E>` 和 `Map<K,V>`，以及单元素容器，如 `ThreadLocal<T>` 和 `AtomicReference<T>`。在所有这些应用中，都是参数化的容器。这将每个容器的类型参数限制为固定数量。通常这正是你想要的。Set 只有一个类型参数，表示其元素类型；Map 有两个，表示`键`和`值`的类型；如此等等。

Sometimes, however, you need more flexibility. For example, a database row can have arbitrarily many columns, and it would be nice to be able to access all of them in a typesafe manner. Luckily, there is an easy way to achieve this effect. The idea is to parameterize the key instead of the container. Then present the parameterized key to the container to insert or retrieve a value. The generic type system is used to guarantee that the type of the value agrees with its key.

> 然而，有时你需要更大的灵活性。例如，一个数据库行可以有任意多列，能够以类型安全的方式访问所有这些列是很好的。幸运的是，有一种简单的方法可以达到这种效果。其思想是参数化`键`而不是容器。然后向容器提供参数化`键`以插入或检索`值`。泛型类型系统用于确保`值`的类型与`键`一致。

As a simple example of this approach, consider a Favorites class that allows its clients to store and retrieve a favorite instance of arbitrarily many types. The Class object for the type will play the part of the parameterized key. The reason this works is that class Class is generic. The type of a class literal is not simply Class, but `Class<T>`. For example, String.class is of type `Class<String>`, and Integer.class is of type `Class<Integer>`. When a class literal is passed among methods to communicate both compiletime and runtime type information, it is called a type token [Bracha04].

> 作为这种方法的一个简单示例，考虑一个 Favorites 类，它允许客户端存储和检索任意多种类型的 Favorites 实例。Class 类的对象将扮演参数化`键`的角色。这样做的原因是 Class 类是泛型的。Class 对象的类型不仅仅是 Class，而是 `Class<T>`。例如，String.class 的类型为 `Class<String>`、Integer.class 的类型为 `Class<Integer>`。在传递编译时和运行时类型信息的方法之间传递类 Class 对象时，它被称为类型标记[Bracha04]。

The API for the Favorites class is simple. It looks just like a simple map, except that the key is parameterized instead of the map. The client presents a Class object when setting and getting favorites. Here is the API:

> Favorites 类的 API 很简单。它看起来就像一个简单的 Map，只不过`键`是参数化的，而不是整个 Map。客户端在设置和获取 Favorites 实例时显示一个 Class 对象。以下是 API:

```java
// Typesafe heterogeneous container pattern - API
public class Favorites {
    public <T> void putFavorite(Class<T> type, T instance);
    public <T> T getFavorite(Class<T> type);
}
```

Here is a sample program that exercises the Favorites class, storing, retrieving, and printing a favorite String, Integer, and Class instance:

> 下面是一个示例程序，它演示了 Favorites 类、存储、检索和打印 Favorites 字符串、整数和 Class 实例：

```java
// Typesafe heterogeneous container pattern - client
public static void main(String[] args) {
    Favorites f = new Favorites();
    f.putFavorite(String.class, "Java");
    f.putFavorite(Integer.class, 0xcafebabe);
    f.putFavorite(Class.class, Favorites.class);
    String favoriteString = f.getFavorite(String.class);
    int favoriteInteger = f.getFavorite(Integer.class);
    Class<?> favoriteClass = f.getFavorite(Class.class);
    System.out.printf("%s %x %s%n", favoriteString,favoriteInteger, favoriteClass.getName());
}
```

As you would expect, this program prints Java cafebabe Favorites. Note, incidentally, that Java’s printf method differs from C’s in that you should use %n where you’d use \n in C. The %n generates the applicable platform-specific line separator, which is \n on many but not all platforms.

> 如你所料，这个程序打印 Java cafebabe Favorites。顺便提醒一下，Java 的 printf 方法与 C 的不同之处在于，你应该在 C 中使用 \n 的地方改用 %n。

**译注：`favoriteClass.getName()` 的打印结果与 Favorites 类所在包名有关，结果应为：包名.Favorites**

A Favorites instance is typesafe: it will never return an Integer when you ask it for a String. It is also heterogeneous: unlike an ordinary map, all the keys are of different types. Therefore, we call Favorites a typesafe heterogeneous container.

> Favorites 的实例是类型安全的：当你向它请求一个 String 类型时，它永远不会返回一个 Integer 类型。它也是异构的：与普通 Map 不同，所有`键`都是不同类型的。因此，我们将 Favorites 称为一个类型安全异构容器。

The implementation of Favorites is surprisingly tiny. Here it is, in its entirety:

> Favorites 的实现非常简短。下面是全部内容：

```java
// Typesafe heterogeneous container pattern - implementation
public class Favorites {
  private Map<Class<?>, Object> favorites = new HashMap<>();

  public <T> void putFavorite(Class<T> type, T instance) {
    favorites.put(Objects.requireNonNull(type), instance);
  }

  public <T> T getFavorite(Class<T> type) {
    return type.cast(favorites.get(type));
  }
}
```

There are a few subtle things going on here. Each Favorites instance is backed by a private `Map<Class<?>, Object>` called favorites. You might think that you couldn’t put anything into this Map because of the unbounded wildcard type, but the truth is quite the opposite. The thing to notice is that the wildcard type is nested: it’s not the type of the map that’s a wildcard type but the type of its key. This means that every key can have a different parameterized type: one can be `Class<String>`, the next `Class<Integer>`, and so on. That’s where the heterogeneity comes from.

> 这里发生了一些微妙的事情。每个 Favorites 实例都由一个名为 favorites 的私有 `Map<Class<?>, Object>` 支持。你可能认为由于通配符类型是无界的，所以无法将任何内容放入此映射中，但事实恰恰相反。需要注意的是，通配符类型是嵌套的：通配符类型不是 Map 的类型，而是`键`的类型。这意味着每个`键`都可以有不同的参数化类型：一个可以是 `Class<String>`，下一个是 `Class<Integer>`，等等。这就是异构的原理。

The next thing to notice is that the value type of the favorites Map is simply Object. In other words, the Map does not guarantee the type relationship between keys and values, which is that every value is of the type represented by its key. In fact, Java’s type system is not powerful enough to express this. But we know that it’s true, and we take advantage of it when the time comes to retrieve a favorite.

> 接下来要注意的是 favorites 的`值`类型仅仅是 Object。换句话说，Map 不保证`键`和`值`之间的类型关系，即每个`值`都是其`键`所表示的类型。实际上，Java 的类型系统还没有强大到足以表达这一点。但是我们知道这是事实，当需要检索一个 favorite 时，我们会利用它。

The putFavorite implementation is trivial: it simply puts into favorites a mapping from the given Class object to the given favorite instance. As noted, this discards the “type linkage” between the key and the value; it loses the knowledge that the value is an instance of the key. But that’s OK, because the getFavorites method can and does reestablish this linkage.

> putFavorite 的实现很简单：它只是将从给定 Class 对象到给定 Favorites 实例的放入 favorites 中。如前所述，这将丢弃`键`和`值`之间的「类型关联」；将无法确定`值`是`键`的实例。但这没关系，因为 getFavorites 方法可以重新建立这个关联。

The implementation of getFavorite is trickier than that of putFavorite. First, it gets from the favorites map the value corresponding to the given Class object. This is the correct object reference to return, but it has the wrong compile-time type: it is Object (the value type of the favorites map) and we need to return a T. So, the getFavorite implementation dynamically casts the object reference to the type represented by the Class object, using Class’s cast method.

> getFavorite 的实现比 putFavorite 的实现更复杂。首先，它从 favorites 中获取与给定 Class 对象对应的`值`。这是正确的对象引用返回，但它有错误的编译时类型：它是 Object（favorites 的`值`类型），我们需要返回一个 T。因此，getFavorite 的实现通过使用 Class 的 cast 方法，将对象引用类型动态转化为所代表的 Class 对象。

The cast method is the dynamic analogue of Java’s cast operator. It simply checks that its argument is an instance of the type represented by the Class object. If so, it returns the argument; otherwise it throws a ClassCastException. We know that the cast invocation in getFavorite won’t throw ClassCastException, assuming the client code compiled cleanly. That is to say, we know that the values in the favorites map always match the types of their keys.

> cast 方法是 Java 的 cast 运算符的动态模拟。它只是检查它的参数是否是类对象表示的类型的实例。如果是，则返回参数；否则它将抛出 ClassCastException。我们知道 getFavorite 中的强制转换调用不会抛出 ClassCastException，假设客户端代码已正确地编译。也就是说，我们知道 favorites 中的`值`总是与其`键`的类型匹配。

So what does the cast method do for us, given that it simply returns its argument? The signature of the cast method takes full advantage of the fact that class Class is generic. Its return type is the type parameter of the Class object:

> 如果 cast 方法只是返回它的参数，那么它会为我们做什么呢？cast 方法的签名充分利用了 Class 类是泛型的这一事实。其返回类型为 Class 对象的类型参数：

```java
public class Class<T> {
    T cast(Object obj);
}
```

This is precisely what’s needed by the getFavorite method. It is what allows us to make Favorites typesafe without resorting to an unchecked cast to T.

> 这正是 getFavorite 方法所需要的。它使我们能够使 Favorites 类型安全，而不需要对 T 进行 unchecked 的转换。

There are two limitations to the Favorites class that are worth noting. First, a malicious client could easily corrupt the type safety of a Favorites instance, by using a Class object in its raw form. But the resulting client code would generate an unchecked warning when it was compiled. This is no different from a normal collection implementations such as HashSet and HashMap. You can easily put a String into a `HashSet<Integer>` by using the raw type HashSet (Item 26). That said, you can have runtime type safety if you’re willing to pay for it. The way to ensure that Favorites never violates its type invariant is to have the putFavorite method check that instance is actually an instance of the type represented by type, and we already know how to do this. Just use a dynamic cast:

> Favorites 类有两个`值`得注意的限制。首先，恶意客户端很容易通过使用原始形式的类对象破坏 Favorites 实例的类型安全。但是生成的客户端代码在编译时将生成一个 unchecked 警告。这与普通的集合实现（如 HashSet 和 HashMap）没有什么不同。通过使用原始类型 HashSet（Item-26），可以轻松地将 String 类型放入 `HashSet<Integer>` 中。也就是说，如果你愿意付出代价的话，你可以拥有运行时类型安全。确保 Favorites 不会违反其类型不变量的方法是让 putFavorite 方法检查实例是否是 type 表示的类型的实例，我们已经知道如何做到这一点。只需使用动态转换：

```java
// Achieving runtime type safety with a dynamic cast
public <T> void putFavorite(Class<T> type, T instance) {
    favorites.put(type, type.cast(instance));
}
```

There are collection wrappers in java.util.Collections that play the same trick. They are called checkedSet, checkedList, checkedMap, and so forth. Their static factories take a Class object (or two) in addition to a collection (or map). The static factories are generic methods, ensuring that the compile-time types of the Class object and the collection match. The wrappers add reification to the collections they wrap. For example, the wrapper throws a ClassCastException at runtime if someone tries to put a Coin into your `Collection<Stamp>`. These wrappers are useful for tracking down client code that adds an incorrectly typed element to a collection, in an application that mixes generic and raw types.

> java.util.Collections 中的集合包装器也具有相同的功能。它们被称为 checkedSet、checkedList、checkedMap，等等。除了集合（或 Map）外，它们的静态工厂还接受一个（或两个）Class 对象。静态工厂是通用方法，确保 Class 对象和集合的编译时类型匹配。包装器将具体化添加到它们包装的集合中。例如，如果有人试图将 Coin 放入 `Collection<Stamp>` 中，包装器将在运行时抛出 ClassCastException。在混合了泛型类型和原始类型的应用程序中，这些包装器对跟踪将类型错误的元素添加到集合中的客户端代码非常有用。

The second limitation of the Favorites class is that it cannot be used on a non-reifiable type (Item 28). In other words, you can store your favorite String or String[], but not your favorite `List<String>`. If you try to store your favorite `List<String>`, your program won’t compile. The reason is that you can’t get a Class object for `List<String>`. The class literal `List<String>.class` is a syntax error, and it’s a good thing, too. `List<String>` and `List<Integer>` share a single Class object, which is List.class. It would wreak havoc with the internals of a Favorites object if the “type literals” `List<String>.class` and `List<Integer>.class` were legal and returned the same object reference. There is no entirely satisfactory workaround for this limitation.

> Favorites 类的第二个限制是它不能用于不可具体化的类型（Item-28）。换句话说，你可以存储的 Favorites 实例类型为 String 类型或 String[]，但不能存储 `List<String>`。原因是你不能为 `List<String>` 获取 Class 对象，`List<String>.class` 是一个语法错误，这也是一件好事。`List<String>` 和 `List<Integer>` 共享一个 Class 对象，即 List.class。如果「字面类型」`List<String>.class` 和 `List<Integer>.class` 是合法的，并且返回相同的对象引用，那么它将严重破坏 Favorites 对象的内部结构。对于这个限制，没有完全令人满意的解决方案。

The type tokens used by Favorites are unbounded: getFavorite and put-Favorite accept any Class object. Sometimes you may need to limit the types that can be passed to a method. This can be achieved with a bounded type token, which is simply a type token that places a bound on what type can be represented, using a bounded type parameter (Item 30) or a bounded wildcard (Item 31).

> Favorites 使用的类型标记是无界的：getFavorite 和 put-Favorite 接受任何 Class 对象。有时你可能需要限制可以传递给方法的类型。这可以通过有界类型标记来实现，它只是一个类型标记，使用有界类型参数（Item-30）或有界通配符（Item-31）对可以表示的类型进行绑定。

The annotations API (Item 39) makes extensive use of bounded type tokens. For example, here is the method to read an annotation at runtime. This method comes from the AnnotatedElement interface, which is implemented by the reflective types that represent classes, methods, fields, and other program elements:

> annotation API（Item-39）广泛使用了有界类型标记。例如，下面是在运行时读取注释的方法。这个方法来自 AnnotatedElement 接口，它是由表示类、方法、字段和其他程序元素的反射类型实现的：

```java
public <T extends Annotation>
    T getAnnotation(Class<T> annotationType);
```

The argument, annotationType, is a bounded type token representing an annotation type. The method returns the element’s annotation of that type, if it has one, or null, if it doesn’t. In essence, an annotated element is a typesafe heterogeneous container whose keys are annotation types.

> 参数 annotationType 是表示注释类型的有界类型标记。该方法返回该类型的元素注释（如果有的话），或者返回 null（如果没有的话）。本质上，带注释的元素是一个类型安全的异构容器，其`键`是注释类型。

Suppose you have an object of type `Class<?>` and you want to pass it to a method that requires a bounded type token, such as getAnnotation. You could cast the object to `Class<? extends Annotation>`, but this cast is unchecked, so it would generate a compile-time warning (Item 27). Luckily, class Class provides an instance method that performs this sort of cast safely (and dynamically). The method is called asSubclass, and it casts the Class object on which it is called to represent a subclass of the class represented by its argument. If the cast succeeds, the method returns its argument; if it fails, it throws a ClassCastException.

> 假设你有一个 `Class<?>` 类型的对象，并且希望将其传递给一个需要有界类型令牌（例如 getAnnotation）的方法。你可以将对象强制转换为 `Class<? extends Annotation>`，但是这个强制转换是未选中的，因此它将生成一个编译时警告（Item-27）。幸运的是，class 类提供了一个实例方法，可以安全地（动态地）执行这种类型的强制转换。该方法称为 asSubclass，它将类对象强制转换为它所调用的类对象，以表示由其参数表示的类的子类。如果转换成功，则该方法返回其参数；如果失败，则抛出 ClassCastException。

Here’s how you use the asSubclass method to read an annotation whose type is unknown at compile time. This method compiles without error or warning:

> 下面是如何使用 asSubclass 方法读取在编译时类型未知的注释。这个方法编译没有错误或警告：

```java
// Use of asSubclass to safely cast to a bounded type token
static Annotation getAnnotation(AnnotatedElement element,String annotationTypeName) {
    Class<?> annotationType = null; // Unbounded type token
    try {
        annotationType = Class.forName(annotationTypeName);
    } catch (Exception ex) {
        throw new IllegalArgumentException(ex);
    }
    return element.getAnnotation(annotationType.asSubclass(Annotation.class));
}
```

In summary, the normal use of generics, exemplified by the collections APIs, restricts you to a fixed number of type parameters per container. You can get around this restriction by placing the type parameter on the key rather than the container. You can use Class objects as keys for such typesafe heterogeneous containers. A Class object used in this fashion is called a type token. You can also use a custom key type. For example, you could have a DatabaseRow type representing a database row (the container), and a generic type `Column<T>` as its key.

> 总之，以集合的 API 为例的泛型在正常使用时将每个容器的类型参数限制为固定数量。你可以通过将类型参数放置在`键`上而不是容器上来绕过这个限制。你可以使用 Class 对象作为此类类型安全异构容器的`键`。以这种方式使用的 Class 对象称为类型标记。还可以使用自定义`键`类型。例如，可以使用 DatabaseRow 类型表示数据库行（容器），并使用泛型类型 `Column<T>` 作为它的`键`。

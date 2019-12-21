## 第 7 章 λ 表达式和流

## 【42】λ 表达式优于匿名类

> Prefer lambdas to anonymous classes

Historically, interfaces (or, rarely, abstract classes) with a single abstract method were used as function types. Their instances, known as function objects, represent functions or actions. Since JDK 1.1 was released in 1997, the primary means of creating a function object was the anonymous class (Item 24). Here’s a code snippet to sort a list of strings in order of length, using an anonymous class to create the sort’s comparison function (which imposes the sort order):

> 在历史上，带有单个抽象方法的接口（或者抽象类，但这种情况很少）被用作函数类型。它们的实例（称为函数对象）表示函数或操作。自从 JDK 1.1 在 1997 年发布以来，创建函数对象的主要方法就是匿名类（Item-24）。下面是一个按长度对字符串列表进行排序的代码片段，使用一个匿名类来创建排序的比较函数（它强制执行排序顺序）：

```java
// Anonymous class instance as a function object - obsolete!
Collections.sort(words, new Comparator<String>() {
    public int compare(String s1, String s2) {
        return Integer.compare(s1.length(), s2.length());
    }
});
```

Anonymous classes were adequate for the classic objected-oriented design patterns requiring function objects, notably the Strategy pattern [Gamma95]. The Comparator interface represents an abstract strategy for sorting; the anonymous class above is a concrete strategy for sorting strings. The verbosity of anonymous classes, however, made functional programming in Java an unappealing prospect.

> 匿名类对于需要函数对象的典型面向对象设计模式来说已经足够了，尤其是策略模式 [Gamma95]。Comparator 接口表示排序的抽象策略；上述匿名类是对字符串排序的一种具体策略。然而，匿名类的冗长使函数式编程在 Java 中变得毫无吸引力。

In Java 8, the language formalized the notion that interfaces with a single abstract method are special and deserve special treatment. These interfaces are now known as functional interfaces, and the language allows you to create instances of these interfaces using lambda expressions, or lambdas for short. Lambdas are similar in function to anonymous classes, but far more concise. Here’s how the code snippet above looks with the anonymous class replaced by a lambda. The boilerplate is gone, and the behavior is clearly evident:

> 在 Java 8 中官方化了一个概念，即具有单个抽象方法的接口是特殊的，应该得到特殊处理。这些接口现在被称为函数式接口，允许使用 lambda 表达式创建这些接口的实例。Lambda 表达式在功能上类似于匿名类，但是更加简洁。下面的代码片段，匿名类被 lambda 表达式替换。已经没有了原有刻板的样子，意图非常明显：

```java
// Lambda expression as function object (replaces anonymous class)
Collections.sort(words,(s1, s2) -> Integer.compare(s1.length(), s2.length()));
```

Note that the types of the lambda (`Comparator<String>`), of its parameters (s1 and s2, both String), and of its return value (int) are not present in the code. The compiler deduces these types from context, using a process known as type inference. In some cases, the compiler won’t be able to determine the types, and you’ll have to specify them. The rules for type inference are complex: they take up an entire chapter in the JLS [JLS, 18]. Few programmers understand these rules in detail, but that’s OK. **Omit the types of all lambda parameters unless their presence makes your program clearer.** If the compiler generates an error telling you it can’t infer the type of a lambda parameter, then specify it. Sometimes you may have to cast the return value or the entire lambda expression, but this is rare.

> 注意，lambda 表达式（`Comparator<String>`）、它的参数（s1 和 s2，都是字符串）及其返回值（int）的类型在代码中不存在。编译器使用称为类型推断的过程从上下文中推断这些类型。在某些情况下，编译器无法确定类型，你必须显式指定它们。类型推断的规则很复杂：它们在 JLS 中占了整整一章 [JLS, 18]。很少有程序员能详细理解这些规则，但这没有关系。**省略所有 lambda 表达式参数的类型，除非它们的存在使你的程序更清晰。** 如果编译器生成一个错误，告诉你它不能推断 lambda 表达式参数的类型，那么就显式指定它。有时你可能必须强制转换返回值或整个 lambda 表达式，但这种情况很少见。

One caveat should be added concerning type inference. Item 26 tells you not to use raw types, Item 29 tells you to favor generic types, and Item 30 tells you to favor generic methods. This advice is doubly important when you’re using lambdas, because the compiler obtains most of the type information that allows it to perform type inference from generics. If you don’t provide this information, the compiler will be unable to do type inference, and you’ll have to specify types manually in your lambdas, which will greatly increase their verbosity. By way of example, the code snippet above won’t compile if the variable words is declared to be of the raw type List instead of the parameterized type `List<String>`.

> 关于类型推断，有些警告应该被提及。Item-26 告诉你不要使用原始类型，Item-29 告诉你要优先使用泛型，Item-30 告诉你要优先使用泛型方法。在使用 lambda 表达式时，这些建议尤其重要，因为编译器获得了允许它从泛型中执行类型推断的大部分类型信息。如果不提供此信息，编译器将无法进行类型推断，并且必须在 lambda 表达式中手动指定类型，这将大大增加它们的冗长。举例来说，如果变量声明为原始类型 List 而不是参数化类型 `List<String>`，那么上面的代码片段将无法编译。

Incidentally, the comparator in the snippet can be made even more succinct if a comparator construction method is used in place of a lambda (Items 14. 43):

> 顺便说一下，如果使用 comparator 构造方法代替 lambda 表达式（Item-14），那么代码片段可以变得更加简洁：

```java
Collections.sort(words, comparingInt(String::length));
```

In fact, the snippet can be made still shorter by taking advantage of the sort method that was added to the List interface in Java 8:

事实上，通过 Java 8 中添加到 List 接口的 sort 方法，可以使代码片段变得更短：

```java
words.sort(comparingInt(String::length));
```

The addition of lambdas to the language makes it practical to use function objects where it would not previously have made sense. For example, consider the Operation enum type in Item 34. Because each enum required different behavior for its apply method, we used constant-specific class bodies and overrode the apply method in each enum constant. To refresh your memory, here is the code:

> 在语言中添加 lambda 表达式使得在以前没有意义的地方使用函数对象变得实际。例如，考虑 Item-34 中的操作枚举类型。因为每个枚举的 apply 方法需要不同的行为，所以我们使用特定于常量的类体并覆盖每个枚举常量中的 apply 方法。为了唤醒你的记忆，以下是代码：

```java
// Enum type with constant-specific class bodies & data (Item 34)
public enum Operation {
    PLUS("+") {
        public double apply(double x, double y) { return x + y; }
    },
    MINUS("-") {
        public double apply(double x, double y) { return x - y; }
    },
    TIMES("*") {
        public double apply(double x, double y) { return x * y; }
    },
    DIVIDE("/") {
        public double apply(double x, double y) { return x / y; }
    };

    private final String symbol;

    Operation(String symbol) { this.symbol = symbol; }

    @Override
    public String toString() { return symbol; }

    public abstract double apply(double x, double y);
}
```

Item 34 says that enum instance fields are preferable to constant-specific class bodies. Lambdas make it easy to implement constant-specific behavior using the former instead of the latter. Merely pass a lambda implementing each enum constant’s behavior to its constructor. The constructor stores the lambda in an instance field, and the apply method forwards invocations to the lambda. The resulting code is simpler and clearer than the original version:

> Item-34 指出，枚举实例字段比特定于常量的类体更可取。Lambda 表达式使得使用前者取代后者来实现特定于常量的行为变得容易。只需将实现每个枚举常量的行为的 lambda 表达式传递给它的构造函数。构造函数将 lambda 表达式存储在实例字段中，apply 方法将调用转发给 lambda 表达式。生成的代码比原始版本更简单、更清晰：

```java
// Enum with function object fields & constant-specific behavior
public enum Operation {
    PLUS ("+", (x, y) -> x + y),
    MINUS ("-", (x, y) -> x - y),
    TIMES ("*", (x, y) -> x * y),
    DIVIDE("/", (x, y) -> x / y);

    private final String symbol;

    private final DoubleBinaryOperator op;

    Operation(String symbol, DoubleBinaryOperator op) {
        this.symbol = symbol;
        this.op = op;
    }

    @Override public String toString() { return symbol; }

    public double apply(double x, double y) {
        return op.applyAsDouble(x, y);
    }
}
```

Note that we’re using the DoubleBinaryOperator interface for the lambdas that represent the enum constant’s behavior. This is one of the many predefined functional interfaces in java.util.function (Item 44). It represents a function that takes two double arguments and returns a double result.

> 注意，我们对表示枚举常量行为的 lambda 表达式使用了 DoubleBinaryOperator 接口。这是 `java.util.function` （Item-44）中许多预定义的函数式接口之一。它表示接受两个双参数并返回双结果的函数。

Looking at the lambda-based Operation enum, you might think constantspecific method bodies have outlived their usefulness, but this is not the case. Unlike methods and classes, **lambdas lack names and documentation; if a computation isn’t self-explanatory, or exceeds a few lines, don’t put it in a lambda.** One line is ideal for a lambda, and three lines is a reasonable maximum. If you violate this rule, it can cause serious harm to the readability of your programs. If a lambda is long or difficult to read, either find a way to simplify it or refactor your program to eliminate it. Also, the arguments passed to enum constructors are evaluated in a static context. Thus, lambdas in enum constructors can’t access instance members of the enum. Constant-specific class bodies are still the way to go if an enum type has constant-specific behavior that is difficult to understand, that can’t be implemented in a few lines, or that requires access to instance fields or methods.

> 查看基于 lambda 表达式的操作 enum，你可能会认为特定于常量的方法体已经过时了，但事实并非如此。与方法和类不同，**lambda 表达式缺少名称和文档；如果一个算法并非不言自明，或者有很多行代码，不要把它放在 lambda 表达式中。** 一行是理想的，三行是合理的最大值。如果你违反了这一规则，就会严重损害程序的可读性。如果 lambda 表达式很长或者很难读，要么找到一种方法来简化它，要么重构你的程序。此外，传递给 enum 构造函数的参数在静态上下文中计算。因此，enum 构造函数中的 lambda 表达式不能访问枚举的实例成员。如果枚举类型具有难以理解的特定于常量的行为，无法在几行代码中实现，或者需要访问实例字段或方法，则仍然需要特定于常量的类。

Likewise, you might think that anonymous classes are obsolete in the era of lambdas. This is closer to the truth, but there are a few things you can do with anonymous classes that you can’t do with lambdas. Lambdas are limited to functional interfaces. If you want to create an instance of an abstract class, you can do it with an anonymous class, but not a lambda. Similarly, you can use anonymous classes to create instances of interfaces with multiple abstract methods. Finally, a lambda cannot obtain a reference to itself. In a lambda, the this keyword refers to the enclosing instance, which is typically what you want. In an anonymous class, the this keyword refers to the anonymous class instance. If you need access to the function object from within its body, then you must use an anonymous class.

> 同样，你可能认为匿名类在 lambda 表达式时代已经过时了。这更接近事实，但是有一些匿名类可以做的事情是 lambda 表达式不能做的。Lambda 表达式仅限于函数式接口。如果想创建抽象类的实例，可以使用匿名类，但不能使用 lambda 表达式。类似地，你可以使用匿名类来创建具有多个抽象方法的接口实例。最后，lambda 表达式无法获得对自身的引用。在 lambda 表达式中，this 关键字指的是封闭实例，这通常是你想要的。在匿名类中，this 关键字引用匿名类实例。如果你需要从函数对象的内部访问它，那么你必须使用一个匿名类。

Lambdas share with anonymous classes the property that you can’t reliably serialize and deserialize them across implementations. Therefore, **you should rarely, if ever, serialize a lambda** (or an anonymous class instance). If you have a function object that you want to make serializable, such as a Comparator, use an instance of a private static nested class (Item 24).

> Lambda 表达式与匿名类共享无法通过实现可靠地序列化和反序列化它们的属性。因此，**很少（如果有的话）序列化 lambda**（或匿名类实例）。如果你有一个想要序列化的函数对象，比如比较器，那么使用私有静态嵌套类的实例（Item-24）。

In summary, as of Java 8, lambdas are by far the best way to represent small function objects. **Don’t use anonymous classes for function objects unless you have to create instances of types that aren’t functional interfaces.** Also, remember that lambdas make it so easy to represent small function objects that it opens the door to functional programming techniques that were not previously practical in Java.

> 总之，在 Java 8 中，lambda 表达式是迄今为止表示小函数对象的最佳方式。**不要对函数对象使用匿名类，除非你必须创建非函数式接口类型的实例。** 另外，请记住，lambda 表达式使表示小函数对象变得非常容易，从而为 Java 以前不实用的函数式编程技术打开了大门。

---

## 【43】方法引用优于 λ 表达式

> Prefer method references to lambdas

The primary advantage of lambdas over anonymous classes is that they are more succinct. Java provides a way to generate function objects even more succinct than lambdas: method references. Here is a code snippet from a program that maintains a map from arbitrary keys to Integer values. If the value is interpreted as a count of the number of instances of the key, then the program is a multiset implementation. The function of the code snippet is to associate the number 1 with the key if it is not in the map and to increment the associated value if the key is already present:

> lambda 表达式与匿名类相比，主要优势是更简洁。Java 提供了一种方法来生成比 lambda 表达式更简洁的函数对象：方法引用。下面是一个程序的代码片段，该程序维护从任意键到 Integer 类型值的映射。如果该值被解释为键实例数的计数，那么该程序就是一个多集实现。该代码段的功能是，如果数字 1 不在映射中，则将其与键关联，如果键已经存在，则将关联值递增：

```java
map.merge(key, 1, (count, incr) -> count + incr);
```

Note that this code uses the merge method, which was added to the Map interface in Java 8. If no mapping is present for the given key, the method simply inserts the given value; if a mapping is already present, merge applies the given function to the current value and the given value and overwrites the current value with the result. This code represents a typical use case for the merge method.

> 注意，这段代码使用了 merge 方法，它是在 Java 8 中添加到 Map 接口的。如果给定键没有映射，则该方法只插入给定的值；如果已经存在映射，则 merge 将给定的函数应用于当前值和给定值，并用结果覆盖当前值。这段代码代表了 merge 方法的一个典型用例。

The code reads nicely, but there’s still some boilerplate. The parameters count and incr don’t add much value, and they take up a fair amount of space. Really, all the lambda tells you is that the function returns the sum of its two arguments. As of Java 8, Integer (and all the other boxed numerical primitive types) provides a static method sum that does exactly the same thing. We can simply pass a reference to this method and get the same result with less visual clutter:

> 代码读起来不错，但是仍然有一些刻板。参数计数和 incr 不会增加太多的价值，而且它们会占用相当大的空间。实际上，lambda 表达式告诉你的是函数返回两个参数的和。在 Java 8 中，Integer（和所有其他基本类型的包装类）提供了一个静态方法 sum，它的作用完全相同。我们可以简单地传递一个引用到这个方法，并得到相同的结果，同时减少视觉混乱：

```java
map.merge(key, 1, Integer::sum);
```

The more parameters a method has, the more boilerplate you can eliminate with a method reference. In some lambdas, however, the parameter names you choose provide useful documentation, making the lambda more readable and maintainable than a method reference, even if the lambda is longer.

> 一个方法的参数越多，就可以通过一个方法引用消除越多的刻板模式。然而，在某些 lambda 表达式中，您选择的参数名提供了有用的文档，使得 lambda 表达式比方法引用更易于阅读和维护，即使 lambda 表达式更长。

There’s nothing you can do with a method reference that you can’t also do with a lambda (with one obscure exception—see JLS, 9.9-2 if you’re curious). That said, method references usually result in shorter, clearer code. They also give you an out if a lambda gets too long or complex: You can extract the code from the lambda into a new method and replace the lambda with a reference to that method. You can give the method a good name and document it to your heart’s content.

> 对于方法引用，没有什么是你不能对 lambda 表达式做的（只有一个模糊的例外，如果你好奇的话可参见 [JLS, 9.9-2]）。也就是说，方法引用通常会产生更短、更清晰的代码。如果 lambda 表达式太长或太复杂，它们还会给出一个输出：可以将代码从 lambda 表达式提取到一个新方法中，并以对该方法的引用替换 lambda 表达式。可以为该方法起一个好名字，并将其文档化以满足需要。

If you’re programming with an IDE, it will offer to replace a lambda with a method reference wherever it can. You should usually, but not always, take the IDE up on the offer. Occasionally, a lambda will be more succinct than a method reference. This happens most often when the method is in the same class as the lambda. For example, consider this snippet, which is presumed to occur in a class named GoshThisClassNameIsHumongous:

> 如果你使用 IDE 编程，它将在任何可能的地方建议用方法引用替换 lambda 表达式。通常应该（但不总是）接受 IDE 的建议。有时候，lambda 表达式会比方法引用更简洁。当方法与 lambda 表达式在同一个类中时，这种情况最常见。例如，考虑这段代码片段，它假定发生在一个名为 GoshThisClassNameIsHumongous 的类中：

```java
service.execute(GoshThisClassNameIsHumongous::action);
```

The lambda equivalent looks like this:

> 使用 lambda 表达式是这样的：

```java
service.execute(() -> action());
```

The snippet using the method reference is neither shorter nor clearer than the snippet using the lambda, so prefer the latter. Along similar lines, the Function interface provides a generic static factory method to return the identity function, Function.identity(). It’s typically shorter and cleaner not to use this method but to code the equivalent lambda inline: x -> x.

> 使用方法引用的代码片段并不比使用 lambda 表达式的代码片段短，也不清楚，所以选择后者。类似地，函数接口提供了一个通用静态工厂方法来返回标识函数 `Function.identity()`。不使用这个方法，而是一行中编写等价的 lambda 表达式：`x -> x`，通常更短，也更简洁。

Many method references refer to static methods, but there are four kinds that do not. Two of them are bound and unbound instance method references. In bound references, the receiving object is specified in the method reference. Bound references are similar in nature to static references: the function object takes the same arguments as the referenced method. In unbound references, the receiving object is specified when the function object is applied, via an additional parameter before the method’s declared parameters. Unbound references are often used as mapping and filter functions in stream pipelines (Item 45). Finally, there are two kinds of constructor references, for classes and arrays. Constructor references serve as factory objects. All five kinds of method references are summarized in the table below:

> 许多方法引用引用静态方法，但是有四种方法不引用静态方法。其中两个是绑定和非绑定实例方法引用。在绑定引用中，接收对象在方法引用中指定。绑定引用在本质上与静态引用相似：函数对象接受与引用方法相同的参数。在未绑定引用中，在应用函数对象时通过方法声明参数之前的附加参数指定接收对象。在流管道中，未绑定引用通常用作映射和筛选函数（Item-45）。最后，对于类和数组，有两种构造函数引用。构造函数引用用作工厂对象。五种方法参考文献汇总如下表：

|  Method Ref Type  |         Example          |                 Lambda Equivalent                  |
| :---------------: | :----------------------: | :------------------------------------------------: |
|      Static       |   `Integer::parseInt`    |                      `str ->`                      |
|       Bound       | `Instant.now()::isAfter` | `Instant then =Instant.now(); t ->then.isAfter(t)` |
|      Unbound      |  `String::toLowerCase`   |             `str ->str.toLowerCase()`              |
| Class Constructor |   `TreeMap<K,V>::new`    |              `() -> new TreeMap<K,V>`              |
| Array Constructor |       `int[]::new`       |               `len -> new int[len]`                |

In summary, method references often provide a more succinct alternative to lambdas. **Where method references are shorter and clearer, use them; where they aren’t, stick with lambdas.**

> 总之，方法引用通常为 lambda 表达式提供了一种更简洁的选择。**如果方法引用更短、更清晰，则使用它们；如果没有，仍然使用 lambda 表达式。**

---

## 【44】优先使用标准函数式接口

> Favor the use of standard functional interfaces

Now that Java has lambdas, best practices for writing APIs have changed considerably. For example, the Template Method pattern [Gamma95], wherein a subclass overrides a primitive method to specialize the behavior of its superclass, is far less attractive. The modern alternative is to provide a static factory or constructor that accepts a function object to achieve the same effect. More generally, you’ll be writing more constructors and methods that take function objects as parameters. Choosing the right functional parameter type demands care.

> 现在 Java 已经有了 lambda 表达式，编写 API 的最佳实践已经发生了很大的变化。例如，模板方法模式 [Gamma95]，其中子类覆盖基类方法以专门化其超类的行为，就没有那么有吸引力了。现代的替代方法是提供一个静态工厂或构造函数，它接受一个函数对象来实现相同的效果。更一般地，你将编写更多以函数对象为参数的构造函数和方法。选择正确的函数参数类型需要谨慎。

Consider LinkedHashMap. You can use this class as a cache by overriding its protected removeEldestEntry method, which is invoked by put each time a new key is added to the map. When this method returns true, the map removes its eldest entry, which is passed to the method. The following override allows the map to grow to one hundred entries and then deletes the eldest entry each time a new key is added, maintaining the hundred most recent entries:

> 考虑 LinkedHashMap。你可以通过覆盖受保护的 removeEldestEntry 方法将该类用作缓存，每当向映射添加新键时，put 都会调用该方法。当该方法返回 true 时，映射将删除传递给该方法的最老条目。下面的覆盖允许映射增长到 100 个条目，然后在每次添加新键时删除最老的条目，维护 100 个最近的条目：

```java
protected boolean removeEldestEntry(Map.Entry<K,V> eldest) {
    return size() > 100;
}
```

This technique works fine, but you can do much better with lambdas. If LinkedHashMap were written today, it would have a static factory or constructor that took a function object. Looking at the declaration for removeEldestEntry, you might think that the function object should take a `Map.Entry<K,V>` and return a boolean, but that wouldn’t quite do it: The removeEldestEntry method calls size() to get the number of entries in the map, which works because removeEldestEntry is an instance method on the map. The function object that you pass to the constructor is not an instance method on the map and can’t capture it because the map doesn’t exist yet when its factory or constructor is invoked. Thus, the map must pass itself to the function object, which must therefore take the map on input as well as its eldest entry. If you were to declare such a functional interface, it would look something like this:

> 这种技术工作得很好，但是使用 lambda 表达式可以做得更好。如果 LinkedHashMap 是现在编写的，它将有一个静态工厂或构造函数，它接受一个函数对象。看着 removeEldestEntry 的定义,你可能会认为这个函数对象应该 `Map.Entry<K,V>` 和返回一个布尔值，但不会完全做到：removeEldestEntry 方法调用 `size()` 地图中的条目的数量，这工作，因为 removeEldestEntry 在 Map 上是一个实例方法。传递给构造函数的函数对象不是 Map 上的实例方法，无法捕获它，因为在调用 Map 的工厂或构造函数时，Map 还不存在。因此，Map 必须将自身传递给函数对象，函数对象因此必须在输入端及其最老的条目上接受 Map。如果要声明这样一个函数式接口，它看起来是这样的：

```java
// Unnecessary functional interface; use a standard one instead.
@FunctionalInterface interface EldestEntryRemovalFunction<K,V>{
    boolean remove(Map<K,V> map, Map.Entry<K,V> eldest);
}
```

This interface would work fine, but you shouldn’t use it, because you don’t need to declare a new interface for this purpose. The java.util.function package provides a large collection of standard functional interfaces for your use. **If one of the standard functional interfaces does the job, you should generally use it in preference to a purpose-built functional interface.** This will make your API easier to learn, by reducing its conceptual surface area, and will provide significant interoperability benefits, as many of the standard functional interfaces provide useful default methods. The Predicate interface, for instance, provides methods to combine predicates. In the case of our LinkedHashMap example, the standard `BiPredicate<Map<K,V>`, `Map.Entry<K,V>>` interface should be used in preference to a custom EldestEntryRemovalFunction interface.

> 这个接口可以很好地工作，但是你不应该使用它，因为你不需要为此声明一个新接口。`java.util.function` 包提供了大量的标准函数接口供你使用。**如果一个标准的函数式接口可以完成这项工作，那么你通常应该优先使用它，而不是使用专门构建的函数式接口。** 通过减少 API 的概念表面积，这将使你的 API 更容易学习，并将提供显著的互操作性优势，因为许多标准函数式接口提供了有用的默认方法。例如，Predicate 接口提供了组合谓词的方法。在我们的 LinkedHashMap 示例中，应该优先使用标准的 `BiPredicate<Map<K,V>`、`Map.Entry<K,V>>` 接口，而不是定制的 EldestEntryRemovalFunction 接口。

There are forty-three interfaces in java.util.Function. You can’t be expected to remember them all, but if you remember six basic interfaces, you can derive the rest when you need them. The basic interfaces operate on object reference types. The Operator interfaces represent functions whose result and argument types are the same. The Predicate interface represents a function that takes an argument and returns a boolean. The Function interface represents a function whose argument and return types differ. The Supplier interface represents a function that takes no arguments and returns (or “supplies”) a value. Finally, Consumer represents a function that takes an argument and returns nothing, essentially consuming its argument. The six basic functional interfaces are summarized below:

**译注：原文笔误，应为 `java.util.function`**

> `java.util.function` 中有 43 个接口。不能期望你记住所有的接口，但是如果你记住了 6 个基本接口，那么你可以在需要时派生出其余的接口。基本接口操作对象引用类型。Operator 接口表示结果和参数类型相同的函数。Predicate 接口表示接受参数并返回布尔值的函数。Function 接口表示参数和返回类型不同的函数。Supplier 接口表示一个不接受参数并返回（或「供应」）值的函数。最后，Consumer 表示一个函数，该函数接受一个参数，但不返回任何内容，本质上是使用它的参数。六个基本的函数式接口总结如下：

|      Interface      |  Function Signature   |        Example        |
| :-----------------: | :-------------------: | :-------------------: |
| `UnaryOperator<T>`  |    `T apply(T t)`     | `String::toLowerCase` |
| `BinaryOperator<T>` | `T apply(T t1, T t2)` |   `BigInteger::add`   |
|   `Predicate<T>`    |  `boolean test(T t)`  | `Collection::isEmpty` |
|   `Function<T,R>`   |    `R apply(T t)`     |   `Arrays::asList`    |
|    `Supplier<T>`    |       `T get()`       |    `Instant::now`     |
|    `Consumer<T>`    |  `void accept(T t)`   | `System.out::println` |

There are also three variants of each of the six basic interfaces to operate on the primitive types int, long, and double. Their names are derived from the basic interfaces by prefixing them with a primitive type. So, for example, a predicate that takes an int is an IntPredicate, and a binary operator that takes two long values and returns a long is a LongBinaryOperator. None of these variant types is parameterized except for the Function variants, which are parameterized by return type. For example, `LongFunction<int[]>` takes a long and returns an int[].

> 还有 6 个基本接口的 3 个变体，用于操作基本类型 int、long 和 double。它们的名称是通过在基本接口前面加上基本类型前缀而派生出来的。例如，一个接受 int 的 Predicate 就是一个 IntPredicate，一个接受两个 long 值并返回一个 long 的二元操作符就是一个 LongBinaryOperator。除了由返回类型参数化的函数变量外，这些变量类型都不是参数化的。例如，`LongFunction<int[]>` 使用 long 并返回一个 int[]。

There are nine additional variants of the Function interface, for use when the result type is primitive. The source and result types always differ, because a function from a type to itself is a UnaryOperator. If both the source and result types are primitive, prefix Function with SrcToResult, for example LongToIntFunction (six variants). If the source is a primitive and the result is an object reference, prefix Function with `<Src>ToObj`, for example DoubleToObjFunction (three variants).

> Function 接口还有 9 个额外的变体，在结果类型为基本数据类型时使用。源类型和结果类型总是不同的，因为不同类型的函数本身都是 UnaryOperator。如果源类型和结果类型都是基本数据类型，则使用带有 SrcToResult 的前缀函数，例如 LongToIntFunction（六个变体）。如果源是一个基本数据类型，而结果是一个对象引用，则使用带前缀 `<Src>ToObj` 的 Function 接口，例如 DoubleToObjFunction（三个变体）。

There are two-argument versions of the three basic functional interfaces for which it makes sense to have them: `BiPredicate<T,U>`, `BiFunction<T,U,R>`, and `BiConsumer<T,U>`. There are also BiFunction variants returning the three relevant primitive types: `ToIntBiFunction<T,U>`, `ToLongBiFunction<T,U>`, and `ToDoubleBiFunction<T,U>`. There are two-argument variants of Consumer that take one object reference and one primitive type: `ObjDoubleConsumer<T>`, `ObjIntConsumer<T>`, and `ObjLongConsumer<T>`. In total, there are nine two-argument versions of the basic interfaces.

> 三个基本函数式接口有两个参数版本，使用它们是有意义的：`BiPredicate<T,U>`、`BiFunction<T,U,R>`、`BiConsumer<T,U>`。也有 BiFunction 变体返回三个相关的基本类型：`ToIntBiFunction<T,U>`、 `ToLongBiFunction<T,U>`、`ToDoubleBiFunction<T,U>`。Consumer 有两个参数变体，它们接受一个对象引用和一个基本类型：`ObjDoubleConsumer<T>`、`ObjIntConsumer<T>`、`ObjLongConsumer<T>`。总共有 9 个基本接口的双参数版本。

Finally, there is the BooleanSupplier interface, a variant of Supplier that returns boolean values. This is the only explicit mention of the boolean type in any of the standard functional interface names, but boolean return values are supported via Predicate and its four variant forms. The BooleanSupplier interface and the forty-two interfaces described in the previous paragraphs account for all forty-three standard functional interfaces. Admittedly, this is a lot to swallow, and not terribly orthogonal. On the other hand, the bulk of the functional interfaces that you’ll need have been written for you and their names are regular enough that you shouldn’t have too much trouble coming up with one when you need it.

> 最后是 BooleanSupplier 接口，它是 Supplier 的一个变体，返回布尔值。这是在任何标准函数接口名称中唯一显式提到布尔类型的地方，但是通过 Predicate 及其四种变体形式支持布尔返回值。前面描述的 BooleanSupplier 接口和 42 个接口占了全部 43 个标准函数式接口。不可否认，这有很多东西需要消化，而且不是非常直观。另一方面，你将需要的大部分函数式接口都是为你编写的，并且它们的名称足够常规，因此在需要时你应该不会遇到太多麻烦。

Most of the standard functional interfaces exist only to provide support for primitive types. **Don’t be tempted to use basic functional interfaces with boxed primitives instead of primitive functional interfaces.** While it works, it violates the advice of Item 61, “prefer primitive types to boxed primitives.” The performance consequences of using boxed primitives for bulk operations can be deadly.

> 大多数标准函数式接口的存在只是为了提供对基本类型的支持。**不要尝试使用带有包装类的基本函数式接口，而不是使用基本类型函数式接口。** 当它工作时，它违反了 Item-61 的建议，“与盒装原语相比，更喜欢原语类型”。在批量操作中使用装箱原语的性能后果可能是致命的。

Now you know that you should typically use standard functional interfaces in preference to writing your own. But when should you write your own? Of course you need to write your own if none of the standard ones does what you need, for example if you require a predicate that takes three parameters, or one that throws a checked exception. But there are times you should write your own functional interface even when one of the standard ones is structurally identical.

> 现在你知道，与编写自己的接口相比，通常应该使用标准的函数式接口。但是你应该什么时候写你自己的呢？当然，如果标准的函数式接口都不能满足你的需要，那么你需要自行编写，例如，如果你需要一个接受三个参数的 Predicate，或者一个抛出已检查异常的 Predicate。但是有时候你应该编写自己的函数接口，即使其中一个标准接口在结构上是相同的。

Consider our old friend `Comparator<T>`, which is structurally identical to the `ToIntBiFunction<T,T>` interface. Even if the latter interface had existed when the former was added to the libraries, it would have been wrong to use it. There are several reasons that Comparator deserves its own interface. First, its name provides excellent documentation every time it is used in an API, and it’s used a lot. Second, the Comparator interface has strong requirements on what constitutes a valid instance, which comprise its general contract. By implementing the interface, you are pledging to adhere to its contract. Third, the interface is heavily outfitted with useful default methods to transform and combine comparators.

> 考虑我们的老朋友 `Comparator<T>`，它在结构上与 `ToIntBiFunction<T,T>` 接口相同。即使后者接口在将前者添加到库时已经存在，使用它也是错误的。有几个原因说明比较器应该有自己的接口。首先，每次在 API 中使用 Comparator 时，它的名称都提供了优秀的文档，而且它的使用非常频繁。通过实现接口，你保证遵守其契约。第三，该接口大量配备了用于转换和组合比较器的有用默认方法。

You should seriously consider writing a purpose-built functional interface in preference to using a standard one if you need a functional interface that shares one or more of the following characteristics with Comparator:

> 如果你需要与 Comparator 共享以下一个或多个特性的函数式接口，那么你应该认真考虑编写一个专用的函数式接口，而不是使用标准接口：

- It will be commonly used and could benefit from a descriptive name.

> 它将被广泛使用，并且可以从描述性名称中获益。

- It has a strong contract associated with it.

> 它有一个强有力的约定。

- It would benefit from custom default methods.

> 它将受益于自定义默认方法。

If you elect to write your own functional interface, remember that it’s an interface and hence should be designed with great care (Item 21).

> 如果你选择编写自己的函数式接口，请记住这是一个接口，因此应该非常小心地设计它（Item-21）。

Notice that the EldestEntryRemovalFunction interface (page 199) is labeled with the @FunctionalInterface annotation. This annotation type is similar in spirit to @Override. It is a statement of programmer intent that serves three purposes: it tells readers of the class and its documentation that the interface was designed to enable lambdas; it keeps you honest because the interface won’t compile unless it has exactly one abstract method; and it prevents maintainers from accidentally adding abstract methods to the interface as it evolves. **Always annotate your functional interfaces with the @FunctionalInterface annotation.**

> 注意 EldestEntryRemovalFunction 接口(第 199 页)使用 `@FunctionalInterface` 注释进行标记。这种注释类型在本质上类似于 `@Override`。它是程序员意图的声明，有三个目的：它告诉类及其文档的读者，接口的设计是为了启用 lambdas 表达式；它使你保持诚实，因为接口不会编译，除非它只有一个抽象方法；它还可以防止维护者在接口发展过程中意外地向接口添加抽象方法。**总是用 `@FunctionalInterface` 注释你的函数接口。**

A final point should be made concerning the use of functional interfaces in APIs. Do not provide a method with multiple overloadings that take different functional interfaces in the same argument position if it could create a possible ambiguity in the client. This is not just a theoretical problem. The submit method of ExecutorService can take either a `Callable<T>` or a Runnable, and it is possible to write a client program that requires a cast to indicate the correct overloading (Item 52). The easiest way to avoid this problem is not to write overloadings that take different functional interfaces in the same argument position. This is a special case of the advice in Item 52, “use overloading judiciously.”

> 最后一点应该是关于 API 中函数式接口的使用。不要提供具有多个重载的方法，这些方法采用相同参数位置的不同函数式接口，否则会在客户机中造成可能的歧义。这不仅仅是一个理论问题。ExecutorService 的 submit 方法可以是 `Callable<T>` 级的，也可以是 Runnable 的，并且可以编写一个客户端程序，它需要一个类型转换来指示正确的重载(Item 52)。避免此问题的最简单方法是不要编写将不同函数式接口放在相同参数位置的重载。这是 Item-52 「明智地使用过载」建议的一个特例。

In summary, now that Java has lambdas, it is imperative that you design your APIs with lambdas in mind. Accept functional interface types on input and return them on output. It is generally best to use the standard interfaces provided in java.util.function.Function, but keep your eyes open for the relatively rare cases where you would be better off writing your own functional interface.

> 总之，既然 Java 已经有了 lambda 表达式，你必须在设计 API 时考虑 lambda 表达式。在输入时接受函数式接口类型，在输出时返回它们。一般情况下，最好使用 `java.util.function` 中提供的标准函数式接口，但请注意比较少见的一些情况，在这种情况下，你最好编写自己的函数式接口。

---

## 【45】明智地使用流

> Use streams judiciously

The streams API was added in Java 8 to ease the task of performing bulk operations, sequentially or in parallel. This API provides two key abstractions: the stream, which represents a finite or infinite sequence of data elements, and the stream pipeline, which represents a multistage computation on these elements. The elements in a stream can come from anywhere. Common sources include collections, arrays, files, regular expression pattern matchers, pseudorandom number generators, and other streams. The data elements in a stream can be object references or primitive values. Three primitive types are supported: int, long, and double.

> 在 Java 8 中添加了流 API，以简化序列或并行执行批量操作的任务。这个 API 提供了两个关键的抽象：流（表示有限或无限的数据元素序列）和流管道（表示对这些元素的多阶段计算）。流中的元素可以来自任何地方。常见的源包括集合、数组、文件、正则表达式的 Pattern 匹配器、伪随机数生成器和其他流。流中的数据元素可以是对象的引用或基本数据类型。支持三种基本数据类型：int、long 和 double。

A stream pipeline consists of a source stream followed by zero or more intermediate operations and one terminal operation. Each intermediate operation transforms the stream in some way, such as mapping each element to a function of that element or filtering out all elements that do not satisfy some condition. Intermediate operations all transform one stream into another, whose element type may be the same as the input stream or different from it. The terminal operation performs a final computation on the stream resulting from the last intermediate operation, such as storing its elements into a collection, returning a certain element, or printing all of its elements.

> 流管道由源流、零个或多个 Intermediate 操作和一个 Terminal 操作组成。每个 Intermediate 操作以某种方式转换流，例如将每个元素映射到该元素的一个函数，或者过滤掉不满足某些条件的所有元素。中间操作都将一个流转换为另一个流，其元素类型可能与输入流相同，也可能与输入流不同。Terminal 操作对最后一次 Intermediate 操作所产生的流进行最终计算，例如将其元素存储到集合中、返回特定元素、或打印其所有元素。

Stream pipelines are evaluated lazily: evaluation doesn’t start until the terminal operation is invoked, and data elements that aren’t required in order to complete the terminal operation are never computed. This lazy evaluation is what makes it possible to work with infinite streams. Note that a stream pipeline without a terminal operation is a silent no-op, so don’t forget to include one.

> 流管道的计算是惰性的：直到调用 Terminal 操作时才开始计算，并且对完成 Terminal 操作不需要的数据元素永远不会计算。这种惰性的求值机制使得处理无限流成为可能。请注意，没有 Terminal 操作的流管道是无动作的，因此不要忘记包含一个 Terminal 操作。

The streams API is fluent: it is designed to allow all of the calls that comprise a pipeline to be chained into a single expression. In fact, multiple pipelines can be chained together into a single expression.

> 流 API 是流畅的：它被设计成允许使用链式调用将组成管道的所有调用写到单个表达式中。实际上，可以将多个管道链接到一个表达式中。

By default, stream pipelines run sequentially. Making a pipeline execute in parallel is as simple as invoking the parallel method on any stream in the pipeline, but it is seldom appropriate to do so (Item 48).

> 默认情况下，流管道按顺序运行。让管道并行执行与在管道中的任何流上调用并行方法一样简单，但是这样做不一定合适（Item-48）。

The streams API is sufficiently versatile that practically any computation can be performed using streams, but just because you can doesn’t mean you should. When used appropriately, streams can make programs shorter and clearer; when used inappropriately, they can make programs difficult to read and maintain. There are no hard and fast rules for when to use streams, but there are heuristics.

> 流 API 非常通用，实际上任何计算都可以使用流来执行，但这并不意味着你就应该这样做。如果使用得当，流可以使程序更短、更清晰；如果使用不当，它们会使程序难以读取和维护。对于何时使用流没有硬性的规则，但是有一些启发式的规则。

Consider the following program, which reads the words from a dictionary file and prints all the anagram groups whose size meets a user-specified minimum. Recall that two words are anagrams if they consist of the same letters in a different order. The program reads each word from a user-specified dictionary file and places the words into a map. The map key is the word with its letters alphabetized, so the key for "staple" is "aelpst", and the key for "petals" is also "aelpst": the two words are anagrams, and all anagrams share the same alphabetized form (or alphagram, as it is sometimes known). The map value is a list containing all of the words that share an alphabetized form. After the dictionary has been processed, each list is a complete anagram group. The program then iterates through the map’s values() view and prints each list whose size meets the threshold:

> 考虑下面的程序，它从字典文件中读取单词并打印所有大小满足用户指定最小值的变位组。回想一下，如果两个单词以不同的顺序由相同的字母组成，那么它们就是字谜。该程序从用户指定的字典文件中读取每个单词，并将这些单词放入一个 Map 中。Map 的键是按字母顺序排列的单词，因此「staple」的键是「aelpst」，而「petals」的键也是「aelpst」：这两个单词是字谜，所有的字谜都有相同的字母排列形式（有时称为字母图）。Map 的值是一个列表，其中包含共享按字母顺序排列的表单的所有单词。在字典被处理之后，每个列表都是一个完整的字谜组。然后，该程序遍历 Map 的 values() 视图，并打印大小满足阈值的每个列表：

```java
// Prints all large anagram groups in a dictionary iteratively
public class Anagrams {
    public static void main(String[] args) throws IOException {
        File dictionary = new File(args[0]);
        int minGroupSize = Integer.parseInt(args[1]);
        Map<String, Set<String>> groups = new HashMap<>();
        try (Scanner s = new Scanner(dictionary)) {
            while (s.hasNext()) {
                String word = s.next();
                groups.computeIfAbsent(alphabetize(word),(unused) -> new TreeSet<>()).add(word);
            }
        }
        for (Set<String> group : groups.values())
        if (group.size() >= minGroupSize)
            System.out.println(group.size() + ": " + group);
    }

    private static String alphabetize(String s) {
        char[] a = s.toCharArray();
        Arrays.sort(a);
        return new String(a);
    }
}
```

One step in this program is worthy of note. The insertion of each word into the map, which is shown in bold, uses the computeIfAbsent method, which was added in Java 8. This method looks up a key in the map: If the key is present, the method simply returns the value associated with it. If not, the method computes a value by applying the given function object to the key, associates this value with the key, and returns the computed value. The computeIfAbsent method simplifies the implementation of maps that associate multiple values with each key.

> 这个程序中的一个步骤值得注意。将每个单词插入到 Map 中（以粗体显示）使用 computeIfAbsent 方法，该方法是在 Java 8 中添加的。此方法在 Map 中查找键：如果键存在，则该方法仅返回与其关联的值。若不存在，则该方法通过将给定的函数对象应用于键来计算一个值，将该值与键关联，并返回计算的值。computeIfAbsent 方法简化了将多个值与每个键关联的 Map 的实现。

Now consider the following program, which solves the same problem, but makes heavy use of streams. Note that the entire program, with the exception of the code that opens the dictionary file, is contained in a single expression. The only reason the dictionary is opened in a separate expression is to allow the use of the try-with-resources statement, which ensures that the dictionary file is closed:

> 现在考虑下面的程序，它解决了相同的问题，但是大量使用了流。注意，除了打开字典文件的代码之外，整个程序都包含在一个表达式中。在单独的表达式中打开字典的唯一原因是允许使用 `try with-resources` 语句，该语句确保字典文件是关闭的：

```java
// Overuse of streams - don't do this!
public class Anagrams {
    public static void main(String[] args) throws IOException {
        Path dictionary = Paths.get(args[0]);
        int minGroupSize = Integer.parseInt(args[1]);
        try (Stream<String> words = Files.lines(dictionary)) {
            words.collect(
            groupingBy(word -> word.chars().sorted()
            .collect(StringBuilder::new,(sb, c) -> sb.append((char) c),
            StringBuilder::append).toString()))
            .values().stream()
            .filter(group -> group.size() >= minGroupSize)
            .map(group -> group.size() + ": " + group)
            .forEach(System.out::println);
        }
    }
}
```

If you find this code hard to read, don’t worry; you’re not alone. It is shorter, but it is also less readable, especially to programmers who are not experts in the use of streams. Overusing streams makes programs hard to read and maintain. Luckily, there is a happy medium. The following program solves the same problem, using streams without overusing them. The result is a program that’s both shorter and clearer than the original:

> 如果你发现这段代码难以阅读，不要担心；不单是你有这样的感觉。它虽然更短，但可读性也更差，特别是对于不擅长流使用的程序员来说。过度使用流会使得程序难以读取和维护。幸运的是，有一个折衷的办法。下面的程序解决了相同的问题，在不过度使用流的情况下使用流。结果，这个程序比原来的程序更短，也更清晰：

```java
// Tasteful use of streams enhances clarity and conciseness
public class Anagrams {
    public static void main(String[] args) throws IOException {
        Path dictionary = Paths.get(args[0]);
        int minGroupSize = Integer.parseInt(args[1]);
        try (Stream<String> words = Files.lines(dictionary)) {
            words.collect(groupingBy(word -> alphabetize(word)))
            .values().stream()
            .filter(group -> group.size() >= minGroupSize)
            .forEach(g -> System.out.println(g.size() + ": " + g));
        }
    }
    // alphabetize method is the same as in original version
}
```

Even if you have little previous exposure to streams, this program is not hard to understand. It opens the dictionary file in a try-with-resources block, obtaining a stream consisting of all the lines in the file. The stream variable is named words to suggest that each element in the stream is a word. The pipeline on this stream has no intermediate operations; its terminal operation collects all the words into a map that groups the words by their alphabetized form (Item 46). This is exactly the same map that was constructed in both previous versions of the program. Then a new `Stream<List<String>>` is opened on the values() view of the map. The elements in this stream are, of course, the anagram groups. The stream is filtered so that all of the groups whose size is less than minGroupSize are ignored, and finally, the remaining groups are printed by the terminal operation forEach.

> 即使你以前很少接触流，这个程序也不难理解。它在带有资源的 try 块中打开字典文件，获得由文件中所有行组成的流。流变量名为 words，表示流中的每个元素都是一个单词。此流上的管道没有 Intermediate 操作；它的 Terminal 操作将所有单词收集到一个 Map 中，该 Map 按字母顺序将单词分组（Item-46）。这与在程序的前两个版本中构造的 Map 完全相同。然后在 Map 的 values() 视图上打开一个新的 `Stream<List<String>>`。这个流中的元素当然是字谜组。对流进行过滤，以便忽略所有大小小于 minGroupSize 的组，最后，Terminal 操作 forEach 打印其余组。

Note that the lambda parameter names were chosen carefully. The parameter g should really be named group, but the resulting line of code would be too wide for the book. **In the absence of explicit types, careful naming of lambda parameters is essential to the readability of stream pipelines.**

> 注意，lambda 表达式参数名称是经过仔细选择的。参数 g 实际上应该命名为 group，但是生成的代码行对于本书排版来说太宽了。**在没有显式类型的情况下，lambda 表达式参数的谨慎命名对于流管道的可读性至关重要。**

Note also that word alphabetization is done in a separate alphabetize method. This enhances readability by providing a name for the operation and keeping implementation details out of the main program. **Using helper methods is even more important for readability in stream pipelines than in iterative code** because pipelines lack explicit type information and named temporary variables.

> 还要注意，单词的字母化是在一个单独的字母化方法中完成的。这通过为操作提供一个名称并将实现细节排除在主程序之外，从而增强了可读性。**在流管道中使用 helper 方法比在迭代代码中更重要**，因为管道缺少显式类型信息和命名的临时变量。

The alphabetize method could have been reimplemented to use streams, but a stream-based alphabetize method would have been less clear, more difficult to write correctly, and probably slower. These deficiencies result from Java’s lack of support for primitive char streams (which is not to imply that Java should have supported char streams; it would have been infeasible to do so). To demonstrate the hazards of processing char values with streams, consider the following code:

> 本来可以重新实现字母顺序方法来使用流，但是基于流的字母顺序方法就不那么清晰了，更难于正确地编写，而且可能会更慢。这些缺陷是由于 Java 不支持基本字符流（这并不意味着 Java 应该支持字符流；这样做是不可行的）。要演示使用流处理 char 值的危害，请考虑以下代码：

```java
"Hello world!".chars().forEach(System.out::print);
```

You might expect it to print Hello world!, but if you run it, you’ll find that it prints 721011081081113211911111410810033. This happens because the elements of the stream returned by "Hello world!".chars() are not char values but int values, so the int overloading of print is invoked. It is admittedly confusing that a method named chars returns a stream of int values. You could fix the program by using a cast to force the invocation of the correct overloading:

> 你可能希望它打印 Hello world!，但如果运行它，你会发现它打印 721011081081113211911111410810033。这是因为 `"Hello world!".chars()` 返回的流元素不是 char 值，而是 int 值，因此调用了 print 的 int 重载。无可否认，一个名为 chars 的方法返回一个 int 值流是令人困惑的。你可以通过强制调用正确的重载来修复程序：

```java
"Hello world!".chars().forEach(x -> System.out.print((char) x));
```

but ideally you should refrain from using streams to process char values. When you start using streams, you may feel the urge to convert all your loops into streams, but resist the urge. While it may be possible, it will likely harm the readability and maintainability of your code base. As a rule, even moderately complex tasks are best accomplished using some combination of streams and iteration, as illustrated by the Anagrams programs above. So **refactor existing code to use streams and use them in new code only where it makes sense to do so.**

> 但理想情况下，你应该避免使用流来处理 char 值。当你开始使用流时，你可能会有将所有循环转换为流的冲动，但是要抵制这种冲动。虽然这是可实施的，但它可能会损害代码库的可读性和可维护性。通常，即使是中等复杂的任务，也最好使用流和迭代的某种组合来完成，如上面的 Anagrams 程序所示。因此，**重构现有代码或是在新代码中，都应该在合适的场景使用流。**

As shown in the programs in this item, stream pipelines express repeated computation using function objects (typically lambdas or method references), while iterative code expresses repeated computation using code blocks. There are some things you can do from code blocks that you can’t do from function objects:

> 如本项中的程序所示，流管道使用函数对象（通常是 lambda 表达式或方法引用）表示重复计算，而迭代代码使用代码块表示重复计算。有些事情你可以对代码块做，而你不能对函数对象做：

- From a code block, you can read or modify any local variable in scope; from a lambda, you can only read final or effectively final variables [JLS 4.12.4], and you can’t modify any local variables.

> 从代码块中，可以读取或修改作用域中的任何局部变量；在 lambda 表达式中，只能读取 final 或有效的 final 变量 [JLS 4.12.4]，不能修改任何局部变量。

- From a code block, you can return from the enclosing method, break or continue an enclosing loop, or throw any checked exception that this method is declared to throw; from a lambda you can do none of these things.

> 从代码块中，可以从封闭方法返回、中断或继续封闭循环，或抛出声明要抛出的任何已检查异常；在 lambda 表达式中，你不能做这些事情。

If a computation is best expressed using these techniques, then it’s probably not a good match for streams. Conversely, streams make it very easy to do some things:

> 如果使用这些技术最好地表达计算，那么它可能不适合流。相反，流使做一些事情变得非常容易：

- Uniformly transform sequences of elements

> 元素序列的一致变换

- Filter sequences of elements

> 过滤元素序列

- Combine sequences of elements using a single operation (for example to add them, concatenate them, or compute their minimum)

> 使用单个操作组合元素序列（例如添加它们、连接它们或计算它们的最小值）

- Accumulate sequences of elements into a collection, perhaps grouping them by some common attribute

> 将元素序列累积到一个集合中，可能是按某个公共属性对它们进行分组

- Search a sequence of elements for an element satisfying some criterion

> 在元素序列中搜索满足某些条件的元素

If a computation is best expressed using these techniques, then it is a good candidate for streams.

> 如果使用这些技术能够最好地表达计算，那么它就是流的一个很好的使用场景。

One thing that is hard to do with streams is to access corresponding elements from multiple stages of a pipeline simultaneously: once you map a value to some other value, the original value is lost. One workaround is to map each value to a pair object containing the original value and the new value, but this is not a satisfying solution, especially if the pair objects are required for multiple stages of a pipeline. The resulting code is messy and verbose, which defeats a primary purpose of streams. When it is applicable, a better workaround is to invert the mapping when you need access to the earlier-stage value.

> 使用流很难做到的一件事是从管道的多个阶段同时访问相应的元素：一旦你将一个值映射到另一个值，原始值就会丢失。一个解决方案是将每个值映射到包含原始值和新值的 pair 对象，但这不是一个令人满意的解决方案，特别是如果管道的多个阶段都需要 pair 对象的话。生成的代码混乱而冗长，这违背了流的主要目的。当它适用时，更好的解决方案是在需要访问早期阶段值时反转映射。

For example, let’s write a program to print the first twenty Mersenne primes. To refresh your memory, a Mersenne number is a number of the form 2p − 1. If p is prime, the corresponding Mersenne number may be prime; if so, it’s a Mersenne prime. As the initial stream in our pipeline, we want all the prime numbers. Here’s a method to return that (infinite) stream. We assume a static import has been used for easy access to the static members of BigInteger:

> 例如，让我们编写一个程序来打印前 20 个 Mersenne 素数。刷新你的记忆,一个 Mersenne 素数的数量是一个数字形式 2p − 1。如果 p 是素数，对应的 Mersenne 数可以是素数；如果是的话，这就是 Mersenne 素数。作为管道中的初始流，我们需要所有质数。这里有一个返回（无限）流的方法。我们假设已经使用静态导入来方便地访问 BigInteger 的静态成员：

```java
static Stream<BigInteger> primes() {
    return Stream.iterate(TWO, BigInteger::nextProbablePrime);
}
```

The name of the method (primes) is a plural noun describing the elements of the stream. This naming convention is highly recommended for all methods that return streams because it enhances the readability of stream pipelines. The method uses the static factory Stream.iterate, which takes two parameters: the first element in the stream, and a function to generate the next element in the stream from the previous one. Here is the program to print the first twenty Mersenne primes:

> 方法的名称（素数）是描述流元素的复数名词。强烈推荐所有返回流的方法使用这种命名约定，因为它增强了流管道的可读性。该方法使用静态工厂 `Stream.iterate`，它接受两个参数：流中的第一个元素和一个函数，用于从前一个元素生成流中的下一个元素。下面是打印前 20 个 Mersenne 素数的程序：

```java
public static void main(String[] args) {
    primes().map(p -> TWO.pow(p.intValueExact()).subtract(ONE))
    .filter(mersenne -> mersenne.isProbablePrime(50))
    .limit(20)
    .forEach(System.out::println);
}
```

This program is a straightforward encoding of the prose description above: it starts with the primes, computes the corresponding Mersenne numbers, filters out all but the primes (the magic number 50 controls the probabilistic primality test), limits the resulting stream to twenty elements, and prints them out.

> 这个程序是上述散文描述的一个简单编码：它从素数开始，计算相应的 Mersenne 数，过滤掉除素数以外的所有素数（魔法数字 50 控制概率素数测试），将结果流限制为 20 个元素，并打印出来。

Now suppose that we want to precede each Mersenne prime with its exponent (p). This value is present only in the initial stream, so it is inaccessible in the terminal operation, which prints the results. Luckily, it’s easy to compute the exponent of a Mersenne number by inverting the mapping that took place in the first intermediate operation. The exponent is simply the number of bits in the binary representation, so this terminal operation generates the desired result:

> 现在假设我们想要在每个 Mersenne 素数之前加上它的指数 (p)，这个值只在初始流中存在，因此在输出结果的终端操作中是不可访问的。幸运的是，通过对第一个中间操作中发生的映射求逆，可以很容易地计算出 Mersenne 数的指数。指数仅仅是二进制表示的比特数，因此这个终端操作产生了想要的结果：

```java
.forEach(mp -> System.out.println(mp.bitLength() + ": " + mp));
```

There are plenty of tasks where it is not obvious whether to use streams or iteration. For example, consider the task of initializing a new deck of cards. Assume that Card is an immutable value class that encapsulates a Rank and a Suit, both of which are enum types. This task is representative of any task that requires computing all the pairs of elements that can be chosen from two sets. Mathematicians call this the Cartesian product of the two sets. Here’s an iterative implementation with a nested for-each loop that should look very familiar to you:

> 在许多任务中，使用流还是迭代并不明显。例如，考虑初始化一副新纸牌的任务。假设 Card 是一个不可变的值类，它封装了 Rank 和 Suit，它们都是 enum 类型。此任务代表需要计算可从两个集合中选择的所有元素对的任何任务。数学家称之为这两个集合的笛卡尔积。下面是一个嵌套 for-each 循环的迭代实现，你应该非常熟悉它：

```java
// Iterative Cartesian product computation
private static List<Card> newDeck() {
    List<Card> result = new ArrayList<>();
    for (Suit suit : Suit.values())
    for (Rank rank : Rank.values())
    result.add(new Card(suit, rank));
    return result;
}
```

And here is a stream-based implementation that makes use of the intermediate operation flatMap. This operation maps each element in a stream to a stream and then concatenates all of these new streams into a single stream (or flattens them). Note that this implementation contains a nested lambda, shown in boldface:

> 这是一个基于流的实现，它使用了中间操作 flatMap。此操作将流中的每个元素映射到流，然后将所有这些新流连接到单个流中（或将其扁平化）。注意，这个实现包含一个嵌套 lambda 表达式，用粗体显示:

```java
// Stream-based Cartesian product computation
private static List<Card> newDeck() {
    return Stream.of(Suit.values())
    .flatMap(suit ->Stream.of(Rank.values())
    .map(rank -> new Card(suit, rank)))
    .collect(toList());
}
```

Which of the two versions of newDeck is better? It boils down to personal preference and the environment in which you’re programming. The first version is simpler and perhaps feels more natural. A larger fraction of Java programmers will be able to understand and maintain it, but some programmers will feel more comfortable with the second (stream-based) version. It’s a bit more concise and not too difficult to understand if you’re reasonably well-versed in streams and functional programming. If you’re not sure which version you prefer, the iterative version is probably the safer choice. If you prefer the stream version and you believe that other programmers who will work with the code will share your preference, then you should use it.

> 两个版本的 newDeck 哪个更好？这可以归结为个人偏好和编程环境。第一个版本更简单，可能感觉更自然。大部分 Java 程序员将能够理解和维护它，但是一些程序员将对第二个（基于流的）版本感到更舒服。如果你相当精通流和函数式编程，那么它会更简洁，也不会太难理解。如果你不确定你更喜欢哪个版本，迭代版本可能是更安全的选择。如果你更喜欢流版本，并且相信与代码一起工作的其他程序员也会分享你的偏好，那么你应该使用它。

In summary, some tasks are best accomplished with streams, and others with iteration. Many tasks are best accomplished by combining the two approaches. There are no hard and fast rules for choosing which approach to use for a task, but there are some useful heuristics. In many cases, it will be clear which approach to use; in some cases, it won’t. If you’re not sure whether a task is better served by streams or iteration, try both and see which works better.

> 总之，有些任务最好使用流来完成，有些任务最好使用迭代来完成。许多任务最好通过结合这两种方法来完成。对于选择任务使用哪种方法，没有硬性的规则，但是有一些有用的启发。在许多情况下，使用哪种方法是清楚的；在某些情况下很难决定。如果你不确定一个任务是通过流还是通过迭代更好地完成，那么同时尝试这两种方法，看看哪一种更有效。

---

## 【46】在流中使用无副作用的函数

> Prefer side-effect-free functions in streams

If you’re new to streams, it can be difficult to get the hang of them. Merely expressing your computation as a stream pipeline can be hard. When you succeed, your program will run, but you may realize little if any benefit. Streams isn’t just an API, it’s a paradigm based on functional programming. In order to obtain the expressiveness, speed, and in some cases parallelizability that streams have to offer, you have to adopt the paradigm as well as the API.

> 如果你是流的新手，可能很难掌握它们。仅仅将计算表示为流管道是困难的。当你成功时，你的程序可以运行，但你可能意识不到什么好处。流不仅仅是一个 API，它是一个基于函数式编程的范式。为了获得流提供的可表达性、速度以及在某些情况下的并行性，你必须采纳范式和 API。

The most important part of the streams paradigm is to structure your computation as a sequence of transformations where the result of each stage is as close as possible to a pure function of the result of the previous stage. A pure function is one whose result depends only on its input: it does not depend on any mutable state, nor does it update any state. In order to achieve this, any function objects that you pass into stream operations, both intermediate and terminal, should be free of side-effects.

> 流范式中最重要的部分是将计算构造为一系列转换，其中每个阶段的结果都尽可能地接近上一阶段结果的纯函数。纯函数的结果只依赖于它的输入：它不依赖于任何可变状态，也不更新任何状态。为了实现这一点，传递到流操作（包括 Intermediate 操作和 Terminal 操作）中的任何函数对象都应该没有副作用。

**译注：流的操作类型分为以下几种：**

**1、Intermediate**

- 一个流可以后面跟随零个或多个 intermediate 操作。其目的主要是打开流，做出某种程度的数据映射/过滤，然后返回一个新的流，交给下一个操作使用。这类操作都是惰性化的（lazy），就是说，仅仅调用到这类方法，并没有真正开始流的遍历。常见的操作：map（mapToInt、flatMap 等）、filter、distinct、sorted、peek、limit、skip、parallel、sequential、unordered

**2、Terminal**

- 一个流只能有一个 terminal 操作，当这个操作执行后，流就被使用「光」了，无法再被操作。所以这必定是流的最后一个操作。Terminal 操作的执行，才会真正开始流的遍历，并且会生成一个结果，或者一个 side effect。常见的操作：forEach、forEachOrdered、toArray、reduce、collect、min、max、count、anyMatch、allMatch、noneMatch、findFirst、findAny、iterator

- 在对于一个流进行多次转换操作 (Intermediate 操作)，每次都对流的每个元素进行转换，而且是执行多次，这样时间复杂度就是 N（转换次数）个 for 循环里把所有操作都做掉的总和吗？其实不是这样的，转换操作都是 lazy 的，多个转换操作只会在 Terminal 操作的时候融合起来，一次循环完成。我们可以这样简单的理解，流里有个操作函数的集合，每次转换操作就是把转换函数放入这个集合中，在 Terminal 操作的时候循环流对应的集合，然后对每个元素执行所有的函数。

**3、short-circuiting**

- 对于一个 intermediate 操作，如果它接受的是一个无限大（infinite/unbounded）的流，但返回一个有限的新流。

- 对于一个 terminal 操作，如果它接受的是一个无限大的流，但能在有限的时间计算出结果。当操作一个无限大的流，而又希望在有限时间内完成操作，则在管道内拥有一个 short-circuiting 操作是必要非充分条件。常见的操作：anyMatch、allMatch、 noneMatch、findFirst、findAny、limit

Occasionally, you may see streams code that looks like this snippet, which builds a frequency table of the words in a text file:

> 偶尔，你可能会看到如下使用流的代码片段，它用于构建文本文件中单词的频率表：

```java
// Uses the streams API but not the paradigm--Don't do this!
Map<String, Long> freq = new HashMap<>();
try (Stream<String> words = new Scanner(file).tokens()) {
    words.forEach(word -> {
        freq.merge(word.toLowerCase(), 1L, Long::sum);
    });
}
```

What’s wrong with this code? After all, it uses streams, lambdas, and method references, and gets the right answer. Simply put, it’s not streams code at all; it’s iterative code masquerading as streams code. It derives no benefits from the streams API, and it’s (a bit) longer, harder to read, and less maintainable than the corresponding iterative code. The problem stems from the fact that this code is doing all its work in a terminal forEach operation, using a lambda that mutates external state (the frequency table). A forEach operation that does anything more than present the result of the computation performed by a stream is a “bad smell in code,” as is a lambda that mutates state. So how should this code look?

> 这段代码有什么问题？毕竟，它使用了流、lambda 表达式和方法引用，并得到了正确的答案。简单地说，它根本不是流代码，而是伪装成流代码的迭代代码。它没有从流 API 中获得任何好处，而且它（稍微）比相应的迭代代码更长、更难于阅读和更难以维护。这个问题源于这样一个事实：这段代码在一个 Terminal 操作中（forEach）执行它的所有工作，使用一个会改变外部状态的 lambda 表达式（频率表）。forEach 操作除了显示流执行的计算结果之外，还会执行其他操作，这是一种「代码中的不良习惯」，就像 lambda 表达式会改变状态一样。那么这段代码应该是什么样的呢？

```java
// Proper use of streams to initialize a frequency table
Map<String, Long> freq;
try (Stream<String> words = new Scanner(file).tokens()) {
    freq = words.collect(groupingBy(String::toLowerCase, counting()));
}
```

This snippet does the same thing as the previous one but makes proper use of the streams API. It’s shorter and clearer. So why would anyone write it the other way? Because it uses tools they’re already familiar with. Java programmers know how to use for-each loops, and the forEach terminal operation is similar. But the forEach operation is among the least powerful of the terminal operations and the least stream-friendly. It’s explicitly iterative, and hence not amenable to parallelization. **The forEach operation should be used only to report the result of a stream computation, not to perform the computation.** Occasionally, it makes sense to use forEach for some other purpose, such as adding the results of a stream computation to a preexisting collection.

> 这个代码片段与前面的代码片段做了相同的事情，但是正确地使用了流 API。它更短更清晰。为什么有人会用另一种方式写呢？因为它使用了他们已经熟悉的工具。Java 程序员知道如何使用 for-each 循环，并且与 forEach 操作是类似的。但是 forEach 操作是 Terminal 操作中功能最弱的操作之一，对流最不友好。它是显式迭代的，因此不适合并行化。**forEach 操作应该只用于报告流计算的结果，而不是执行计算。** 有时候，将 forEach 用于其他目的是有意义的，例如将流计算的结果添加到现有集合中。

The improved code uses a collector, which is a new concept that you have to learn in order to use streams. The Collectors API is intimidating: it has thirty-nine methods, some of which have as many as five type parameters. The good news is that you can derive most of the benefit from this API without delving into its full complexity. For starters, you can ignore the Collector interface and think of a collector as an opaque object that encapsulates a reduction strategy. In this context, reduction means combining the elements of a stream into a single object. The object produced by a collector is typically a collection (which accounts for the name collector).

> 改进后的代码使用了 collector，这是使用流必须学习的新概念。Collectors 的 API 令人生畏：它有 39 个方法，其中一些方法有多达 5 个类型参数。好消息是，你可以从这个 API 中获得大部分好处，而不必深入研究它的全部复杂性。对于初学者，可以忽略 Collector 接口，将 collector 视为封装了缩减策略的不透明对象。在这种情况下，缩减意味着将流的元素组合成单个对象。collector 生成的对象通常是一个集合（这也解释了为何命名为 collector）。

The collectors for gathering the elements of a stream into a true Collection are straightforward. There are three such collectors: toList(), toSet(), and toCollection(collectionFactory). They return, respectively, a set, a list, and a programmer-specified collection type. Armed with this knowledge, we can write a stream pipeline to extract a top-ten list from our frequency table.

> 将流的元素收集到一个真正的 Collection 中的 collector 非常简单。这样的 collector 有三种：`toList()`、`toSet()` 和 `toCollection(collectionFactory)`。它们分别返回 List、Set 和程序员指定的集合类型。有了这些知识，我们就可以编写一个流管道来从 freq 表中提取前 10 个元素来构成一个新 List。

```java
// Pipeline to get a top-ten list of words from a frequency table
List<String> topTen = freq.keySet().stream()
    .sorted(comparing(freq::get).reversed())
    .limit(10)
    .collect(toList());
```

Note that we haven’t qualified the toList method with its class, Collectors. **It is customary and wise to statically import all members of Collectors because it makes stream pipelines more readable.**

> 注意，我们还没有用它的类 Collectors 对 toList 方法进行限定。**静态导入 Collectors 的所有成员是习惯用法，也是明智的，因为这使流管道更具可读性。**

The only tricky part of this code is the comparator that we pass to sorted, comparing(freq::get).reversed(). The comparing method is a comparator construction method (Item 14) that takes a key extraction function. The function takes a word, and the “extraction” is actually a table lookup: the bound method reference freq::get looks up the word in the frequency table and returns the number of times the word appears in the file. Finally, we call reversed on the comparator, so we’re sorting the words from most frequent to least frequent. Then it’s a simple matter to limit the stream to ten words and collect them into a list.

> 这段代码中唯一棘手的部分是我们传递给 sorted 的 `comparing(freq::get).reversed()`。comparing 方法是 comparator 的一种构造方法（Item-14），它具有键提取功能。函数接受一个单词，而「提取」实际上是一个表查找：绑定方法引用 `freq::get` 在 freq 表中查找该单词，并返回该单词在文件中出现的次数。最后，我们在比较器上调用 reverse 函数，我们将单词从最频繁排序到最不频繁进行排序。然后，将流限制为 10 个单词并将它们收集到一个列表中。

The previous code snippets use Scanner’s stream method to get a stream over the scanner. This method was added in Java 9. If you’re using an earlier release, you can translate the scanner, which implements Iterator, into a stream using an adapter similar to the one in Item 47 (`streamOf(Iterable<E>)`).

> 前面的代码片段使用 Scanner 的流方法在扫描器上获取流。这个方法是在 Java 9 中添加的。如果使用的是较早的版本，则可以使用类似于 Item-47（`streamOf(Iterable<E>)`）中的适配器将实现 Iterator 的扫描程序转换为流。

So what about the other thirty-six methods in Collectors? Most of them exist to let you collect streams into maps, which is far more complicated than collecting them into true collections. Each stream element is associated with a key and a value, and multiple stream elements can be associated with the same key.

> 那么 Collectors 中的其他 36 个方法呢？它们中的大多数都允许你将流收集到 Map 中，这比将它们收集到真正的集合要复杂得多。每个流元素与一个键和一个值相关联，多个流元素可以与同一个键相关联。

The simplest map collector is toMap(keyMapper, valueMapper), which takes two functions, one of which maps a stream element to a key, the other, to a value. We used this collector in our fromString implementation in Item 34 to make a map from the string form of an enum to the enum itself:

> 最简单的 Map 收集器是 `toMap(keyMapper, valueMapper)`，它接受两个函数，一个将流元素映射到键，另一个映射到值。我们在 Item-34 中的 fromString 实现中使用了这个收集器来创建枚举的字符串形式到枚举本身的映射：

```java
// Using a toMap collector to make a map from string to enum
private static final Map<String, Operation> stringToEnum =Stream.of(values()).collect(toMap(Object::toString, e -> e));
```

This simple form of toMap is perfect if each element in the stream maps to a unique key. If multiple stream elements map to the same key, the pipeline will terminate with an IllegalStateException.

> 如果流中的每个元素映射到唯一的键，那么这种简单的 toMap 形式就是完美的。如果多个流元素映射到同一个键，管道将以 IllegalStateException 结束。

The more complicated forms of toMap, as well as the groupingBy method, give you various ways to provide strategies for dealing with such collisions. One way is to provide the toMap method with a merge function in addition to its key and value mappers. The merge function is a `BinaryOperator<V>`, where V is the value type of the map. Any additional values associated with a key are combined with the existing value using the merge function, so, for example, if the merge function is multiplication, you end up with a value that is the product of all the values associated with the key by the value mapper.

> toMap 更为复杂的形式，以及 groupingBy 方法，提供了各种方法来提供处理此类冲突的策略。一种方法是为 toMap 方法提供一个 merge 函数，以及它的键和值映射器。merge 函数是一个 `BinaryOperator<V>`，其中 V 是 Map 的值类型。与键关联的任何附加值都将使用 merge 函数与现有值组合，因此，例如，如果 merge 函数是乘法，那么你将得到一个值，该值是 value mapper 与键关联的所有值的乘积。

The three-argument form of toMap is also useful to make a map from a key to a chosen element associated with that key. For example, suppose we have a stream of record albums by various artists, and we want a map from recording artist to best-selling album. This collector will do the job.

> toMap 的三参数形式对于从键到与该键关联的所选元素的映射也很有用。例如，假设我们有一个由不同艺术家录制的唱片流，并且我们想要一个从唱片艺术家到畅销唱片的映射。这个 collector 将完成这项工作。

```java
// Collector to generate a map from key to chosen element for key
Map<Artist, Album> topHits = albums.collect(
        toMap(Album::artist, a->a, maxBy(comparing(Album::sales)
    )
));
```

Note that the comparator uses the static factory method maxBy, which is statically imported from BinaryOperator. This method converts a `Comparator<T>` into a `BinaryOperator<T>` that computes the maximum implied by the specified comparator. In this case, the comparator is returned by the comparator construction method comparing, which takes the key extractor function Album::sales. This may seem a bit convoluted, but the code reads nicely. Loosely speaking, it says, “convert the stream of albums to a map, mapping each artist to the album that has the best album by sales.” This is surprisingly close to the problem statement.

> 注意，比较器使用静态工厂方法 maxBy，该方法从 BinaryOperator 静态导入。此方法将 `Comparator<T>` 转换为 `BinaryOperator<T>`，该操作符计算指定比较器所隐含的最大值。在这种情况下，比较器是通过比较器构造方法返回的，比较器构造方法取 `Album::sales`。这看起来有点复杂，但是代码可读性很好。粗略地说，代码是这样描述的:「将专辑流转换为 Map，将每个艺人映射到销量最好的专辑。」这与问题的文字陈述惊人地接近。

Another use of the three-argument form of toMap is to produce a collector that imposes a last-write-wins policy when there are collisions. For many streams, the results will be nondeterministic, but if all the values that may be associated with a key by the mapping functions are identical, or if they are all acceptable, this collector’s s behavior may be just what you want:

> toMap 的三参数形式的另一个用途是生成一个 collector，当发生冲突时，它强制执行 last-write-wins 策略。对于许多流，结果将是不确定的，但如果映射函数可能与键关联的所有值都是相同的，或者它们都是可接受的，那么这个 collector 的行为可能正是你想要的：

```java
// Collector to impose last-write-wins policy
toMap(keyMapper, valueMapper, (v1, v2) -> v2)
```

The third and final version of toMap takes a fourth argument, which is a map factory, for use when you want to specify a particular map implementation such as an EnumMap or a TreeMap.

> toMap 的第三个也是最后一个版本采用了第四个参数，这是一个 Map 工厂，当你想要指定一个特定的 Map 实现（如 EnumMap 或 TreeMap）时，可以使用它。

There are also variant forms of the first three versions of toMap, named toConcurrentMap, that run efficiently in parallel and produce ConcurrentHashMap instances.

> 还有前三个版本的 toMap 的变体形式，名为 toConcurrentMap，它们可以有效地并行运行，同时生成 ConcurrentHashMap 实例。

In addition to the toMap method, the Collectors API provides the groupingBy method, which returns collectors to produce maps that group elements into categories based on a classifier function. The classifier function takes an element and returns the category into which it falls. This category serves as the element’s map key. The simplest version of the groupingBy method takes only a classifier and returns a map whose values are lists of all the elements in each category. This is the collector that we used in the Anagram program in Item 45 to generate a map from alphabetized word to a list of the words sharing the alphabetization:

> 除了 toMap 方法之外，collector API 还提供 groupingBy 方法，该方法返回 collector，以生成基于分类器函数将元素分组为类别的映射。分类器函数接受一个元素并返回它所属的类别。这个类别用作元素的 Map 键。groupingBy 方法的最简单版本只接受一个分类器并返回一个 Map，其值是每个类别中所有元素的列表。这是我们在 Item-45 的字谜程序中使用的收集器，用于生成从按字母顺序排列的单词到共享字母顺序的单词列表的映射：

```java
words.collect(groupingBy(word -> alphabetize(word)))
```

If you want groupingBy to return a collector that produces a map with values other than lists, you can specify a downstream collector in addition to a classifier. A downstream collector produces a value from a stream containing all the elements in a category. The simplest use of this parameter is to pass toSet(), which results in a map whose values are sets of elements rather than lists.

> 如果你希望 groupingBy 返回一个使用列表之外的值生成映射的收集器，你可以指定一个下游收集器和一个分类器。下游收集器从包含类别中的所有元素的流中生成一个值。这个参数最简单的用法是传递 toSet()，这会生成一个 Map，其值是 Set，而不是 List。

Alternatively, you can pass toCollection(collectionFactory), which lets you create the collections into which each category of elements is placed. This gives you the flexibility to choose any collection type you want. Another simple use of the two-argument form of groupingBy is to pass counting() as the downstream collector. This results in a map that associates each category with the number of elements in the category, rather than a collection containing the elements. That’s what you saw in the frequency table example at the beginning of this item:

> 或者，你可以传递 `toCollection(collectionFactory)`，它允许你创建集合，将每个类别的元素放入其中。这使你可以灵活地选择所需的任何集合类型。groupingBy 的两参数形式的另一个简单用法是将 `counting()` 作为下游收集器传递。这将生成一个 Map，该 Map 将每个类别与类别中的元素数量相关联，而不是包含元素的集合。这是你在这一项开始的 freq 表例子中看到的：

```java
Map<String, Long> freq = words.collect(groupingBy(String::toLowerCase, counting()));
```

The third version of groupingBy lets you specify a map factory in addition to a downstream collector. Note that this method violates the standard telescoping argument list pattern: the mapFactory parameter precedes, rather than follows, the downStream parameter. This version of groupingBy gives you control over the containing map as well as the contained collections, so, for example, you can specify a collector that returns a TreeMap whose values are TreeSets.

> groupingBy 的第三个版本允许你指定除了下游收集器之外的 Map 工厂。注意，这个方法违反了标准的可伸缩参数列表模式：mapFactory 参数位于下游参数之前，而不是之后。groupingBy 的这个版本允许你控制包含的 Map 和包含的集合，因此，例如，你可以指定一个收集器，该收集器返回一个 TreeMap，其值为 TreeSet。

The groupingByConcurrent method provides variants of all three overloadings of groupingBy. These variants run efficiently in parallel and produce ConcurrentHashMap instances. There is also a rarely used relative of groupingBy called partitioningBy. In lieu of a classifier method, it takes a predicate and returns a map whose key is a Boolean. There are two overloadings of this method, one of which takes a downstream collector in addition to a predicate.

> groupingByConcurrent 方法提供了 groupingBy 的所有三种重载的变体。这些变体可以有效地并行运行，并生成 ConcurrentHashMap 实例。还有一个与 groupingBy 关系不大的词，叫做 partitioningBy 。代替分类器方法，它接受一个 Predicate 并返回一个键为布尔值的 Map。此方法有两个重载，其中一个除了 Predicate 外还接受下游收集器。

The collectors returned by the counting method are intended only for use as downstream collectors. The same functionality is available directly on Stream, via the count method, so **there is never a reason to say collect(counting()).** There are fifteen more Collectors methods with this property. They include the nine methods whose names begin with summing, averaging, and summarizing (whose functionality is available on the corresponding primitive stream types). They also include all overloadings of the reducing method, and the filtering, mapping, flatMapping, and collectingAndThen methods. Most programmers can safely ignore the majority of these methods. From a design perspective, these collectors represent an attempt to partially duplicate the functionality of streams in collectors so that downstream collectors can act as “ministreams.”

> 计数方法返回的收集器仅用于作为下游收集器。相同的功能可以通过 count 方法直接在流上使用，**所以永远没有理由说 `collect(counting())`。** 还有 15 个具有此属性的收集器方法。它们包括 9 个方法，它们的名称以求和、平均和汇总开头（它们的功能在相应的原始流类型上可用）。它们还包括 reduce 方法的所有重载，以及过滤、映射、平面映射和 collectingAndThen 方法。大多数程序员可以安全地忽略这些方法中的大多数。从设计的角度来看，这些收集器试图部分复制收集器中的流的功能，以便下游收集器可以充当「迷你存储器」。

There are three Collectors methods we have yet to mention. Though they are in Collectors, they don’t involve collections. The first two are minBy and maxBy, which take a comparator and return the minimum or maximum element in the stream as determined by the comparator. They are minor generalizations of the min and max methods in the Stream interface and are the collector analogues of the binary operators returned by the like-named methods in BinaryOperator. Recall that we used BinaryOperator.maxBy in our best-selling album example.

> 我们还没有提到三种 Collectors 方法。虽然它们是在 Collectors 中，但它们不涉及收集。前两个是 minBy 和 maxBy，它们接受 comparator 并返回由 comparator 确定的流中的最小或最大元素。它们是流接口中最小和最大方法的一些小泛化，是 BinaryOperator 中同名方法返回的二进制操作符的 collector 类似物。回想一下，在我们最畅销的专辑示例中，我们使用了 `BinaryOperator.maxBy`。

The final Collectors method is joining, which operates only on streams of CharSequence instances such as strings. In its parameterless form, it returns a collector that simply concatenates the elements. Its one argument form takes a single CharSequence parameter named delimiter and returns a collector that joins the stream elements, inserting the delimiter between adjacent elements. If you pass in a comma as the delimiter, the collector returns a comma-separated values string (but beware that the string will be ambiguous if any of the elements in the stream contain commas). The three argument form takes a prefix and suffix in addition to the delimiter. The resulting collector generates strings like the ones that you get when you print a collection, for example [came, saw, conquered].

> 最后一个 Collectors 方法是 join，它只对 CharSequence 实例流（如字符串）执行操作。在其无参数形式中，它返回一个收集器，该收集器只是将元素连接起来。它的一个参数形式接受一个名为 delimiter 的 CharSequence 参数，并返回一个连接流元素的收集器，在相邻元素之间插入分隔符。如果传入逗号作为分隔符，收集器将返回逗号分隔的值字符串（但是要注意，如果流中的任何元素包含逗号，该字符串将是不明确的）。除了分隔符外，三参数形式还接受前缀和后缀。生成的收集器生成的字符串与打印集合时得到的字符串类似，例如 `[came, saw, conquer]`。

In summary, the essence of programming stream pipelines is side-effect-free function objects. This applies to all of the many function objects passed to streams and related objects. The terminal operation forEach should only be used to report the result of a computation performed by a stream, not to perform the computation. In order to use streams properly, you have to know about collectors. The most important collector factories are toList, toSet, toMap, groupingBy, and joining.

> 总之，流管道编程的本质是无副作用的函数对象。这适用于传递给流和相关对象的所有函数对象。Terminal 操作 forEach 只应用于报告由流执行的计算结果，而不应用于执行计算。为了正确使用流，你必须了解 collector。最重要的 collector 工厂是 toList、toSet、toMap、groupingBy 和 join。

---

## 【47】优先选择 Collection 而不是流作为返回类型

> Prefer Collection to Stream as a return type

Many methods return sequences of elements. Prior to Java 8, the obvious return types for such methods were the collection interfaces Collection, Set, and List; Iterable; and the array types. Usually, it was easy to decide which of these types to return. The norm was a collection interface. If the method existed solely to enable for-each loops or the returned sequence couldn’t be made to implement some Collection method (typically, contains(Object)), the Iterable interface was used. If the returned elements were primitive values or there were stringent performance requirements, arrays were used. In Java 8, streams were added to the platform, substantially complicating the task of choosing the appropriate return type for a sequence-returning method.

> 许多方法都返回元素序列。在 Java 8 之前，此类方法常见的返回类型是 Collection 集合接口，如 Set 和 List，另外还有 Iterable 以及数组类型。通常，很容易决定使用哪一种类型。标准是一个集合接口。如果方法的存在仅仅是为了支持 for-each 循环，或者无法使返回的序列实现某个集合方法（通常是 `contains(Object)`），则使用 Iterable 接口。如果返回的元素是基本数据类型或有严格的性能要求，则使用数组。在 Java 8 中，流被添加进来，这大大增加了为序列返回方法选择适当返回类型的复杂性。

You may hear it said that streams are now the obvious choice to return a sequence of elements, but as discussed in Item 45, streams do not make iteration obsolete: writing good code requires combining streams and iteration judiciously. If an API returns only a stream and some users want to iterate over the returned sequence with a for-each loop, those users will be justifiably upset. It is especially frustrating because the Stream interface contains the sole abstract method in the Iterable interface, and Stream’s specification for this method is compatible with Iterable’s. The only thing preventing programmers from using a for-each loop to iterate over a stream is Stream’s failure to extend Iterable.

> 你可能听说现在流是返回元素序列的明显选择，但是正如 Item-45 中所讨论的，流不会让迭代过时：编写好的代码需要明智地将流和迭代结合起来。如果一个 API 只返回一个流，而一些用户希望使用 for-each 循环遍历返回的序列，那么这些用户将会感到不适。这尤其令人沮丧，因为流接口包含 Iterable 接口中惟一的抽象方法，而且流对该方法的规范与 Iterable 的规范兼容。唯一阻止程序员使用 for-each 循环在流上迭代的是流不能扩展 Iterable。

Sadly, there is no good workaround for this problem. At first glance, it might appear that passing a method reference to Stream’s iterator method would work. The resulting code is perhaps a bit noisy and opaque, but not unreasonable:

> 遗憾的是，这个问题没有好的解决办法。乍一看，似乎将方法引用传递给流的 iterator 方法是可行的。生成的代码可能有点繁琐，不易理解，但并非不合理：

```java
// Won't compile, due to limitations on Java's type inference
for (ProcessHandle ph : ProcessHandle.allProcesses()::iterator) {
    // Process the process
}
```

Unfortunately, if you attempt to compile this code, you’ll get an error message:

> 不幸的是，如果你试图编译这段代码，你会得到一个错误消息：

```java
Test.java:6: error: method reference not expected here
for (ProcessHandle ph : ProcessHandle.allProcesses()::iterator) {
^
```

In order to make the code compile, you have to cast the method reference to an appropriately parameterized Iterable:

> 为了编译代码，你必须将方法引用转换为适当参数化的 Iterable：

```java
// Hideous workaround to iterate over a stream
for (ProcessHandle ph : (Iterable<ProcessHandle>)ProcessHandle.allProcesses()::iterator)
```

This client code works, but it is too noisy and opaque to use in practice. A better workaround is to use an adapter method. The JDK does not provide such a method, but it’s easy to write one, using the same technique used in-line in the snippets above. Note that no cast is necessary in the adapter method because Java’s type inference works properly in this context:

> 这个客户端代码可以工作，但是它太过繁琐并不易理解，无法在实践中使用。更好的解决方案是使用适配器方法。JDK 没有提供这样的方法，但是使用上面代码片段中使用的内联技术编写方法很容易。注意，适配器方法中不需要强制转换，因为 Java 的类型推断在此上下文中工作正常：

```java
// Adapter from Stream<E> to Iterable<E>
public static <E> Iterable<E> iterableOf(Stream<E> stream) {
    return stream::iterator;
}
```

With this adapter, you can iterate over any stream with a for-each statement:

> 使用此适配器，你可以使用 for-each 语句遍历任何流：

```java
for (ProcessHandle p : iterableOf(ProcessHandle.allProcesses())) {
    // Process the process
}
```

Note that the stream versions of the Anagrams program in Item 34 use the Files.lines method to read the dictionary, while the iterative version uses a scanner. The Files.lines method is superior to a scanner, which silently swallows any exceptions encountered while reading the file. Ideally, we would have used Files.lines in the iterative version too. This is the sort of compromise that programmers will make if an API provides only stream access to a sequence and they want to iterate over the sequence with a for-each statement.

> 注意，Item-34 中 Anagrams 程序的流版本使用 `Files.lines` 读取字典，而迭代版本使用扫描器。`Files.lines` 方法优于扫描器，扫描器在读取文件时静默地接收任何异常。理想情况下，我们在 `Files.lines` 的迭代版本也应该如此。如果一个 API 只提供对一个序列的流访问，而程序员希望用 for-each 语句遍历该序列，那么这是程序员会做出的一种妥协。

Conversely, a programmer who wants to process a sequence using a stream pipeline will be justifiably upset by an API that provides only an Iterable. Again the JDK does not provide an adapter, but it’s easy enough to write one:

> 相反，如果程序员希望使用流管道来处理序列，那么只提供可迭代的 API 就会有理由让他心烦。JDK 同样没有提供适配器，但是编写适配器非常简单：

```java
// Adapter from Iterable<E> to Stream<E>
public static <E> Stream<E> streamOf(Iterable<E> iterable) {
    return StreamSupport.stream(iterable.spliterator(), false);
}
```

If you’re writing a method that returns a sequence of objects and you know that it will only be used in a stream pipeline, then of course you should feel free to return a stream. Similarly, a method returning a sequence that will only be used for iteration should return an Iterable. But if you’re writing a public API that returns a sequence, you should provide for users who want to write stream pipelines as well as those who want to write for-each statements, unless you have a good reason to believe that most of your users will want to use the same mechanism.

> 如果你正在编写一个返回对象序列的方法，并且你知道它只会在流管道中使用，那么你当然应该可以随意返回流。类似地，返回仅用于迭代的序列的方法应该返回一个 Iterable。但是如果你写一个公共 API，它返回一个序列，你应该兼顾想写流管道以及想写 for-each 语句的用户，除非你有充分的理由相信大多数用户想要使用相同的机制。

The Collection interface is a subtype of Iterable and has a stream method, so it provides for both iteration and stream access. Therefore, **Collection or an appropriate subtype is generally the best return type for a public, sequence-returning method.** Arrays also provide for easy iteration and stream access with the Arrays.asList and Stream.of methods. If the sequence you’re returning is small enough to fit easily in memory, you’re probably best off returning one of the standard collection implementations, such as ArrayList or HashSet. But **do not store a large sequence in memory just to return it as a collection.**

> Collection 接口是 Iterable 的一个子类型，它有一个流方法，因此它提供了迭代和流两种访问方式。因此，**Collection 或其适当的子类通常是公共序列返回方法的最佳返回类型。** 数组还提供了使用 `Arrays.asList` 和 `Stream.of` 方法进行简单迭代和流访问。如果返回的序列足够小，可以轻松地装入内存，那么最好返回标准集合实现之一，例如 ArrayList 或 HashSet。但是 **不要将一个大的序列存储在内存中，只是为了将它作为一个集合返回。**

If the sequence you’re returning is large but can be represented concisely, consider implementing a special-purpose collection. For example, suppose you want to return the power set of a given set, which consists of all of its subsets. The power set of `{a, b, c}` is `[{}, {a}, {b}, {c}, {a, b}, {a, c}, {b, c}, {a, b, c}]`. If a set has n elements, its power set has 2n. Therefore, you shouldn’t even consider storing the power set in a standard collection implementation. It is, however, easy to implement a custom collection for the job with the help of AbstractList.

> 如果返回的序列比较大，但是可以有规律地表示，那么可以考虑实现一个特殊用途的集合。例如，假设你想要返回给定集合的幂集，该集合由它的所有子集组成。`{a, b, c}` 的排列组合有 `[{}, {a}, {b}, {c}, {a, b}, {a, c}, {b, c}, {a, b, c}]`。如果一个集合有 n 个元素，它的幂集有 2<sup>n</sup>。因此，你甚至不应该考虑在标准集合实现中存储全部排列组合。然而，在 AbstractList 的帮助下，可以很容易实现这个需求的自定义集合。

The trick is to use the index of each element in the power set as a bit vector, where the nth bit in the index indicates the presence or absence of the nth element from the source set. In essence, there is a natural mapping between the binary numbers from 0 to 2n − 1 and the power set of an n-element set. Here’s the code:

> 诀窍是使用索引幂集的每个元素设置一个位向量，在该指数的 n 位表示第 n 个元素的存在与否从源。在本质上，之间有一个自然的映射二进制数字从 0 到 2n−1 和一组 n 元的幂集。这是代码：

```java
// Returns the power set of an input set as custom collection
public class PowerSet {
    public static final <E> Collection<Set<E>> of(Set<E> s) {
        List<E> src = new ArrayList<>(s);
        if (src.size() > 30)
            throw new IllegalArgumentException("Set too big " + s);

        return new AbstractList<Set<E>>() {
            @Override
            public int size() {
                return 1 << src.size(); // 2 to the power srcSize
            }

            @Override
            public boolean contains(Object o) {
                return o instanceof Set && src.containsAll((Set)o);
            }

            @Override
            public Set<E> get(int index) {
                Set<E> result = new HashSet<>();
                for (int i = 0; index != 0; i++, index >>= 1)
                    if ((index & 1) == 1)
                        result.add(src.get(i));
                return result;
            }
        };
    }
}
```

Note that PowerSet.of throws an exception if the input set has more than 30 elements. This highlights a disadvantage of using Collection as a return type rather than Stream or Iterable: Collection has an int-returning size method, which limits the length of the returned sequence to Integer.MAX_VALUE, or 231 − 1. The Collection specification does allow the size method to return 231 − 1 if the collection is larger, even infinite, but this is not a wholly satisfying solution.

> 注意，如果输入集包含超过 30 个元素，`PowerSet.of` 将抛出异常。这突出的缺点使用 Collection 作为返回类型而不是流或 Iterable：收集 int-returning 大小的方法,这限制了 Integer.MAX_VALUE 返回序列的长度，或 231−1。收集规范允许大小方法返回 231−1 如果集合更大，甚至是无限的,但这不是一个完全令人满意的解决方案。

In order to write a Collection implementation atop AbstractCollection, you need implement only two methods beyond the one required for Iterable: contains and size. Often it’s easy to write efficient implementations of these methods. If it isn’t feasible, perhaps because the contents of the sequence aren’t predetermined before iteration takes place, return a stream or iterable, whichever feels more natural. If you choose, you can return both using two separate methods.

> 为了在 AbstractCollection 之上编写 Collection 实现，除了 Iterable 所需的方法外，只需要实现两个方法：contains 和 size。通常很容易编写这些方法的有效实现。如果它是不可行的，可能是因为序列的内容在迭代发生之前没有预先确定，那么返回一个流或 iterable，以感觉更自然的方式返回。如果你选择，你可以使用两个不同的方法返回这两个值。

There are times when you’ll choose the return type based solely on ease of implementation. For example, suppose you want to write a method that returns all of the (contiguous) sublists of an input list. It takes only three lines of code to generate these sublists and put them in a standard collection, but the memory required to hold this collection is quadratic in the size of the source list. While this is not as bad as the power set, which is exponential, it is clearly unacceptable. Implementing a custom collection, as we did for the power set, would be tedious, more so because the JDK lacks a skeletal Iterator implementation to help us.

> 有时，你将仅根据实现的易用性来选择返回类型。例如，假设你想编写一个返回输入列表的所有（连续的）子列表的方法。生成这些子列表并将它们放入标准集合中只需要三行代码，但是保存该集合所需的内存是源列表大小的二次方。虽然这没有幂集那么糟糕，幂集是指数的，但显然是不可接受的。实现自定义集合（就像我们为 power 集所做的那样）将会非常繁琐，因为 JDK 缺少一个框架迭代器实现来帮助我们。

It is, however, straightforward to implement a stream of all the sublists of an input list, though it does require a minor insight. Let’s call a sublist that contains the first element of a list a prefix of the list. For example, the prefixes of (a, b, c) are (a), (a, b), and (a, b, c). Similarly, let’s call a sublist that contains the last element a suffix, so the suffixes of (a, b, c) are (a, b, c), (b, c), and (c). The insight is that the sublists of a list are simply the suffixes of the prefixes (or identically, the prefixes of the suffixes) and the empty list. This observation leads directly to a clear, reasonably concise implementation:

> 然而，实现一个输入列表的所有子列表的流是很简单的，尽管它确实需要一些深入的了解。让我们将包含列表的第一个元素的子列表称为列表的前缀。例如，`(a,b,c)` 的前缀 `(a)`、`(a、b)` 和 `(a,b,c)`。类似地，让我们调用包含最后一个元素后缀的子列表，因此 `(a, b, c)` 的后缀是 `(a, b, c)`、`(b, c)` 和 `(c)`。我们的理解是，列表的子列表仅仅是前缀的后缀（或后缀的前缀相同）和空列表。这个观察直接导致了一个清晰、合理、简洁的实现：

```java
// Returns a stream of all the sublists of its input list
public class SubLists {
    public static <E> Stream<List<E>> of(List<E> list) {
        return Stream.concat(Stream.of(Collections.emptyList()),prefixes(list).flatMap(SubLists::suffixes));
    }

    private static <E> Stream<List<E>> prefixes(List<E> list) {
        return IntStream.rangeClosed(1, list.size()).mapToObj(end -> list.subList(0, end));
    }

    private static <E> Stream<List<E>> suffixes(List<E> list) {
        return IntStream.range(0, list.size()).mapToObj(start -> list.subList(start, list.size()));
    }
}
```

Note that the Stream.concat method is used to add the empty list into the returned stream. Also note that the flatMap method (Item 45) is used to generate a single stream consisting of all the suffixes of all the prefixes. Finally, note that we generate the prefixes and suffixes by mapping a stream of consecutive int values returned by IntStream.range and IntStream.rangeClosed. This idiom is, roughly speaking, the stream equivalent of the standard for-loop on integer indices. Thus, our sublist implementation is similar in spirit to the obvious nested for-loop:

> 注意 `Stream.concat` 方法将空列表添加到返回的流中。还要注意，flatMap 方法（Item-45）用于生成由所有前缀的所有后缀组成的单一流。最后，请注意，我们通过映射由 `IntStream.range` 和 `IntStream.rangeClosed` 返回的连续 int 值流来生成前缀和后缀。因此，我们的子列表实现在本质上类似于嵌套的 for 循环：

```java
for (int start = 0; start < src.size(); start++)
    for (int end = start + 1; end <= src.size(); end++)
        System.out.println(src.subList(start, end));
```

It is possible to translate this for-loop directly into a stream. The result is more concise than our previous implementation, but perhaps a bit less readable. It is similar in spirit to the streams code for the Cartesian product in Item 45:

> 可以将这个 for 循环直接转换为流。结果比我们以前的实现更简洁，但可读性可能稍差。它在形态上类似于 Item-45 中 Cartesian 的 streams 代码：

```java
// Returns a stream of all the sublists of its input list
public static <E> Stream<List<E>> of(List<E> list) {
    return IntStream.range(0, list.size())
    .mapToObj(start ->
    IntStream.rangeClosed(start + 1, list.size())
    .mapToObj(end -> list.subList(start, end)))
    .flatMap(x -> x);
}
```

Like the for-loop that precedes it, this code does not emit the empty list. In order to fix this deficiency, you could either use concat, as we did in the previous version, or replace 1 by (int) Math.signum(start) in the rangeClosed call.

> 与前面的 for 循环一样，该代码不发出空列表。为了修复这个缺陷，你可以使用 concat，就像我们在上一个版本中所做的那样，或者在 rangeClosed 调用中将 1 替换为 `(int) Math.signum(start)`。

Either of these stream implementations of sublists is fine, but both will require some users to employ a Stream-to-Iterable adapter or to use a stream in places where iteration would be more natural. Not only does the Stream-to- Iterable adapter clutter up client code, but it slows down the loop by a factor of 2.3 on my machine. A purpose-built Collection implementation (not shown here) is considerably more verbose but runs about 1.4 times as fast as our stream-based implementation on my machine.

> 子列表的这两种流实现都可以，但是都需要一些用户使用流到迭代的适配器，或者在迭代更自然的地方使用流。流到迭代适配器不仅打乱了客户机代码，而且在我的机器上，它还将循环速度降低了 2.3 倍。专门构建的集合实现（这里没有显示）非常冗长，但是运行速度是我的机器上基于流的实现的 1.4 倍。

In summary, when writing a method that returns a sequence of elements, remember that some of your users may want to process them as a stream while others may want to iterate over them. Try to accommodate both groups. If it’s feasible to return a collection, do so. If you already have the elements in a collection or the number of elements in the sequence is small enough to justify creating a new one, return a standard collection such as ArrayList. Otherwise, consider implementing a custom collection as we did for the power set. If it isn’t feasible to return a collection, return a stream or iterable, whichever seems more natural. If, in a future Java release, the Stream interface declaration is modified to extend Iterable, then you should feel free to return streams because they will allow for both stream processing and iteration.

> 总之，在编写返回元素序列的方法时，请记住，有些用户可能希望将它们作为流处理，而有些用户可能希望对它们进行迭代。试着适应这两个群体。如果可以返回集合，那么就这样做。如果你已经在一个集合中拥有了元素，或者序列中的元素数量足够小，可以创建一个新的元素，那么返回一个标准集合，例如 ArrayList 。否则，请考虑像对 power 集那样实现自定义集合。如果返回集合不可行，则返回流或 iterable，以看起来更自然的方式返回。如果在未来的 Java 版本中，流接口声明被修改为可迭代的，那么你应该可以随意返回流，因为它们将允许流处理和迭代。

---

## 【48】谨慎使用并行流

> Use caution when making streams parallel

Among mainstream languages, Java has always been at the forefront of providing facilities to ease the task of concurrent programming. When Java was released in 1996, it had built-in support for threads, with synchronization and wait/notify. Java 5 introduced the java.util.concurrent library, with concurrent collections and the executor framework. Java 7 introduced the fork-join package, a high-performance framework for parallel decomposition. Java 8 introduced streams, which can be parallelized with a single call to the parallel method. Writing concurrent programs in Java keeps getting easier, but writing concurrent programs that are correct and fast is as difficult as it ever was. Safety and liveness violations are a fact of life in concurrent programming, and parallel stream pipelines are no exception.

> 在主流语言中，Java 一直走在提供简化并发编程任务工具的前列。当 Java 在 1996 年发布时，它内置了对线程的支持，支持同步和 wait/notify。Java 5 引入了 `java.util.concurrent`。具有并发集合和执行器框架的并发库。Java 7 引入了 fork-join 包，这是一个用于并行分解的高性能框架。Java 8 引入了流，它可以通过对 parallel 方法的一次调用来并行化。用 Java 编写并发程序变得越来越容易，但是编写正确且快速的并发程序却和以前一样困难。在并发编程中，安全性和活性的违反是不可避免的，并行流管道也不例外。

Consider this program from Item 45:

> 考虑 Item-45 的程序：

```java
// Stream-based program to generate the first 20 Mersenne primes
public static void main(String[] args) {
    primes().map(p -> TWO.pow(p.intValueExact()).subtract(ONE))
    .filter(mersenne -> mersenne.isProbablePrime(50))
    .limit(20)
    .forEach(System.out::println);
}

static Stream<BigInteger> primes() {
    return Stream.iterate(TWO, BigInteger::nextProbablePrime);
}
```

On my machine, this program immediately starts printing primes and takes 12.5 seconds to run to completion. Suppose I naively try to speed it up by adding a call to parallel() to the stream pipeline. What do you think will happen to its performance? Will it get a few percent faster? A few percent slower? Sadly, what happens is that it doesn’t print anything, but CPU usage spikes to 90 percent and stays there indefinitely (a liveness failure). The program might terminate eventually, but I was unwilling to find out; I stopped it forcibly after half an hour.

> 在我的机器上，这个程序立即开始打印素数，运行 12.5 秒完成。假设我天真地尝试通过向流管道添加对 `parallel()` 的调用来加速它。你认为它的性能会怎么样？它会快几个百分点吗？慢了几个百分点？遗憾的是，它不会打印任何东西，但是 CPU 使用率会飙升到 90%，并且会无限期地停留在那里（活跃性失败）。这个项目最终可能会终止，但我不愿意知道；半小时后我强行停了下来。

What’s going on here? Simply put, the streams library has no idea how to parallelize this pipeline and the heuristics fail. Even under the best of circumstances, **parallelizing a pipeline is unlikely to increase its performance if the source is from Stream.iterate, or the intermediate operation limit is used.** This pipeline has to contend with both of these issues. Worse, the default parallelization strategy deals with the unpredictability of limit by assuming there’s no harm in processing a few extra elements and discarding any unneeded results. In this case, it takes roughly twice as long to find each Mersenne prime as it did to find the previous one. Thus, the cost of computing a single extra element is roughly equal to the cost of computing all previous elements combined, and this innocuous-looking pipeline brings the automatic parallelization algorithm to its knees. The moral of this story is simple: **Do not parallelize stream pipelines indiscriminately.** The performance consequences may be disastrous.

> 这是怎么回事？简单地说，stream 库不知道如何并行化这个管道，因此启发式会失败。即使在最好的情况下，**如果源来自 `Stream.iterate` 或使用 Intermediate 操作限制，并行化管道也不太可能提高其性能。** 这条管道必须解决这两个问题。更糟糕的是，默认的并行化策略通过假设处理一些额外的元素和丢弃任何不需要的结果没有害处来处理极限的不可预测性。在这种情况下，找到每一个 Mersenne 素数所需的时间大约是找到上一个 Mersenne 素数所需时间的两倍。因此，计算单个额外元素的成本大致等于计算之前所有元素的总和，而这条看上去毫无问题的管道将自动并行化算法推到了极致。这个故事的寓意很简单：**不要不加区别地将流管道并行化。** 性能后果可能是灾难性的。

As a rule, **performance gains from parallelism are best on streams over ArrayList, HashMap, HashSet, and ConcurrentHashMap instances; arrays; int ranges; and long ranges.** What these data structures have in common is that they can all be accurately and cheaply split into subranges of any desired sizes, which makes it easy to divide work among parallel threads. The abstraction used by the streams library to perform this task is the spliterator, which is returned by the spliterator method on Stream and Iterable.

> 通常，**并行性带来的性能提升在 ArrayList、HashMap、HashSet 和 ConcurrentHashMap 实例上的流效果最好；int 数组和 long 数组也在其中。** 这些数据结构的共同之处在于，它们都可以被精确且廉价地分割成任意大小的子程序，这使得在并行线程之间划分工作变得很容易。stream 库用于执行此任务的抽象是 spliterator，它由流上的 spliterator 方法返回并可迭代。

Another important factor that all of these data structures have in common is that they provide good-to-excellent locality of reference when processed sequentially: sequential element references are stored together in memory. The objects referred to by those references may not be close to one another in memory, which reduces locality-of-reference. Locality-of-reference turns out to be critically important for parallelizing bulk operations: without it, threads spend much of their time idle, waiting for data to be transferred from memory into the processor’s cache. The data structures with the best locality of reference are primitive arrays because the data itself is stored contiguously in memory.

> 所有这些数据结构的另一个重要共同点是，当按顺序处理时，它们提供了从优秀到优秀的引用位置：顺序元素引用一起存储在内存中。这些引用引用的对象在内存中可能彼此不太接近，这降低了引用的位置。引用位置对于并行化批量操作非常重要：如果没有它，线程将花费大量时间空闲，等待数据从内存传输到处理器的缓存中。具有最佳引用位置的数据结构是基本数组，因为数据本身是连续存储在内存中的。

The nature of a stream pipeline’s terminal operation also affects the effectiveness of parallel execution. If a significant amount of work is done in the terminal operation compared to the overall work of the pipeline and that operation is inherently sequential, then parallelizing the pipeline will have limited effectiveness. The best terminal operations for parallelism are reductions, where all of the elements emerging from the pipeline are combined using one of Stream’s reduce methods, or prepackaged reductions such as min, max, count, and sum. The short-circuiting operations anyMatch, allMatch, and noneMatch are also amenable to parallelism. The operations performed by Stream’s collect method, which are known as mutable reductions, are not good candidates for parallelism because the overhead of combining collections is costly.

> 流管道 Terminal 操作的性质也会影响并行执行的有效性。如果与管道的总体工作相比，在 Terminal 操作中完成了大量的工作，并且该操作本质上是顺序的，那么管道的并行化将具有有限的有效性。并行性的最佳 Terminal 操作是缩减，其中来自管道的所有元素都使用流的缩减方法之一进行组合，或者使用预先打包的缩减，如最小、最大、计数和和。anyMatch、allMatch 和 noneMatch 的短路操作也适用于并行性。流的 collect 方法执行的操作称为可变缩减，它们不是并行性的好候选，因为组合集合的开销是昂贵的。

If you write your own Stream, Iterable, or Collection implementation and you want decent parallel performance, you must override the spliterator method and test the parallel performance of the resulting streams extensively. Writing high-quality spliterators is difficult and beyond the scope of this book.

> 如果你编写自己的流、Iterable 或 Collection 实现，并且希望获得良好的并行性能，则必须重写 spliterator 方法，并广泛地测试结果流的并行性能。编写高质量的 spliterator 是困难的，超出了本书的范围。

**Not only can parallelizing a stream lead to poor performance, including liveness failures; it can lead to incorrect results and unpredictable behavior** (safety failures). Safety failures may result from parallelizing a pipeline that uses mappers, filters, and other programmer-supplied function objects that fail to adhere to their specifications. The Stream specification places stringent requirements on these function objects. For example, the accumulator and combiner functions passed to Stream’s reduce operation must be associative, non-interfering, and stateless. If you violate these requirements (some of which are discussed in Item 46) but run your pipeline sequentially, it will likely yield correct results; if you parallelize it, it will likely fail, perhaps catastrophically. Along these lines, it’s worth noting that even if the parallelized Mersenne primes program had run to completion, it would not have printed the primes in the correct (ascending) order. To preserve the order displayed by the sequential version, you’d have to replace the forEach terminal operation with forEachOrdered, which is guaranteed to traverse parallel streams in encounter order.

> **并行化流不仅会导致糟糕的性能，包括活动失败；它会导致不正确的结果和不可预知的行为（安全故障）。** 如果管道使用映射器、过滤器和其他程序员提供的函数对象，而这些对象没有遵守其规范，则并行化管道可能导致安全故障。流规范对这些功能对象提出了严格的要求。例如，传递给流的 reduce 操作的累加器和组合器函数必须是关联的、不干扰的和无状态的。如果你违反了这些要求（其中一些要求在 Item-46 中讨论），但是按顺序运行管道，则可能会产生正确的结果；如果你并行化它，它很可能会失败，可能是灾难性的。沿着这些思路，值得注意的是，即使并行化的 Mersenne 素数程序运行到完成，它也不会以正确的（升序）顺序打印素数。为了保留序列版本所显示的顺序，你必须将 forEach 这一 Terminal 操作替换为 forEachOrdered，它保证按顺序遍历并行流。

Even assuming that you’re using an efficiently splittable source stream, a parallelizable or cheap terminal operation, and non-interfering function objects, you won’t get a good speedup from parallelization unless the pipeline is doing enough real work to offset the costs associated with parallelism. As a very rough estimate, the number of elements in the stream times the number of lines of code executed per element should be at least a hundred thousand [Lea14].

> 即使假设你正在使用一个高效的可分割源流、一个可并行化的或廉价的 Terminal 操作，以及不受干扰的函数对象，你也不会从并行化中获得良好的加速，除非管道正在做足够的实际工作来抵消与并行性相关的成本。作为一个非常粗略的估计，流中的元素数量乘以每个元素执行的代码行数至少应该是 100000 [Lea14]。

It’s important to remember that parallelizing a stream is strictly a performance optimization. As is the case for any optimization, you must test the performance before and after the change to ensure that it is worth doing (Item 67). Ideally, you should perform the test in a realistic system setting. Normally, all parallel stream pipelines in a program run in a common fork-join pool. A single misbehaving pipeline can harm the performance of others in unrelated parts of the system.

> 重要的是要记住，并行化流严格来说是一种性能优化。与任何优化一样，你必须在更改之前和之后测试性能，以确保它值得进行（Item-67）。理想情况下，你应该在实际的系统设置中执行测试。通常，程序中的所有并行流管道都在公共 fork-join 池中运行。一个行为不当的管道可能会损害系统中不相关部分的其他管道的性能。

If it sounds like the odds are stacked against you when parallelizing stream pipelines, it’s because they are. An acquaintance who maintains a multimillionline codebase that makes heavy use of streams found only a handful of places where parallel streams were effective. This does not mean that you should refrain from parallelizing streams. Under the right circumstances, it is possible to achieve near-linear speedup in the number of processor cores simply by adding a parallel call to a stream pipeline. Certain domains, such as machine learning and data processing, are particularly amenable to these speedups.

> 如果在并行化流管道时，听起来你的胜算非常大，那是因为它们确实如此。一位熟悉的人维护着大量使用流的数百万在线代码库，他发现只有少数几个地方并行流是有效的。这并不意味着你应该避免并行化流。在适当的情况下，可以通过向流管道添加并行调用来实现处理器内核数量的近乎线性的加速。某些领域，如机器学习和数据处理，特别适合于这些加速。

As a simple example of a stream pipeline where parallelism is effective, consider this function for computing π(n), the number of primes less than or equal to n:

> 作为一个简单的例子，一个流管道并行性是有效的，考虑这个函数计算 `π(n)`，质数数目小于或等于 n：

```java
// Prime-counting stream pipeline - benefits from parallelization
static long pi(long n) {
    return LongStream.rangeClosed(2, n)
    .mapToObj(BigInteger::valueOf)
    .filter(i -> i.isProbablePrime(50))
    .count();
}
```

On my machine, it takes 31 seconds to compute π(108) using this function. Simply adding a parallel() call reduces the time to 9.2 seconds:

> 在我的机器上，需要 31 秒计算 `π(108)` 使用这个函数。简单地添加 `parallel()` 调用将时间缩短到 9.2 秒：

```java
// Prime-counting stream pipeline - parallel version
static long pi(long n) {
    return LongStream.rangeClosed(2, n)
    .parallel()
    .mapToObj(BigInteger::valueOf)
    .filter(i -> i.isProbablePrime(50))
    .count();
}
```

In other words, parallelizing the computation speeds it up by a factor of 3.7 on my quad-core machine. It’s worth noting that this is not how you’d compute π(n) for large values of n in practice. There are far more efficient algorithms, notably Lehmer’s formula.

> 换句话说，在我的四核计算机上，并行化的计算速度提高了 3.7 倍。值得注意的是，这不是你如何计算 `π(n)` 为大 n 的值。有更有效的算法，特别是 Lehmer 公式。

If you are going to parallelize a stream of random numbers, start with a SplittableRandom instance rather than a ThreadLocalRandom (or the essentially obsolete Random). SplittableRandom is designed for precisely this use, and has the potential for linear speedup. ThreadLocalRandom is designed for use by a single thread, and will adapt itself to function as a parallel stream source, but won’t be as fast as SplittableRandom. Random synchronizes on every operation, so it will result in excessive, parallelism-killing contention.

> 如果要并行化一个随机数流，可以从一个 SplittableRandom 实例开始，而不是从一个 ThreadLocalRandom（或者本质上已经过时的 random）开始。SplittableRandom 正是为这种用途而设计的，它具有线性加速的潜力。ThreadLocalRandom 是为单个线程设计的，它将自适应为并行流源，但速度没有 SplittableRandom 快。随机同步每个操作，因此它将导致过度的并行争用。

In summary, do not even attempt to parallelize a stream pipeline unless you have good reason to believe that it will preserve the correctness of the computation and increase its speed. The cost of inappropriately parallelizing a stream can be a program failure or performance disaster. If you believe that parallelism may be justified, ensure that your code remains correct when run in parallel, and do careful performance measurements under realistic conditions. If your code remains correct and these experiments bear out your suspicion of increased performance, then and only then parallelize the stream in production code.

> 总之，甚至不要尝试并行化流管道，除非你有充分的理由相信它将保持计算的正确性以及提高速度。不适当地并行化流的代价可能是程序失败或性能灾难。如果你认为并行性是合理的，那么请确保你的代码在并行运行时保持正确，并在实际情况下进行仔细的性能度量。如果你的代码保持正确，并且这些实验证实了你对提高性能的怀疑，那么，并且只有这样，才能在生产代码中并行化流。

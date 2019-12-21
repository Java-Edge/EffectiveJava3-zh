# 第 2 章 创建和销毁对象

## 【01】考虑以静态工厂方法代替构造函数

> Consider static factory methods instead of constructors

The traditional way for a class to allow a client to obtain an instance is to provide a public constructor. There is another technique that should be a part of every programmer’s toolkit. A class can provide a public static factory method,which is simply a static method that returns an instance of the class. Here’s a simple example from Boolean (the boxed primitive class for boolean). This method translates a boolean primitive value into a Boolean object reference:

> 客户端获得实例的传统方式是由类提供一个公共构造函数。还有一种技术应该成为每个程序员技能树的一部分。一个类可以提供公共静态工厂方法，它只是一个返回类实例的静态方法。下面是一个来自 Boolean （boolean 的包装类）的简单示例。该方法将 boolean 基本类型转换为 Boolean 对象的引用：

```java
public static Boolean valueOf(boolean b) {
	return b ? Boolean.TRUE : Boolean.FALSE;
}
```

Note that a static factory method is not the same as the Factory Method pattern from Design Patterns [Gamma95]. The static factory method described in this item has no direct equivalent in Design Patterns.

> 要注意的是静态工厂方法与来自设计模式的工厂方法模式不同 [Gamma95]。本条目中描述的静态工厂方法在设计模式中没有直接等价的方法。

A class can provide its clients with static factory methods instead of, or in addition to, public constructors. Providing a static factory method instead of a public constructor has both advantages and disadvantages.

> 除了公共构造函数，一个类还可以通过静态工厂方法提供它的客户端。使用静态工厂方法而不是公共构造函数的方式既有优点也有缺点。

**One advantage of static factory methods is that, unlike constructors, they have names.** If the parameters to a constructor do not, in and of themselves, describe the object being returned, a static factory with a well-chosen name is easier to use and the resulting client code easier to read. For example, the constructor BigInteger(int, int, Random), which returns a BigInteger that is probably prime, would have been better expressed as a static factory method named BigInteger.probablePrime. (This method was added in Java 4.)

> **静态工厂方法与构造函数相比的第一个优点，静态工厂方法有确切名称。** 如果构造函数的参数本身并不能描述返回的对象，那么具有确切名称的静态工厂则更容易使用，生成的客户端代码也更容易阅读。例如，返回可能为素数的 BigInteger 类的构造函数 `BigInteger(int, int, Random)` 最好表示为名为 `BigInteger.probablePrime` 的静态工厂方法。（这个方法是在 Java 4 中添加的）

A class can have only a single constructor with a given signature.Programmers have been known to get around this restriction by providing two constructors whose parameter lists differ only in the order of their parameter types. This is a really bad idea. The user of such an API will never be able to remember which constructor is which and will end up calling the wrong one by mistake. People reading code that uses these constructors will not know what the code does without referring to the class documentation.

> 一个类只能有一个具有给定签名的构造函数。众所周知，程序员可以通过提供两个构造函数来绕过这个限制，这两个构造函数的参数列表仅在参数类型的顺序上有所不同。这真是个坏主意。面对这样一个 API，用户将永远无法记住该用哪个构造函数，并且最终会错误地调用不适合的构造函数。如果不参考类文档，阅读使用这些构造函数代码的人就不会知道代码的作用。

Because they have names, static factory methods don’t share the restriction discussed in the previous paragraph. In cases where a class seems to require multiple constructors with the same signature, replace the constructors with static factory methods and carefully chosen names to highlight their differences.

> 因为静态工厂方法有确切名称，所以它们没有前一段讨论的局限。如果一个类需要具有相同签名的多个构造函数，那么用静态工厂方法替换构造函数，并仔细选择名称以突出它们的区别。

**A second advantage of static factory methods is that, unlike constructors,they are not required to create a new object each time they’re invoked.** This allows immutable classes (Item 17) to use preconstructed instances, or to cache instances as they’re constructed, and dispense them repeatedly to avoid creating unnecessary duplicate objects. The Boolean.valueOf(boolean) method illustrates this technique: it never creates an object. This technique is similar to the Flyweight pattern [Gamma95]. It can greatly improve performance if equivalent objects are requested often, especially if they are expensive to create.

> **静态工厂方法与构造函数相比的第二个优点，静态工厂方法不需要在每次调用时创建新对象。** 这允许不可变类（Item-17）使用预先构造的实例，或在构造实例时缓存实例，并重复分配它们以避免创建不必要的重复对象。`Boolean.valueOf(boolean)` 方法说明了这种技术：它从不创建对象。这种技术类似于享元模式 [Gamma95]。如果经常请求相同的对象，特别是在创建对象的代价很高时，它可以极大地提高性能。

The ability of static factory methods to return the same object from repeated invocations allows classes to maintain strict control over what instances exist at any time. Classes that do this are said to be instance-controlled. There are several reasons to write instance-controlled classes. Instance control allows a class to guarantee that it is a singleton (Item 3) or noninstantiable (Item 4). Also,it allows an immutable value class (Item 17) to make the guarantee that no two equal instances exist: a.equals(b) if and only if a == b. This is the basis of the Flyweight pattern [Gamma95]. Enum types (Item 34) provide this guarantee.

> 静态工厂方法在重复调用中能够返回相同对象，这样的能力允许类在任何时候都能严格控制存在的实例。这样做的类被称为实例受控的类。编写实例受控的类有几个原因。实例控制允许一个类来保证它是一个单例（Item-3）或不可实例化的（Item-4）。同时，它允许一个不可变的值类（Item-17）保证不存在两个相同的实例：`a.equals(b)` 当且仅当 `a==b`。这是享元模式的基础 [Gamma95]。枚举类型（Item-34）提供了这种保证。

**译注：原文 noninstantiable 应修改为 non-instantiable ，译为「不可实例化的」**

**A third advantage of static factory methods is that, unlike constructors,they can return an object of any subtype of their return type.** This gives you great flexibility in choosing the class of the returned object.

> **静态工厂方法与构造函数相比的第三个优点，可以通过静态工厂方法获取返回类型的任何子类的对象。** 这为选择返回对象的类提供了很大的灵活性。

One application of this flexibility（n.灵活性，弹性，适应性） is that an API can return objects without making their classes public. Hiding implementation classes in this fashion leads to a very compact API. This technique lends itself to interface-based frameworks (Item 20), where interfaces provide natural return types for static factory methods.

> 这种灵活性的一个应用是 API 可以在不公开其类的情况下返回对象。以这种方式隐藏实现类会形成一个非常紧凑的 API。这种技术适用于基于接口的框架（Item-20），其中接口为静态工厂方法提供了自然的返回类型。

Prior to Java 8, interfaces couldn’t have static methods. By convention, static factory methods for an interface named Type were put in a noninstantiable companion（n.同伴，指南；vt.陪伴） class (Item 4) named Types. For example, the Java Collections Framework has forty-five utility implementations of its interfaces, providing unmodifiable collections, synchronized collections, and the like. Nearly all of these implementations are exported via static factory methods in one noninstantiable class (java.util.Collections). The classes of the returned objects are all nonpublic.

> 在 Java 8 之前，接口不能有静态方法。按照惯例，一个名为 Type 的接口的静态工厂方法被放在一个名为 Types 的不可实例化的伴随类（Item-4）中。例如，Java 的 Collections 框架有 45 个接口实用工具实现，提供了不可修改的集合、同步集合等。几乎所有这些实现都是通过一个非实例化类（`java.util.Collections`）中的静态工厂方法导出的。返回对象的类都是非公共的。

**译注：原文 noninstantiable 应修改为 non-instantiable ，译为「不可实例化的」**

The Collections Framework API is much smaller than it would have been had it exported forty-five separate public classes, one for each convenience implementation. It is not just the bulk of the API that is reduced but the conceptual（abj.概念上的） weight: the number and difficulty of the concepts that programmers must master in order to use the API. The programmer knows that the returned object has precisely the API specified by its interface, so there is no need to read additional class documentation for the implementation class. Furthermore, using such a static factory method requires the client to refer to the returned object by interface rather than implementation class, which is generally good practice (Item 64).

> Collections 框架 API 比它导出 45 个独立的公共类要小得多，每个公共类对应一个方便的实现。减少的不仅仅是 API 的数量，还有概念上的减少：程序员为了使用 API 必须掌握的概念的数量和难度。程序员知道返回的对象是由相关的接口精确地指定的，因此不需要为实现类阅读额外的类文档。此外，使用这种静态工厂方法需要客户端通过接口而不是实现类引用返回的对象，这通常是很好的做法（Item-64）。

As of（自..起） Java 8, the restriction that interfaces cannot contain static methods was eliminated, so there is typically little reason to provide a noninstantiable companion class for an interface. Many public static members that would have been at home in such a class should instead be put in the interface itself. Note,however, that it may still be necessary to put the bulk of the implementation code behind these static methods in a separate package-private class. This is because Java 8 requires all static members of an interface to be public. Java 9 allows private static methods, but static fields and static member classes are still required to be public.

> 自 Java 8 起，消除了接口不能包含静态方法的限制，因此通常没有理由为接口提供不可实例化的伴随类。许多公共静态成员应该放在接口本身中，而不是放在类中。但是，请注意，仍然有必要将这些静态方法背后的大部分实现代码放到单独的包私有类中。这是因为 Java 8 要求接口的所有静态成员都是公共的。Java 9 允许私有静态方法，但是静态字段和静态成员类仍然需要是公共的。

**A fourth advantage of static factories is that the class of the returned object can vary from call to call as a function of the input parameters.** Any subtype of the declared return type is permissible. The class of the returned object can also vary from release to release.

> **静态工厂的第四个优点是，返回对象的类可以随调用的不同而变化，作为输入参数的函数。** 声明的返回类型的任何子类型都是允许的。返回对象的类也可以因版本而异。

The EnumSet class (Item 36) has no public constructors, only static factories. In the OpenJDK implementation, they return an instance of one of two subclasses, depending on the size of the underlying enum type: if it has sixty-four or fewer elements, as most enum types do, the static factories return a RegularEnumSet instance, which is backed by a single long; if the enum type has sixty-five or more elements, the factories return a JumboEnumSet instance, backed by a long array.

> EnumSet 类（Item-36）没有公共构造函数，只有静态工厂。在 OpenJDK 实现中，它们返回两个子类中的一个实例，这取决于底层 enum 类型的大小：如果它有 64 个或更少的元素，就像大多数 enum 类型一样，静态工厂返回一个 long 类型的 RegularEnumSet 实例；如果 enum 类型有 65 个或更多的元素，工厂将返回一个由 `long[]` 类型的 JumboEnumSet 实例。

The existence of these two implementation classes is invisible to clients. If RegularEnumSet ceased to offer performance advantages for small enum types, it could be eliminated from a future release with no ill effects. Similarly, a future release could add a third or fourth implementation of EnumSet if it proved beneficial for performance. Clients neither know nor care about the class of the object they get back from the factory; they care only that it is some subclass of EnumSet.

> 客户端看不到这两个实现类的存在。如果 RegularEnumSet 不再为小型 enum 类型提供性能优势，它可能会在未来的版本中被消除，而不会产生不良影响。类似地，如果事实证明 EnumSet 有益于性能，未来的版本可以添加第三或第四个 EnumSet 实现。客户端既不知道也不关心从工厂返回的对象的类；它们只关心它是 EnumSet 的某个子类。

**A fifth advantage of static factories is that the class of the returned object need not exist when the class containing the method is written.** Such flexible static factory methods form the basis of service provider frameworks, like the Java Database Connectivity API (JDBC). A service provider framework is a system in which providers implement a service, and the system makes the implementations available to clients, decoupling the clients from the implementations.

> **静态工厂的第五个优点是，当编写包含方法的类时，返回对象的类不需要存在。** 这种灵活的静态工厂方法构成了服务提供者框架的基础，比如 Java 数据库连接 API（JDBC）。服务提供者框架是一个系统，其中提供者实现一个服务，系统使客户端可以使用这些实现，从而将客户端与实现分离。

There are three essential（n.本质，要素；adj.基本的，精华的） components in a service provider framework: a service interface, which represents an implementation; a provider registration API, which providers use to register implementations; and a service access API,which clients use to obtain instances of the service. The service access API may allow clients to specify criteria for choosing an implementation. In the absence of such criteria, the API returns an instance of a default implementation, or allows the client to cycle through all available implementations. The service access API is the flexible static factory that forms the basis of the service provider framework.

> 服务提供者框架中有三个基本组件：代表实现的服务接口；提供者注册 API，提供者使用它来注册实现，以及服务访问 API，客户端使用它来获取服务的实例。服务访问 API 允许客户端指定选择实现的标准。在没有这些条件的情况下，API 返回一个默认实现的实例，或者允许客户端循环使用所有可用的实现。服务访问 API 是灵活的静态工厂，它构成了服务提供者框架的基础。

An optional fourth component of a service provider framework is a service provider interface, which describes a factory object that produce instances of the service interface. In the absence of a service provider interface, implementations must be instantiated reflectively (Item 65). In the case of JDBC, Connection plays the part of the service interface, DriverManager.registerDriver is the provider registration API, DriverManager.getConnection is the service access API, and Driver is the service provider interface.

> 服务提供者框架的第四个可选组件是服务提供者接口，它描述了产生服务接口实例的工厂对象。在没有服务提供者接口的情况下，必须以反射的方式实例化实现（Item-65）。在 JDBC 中，连接扮演服务接口 DriverManager 的角色。`DriverManager.registerDriver` 是提供商注册的 API，`DriverManager.getConnection` 是服务访问 API，驱动程序是服务提供者接口。

There are many variants of the service provider framework pattern. For example, the service access API can return a richer service interface to clients than the one furnished by providers. This is the Bridge pattern [Gamma95]. Dependency injection frameworks (Item 5) can be viewed as powerful service providers. Since Java 6, the platform includes a general-purpose service provider framework, java.util.ServiceLoader, so you needn’t, and generally shouldn’t, write your own (Item 59). JDBC doesn’t use ServiceLoader, as the former predates（vt.先于） the latter.

> 服务提供者框架模式有许多变体。例如，服务访问 API 可以向客户端返回比提供者提供的更丰富的服务接口。这是桥接模式 [Gamma95]。依赖注入框架（Item-5）可以看作是强大的服务提供者。由于是 Java 6，该平台包括一个通用服务提供者框架 `Java.util.ServiceLoader`，所以你不需要，通常也不应该自己写（Item-59）。JDBC 不使用 ServiceLoader，因为前者比后者要早。

**The main limitation of providing only static factory methods is that classes without public or protected constructors cannot be subclassed.** For example, it is impossible to subclass any of the convenience implementation classes in the Collections Framework. Arguably this can be a blessing in disguise because it encourages programmers to use composition instead of inheritance (Item 18), and is required for immutable types (Item 17).

> **仅提供静态工厂方法的主要局限是，没有公共或受保护构造函数的类不能被子类化。** 例如，不可能在集合框架中子类化任何方便的实现类。这可能是一种因祸得福的做法，因为它鼓励程序员使用组合而不是继承（Item-18），并且对于不可变的类型（Item-17）是必需的。

**A second shortcoming of static factory methods is that they are hard for programmers to find.** They do not stand out in API documentation in the way that constructors do, so it can be difficult to figure out how to instantiate a class that provides static factory methods instead of constructors. The Javadoc tool may someday draw attention to static factory methods. In the meantime, you can reduce this problem by drawing attention to static factories in class or interface documentation and by adhering to common naming conventions. Here are some common names for static factory methods. This list is far from exhaustive:

> **静态工厂方法的第二个缺点是程序员很难找到它们。** 它们在 API 文档中不像构造函数那样引人注目，因此很难弄清楚如何实例化一个只提供静态工厂方法而没有构造函数的类。Javadoc 工具总有一天会关注到静态工厂方法。与此同时，你可以通过在类或接口文档中对静态工厂方法多加留意，以及遵守通用命名约定的方式来减少这个困扰。下面是一些静态工厂方法的常用名称。这个列表还远不够详尽：

- from—A type-conversion method that takes a single parameter and returns a corresponding instance of this type, for example:

> from，一种型转换方法，该方法接受单个参数并返回该类型的相应实例，例如：

```java
Date d = Date.from(instant);
```

- of—An aggregation method that takes multiple parameters and returns an instance of this type that incorporates them, for example:

> of，一个聚合方法，它接受多个参数并返回一个包含这些参数的实例，例如：

```java
Set<Rank> faceCards = EnumSet.of(JACK, QUEEN, KING);
```

- valueOf—A more verbose alternative to from and of, for example:

> valueOf，一种替代 from 和 of 但更冗长的方法，例如：

```java
BigInteger prime = BigInteger.valueOf(Integer.MAX_VALUE);
```

- instance or getInstance—Returns an instance that is described by its parameters (if any) but cannot be said to have the same value, for example:

> instance 或 getInstance，返回一个实例，该实例由其参数（如果有的话）描述，但不具有相同的值，例如：

```java
StackWalker luke = StackWalker.getInstance(options);
```

- create or newInstance—Like instance or getInstance, except that the method guarantees that each call returns a new instance, for example:

> create 或 newInstance，与 instance 或 getInstance 类似，只是该方法保证每个调用都返回一个新实例，例如：

```java
Object newArray = Array.newInstance(classObject, arrayLen);
```

- getType—Like getInstance, but used if the factory method is in a different class. Type is the type of object returned by the factory method, for example:

> getType，类似于 getInstance，但如果工厂方法位于不同的类中，则使用此方法。其类型是工厂方法返回的对象类型，例如：

```java
FileStore fs = Files.getFileStore(path);
```

- newType—Like newInstance, but used if the factory method is in a different class. Type is the type of object returned by the factory method, for example:

> newType，与 newInstance 类似，但是如果工厂方法在不同的类中使用。类型是工厂方法返回的对象类型，例如：

```java
BufferedReader br = Files.newBufferedReader(path);
```

- type—A concise alternative to getType and newType, for example:

> type，一个用来替代 getType 和 newType 的比较简单的方式，例如：

```java
List<Complaint> litany = Collections.list(legacyLitany);
```

In summary, static factory methods and public constructors both have their uses, and it pays to understand their relative merits. Often static factories are preferable, so avoid the reflex to provide public constructors without first considering static factories.

> 总之，静态工厂方法和公共构造器都有各自的用途，理解它们相比而言的优点是值得的。通常静态工厂的方式更可取，因此应避免在没有考虑静态工厂的情况下就提供公共构造函数。

---

## 【02】当构造函数有多个参数时，考虑改用构建器

> Consider a builder when faced with many constructor parameters

Static factories and constructors share a limitation: they do not scale well to large numbers of optional parameters. Consider the case of a class representing the Nutrition Facts label that appears on packaged foods. These labels have a few required fields—serving size, servings per container, and calories per serving— and more than twenty optional fields—total fat, saturated fat, trans fat,cholesterol, sodium, and so on. Most products have nonzero values for only a few of these optional fields.

> 静态工厂和构造函数都有一个局限：它们不能对大量可选参数做很好的扩展。以一个类为例，它表示包装食品上的营养标签。这些标签上有一些字段是必需的，如：净含量、毛重和每单位份量的卡路里，另有超过 20 个可选的字段，如：总脂肪、饱和脂肪、反式脂肪、胆固醇、钠等等。大多数产品只有这些可选字段中的少数，且具有非零值。

What sort（n.种类，方式；vt.将…排序） of constructors or static factories should you write for such a class?Traditionally, programmers have used the telescoping constructor pattern, in which you provide a constructor with only the required parameters, another with a single optional parameter, a third with two optional parameters, and so on,culminating in a constructor with all the optional parameters. Here’s how it looks in practice. For brevity’s sake, only four optional fields are shown:

> 应该为这样的类编写什么种类的构造函数或静态工厂呢？传统的方式是使用可伸缩构造函数，在这种模式中，只向构造函数提供必需的参数。即，向第一个构造函数提供单个可选参数，向第二个构造函数提供两个可选参数，以此类推，最后一个构造函数是具有所有可选参数的。这是它在实际应用中的样子。为了简洁起见，只展示具备四个可选字段的情况：

```java
// Telescoping constructor pattern - does not scale well!
public class NutritionFacts {
    private final int servingSize; // (mL) required
    private final int servings; // (per container) required
    private final int calories; // (per serving) optional
    private final int fat; // (g/serving) optional
    private final int sodium; // (mg/serving) optional
    private final int carbohydrate; // (g/serving) optional

    public NutritionFacts(int servingSize, int servings) {
        this(servingSize, servings, 0);
    }

    public NutritionFacts(int servingSize, int servings, int calories) {
        this(servingSize, servings, calories, 0);
    }

    public NutritionFacts(int servingSize, int servings, int calories, int fat) {
        this(servingSize, servings, calories, fat, 0);
    }

    public NutritionFacts(int servingSize, int servings, int calories, int fat, int sodium) {
        this(servingSize, servings, calories, fat, sodium, 0);
    }

    public NutritionFacts(int servingSize, int servings, int calories, int fat, int sodium, int carbohydrate) {
        this.servingSize = servingSize;
        this.servings = servings;
        this.calories = calories;
        this.fat = fat;
        this.sodium = sodium;
        this.carbohydrate = carbohydrate;
    }
}
```

When you want to create an instance, you use the constructor with the shortest parameter list containing all the parameters you want to set:

> 当你想要创建一个实例时，可以使用包含所需的参数的最短参数列表的构造函数：

```java
NutritionFacts cocaCola =new NutritionFacts(240, 8, 100, 0, 35, 27);
```

Typically this constructor invocation will require many parameters that you don’t want to set, but you’re forced to pass a value for them anyway. In this case,we passed a value of 0 for fat. With “only” six parameters this may not seem so bad, but it quickly gets out of hand as the number of parameters increases.

> 通常，这个构造函数包含许多额外的参数，但是你必须为它们传递一个值。在本例中，我们为 fat 传递了一个值 0。只有六个参数时，这可能看起来不那么糟，但随着参数的增加，它很快就会失控。

In short, **the telescoping constructor pattern works, but it is hard to write client code when there are many parameters, and harder still to read it.** The reader is left wondering what all those values mean and must carefully count parameters to find out. Long sequences of identically typed parameters can cause subtle bugs. If the client accidentally reverses two such parameters, the compiler won’t complain, but the program will misbehave at runtime (Item 51).

> 简单地说，**可伸缩构造函数模式可以工作，但是当有很多参数时，编写客户端代码是很困难的，而且读起来更困难。** 读者想知道所有这些值是什么意思，必须仔细清点参数。相同类型参数的长序列会导致细微的错误。如果客户端不小心倒转了两个这样的参数，编译器不会报错，但是程序会在运行时出错（Item-51）。

A second alternative（n.二中择一；adj.供选择的） when you’re faced with many optional parameters in a constructor is the JavaBeans pattern, in which you call a parameterless constructor to create the object and then call setter methods to set each required parameter and each optional parameter of interest:

> 当你在构造函数中遇到许多可选参数时，另一种选择是 JavaBean 模式，在这种模式中，你调用一个无参数的构造函数来创建对象，然后调用 setter 方法来设置每个所需的参数和每个感兴趣的可选参数：

```java
// JavaBeans Pattern - allows inconsistency, mandates mutability
public class NutritionFacts {
    // Parameters initialized to default values (if any)
    private int servingSize = -1; // Required; no default value
    private int servings = -1; // Required; no default value
    private int calories = 0;
    private int fat = 0;
    private int sodium = 0;
    private int carbohydrate = 0;
    public NutritionFacts() { }
    // Setters
    public void setServingSize(int val) { servingSize = val; }
    public void setServings(int val) { servings = val; }
    public void setCalories(int val) { calories = val; }
    public void setFat(int val) { fat = val; }
    public void setSodium(int val) { sodium = val; }
    public void setCarbohydrate(int val) { carbohydrate = val; }
}
```

This pattern has none of the disadvantages of the telescoping constructor pattern. It is easy, if a bit wordy（adj.冗长的）, to create instances, and easy to read the resulting（v.产生；adj.作为结果的） code:

> 这个模式没有可伸缩构造函数模式的缺点。创建实例很容易，虽然有点冗长，但很容易阅读生成的代码：

```java
NutritionFacts cocaCola = new NutritionFacts();
cocaCola.setServingSize(240);
cocaCola.setServings(8);
cocaCola.setCalories(100);
cocaCola.setSodium(35);
cocaCola.setCarbohydrate(27);
```

Unfortunately, the JavaBeans pattern has serious disadvantages of its own. Because construction is split（vt.分离，分解） across multiple calls, a JavaBean may be in an inconsistent state partway through its construction. The class does not have the option of enforcing consistency merely by checking the validity of the constructor parameters. Attempting to use an object when it’s in an inconsistent（adj. 不一致的） state may cause failures that are far removed from the code containing the bug and hence（adv.因此） difficult to debug. A related disadvantage is that the JavaBeans pattern precludes the possibility of making a class immutable (Item 17) and requires added effort on the part of the programmer to ensure thread safety.

> 不幸的是，JavaBean 模式本身有严重的缺点。因为构建是在多个调用之间进行的，所以 JavaBean 可能在构建的过程中处于不一致的状态。该类不能仅通过检查构造函数参数的有效性来强制一致性。在不一致的状态下尝试使用对象可能会导致错误的发生，而包含这些错误的代码很难调试。一个相关的缺点是，JavaBean 模式排除了使类不可变的可能性（Item-17），并且需要程序员额外的努力来确保线程安全。

It is possible to reduce these disadvantages by manually（adv.手动地） “freezing” the object when its construction is complete and not allowing it to be used until frozen, but this variant is unwieldy and rarely used in practice. Moreover, it can cause errors at runtime because the compiler cannot ensure that the programmer calls the freeze method on an object before using it.

> 通过在对象构建完成时手动「冻结」对象，并在冻结之前不允许使用对象，可以减少这些缺陷，但是这种变通方式很笨拙，在实践中很少使用。此外，它可能在运行时导致错误，因为编译器不能确保程序员在使用对象之前调用它的 freeze 方法。

Luckily, there is a third alternative that combines the safety of the telescoping constructor pattern with the readability of the JavaBeans pattern. It is a form of the Builder pattern [Gamma95]. Instead of making the desired object directly,the client calls a constructor (or static factory) with all of the required parameters and gets a builder object. Then the client calls setter-like methods on the builder object to set each optional parameter of interest. Finally, the client calls a parameterless build method to generate the object, which is typically immutable. The builder is typically a static member class (Item 24) of the class itbuilds. Here’s how it looks in practice:

> 幸运的是，还有第三种选择，它结合了可伸缩构造函数模式的安全性和 JavaBean 模式的可读性。它是建造者模式的一种形式 [Gamma95]。客户端不直接生成所需的对象，而是使用所有必需的参数调用构造函数（或静态工厂），并获得一个 builder 对象。然后，客户端在构建器对象上调用像 setter 这样的方法来设置每个感兴趣的可选参数。最后，客户端调用一个无参数的构建方法来生成对象，这通常是不可变的。构建器通常是它构建的类的静态成员类（Item-24）。下面是它在实际应用中的样子：

```java
// Builder Pattern
public class NutritionFacts {
    private final int servingSize;
    private final int servings;
    private final int calories;
    private final int fat;
    private final int sodium;
    private final int carbohydrate;

    public static class Builder {
        // Required parameters
        private final int servingSize;
        private final int servings;
        // Optional parameters - initialized to default values
        private int calories = 0;
        private int fat = 0;
        private int sodium = 0;
        private int carbohydrate = 0;

        public Builder(int servingSize, int servings) {
            this.servingSize = servingSize;
            this.servings = servings;
        }

        public Builder calories(int val) {
            calories = val;
            return this;
        }

        public Builder fat(int val) {
            fat = val;
            return this;
        }

        public Builder sodium(int val) {
            sodium = val;
            return this;
        }

        public Builder carbohydrate(int val) {
            carbohydrate = val;
            return this;
        }

        public NutritionFacts build() {
            return new NutritionFacts(this);
        }
    }

    private NutritionFacts(Builder builder) {
        servingSize = builder.servingSize;
        servings = builder.servings;
        calories = builder.calories;
        fat = builder.fat;
        sodium = builder.sodium;
        carbohydrate = builder.carbohydrate;
    }
}
```

The NutritionFacts class is immutable, and all parameter default values are in one place. The builder’s setter methods return the builder itself so that invocations can be chained, resulting in a fluent API. Here’s how the client code looks:

> NutritionFacts 类是不可变的，所有参数默认值都在一个位置。构建器的 setter 方法返回构建器本身，这样就可以链式调用，从而得到一个流畅的 API。下面是客户端代码的样子：

```java
NutritionFacts cocaCola = new NutritionFacts.Builder(240, 8)
.calories(100).sodium(35).carbohydrate(27).build();
```

This client code is easy to write and, more importantly, easy to read. The Builder pattern simulates named optional parameters as found in Python and Scala.

> 该客户端代码易于编写，更重要的是易于阅读。建造者模式模拟 Python 和 Scala 中的可选参数。

Validity（n.有效性） checks were omitted（v.遗漏，省略；adj.省去的） for brevity（n.简洁）. To detect invalid parameters as soon as possible, check parameter validity in the builder’s constructor and methods.Check invariants involving multiple parameters in the constructor invoked by the build method. To ensure these invariants against attack, do the checks on object fields after copying parameters from the builder (Item 50). If a check fails, throw an IllegalArgumentException (Item 72) whose detail message indicates which parameters are invalid (Item 75).

> 为了简洁，省略了有效性检查。为了尽快检测无效的参数，请检查构建器的构造函数和方法中的参数有效性。检查构建方法调用的构造函数中涉及多个参数的不变量。为了确保这些不变量不受攻击，在从构建器复制参数之后检查对象字段（Item-50）。如果检查失败，抛出一个 IllegalArgumentException（Item-72），它的详细消息指示哪些参数无效（Item-75）。

The Builder pattern is well suited to class hierarchies. Use a parallel hierarchy of builders, each nested in the corresponding class. Abstract classes have abstract builders; concrete classes have concrete builders. For example,consider an abstract class at the root of a hierarchy representing various kinds of pizza:

> 建造者模式非常适合于类层次结构。使用构建器的并行层次结构，每个构建器都嵌套在相应的类中。抽象类有抽象类构建器；具体类有具体类构建器。例如，考虑一个在层次结构处于最低端的抽象类，它代表各种比萨饼：

```java
import java.util.EnumSet;
import java.util.Objects;
import java.util.Set;

// Builder pattern for class hierarchies
public abstract class Pizza {
    public enum Topping {HAM, MUSHROOM, ONION, PEPPER, SAUSAGE}

    final Set<Topping> toppings;

    abstract static class Builder<T extends Builder<T>> {
        EnumSet<Topping> toppings = EnumSet.noneOf(Topping.class);

        public T addTopping(Topping topping) {
            toppings.add(Objects.requireNonNull(topping));
            return self();
        }

        abstract Pizza build();

        // Subclasses must override this method to return "this"
        protected abstract T self();
    }

    Pizza(Builder<?> builder) {
        toppings = builder.toppings.clone(); // See Item 50
    }
}
```

Note that Pizza.Builder is a generic type with a recursive type parameter (Item 30). This, along with the abstract self method, allows method chaining to work properly in subclasses, without the need for casts. This workaround for the fact that Java lacks a self type is known as the simulated self-type idiom. Here are two concrete subclasses of Pizza, one of which represents a standard New-York-style pizza, the other a calzone. The former has a required size parameter,while the latter lets you specify whether sauce should be inside or out:

> 请注意，`Pizza.Builder` 是具有递归类型参数的泛型类型（Item-31）。这与抽象 self 方法一起，允许方法链接在子类中正常工作，而不需要强制转换。对于 Java 缺少自类型这一事实，这种变通方法称为模拟自类型习惯用法。这里有两个具体的比萨子类，一个是标准的纽约风格的比萨，另一个是 calzone。前者有一个所需的大小参数，而后者让你指定酱料应该是内部还是外部：

```java
import java.util.Objects;

public class NyPizza extends Pizza {
    public enum Size {SMALL, MEDIUM, LARGE}

    private final Size size;

    public static class Builder extends Pizza.Builder<Builder> {
        private final Size size;

        public Builder(Size size) {
            this.size = Objects.requireNonNull(size);
        }

        @Override
        public NyPizza build() {
            return new NyPizza(this);
        }

        @Override
        protected Builder self() {
            return this;
        }
    }

    private NyPizza(Builder builder) {
        super(builder);
        size = builder.size;
    }
}

public class Calzone extends Pizza {
    private final boolean sauceInside;

    public static class Builder extends Pizza.Builder<Builder> {
        private boolean sauceInside = false; // Default

        public Builder sauceInside() {
            sauceInside = true;
            return this;
        }

        @Override
        public Calzone build() {
            return new Calzone(this);
        }

        @Override
        protected Builder self() {
            return this;
        }
    }

    private Calzone(Builder builder) {
        super(builder);
        sauceInside = builder.sauceInside;
    }
}
```

Note that the build method in each subclass’s builder is declared to return the correct subclass: the build method of NyPizza.Builder returns NyPizza, while the one in Calzone.Builder returns Calzone. This technique, wherein a subclass method is declared to return a subtype of the return type declared in the super-class, is known as covariant return typing. It allows clients to use these builders without the need for casting.The client code for these “hierarchical builders” is essentially identical to the code for the simple NutritionFacts builder. The example client code shown next assumes static imports on enum constants for brevity:

> 注意，每个子类的构建器中的构建方法声明为返回正确的子类：构建的方法 `NyPizza.Builder` 返回 NyPizza，而在 `Calzone.Builder` 则返回 Calzone。这种技术称为协变返回类型，其中一个子类方法声明为返回超类中声明的返回类型的子类型。它允许客户使用这些构建器，而不需要强制转换。这些「层次构建器」的客户端代码与简单的 NutritionFacts 构建器的代码基本相同。为简洁起见，下面显示的示例客户端代码假定枚举常量上的静态导入：

```java
NyPizza pizza = new NyPizza.Builder(SMALL)
.addTopping(SAUSAGE).addTopping(ONION).build();
Calzone calzone = new Calzone.Builder()
.addTopping(HAM).sauceInside().build();
```

A minor advantage of builders over constructors is that builders can have multiple varargs parameters because each parameter is specified in its own method. Alternatively, builders can aggregate the parameters passed into multiple calls to a method into a single field, as demonstrated in the addTopping method earlier.

> 与构造函数相比，构造函数的一个小优点是构造函数可以有多个变量参数，因为每个参数都是在自己的方法中指定的。或者，构建器可以将传递给一个方法的多个调用的参数聚合到单个字段中，如前面的 addTopping 方法中所示。

The Builder pattern is quite flexible. A single builder can be used repeatedly to build multiple objects. The parameters of the builder can be tweaked between invocations of the build method to vary the objects that are created. A builder can fill in some fields automatically upon object creation, such as a serial number that increases each time an object is created.

> 建造者模式非常灵活。一个构建器可以多次用于构建多个对象。构建器的参数可以在构建方法的调用之间进行调整，以改变创建的对象。构建器可以在创建对象时自动填充某些字段，例如在每次创建对象时增加的序列号。

The Builder pattern has disadvantages as well. In order to create an object,you must first create its builder. While the cost of creating this builder is unlikely to be noticeable in practice, it could be a problem in performance-critical situations. Also, the Builder pattern is more verbose than the telescoping constructor pattern, so it should be used only if there are enough parameters to make it worthwhile, say four or more. But keep in mind that you may want to add more parameters in the future. But if you start out with constructors or static factories and switch to a builder when the class evolves to the point where the number of parameters gets out of hand, the obsolete constructors or static factories will stick out like a sore thumb. Therefore, it’s often better to start with a builder in the first place.

> 建造者模式也有缺点。为了创建一个对象，你必须首先创建它的构建器。虽然在实际应用中创建这个构建器的成本可能并不显著，但在以性能为关键的场景下，这可能会是一个问题。而且，建造者模式比可伸缩构造函数模式更冗长，因此只有在有足够多的参数时才值得使用，比如有 4 个或更多参数时，才应该使用它。但是请记住，你可能希望在将来添加更多的参数。但是，如果你以构造函数或静态工厂开始，直至类扩展到参数数量无法控制的程度时，也会切换到构建器，但是过时的构造函数或静态工厂将很难处理。因此，最好一开始就从构建器开始。

In summary, the Builder pattern is a good choice when designing classes whose constructors or static factories would have more than a handful of parameters, especially if many of the parameters are optional or of identical type. Client code is much easier to read and write with builders than with telescoping constructors, and builders are much safer than JavaBeans.

> 总之，在设计构造函数或静态工厂的类时，建造者模式是一个很好的选择，特别是当许多参数是可选的或具有相同类型时。与可伸缩构造函数相比，使用构建器客户端代码更容易读写，而且构建器比 JavaBean 更安全。

---

## 【03】使用私有构造函数或枚举类型实施单例属性

> Enforce the singleton property with a private constructor or an enum type

A singleton is simply a class that is instantiated（v.实例化） exactly once [Gamma95].Singletons typically represent either a stateless object such as a function (Item24) or a system component that is intrinsically unique. **Making a class a singleton can make it difficult to test its clients** because it’s impossible to substitute a mock implementation for a singleton unless it implements an interface that serves as its type.

> 单例是一个只实例化一次的类 [Gamma95]。单例通常表示无状态对象，比如函数（Item-24）或系统组件，它们在本质上是唯一的。**将一个类设计为单例会使它的客户端测试时变得困难，** 除非它实现了作为其类型的接口，否则无法用模拟实现来代替单例。

There are two common ways to implement singletons. Both are based on keeping the constructor private and exporting a public static member to provide access to the sole instance. In one approach, the member is a final field:

> 实现单例有两种常见的方法。两者都基于保持构造函数私有和导出公共静态成员以提供对唯一实例的访问。在第一种方法中，成员是一个 final 字段：

```java
// Singleton with public final field
public class Elvis {
    public static final Elvis INSTANCE = new Elvis();
    private Elvis() { ... }
    public void leaveTheBuilding() { ... }
}
```

The private constructor is called only once, to initialize the public static final field Elvis.INSTANCE. The lack of a public or protected constructor guarantees a “monoelvistic” universe: exactly one Elvis instance will exist once the Elvis class is initialized—no more, no less. Nothing that a client does can change this, with one caveat: a privileged client can invoke the private constructor reflectively (Item 65) with the aid of the AccessibleObject.setAccessible method. If you need to defend against this attack, modify the constructor to make it throw an exception if it’s asked to create a second instance.

> 私有构造函数只调用一次，用于初始化 public static final 修饰的 Elvis 类型字段 INSTANCE。不使用 public 或 protected 的构造函数保证了「独一无二」的空间：一旦初始化了 Elvis 类，就只会存在一个 Elvis 实例，不多也不少。客户端所做的任何事情都不能改变这一点，但有一点需要注意：拥有特殊权限的客户端可以借助 AccessibleObject.setAccessible 方法利用反射调用私有构造函数（Item-65）如果需要防范这种攻击，请修改构造函数，使其在请求创建第二个实例时抛出异常。

**译注：使用 `AccessibleObject.setAccessible` 方法调用私有构造函数示例：**

```java
Constructor<?>[] constructors = Elvis.class.getDeclaredConstructors();
AccessibleObject.setAccessible(constructors, true);

Arrays.stream(constructors).forEach(name -> {
    if (name.toString().contains("Elvis")) {
        Elvis instance = (Elvis) name.newInstance();
        instance.leaveTheBuilding();
    }
});
```

In the second approach to implementing singletons, the public member is a static factory method:

> 在实现单例的第二种方法中，公共成员是一种静态工厂方法：

```java
// Singleton with static factory
public class Elvis {
    private static final Elvis INSTANCE = new Elvis();
    private Elvis() { ... }
    public static Elvis getInstance() { return INSTANCE; }
    public void leaveTheBuilding() { ... }
}
```

All calls to Elvis.getInstance return the same object reference, and no other Elvis instance will ever be created (with the same caveat（n.警告） mentioned（v.提到） earlier).

> 所有对 `getInstance()` 方法的调用都返回相同的对象引用，并且不会创建其他 Elvis 实例（与前面提到的警告相同）。

**译注：这里的警告指拥有特殊权限的客户端可以借助 `AccessibleObject.setAccessible` 方法利用反射调用私有构造函数**

The main advantage of the public field approach is that the API makes it clear that the class is a singleton: the public static field is final, so it will always contain the same object reference. The second advantage is that it’s simpler.

> 公共字段方法的主要优点是 API 明确了类是单例的：public static 修饰的字段是 final 的，因此它总是包含相同的对象引用。第二个优点是更简单。

One advantage of the static factory approach is that it gives you the flexibility to change your mind about whether the class is a singleton without changing its API. The factory method returns the sole instance, but it could be modified to return, say, a separate instance for each thread that invokes it. A second advantage is that you can write a generic singleton factory if your application requires it (Item 30). A final advantage of using a static factory is that a method reference can be used as a supplier, for example `Elvis::instance` is a `Supplier<Elvis>`. Unless one of these advantages is relevant, the public field approach is preferable.

**译注：static factory approach 等同于 static factory method**

> 静态工厂方法的一个优点是，它可以在不更改 API 的情况下决定类是否是单例。工厂方法返回唯一的实例，但是可以对其进行修改，为调用它的每个线程返回一个单独的实例。第二个优点是，如果应用程序需要的话，可以编写泛型的单例工厂（Item-30）。使用静态工厂的最后一个优点是方法引用能够作为一个提供者，例如 `Elvis::getInstance` 是 `Supplier<Elvis>` 的提供者。除非能够与这些优点沾边，否则使用 public 字段的方式更可取。

**译注 1：原文方法引用可能是笔误，修改为 `Elvis::getInstance`**

**译注 2：方法引用作为提供者的例子：**

```java
Supplier<Elvis> sup = Elvis::getInstance;
Elvis obj = sup.get();
obj.leaveTheBuilding();
```

To make a singleton class that uses either of these approaches serializable (Chapter 12), it is not sufficient merely to add implements Serializable to its declaration. To maintain（vt.维持） the singleton guarantee（n.保证）, declare all instance fields transient and provide a readResolve method (Item 89). Otherwise, each time a serialized instance is deserialized, a new instance will be created, leading,in the case of our example, to spurious（adj.虚假的） Elvis sightings. To prevent this from happening, add this readResolve method to the Elvis class:

> 要使单例类使用这两种方法中的任何一种（Chapter 12），仅仅在其声明中添加实现 serializable 是不够的。要维护单例保证，应声明所有实例字段为 transient，并提供 readResolve 方法（Item-89）。否则，每次反序列化实例时，都会创建一个新实例，在我们的示例中，这会导致出现虚假的 Elvis。为了防止这种情况发生，将这个 readResolve 方法添加到 Elvis 类中：

```java
// readResolve method to preserve singleton property
private Object readResolve() {
    // Return the one true Elvis and let the garbage collector
    // take care of the Elvis impersonator.
    return INSTANCE;
}
```

A third way to implement a singleton is to declare a single-element enum:

> 实现单例的第三种方法是声明一个单元素枚举：

```java
// Enum singleton - the preferred approach
public enum Elvis {
    INSTANCE;
    public void leaveTheBuilding() { ... }
}
```

This approach（n.方法，途径；vt.接近） is similar to the public field approach, but it is more concise, provides the serialization machinery for free, and provides an ironclad guarantee against multiple instantiation, even in the face of sophisticated serialization or reflection attacks. This approach may feel a bit unnatural, but **a single-element enum type is often the best way to implement a singleton.** Note that you can’t use this approach if your singleton must extend a superclass other than Enum(though you can declare an enum to implement interfaces).

> 这种方法类似于 public 字段方法，但是它更简洁，默认提供了序列化机制，提供了对多个实例化的严格保证，即使面对复杂的序列化或反射攻击也是如此。这种方法可能有点不自然，但是**单元素枚举类型通常是实现单例的最佳方法。** 注意，如果你的单例必须扩展一个超类而不是 Enum（尽管你可以声明一个 Enum 来实现接口），你就不能使用这种方法。

---

## 【04】用私有构造函数实施不可实例化

> Enforce noninstantiability with a private constructor

Occasionally（adv.偶尔） you’ll want to write a class that is just a grouping of static methods and static fields. Such classes have acquired（v.取得） a bad reputation（n.名声） because some people abuse them to avoid thinking in terms of objects, but they do have valid uses. They can be used to group related methods on primitive values or arrays, in the manner of java.lang.Math or java.util.Arrays. They can also be used to group static methods, including factories (Item 1), for objects that implement some interface, in the manner of java.util.Collections. (As of Java 8, you can also put such methods in the interface, assuming it’s yours to modify.) Lastly, such classes can be used to group methods on a final class, since you can’t put them in a subclass.

> 有时你会想要写一个类，它只是一个静态方法和静态字段的组合。这样的类已经获得了坏名声，因为有些人滥用它们来避免从对象角度思考，但是它们确有用途。它们可以用 java.lang.Math 或 java.util.Arrays 的方式，用于与原始值或数组相关的方法。它们还可以用于对以 java.util.Collections 的方式实现某些接口的对象分组静态方法，包括工厂（Item-1）。（对于 Java 8，你也可以将这些方法放入接口中，假设你可以进行修改。）最后，这些类可用于对 final 类上的方法进行分组，因为你不能将它们放在子类中。

Such utility classes were not designed to be instantiated: an instance would be nonsensical. In the absence of explicit constructors, however, the compiler provides a public, parameterless default constructor. To a user, this constructor is indistinguishable from any other. It is not uncommon to see unintentionally instantiable classes in published APIs.

> 这样的实用程序类不是为实例化而设计的：实例是无意义的。然而，在没有显式构造函数的情况下，编译器提供了一个公共的、无参数的默认构造函数。对于用户来说，这个构造函数与其他构造函数没有区别。在已发布的 API 中看到无意中实例化的类是很常见的。

**Attempting to enforce noninstantiability by making a class abstract does not work.** The class can be subclassed and the subclass instantiated. Furthermore, it misleads the user into thinking the class was designed for inheritance (Item 19). There is, however, a simple idiom to ensure noninstantiability. A default constructor is generated only if a class contains no explicit constructors, so **a class can be made noninstantiable by including a private constructor:**

**译注：原文 noninstantiable 应修改为 non-instantiable ，译为「不可实例化的」**

> **试图通过使类抽象来实施不可实例化是行不通的。** 可以对类进行子类化，并实例化子类。此外，它误导用户认为类是为继承而设计的（Item-19）。然而，有一个简单的习惯用法来确保不可实例化。只有当类不包含显式构造函数时，才会生成默认构造函数，因此**可以通过包含私有构造函数使类不可实例化：**

```java
// Noninstantiable utility class
public class UtilityClass {
    // Suppress default constructor for noninstantiability
    private UtilityClass() {
        throw new AssertionError();
    } ... // Remainder omitted
}
```

Because the explicit constructor is private, it is inaccessible outside the class.The AssertionError isn’t strictly required, but it provides insurance in case the constructor is accidentally invoked from within the class. It guarantees the class will never be instantiated under any circumstances. This idiom is mildly counterintuitive because the constructor is provided expressly so that it cannot be invoked. It is therefore wise to include a comment, as shown earlier.

> 因为显式构造函数是私有的，所以在类之外是不可访问的。AssertionError 不是严格要求的，但是它提供了保障，以防构造函数意外地被调用。它保证类在任何情况下都不会被实例化。这个习惯用法有点违反常规，因为构造函数是明确提供的，但不能调用它。因此，如上述代码所示，包含注释是明智的做法。

As a side effect, this idiom also prevents the class from being subclassed. All constructors must invoke a superclass constructor, explicitly or implicitly, and a subclass would have no accessible superclass constructor to invoke.

> 这个习惯用法也防止了类被子类化，这是一个副作用。所有子类构造函数都必须调用超类构造函数，无论是显式的还是隐式的，但这种情况下子类都没有可访问的超类构造函数可调用。

---

## 【05】依赖注入优于硬连接资源

> Prefer dependency injection to hardwiring resources

Many classes depend on one or more underlying（adj.潜在的，根本的） resources. For example, a spell checker depends on a dictionary. It is not uncommon to see such classes implemented as static utility classes (Item 4):

> 许多类依赖于一个或多个底层资源。例如，拼写检查程序依赖于字典。常见做法是，将这种类实现为静态实用工具类（Item-4）：

```java
// Inappropriate use of static utility - inflexible & untestable!
public class SpellChecker {
    private static final Lexicon dictionary = ...;
    private SpellChecker() {} // Noninstantiable
    public static boolean isValid(String word) { ... }
    public static List<String> suggestions(String typo) { ... }
}
```

Similarly, it’s not uncommon to see them implemented as singletons (Item 3):

> 类似地，我们也经常看到它们的单例实现（Item-3）:

```java
// Inappropriate use of singleton - inflexible & untestable!
public class SpellChecker {
    private final Lexicon dictionary = ...;
    private SpellChecker(...) {}
    public static INSTANCE = new SpellChecker(...);
    public boolean isValid(String word) { ... }
    public List<String> suggestions(String typo) { ... }
}
```

Neither of these approaches is satisfactory, because they assume that there is only one dictionary worth using. In practice, each language has its own dictionary, and special dictionaries are used for special vocabularies. Also, it may be desirable to use a special dictionary for testing. It is wishful thinking to assume that a single dictionary will suffice for all time.

> 这两种方法都不令人满意，因为它们假设只使用一个字典。在实际应用中，每种语言都有自己的字典，特殊的字典用于特殊的词汇表。另外，最好使用一个特殊的字典进行测试。认为一本字典就足够了，是一厢情愿的想法。

You could try to have SpellChecker support multiple dictionaries by making the dictionary field nonfinal and adding a method to change the dictionary in an existing spell checker, but this would be awkward, error-prone,and unworkable in a concurrent setting. **Static utility classes and singletons are inappropriate for classes whose behavior is parameterized by an underlying resource.**

> 你可以尝试让 SpellChecker 支持多个字典：首先取消 dictionary 字段的 final 修饰，并在现有的拼写检查器中添加更改 dictionary 的方法。但是在并发环境中这种做法是笨拙的、容易出错的和不可行的。**静态实用工具类和单例不适用于由底层资源参数化的类。**

What is required is the ability to support multiple instances of the class (in our example, SpellChecker), each of which uses the resource desired by the client (in our example, the dictionary). A simple pattern that satisfies this requirement is to **pass the resource into the constructor when creating a new instance.** This is one form of dependency injection: the dictionary is a dependency of the spell checker and is injected into the spell checker when it is created.

> 所需要的是支持类的多个实例的能力（在我们的示例中是 SpellChecker），每个实例都使用客户端需要的资源（在我们的示例中是 dictionary）。满足此要求的一个简单模式是在**创建新实例时将资源传递给构造函数。** 这是依赖注入的一种形式：字典是拼写检查器的依赖项，在创建它时被注入到拼写检查器中。

```java
// Dependency injection provides flexibility and testability
public class SpellChecker {
    private final Lexicon dictionary;
    public SpellChecker(Lexicon dictionary) {
        this.dictionary = Objects.requireNonNull(dictionary);
    }
    public boolean isValid(String word) { ... }
    public List<String> suggestions(String typo) { ... }
}
```

The dependency injection pattern is so simple that many programmers use it for years without knowing it has a name. While our spell checker example had only a single resource (the dictionary), dependency injection works with an arbitrary（adj.任意的） number of resources and arbitrary dependency graphs. It preserves immutability (Item 17), so multiple clients can share dependent objects(assuming the clients desire the same underlying resources). Dependency injection is equally applicable to constructors, static factories (Item 1), and builders (Item 2).

> 依赖注入模式非常简单，许多程序员在不知道其名称的情况下使用了多年。虽然拼写检查器示例只有一个资源（字典），但是依赖注入可以处理任意数量的资源和任意依赖路径。它保持了不可变性（Item-17），因此多个客户端可以共享依赖对象（假设客户端需要相同的底层资源）。依赖注入同样适用于构造函数、静态工厂（Item-1）和构建器（Item-2）。

A useful variant of the pattern is to pass a resource factory to the constructor.A factory is an object that can be called repeatedly to create instances of a type.Such factories embody the Factory Method pattern [Gamma95]. The `Supplier<T>` interface, introduced in Java 8, is perfect for representing factories. Methods that take a `Supplier<T>` on input should typically constrain the factory’s type parameter using a bounded wildcard type (Item 31) to allow the client to pass in a factory that creates any subtype of a specified type. For example, here is a method that makes a mosaic using a client-provided factory to produce each tile:

> 这种模式的一个有用变体是将资源工厂传递给构造函数。工厂是一个对象，可以反复调用它来创建类型的实例。这样的工厂体现了工厂方法模式 [Gamma95]。Java 8 中引入的 `Supplier<T>` 非常适合表示工厂。在输入中接受 `Supplier<T>` 的方法通常应该使用有界通配符类型（Item-31）来约束工厂的类型参数，以允许客户端传入创建指定类型的任何子类型的工厂。例如，这里有一个生产瓷砖方法，每块瓷砖都使用客户提供的工厂来制作马赛克：

```java
Mosaic create(Supplier<? extends Tile> tileFactory) { ... }
```

Although dependency injection greatly improves flexibility and testability, it can clutter up（使杂乱） large projects, which typically（adv.通常） contain thousands of dependencies.This clutter can be all but eliminated by using a dependency injection framework, such as Dagger [Dagger], Guice [Guice], or Spring [Spring]. The use of these frameworks is beyond the scope of this book, but note that APIs designed for manual（n.手册；adj.手工的） dependency injection are trivially（adv.繁琐地） adapted for（适用于） use by these frameworks.

> 尽管依赖注入极大地提高了灵活性和可测试性，但它可能会使大型项目变得混乱，这些项目通常包含数千个依赖项。通过使用依赖注入框架（如 Dagger、Guice 或 Spring），几乎可以消除这种混乱。这些框架的使用超出了本书的范围，但是请注意，为手动依赖注入而设计的 API 很容易被这些框架所使用。

In summary, do not use a singleton or static utility class to implement a class that depends on one or more underlying resources whose behavior affects that of the class, and do not have the class create these resources directly. Instead, pass the resources, or factories to create them, into the constructor (or static factory or builder). This practice, known as dependency injection, will greatly enhance the flexibility, reusability, and testability of a class.

> 总之，不要使用单例或静态实用工具类来实现依赖于一个或多个底层资源的类，这些资源的行为会影响类的行为，也不要让类直接创建这些资源。相反，将创建它们的资源或工厂传递给构造函数（或静态工厂或构建器）。这种操作称为依赖注入，它将大大增强类的灵活性、可重用性和可测试性。

---

## 【06】避免创建不必要的对象

> Avoid creating unnecessary objects

It is often appropriate to reuse a single object instead of creating a new functionally equivalent object each time it is needed. Reuse can be both faster and more stylish. An object can always be reused if it is immutable (Item 17).

> 复用单个对象通常是合适的，不必每次需要时都创建一个新的功能等效对象。复用可以更快、更流行。如果对象是不可变的，那么它总是可以被复用的（Item-17）。

As an extreme example of what not to do, consider this statement:

> 作为一个不该做的极端例子，请考虑下面的语句：

```java
String s = new String("bikini"); // DON'T DO THIS!
```

The statement creates a new String instance each time it is executed, and none of those object creations is necessary. The argument to the String constructor ("bikini") is itself a String instance, functionally identical to all of the objects created by the constructor. If this usage occurs in a loop or in a frequently invoked method, millions of String instances can be created needlessly.

> 该语句每次执行时都会创建一个新的 String 实例，而这些对象创建都不是必需的。String 构造函数的参数 `("bikini")` 本身就是一个 String 实例，在功能上与构造函数创建的所有对象相同。如果这种用法发生在循环或频繁调用的方法中，创建大量 String 实例是不必要的。

The improved version is simply the following:

> 改进后的版本如下：

```java
String s = "bikini";
```

This version uses a single String instance, rather than creating a new one each time it is executed. Furthermore, it is guaranteed that the object will be reused by any other code running in the same virtual machine that happens to contain the same string literal [JLS, 3.10.5].

> 这个版本使用单个 String 实例，而不是每次执行时都创建一个新的实例。此外，可以保证在同一虚拟机中运行的其他代码都可以复用该对象，只要恰好包含相同的字符串字面量 [JLS, 3.10.5]。

You can often avoid creating unnecessary objects by using static factory methods (Item 1) in preference to constructors on immutable classes that provide both. For example, the factory method Boolean.valueOf(String) is preferable to the constructor Boolean(String), which was deprecated in Java 9. The constructor must create a new object each time it’s called, while the factory method is never required to do so and won’t in practice. In addition to reusing immutable objects, you can also reuse mutable objects if you know they won’t be modified.

> 你通常可以通过使用静态工厂方法（Item-1）来避免创建不必要的对象，而不是在提供这两种方法的不可变类上使用构造函数。例如，工厂方法 `Boolean.valueOf(String)` 比构造函数 ~~Boolean(String)~~ 更可取，后者在 Java 9 中被弃用了。构造函数每次调用时都必须创建一个新对象，而工厂方法从来不需要这样做，在实际应用中也不会这样做。除了复用不可变对象之外，如果知道可变对象不会被修改，也可以复用它们。

Some object creations are much more expensive than others. If you’re going to need such an “expensive object” repeatedly, it may be advisable（adj.明智的，适当的） to cache it for reuse. Unfortunately, it’s not always obvious when you’re creating such an object. Suppose you want to write a method to determine（v.下决心；vt.确定） whether a string is a valid Roman numeral. Here’s the easiest way to do this using a regular expression:

> 有些对象的创建的代价相比而言要昂贵得多。如果你需要重复地使用这样一个「昂贵的对象」，那么最好将其缓存以供复用。不幸的是，当你创建这样一个对象时，这一点并不总是很明显。假设你要编写一个方法来确定字符串是否为有效的罗马数字。下面是使用正则表达式最简单的方法：

```java
// Performance can be greatly improved!
static boolean isRomanNumeral(String s) {
    return s.matches("^(?=.)M*(C[MD]|D?C{0,3})" + "(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$");
}
```

The problem with this implementation is that it relies on the String.matches method. **While String.matches is the easiest way to check if a string matches a regular expression, it’s not suitable for repeated use in performance-critical situations.** The problem is that it internally creates a Pattern instance for the regular expression and uses it only once, after which it becomes eligible for garbage collection. Creating a Pattern instance is expensive because it requires compiling the regular expression into a finite state machine.

> 这个实现的问题是它依赖于 `String.matches` 方法。**虽然 String.matches 是检查字符串是否与正则表达式匹配的最简单方法，但它不适合在性能关键的情况下重复使用。** 问题在于，它在内部为正则表达式创建了一个 Pattern 实例，并且只使用一次，之后就进行垃圾收集了。创建一个 Pattern 实例是很昂贵的，因为它需要将正则表达式编译成有限的状态机制。

To improve the performance, explicitly compile the regular expression into a Pattern instance (which is immutable) as part of class initialization, cache it,and reuse the same instance for every invocation of the isRomanNumeral method:

> 为了提高性能，将正则表达式显式编译为 Pattern 实例（它是不可变的），作为类初始化的一部分，缓存它，并在每次调用 isRomanNumeral 方法时复用同一个实例：

```java
// Reusing expensive object for improved performance
public class RomanNumerals {
    private static final Pattern ROMAN = Pattern.compile("^(?=.)M*(C[MD]|D?C{0,3})" + "(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$");
    static boolean isRomanNumeral(String s) {
        return ROMAN.matcher(s).matches();
    }
}
```

The improved version of isRomanNumeral provides significant performance gains if invoked frequently. On my machine, the original version takes 1.1 μs on an 8-character input string, while the improved version takes 0.17 μs, which is 6.5 times faster. Not only is the performance improved, but arguably, so is clarity. Making a static final field for the otherwise invisible Pattern instance allows us to give it a name, which is far more readable than the regular expression itself.

> 如果频繁调用 isRomanNumeral，改进版本将提供显著的性能提升。在我的机器上，初始版本输入 8 字符的字符串花费 1.1μs，而改进的版本需要 0.17μs，快 6.5 倍。不仅性能得到了改善，清晰度也得到了提高。为不可见的 Pattern 实例创建一个静态终态字段允许我们为它命名，这比正则表达式本身更容易阅读。

If the class containing the improved version of the isRomanNumeral method is initialized but the method is never invoked, the field ROMAN will be initialized needlessly. It would be possible to eliminate the initialization by lazily initializing the field (Item 83) the first time the isRomanNumeral method is invoked, but this is not recommended. As is often the case with lazy initialization, it would complicate the implementation with no measurable performance improvement (Item 67).

> 如果加载包含改进版 isRomanNumeral 方法的类时，该方法从未被调用过，那么初始化字段 ROMAN 是不必要的。因此，可以用延迟初始化字段（Item-83）的方式在第一次调用 isRomanNumeral 方法时才初始化字段，而不是在类加载时初始化，但不建议这样做。通常情况下，延迟初始化会使实现复杂化，而没有明显的性能改善（Item-67）。

**译注：类加载通常指的是类的生命周期中加载、连接、初始化三个阶段。当方法没有在类加载过程中被使用时，可以不初始化与之相关的字段**

When an object is immutable, it is obvious it can be reused safely, but there are other situations where it is far less obvious, even counterintuitive. Consider the case of adapters [Gamma95], also known as views. An adapter is an object that delegates to a backing object, providing an alternative interface. Because an adapter has no state beyond that of its backing object, there’s no need to create more than one instance of a given adapter to a given object.

> 当一个对象是不可变的，很明显，它可以安全地复用，但在其他情况下，它远不那么明显，甚至违反直觉。考虑适配器的情况 [Gamma95]，也称为视图。适配器是委托给支持对象的对象，提供了一个替代接口。因为适配器的状态不超过其支持对象的状态，所以不需要为给定对象创建一个给定适配器的多个实例。

For example, the keySet method of the Map interface returns a Set view of the Map object, consisting of all the keys in the map. Naively, it would seem that every call to keySet would have to create a new Set instance, but every call to keySet on a given Map object may return the same Set instance. Although the returned Set instance is typically mutable, all of the returned objects are functionally identical: when one of the returned objects changes, so do all the others, because they’re all backed by the same Map instance. While it is largely harmless to create multiple instances of the keySet view object, it is unnecessary and has no benefits.

> 例如，Map 接口的 keySet 方法返回 Map 对象的 Set 视图，其中包含 Map 中的所有键。天真的是，对 keySet 的每次调用都必须创建一个新的 Set 实例，但是对给定 Map 对象上的 keySet 的每次调用都可能返回相同的 Set 实例。虽然返回的 Set 实例通常是可变的，但所有返回的对象在功能上都是相同的：当返回的对象之一发生更改时，所有其他对象也会发生更改，因为它们都由相同的 Map 实例支持。虽然创建 keySet 视图对象的多个实例基本上是无害的，但这是不必要的，也没有好处。

Another way to create unnecessary objects is autoboxing, which allows the programmer to mix primitive and boxed primitive types, boxing and unboxing automatically as needed. **Autoboxing blurs but does not erase the distinction between primitive and boxed primitive types.** There are subtle semantic distinctions and not-so-subtle performance differences (Item 61). Consider the following method, which calculates the sum of all the positive int values. To do this, the program has to use long arithmetic because an int is not big enough to hold the sum of all the positive int values:

> 另一种创建不必要对象的方法是自动装箱，它允许程序员混合基本类型和包装类型，根据需要自动装箱和拆箱。**自动装箱模糊了基本类型和包装类型之间的区别，** 两者有细微的语义差别和不明显的性能差别（Item-61）。考虑下面的方法，它计算所有正整数的和。为了做到这一点，程序必须使用 long，因为 int 值不够大，不足以容纳所有正整数值的和：

```java
// Hideously slow! Can you spot the object creation?
private static long sum() {
    Long sum = 0L;
    for (long i = 0; i <= Integer.MAX_VALUE; i++)
        sum += i;
    return sum;
}
```

This program gets the right answer, but it is much slower than it should be,due to a one-character typographical error. The variable sum is declared as a Long instead of a long, which means that the program constructs about 231 unnecessary Long instances (roughly one for each time the long i is added to the Long sum). Changing the declaration of sum from Long to long reduces the runtime from 6.3 seconds to 0.59 seconds on my machine. The lesson is clear: **prefer primitives to boxed primitives, and watch out for unintentional autoboxing.**

> 这个程序得到了正确的答案，但是由于一个字符的印刷错误，它的速度比实际要慢得多。变量 sum 被声明为 Long 而不是 long，这意味着程序将构造大约 231 个不必要的 Long 实例（大约每次将 Long i 添加到 Long sum 时都有一个实例）。将 sum 的声明从 Long 更改为 long，机器上的运行时间将从 6.3 秒减少到 0.59 秒。教训很清楚：**基本类型优于包装类，还应提防意外的自动装箱。**

This item should not be misconstrued to imply that object creation is expensive and should be avoided. On the contrary, the creation and reclamation of small objects whose constructors do little explicit work is cheap, especially on modern JVM implementations. Creating additional objects to enhance the clarity,simplicity, or power of a program is generally a good thing.

> 本条目不应该被曲解为是在暗示创建对象是成本昂贵的，应该避免。相反，创建和回收这些小对象的构造函数成本是很低廉的，尤其是在现代 JVM 实现上。创建额外的对象来增强程序的清晰性、简单性或功能通常是件好事。

Conversely, avoiding object creation by maintaining your own object pool is a bad idea unless the objects in the pool are extremely heavyweight. The classic example of an object that does justify an object pool is a database connection.The cost of establishing the connection is sufficiently high that it makes sense to reuse these objects. Generally speaking, however, maintaining your own object pools clutters your code, increases memory footprint, and harms performance.Modern JVM implementations have highly optimized garbage collectors that easily outperform such object pools on lightweight objects.

> 相反，通过维护自己的对象池来避免创建对象不是一个好主意，除非池中的对象非常重量级。证明对象池是合理的对象的典型例子是数据库连接。建立连接的成本非常高，因此复用这些对象是有意义的。然而，一般来说，维护自己的对象池会使代码混乱，增加内存占用，并损害性能。现代 JVM 实现具有高度优化的垃圾收集器，在轻量级对象上很容易胜过这样的对象池。

The counterpoint to this item is Item 50 on defensive copying. The present item says, “Don’t create a new object when you should reuse an existing one,”while Item 50 says, “Don’t reuse an existing object when you should create a new one.” Note that the penalty for reusing an object when defensive copying is called for is far greater than the penalty for needlessly creating a duplicate object. Failing to make defensive copies where required can lead to insidious bugs and security holes; creating objects unnecessarily merely affects style and performance.

> 与此项对应的条目是 Item-50（防御性复制）。当前项的描述是：「在应该复用现有对象时不要创建新对象」，而 Item 50 的描述则是：「在应该创建新对象时不要复用现有对象」。请注意，当需要进行防御性复制时，复用对象所受到的惩罚远远大于不必要地创建重复对象所受到的惩罚。在需要时不制作防御性副本可能导致潜在的 bug 和安全漏洞；而不必要地创建对象只会影响样式和性能。

---

## 【07】排除过时的对象引用

> Eliminate obsolete object references

If you switched from a language with manual memory management, such as C or C++, to a garbage-collected language such as Java, your job as a programmer was made much easier by the fact that your objects are automatically reclaimed when you’re through with them. It seems almost like magic when you first experience it. It can easily lead to the impression that you don’t have to think about memory management, but this isn’t quite true.

> 如果你从需要手动管理内存的语言（如 C 或 c++）切换到具有垃圾回收机制的语言（如 Java），当你使用完对象后，会感觉程序员工作轻松很多。当你第一次体验它的时候，它几乎就像魔术一样。这很容易让人觉得你不需要考虑内存管理，但这并不完全正确。

Consider the following simple stack implementation:

> 考虑以下简单的堆栈实现：

```java
import java.util.Arrays;
import java.util.EmptyStackException;

// Can you spot the "memory leak"?
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
        return elements[--size];
    }

    /**
     * Ensure space for at least one more element, roughly
     * doubling the capacity each time the array needs to grow.
     */
    private void ensureCapacity() {
        if (elements.length == size)
            elements = Arrays.copyOf(elements, 2 * size + 1);
    }
}
```

There’s nothing obviously wrong with this program (but see Item 29 for a generic version). You could test it exhaustively, and it would pass every test with flying colors, but there’s a problem lurking. Loosely speaking, the program has a”memory leak,” which can silently manifest itself as reduced performance due to increased garbage collector activity or increased memory footprint. In extreme cases, such memory leaks can cause disk paging and even program failure with an OutOfMemoryError, but such failures are relatively rare.

> 这个程序没有明显的错误（但是通用版本请参阅 Item-29）。你可以对它进行详尽的测试，它会以优异的成绩通过所有的测试，但是有一个潜在的问题。简单地说，该程序有一个「内存泄漏」问题，由于垃圾收集器活动的增加或内存占用的增加，它可以悄无声息地表现为性能的降低。在极端情况下，这种内存泄漏可能导致磁盘分页，甚至出现 OutOfMemoryError 程序故障，但这种故障相对少见。

So where is the memory leak? If a stack grows and then shrinks, the objects that were popped off the stack will not be garbage collected, even if the program using the stack has no more references to them. This is because the stack maintains obsolete references to these objects. An obsolete reference is simply a reference that will never be dereferenced again. In this case, any references outside of the “active portion” of the element array are obsolete. The active portion consists of the elements whose index is less than size.

> 那么内存泄漏在哪里呢？如果堆栈增长，然后收缩，那么从堆栈中弹出的对象将不会被垃圾收集，即使使用堆栈的程序不再引用它们。这是因为栈保留了这些对象的旧引用。一个过时的引用，是指永远不会被取消的引用。在本例中，元素数组的「活动部分」之外的任何引用都已过时。活动部分由索引小于大小的元素组成。

Memory leaks in garbage-collected languages (more properly known as unintentional object retentions) are insidious（adj.隐伏的，阴险的）. If an object reference is unintentionally retained, not only is that object excluded from garbage collection, but so too are any objects referenced by that object, and so on. Even if only a few object references are unintentionally retained, many, many objects may be prevented from being garbage collected, with potentially large effects on performance.

> 垃圾收集语言中的内存泄漏（更确切地说是无意的对象保留）是暗藏的风险。如果无意中保留了对象引用，那么对象不仅被排除在垃圾收集之外，该对象引用的任何对象也被排除在外，依此类推。即使只是无意中保留了一些对象引用，许多许多的对象也可能被阻止被垃圾收集，从而对性能产生潜在的巨大影响。

The fix for this sort of problem is simple: null out references once they become obsolete. In the case of our Stack class, the reference to an item becomes obsolete as soon as it’s popped off the stack. The corrected version of the pop method looks like this:

> 解决这类问题的方法很简单：一旦引用过时，就将置空。在我们的 Stack 类中，对某个项的引用一旦从堆栈中弹出就会过时。pop 方法的正确版本如下：

```java
public Object pop() {
    if (size == 0)
        throw new EmptyStackException();
    Object result = elements[--size];
    elements[size] = null; // Eliminate obsolete reference
    return result;
}
```

An added benefit of nulling out obsolete references is that if they are subsequently dereferenced by mistake, the program will immediately fail with a NullPointerException, rather than quietly doing the wrong thing. It is always beneficial to detect programming errors as quickly as possible.

> 用 null 处理过时引用的另一个好处是，如果它们随后被错误地关联引用，程序将立即失败，出现 NullPointerException，而不是悄悄地做错误的事情。尽可能快地检测编程错误总是有益的。

When programmers are first stung by this problem, they may overcompensate（vt.给予…过度补偿） by nulling out every object reference as soon as the program is finished using it.This is neither necessary nor desirable; it clutters up the program unnecessarily.Nulling out object references should be the exception rather than the norm.The best way to eliminate an obsolete reference is to let the variable that contained the reference fall out of scope. This occurs naturally if you define each variable in the narrowest possible scope (Item 57).

> 当程序员第一次被这个问题困扰时，他们可能会过度担心，一旦程序使用完它，他们就会取消所有对象引用。这既无必要也不可取；它不必要地搞乱了程序。清除对象引用应该是例外，而不是规范。消除过时引用的最佳方法是让包含引用的变量脱离作用域。如果你在最狭窄的范围内定义每个变量（Item-57），那么这种情况自然会发生。

So when should you null out a reference? What aspect of the Stack class makes it susceptible to memory leaks? Simply put, it manages its own memory.The storage pool consists of the elements of the elements array (the object reference cells, not the objects themselves). The elements in the active portion of the array (as defined earlier) are allocated, and those in the remainder of the array are free. The garbage collector has no way of knowing this; to the garbage collector, all of the object references in the elements array are equally valid.Only the programmer knows that the inactive portion of the array is unimportant.The programmer effectively communicates this fact to the garbage collector by manually nulling out array elements as soon as they become part of the inactive portion.

> 那么，什么时候应该取消引用呢？Stack 类的哪些方面容易导致内存泄漏？简单地说，它管理自己的内存。存储池包含元素数组的元素（对象引用单元，而不是对象本身）数组的活动部分（如前面所定义的）中的元素被分配，而数组其余部分中的元素是空闲的。垃圾收集器没有办法知道这一点；对于垃圾收集器，元素数组中的所有对象引用都同样有效。只有程序员知道数组的非活动部分不重要。只要数组元素成为非活动部分的一部分，程序员就可以通过手动清空数组元素，有效地将这个事实传递给垃圾收集器。

Generally speaking, whenever a class manages its own memory, the programmer should be alert for memory leaks. Whenever an element is freed,any object references contained in the element should be nulled out.

> 一般来说，当类管理自己的内存时，程序员应该警惕内存泄漏。每当释放一个元素时，元素中包含的任何对象引用都应该被取消。

Another common source of memory leaks is caches. Once you put an object reference into a cache, it’s easy to forget that it’s there and leave it in the cache long after it becomes irrelevant. There are several solutions to this problem. If you’re lucky enough to implement a cache for which an entry is relevant exactly so long as there are references to its key outside of the cache, represent the cache as a WeakHashMap; entries will be removed automatically after they become obsolete. Remember that WeakHashMap is useful only if the desired lifetime of cache entries is determined by external references to the key, not the value.

> 另一个常见的内存泄漏源是缓存。一旦将对象引用放入缓存中，就很容易忘记它就在那里，并且在它变得无关紧要之后很久仍将它留在缓存中。有几个解决这个问题的办法。如果你非常幸运地实现了一个缓存，只要缓存外有对其键的引用，那么就将缓存表示为 WeakHashMap；当条目过时后，条目将被自动删除。记住，WeakHashMap 只有在缓存条目的预期生存期由键的外部引用（而不是值）决定时才有用。

More commonly, the useful lifetime of a cache entry is less well defined, with entries becoming less valuable over time. Under these circumstances（n.情况）, the cache should occasionally be cleansed of entries that have fallen into disuse. This can be done by a background thread (perhaps a ScheduledThreadPoolExecutor) or as a side effect of adding new entries to the cache. The LinkedHashMap class facilitates the latter approach with its removeEldestEntry method. For more sophisticated caches, you may need to use java.lang.ref directly.

> 更常见的情况是，缓存条目的有效生存期定义不太好，随着时间的推移，条目的价值会越来越低。在这种情况下，缓存偶尔应该清理那些已经停用的条目。这可以通过后台线程（可能是 ScheduledThreadPoolExecutor）或向缓存添加新条目时顺便完成。LinkedHashMap 类通过其 removeEldestEntry 方法简化了后一种方法。对于更复杂的缓存，你可能需要直接使用 java.lang.ref。

**A third common source of memory leaks is listeners and other callbacks.** If you implement an API where clients register callbacks but don’t deregister them explicitly, they will accumulate unless you take some action. One way to ensure that callbacks are garbage collected promptly is to store only weak references to them, for instance, by storing them only as keys in a WeakHashMap.

> **内存泄漏的第三个常见来源是侦听器和其他回调。** 如果你实现了一个 API，其中客户端注册回调，但不显式取消它们，除非你采取一些行动，否则它们将累积。确保回调被及时地垃圾收集的一种方法是仅存储对它们的弱引用，例如，将它们作为键存储在 WeakHashMap 中。

Because memory leaks typically do not manifest themselves as obvious failures, they may remain present in a system for years. They are typically discovered only as a result of careful code inspection or with the aid of a debugging tool known as a heap profiler. Therefore, it is very desirable to learn to anticipate problems like this before they occur and prevent them from happening.

> 由于内存泄漏通常不会表现为明显的故障，它们可能会在系统中存在多年。它们通常只能通过仔细的代码检查或借助一种称为堆分析器的调试工具来发现。因此，学会在这样的问题发生之前预测并防止它们发生是非常可取的。

---

## 【08】避免使用终结器和清除器

> Avoid finalizers and cleaners

**Finalizers are unpredictable, often dangerous, and generally unnecessary.** Their use can cause erratic behavior, poor performance, and portability problems. Finalizers have a few valid uses, which we’ll cover later in this item, but as a rule, you should avoid them. As of Java 9, finalizers have been deprecated, but they are still being used by the Java libraries. The Java 9 replacement for finalizers is cleaners. **Cleaners are less dangerous than finalizers, but still unpredictable, slow, and generally unnecessary.**

> **终结器是不可预测的，通常是危险的，也是不必要的。** 它们的使用可能导致不稳定的行为、糟糕的性能和可移植性问题。终结器有一些有效的用途，我们将在后面的文章中介绍，但是作为规则，你应该避免使用它们。在 Java 9 中，终结器已经被弃用，但是 Java 库仍然在使用它们。Java 9 替代终结器的是清除器。**清除器的危险比终结器小，但仍然不可预测、缓慢，而且通常是不必要的。**

C++ programmers are cautioned not to think of finalizers or cleaners as Java’s analogue of C++ destructors. In C++, destructors are the normal way to reclaim the resources associated with an object, a necessary counterpart to constructors. In Java, the garbage collector reclaims the storage associated with an object when it becomes unreachable, requiring no special effort on the part of the programmer. C++ destructors are also used to reclaim other nonmemory resources. In Java, a try-with-resources or try-finally block is used for this purpose (Item 9).

> c++ 程序员被告诫不要把终结器或清除器当成 Java 的 c++ 析构函数。在 c++ 中，析构函数是回收与对象相关联的资源的常用方法，对象是构造函数的必要对等物。在 Java 中，当对象变得不可访问时，垃圾收集器将回收与之关联的存储，无需程序员进行任何特殊工作。c++ 析构函数还用于回收其他非内存资源。在 Java 中，使用带有资源的 try-with-resources 或 try-finally 块用于此目的（Item-9）。

One shortcoming of finalizers and cleaners is that there is no guarantee they’ll be executed promptly [JLS, 12.6]. It can take arbitrarily long between the time that an object becomes unreachable and the time its finalizer or cleaner runs.This means that you should never do anything time-critical in a finalizer or cleaner. For example, it is a grave error to depend on a finalizer or cleaner to close files because open file descriptors are a limited resource. If many files are left open as a result of the system’s tardiness in running finalizers or cleaners, a program may fail because it can no longer open files.

> 终结器和清除器的一个缺点是不能保证它们会被立即执行 [JLS, 12.6]。当对象变得不可访问，终结器或清除器对它进行操作的时间是不确定的。这意味着永远不应该在终结器或清除器中执行任何对时间要求很严格的操作。例如，依赖终结器或清除器关闭文件就是一个严重错误，因为打开的文件描述符是有限的资源。如果由于系统在运行终结器或清除器的延迟导致许多文件处于打开状态，程序可能会运行失败，因为它不能再打开其他文件。

The promptness with which finalizers and cleaners are executed is primarily a function of the garbage collection algorithm, which varies widely across implementations. The behavior of a program that depends on the promptness of finalizer or cleaner execution may likewise vary. It is entirely possible that such a program will run perfectly on the JVM on which you test it and then fail miserably on the one favored by your most important customer.

> 终结器和清除器执行的快速性主要是垃圾收集算法的功能，在不同的实现中存在很大差异。依赖于终结器的及时性或更清晰的执行的程序的行为可能也会发生变化。这样的程序完全有可能在测试它的 JVM 上完美地运行，然后在最重要的客户喜欢的 JVM 上悲惨地失败。

Tardy finalization is not just a theoretical problem. Providing a finalizer for a class can arbitrarily delay reclamation of its instances. A colleague debugged a long-running GUI application that was mysteriously dying with an OutOfMemoryError. Analysis revealed that at the time of its death, the application had thousands of graphics objects on its finalizer queue just waiting to be finalized and reclaimed. Unfortunately, the finalizer thread was running at a lower priority than another application thread, so objects weren’t getting finalized at the rate they became eligible for finalization. The language specification makes no guarantees as to which thread will execute finalizers, so there is no portable way to prevent this sort of problem other than to refrain from using finalizers. Cleaners are a bit better than finalizers in this regard because class authors have control over their own cleaner threads, but cleaners still run in the background, under the control of the garbage collector, so there can be no guarantee of prompt cleaning.

> 姗姗来迟的定稿不仅仅是一个理论上的问题。为类提供终结器可以任意延迟其实例的回收。一位同事调试了一个长期运行的 GUI 应用程序，该应用程序神秘地终结于 OutOfMemoryError 错误。分析显示，在应用程序终结的时候，终结器队列上有数千个图形对象等待最终完成和回收。不幸的是，终结器线程运行的优先级低于另一个应用程序线程，因此对象不能以适合终结器的速度完成。语言规范没有保证哪个线程将执行终结器，因此除了避免使用终结器之外，没有其他可移植的方法来防止这类问题。在这方面，清洁器比终结器要好一些，因为类作者可以自己控制是否清理线程，但是清洁器仍然在后台运行，在垃圾收集器的控制下运行，所以不能保证及时清理。

Not only does the specification provide no guarantee that finalizers or cleaners will run promptly; it provides no guarantee that they’ll run at all. It is entirely possible, even likely, that a program terminates without running them on some objects that are no longer reachable. As a consequence, you should never depend on a finalizer or cleaner to update persistent state. For example,depending on a finalizer or cleaner to release a persistent lock on a shared resource such as a database is a good way to bring your entire distributed system to a grinding halt.

> 该规范不仅不能保证终结器或清洁剂能及时运行；它并不能保证它们能运行。完全有可能，甚至很有可能，程序在某些不再可访问的对象上运行而终止。因此，永远不应该依赖终结器或清除器来更新持久状态。例如，依赖终结器或清除器来释放共享资源（如数据库）上的持久锁，是让整个分布式系统停止工作的好方法。

Don’t be seduced by the methods System.gc and System.runFinalization. They may increase the odds of finalizers or cleaners getting executed, but they don’t guarantee it. Two methods once claimed to make this guarantee: System.runFinalizersOnExit and its evil twin, Runtime.runFinalizersOnExit. These methods are fatally flawed and have been deprecated for decades [ThreadStop].

> 不要被 System.gc 和 System.runFinalization 的方法所诱惑。它们可能会增加终结器或清除器被运行的几率，但它们不能保证一定运行。曾经有两种方法声称可以保证这一点：System.runFinalizersOnExit 和它的孪生兄弟 Runtime.runFinalizersOnExit。这些方法存在致命的缺陷，并且已经被废弃了几十年[ThreadStop]。

Another problem with finalizers is that an uncaught exception thrown during finalization is ignored, and finalization of that object terminates [JLS, 12.6].Uncaught exceptions can leave other objects in a corrupt state. If another thread attempts to use such a corrupted object, arbitrary nondeterministic behavior may result. Normally, an uncaught exception will terminate the thread and print a stack trace, but not if it occurs in a finalizer—it won’t even print a warning.Cleaners do not have this problem because a library using a cleaner has control over its thread.

> 终结器的另一个问题是，在终结期间抛出的未捕获异常被忽略，该对象的终结终止 [JLS, 12.6]。未捕获的异常可能会使其他对象处于损坏状态。如果另一个线程试图使用这样一个损坏的对象，可能会导致任意的不确定性行为。正常情况下，未捕获的异常将终止线程并打印堆栈跟踪，但如果在终结器中出现，则不会打印警告。清除器没有这个问题，因为使用清除器的库可以控制它的线程。

There is a severe performance penalty for using finalizers and cleaners.On my machine, the time to create a simple AutoCloseable object, to close it using try-with-resources, and to have the garbage collector reclaim it is about 12 ns. Using a finalizer instead increases the time to 550 ns. In other words, it is about 50 times slower to create and destroy objects with finalizers. This is primarily because finalizers inhibit efficient garbage collection. Cleaners are comparable in speed to finalizers if you use them to clean all instances of the class (about 500 ns per instance on my machine), but cleaners are much faster if you use them only as a safety net, as discussed below. Under these circumstances, creating, cleaning, and destroying an object takes about 66 ns on my machine, which means you pay a factor of five (not fifty) for the insurance of a safety net if you don’t use it.

> 使用终结器和清除器会严重影响性能。在我的机器上，创建一个简单的 AutoCloseable 对象，使用 try-with-resources 关闭它以及让垃圾收集器回收它的时间大约是 12ns。相反，使用终结器将时间增加到 550ns。换句话说，使用终结器创建和销毁对象大约要慢 50 倍。这主要是因为终结器抑制了有效的垃圾收集。如果使用清除器清除的所有实例（在我的机器上每个实例大约 500ns），那么清除器的速度与终结器相当，但是如果只将它们作为安全网来使用，清除器的速度要快得多，如下所述。在这种情况下，在我的机器上创建、清理和销毁一个对象需要花费 66ns 的时间，这意味着如果你不使用它，你需要多出五倍（而不是五十倍）的保障成本。

Finalizers have a serious security problem: they open your class up to finalizer attacks. The idea behind a finalizer attack is simple: If an exception is thrown from a constructor or its serialization equivalents—the readObject and readResolve methods (Chapter 12)—the finalizer of a malicious subclass can run on the partially constructed object that should have “died on the vine.” This finalizer can record a reference to the object in a static field,preventing it from being garbage collected. Once the malformed object has been recorded, it is a simple matter to invoke arbitrary methods on this object that should never have been allowed to exist in the first place. Throwing an exception from a constructor should be sufficient to prevent an object from coming into existence; in the presence of finalizers, it is not. Such attacks can have dire consequences. Final classes are immune to finalizer attacks because no one can write a malicious subclass of a final class. To protect nonfinal classes from finalizer attacks, write a final finalize method that does nothing.

> 终结器有一个严重的安全问题：它们会让你的类受到终结器攻击。终结器攻击背后的思想很简单：如果从构造函数或它的序列化等价物（readObject 和 readResolve 方法（Item-12））抛出一个异常，恶意子类的终结器就可以运行在部分构造的对象上，而这个对象本来应该「胎死腹中」。这个终结器可以在静态字段中记录对对象的引用，防止它被垃圾收集。一旦记录了畸形对象，就很容易在这个对象上调用本来就不应该存在的任意方法。从构造函数抛出异常应该足以防止对象的出现；在有终结器的情况下，就不是这样了。这样的攻击可能会造成可怕的后果。最终类对终结器攻击免疫，因为没有人能够编写最终类的恶意子类。为了保护非最终类不受终结器攻击，编写一个不执行任何操作的最终终结方法。

So what should you do instead of writing a finalizer or cleaner for a class whose objects encapsulate resources that require termination, such as files or threads? Just have your class implement AutoCloseable, and require its clients to invoke the close method on each instance when it is no longer needed, typically using try-with-resources to ensure termination even in the face of exceptions (Item 9). One detail worth mentioning is that the instance must keep track of whether it has been closed: the close method must record in a field that the object is no longer valid, and other methods must check this field and throw an IllegalStateException if they are called after the object has been closed.

> 那么，如果一个类的对象封装了需要终止的资源，例如文件或线程，那么应该做什么，而不是为它编写终结器或清除器呢？只有你的类实现 AutoCloseable，要求其客户端每个实例在不再需要时调用关闭方法，通常使用 try-with-resources 确保终止，即使面对异常（Item-9）。一个值得一提的细节是实例必须跟踪是否已经关闭：close 方法必须在字段中记录对象不再有效，其他方法必须检查这个字段，如果在对象关闭后调用它们，则必须抛出一个 IllegalStateException。

So what, if anything, are cleaners and finalizers good for? They have perhaps two legitimate uses. One is to act as a safety net in case the owner of a resource neglects to call its close method. While there’s no guarantee that the cleaner or finalizer will run promptly (or at all), it is better to free the resource late than never if the client fails to do so. If you’re considering writing such a safety-net finalizer, think long and hard about whether the protection is worth the cost.Some Java library classes, such as FileInputStream,FileOutputStream, ThreadPoolExecutor, and java.sql.Connection, have finalizers that serve as safety nets.

> 那么，清除器和终结器有什么用呢？它们可能有两种合法用途。一种是充当一个安全网，以防资源的所有者忽略调用它的 close 方法。虽然不能保证清除器或终结器将立即运行（或根本不运行），但如果客户端没有这样做，最好是延迟释放资源。如果你正在考虑编写这样一个安全网络终结器，那就好好考虑一下这种保护是否值得。一些 Java 库类，如 FileInputStream、FileOutputStream、ThreadPoolExecutor 和 java.sql.Connection，都有终结器作为安全网。

A second legitimate use of cleaners concerns objects with native peers. A native peer is a native (non-Java) object to which a normal object delegates via native methods. Because a native peer is not a normal object, the garbage collector doesn’t know about it and can’t reclaim it when its Java peer is reclaimed. A cleaner or finalizer may be an appropriate vehicle for this task,assuming the performance is acceptable and the native peer holds no critical resources. If the performance is unacceptable or the native peer holds resources that must be reclaimed promptly, the class should have a close method, as described earlier.

> 清洁器的第二个合法使用涉及到与本机对等体的对象。本机对等点是普通对象通过本机方法委托给的本机（非 java）对象。因为本机对等点不是一个正常的对象，垃圾收集器不知道它，并且不能在回收 Java 对等点时回收它。如果性能是可接受的，并且本机对等体不持有任何关键资源，那么更清洁或终结器可能是完成这项任务的合适工具。如果性能不可接受，或者本机对等体持有必须立即回收的资源，则类应该具有前面描述的关闭方法。

Cleaners are a bit tricky to use. Below is a simple Room class demonstrating（n.演示；v.证明） the facility. Let’s assume that rooms must be cleaned before they are reclaimed.The Room class implements AutoCloseable; the fact that its automatic cleaning safety net uses a cleaner is merely an implementation detail. Unlike finalizers, cleaners do not pollute a class’s public API:

> 清除器的使用有些棘手。下面是一个简单的 Room 类，展示了这个设施。让我们假设房间在回收之前必须被清理。Room 类实现了 AutoCloseable；它的自动清洗安全网使用了清除器，这只是一个实现细节。与终结器不同，清除器不会污染类的公共 API：

```java
import sun.misc.Cleaner;

// An autocloseable class using a cleaner as a safety net
public class Room implements AutoCloseable {
    private static final Cleaner cleaner = Cleaner.create();

    // Resource that requires cleaning. Must not refer to Room!
    private static class State implements Runnable {
        int numJunkPiles; // Number of junk piles in this room

        State(int numJunkPiles) {
            this.numJunkPiles = numJunkPiles;
        }

        // Invoked by close method or cleaner
        @Override
        public void run() {
            System.out.println("Cleaning room");
            numJunkPiles = 0;
        }
    }

    // The state of this room, shared with our cleanable
    private final State state;
    // Our cleanable. Cleans the room when it’s eligible for gc
    private final Cleaner.Cleanable cleanable;

    public Room(int numJunkPiles) {
        state = new State(numJunkPiles);
        cleanable = cleaner.register(this, state);
    }

    @Override
    public void close() {
        cleanable.clean();
    }
}
```

The static nested State class holds the resources that are required by the cleaner to clean the room. In this case, it is simply the numJunkPiles field,which represents the amount of mess in the room. More realistically, it might be a final long that contains a pointer to a native peer. State implements Runnable, and its run method is called at most once, by the Cleanable that we get when we register our State instance with our cleaner in the Room constructor. The call to the run method will be triggered by one of two things:Usually it is triggered by a call to Room’s close method calling Cleanable’s clean method. If the client fails to call the close method by the time a Room instance is eligible for garbage collection, the cleaner will (hopefully) call State’s run method.

> 静态嵌套 State 类持有清洁器清洁房间所需的资源。在这种情况下，它仅仅是 numJunkPiles 字段，表示房间的混乱程度。更实际地说，它可能是最后一个包含指向本机对等点的 long 指针。State 实现了 Runnable，它的运行方法最多被调用一次，由我们在 Room 构造器中向 cleaner 实例注册状态实例时得到的 Cleanable 调用。对 run 方法的调用将由以下两种方法之一触发：通常是通过调用 Room 的 close 方法来触发，调用 Cleanable 的 clean 方法。如果当一个 Room 实例有资格进行垃圾收集时，客户端没有调用 close 方法，那么清除器将调用 State 的 run 方法（希望如此）。

It is critical that a State instance does not refer to its Room instance. If it did, it would create a circularity that would prevent the Room instance from becoming eligible for garbage collection (and from being automatically cleaned).Therefore, State must be a static nested class because nonstatic nested classes contain references to their enclosing instances (Item 24). It is similarly inadvisable to use a lambda because they can easily capture references to enclosing objects.

> 状态实例不引用其 Room 实例是非常重要的。如果它这样做了，它将创建一个循环，以防止 Room 实例有资格进行垃圾收集（以及自动清理）。因此，状态必须是一个静态嵌套类，因为非静态嵌套类包含对其封闭实例的引用（Item-24）。同样不建议使用 lambda，因为它们可以很容易地捕获对包围对象的引用。

As we said earlier, Room’s cleaner is used only as a safety net. If clients surround all Room instantiations in try-with-resource blocks, automatic cleaning will never be required. This well-behaved client demonstrates that behavior:

> 就像我们之前说的，Room 类的清除器只是用作安全网。如果客户端将所有 Room 实例包围在带有资源的 try 块中，则永远不需要自动清理。这位表现良好的客户端展示了这种做法：

```java
public class Adult {
    public static void main(String[] args) {
        try (Room myRoom = new Room(7)) {
            System.out.println("Goodbye");
        }
    }
}
```

As you’d expect, running the Adult program prints Goodbye, followed by Cleaning room. But what about this ill-behaved program, which never cleans its room?

> 如你所料，运行 Adult 程序打印「Goodbye」，然后是打扫房间。但这个从不打扫房间的不守规矩的程序怎么办？

```java
public class Teenager {
    public static void main(String[] args) {
        new Room(99);
        System.out.println("Peace out");
    }
}
```

You might expect it to print Peace out, followed by Cleaning room, but on my machine, it never prints Cleaning room; it just exits. This is the unpredictability we spoke of earlier. The Cleaner spec says, “The behavior of cleaners during System.exit is implementation specific. No guarantees are made relating to whether cleaning actions are invoked or not.” While the spec does not say it, the same holds true for normal program exit. On my machine,adding the line System.gc() to Teenager’s main method is enough to make it print Cleaning room prior to exit, but there’s no guarantee that you’ll see the same behavior on your machine. In summary, don’t use cleaners, or in releases prior to Java 9, finalizers,except as a safety net or to terminate noncritical native resources. Even then,beware the indeterminacy and performance consequences.

> 你可能期望它打印出「Peace out」，然后打扫房间，但在我的机器上，它从不打扫房间；它只是退出。这就是我们之前提到的不可预测性。Cleaner 规范说：「在 System.exit 中，清洁器的行为是特定于实现的。不保证清理操作是否被调用。」虽然规范没有说明，但对于普通程序退出来说也是一样。在我的机器上，将 System.gc() 添加到 Teenager 的主要方法中就足以让它在退出之前打扫房间，但不能保证在其他机器上看到相同的行为。总之，不要使用清洁器，或者在 Java 9 之前的版本中使用终结器，除非是作为安全网或终止非关键的本机资源。即便如此，也要小心不确定性和性能后果。

---

## 【09】使用 try-with-resources 优于 try-finally

> Prefer try-with-resources to try-finally

The Java libraries include many resources that must be closed manually（adv.手动地） by invoking a close method. Examples include InputStream,OutputStream, and java.sql.Connection. Closing resources is often overlooked（n.被忽视的；v.忽视） by clients, with predictably（adv.可以预见的是） dire performance consequences. While many of these resources use finalizers as a safety net, finalizers don’t work very well (Item 8).

> Java 库包含许多必须通过调用 close 方法手动关闭的资源。常见的有 InputStream、OutputStream 和 java.sql.Connection。关闭资源常常会被客户端忽略，这会导致可怕的性能后果。虽然这些资源中的许多都使用终结器作为安全网，但终结器并不能很好地工作（Item-8）。

Historically, a try-finally statement was the best way to guarantee that a resource would be closed properly, even in the face of an exception or return:

> 从历史上看，try-finally 语句是确保正确关闭资源的最佳方法，即使在出现异常或返回时也是如此：

```java
// try-finally - No longer the best way to close resources!
static String firstLineOfFile(String path) throws IOException {
    BufferedReader br = new BufferedReader(new FileReader(path));
    try {
        return br.readLine();
    } finally {
        br.close();
    }
}
```

This may not look bad, but it gets worse when you add a second resource:

> 这可能看起来不坏，但添加第二个资源时，情况会变得更糟：

```java
// try-finally is ugly when used with more than one resource!
static void copy(String src, String dst) throws IOException {
    InputStream in = new FileInputStream(src);
    try {
        OutputStream out = new FileOutputStream(dst);
    try {
        byte[] buf = new byte[BUFFER_SIZE];
        int n;
        while ((n = in.read(buf)) >= 0)
            out.write(buf, 0, n);
    } finally {
        out.close();
        }
    }
    finally {
        in.close();
    }
}
```

It may be hard to believe, but even good programmers got this wrong most of the time. For starters, I got it wrong on page 88 of Java Puzzlers [Bloch05], and no one noticed for years. In fact, two-thirds of the uses of the close method in the Java libraries were wrong in 2007.

> 这可能难以置信。在大多数情况下，即使是优秀的程序员也会犯这种错误。首先，我在 Java Puzzlers [Bloch05]的 88 页上做错了，多年来没有人注意到。事实上，2007 年发布的 Java 库中三分之二的 close 方法使用都是错误的。

**译注：《Java Puzzlers》的中文译本为《Java 解惑》**

Even the correct code for closing resources with try-finally statements,as illustrated（v.阐明） in the previous two code examples, has a subtle deficiency. The code in both the try block and the finally block is capable of throwing exceptions. For example, in the firstLineOfFile method, the call to readLine could throw an exception due to a failure in the underlying physical device, and the call to close could then fail for the same reason. Under these circumstances, the second exception completely obliterates（vt.抹去） the first one. There is no record of the first exception in the exception stack trace, which can greatly complicate debugging in real systems—usually it’s the first exception that you want to see in order to diagnose the problem. While it is possible to write code to suppress the second exception in favor of the first, virtually no one did because it’s just too verbose.

> 使用 try-finally 语句关闭资源的正确代码（如前两个代码示例所示）也有一个细微的缺陷。try 块和 finally 块中的代码都能够抛出异常。例如，在 firstLineOfFile 方法中，由于底层物理设备发生故障，对 readLine 的调用可能会抛出异常，而关闭的调用也可能出于同样的原因而失败。在这种情况下，第二个异常将完全覆盖第一个异常。异常堆栈跟踪中没有第一个异常的记录，这可能会使实际系统中的调试变得非常复杂（而这可能是希望出现的第一个异常，以便诊断问题）。虽然可以通过编写代码来抑制第二个异常而支持第一个异常，但实际上没有人这样做，因为它太过冗长。

All of these problems were solved in one fell swoop when Java 7 introduced the try-with-resources statement [JLS, 14.20.3]. To be usable with this construct, a resource must implement the AutoCloseable interface, which consists of a single void-returning close method. Many classes and interfaces in the Java libraries and in third-party libraries now implement or extend AutoCloseable. If you write a class that represents a resource that must be closed, your class should implement AutoCloseable too.

> 当 Java 7 引入 try-with-resources 语句 [JLS, 14.20.3]时，所有这些问题都一次性解决了。要使用这个结构，资源必须实现 AutoCloseable 接口，它由一个单独的 void-return close 方法组成。Java 库和第三方库中的许多类和接口现在都实现或扩展了 AutoCloseable。如果你编写的类存在必须关闭的资源，那么也应该实现 AutoCloseable。

Here’s how our first example looks using try-with-resources:

> 下面是使用 try-with-resources 的第一个示例：

```java
// try-with-resources - the the best way to close resources!
static String firstLineOfFile(String path) throws IOException {
    try (BufferedReader br = new BufferedReader(new FileReader(path))) {
        return br.readLine();
    }
}
```

And here’s how our second example looks using try-with-resources:

> 下面是使用 try-with-resources 的第二个示例：

```java
// try-with-resources on multiple resources - short and sweet
static void copy(String src, String dst) throws IOException {
    try (InputStream in = new FileInputStream(src);OutputStream out = new FileOutputStream(dst)) {
        byte[] buf = new byte[BUFFER_SIZE];
        int n;
        while ((n = in.read(buf)) >= 0)
            out.write(buf, 0, n);
    }
}
```

originals, but they provide far better diagnostics. Consider the firstLineOfFile method. If exceptions are thrown by both the readLine call and the (invisible) close, the latter exception is suppressed in favor of the former. In fact, multiple exceptions may be suppressed in order to preserve the exception that you actually want to see. These suppressed exceptions are not merely discarded; they are printed in the stack trace with a notation saying that they were suppressed. You can also access them programmatically with the getSuppressed method, which was added to Throwable in Java 7.

> 和使用 try-finally 的原版代码相比，try-with-resources 为开发者提供了更好的诊断方式。考虑 firstLineOfFile 方法。如果异常是由 readLine 调用和不可见的 close 抛出的，则后一个异常将被抑制，以支持前一个异常。实际上，还可能会抑制多个异常，以保留实际希望看到的异常。这些被抑制的异常不会仅仅被抛弃；它们会被打印在堆栈跟踪中，并标记它们被抑制。可以通过编程方式使用 getSuppressed 方法访问到它们，该方法是在 Java 7 中添加到 Throwable 中的。

You can put catch clauses on try-with-resources statements, just as you can on regular try-finally statements. This allows you to handle exceptions without sullying your code with another layer of nesting. As a slightly contrived example, here’s a version our firstLineOfFile method that does not throw exceptions, but takes a default value to return if it can’t open the file or read from it:

> 可以在带有资源的 try-with-resources 语句中放置 catch 子句，就像在常规的 try-finally 语句上一样。这允许处理异常时不必用另一层嵌套来影响代码。作为一个特指的示例，下面是我们的 firstLineOfFile 方法的一个版本，它不抛出异常，但如果无法打开文件或从中读取文件，则返回一个默认值：

```java
// try-with-resources with a catch clause
static String firstLineOfFile(String path, String defaultVal) {
    try (BufferedReader br = new BufferedReader(new FileReader(path))) {
        return br.readLine();
    } catch (IOException e) {
        return defaultVal;
    }
}
```

The lesson is clear: Always use try-with-resources in preference to tryfinally when working with resources that must be closed. The resulting code is shorter and clearer, and the exceptions that it generates are more useful. The try-with-resources statement makes it easy to write correct code using resources that must be closed, which was practically impossible using tryfinally.

> 教训很清楚：在使用必须关闭的资源时，总是优先使用 try-with-resources，而不是 try-finally。前者的代码更短、更清晰，生成的异常更有用。使用 try-with-resources 语句可以很容易地为必须关闭的资源编写正确的代码，而使用 try-finally 几乎是不可能的。

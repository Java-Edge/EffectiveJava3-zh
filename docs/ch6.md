# 第 6 章 枚举和注解

## 【34】用枚举类型代替 int 常量

> Use enums instead of int constants

An enumerated type is a type whose legal values consist of a fixed set of constants, such as the seasons of the year, the planets in the solar system, or the suits in a deck of playing cards. Before enum types were added to the language, a common pattern for representing enumerated types was to declare a group of named int constants, one for each member of the type:

> 枚举类型是这样一种类型：它合法的值由一组固定的常量组成，如：一年中的季节、太阳系中的行星或扑克牌中的花色。在枚举类型被添加到 JAVA 之前，表示枚举类型的一种常见模式是声明一组 int 的常量，每个类型的成员都有一个：

```java
// The int enum pattern - severely deficient!
public static final int APPLE_FUJI = 0;
public static final int APPLE_PIPPIN = 1;
public static final int APPLE_GRANNY_SMITH = 2;
public static final int ORANGE_NAVEL = 0;
public static final int ORANGE_TEMPLE = 1;
public static final int ORANGE_BLOOD = 2;
```

This technique, known as the int enum pattern, has many shortcomings. It provides nothing in the way of type safety and little in the way of expressive power. The compiler won’t complain if you pass an apple to a method that expects an orange, compare apples to oranges with the == operator, or worse:

> 这种技术称为 int 枚举模式，它有许多缺点。它没有提供任何类型安全性，并且几乎不具备表现力。如果你传递一个苹果给方法，希望得到一个橘子，使用 == 操作符比较苹果和橘子时编译器并不会提示错误，或更糟的情况：

```java
// Tasty citrus flavored applesauce!
int i = (APPLE_FUJI - ORANGE_TEMPLE) / APPLE_PIPPIN;
```

Note that the name of each apple constant is prefixed with APPLE* and the name of each orange constant is prefixed with ORANGE*. This is because Java doesn’t provide namespaces for int enum groups. Prefixes prevent name clashes when two int enum groups have identically named constants, for example between ELEMENT_MERCURY and PLANET_MERCURY.

> 注意，每个 apple 常量的名称都以 APPLE* 为前缀，每个 orange 常量的名称都以 ORANGE* 为前缀。这是因为 Java 不为这些 int 枚举提供名称空间。当两组 int 枚举具有相同的命名常量时，前缀可以防止名称冲突，例如 ELEMENT_MERCURY 和 PLANET_MERCURY 之间的冲突。

Programs that use int enums are brittle. Because int enums are constant variables [JLS, 4.12.4], their int values are compiled into the clients that use them [JLS, 13.1]. If the value associated with an int enum is changed, its clients must be recompiled. If not, the clients will still run, but their behavior will be incorrect.

> 使用 int 枚举的程序很脆弱。因为 int 枚举是常量变量 [JLS, 4.12.4]，所以它们的值被编译到使用它们的客户端中 [JLS, 13.1]。如果与 int 枚举关联的值发生了更改，则必须重新编译客户端。如果不重新编译，客户端仍然可以运行，但是他们的行为将是错误的。

There is no easy way to translate int enum constants into printable strings. If you print such a constant or display it from a debugger, all you see is a number, which isn’t very helpful. There is no reliable way to iterate over all the int enum constants in a group, or even to obtain the size of an int enum group.

> 没有一种简单的方法可以将 int 枚举常量转换为可打印的字符串。如果你打印这样的常量或从调试器中显示它，你所看到的只是一个数字，这不是很有帮助。没有可靠的方法可以遍历组中的所有 int 枚举常量，甚至无法获得组的大小。

You may encounter a variant of this pattern in which String constants are used in place of int constants. This variant, known as the String enum pattern, is even less desirable. While it does provide printable strings for its constants, it can lead naive users to hard-code string constants into client code instead of using field names. If such a hard-coded string constant contains a typographical error, it will escape detection at compile time and result in bugs at runtime. Also, it might lead to performance problems, because it relies on string comparisons.

> 可能会遇到这种模式的另一种形式：使用 String 常量代替 int 常量。这种称为 String 枚举模式的变体甚至更不可取。虽然它确实为常量提供了可打印的字符串，但是它可能会导致不知情的用户将字符串常量硬编码到客户端代码中，而不是使用字段名。如果这样一个硬编码的 String 常量包含一个排版错误，它将在编译时躲过检测，并在运行时导致错误。此外，它可能会导致性能问题，因为它依赖于字符串比较。

Luckily, Java provides an alternative that avoids all the shortcomings of the int and string enum patterns and provides many added benefits. It is the enum type [JLS, 8.9]. Here’s how it looks in its simplest form:

> 幸运的是，Java 提供了一种替代方案，它避免了 int 和 String 枚举模式的所有缺点，并提供了许多额外的好处。它就是枚举类型 [JLS, 8.9]。下面是它最简单的形式：

```java
public enum Apple { FUJI, PIPPIN, GRANNY_SMITH }
public enum Orange { NAVEL, TEMPLE, BLOOD }
```

On the surface, these enum types may appear similar to those of other languages, such as C, C++, and C#, but appearances are deceiving. Java’s enum types are full-fledged classes, far more powerful than their counterparts in these other languages, where enums are essentially int values.

> 从表面上看，这些枚举类型可能与其他语言（如 C、c++ 和 c#）的枚举类型类似，但不能只看表象。Java 的枚举类型是成熟的类，比其他语言中的枚举类型功能强大得多，在其他语言中的枚举本质上是 int 值。

The basic idea behind Java’s enum types is simple: they are classes that export one instance for each enumeration constant via a public static final field. Enum types are effectively final, by virtue of having no accessible constructors. Because clients can neither create instances of an enum type nor extend it, there can be no instances but the declared enum constants. In other words, enum types are instance-controlled (page 6). They are a generalization of singletons (Item 3), which are essentially single-element enums.

> Java 枚举类型背后的基本思想很简单：它们是通过 public static final 修饰的字段为每个枚举常量导出一个实例的类。枚举类型实际上是 final 类型，因为没有可访问的构造函数。客户端既不能创建枚举类型的实例，也不能扩展它，所以除了声明的枚举常量之外，不能有任何实例。换句话说，枚举类型是实例受控的类（参阅第 6 页，Item-1）。它们是单例（Item-3）的推广应用，单例本质上是单元素的枚举。

Enums provide compile-time type safety. If you declare a parameter to be of type Apple, you are guaranteed that any non-null object reference passed to the parameter is one of the three valid Apple values. Attempts to pass values of the wrong type will result in compile-time errors, as will attempts to assign an expression of one enum type to a variable of another, or to use the == operator to compare values of different enum types.

> 枚举提供编译时类型的安全性。如果将参数声明为 Apple 枚举类型，则可以保证传递给该参数的任何非空对象引用都是三个有效 Apple 枚举值之一。尝试传递错误类型的值将导致编译时错误，将一个枚举类型的表达式赋值给另一个枚举类型的变量，或者使用 == 运算符比较不同枚举类型的值同样会导致错误。

Enum types with identically named constants coexist（vi. 共存；和平共处） peacefully because each type has its own namespace. You can add or reorder constants in an enum type without recompiling its clients because the fields that export the constants provide a layer of insulation between an enum type and its clients: constant values are not compiled into the clients as they are in the int enum patterns. Finally, you can translate enums into printable strings by calling their toString method.

> 名称相同的枚举类型常量能和平共存，因为每种类型都有自己的名称空间。你可以在枚举类型中添加或重新排序常量，而无需重新编译其客户端，因为导出常量的字段在枚举类型及其客户端之间提供了一层隔离：常量值不会像在 int 枚举模式中那样编译到客户端中。最后，你可以通过调用枚举的 toString 方法将其转换为可打印的字符串。

In addition to rectifying the deficiencies of int enums, enum types let you add arbitrary methods and fields and implement arbitrary interfaces. They provide high-quality implementations of all the Object methods (Chapter 3), they implement Comparable (Item 14) and Serializable (Chapter 12), and their serialized form is designed to withstand most changes to the enum type.

> 除了纠正 int 枚举的不足之外，枚举类型还允许添加任意方法和字段并实现任意接口。它们提供了所有 Object 方法的高质量实现（参阅 Chapter 3），还实现了 Comparable（Item-14）和 Serializable（参阅 Chapter 12），并且它们的序列化形式被设计成能够适应枚举类型的可变性。

So why would you want to add methods or fields to an enum type? For starters, you might want to associate data with its constants. Our Apple and Orange types, for example, might benefit from a method that returns the color of the fruit, or one that returns an image of it. You can augment an enum type with any method that seems appropriate. An enum type can start life as a simple collection of enum constants and evolve over time into a full-featured abstraction.

> 那么，为什么要向枚举类型添加方法或字段呢？首先，你可能希望将数据与其常量关联起来。例如，我们的 Apple 和 Orange 类型可能受益于返回水果颜色的方法，或者返回水果图像的方法。你可以使用任何适当的方法来扩充枚举类型。枚举类型可以从枚举常量的简单集合开始，并随着时间的推移演变为功能齐全的抽象。

For a nice example of a rich enum type, consider the eight planets of our solar system. Each planet has a mass and a radius, and from these two attributes you can compute its surface gravity. This in turn lets you compute the weight of an object on the planet’s surface, given the mass of the object. Here’s how this enum looks. The numbers in parentheses after each enum constant are parameters that are passed to its constructor. In this case, they are the planet’s mass and radius:

> 对于富枚举类型来说，有个很好的例子，考虑我们太阳系的八颗行星。每颗行星都有质量和半径，通过这两个属性你可以计算出它的表面引力。反过来，可以给定物体的质量，让你计算出一个物体在行星表面的重量。这个枚举是这样的。每个枚举常量后括号中的数字是传递给其构造函数的参数。在本例中，它们是行星的质量和半径：

```java
// Enum type with data and behavior
public enum Planet {
    MERCURY(3.302e+23, 2.439e6),
    VENUS (4.869e+24, 6.052e6),
    EARTH (5.975e+24, 6.378e6),
    MARS (6.419e+23, 3.393e6),
    JUPITER(1.899e+27, 7.149e7),
    SATURN (5.685e+26, 6.027e7),
    URANUS (8.683e+25, 2.556e7),
    NEPTUNE(1.024e+26, 2.477e7);

    private final double mass; // In kilograms
    private final double radius; // In meters
    private final double surfaceGravity; // In m / s^2

    // Universal gravitational constant in m^3 / kg s^2
    private static final double G = 6.67300E-11;

    // Constructor
    Planet(double mass, double radius) {
        this.mass = mass;
        this.radius = radius;
        surfaceGravity = G * mass / (radius * radius);
    }

    public double mass() { return mass; }
    public double radius() { return radius; }
    public double surfaceGravity() { return surfaceGravity; }

    public double surfaceWeight(double mass) {
        return mass * surfaceGravity; // F = ma
    }
}
```

It is easy to write a rich enum type such as Planet. **To associate data with enum constants, declare instance fields and write a constructor that takes the data and stores it in the fields.** Enums are by their nature immutable, so all fields should be final (Item 17). Fields can be public, but it is better to make them private and provide public accessors (Item 16). In the case of Planet, the constructor also computes and stores the surface gravity, but this is just an optimization. The gravity could be recomputed from the mass and radius each time it was used by the surfaceWeight method, which takes an object’s mass and returns its weight on the planet represented by the constant. While the Planet enum is simple, it is surprisingly powerful. Here is a short program that takes the earth weight of an object (in any unit) and prints a nice table of the object’s weight on all eight planets (in the same unit):

> 编写一个富枚举类型很容易，如上述的 Planet。**要将数据与枚举常量关联，可声明实例字段并编写一个构造函数，该构造函数接受数据并将其存储在字段中。** 枚举本质上是不可变的，因此所有字段都应该是 final（Item-17）。字段可以是公共的，但是最好将它们设置为私有并提供公共访问器（Item-16）。在 Planet 的例子中，构造函数还计算和存储表面重力，但这只是一个优化。每一次使用 surfaceWeight 方法时，都可以通过质量和半径重新计算重力。surfaceWeight 方法获取一个物体的质量，并返回其在该常数所表示的行星上的重量。虽然 Planet 枚举很简单，但它的力量惊人。下面是一个简短的程序，它获取一个物体的地球重量（以任何单位表示），并打印一个漂亮的表格，显示该物体在所有 8 个行星上的重量（以相同的单位表示）：

```java
public class WeightTable {
    public static void main(String[] args) {
        double earthWeight = Double.parseDouble(args[0]);
        double mass = earthWeight / Planet.EARTH.surfaceGravity();
    for (Planet p : Planet.values())
        System.out.printf("Weight on %s is %f%n",p, p.surfaceWeight(mass));
    }
}
```

Note that Planet, like all enums, has a static values method that returns an array of its values in the order they were declared. Note also that the toString method returns the declared name of each enum value, enabling easy printing by println and printf. If you’re dissatisfied with this string representation, you can change it by overriding the toString method. Here is the result of running our WeightTable program (which doesn’t override toString) with the command line argument 185:

> 请注意，Planet 和所有枚举一样，有一个静态值方法，该方法按照声明值的顺序返回其值的数组。还要注意的是，toString 方法返回每个枚举值的声明名称，这样就可以通过 println 和 printf 轻松打印。如果你对这个字符串表示不满意，可以通过重写 toString 方法来更改它。下面是用命令行运行我们的 WeightTable 程序（未覆盖 toString）的结果：

```java
Weight on MERCURY is 69.912739
Weight on VENUS is 167.434436
Weight on EARTH is 185.000000
Weight on MARS is 70.226739
Weight on JUPITER is 467.990696
Weight on SATURN is 197.120111
Weight on URANUS is 167.398264
Weight on NEPTUNE is 210.208751
```

Until 2006, two years after enums were added to Java, Pluto was a planet. This raises the question “what happens when you remove an element from an enum type?” The answer is that any client program that doesn’t refer to the removed element will continue to work fine. So, for example, our WeightTable program would simply print a table with one fewer row. And what of a client program that refers to the removed element (in this case, Planet.Pluto)? If you recompile the client program, the compilation will fail with a helpful error message at the line that refers to the erstwhile planet; if you fail to recompile the client, it will throw a helpful exception from this line at runtime. This is the best behavior you could hope for, far better than what you’d get with the int enum pattern.

> 直到 2006 年，也就是枚举被添加到 Java 的两年后，冥王星还是一颗行星。这就提出了一个问题：「从枚举类型中删除元素时会发生什么?」答案是，任何不引用被删除元素的客户端程序将继续正常工作。例如，我们的 WeightTable 程序只需打印一个少一行的表。那么引用被删除元素（在本例中是 Planet.Pluto）的客户端程序又如何呢？如果重新编译客户端程序，编译将失败，并在引用该「过时」行星的行中显示一条有用的错误消息；如果你未能重新编译客户端，它将在运行时从这行抛出一个有用的异常。这是你所希望的最佳行为，比 int 枚举模式要好得多。

Some behaviors associated with enum constants may need to be used only from within the class or package in which the enum is defined. Such behaviors are best implemented as private or package-private methods. Each constant then carries with it a hidden collection of behaviors that allows the class or package containing the enum to react appropriately when presented with the constant. Just as with other classes, unless you have a compelling reason to expose an enum method to its clients, declare it private or, if need be, package-private (Item 15).

> 与枚举常量相关的一些行为可能只需要在定义枚举的类或包中使用。此类行为最好以私有或包私有方法来实现。然后，每个常量都带有一个隐藏的行为集合，允许包含枚举的类或包在使用该常量时做出适当的反应。与其他类一样，除非你有充分的理由向其客户端公开枚举方法，否则将其声明为私有的，或者在必要时声明为包私有（Item-15）。

**译注：Java 中访问级别规则如下：**

**类访问级别：public（公共）、无修饰符（package-private，包私有）**

**成员访问级别：public（公共）、protected（保护）、private（私有）、无修饰符（package-private，包私有）**

If an enum is generally useful, it should be a top-level class; if its use is tied to a specific top-level class, it should be a member class of that top-level class (Item 24). For example, the java.math.RoundingMode enum represents a rounding mode for decimal fractions. These rounding modes are used by the BigDecimal class, but they provide a useful abstraction that is not fundamentally tied to BigDecimal. By making RoundingMode a top-level enum, the library designers encourage any programmer who needs rounding modes to reuse this enum, leading to increased consistency across APIs.

> 通常，如果一个枚举用途广泛，那么它应该是顶级类；如果它被绑定到一个特定的顶级类使用，那么它应该是这个顶级类（Item-24）的成员类。例如，java.math.RoundingMode 枚举表示小数部分的舍入模式。BigDecimal 类使用这些四舍五入模式，但是它们提供了一个有用的抽象，这个抽象与 BigDecimal 没有本质上的联系。通过使 RoundingMode 成为顶级枚举，库设计人员支持任何需要舍入模式的程序员重用该枚举，从而提高 API 之间的一致性。

The techniques demonstrated in the Planet example are sufficient（adj. 足够的；充分的） for most enum types, but sometimes you need more. There is different data associated with each Planet constant, but sometimes you need to associate fundamentally different behavior with each constant. For example, suppose you are writing an enum type to represent the operations on a basic four-function calculator and you want to provide a method to perform the arithmetic operation represented by each constant. One way to achieve this is to switch on the value of the enum:

> Planet 示例中演示的技术对于大多数枚举类型来说已经足够了，但有时还需要更多。每个行星常数都有不同的数据，但有时你需要将基本不同的行为与每个常数联系起来。例如，假设你正在编写一个枚举类型来表示一个基本的四则运算计算器上的操作，并且你希望提供一个方法来执行由每个常量表示的算术操作。实现这一点的一种方式是切换枚举的值：

```java
// Enum type that switches on its own value - questionable
public enum Operation {
    PLUS, MINUS, TIMES, DIVIDE;
    // Do the arithmetic operation represented by this constant
    public double apply(double x, double y) {
        switch(this) {
            case PLUS: return x + y;
            case MINUS: return x - y;
            case TIMES: return x * y;
            case DIVIDE: return x / y;
        }
    throw new AssertionError("Unknown op: "+ this);
    }
}
```

This code works, but it isn’t very pretty. It won’t compile without the throw statement because the end of the method is technically reachable, even though it will never be reached [JLS, 14.21]. Worse, the code is fragile. If you add a new enum constant but forget to add a corresponding case to the switch, the enum will still compile, but it will fail at runtime when you try to apply the new operation.

> 这段代码可以工作，但不是很漂亮。如果没有抛出语句，它将无法编译，因为从理论上讲，方法的结尾是可到达的，尽管它确实永远不会到达 [JLS, 14.21]。更糟糕的是，代码很脆弱。如果你添加了一个新的枚举常量，但忘记向 switch 添加相应的 case，则枚举仍将编译，但在运行时尝试应用新操作时将失败。

Luckily, there is a better way to associate a different behavior with each enum constant: declare an abstract apply method in the enum type, and override it with a concrete method for each constant in a constant-specific class body. Such methods are known as constant-specific method implementations:

> 幸运的是，有一种更好的方法可以将不同的行为与每个枚举常量关联起来：在枚举类型中声明一个抽象的 apply 方法，并用一个特定于常量的类体中的每个常量的具体方法覆盖它。这些方法称为特定常量方法实现：

```java
// Enum type with constant-specific method implementations
public enum Operation {
    PLUS {public double apply(double x, double y){return x + y;}},
    MINUS {public double apply(double x, double y){return x - y;}},
    TIMES {public double apply(double x, double y){return x * y;}},
    DIVIDE{public double apply(double x, double y){return x / y;}};
    public abstract double apply(double x, double y);
}
```

If you add a new constant to the second version of Operation, it is unlikely that you’ll forget to provide an apply method, because the method immediately follows each constant declaration. In the unlikely event that you do forget, the compiler will remind you because abstract methods in an enum type must be overridden with concrete methods in all of its constants.

> 如果你在 Operation 枚举的第二个版本中添加一个新常量，那么你不太可能忘记提供一个 apply 方法，因为该方法紧跟每个常量声明。在不太可能忘记的情况下，编译器会提醒你，因为枚举类型中的抽象方法必须用其所有常量中的具体方法覆盖。

Constant-specific method implementations can be combined with constantspecific data. For example, here is a version of Operation that overrides the toString method to return the symbol commonly associated with the operation:

> 特定常量方法实现可以与特定于常量的数据相结合。例如，下面是一个 Operation 枚举的版本，它重写 toString 方法来返回与操作相关的符号：

**译注：原文 constantspecific data 修改为 constant-specific data ，译为「特定常量数据」**

```java
// Enum type with constant-specific class bodies and data
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

The toString implementation shown makes it easy to print arithmetic expressions, as demonstrated by this little program:

> 重写的 toString 实现使得打印算术表达式变得很容易，如下面的小程序所示：

```java
public static void main(String[] args) {
    double x = Double.parseDouble(args[0]);
    double y = Double.parseDouble(args[1]);
    for (Operation op : Operation.values())
        System.out.printf("%f %s %f = %f%n",x, op, y, op.apply(x, y));
}
```

Running this program with 2 and 4 as command line arguments produces the following output:

> 以 2 和 4 作为命令行参数运行这个程序将产生以下输出：

```java
2.000000 + 4.000000 = 6.000000
2.000000 - 4.000000 = -2.000000
2.000000 * 4.000000 = 8.000000
2.000000 / 4.000000 = 0.500000
```

Enum types have an automatically generated valueOf(String) method that translates a constant’s name into the constant itself. If you override the toString method in an enum type, consider writing a fromString method to translate the custom string representation back to the corresponding enum. The following code (with the type name changed appropriately) will do the trick for any enum, so long as each constant has a unique string representation:

> 枚举类型有一个自动生成的 valueOf(String) 方法，该方法将常量的名称转换为常量本身。如果在枚举类型中重写 toString 方法，可以考虑编写 fromString 方法将自定义字符串表示形式转换回相应的枚举。只要每个常量都有唯一的字符串表示形式，下面的代码（类型名称适当更改）就可以用于任何枚举：

```java
// Implementing a fromString method on an enum type
private static final Map<String, Operation> stringToEnum =Stream.of(values()).collect(toMap(Object::toString, e -> e));

// Returns Operation for string, if any
public static Optional<Operation> fromString(String symbol) {
    return Optional.ofNullable(stringToEnum.get(symbol));
}
```

Note that the Operation constants are put into the stringToEnum map from a static field initialization that runs after the enum constants have been created. The previous code uses a stream (Chapter 7) over the array returned by the values() method; prior to Java 8, we would have created an empty hash map and iterated over the values array inserting the string-to-enum mappings into the map, and you can still do it that way if you prefer. But note that attempting to have each constant put itself into a map from its own constructor does not work. It would cause a compilation error, which is good thing because if it were legal, it would cause a NullPointerException at runtime. Enum constructors aren’t permitted to access the enum’s static fields, with the exception of constant variables (Item 34). This restriction is necessary because static fields have not yet been initialized when enum constructors run. A special case of this restriction is that enum constants cannot access one another from their constructors.

> 注意，Operation 枚举的常量是从创建枚举常量之后运行的静态字段初始化中放入 stringToEnum 的。上述代码在 values() 方法返回的数组上使用流（参阅第 7 章）；在 Java 8 之前，我们将创建一个空 HashMap，并遍历值数组，将自定义字符串与枚举的映射插入到 HashMap 中，如果你愿意，你仍然可以这样做。但是请注意，试图让每个常量通过构造函数将自身放入 HashMap 中是行不通的。它会导致编译错误，这是好事，因为如果合法，它会在运行时导致 NullPointerException。枚举构造函数不允许访问枚举的静态字段，常量变量除外（Item-34）。这个限制是必要的，因为在枚举构造函数运行时静态字段还没有初始化。这种限制的一个特殊情况是枚举常量不能从它们的构造函数中相互访问。

Also note that the fromString method returns an `Optional<String>`. This allows the method to indicate that the string that was passed in does not represent a valid operation, and it forces the client to confront this possibility (Item 55).

> 还要注意 fromString 方法返回一个 `Optional<String>`。这允许该方法提示传入的字符串并非有效操作，并强制客户端处理这种可能（Item-55）。

A disadvantage of constant-specific method implementations is that they make it harder to share code among enum constants. For example, consider an enum representing the days of the week in a payroll package. This enum has a method that calculates a worker’s pay for that day given the worker’s base salary (per hour) and the number of minutes worked on that day. On the five weekdays, any time worked in excess of a normal shift generates overtime pay; on the two weekend days, all work generates overtime pay. With a switch statement, it’s easy to do this calculation by applying multiple case labels to each of two code fragments:

> 特定常量方法实现的一个缺点是，它们使得在枚举常量之间共享代码变得更加困难。例如，考虑一个表示一周当中计算工资发放的枚举。枚举有一个方法，该方法根据工人的基本工资（每小时）和当天的工作分钟数计算工人当天的工资。在五个工作日内，任何超过正常轮班时间的工作都会产生加班费；在两个周末，所有的工作都会产生加班费。使用 switch 语句，通过多个 case 标签应用于每一类情况，可以很容易地进行计算：

```java
// Enum that switches on its value to share code - questionable
enum PayrollDay {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY,SATURDAY, SUNDAY;

    private static final int MINS_PER_SHIFT = 8 * 60;

    int pay(int minutesWorked, int payRate) {
        int basePay = minutesWorked * payRate;
        int overtimePay;
        switch(this) {
            case SATURDAY:
            case SUNDAY: // Weekend
                overtimePay = basePay / 2;
                break;
            default: // Weekday
                overtimePay = minutesWorked <= MINS_PER_SHIFT ?0 : (minutesWorked - MINS_PER_SHIFT) * payRate / 2;
        }
        return basePay + overtimePay;
    }
}
```

**译注 1：该例子中，加班的每分钟工资为工作日每分钟工资（payRate）的一半**

**译注 2：原文中 pay 方法存在问题，说明如下：**

```java
// 基本工资 basePay 不应该直接将工作时间参与计算，如果工作日存在加班的情况，会将加班时间也计入基本工资计算。假设在周一工作 10 小时，假设每分钟 1 元：
/*
修改前：
    基本工资 basePay = minutesWorked * payRate=10*60*1=600（不应该将 2 小时加班也计入正常工作时间）
    加班工资 overtimePay = (minutesWorked - MINS_PER_SHIFT) * payRate / 2=2*60*1/2=60
    合计= basePay + overtimePay=660
修改后：
    基本工资 basePay = MINS_PER_SHIFT * payRate=8*60*1=480（基本工资最高只能按照 8 小时计算）
    加班工资 overtimePay = (minutesWorked - MINS_PER_SHIFT) * payRate / 2=2*60*1/2=60
    合计= basePay + overtimePay=540
*/
// 修改后代码：
int pay(int minutesWorked, int payRate) {
    int basePay = 0;
    int overtimePay;
    switch (this) {
        case SATURDAY:
        case SUNDAY: // Weekend
            overtimePay = minutesWorked * payRate / 2;
            break;
        default: // Weekday
            basePay = minutesWorked <= MINS_PER_SHIFT ? minutesWorked * payRate : MINS_PER_SHIFT * payRate;
            overtimePay = minutesWorked <= MINS_PER_SHIFT ? 0 : (minutesWorked - MINS_PER_SHIFT) * payRate / 2;
    }
    return basePay + overtimePay;
}
```

This code is undeniably concise, but it is dangerous from a maintenance perspective. Suppose you add an element to the enum, perhaps a special value to represent a vacation day, but forget to add a corresponding case to the switch statement. The program will still compile, but the pay method will silently pay the worker the same amount for a vacation day as for an ordinary weekday.

> 不可否认，这段代码非常简洁，但是从维护的角度来看，它是危险的。假设你向枚举中添加了一个元素，可能是一个表示假期的特殊值，但是忘记向 switch 语句添加相应的 case。这个程序仍然会被编译，但是 pay 方法会把假期默认当做普通工作日并支付工资。

To perform the pay calculation safely with constant-specific method implementations, you would have to duplicate the overtime pay computation for each constant, or move the computation into two helper methods, one for weekdays and one for weekend days, and invoke the appropriate helper method from each constant. Either approach would result in a fair amount of boilerplate code, substantially reducing readability and increasing the opportunity for error.

> 为了使用特定常量方法实现安全地执行工资计算，你必须为每个常量复制加班费计算，或者将计算移动到两个辅助方法中，一个用于工作日，一个用于周末，再从每个常量调用适当的辅助方法。任何一种方法都会导致相当数量的样板代码，极大地降低可读性并增加出错的机会。

The boilerplate could be reduced by replacing the abstract overtimePay method on PayrollDay with a concrete method that performs the overtime calculation for weekdays. Then only the weekend days would have to override the method. But this would have the same disadvantage as the switch statement: if you added another day without overriding the overtimePay method, you would silently inherit the weekday calculation.

> 用工作日加班计算的具体方法代替发薪日的抽象加班法，可以减少样板。那么只有周末才需要重写该方法。但是这与 switch 语句具有相同的缺点：如果你在不覆盖 overtimePay 方法的情况下添加了另一天，那么你将默默地继承工作日的计算。

What you really want is to be forced to choose an overtime pay strategy each time you add an enum constant. Luckily, there is a nice way to achieve this. The idea is to move the overtime pay computation into a private nested enum, and to pass an instance of this strategy enum to the constructor for the PayrollDay enum. The PayrollDay enum then delegates the overtime pay calculation to the strategy enum, eliminating the need for a switch statement or constantspecific method implementation in PayrollDay. While this pattern is less concise than the switch statement, it is safer and more flexible:

> 你真正想要的是在每次添加枚举常量时被迫选择加班费策略。幸运的是，有一个很好的方法可以实现这一点。其思想是将加班费计算移到私有嵌套枚举中，并将此策略枚举的实例传递给 PayrollDay 枚举的构造函数。然后 PayrollDay 枚举将加班费计算委托给策略枚举，从而消除了在 PayrollDay 中使用 switch 语句或特定于常量的方法实现的需要。虽然这种模式不如 switch 语句简洁，但它更安全，也更灵活：

```java
// The strategy enum pattern
enum PayrollDay {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY,SATURDAY(PayType.WEEKEND), SUNDAY(PayType.WEEKEND);

    private final PayType payType;
    PayrollDay(PayType payType) { this.payType = payType; }
    PayrollDay() { this(PayType.WEEKDAY); } // Default

    int pay(int minutesWorked, int payRate) {
        return payType.pay(minutesWorked, payRate);
    }

    // The strategy enum type
    private enum PayType {
        WEEKDAY {
            int overtimePay(int minsWorked, int payRate) {
                return minsWorked <= MINS_PER_SHIFT ? 0 :(minsWorked - MINS_PER_SHIFT) * payRate / 2;
            }
        },
        WEEKEND {
            int overtimePay(int minsWorked, int payRate) {
                return minsWorked * payRate / 2;
            }
        };

        abstract int overtimePay(int mins, int payRate);

        private static final int MINS_PER_SHIFT = 8 * 60;

        int pay(int minsWorked, int payRate) {
            int basePay = minsWorked * payRate;
            return basePay + overtimePay(minsWorked, payRate);
        }
    }
}
```

**译注：上述代码 pay 方法也存将加班时间计入基本工资计算的问题，修改如下：**

```java
int pay(int minsWorked, int payRate) {
    int basePay = minsWorked <= MINS_PER_SHIFT ? minsWorked * payRate : MINS_PER_SHIFT * payRate;
    return basePay + overtimePay(minsWorked, payRate);
}
```

If switch statements on enums are not a good choice for implementing constant-specific behavior on enums, what are they good for? **Switches on enums are good for augmenting enum types with constant-specific behavior.** For example, suppose the Operation enum is not under your control and you wish it had an instance method to return the inverse of each operation. You could simulate the effect with the following static method:

> 如果在枚举上实现特定常量的行为时 switch 语句不是一个好的选择，那么它们有什么用呢？**枚举中的 switch 有利于扩展具有特定常量行为的枚举类型。** 例如，假设 Operation 枚举不在你的控制之下，你希望它有一个实例方法来返回每个操作的逆操作。你可以用以下静态方法模拟效果：

```java
// Switch on an enum to simulate a missing method
public static Operation inverse(Operation op) {
    switch(op) {
        case PLUS: return Operation.MINUS;
        case MINUS: return Operation.PLUS;
        case TIMES: return Operation.DIVIDE;
        case DIVIDE: return Operation.TIMES;
        default: throw new AssertionError("Unknown op: " + op);
    }
}
```

You should also use this technique on enum types that are under your control if a method simply doesn’t belong in the enum type. The method may be required for some use but is not generally useful enough to merit inclusion in the enum type.

> 如果一个方法不属于枚举类型，那么还应该在你控制的枚举类型上使用这种技术。该方法可能适用于某些特殊用途，但通常如果没有足够的好处，就不值得包含在枚举类型中。

Enums are, generally speaking, comparable in performance to int constants. A minor performance disadvantage of enums is that there is a space and time cost to load and initialize enum types, but it is unlikely to be noticeable in practice.

> 一般来说，枚举在性能上可与 int 常量相比。枚举在性能上有一个小缺点，加载和初始化枚举类型需要花费空间和时间，但是在实际应用中这一点可能不太明显。

So when should you use enums? **Use enums any time you need a set of constants whose members are known at compile time.** Of course, this includes “natural enumerated types,” such as the planets, the days of the week, and the chess pieces. But it also includes other sets for which you know all the possible values at compile time, such as choices on a menu, operation codes, and command line flags. **It is not necessary that the set of constants in an enum type stay fixed for all time.** The enum feature was specifically designed to allow for binary compatible evolution of enum types.

> 那么什么时候应该使用枚举呢？**在需要一组常量时使用枚举，这些常量的成员在编译时是已知的。** 当然，这包括「自然枚举类型」，如行星、星期几和棋子。但是它还包括其他在编译时已知所有可能值的集合，例如菜单上的选项、操作代码和命令行标志。**枚举类型中的常量集没有必要一直保持固定。** 枚举的特性是专门为枚举类型的二进制兼容进化而设计的。

In summary, the advantages of enum types over int constants are compelling. Enums are more readable, safer, and more powerful. Many enums require no explicit constructors or members, but others benefit from associating data with each constant and providing methods whose behavior is affected by this data. Fewer enums benefit from associating multiple behaviors with a single method. In this relatively rare case, prefer constant-specific methods to enums that switch on their own values. Consider the strategy enum pattern if some, but not all, enum constants share common behaviors.

> 总之，枚举类型相对于 int 常量的优势是毋庸置疑的。枚举更易于阅读、更安全、更强大。许多枚举不需要显式构造函数或成员，但有些枚举则受益于将数据与每个常量关联，并提供行为受数据影响的方法。将多个行为与一个方法关联起来，这样的枚举更少。在这种相对少见的情况下，相对于使用 switch 的枚举，特定常量方法更好。如果枚举常量有一些（但不是全部）共享公共行为，请考虑策略枚举模式。

---

## 【35】使用实例字段替代序数

> Use instance fields instead of ordinals

Many enums are naturally associated with a single int value. All enums have an ordinal method, which returns the numerical position of each enum constant in its type. You may be tempted to derive an associated int value from the ordinal:

> 许多枚举天然地与单个 int 值相关联。所有枚举都有一个 ordinal 方法，该方法返回枚举类型中每个枚举常数的数值位置。你可能想从序号中获得一个关联的 int 值：

```java
// Abuse of ordinal to derive an associated value - DON'T DO THIS
public enum Ensemble {
    SOLO, DUET, TRIO, QUARTET, QUINTET,SEXTET, SEPTET, OCTET, NONET, DECTET;

    public int numberOfMusicians() { return ordinal() + 1; }
}
```

While this enum works, it is a maintenance nightmare. If the constants are reordered, the numberOfMusicians method will break. If you want to add a second enum constant associated with an int value that you’ve already used, you’re out of luck. For example, it might be nice to add a constant for double quartet, which, like an octet, consists of eight musicians, but there is no way to do it.

> 虽然这个枚举可以工作，但维护却是噩梦。如果常量被重新排序，numberOfMusicians 方法将被破坏。或者你想添加一个与已经使用过的 int 值相关联的第二个枚举常量，那么你就没有那么幸运了。例如，为双四重奏增加一个常量可能会很好，就像八重奏一样，由八个音乐家组成，但是没有办法做到。

**译注：「If you want to add a second enum constant associated with an int value that you’ve already used」是指每个常量如果不用实例字段的方式，就只能有一个序号值。实例字段可以将自定义的值对应多个常量，例如：SOLO(3), DUET(3), TRIO(3)，可以都设置为序号 3**

Also, you can’t add a constant for an int value without adding constants for all intervening int values. For example, suppose you want to add a constant representing a triple quartet, which consists of twelve musicians. There is no standard term for an ensemble consisting of eleven musicians, so you are forced to add a dummy constant for the unused int value (11). At best, this is ugly. If many int values are unused, it’s impractical. Luckily, there is a simple solution to these problems. **Never derive a value associated with an enum from its ordinal; store it in an instance field instead:**

> 此外，如果不为所有插入的 int 值添加常量，就不能为 int 值添加常量。例如，假设你想添加一个常量来表示一个由 12 位音乐家组成的三重四重奏。对于 11 位音乐家组成的合奏，由于没有标准术语，因此你必须为未使用的 int 值（11）添加一个虚拟常量。往好的说，这仅仅是丑陋的。如果许多 int 值未使用，则不切实际。幸运的是，这些问题有一个简单的解决方案。**不要从枚举的序数派生与枚举关联的值；而是将其存储在实例字段中：**

```java
public enum Ensemble {
    SOLO(1), DUET(2), TRIO(3), QUARTET(4), QUINTET(5),SEXTET(6), SEPTET(7), OCTET(8), DOUBLE_QUARTET(8),NONET(9), DECTET(10),TRIPLE_QUARTET(12);

    private final int numberOfMusicians;

    Ensemble(int size) { this.numberOfMusicians = size; }

    public int numberOfMusicians() { return numberOfMusicians; }
}
```

The Enum specification has this to say about ordinal: “Most programmers will have no use for this method. It is designed for use by general-purpose enumbased data structures such as EnumSet and EnumMap.” Unless you are writing code with this character, you are best off avoiding the ordinal method entirely.

> 枚举规范对 ordinal 方法的评价是这样的：「大多数程序员都不会去使用这个方法。它是为基于枚举的通用数据结构（如 EnumSet 和 EnumMap）而设计的」。除非你使用这个数据结构编写代码，否则最好完全避免使用这个方法。

---

## 【36】用 EnumSet 替代位字段

> Use EnumSet instead of bit fields

If the elements of an enumerated type are used primarily in sets, it is traditional to use the int enum pattern (Item 34), assigning a different power of 2 to each constant:

> 如果枚举类型的元素主要在 Set 中使用，传统上使用 int 枚举模式（Item-34），通过不同的 2 平方数为每个常量赋值：

```java
// Bit field enumeration constants - OBSOLETE!
public class Text {
    public static final int STYLE_BOLD = 1 << 0; // 1
    public static final int STYLE_ITALIC = 1 << 1; // 2
    public static final int STYLE_UNDERLINE = 1 << 2; // 4
    public static final int STYLE_STRIKETHROUGH = 1 << 3; // 8
    // Parameter is bitwise OR of zero or more STYLE_ constants
    public void applyStyles(int styles) { ... }
}
```

This representation lets you use the bitwise OR operation to combine several constants into a set, known as a bit field:

> 这种表示方式称为位字段，允许你使用位运算的 OR 操作将几个常量组合成一个 Set：

```java
text.applyStyles(STYLE_BOLD | STYLE_ITALIC);
```

The bit field representation also lets you perform set operations such as union and intersection efficiently using bitwise arithmetic. But bit fields have all the disadvantages of int enum constants and more. It is even harder to interpret a bit field than a simple int enum constant when it is printed as a number. There is no easy way to iterate over all of the elements represented by a bit field. Finally, you have to predict the maximum number of bits you’ll ever need at the time you’re writing the API and choose a type for the bit field (typically int or long) accordingly. Once you’ve picked a type, you can’t exceed its width (32 or 64 bits) without changing the API.

> 位字段表示方式允许使用位运算高效地执行 Set 操作，如并集和交集。但是位字段具有 int 枚举常量所有缺点，甚至更多。当位字段被打印为数字时，它比简单的 int 枚举常量更难理解。没有一种简单的方法可以遍历由位字段表示的所有元素。最后，你必须预测在编写 API 时需要的最大位数，并相应地为位字段（通常是 int 或 long）选择一种类型。一旦选择了一种类型，在不更改 API 的情况下，不能超过它的宽度（32 或 64 位）。

Some programmers who use enums in preference to int constants still cling to the use of bit fields when they need to pass around sets of constants. There is no reason to do this, because a better alternative exists. The java.util package provides the EnumSet class to efficiently represent sets of values drawn from a single enum type. This class implements the Set interface, providing all of the richness, type safety, and interoperability you get with any other Set implementation. But internally, each EnumSet is represented as a bit vector. If the underlying enum type has sixty-four or fewer elements—and most do—the entire EnumSet is represented with a single long, so its performance is comparable to that of a bit field. Bulk operations, such as removeAll and retainAll, are implemented using bitwise arithmetic, just as you’d do manually for bit fields. But you are insulated from the ugliness and errorproneness of manual bit twiddling: the EnumSet does the hard work for you.

> 一些使用枚举而不是 int 常量的程序员在需要传递常量集时仍然坚持使用位字段。没有理由这样做，因为存在更好的选择。`java.util` 包提供 EnumSet 类来有效地表示从单个枚举类型中提取的值集。这个类实现了 Set 接口，提供了所有其他 Set 实现所具有的丰富性、类型安全性和互操作性。但在内部，每个 EnumSet 都表示为一个位向量。如果底层枚举类型有 64 个或更少的元素（大多数都是），则整个 EnumSet 用一个 long 表示，因此其性能与位字段的性能相当。批量操作（如 removeAll 和 retainAll）是使用逐位算法实现的，就像手动处理位字段一样。但是，你可以避免因手工修改导致产生不良代码和潜在错误：EnumSet 为你完成了这些繁重的工作。

Here is how the previous example looks when modified to use enums and enum sets instead of bit fields. It is shorter, clearer, and safer:

> 当之前的示例修改为使用枚举和 EnumSet 而不是位字段时。它更短，更清晰，更安全：

```java
// EnumSet - a modern replacement for bit fields
public class Text {
    public enum Style { BOLD, ITALIC, UNDERLINE, STRIKETHROUGH }
    // Any Set could be passed in, but EnumSet is clearly best
    public void applyStyles(Set<Style> styles) { ... }
}
```

Here is client code that passes an EnumSet instance to the applyStyles method. The EnumSet class provides a rich set of static factories for easy set creation, one of which is illustrated in this code:

> 下面是将 EnumSet 实例传递给 applyStyles 方法的客户端代码。EnumSet 类提供了一组丰富的静态工厂，可以方便地创建 Set，下面的代码演示了其中的一个：

```java
text.applyStyles(EnumSet.of(Style.BOLD, Style.ITALIC));
```

Note that the applyStyles method takes a `Set<Style>` rather than an `EnumSet<Style>`. While it seems likely that all clients would pass an EnumSet to the method, it is generally good practice to accept the interface type rather than the implementation type (Item 64). This allows for the possibility of an unusual client to pass in some other Set implementation.

> 请注意，applyStyles 方法采用 `Set<Style>` 而不是 `EnumSet<Style>`。虽然似乎所有客户端都可能将 EnumSet 传递给该方法，但通常较好的做法是接受接口类型而不是实现类型（Item-64）。这允许特殊的客户端传入其他 Set 实现的可能性。

In summary, **just because an enumerated type will be used in sets, there is no reason to represent it with bit fields.** The EnumSet class combines the conciseness and performance of bit fields with all the many advantages of enum types described in Item 34. The one real disadvantage of EnumSet is that it is not, as of Java 9, possible to create an immutable EnumSet, but this will likely be remedied in an upcoming release. In the meantime, you can wrap an EnumSet with Collections.unmodifiableSet, but conciseness and performance will suffer.

> 总之，**因为枚举类型将在 Set 中使用，没有理由用位字段表示它。** EnumSet 类结合了位字段的简洁性和性能，以及 Item-34 中描述的枚举类型的许多优点。EnumSet 的一个真正的缺点是，从 Java 9 开始，它不能创建不可变的 EnumSet，在未来发布的版本中可能会纠正这一点。同时，可以用 `Collections.unmodifiableSet` 包装 EnumSet，但简洁性和性能将受到影响。

---

## 【37】使用 EnumMap 替换序数索引

> Use EnumMap instead of ordinal indexing

Occasionally you may see code that uses the ordinal method (Item 35) to index into an array or list. For example, consider this simplistic class meant to represent a plant:

> 偶尔你可能会看到使用 `ordinal()` 的返回值（Item-35）作为数组或 list 索引的代码。例如，考虑这个简单的类，它表示一种植物：

```java
class Plant {
    enum LifeCycle { ANNUAL, PERENNIAL, BIENNIAL }
    final String name;
    final LifeCycle lifeCycle;

    Plant(String name, LifeCycle lifeCycle) {
        this.name = name;
        this.lifeCycle = lifeCycle;
    }

    @Override public String toString() {
        return name;
    }
}
```

Now suppose you have an array of plants representing a garden, and you want to list these plants organized by life cycle (annual, perennial, or biennial). To do this, you construct three sets, one for each life cycle, and iterate through the garden, placing each plant in the appropriate set. Some programmers would do this by putting the sets into an array indexed by the life cycle’s ordinal:

> 现在假设你有一个代表花园全部植物的 Plant 数组，你想要列出按生命周期（一年生、多年生或两年生）排列的植物。要做到这一点，你需要构造三个集合，每个生命周期一个，然后遍历整个数组，将每个植物放入适当的集合中：

```java
// Using ordinal() to index into an array - DON'T DO THIS!
Set<Plant>[] plantsByLifeCycle =(Set<Plant>[]) new Set[Plant.LifeCycle.values().length];

for (int i = 0; i < plantsByLifeCycle.length; i++)
    plantsByLifeCycle[i] = new HashSet<>();

for (Plant p : garden)
    plantsByLifeCycle[p.lifeCycle.ordinal()].add(p);

// Print the results
for (int i = 0; i < plantsByLifeCycle.length; i++) {
    System.out.printf("%s: %s%n",
    Plant.LifeCycle.values()[i], plantsByLifeCycle[i]);
}
```

**译注：假设 Plant 数组如下：**

```java
Plant[] garden = new Plant[]{
        new Plant("A", LifeCycle.ANNUAL),
        new Plant("B", LifeCycle.BIENNIAL),
        new Plant("C", LifeCycle.PERENNIAL),
        new Plant("D", LifeCycle.BIENNIAL),
        new Plant("E", LifeCycle.PERENNIAL),
};
```

输出结果为：

```java
ANNUAL: [A]
PERENNIAL: [E, C]
BIENNIAL: [B, D]
```

This technique works, but it is fraught with problems. Because arrays are not compatible with generics (Item 28), the program requires an unchecked cast and will not compile cleanly. Because the array does not know what its index represents, you have to label the output manually. But the most serious problem with this technique is that when you access an array that is indexed by an enum’s ordinal, it is your responsibility to use the correct int value; ints do not provide the type safety of enums. If you use the wrong value, the program will silently do the wrong thing or—if you’re lucky—throw an ArrayIndexOutOfBoundsException.

> 这种技术是有效的，但它充满了问题。因为数组与泛型不兼容（Item-28），所以该程序需要 unchecked 的转换，否则不能顺利地编译。因为数组不知道它的索引表示什么，所以必须手动标记输出。但是这种技术最严重的问题是，当你访问一个由枚举序数索引的数组时，你有责任使用正确的 int 值；int 不提供枚举的类型安全性。如果你使用了错误的值，程序将静默执行错误的操作，如果幸运的话，才会抛出 ArrayIndexOutOfBoundsException。

There is a much better way to achieve the same effect. The array is effectively serving as a map from the enum to a value, so you might as well use a Map. More specifically, there is a very fast Map implementation designed for use with enum keys, known as java.util.EnumMap. Here is how the program looks when it is rewritten to use EnumMap:

> 有一种更好的方法可以达到同样的效果。该数组有效地充当从枚举到值的映射，因此你不妨使用 Map。更具体地说，有一种非常快速的 Map 实现，用于枚举键，称为 `java.util.EnumMap`。以下就是这个程序在使用 EnumMap 时的样子：

```java
// Using an EnumMap to associate data with an enum
Map<Plant.LifeCycle, Set<Plant>> plantsByLifeCycle =new EnumMap<>(Plant.LifeCycle.class);

for (Plant.LifeCycle lc : Plant.LifeCycle.values())
    plantsByLifeCycle.put(lc, new HashSet<>());

for (Plant p : garden)
    plantsByLifeCycle.get(p.lifeCycle).add(p);

System.out.println(plantsByLifeCycle);
```

This program is shorter, clearer, safer, and comparable in speed to the original version. There is no unsafe cast; no need to label the output manually because the map keys are enums that know how to translate themselves to printable strings; and no possibility for error in computing array indices. The reason that EnumMap is comparable in speed to an ordinal-indexed array is that EnumMap uses such an array internally, but it hides this implementation detail from the programmer, combining the richness and type safety of a Map with the speed of an array. Note that the EnumMap constructor takes the Class object of the key type: this is a bounded type token, which provides runtime generic type information (Item 33).

> 这个程序比原来的版本更短，更清晰，更安全，速度也差不多。没有不安全的转换；不需要手动标记输出，因为 Map 的键是能转换为可打印字符串的枚举；在计算数组索引时不可能出错。EnumMap 在速度上与有序索引数组相当的原因是，EnumMap 在内部使用这样的数组，但是它向程序员隐藏了实现细节，将 Map 的丰富的功能和类型安全性与数组的速度结合起来。注意，EnumMap 构造函数接受键类型的 Class 对象：这是一个有界类型标记，它提供运行时泛型类型信息（Item-33）。

The previous program can be further shortened by using a stream (Item 45) to manage the map. Here is the simplest stream-based code that largely duplicates the behavior of the previous example:

> 通过使用流（Item-45）来管理映射，可以进一步缩短前面的程序。下面是基于流的最简单的代码，它在很大程度上复制了前一个示例的行为：

```java
// Naive stream-based approach - unlikely to produce an EnumMap!
System.out.println(Arrays.stream(garden).collect(groupingBy(p -> p.lifeCycle)));
```

**译注：以上代码需要引入 `java.util.stream.Collectors.groupingBy`，输出结果如下：**

```java
{BIENNIAL=[B, D], ANNUAL=[A], PERENNIAL=[C, E]}
```

The problem with this code is that it chooses its own map implementation, and in practice it won’t be an EnumMap, so it won’t match the space and time performance of the version with the explicit EnumMap. To rectify this problem, use the three-parameter form of Collectors.groupingBy, which allows the caller to specify the map implementation using the mapFactory parameter:

> 这段代码的问题在于它选择了自己的 Map 实现，而实际上它不是 EnumMap，所以它的空间和时间性能与显式 EnumMap 不匹配。要纠正这个问题，可以使用 `Collectors.groupingBy` 的三参数形式，它允许调用者使用 mapFactory 参数指定 Map 实现：

```java
// Using a stream and an EnumMap to associate data with an enum
System.out.println(
    Arrays.stream(garden).collect(groupingBy(p -> p.lifeCycle,() -> new EnumMap<>(LifeCycle.class), toSet()))
);
```

**译注：以上代码需要引入 `java.util.stream.Collectors.toSet`**

This optimization would not be worth doing in a toy program like this one but could be critical in a program that made heavy use of the map.

> 这种优化在示例程序中不值得去做，但在大量使用 Map 的程序中可能非常重要。

The behavior of the stream-based versions differs slightly from that of the EmumMap version. The EnumMap version always makes a nested map for each plant lifecycle, while the stream-based versions only make a nested map if the garden contains one or more plants with that lifecycle. So, for example, if the garden contains annuals and perennials but no biennials, the size of plantsByLifeCycle will be three in the EnumMap version and two in both of the stream-based versions.

> 基于流的版本的行为与 EmumMap 版本略有不同。EnumMap 版本总是为每个植物生命周期生成一个嵌套 Map，而基于流的版本只在花园包含具有该生命周期的一个或多个植物时才生成嵌套 Map。例如，如果花园包含一年生和多年生植物，但没有两年生植物，plantsByLifeCycle 的大小在 EnumMap 版本中为 3，在基于流的版本中为 2。

You may see an array of arrays indexed (twice!) by ordinals used to represent a mapping from two enum values. For example, this program uses such an array to map two phases to a phase transition (liquid to solid is freezing, liquid to gas is boiling, and so forth):

> 你可能会看到被序数索引（两次！）的数组，序数用于表示两个枚举值的映射。例如，这个程序使用这样的一个数组来映射两个状态到一个状态的转换过程（液体到固体是冻结的，液体到气体是沸腾的，等等）：

```java
// Using ordinal() to index array of arrays - DON'T DO THIS!
public enum Phase {
    SOLID, LIQUID, GAS;

    public enum Transition {
        MELT, FREEZE, BOIL, CONDENSE, SUBLIME, DEPOSIT;

        // Rows indexed by from-ordinal, cols by to-ordinal
        private static final Transition[][] TRANSITIONS = {
            { null, MELT, SUBLIME },
            { FREEZE, null, BOIL },
            { DEPOSIT, CONDENSE, null }
        };

        // Returns the phase transition from one phase to another
        public static Transition from(Phase from, Phase to) {
            return TRANSITIONS[from.ordinal()][to.ordinal()];
        }
    }
}
```

**译注：固体、液体、气体三态，对应的三组变化：融化 MELT，冻结 FREEZE（固态与液态）；沸腾 BOIL，凝固 CONDENSE（液态与气态）；升华 SUBLIME，凝华 DEPOSIT（固态与气态）。**

This program works and may even appear elegant, but appearances can be deceiving. Like the simpler garden example shown earlier, the compiler has no way of knowing the relationship between ordinals and array indices. If you make a mistake in the transition table or forget to update it when you modify the Phase or Phase.Transition enum type, your program will fail at runtime. The failure may be an ArrayIndexOutOfBoundsException, a NullPointerException, or (worse) silent erroneous behavior. And the size of the table is quadratic in the number of phases, even if the number of non-null entries is smaller.

> 这个程序可以工作，甚至可能看起来很优雅，但外表可能具有欺骗性。就像前面展示的更简单的 garden 示例一样，编译器无法知道序数和数组索引之间的关系。如果你在转换表中出错，或者在修改 Phase 或 `Phase.Transition` 枚举类型时忘记更新，你的程序将在运行时失败。失败可能是抛出 ArrayIndexOutOfBoundsException、NullPointerException 或（更糟糕的）静默错误行为。并且即使非空项的数目更小，该表的大小也为状态数量的二次方。

Again, you can do much better with EnumMap. Because each phase transition is indexed by a pair of phase enums, you are best off representing the relationship as a map from one enum (the “from” phase) to a map from the second enum (the “to” phase) to the result (the phase transition). The two phases associated with a phase transition are best captured by associating them with the phase transition enum, which can then be used to initialize the nested EnumMap:

> 同样，使用 EnumMap 可以做得更好。因为每个阶段转换都由一对阶段枚举索引，所以最好将这个关系用 Map 表示，从一个枚举（起始阶段）到第二个枚举（结束阶段）到结果（转换阶段）。与阶段转换相关联的两个阶段最容易捕捉到的是将它们与阶段过渡的 enum 联系起来，这样就可以用来初始化嵌套的 EnumMap：

```java
// Using a nested EnumMap to associate data with enum pairs
public enum Phase {
    SOLID, LIQUID, GAS;

    public enum Transition {
        MELT(SOLID, LIQUID), FREEZE(LIQUID, SOLID),
        BOIL(LIQUID, GAS), CONDENSE(GAS, LIQUID),
        SUBLIME(SOLID, GAS), DEPOSIT(GAS, SOLID);
        private final Phase from;
        private final Phase to;

        Transition(Phase from, Phase to) {
            this.from = from;
            this.to = to;
        }

        // Initialize the phase transition map
        private static final Map<Phase_new, Map<Phase_new, Transition>> m = Stream.of(values())
                .collect(groupingBy(
                        t -> t.from,
                        () -> new EnumMap<>(Phase_new.class),
                        toMap(t -> t.to, t -> t, (x, y) -> y, () -> new EnumMap<>(Phase_new.class))
                        )
                );

        public static Transition from(Phase from, Phase to) {
            return m.get(from).get(to);
        }
    }
}
```

The code to initialize the phase transition map is a bit complicated. The type of the map is `Map<Phase, Map<Phase, Transition>>`, which means “map from (source) phase to map from (destination) phase to transition.” This map-of-maps is initialized using a cascaded sequence of two collectors. The first collector groups the transitions by source phase, and the second creates an EnumMap with mappings from destination phase to transition. The merge function in the second collector ((x, y) -> y)) is unused; it is required only because we need to specify a map factory in order to get an EnumMap, and Collectors provides telescoping factories. The previous edition of this book used explicit iteration to initialize the phase transition map. The code was more verbose but arguably easier to understand.

> 初始化阶段变化 Map 的代码有点复杂。Map 的类型是 `Map<Phase, Map<Phase, Transition>>`，这意味着「从（源）阶段 Map 到（目标）阶段 Map 的转换过程」。这个 Map 嵌套是使用两个收集器的级联序列初始化的。第一个收集器按源阶段对转换进行分组，第二个收集器使用从目标阶段到转换的映射创建一个 EnumMap。第二个收集器 ((x, y) -> y) 中的 merge 函数未使用；之所以需要它，只是因为我们需要指定一个 Map 工厂来获得 EnumMap，而 Collector 提供了伸缩工厂。本书的上一个版本使用显式迭代来初始化阶段转换映射。代码更冗长，但也更容易理解。

**译注：第二版中的实现代码如下：**

```java
// Initialize the phase transition map
private static final Map<Phase, Map<Phase,Transition> m =
    new EnumMap<Phase, Map<Phase ,Transition>>(Phase.class);

    static{
        for (Phase p : Phase. values())
            m.put(p,new EnumMap<Phase,Transition (Phase.class));
        for (Transition trans : Transition.values() )
            m.get(trans. src).put(trans.dst, trans) ;
    }

public static Transition from(Phase src, Phase dst) {
    return m.get(src).get(dst);
}
```

Now suppose you want to add a new phase to the system: plasma, or ionized gas. There are only two transitions associated with this phase: ionization, which takes a gas to a plasma; and deionization, which takes a plasma to a gas. To update the array-based program, you would have to add one new constant to Phase and two to Phase.Transition, and replace the original nine-element array of arrays with a new sixteen-element version. If you add too many or too few elements to the array or place an element out of order, you are out of luck: the program will compile, but it will fail at runtime. To update the EnumMap-based version, all you have to do is add PLASMA to the list of phases, and IONIZE(GAS, PLASMA) and DEIONIZE(PLASMA, GAS) to the list of phase transitions:

> 现在假设你想向系统中加入一种新阶段：等离子体，或电离气体。这个阶段只有两个变化：电离，它把气体转为等离子体；去离子作用，把等离子体变成气体。假设要更新基于数组版本的程序，必须向 Phase 添加一个新常量，向 `Phase.Transition` 添加两个新常量，并用一个新的 16 个元素版本替换原来的数组中的 9 个元素数组。如果你向数组中添加了太多或太少的元素，或者打乱了元素的顺序，那么你就麻烦了：程序将编译，但在运行时将失败。相比之下，要更新基于 EnumMap 的版本，只需将 PLASMA 添加到 Phase 列表中，将 `IONIZE(GAS, PLASMA)` 和 `DEIONIZE(PLASMA, GAS)` 添加到 `Phase.Transition` 中：

```java
// Adding a new phase using the nested EnumMap implementation
public enum Phase {
    SOLID, LIQUID, GAS, PLASMA;
    public enum Transition {
        MELT(SOLID, LIQUID), FREEZE(LIQUID, SOLID),
        BOIL(LIQUID, GAS), CONDENSE(GAS, LIQUID),
        SUBLIME(SOLID, GAS), DEPOSIT(GAS, SOLID),
        IONIZE(GAS, PLASMA), DEIONIZE(PLASMA, GAS);
        ... // Remainder unchanged
    }
}
```

The program takes care of everything else and leaves you virtually no opportunity for error. Internally, the map of maps is implemented with an array of arrays, so you pay little in space or time cost for the added clarity, safety, and ease of maintenance.

> 这个程序会处理所有其他事情，实际上不会给你留下任何出错的机会。在内部，Map 的映射是用一个数组来实现的，因此你只需花费很少的空间或时间成本就可以获得更好的清晰度、安全性并易于维护。

In the interest of brevity, the above examples use null to indicate the absence of a state change (wherein to and from are identical). This is not good practice and is likely to result in a NullPointerException at runtime. Designing a clean, elegant solution to this problem is surprisingly tricky, and the resulting programs are sufficiently long that they would detract from the primary material in this item.

> 为了简洁起见，最初的示例使用 null 表示没有状态更改（其中 to 和 from 是相同的）。这不是一个好的方式，可能会在运行时导致 NullPointerException。针对这个问题设计一个干净、优雅的解决方案是非常棘手的，并且生成的程序冗长，以至于它们会偏离条目中的主要内容。

In summary, **it is rarely appropriate to use ordinals to index into arrays: use EnumMap instead.** If the relationship you are representing is multidimensional, use `EnumMap<..., EnumMap<...>>`. This is a special case of the general principle that application programmers should rarely, if ever, use Enum.ordinal (Item 35).

> 总之，**用普通的序数索引数组是非常不合适的：应使用 EnumMap 代替。** 如果所表示的关系是多维的，则使用 `EnumMap<..., EnumMap<...>>`。这是一种特殊的基本原则，程序员很少（即使有的话）使用 `Enum.ordinal` （Item-35）。

---

## 【38】使用接口模拟可扩展枚举

> Emulate extensible enums with interfaces

In almost all respects, enum types are superior to the typesafe enum pattern described in the first edition of this book [Bloch01]. On the face of it, one exception concerns extensibility, which was possible under the original pattern but is not supported by the language construct. In other words, using the pattern, it was possible to have one enumerated type extend another; using the language feature, it is not. This is no accident. For the most part, extensibility of enums turns out to be a bad idea. It is confusing that elements of an extension type are instances of the base type and not vice versa. There is no good way to enumerate over all of the elements of a base type and its extensions. Finally, extensibility would complicate many aspects of the design and implementation.

> 枚举类型几乎在所有方面都优于本书第一版 [Bloch01] 中描述的 typesafe 枚举模式。从表面上看，有一个与可扩展性有关的例外，它在字节码模式下是可能的，但是语言构造不支持。换句话说，使用字节码模式，可以让一个枚举类型扩展另一个枚举类型；但使用语言特性，则不能这样。这并非偶然。因为在大多数情况下，枚举的可扩展性被证明是一个坏主意，主要在于：扩展类型的元素是基类的实例，而基类的实例却不是扩展类型的元素。而且没有一种好方法可以枚举基类及其扩展的所有元素。最后，可扩展性会使设计和实现的许多方面变得复杂。

That said, there is at least one compelling use case for extensible enumerated types, which is operation codes, also known as opcodes. An opcode is an enumerated type whose elements represent operations on some machine, such as the Operation type in Item 34, which represents the functions on a simple calculator. Sometimes it is desirable to let the users of an API provide their own operations, effectively extending the set of operations provided by the API.

> 也就是说，对于可扩展枚举类型，至少有一个令人信服的用例，即操作码，也称为 opcodes。操作码是一种枚举类型，其元素表示某些机器上的操作，例如 Item-34 中的 Operation 类，它表示简单计算器上的函数。有时候，我们希望 API 的用户提供自己的操作，从而有效地扩展 API 提供的操作集。

Luckily, there is a nice way to achieve this effect using enum types. The basic idea is to take advantage of the fact that enum types can implement arbitrary interfaces by defining an interface for the opcode type and an enum that is the standard implementation of the interface. For example, here is an extensible version of the Operation type from Item 34:

> 幸运的是，有一种很好的方法可以使用枚举类型来实现这种效果。其基本思想是利用枚举类型可以实现任意接口这一事实，为 opcode 类型定义一个接口，并为接口的标准实现定义一个枚举。例如，下面是 Item-34 Operation 类的可扩展版本：

```java
// Emulated extensible enum using an interface
public interface Operation {
    double apply(double x, double y);
}

public enum BasicOperation implements Operation {
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

    BasicOperation(String symbol) {
        this.symbol = symbol;
    }

    @Override
    public String toString() {
        return symbol;
    }
}
```

While the enum type (BasicOperation) is not extensible, the interface type (Operation) is, and it is the interface type that is used to represent operations in APIs. You can define another enum type that implements this interface and use instances of this new type in place of the base type. For example, suppose you want to define an extension to the operation type shown earlier, consisting of the exponentiation and remainder operations. All you have to do is write an enum type that implements the Operation interface:

> 枚举类型（BasicOperation）是不可扩展的，而接口类型（Operation）是可扩展的，它是用于在 API 中表示操作的接口类型。你可以定义另一个实现此接口的枚举类型，并使用此新类型的实例代替基类型。例如，假设你想定义前面显示的操作类型的扩展，包括求幂和余数操作。你所要做的就是写一个枚举类型，实现操作接口：

```java
// Emulated extension enum
public enum ExtendedOperation implements Operation {
    EXP("^") {
        public double apply(double x, double y) {
            return Math.pow(x, y);
        }
    },
    REMAINDER("%") {
        public double apply(double x, double y) {
            return x % y;
        }
    };

    private final String symbol;

    ExtendedOperation(String symbol) {
        this.symbol = symbol;
    }

    @Override
    public String toString() {
        return symbol;
    }
}
```

You can now use your new operations anywhere you could use the basic operations, provided that APIs are written to take the interface type (Operation), not the implementation (BasicOperation). Note that you don’t have to declare the abstract apply method in the enum as you do in a nonextensible enum with instance-specific method implementations (page 162). This is because the abstract method (apply) is a member of the interface (Operation).

> 现在可以在任何可以使用 Operation 的地方使用新 Operation，前提是编写的 API 采用接口类型（Operation），而不是实现（BasicOperation）。注意，不必像在具有特定于实例的方法实现的非可扩展枚举中那样在枚举中声明抽象 apply 方法（第 162 页）。这是因为抽象方法（apply）是接口（Operation）的成员。

**译注：示例如下**

```java
public static void main(String[] args) {
    Operation op = BasicOperation.DIVIDE;
    System.out.println(op.apply(15, 3));
    op=ExtendedOperation.EXP;
    System.out.println(op.apply(2,5));
}
```

Not only is it possible to pass a single instance of an “extension enum” anywhere a “base enum” is expected, but it is possible to pass in an entire extension enum type and use its elements in addition to or instead of those of the base type. For example, here is a version of the test program on page 163 that exercises all of the extended operations defined previously:

> 不仅可以在需要「基枚举」的任何地方传递「扩展枚举」的单个实例，还可以传入整个扩展枚举类型，并在基类型的元素之外使用或替代基类型的元素。例如，这里是 163 页测试程序的一个版本，它执行了前面定义的所有扩展操作：

```java
public static void main(String[] args) {
    double x = Double.parseDouble(args[0]);
    double y = Double.parseDouble(args[1]);
    test(ExtendedOperation.class, x, y);
}

private static <T extends Enum<T> & Operation> void test(Class<T> opEnumType, double x, double y) {
    for (Operation op : opEnumType.getEnumConstants())
        System.out.printf("%f %s %f = %f%n",x, op, y, op.apply(x, y));
}
```

Note that the class literal for the extended operation type (ExtendedOperation.class) is passed from main to test to describe the set of extended operations. The class literal serves as a bounded type token (Item 33). The admittedly complex declaration for the opEnumType parameter (`<T extends Enum<T> & Operation> Class<T>`) ensures that the Class object represents both an enum and a subtype of Operation, which is exactly what is required to iterate over the elements and perform the operation associated with each one.

> 注意，扩展 Operation 类型（ExtendedOperation.class）的 class 字面量是从 main 传递到 test 的，以描述扩展 Operation 类型的 Set。class 字面量用作有界类型标记（Item-33）。诚然，opEnumType 参数的复杂声明（`<T extends Enum<T> & Operation> Class<T>`）确保类对象同时表示枚举和 Operation 的子类型，而这正是遍历元素并执行与每个元素相关的操作所必需的。

A second alternative is to pass a `Collection<? extends Operation>`, which is a bounded wildcard type (Item 31), instead of passing a class object:

> 第二个选择是传递一个 `Collection<? extends Operation>`，它是一个有界通配符类型（Item-31），而不是传递一个类对象：

```java
public static void main(String[] args) {
    double x = Double.parseDouble(args[0]);
    double y = Double.parseDouble(args[1]);
    test(Arrays.asList(ExtendedOperation.values()), x, y);
}

private static void test(Collection<? extends Operation> opSet,double x, double y) {
    for (Operation op : opSet)
        System.out.printf("%f %s %f = %f%n",x, op, y, op.apply(x, y));
}
```

The resulting code is a bit less complex, and the test method is a bit more flexible: it allows the caller to combine operations from multiple implementation types. On the other hand, you forgo the ability to use EnumSet (Item 36) and EnumMap (Item 37) on the specified operations.

> 生成的代码稍微不那么复杂，test 方法稍微灵活一些：它允许调用者组合来自多个实现类型的操作。另一方面，放弃了在指定操作上使用 EnumSet（Item-36）和 EnumMap（Item-37）的能力。

Both programs shown previously will produce this output when run with command line arguments 4 and 2:

> 在运行命令行参数 4 和 2 时，前面显示的两个程序都将产生这个输出：

```java
4.000000 ^ 2.000000 = 16.000000
4.000000 % 2.000000 = 0.000000
```

A minor disadvantage of the use of interfaces to emulate extensible enums is that implementations cannot be inherited from one enum type to another. If the implementation code does not rely on any state, it can be placed in the interface, using default implementations (Item 20). In the case of our Operation example, the logic to store and retrieve the symbol associated with an operation must be duplicated in BasicOperation and ExtendedOperation. In this case it doesn’t matter because very little code is duplicated. If there were a larger amount of shared functionality, you could encapsulate it in a helper class or a static helper method to eliminate the code duplication.

> 使用接口来模拟可扩展枚举的一个小缺点是实现不能从一个枚举类型继承到另一个枚举类型。如果实现代码不依赖于任何状态，则可以使用默认实现（Item-20）将其放置在接口中。在我们的 Operation 示例中，存储和检索与操作相关的符号的逻辑必须在 BasicOperation 和 ExtendedOperation 中复制。在这种情况下，这并不重要，因为复制的代码非常少。如果有大量的共享功能，可以将其封装在 helper 类或静态 helper 方法中，以消除代码重复。

The pattern described in this item is used in the Java libraries. For example, the java.nio.file.LinkOption enum type implements the CopyOption and OpenOption interfaces.

> 此项中描述的模式在 Java 库中使用。例如，`java.nio.file.LinkOption` 枚举类型实现 CopyOption 和 OpenOption 接口。

In summary, **while you cannot write an extensible enum type, you can emulate it by writing an interface to accompany a basic enum type that implements the interface.** This allows clients to write their own enums (or other types) that implement the interface. Instances of these types can then be used wherever instances of the basic enum type can be used, assuming APIs are written in terms of the interface.

> 总之，虽然你不能编写可扩展枚举类型，但是你可以通过编写接口来模拟它，以便与实现该接口的基本枚举类型一起使用。这允许客户端编写自己的枚举（或其他类型）来实现接口。假设 API 是根据接口编写的，那么这些类型的实例可以在任何可以使用基本枚举类型的实例的地方使用。

---

## 【39】注解优于命名模式

> Prefer annotations to naming patterns

Historically, it was common to use naming patterns to indicate that some program elements demanded special treatment by a tool or framework. For example, prior to release 4, the JUnit testing framework required its users to designate test methods by beginning their names with the characters test [Beck04]. This technique works, but it has several big disadvantages. First, typographical errors result in silent failures. For example, suppose you accidentally named a test method tsetSafetyOverride instead of testSafetyOverride. JUnit 3 wouldn’t complain, but it wouldn’t execute the test either, leading to a false sense of security.

> 从历史上看，使用命名模式来标明某些程序元素需要工具或框架特殊处理的方式是很常见的。例如，在版本 4 之前，JUnit 测试框架要求其用户通过以字符 test [Beck04] 开头的名称来指定测试方法。这种技术是有效的，但是它有几个很大的缺点。首先，排版错误会导致没有提示的失败。例如，假设你意外地将一个测试方法命名为 tsetSafetyOverride，而不是 testSafetyOverride。JUnit 3 不会报错，但它也不会执行测试，这导致一种正确执行了测试的假象。

A second disadvantage of naming patterns is that there is no way to ensure that they are used only on appropriate program elements. For example, suppose you called a class TestSafetyMechanisms in hopes that JUnit 3 would automatically test all of its methods, regardless of their names. Again, JUnit 3 wouldn’t complain, but it wouldn’t execute the tests either.

> 命名模式的第二个缺点是，无法确保只在相应的程序元素上使用它们。例如，假设你调用了一个类 TestSafetyMechanisms，希望 JUnit 3 能够自动测试它的所有方法，而不管它们的名称是什么。同样，JUnit 3 不会报错，但它也不会执行测试。

A third disadvantage of naming patterns is that they provide no good way to associate parameter values with program elements. For example, suppose you want to support a category of test that succeeds only if it throws a particular exception. The exception type is essentially a parameter of the test. You could encode the exception type name into the test method name using some elaborate naming pattern, but this would be ugly and fragile (Item 62). The compiler would have no way of knowing to check that the string that was supposed to name an exception actually did. If the named class didn’t exist or wasn’t an exception, you wouldn’t find out until you tried to run the test.

> 命名模式的第三个缺点是，它们没有提供将参数值与程序元素关联的好方法。例如，假设你希望支持只有在抛出特定异常时才成功的测试类别。异常类型本质上是测试的一个参数。你可以使用一些精心设计的命名模式，将异常类型名称编码到测试方法名称中，但这样的代码将不好看且脆弱（Item-62）。编译器将无法检查这些用于命名异常的字符串是否确实执行了。如果指定的类不存在或不是异常，则在运行测试之前不会被发现。

Annotations [JLS, 9.7] solve all of these problems nicely, and JUnit adopted them starting with release 4. In this item, we’ll write our own toy testing framework to show how annotations work. Suppose you want to define an annotation type to designate simple tests that are run automatically and fail if they throw an exception. Here’s how such an annotation type, named Test, might look:

> 注解 [JLS, 9.7] 很好地解决了所有这些问题，JUnit 从版本 4 开始就采用了它们。在本条目中，我们将编写自己的示例测试框架来展示注解是如何工作的。假设你希望定义注解类型，以指定自动运行的简单测试，并在抛出异常时失败。下面是这种名为 Test 的注解类型的概貌：

```java
// Marker annotation type declaration
import java.lang.annotation.*;

/**
* Indicates that the annotated method is a test method.
* Use only on parameterless static methods.
*/
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Test {

}
```

The declaration for the Test annotation type is itself annotated with Retention and Target annotations. Such annotations on annotation type declarations are known as meta-annotations. The @Retention(RetentionPolicy.RUNTIME) meta-annotation indicates that Test annotations should be retained at runtime. Without it, Test annotations would be invisible to the test tool. The @Target.get(ElementType.METHOD) meta-annotation indicates that the Test annotation is legal only on method declarations: it cannot be applied to class declarations, field declarations, or other program elements.

> Test 注解类型的声明本身带有 Retention 注解和 Target 注解。这种注解类型声明上的注解称为元注解。`@Retention(RetentionPolicy.RUNTIME)` 元注解表明测试注解应该在运行时保留。没有它，测试工具将无法识别测试注解。`@Target.get(ElementType.METHOD)` 元注解表明测试注解仅对方法声明合法：它不能应用于类声明、字段声明或其他程序元素。

**译注 1：注解的保留策略**

> 保留策略决定了在什么位置丢弃注解。Java 定义了 3 种策略，它们被封装到 `java.lang.annotation.RetentionPolicy` 枚举中。这 3 种策略分别是 SOURCE、CLASS 和 RUNTIME。

- 使用 SOURCE 保留策略的注解，只在源文件中保留，在编译期间会被抛弃。
- 使用 CLASS 保留策略的注解，在编译时被存储到 `.class` 文件中。但是，在运行时不能通过 JVM 得到这些注解。
- 使用 RUNTIME 保留策略的注解，在编译时被存储到 `.class` 文件中，并且在运行时可以通过 JVM 获取这些注解。因此，RUNTIME 保留策略提供了最永久的注解。

**译注 2：ElementType 各常量定义的范围**

- ElementType.TYPE
  - Class, interface (including annotation type), or enum declaration（类、接口、注解、枚举）
- ElementType.FIELD
  - Field declaration (includes enum constants)（字段、枚举常量）
- ElementType.METHOD
  - Method declaration（方法）
- ElementType.PARAMETER
  - Formal parameter declaration（方法参数）
- ElementType.CONSTRUCTOR
  - Constructor declaration（构造）
- ElementType.LOCAL_VARIABLE
  - Local variable declaration（局部变量）
- ElementType.ANNOTATION_TYPE
  - Annotation type declaration（注解）
- ElementType.PACKAGE
  - Package declaration（包）
- ElementType.TYPE_PARAMETER
  - Type parameter declaration（泛型参数）
  - Since: 1.8
- ElementType.TYPE_USE
  - Use of a type（任意类型，获取 class 对象和 import 两种情况除外）
  - Since: 1.8
- ElementType.MODULE
  - Module declaration（[模块](https://docs.oracle.com/javase/9/whatsnew/toc.htm#JSNEW-GUID-C23AFD78-C777-460B-8ACE-58BE5EA681F6)）
  - Since: 9

The comment before the Test annotation declaration says, “Use only on parameterless static methods.” It would be nice if the compiler could enforce this, but it can’t, unless you write an annotation processor to do so. For more on this topic, see the documentation for javax.annotation.processing. In the absence of such an annotation processor, if you put a Test annotation on the declaration of an instance method or on a method with one or more parameters, the test program will still compile, leaving it to the testing tool to deal with the problem at runtime.

> Test 注解声明之前的代码注释是这么描述的:「Use only on parameterless static methods.（只对无参数的静态方法使用）」如果编译器能够强制执行这一点，那就太好了，但是它不能，除非你编写代码注释处理器来执行。有关此主题的更多信息，请参阅 `javax.annotation.processing` 的文档。在没有这样的代码注释处理程序的情况下，如果你将 Test 注解放在实例方法的声明上，或者放在带有一个或多个参数的方法上，测试程序仍然会编译，让测试工具在运行时处理。

Here is how the Test annotation looks in practice. It is called a marker annotation because it has no parameters but simply “marks” the annotated element. If the programmer were to misspell Test or to apply the Test annotation to a program element other than a method declaration, the program wouldn’t compile:

> 下面是 Test 注解实际使用时的样子。它被称为标记注解，因为它没有参数，只是对带注解的元素进行「标记」。如果程序员拼错 Test 或将 Test 注解应用于除方法声明之外的程序元素，程序将无法编译：

```java
// Program containing marker annotations
public class Sample {
    @Test
    public static void m1() { } // Test should pass

    public static void m2() { }

    @Test
    public static void m3() { // Test should fail
        throw new RuntimeException("Boom");
    }

    public static void m4() { }

    @Test
    public void m5() { } // INVALID USE: nonstatic method

    public static void m6() { }

    @Test
    public static void m7() { // Test should fail
        throw new RuntimeException("Crash");
    }

    public static void m8() { }
}
```

The Sample class has seven static methods, four of which are annotated as tests. Two of these, m3 and m7, throw exceptions, and two, m1 and m5, do not. But one of the annotated methods that does not throw an exception, m5, is an instance method, so it is not a valid use of the annotation. In sum, Sample contains four tests: one will pass, two will fail, and one is invalid. The four methods that are not annotated with the Test annotation will be ignored by the testing tool.

> Sample 类有 7 个静态方法，其中 4 个被注解为 Test。其中两个方法 m3 和 m7 抛出异常，另外两个 m1 和 m5 没有抛出异常。但是，不抛出异常的带注解的方法 m5 是一个实例方法，因此它不是注解的有效使用。总之，Sample 包含四个测试：一个通过，两个失败，一个无效。没有使用 Test 注释的四个方法将被测试工具忽略。

The Test annotations have no direct effect on the semantics of the Sample class. They serve only to provide information for use by interested programs. More generally, annotations don’t change the semantics of the annotated code but enable it for special treatment by tools such as this simple test runner:

> Test 注解对 Sample 类的语义没有直接影响。它们仅用于向相关程序提供信息。更普遍的是，注解不会改变被注解代码的语义，而是通过工具（就像如下这个简单的 RunTests 类）对其进行特殊处理：

```java
// Program to process marker annotations
import java.lang.reflect.*;

public class RunTests {
    public static void main(String[] args) throws Exception {
        int tests = 0;
        int passed = 0;
        Class<?> testClass = Class.forName(args[0]);
        for (Method m : testClass.getDeclaredMethods()) {
            if (m.isAnnotationPresent(Test.class)) {
                tests++;
                try {
                    m.invoke(null);
                    passed++;
                } catch (InvocationTargetException wrappedExc) {
                    Throwable exc = wrappedExc.getCause();
                    System.out.println(m + " failed: " + exc);
                } catch (Exception exc) {
                    System.out.println("Invalid @Test: " + m);
                }
        }
    }
    System.out.printf("Passed: %d, Failed: %d%n",passed, tests - passed);
    }
}
```

The test runner tool takes a fully qualified class name on the command line and runs all of the class’s Test-annotated methods reflectively, by calling Method.invoke. The isAnnotationPresent method tells the tool which methods to run. If a test method throws an exception, the reflection facility wraps it in an InvocationTargetException. The tool catches this exception and prints a failure report containing the original exception thrown by the test method, which is extracted from the InvocationTargetException with the getCause method.

> test runner 工具以命令行方式接受一个完全限定的类名，并通过调用 `Method.invoke` 以反射方式运行类的所有带测试注解的方法。isAnnotationPresent 方法告诉工具要运行哪些方法。如果测试方法抛出异常，反射工具将其封装在 InvocationTargetException 中。该工具捕获这个异常并打印一个失败报告，其中包含测试方法抛出的原始异常，该异常是用 getCause 方法从 InvocationTargetException 提取的。

If an attempt to invoke a test method by reflection throws any exception other than InvocationTargetException, it indicates an invalid use of the Test annotation that was not caught at compile time. Such uses include annotation of an instance method, of a method with one or more parameters, or of an inaccessible method. The second catch block in the test runner catches these Test usage errors and prints an appropriate error message. Here is the output that is printed if RunTests is run on Sample:

> 如果通过反射调用测试方法时抛出除 InvocationTargetException 之外的任何异常，则表明在编译时存在未捕获的 Test 注解的无效用法。这些用途包括实例方法的注解、带有一个或多个参数的方法的注解或不可访问方法的注解。测试运行程序中的第二个 catch 块捕获这些 Test 使用错误并打印对应的错误消息。如果在 Sample 上运行 RunTests，输出如下：

```java
public static void Sample.m3() failed: RuntimeException: Boom
Invalid @Test: public void Sample.m5()
public static void Sample.m7() failed: RuntimeException: Crash
Passed: 1, Failed: 3
```

Now let’s add support for tests that succeed only if they throw a particular exception. We’ll need a new annotation type for this:

> 现在让我们添加一个只在抛出特定异常时才成功的测试支持。我们需要一个新的注解类型：

```java
// Annotation type with a parameter
import java.lang.annotation.*;

/**
* Indicates that the annotated method is a test method that
* must throw the designated exception to succeed.
*/
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface ExceptionTest {
    Class<? extends Throwable> value();
}
```

The type of the parameter for this annotation is `Class<? extends Throwable>`. This wildcard type is, admittedly, a mouthful. In English, it means “the Class object for some class that extends Throwable,” and it allows the user of the annotation to specify any exception (or error) type. This usage is an example of a bounded type token (Item 33). Here’s how the annotation looks in practice. Note that class literals are used as the values for the annotation parameter:

> 这个注解的参数类型是 `Class<? extends Throwable>`，这个通配符类型确实很复杂。在英语中，它的意思是「某个扩展自 Throwable 的类的 Class 对象」，它允许注解的用户指定任何异常（或错误）类型。这种用法是有界类型令牌（Item-33）的一个示例。下面是这个注解在实际应用时的样子。注意，类的字面量被用作注解参数的值：

```java
// Program containing annotations with a parameter
public class Sample2 {
    @ExceptionTest(ArithmeticException.class)
    public static void m1() { // Test should pass
        int i = 0;
        i = i / i;
    }

    @ExceptionTest(ArithmeticException.class)
    public static void m2() { // Should fail (wrong exception)
        int[] a = new int[0];
        int i = a[1];
    }

    @ExceptionTest(ArithmeticException.class)
    public static void m3() { } // Should fail (no exception)
}
```

Now let’s modify the test runner tool to process the new annotation. Doing so consists of adding the following code to the main method:

> 现在让我们修改 test runner 工具来处理新的注解。向 main 方法添加以下代码：

```java
if (m.isAnnotationPresent(ExceptionTest.class)) {
    tests++;
    try {
        m.invoke(null);
        System.out.printf("Test %s failed: no exception%n", m);
    } catch (InvocationTargetException wrappedEx) {
        Throwable exc = wrappedEx.getCause();
        Class<? extends Throwable> excType =m.getAnnotation(ExceptionTest.class).value();
        if (excType.isInstance(exc)) {
            passed++;
        } else {
            System.out.printf("Test %s failed: expected %s, got %s%n",m, excType.getName(), exc);
        }
    }
    catch (Exception exc) {
        System.out.println("Invalid @Test: " + m);
    }
}
```

This code is similar to the code we used to process Test annotations, with one exception: this code extracts the value of the annotation parameter and uses it to check if the exception thrown by the test is of the right type. There are no explicit casts, and hence no danger of a ClassCastException. The fact that the test program compiled guarantees that its annotation parameters represent valid exception types, with one caveat: if the annotation parameters were valid at compile time but the class file representing a specified exception type is no longer present at runtime, the test runner will throw TypeNotPresentException.

> 这段代码与我们用来处理 Test 注解的代码类似，只有一个不同：这段代码提取注解参数的值，并使用它来检查测试抛出的异常是否是正确的类型。这里没有显式的强制类型转换，因此没有 ClassCastException 的危险。编译的测试程序保证其注解参数表示有效的异常类型，但有一点需要注意：如果注解参数在编译时有效，但表示指定异常类型的类文件在运行时不再存在，那么测试运行程序将抛出 TypeNotPresentException。

Taking our exception testing example one step further, it is possible to envision a test that passes if it throws any one of several specified exceptions. The annotation mechanism has a facility that makes it easy to support this usage. Suppose we change the parameter type of the ExceptionTest annotation to be an array of Class objects:

> 进一步修改我们的异常测试示例，如果它抛出几个指定异常中的任意一个，那么可以认为测试通过了。注解机制具有一种工具，可以轻松地支持这种用法。假设我们将 ExceptionTest 注解的参数类型更改为一个 Class 对象数组：

```java
// Annotation type with an array parameter
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface ExceptionTest {
    Class<? extends Exception>[] value();
}
```

The syntax for array parameters in annotations is flexible. It is optimized for single-element arrays. All of the previous ExceptionTest annotations are still valid with the new array-parameter version of ExceptionTest and result in single-element arrays. To specify a multiple-element array, surround the elements with curly braces and separate them with commas:

> 注解中数组参数的语法是灵活的。它针对单元素数组进行了优化。前面的 ExceptionTest 注解对于 ExceptionTest 的新数组参数版本仍然有效，并且可以生成单元素数组。要指定一个多元素数组，用花括号包围元素，并用逗号分隔它们：

```java
// Code containing an annotation with an array parameter
@ExceptionTest({ IndexOutOfBoundsException.class,NullPointerException.class })
public static void doublyBad() {
    List<String> list = new ArrayList<>();
    // The spec permits this method to throw either
    // IndexOutOfBoundsException or NullPointerException
    list.addAll(5, null);
}
```

It is reasonably straightforward to modify the test runner tool to process the new version of ExceptionTest. This code replaces the original version:

> 修改测试运行器工具来处理 ExceptionTest 的新版本是相当简单的。这段代码替换了原来的版本：

```java
if (m.isAnnotationPresent(ExceptionTest.class)) {
    tests++;
    try {
        m.invoke(null);
        System.out.printf("Test %s failed: no exception%n", m);
    } catch (Throwable wrappedExc) {
        Throwable exc = wrappedExc.getCause();
        int oldPassed = passed;
        Class<? extends Exception>[] excTypes =m.getAnnotation(ExceptionTest.class).value();
        for (Class<? extends Exception> excType : excTypes) {
            if (excType.isInstance(exc)) {
                passed++;
                break;
            }
        }
        if (passed == oldPassed)
            System.out.printf("Test %s failed: %s %n", m, exc);
    }
}
```

As of Java 8, there is another way to do multivalued annotations. Instead of declaring an annotation type with an array parameter, you can annotate the declaration of an annotation with the @Repeatable meta-annotation, to indicate that the annotation may be applied repeatedly to a single element. This meta-annotation takes a single parameter, which is the class object of a containing annotation type, whose sole parameter is an array of the annotation type [JLS, 9.6.3]. Here’s how the annotation declarations look if we take this approach with our ExceptionTest annotation. Note that the containing annotation type must be annotated with an appropriate retention policy and target, or the declarations won’t compile:

> 在 Java 8 中，还有另一种方法可以执行多值注解。你可以在注解声明上使用 `@Repeatable` 元注解，以表明注解可以重复地应用于单个元素，而不是使用数组参数来声明注解类型。这个元注解只接受一个参数，这个参数是包含注解类型的类对象，它的唯一参数是注解类型的数组 [JLS, 9.6.3]。如果我们对 ExceptionTest 注解采用这种方法，那么注解声明是这样的。注意，包含的注解类型必须使用适当的 Retention 注解和 Target 注解，否则声明将无法编译：

```java
// Repeatable annotation type
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Repeatable(ExceptionTestContainer.class)
public @interface ExceptionTest {
    Class<? extends Exception> value();
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface ExceptionTestContainer {
    ExceptionTest[] value();
}
```

Here’s how our doublyBad test looks with a repeated annotation in place of an array-valued annotation:

> 下面是使用重复注解代替数组值注解的 doublyBad 测试：

```java
// Code containing a repeated annotation
@ExceptionTest(IndexOutOfBoundsException.class)
@ExceptionTest(NullPointerException.class)
public static void doublyBad() { ... }
```

Processing repeatable annotations requires care. A repeated annotation generates a synthetic annotation of the containing annotation type. The getAnnotationsByType method glosses over this fact, and can be used to access both repeated and non-repeated annotations of a repeatable annotation type. But isAnnotationPresent makes it explicit that repeated annotations are not of the annotation type, but of the containing annotation type. If an element has a repeated annotation of some type and you use the isAnnotationPresent method to check if the element has an annotation of that type, you’ll find that it does not. Using this method to check for the presence of an annotation type will therefore cause your program to silently ignore repeated annotations. Similarly, using this method to check for the containing annotation type will cause the program to silently ignore non-repeated annotations. To detect repeated and non-repeated annotations with isAnnotationPresent, you much check for both the annotation type and its containing annotation type. Here’s how the relevant part of our RunTests program looks when modified to use the repeatable version of the ExceptionTest annotation:

> 处理可重复注解需要小心。「重复状态」会生成名为「容器注解类型」的合成注解。getAnnotationsByType 方法可忽略这一区别，它可以用于访问可重复注解类型的「重复状态」和「非重复状态」。但是 isAnnotationPresent 明确指出，「重复状态」的情况不属于注解类型，而是「容器注解类型」。如果一个元素是某种类型的「重复状态」注解，并且你使用 isAnnotationPresent 方法检查该元素是否具有该类型的注解，你将发现它提示不存在。因此，使用此方法检查注解类型的存在与否，将导致你的程序忽略「重复状态」。类似地，使用此方法检查「容器注解类型」将导致程序忽略「非重复状态」。要使用 isAnnotationPresent 检测「重复状态」和「非重复状态」，需要同时检查注解类型及其「容器注解类型」。下面是我们的 RunTests 程序的相关部分修改为使用 ExceptionTest 注解的可重复版本时的样子：

```java
// Processing repeatable annotations
if (m.isAnnotationPresent(ExceptionTest.class)|| m.isAnnotationPresent(ExceptionTestContainer.class)) {
    tests++;
    try {
        m.invoke(null);
        System.out.printf("Test %s failed: no exception%n", m);
    } catch (Throwable wrappedExc) {
        Throwable exc = wrappedExc.getCause();
        int oldPassed = passed;
        ExceptionTest[] excTests =m.getAnnotationsByType(ExceptionTest.class);
        for (ExceptionTest excTest : excTests) {
            if (excTest.value().isInstance(exc)) {
                passed++;
                break;
            }
        }
        if (passed == oldPassed)
            System.out.printf("Test %s failed: %s %n", m, exc);
    }
}
```

**译注：比较原文中提及的 getAnnotationsByType 与 isAnnotationPresent 在可重复注解的「重复状态」和「非重复状态」下的使用差别：**

**原 doublyBad 方法不变，属于「重复状态」（重复注解大于等于两个的，都属于「重复状态」）；新增一个 doublyBad2 方法，仅使用一个重复注解，属于「非重复状态」**

```java
class Simple4 {
    // Code containing a repeated annotation
    @ExceptionTest(IndexOutOfBoundsException.class)
    @ExceptionTest(NullPointerException.class)
    public static void doublyBad() {
    }

    @ExceptionTest(ArithmeticException.class)
    public static void doublyBad2() {
    }
}
```

**测试代码**

```java
public static void main(String[] args) throws NoSuchMethodException {
    Class<?> testClass = Simple4.class;
    for (int count = 1; count <= 2; count++) {
        Method m = testClass.getMethod(count == 1 ? "doublyBad" : "doublyBad" + count);
        System.out.println(m.getName() + "「重复状态」：" + m.isAnnotationPresent(ExceptionTest.class));
        System.out.println(m.getName() + "「容器注解类型」：" + m.isAnnotationPresent(ExceptionTestContainer.class));
        System.out.println(m.getName() + "「非重复状态」：" + m.isAnnotationPresent(ExceptionTest.class));
        System.out.println(m.getName() + "「重复状态」：" + m.getAnnotationsByType(ExceptionTest.class));
        System.out.println(m.getName() + "「容器注解类型」：" + m.getAnnotationsByType(ExceptionTestContainer.class));
        System.out.println(m.getName() + "「非重复状态」：" + m.getAnnotationsByType(ExceptionTest.class));
    }
}
```

**结果**

```java
doublyBad「重复状态」：false
doublyBad「容器注解类型」：true
doublyBad「非重复状态」：false
doublyBad「重复状态」：[LItem_39.ExceptionTest;@1593948d
doublyBad「容器注解类型」：[LItem_39.ExceptionTestContainer;@1b604f19
doublyBad「非重复状态」：[LItem_39.ExceptionTest;@7823a2f9

doublyBad2「重复状态」：true
doublyBad2「容器注解类型」：false
doublyBad2「非重复状态」：true
doublyBad2「重复状态」：[LItem_39.ExceptionTest;@cb5822
doublyBad2「容器注解类型」：[LItem_39.ExceptionTestContainer;@4b9e13df
doublyBad2「非重复状态」：[LItem_39.ExceptionTest;@2b98378d
```

Repeatable annotations were added to improve the readability of source code that logically applies multiple instances of the same annotation type to a given program element. If you feel they enhance the readability of your source code, use them, but remember that there is more boilerplate in declaring and processing repeatable annotations, and that processing repeatable annotations is error-prone.

> 添加可重复注解是为了提高源代码的可读性，源代码在逻辑上将同一注解类型的多个实例应用于给定的程序元素。如果你觉得它们增强了源代码的可读性，那么就使用它们，但是请记住，在声明和处理可重复注解方面有更多的样板，并且处理可重复注解很容易出错。

The testing framework in this item is just a toy, but it clearly demonstrates the superiority of annotations over naming patterns, and it only scratches the surface of what you can do with them. If you write a tool that requires programmers to add information to source code, define appropriate annotation types. **There is simply no reason to use naming patterns when you can use annotations instead.**

> 本条目中的测试框架只是一个示例，但是它清楚地展示了注解相对于命名模式的优势，并且它只涉及到你可以使用它们做什么。如果你编写的工具要求程序员向源代码中添加信息，请定义适当的注解类型。**如果可以使用注解，那么就没有理由使用命名模式。**

That said, with the exception of toolsmiths, most programmers will have no need to define annotation types. But **all programmers should use the predefined annotation types that Java provides** (Items 40, 27). Also, consider using the annotations provided by your IDE or static analysis tools. Such annotations can improve the quality of the diagnostic information provided by these tools. Note, however, that these annotations have yet to be standardized, so you may have some work to do if you switch tools or if a standard emerges.

> 也就是说，除了 toolsmiths 之外，大多数程序员不需要定义注解类型。但是所有程序员都应该使用 Java 提供的预定义注解类型（Item-40 和 Item-27）。另外，考虑使用 IDE 或静态分析工具提供的注解。这些注解可以提高这些工具提供的诊断信息的质量。但是，请注意，这些注解还没有标准化，因此，如果你切换了工具或出现了标准，那么你可能需要做一些工作。

---

## 【40】坚持使用 @Override 注解

> Consistently use the Override annotation

The Java libraries contain several annotation types. For the typical programmer, the most important of these is @Override. This annotation can be used only on method declarations, and it indicates that the annotated method declaration overrides a declaration in a supertype. If you consistently use this annotation, it will protect you from a large class of nefarious bugs. Consider this program, in which the class Bigram represents a bigram, or ordered pair of letters:

> Java 库包含几种注解类型。对于大多数的程序员来说，其中最重要的是 `@Override`。此注解只能在方法声明上使用，带有该注解的方法声明将覆盖超类型中的声明。如果你坚持使用这个注解，它将帮助你减少受到有害错误的影响。考虑这个程序，其中类 Bigram 表示一个二元语法，或有序的字母对：

```java
// Can you spot the bug?
public class Bigram {
    private final char first;
    private final char second;

    public Bigram(char first, char second) {
        this.first = first;
        this.second = second;
    }

    public boolean equals(Bigram b) {
        return b.first == first && b.second == second;
    }

    public int hashCode() {
        return 31 * first + second;
    }

    public static void main(String[] args) {
        Set<Bigram> s = new HashSet<>();

        for (int i = 0; i < 10; i++)
            for (char ch = 'a'; ch <= 'z'; ch++)
                s.add(new Bigram(ch, ch));

        System.out.println(s.size());
    }
}
```

The main program repeatedly adds twenty-six bigrams, each consisting of two identical lowercase letters, to a set. Then it prints the size of the set. You might expect the program to print 26, as sets cannot contain duplicates. If you try running the program, you’ll find that it prints not 26 but 260. What is wrong with it?

> 主程序重复地向一个集合中添加 26 个 bigram，每个 bigram 由两个相同的小写字母组成。然后它打印该集合的大小。如果你尝试运行该程序，你会发现它打印的不是 26 而是 260。有什么问题吗？

Clearly, the author of the Bigram class intended to override the equals method (Item 10) and even remembered to override hashCode in tandem (Item 11). Unfortunately, our hapless programmer failed to override equals, overloading it instead (Item 52). To override Object.equals, you must define an equals method whose parameter is of type Object, but the parameter of Bigram’s equals method is not of type Object, so Bigram inherits the equals method from Object. This equals method tests for object identity, just like the == operator. Each of the ten copies of each bigram is distinct from the other nine, so they are deemed unequal by Object.equals, which explains why the program prints 260.

> 显然，Bigram 类的作者打算覆盖 equals 方法（Item-10），甚至还记得要一并覆盖 hashCode（Item-11）。不幸的是，我们的程序员没有覆盖 equals，而是重载了它（Item-52）。要覆盖 `Object.equals`，你必须定义一个 equals 方法，它的参数是 Object 类型的，但是 Bigram 的 equals 方法的参数不是 Object 类型的，所以 Bigram 从 Object 继承 equals 方法。这个继承来的 equals 方法只能检测对象同一性，就像 == 操作符一样。每 10 个 bigram 副本为一组，每组中的每个 bigram 副本都不同于其他 9 个，因此 `Object.equals` 认为它们不相等，这就解释了为什么程序最终打印 260。

Luckily, the compiler can help you find this error, but only if you help it by telling it that you intend to override Object.equals. To do this, annotate Bigram.equals with @Override, as shown here:

> 幸运的是，编译器可以帮助你找到这个错误，但前提是你告诉它你打算覆盖 `Object.equals`。为此，请使用 `@Override` 注解标记 `Bigram.equals`，如下所示：

```java
@Override
public boolean equals(Bigram b) {
    return b.first == first && b.second == second;
}
```

If you insert this annotation and try to recompile the program, the compiler will generate an error message like this:

> 如果你插入此注解并尝试重新编译程序，编译器将生成如下错误消息：

```java
Bigram.java:10: method does not override or implement a method from a supertype
@Override public boolean equals(Bigram b) {
^
```

You will immediately realize what you did wrong, slap yourself on the forehead, and replace the broken equals implementation with a correct one (Item 10):

> 你会立刻意识到自己做错了什么，拍拍自己的额头，用正确的方式替换不正确的 equals 实现（Item-10）：

```java
@Override
public boolean equals(Object o) {
    if (!(o instanceof Bigram))
        return false;
    Bigram b = (Bigram) o;
    return b.first == first && b.second == second;
}
```

Therefore, you should **use the Override annotation on every method declaration that you believe to override a superclass declaration.** There is one minor exception to this rule. If you are writing a class that is not labeled abstract and you believe that it overrides an abstract method in its superclass, you needn’t bother putting the Override annotation on that method. In a class that is not declared abstract, the compiler will emit an error message if you fail to override an abstract superclass method. However, you might wish to draw attention to all of the methods in your class that override superclass methods, in which case you should feel free to annotate these methods too. Most IDEs can be set to insert Override annotations automatically when you elect to override a method.

> 因此，你应该在 **要覆盖超类声明的每个方法声明上使用 @Override 注解。** 这条规则有一个小小的例外。如果你正在编写一个没有标记为 abstract 的类，并且你认为它覆盖了其超类中的抽象方法，那么你不必费心在这些方法上添加 `@Override` 注解。在未声明为抽象的类中，如果未能覆盖抽象超类方法，编译器将发出错误消息。但是，你可能希望让类中覆盖超类方法的所有方法更加引人注目，在这种情况下，你也可以自由选择是否注解这些方法。大多数 IDE 都可以设置为在选择覆盖方法时自动插入覆盖注解。

Most IDEs provide another reason to use the Override annotation consistently. If you enable the appropriate check, the IDE will generate a warning if you have a method that doesn’t have an Override annotation but does override a superclass method. If you use the Override annotation consistently, these warnings will alert you to unintentional overriding. They complement the compiler’s error messages, which alert you to unintentional failure to override. Between the IDE and the compiler, you can be sure that you’re overriding methods everywhere you want to and nowhere else.

> 大多数 IDE 都提供了一致使用 `@Override` 注解的另一个原因。如果启用适当的检查，如果你的方法没有 `@Override` 注解，但确实覆盖了超类方法，IDE 将生成警告。如果你一致地使用 `@Override` 注解，这些警告将提醒你防止意外覆盖。它们补充编译器的错误消息，这些错误消息会警告你无意的覆盖错误。在 IDE 和编译器的帮助下，你可以确保在任何你想要实施覆盖的地方都覆盖了，而没有遗漏。

The Override annotation may be used on method declarations that override declarations from interfaces as well as classes. With the advent of default methods, it is good practice to use Override on concrete implementations of interface methods to ensure that the signature is correct. If you know that an interface does not have default methods, you may choose to omit Override annotations on concrete implementations of interface methods to reduce clutter.

> `@Override` 注解可用于覆盖接口和类声明的方法声明。随着默认方法的出现，最好对接口方法的具体实现使用 `@Override` 来确保签名是正确的。如果你知道接口没有默认方法，你可以选择忽略接口方法的具体实现上的 `@Override` 注解，以减少混乱。

In an abstract class or an interface, however, it is worth annotating all methods that you believe to override superclass or superinterface methods, whether concrete or abstract. For example, the Set interface adds no new methods to the Collection interface, so it should include Override annotations on all of its method declarations to ensure that it does not accidentally add any new methods to the Collection interface.

> 然而，在抽象类或接口中，标记覆盖超类或超接口方法的所有方法是值得的，无论是具体的还是抽象的。例如，Set 接口不会向 Collection 接口添加任何新方法，因此它的所有方法声明的应该包含 `@Override` 注解，以确保它不会意外地向 Collection 接口添加任何新方法。

In summary, the compiler can protect you from a great many errors if you use the Override annotation on every method declaration that you believe to override a supertype declaration, with one exception. In concrete classes, you need not annotate methods that you believe to override abstract method declarations (though it is not harmful to do so).

> 总之，如果你在每个方法声明上都使用 `@Override` 注解来覆盖超类型声明（只有一个例外），那么编译器可以帮助你减少受到有害错误的影响。在具体类中，可以不对覆盖抽象方法声明的方法使用该注解（即使这么做也并不会有害）。

---

## 【41】使用标记接口定义类型

> Use marker interfaces to define types

A marker interface is an interface that contains no method declarations but merely designates (or “marks”) a class that implements the interface as having some property. For example, consider the Serializable interface (Chapter 12). By implementing this interface, a class indicates that its instances can be written to an ObjectOutputStream (or “serialized”).

> 标记接口是一种不包含任何方法声明的接口，它只是指定（或「标记」）一个类，该类实现了具有某些属性的接口。例如，考虑 Serializable 接口（Chapter 12）。通过实现此接口，表示类的实例可以写入 ObjectOutputStream（或「序列化」）。

You may hear it said that marker annotations (Item 39) make marker interfaces obsolete. This assertion is incorrect. Marker interfaces have two advantages over marker annotations. First and foremost, **marker interfaces define a type that is implemented by instances of the marked class; marker annotations do not.** The existence of a marker interface type allows you to catch errors at compile time that you couldn’t catch until runtime if you used a marker annotation.

> 你可能听过一个说法：标记接口已经过时，更好的方式是标记注解（Item-39）。这个言论是错误的。与标记注解相比，标记接口有两个优点。首先，**标记接口定义的类型由标记类的实例实现；标记注解不会。** 标记接口类型的存在允许你在编译时捕获错误，如果你使用标记注解，则在运行时才能捕获这些错误。

Java’s serialization facility (Chapter 6) uses the Serializable marker interface to indicate that a type is serializable. The ObjectOutputStream.writeObject method, which serializes the object that is passed to it, requires that its argument be serializable. Had the argument of this method been of type Serializable, an attempt to serialize an inappropriate object would have been detected at compile time (by type checking). Compile-time error detection is the intent of marker interfaces, but unfortunately, the ObjectOutputStream.write API does not take advantage of the Serializable interface: its argument is declared to be of type Object, so attempts to serialize an unserializable object won’t fail until runtime.

> Java 的序列化工具（Chapter 6）使用 Serializable 标记接口来表明一个类是可序列化的。`ObjectOutputStream.writeObject` 方法序列化传递给它的对象，它要求其参数是可序列化的。假设该方法的参数类型是 Serializable，那么在编译时（通过类型检查）就会检测到对不合适的对象进行序列化的错误。编译时错误检测是使用标记接口的目的，但不幸的是，`ObjectOutputStream.writeObject` 没有利用 Serializable 接口：它的参数被声明为 Object 类型，因此，如果尝试序列化一个不可序列化对象，直到运行时才会提示失败。

**译注 1：原文 `ObjectOutputStream.write` 有误，该方法的每种重载仅支持 int 类型和 byte[]，应修改为 `ObjectOutputStream.writeObject`，其源码如下：**

```java
public final void writeObject(Object obj) throws IOException {
    if (enableOverride) {
        writeObjectOverride(obj);
        return;
    }
    try {
        writeObject0(obj, false);
    } catch (IOException ex) {
        if (depth == 0) {
            writeFatalException(ex);
        }
        throw ex;
    }
}
```

**译注 2：使用 ObjectOutputStream.writeObject 的例子**

```java
public class BaseClass implements Serializable {
    private final int id;
    private final String name;

    public BaseClass(int id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public String toString() {
        return "id=" + id + ", name='" + name + '\'';
    }
}

public class Main {
    private void Out() throws IOException {
        BaseClass obj = new BaseClass(1, "Mark");
        try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(new File("out.txt")))) {
            out.writeObject(obj);
        }
    }

    private void In() throws IOException, ClassNotFoundException {
        try (ObjectInputStream in = new ObjectInputStream(new FileInputStream(new File("out.txt")))) {
            BaseClass obj = (BaseClass) in.readObject();
            System.out.println(obj);
        }
    }
}
```

**Another advantage of marker interfaces over marker annotations is that they can be targeted more precisely.** If an annotation type is declared with target ElementType.TYPE, it can be applied to any class or interface. Suppose you have a marker that is applicable only to implementations of a particular interface. If you define it as a marker interface, you can have it extend the sole interface to which it is applicable, guaranteeing that all marked types are also subtypes of the sole interface to which it is applicable.

> **标记接口相对于标记注解的另一个优点是可以更精确地定位它们。** 如果注解类型使用 `@Target(ElementType.TYPE)` 声明，它可以应用于任何类或接口。假设你有一个只适用于特定接口来实现的标记。如果将其定义为标记接口，则可以让它扩展其适用的惟一接口，确保所有标记的类型也是其适用的惟一接口的子类型。

Arguably, the Set interface is just such a restricted marker interface. It is applicable only to Collection subtypes, but it adds no methods beyond those defined by Collection. It is not generally considered to be a marker interface because it refines the contracts of several Collection methods, including add, equals, and hashCode. But it is easy to imagine a marker interface that is applicable only to subtypes of some particular interface and does not refine the contracts of any of the interface’s methods. Such a marker interface might describe some invariant of the entire object or indicate that instances are eligible for processing by a method of some other class (in the way that the Serializable interface indicates that instances are eligible for processing by ObjectOutputStream).

> 可以说，Set 接口就是这样一个受限的标记接口。它只适用于 Collection 的子类，但是除了 Collection 定义的方法之外，它不添加任何方法。它通常不被认为是一个标记接口，因为它细化了几个 Collection 方法的约定，包括 add、equals 和 hashCode。但是很容易想象一个标记接口只适用于某些特定接口的子类，而不细化任何接口方法的约定。这样的标记接口可能描述整个对象的某个不变量，或者表明实例能够利用其他类的方法进行处理（就像 Serializable 接口能够利用 ObjectOutputStream 进行处理一样）。

**The chief advantage of marker annotations over marker interfaces is that they are part of the larger annotation facility.** Therefore, marker annotations allow for consistency in annotation-based frameworks.

> **相对于标记接口，标记注解的主要优势是它们可以是其他注解功能的一部分。** 因此，标记注解能够与基于使用注解的框架保持一致性。

So when should you use a marker annotation and when should you use a marker interface? Clearly you must use an annotation if the marker applies to any program element other than a class or interface, because only classes and interfaces can be made to implement or extend an interface. If the marker applies only to classes and interfaces, ask yourself the question “Might I want to write one or more methods that accept only objects that have this marking?” If so, you should use a marker interface in preference to an annotation. This will make it possible for you to use the interface as a parameter type for the methods in question, which will result in the benefit of compile-time type checking. If you can convince yourself that you’ll never want to write a method that accepts only objects with the marking, then you’re probably better off using a marker annotation. If, additionally, the marking is part of a framework that makes heavy use of annotations, then a marker annotation is the clear choice.

> 那么什么时候应该使用标记注解，什么时候应该使用标记接口呢？显然，如果标记应用于类或接口之外的任何程序元素，则必须使用标记注解，因为只有类和接口才能实现或扩展接口。如果标记只适用于类和接口，那么可以问自己这样一个问题：「我是否可以编写一个或多个方法，只接受具有这种标记的对象？」如果是这样，你应该使用标记接口而不是标记注解。这将使你能够将接口用作相关方法的参数类型，这将带来编译时类型检查的好处。如果你确信自己永远不会编写只接受带有标记的对象的方法，那么最好使用标记注解。此外，如果框架大量使用注解，那么标记注解就是明确的选择。

In summary, marker interfaces and marker annotations both have their uses. If you want to define a type that does not have any new methods associated with it, a marker interface is the way to go. If you want to mark program elements other than classes and interfaces or to fit the marker into a framework that already makes heavy use of annotation types, then a marker annotation is the correct choice. **If you find yourself writing a marker annotation type whose target is ElementType.TYPE, take the time to figure out whether it really should be an annotation type or whether a marker interface would be more appropriate.**

> 总之，标记接口和标记注解都有各自的用途。如果你想要定义一个没有与之关联的新方法的类型，可以使用标记接口。如果你希望标记类和接口之外的程序元素，或者将标记符放入已经大量使用注解类型的框架中，那么标记注解就是正确的选择。如果你发现自己编写的标记注解类型有 `@Target(ElementType.TYPE)` 声明（**译注：意在说明既可以用标记注解，也可以用标记接口的情况**），那么请花时间弄清楚究竟应该用注解类型，还是标记接口更合适。

In a sense, this item is the inverse of Item 22, which says, “If you don’t want to define a type, don’t use an interface.” To a first approximation, this item says, “If you do want to define a type, do use an interface.”

> 从某种意义上说，本条目与 Item-22 的说法相反，也就是说，「如果不想定义类型，就不要使用接口。」，与本条目应用场景适应的说法是，「如果你确实想定义类型，那么就要使用接口。」
